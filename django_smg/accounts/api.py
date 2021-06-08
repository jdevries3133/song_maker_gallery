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

logger = logging.getLogger(__name__)


class RegisterAPI(GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            userData = UserSerializer(
                user, context=self.get_serializer_context()).data
            token = AuthToken.objects.create(user)[1]

            logger.debug(userData)
            logger.debug(token)

            return Response({
                'user': userData,
                'token': token,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        # allow user to authenticate with email
        if User.objects.filter(email=request.data['username']):
            request.data['username'] = (
                User.objects.filter(email=request.data['username'])[0].username
            )
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        response = super().post(request, format=None)

        # TODO: move user_id insertion into a serializer
        response.data.setdefault('user_id', user.pk)
        return response

    def get(self, request):
        if request.user.is_authenticated:
            response = super().post(request, format=None)

            # TODO: move user_id insertion into a serializer (same as above)
            response.data.setdefault('user_id', request.user.pk)
            return response
        return Response({
            'message': (
                'Must provide token for rotation or authenticate with '
                'credentials via POST request to this endpoint'
            )},
            status=status.HTTP_403_FORBIDDEN,
        )
