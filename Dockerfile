FROM python:3.8-alpine
RUN apk add build-base libffi-dev apache2 apache2-dev

RUN pip install --upgrade pip

COPY ./requirements.django.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY ./sample-gallery.json /sample_gallery/sample_gallery.json

COPY ./integrated_django_react /app
WORKDIR /app

COPY ./entrypoint.sh /
CMD ["sh", "/entrypoint.sh"]
