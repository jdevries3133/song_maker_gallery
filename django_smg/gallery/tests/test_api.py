import time

from django.urls import reverse
from django.utils.http import urlencode
from rest_framework import status

from ..models import Gallery
from .base_case import GalleryTestCase, patch_fetch_and_cache


class TestAuthGalleryViewset(GalleryTestCase):

    def setUp(self):
        super().setUp()
        self._login_client()
        self.gallery = self.depr_add_gallery()

    def test_response_status(self):
        response = self.client.get(
            reverse('auth_gallery'),
            HTTP_AUTHORIZATION=f'Token {self.token}',
            secure=True
        )
        self.assertTrue(status.is_success(response.status_code)) # type: ignore

    def test_post_request_returns_expected_information(self):
        with self.settings(SKIP_FETCH_AND_CACHE=False):
            res = self.client.post(
                '/api/gallery/',
                data=self.depr_mock_api_data,
                HTTP_AUTHORIZATION=f'Token {self.token}',
                secure=True
            )
        self.assertEqual(
            res.json()['title'],  # type: ignore
            self.depr_mock_api_data['title']
        )
        self.assertEqual(
            res.json()['description'],  # type: ignore
            self.depr_mock_api_data['description'],
        )

    def test_post_request_is_fast(self):
        start = time.perf_counter()
        self.client.post(
            '/api/gallery/',
            data=self.depr_mock_api_data,
            HTTP_AUTHORIZATION=f'Token {self.token}',
            secure=True
        )
        stop = time.perf_counter()
        self.assertLess((start-stop), 0.3)

    def test_delete_gallery_without_pk_returns_400(self):
        res = self.client.delete(
            '/api/gallery/?invalid=this',
            HTTP_AUTHORIZATION=f'Token {self.token}',
            secure=True
        )
        self.assertEqual(
            res.status_code,  # type: ignore
            status.HTTP_400_BAD_REQUEST
        )

    def test_delete_single_gallery(self):
        self.depr_add_gallery()
        self.client.delete(
            f'/api/gallery/?pk={self.gallery.pk}',  # type: ignore
            HTTP_AUTHORIZATION=f'Token {self.token}',
            secure=True
        )
        with self.assertRaises(Gallery.DoesNotExist):  # type: ignore
            self.gallery.refresh_from_db()  # type: ignore

    def test_delete_multiple_galleries(self):
        pks = [str(self.depr_add_gallery().pk) for _ in range(5)]
        qs = ','.join(pks)
        res = self.client.delete(
            f'/api/gallery/?pk={qs}',
            HTTP_AUTHORIZATION=f'Token {self.token}',
            secure=True
        )
        self.assertTrue(status.is_success(res.status_code))  # type: ignore
        with self.assertRaises(Gallery.DoesNotExist):  # type: ignore
            for pk in pks:
                print(Gallery.objects.get(id=int(pk)))  # type: ignore


class TestPublicGalleryViewset(GalleryTestCase):

    @ patch_fetch_and_cache
    def test_get_request(self):
        self.add_gallery()
        url = reverse('public_gallery', kwargs={
            'slug': 'test-title'
        })
        url += '?' + urlencode({'serializer': 'new'})
        response = self.client.get(url, secure=True)
        # TODO: this used to have leniency on midi bytes...
        # need to either make it perfect or restore the leniency
        self.assertEqual(
            response.json(),  # type: ignore
            self.expected_rendered_data,
        )

