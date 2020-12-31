from django.urls import reverse
from rest_framework import status

from ..models import Gallery
from .util import are_rendered_groups_same
from .base_case import GalleryTestCase



class TestAuthGalleryViewset(GalleryTestCase):

    def setUp(self):
        super().setUp()
        self._login_client()

    def test_response_status(self):
        response = self.client.get(
            reverse('auth_gallery'),
            HTTP_AUTHORIZATION=f'Token {self.token}',
        )
        self.assertTrue(status.is_success(response.status_code)) # type: ignore

    def test_response_content(self):
        response = self.client.get(
            reverse('auth_gallery'),
            HTTP_AUTHORIZATION=f'Token {self.token}',
        )
        self.assertEqual(
            response.json()[0]['title'],  # type: ignore
            self.mock_api_data['title']
        )
        self.assertEqual(
            response.json()[0]['description'],  # type: ignore
            self.mock_api_data['description']
        )

    def test_delete_gallery_without_pk_returns_400(self):
        res = self.client.delete(
            '/api/gallery/?invalid=this',
            HTTP_AUTHORIZATION=f'Token {self.token}'
        )
        self.assertEqual(
            res.status_code,  # type: ignore
            status.HTTP_400_BAD_REQUEST
        )

    def test_delete_single_gallery(self):
        self.client.delete(
            '/api/gallery/?pk=1',
            HTTP_AUTHORIZATION=f'Token {self.token}'
        )
        with self.assertRaises(Gallery.DoesNotExist):  # type: ignore
            self.gallery.refresh_from_db()

    def test_delete_multiple_galleries(self):
        pks = [str(self._add_gallery().pk) for _ in range(5)]
        qs = ','.join(pks)
        res = self.client.delete(
            f'/api/gallery/?pk={qs}',
            HTTP_AUTHORIZATION=f'Token {self.token}'
        )
        self.assertTrue(status.is_success(res.status_code))  # type: ignore
        with self.assertRaises(Gallery.DoesNotExist):  # type: ignore
            for pk in pks:
                print(Gallery.objects.get(id=int(pk)))  # type: ignore


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
