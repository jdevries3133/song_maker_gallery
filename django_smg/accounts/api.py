import logging

from django.contrib.auth.models import User
from django.contrib.auth import login
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework import status
from knox.views import LoginView as KnoxLoginView
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

logger = logging.getLogger('file')

# Register API


class RegisterAPI(GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        userData = UserSerializer(
            user, context=self.get_serializer_context()).data
        token = AuthToken.objects.create(user)[1]

        logging.debug(userData)
        logging.debug(token)

        return Response({
            'user': userData,
            'token': token,
        })


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        
        if User.objects.filter(email=request.data['username']):
            get_username = User.objects.filter(email=request.data['username'])[0].username
            
            request.data['username'] = get_username


        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super().post(request, format=None)

    def get(self, request):
        if request.user.is_authenticated:
            return super().post(request, format=None)
        return Response(
            {
            'message': (
                'Must provide token for rotation or authenticate with '
                'credentials via POST request to this endpoint'
            )
            },
            status=status.HTTP_403_FORBIDDEN,
        )


class UserAPI(RetrieveAPIView):
    permission_classes = (
        permissions.IsAuthenticated,
    )
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
