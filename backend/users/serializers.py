"""Users app serializers."""

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Augment JWT payload with user role and display name."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["full_name"] = user.get_full_name() or user.username
        token["is_verified"] = user.is_verified
        return token


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for new user registration."""

    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "role", "phone", "location", "password", "password_confirm",
        ]
        extra_kwargs = {
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Read/update own profile."""

    full_name = serializers.SerializerMethodField()
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id", "username", "email", "first_name", "last_name", "full_name",
            "role", "role_display", "phone", "location", "bio", "avatar",
            "is_verified", "ecocash_number", "created_at",
        ]
        read_only_fields = ["id", "username", "role", "is_verified", "created_at"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class UserPublicSerializer(serializers.ModelSerializer):
    """Public-facing minimal user info."""

    full_name = serializers.SerializerMethodField()
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "full_name", "role_display", "location", "avatar", "is_verified"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
