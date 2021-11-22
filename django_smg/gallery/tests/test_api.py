from unittest.mock import patch

from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.urls import reverse
from rest_framework import status

from ..models import Gallery, Song
from .base_case import GalleryTestCase, mock_fetch_and_cache, patch_fetch_and_cache
from ..services import mock_data


class SignedInTestCase(GalleryTestCase):
    def setUp(self):
        super().setUp()
        self._login_client()
        self.gallery = self.add_gallery()


class TestAuthGalleryViewset(SignedInTestCase):
    def test_response_status(self):
        response = self.client.get(
            reverse("auth_gallery"),
            HTTP_AUTHORIZATION=f"Token {self.token}",
            secure=True,
        )
        self.assertTrue(status.is_success(response.status_code))

    def test_get(self):
        res = self.client.get(
            "/api/gallery/",
            HTTP_AUTHORIZATION=f"Token {self.token}",
            content_type="application/json",
            secure=True,
        )
        res_data = res.json()[0]
        self.assertEqual(res_data.get("slug"), "test-title")
        self.assertEqual(res_data.get("title"), "Test Title")
        self.assertEqual(res_data.get("description"), "This is the test description.")

    def test_post(self):
        # with self.assertNumQueries(13):
        res = self.client.post(
            "/api/gallery/",
            self.mock_api_data,
            HTTP_AUTHORIZATION=f"Token {self.token}",
            content_type="application/json",
            secure=True,
        )
        self.assertEqual(
            res.json().get("title"), self.mock_api_data["title"]  # type: ignore
        )
        self.assertEqual(
            res.json().get("description"),  # type: ignore
            self.mock_api_data["description"],
        )

    def test_delete_gallery_bad_request(self):
        res = self.client.delete(
            "/api/gallery/?invalid=this",
            HTTP_AUTHORIZATION=f"Token {self.token}",
            secure=True,
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)  # type: ignore

    def test_delete_single_gallery(self):
        self.add_gallery()
        with CaptureQueriesContext(connection) as query_count:
            self.client.delete(
                f"/api/gallery/?pk={self.gallery.pk}",  # type: ignore
                HTTP_AUTHORIZATION=f"Token {self.token}",
                secure=True,
            )
        self.assertLess(query_count.final_queries, 15)
        with self.assertRaises(Gallery.DoesNotExist):  # type: ignore
            self.gallery.refresh_from_db()  # type: ignore

    def test_delete_multiple_galleries(self):
        pks = [str(self.add_gallery().pk) for _ in range(5)]  # type: ignore
        qs = ",".join(pks)
        res = self.client.delete(
            f"/api/gallery/?pk={qs}",
            HTTP_AUTHORIZATION=f"Token {self.token}",
            secure=True,
        )
        self.assertTrue(status.is_success(res.status_code))  # type: ignore
        with self.assertRaises(Gallery.DoesNotExist):  # type: ignore
            for pk in pks:
                Gallery.objects.get(id=int(pk))  # type: ignore


class TestPublicGalleryViewset(GalleryTestCase):
    @patch_fetch_and_cache
    def test_get_request(self):
        self.add_gallery()
        url = reverse("public_gallery", kwargs={"slug": "test-title"})
        data = self.client.get(url, secure=True).json()
        # basic info is same
        self.assertEqual(
            data.get("description"), self.expected_rendered_data.get("description")
        )
        self.assertEqual(data.get("title"), self.expected_rendered_data.get("title"))
        self.assertEqual(data.get("slug"), self.expected_rendered_data.get("slug"))

        # check groups
        for expected_grp, actual_grp in zip(  # type: ignore
            self.expected_rendered_data.get("song_groups"), data.get("song_groups")
        ):
            self.assertEqual(actual_grp["group_name"], expected_grp["group_name"])

            # check songs
            for actual_song, expected_song in zip(
                actual_grp.get("songs"),
                expected_grp.get("songs"),
            ):
                for key in [
                    "bars",
                    "beats",
                    "instrument",
                    "midi",
                    "octaves",
                    "order",
                    "percussion",
                    "percussionNotes",
                    "rootNote",
                    "rootOctave",
                    "rootPitch",
                    "scale",
                    "songId",
                    "student_name",
                    "subdivision",
                    "tempo",
                ]:
                    actual_value, expected_value = (
                        actual_song.get(key),
                        expected_song.get(key),
                    )
                    if actual_value != expected_value:
                        self.fail(
                            f"AssertionError: {actual_value} != {expected_value} "
                            f"for key {key}"
                        )


class TestInstantSongData(GalleryTestCase):
    @patch("gallery.api.fetch_and_cache", side_effect=mock_fetch_and_cache)
    def test_data_returned(self, mocker):
        response = self.client.post(
            reverse("instant_song_data"),
            {"songId": "5676759593254912", "student_name": "Mark Johnson"},
            content_type="application/json",
            secure=True,
        )
        self.assertEqual(
            response.json(),  # type: ignore
            {
                "songId": "5676759593254912",
                "student_name": "Mark J.",
                "order": 0,
                "owner": None,
                "group": None,
                "midi": "",
                **mock_data,
            },
        )


class TestGallerySettings(SignedInTestCase):
    def test_gallery_settings(self):
        def update_attr(attr, value):
            res = self.client.patch(
                reverse("gallery_settings"),
                HTTP_AUTHORIZATION=f"Token {self.token}",
                secure=True,
                content_type="application/json",
                data={"slug": self.gallery.slug, attr: value},
            )
            self.assertTrue(res.status_code == 200)
            self.gallery.refresh_from_db()
            self.assertEqual(getattr(self.gallery, attr), value)

        update_attr("is_editable", True)
        update_attr("is_editable", False)
        update_attr("is_public", True)
        update_attr("is_public", False)

    def test_gallery_settings_requires_authentication(self):
        res = self.client.patch(
            reverse("gallery_settings"),
            secure=True,
            content_type="application/json",
            data={"slug": self.gallery.slug, "is_public": True},
        )
        self.assertEqual(res.status_code, 401)


class TestStudentCreateSong(GalleryTestCase):
    def setUp(self):
        super().setUp()
        self.gallery = self.add_gallery()
        self.gallery.is_editable = True
        self.gallery.save()
        self.group = self.gallery.song_groups.first()

    def test_list_groups(self):
        "User can fetch by pk or slug"
        # TODO: this test is slow
        fetch_by = {"pk": self.gallery.pk, "slug": self.gallery.slug}
        for method, value in fetch_by.items():
            base = reverse("student_create_song")
            url = f"{base}?{method}={value}"
            res = self.client.get(url)
            for result in res.json():
                self.assertEqual(
                    set(result.keys()), set(("pk", "group_name", "songs", "owner"))
                )
            self.assertEqual(res.status_code, 200)
            self.assertEqual(len(res.json()), 2)

    def test_create_song(self):
        # note: the request is made without authentication
        res = self.client.post(
            reverse("student_create_song"),
            {
                "group_pk": self.group.pk,
                "student_name": "Timmy Tamson",
                "songId": "1112223334445555",
            },
        )

        # request was successful
        self.assertEqual(res.status_code, 200)
        # name is shortened via serializer
        self.assertEqual(res.json()["student_name"], "Timmy T.")
        # songId is set
        self.assertEqual(res.json()["songId"], "1112223334445555")
        # ensure db entry was created
        song = Song.objects.get(songId=res.json()["songId"])
        self.assertEqual(song.student_name, "Timmy T.")
