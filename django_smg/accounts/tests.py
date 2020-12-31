from rest_framework import status

from gallery.tests.base_case import GalleryTestCase

# Create your tests here.

class TestLoginApi(GalleryTestCase):
    """
    An authenticated request to the login view with a valid token should
    provide a fresh response just as if the user logged in with a post
    request. It should also rotate the token, deleting the token sent
    and sending a new token back to the user.
    """


    def test_login_view_accepts_authenticated_get_request(self):
        self._login_client()
        res = self.client.get(
            '/api/auth/login/',
            HTTP_AUTHORIZATION=f'Token {self.token}'
        )
        self.assertTrue(status.is_success(res.status_code))
        self.assertIn('token', res.json())

    def test_login_view_rejects_unauthenticated_get_request(self):
        res = self.client.get(
            '/api/auth/login/',
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_token_was_rotated_after_get_request(self):
        self._login_client()
        res = self.client.get(
            '/api/auth/login/',
            HTTP_AUTHORIZATION=f'Token {self.token}'
        )
        new_token = res.json().get('token')
        res = self.client.get('/api/gallery/')

        # old token fails
        self.assertFalse(status.is_success(res.status_code))
        res = self.client.get(
            '/api/gallery/',
            HTTP_AUTHORIZATION=f'Token {new_token}'
        )

        # new token succeeds
        self.assertTrue(status.is_success(res.status_code))
