import time
import json

from django.urls import reverse
from django.utils.http import urlencode
from rest_framework import status

from ..models import Gallery
from ..serializers import GallerySerializer
from .base_case import GalleryTestCase, patch_fetch_and_cache


class TestAuthGalleryViewset(GalleryTestCase):

    def setUp(self):
        super().setUp()
        self._login_client()
        self.gallery = self.add_gallery()

    def test_response_status(self):
        response = self.client.get(
            reverse('auth_gallery'),
            HTTP_AUTHORIZATION=f'Token {self.token}',
            secure=True
        )
        self.assertTrue(
            status.is_success(response.status_code)
        )

    def test_get(self):
        res = self.client.get(
            '/api/gallery/',
            HTTP_AUTHORIZATION=f'Token {self.token}',
            content_type="application/json",
            secure=True,
        )
        self.assertEqual(
            res.json(),
            [{'pk': 1, 'slug': 'test-title', 'title': 'Test Title',
              'description': 'This is the test description.'}]
        )

    def test_post(self):
        # TODO: the queries are too damn high!
        with self.assertNumQueries(48):
            res = self.client.post(
                '/api/gallery/',
                self.mock_api_data,
                HTTP_AUTHORIZATION=f'Token {self.token}',
                content_type="application/json",
                secure=True,
            )
        self.assertEqual(
            res.json().get('title'),                            # type: ignore
            self.mock_api_data['title']
        )
        self.assertEqual(
            res.json().get('description'),                      # type: ignore
            self.mock_api_data['description'],
        )

    def test_delete_gallery_bad_request(self):
        res = self.client.delete(
            '/api/gallery/?invalid=this',
            HTTP_AUTHORIZATION=f'Token {self.token}',
            secure=True
        )
        self.assertEqual(
            res.status_code,                                    # type: ignore
            status.HTTP_400_BAD_REQUEST
        )

    def test_delete_single_gallery(self):
        self.add_gallery()
        with self.assertNumQueries(9):
            self.client.delete(
                f'/api/gallery/?pk={self.gallery.pk}',              # type: ignore
                HTTP_AUTHORIZATION=f'Token {self.token}',
                secure=True
            )
        with self.assertRaises(Gallery.DoesNotExist):           # type: ignore
            self.gallery.refresh_from_db()                      # type: ignore

    def test_delete_multiple_galleries(self):
        pks = [str(self.add_gallery().pk) for _ in range(5)]    # type: ignore
        qs = ','.join(pks)
        res = self.client.delete(
            f'/api/gallery/?pk={qs}',
            HTTP_AUTHORIZATION=f'Token {self.token}',
            secure=True
        )
        self.assertTrue(status.is_success(res.status_code))     # type: ignore
        with self.assertRaises(Gallery.DoesNotExist):           # type: ignore
            for pk in pks:
                Gallery.objects.get(id=int(pk))                 # type: ignore


class TestPublicGalleryViewset(GalleryTestCase):

    maxDiff = None

    @ patch_fetch_and_cache
    def test_get_request(self):
        self.add_gallery()
        url = reverse('public_gallery', kwargs={
            'slug': 'test-title'
        })
        url += '?' + urlencode({'serializer': 'new'})
        response = self.client.get(url, secure=True)
        self.assertEqual(
            response.json(),                                    # type: ignore
            self.expected_rendered_data,
        )
