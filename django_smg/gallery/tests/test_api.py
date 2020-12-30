
from django.urls import reverse

from .util import are_rendered_groups_same
from .base_case import GalleryTestCase



class TestAuthGalleryViewset(GalleryTestCase):

    def setUp(self):
        super().setUp()
        self._login_client()
        url = reverse('auth_gallery')
        self.response = self.client.get(
            url,
            HTTP_AUTHORIZATION=f'Token {self.token}',
        )


    def test_response_status(self):
        self.assertIn(self.response.status_code, range(200, 300)) # type: ignore

    def test_response_content(self):
        self.assertEqual(
            self.response.json()[0]['title'],  # type: ignore
            self.mock_api_data['title']
        )
        self.assertEqual(
            self.response.json()[0]['description'],  # type: ignore
            self.mock_api_data['description']
        )

class TestPublicGalleryViewset(GalleryTestCase):

    def test_get_request(self):
        url = reverse('public_gallery', kwargs={
            'slug': 'test-title'
        })
        response = self.client.get(url)
        self.assertTrue(are_rendered_groups_same(
            response.json(),  # type: ignore
            self.expected_rendered_data,
        ))

