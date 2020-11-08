from rest_framework.serializers import ModelSerializer, Serializer, CharField, ValidationError
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password'],
        )
        return user

    def validate(self, data):
        """
        Require email
        """
        if not self.initial_data.get('email'):
            raise ValidationError({'message': 'Email is required.'})
        return data


class LoginSerializer(Serializer):
    username = CharField()
    password = CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise ValidationError('Incorrect Credentials')
