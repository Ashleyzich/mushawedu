from django.urls import path
from .views import ConversationListView, MessageListCreateView, start_conversation, unread_count

urlpatterns = [
    path("",                                  ConversationListView.as_view(),    name="conversation-list"),
    path("start/",                            start_conversation,                name="conversation-start"),
    path("unread/",                           unread_count,                      name="message-unread"),
    path("<int:conversation_id>/messages/",   MessageListCreateView.as_view(),   name="message-list"),
]
