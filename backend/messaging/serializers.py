"""Messaging serializers."""

from rest_framework import serializers
from .models import Conversation, Message
from users.serializers import UserPublicSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender = UserPublicSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "body", "is_read", "created_at"]
        read_only_fields = ["id", "sender", "is_read", "created_at"]

    def create(self, validated_data):
        validated_data["sender"] = self.context["request"].user
        return super().create(validated_data)


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserPublicSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    project_title = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id", "participants", "project", "project_title",
            "last_message", "unread_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_last_message(self, obj):
        msg = obj.messages.last()
        if not msg:
            return None
        return {"body": msg.body[:80], "sender": msg.sender.username, "created_at": msg.created_at}

    def get_unread_count(self, obj):
        user = self.context["request"].user
        return obj.messages.filter(is_read=False).exclude(sender=user).count()

    def get_project_title(self, obj):
        return obj.project.title if obj.project else None
