from django.db import models, transaction
from django.db.models import F, Max

from django.db import models, transaction
from django.db.models import F


class OrderManager(models.Manager):
    """
    Thanks to
    https://www.revsys.com/tidbits/keeping-django-model-objects-ordered/
    """

    def __init__(self, foreign_field: str):
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
