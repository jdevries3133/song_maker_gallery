import copy
import re
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from teacher_admin.models import Gallery
from .take_screenshots import take_screenshots
from .sc_daemon import mutate_gallery


def TESTING_API_OBJ():
    return copy.deepcopy(
        [
            [
                [
                    "Student 1",
                    "https://musiclab.chromeexperiments.com/Song-Maker/song/4618045650632704",
                    "default placeholder"
                ],
                [
                    "Student 2",
                    "invalid link",
                    "default placeholder"
                ],
                "Group Name",
            ]
        ])


class TestTakeScreenshots(TestCase):
    def setUp(self):
        self.array = take_screenshots(TESTING_API_OBJ())

    def tearDown(self):
        default_storage.delete(self.get_gallery_path())

    def get_gallery_path(self):
        reg = re.compile(
            r'https://song-maker-gallery.s3.amazonaws.com/(screenshots/(\d){4}-(\d){1,2}-(\d){1,2}/(.*).jpg)'
        )
        url = self.array[0][0][2]
        self.assertFalse("month" in url)
        mo = re.search(reg, url)
        if mo:
            return mo[1]
        else:
            raise Exception('path not found in URL: ' + url)

    def test_student_2_is_deleted(self):
        self.assertEqual(len(self.array[0]), 2)
        for st in self.array[0][1:]:
            self.assertNotEqual(st[0], 'Student 2')

    def test_api_obj_updated_with_uploaded_image(self):
        for st in self.array[0][:-1]:
            self.assertEqual(len(st), 3)
            reg = re.compile(
                r'https://song-maker-gallery.s3.amazonaws.com/(screenshots/(\d){4}-(\d){1,2}-(\d){1,2}/(.*).jpg)'
            )
            mo = re.search(reg, self.array[0][0][2])
            self.assertTrue(True if mo else False)

    def test_image_present_in_storage(self):
        with default_storage.open(self.get_gallery_path(), 'r') as fl:
            self.assertTrue(fl.readable())


class TestMutateGallery(TestCase):
    def setUp(self):
        user = User(
            username="test",
            email="test@test.com",
            password="hbljafjglr4jtq3ljtkl2jrlk2q"
        ).save()
        self.gallery = Gallery.objects.create(
            owner=user,
            title="Title",
            description="Description",
            api_obj=TESTING_API_OBJ()
        )
        mutate_gallery(self.gallery)

    def tearDown(self):
        default_storage.delete(self.get_gallery_path())

    def get_gallery_path(self):
        reg = re.compile(
            r'https://song-maker-gallery.s3.amazonaws.com/(screenshots/(\d){4}-(\d){1,2}-(\d){1,2}/(.*).jpg)'
        )
        url = self.gallery.api_obj[0][0][2]
        return re.search(reg, url)[1]

    def test_gallery_boolean_attributes_properly_mutated(self):
        self.assertEqual(self.gallery.needs_screenshot, False)
        self.assertEqual(self.gallery.work_in_progress, False)

    def test_image_present_in_storage(self):
        with default_storage.open(self.get_gallery_path(), 'r') as fl:
            self.assertTrue(fl.readable())
