import logging
import re

from django.db import models, transaction, IntegrityError
from django.utils.text import slugify
from django.db.models import F, Max
from django.db import models, transaction

from rest_framework.exceptions import APIException


logger = logging.getLogger(__name__)


class OrderManager(models.Manager):
    """
    Thanks to
    https://www.revsys.com/tidbits/keeping-django-model-objects-ordered/
    """

    def __init__(self, foreign_field: str = None):
        """
        I manage the model with an order column. The ordered group is formed
        by combining my model and peers who are related by foreign key to a
        "parent" model.

        For example, 'Gallery' could be the foreign model, and SongGroup
        would be the model whose order field this manager manages.
        """
        self.foreign_field = foreign_field
        super().__init__()

    def move(self, obj, new_order):
        """
        Move an object to a new order position
        """

        if not self.foreign_field:
            raise Exception(
                'Move method is unsupported because foreign field is not '
                'defined.'
            )

        qs = self.get_queryset()

        with transaction.atomic():
            if obj.order > int(new_order):
                qs.filter(
                    order__lt=obj.order,
                    order__gte=new_order,
                    **{self.foreign_field: getattr(obj, self.foreign_field)}
                ).exclude(
                    pk=obj.pk
                ).update(
                    order=F('order') + 1,
                )
            else:
                qs.filter(
                    order__lte=new_order,
                    order__gt=obj.order,
                    **{self.foreign_field: getattr(obj, self.foreign_field)}
                ).exclude(
                    pk=obj.pk,
                ).update(
                    order=F('order') - 1,
                )

            obj.order = new_order
            obj.save()

    def create(self, **kwargs):

        if not self.foreign_field:
            return super().create(**kwargs)

        instance = self.model(**kwargs)

        with transaction.atomic():
            # Get our current max order number
            results = self.filter(
                **{self.foreign_field: getattr(instance, self.foreign_field)}
            ).aggregate(
                Max('order')
            )

            # Increment and use it for our new object
            current_order = results['order__max']
            if current_order is None:
                current_order = -1

            value = current_order + 1
            instance.order = value
            instance.save()

            return instance


class SlugCreationFailed(APIException):
    status_code = 500
    default_detail = 'Server failed to create your gallery, please try again'
    default_code = 'create_gallery_failed'


class SlugManager(models.Manager):

    def create(self, **kwargs):
        instance = self.model(**kwargs)
        try:
            with transaction.atomic():
                value = self.generate_slug(instance.title)
                instance.slug = self.generate_slug(instance.title)
                instance.save()
        except IntegrityError:
            logger.exception('Slug generator failed. Aborting create')
            raise SlugCreationFailed()
        return instance

    def generate_slug(self, title):
        """
        Create a unique slug derived for the title for this gallery.
        """
        # TODO: Use a more complex query like the order manager to move this
        # processing into the db, make it atomic, and remove the need for
        # error handling in the create method.
        slug = slugify(title[:40])
        outstr = ''
        for i in slug:
            if re.search(r'[a-zA-Z0-9\-]', i):
                outstr += i
        slug = outstr

        # slug is the slug we will try
        conflicting_urls = [
            i.slug for i in self.get_queryset().filter(  # type: ignore
                slug__contains=slug
            )
        ]
        if conflicting_urls:
            append_int = 1
            slug += '-' + str(append_int)
            while slug in conflicting_urls:
                append_int += 1
                slug = (
                    slug[:-len(str(append_int - 1))]
                    + str(append_int)
                )
        return slug
