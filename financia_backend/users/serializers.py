from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db import IntegrityError

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_username(self, value):
        """
        Check if username is already in use
        """
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with that username already exists."
            )
        return value

    def validate_email(self, value):
        """
        Check if email is already in use
        """
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with that email address already exists."
            )
        return value

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password']
            )
            return user
        except IntegrityError as e:
            # Catch any unexpected database-level integrity errors
            error_messages = {
                'username': 'This username is already taken.',
                'email': 'This email is already registered.'
            }
            
            # Check which field caused the error
            for field in error_messages:
                if field in str(e).lower():
                    raise serializers.ValidationError(
                        {field: [error_messages[field]]}
                    ) from e
            
            # Generic error if we can't determine the specific field
            raise serializers.ValidationError(
                "Account creation failed due to conflicting information"
            ) from e