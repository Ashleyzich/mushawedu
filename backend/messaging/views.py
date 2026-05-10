"""Messaging views."""

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer


class ConversationListView(generics.ListAPIView):
    """GET /api/messaging/ — list all conversations for current user."""
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).prefetch_related("participants", "messages")


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def start_conversation(request):
    """POST /api/messaging/start/ — start or retrieve a conversation.
    Body: { recipient_id: int, project_id: int (optional), message: str }
    """
    recipient_id = request.data.get("recipient_id")
    project_id   = request.data.get("project_id")
    body         = request.data.get("message", "").strip()

    if not recipient_id or not body:
        return Response({"error": "recipient_id and message are required."}, status=400)

    from users.models import CustomUser
    try:
        recipient = CustomUser.objects.get(pk=recipient_id)
    except CustomUser.DoesNotExist:
        return Response({"error": "Recipient not found."}, status=404)

    if recipient == request.user:
        return Response({"error": "You cannot message yourself."}, status=400)

    # Find existing conversation between these two users (and same project if given)
    existing = Conversation.objects.filter(
        participants=request.user
    ).filter(
        participants=recipient
    )
    if project_id:
        existing = existing.filter(project_id=project_id)
    else:
        existing = existing.filter(project__isnull=True)

    if existing.exists():
        conversation = existing.first()
    else:
        from projects.models import Project
        project = None
        if project_id:
            try:
                project = Project.objects.get(pk=project_id)
            except Project.DoesNotExist:
                pass
        conversation = Conversation.objects.create(project=project)
        conversation.participants.add(request.user, recipient)

    # Create the first / new message
    Message.objects.create(
        conversation=conversation,
        sender=request.user,
        body=body,
    )
    conversation.save()  # bumps updated_at

    serializer = ConversationSerializer(conversation, context={"request": request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/messaging/<conversation_id>/messages/"""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conv = self._get_conversation()
        # Mark all unread messages from the OTHER user as read
        conv.messages.filter(is_read=False).exclude(
            sender=self.request.user
        ).update(is_read=True)
        return conv.messages.select_related("sender")

    def _get_conversation(self):
        conv = generics.get_object_or_404(
            Conversation,
            pk=self.kwargs["conversation_id"],
            participants=self.request.user,
        )
        return conv

    def perform_create(self, serializer):
        conv = self._get_conversation()
        msg = serializer.save(
            sender=self.request.user,
            conversation=conv,
        )
        conv.save()  # bumps updated_at

        # Send email notification to other participants
        from django.core.mail import send_mail
        from django.conf import settings
        for participant in conv.participants.exclude(pk=self.request.user.pk):
            if participant.email:
                try:
                    send_mail(
                        subject=f"New message from {self.request.user.get_full_name() or self.request.user.username} on Vaka",
                        message=f"You have a new message:\n\n\"{msg.body}\"\n\nLog in to reply: https://vaka.co.zw/messages",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[participant.email],
                        fail_silently=True,
                    )
                except Exception:
                    pass


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def unread_count(request):
    """GET /api/messaging/unread/ — total unread message count for nav badge."""
    count = Message.objects.filter(
        conversation__participants=request.user,
        is_read=False,
    ).exclude(sender=request.user).count()
    return Response({"unread": count})
