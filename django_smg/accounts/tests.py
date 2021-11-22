from django.contrib.auth.models import User
from django import test
from rest_framework import status

from gallery.tests.base_case import GalleryTestCase


class TestLoginApi(GalleryTestCase):
    """
    An authenticated request to the login view with a valid token should
    provide a fresh response just as if the user logged in with a post
    request. It should also rotate the token, deleting the token sent
    and sending a new token back to the user.
    """

    def setUp(self):
        super().setUp()
        # define an email_client who will login via email
        self.email_client_username = "testusername"
        self.email_client_email = "test@test.com"
        self.email_client_password = "testuserpassword"
        self.email_client = User.objects.create_user(
            username=self.email_client_username,
            email=self.email_client_email,
            password=self.email_client_password,
        )
        self.email_client = test.Client()

    def test_user_can_login_with_email(self):
        res = self.email_client.post(
            "/api/auth/login/",
            data={
                "username": self.email_client_email,
                "password": self.email_client_password,
            },
            content_type="application/json",
            secure=True,
        )
        self.assertTrue(status.is_success(res.status_code))  # type: ignore
        self.assertIn("token", res.data)  # type: ignore

    def test_login_view_accepts_authenticated_get_request(self):
        self._login_client()
        res = self.client.get(
            "/api/auth/login/", HTTP_AUTHORIZATION=f"Token {self.token}", secure=True
        )
        self.assertTrue(status.is_success(res.status_code))
        self.assertIn("token", res.json())

    def test_login_view_rejects_unauthenticated_get_request(self):
        res = self.client.get(
            "/api/auth/login/",
            secure=True,
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_token_was_rotated_after_get_request(self):
        self._login_client()
        res = self.client.get(
            "/api/auth/login/", HTTP_AUTHORIZATION=f"Token {self.token}", secure=True
        )
        new_token = res.json().get("token")
        res = self.client.get("/api/gallery/", secure=True)

        # old token fails
        self.assertFalse(status.is_success(res.status_code))
        res = self.client.get(
            "/api/gallery/", HTTP_AUTHORIZATION=f"Token {new_token}", secure=True
        )

        # new token succeeds
        self.assertTrue(status.is_success(res.status_code))
