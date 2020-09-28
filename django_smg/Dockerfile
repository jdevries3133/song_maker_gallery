FROM python:3.7-stretch
ENV PYTHONBUFFERED 1
RUN apt-get update -y && apt-get install -y \
    apt-utils \
    apache2 \
    apache2-dev \
    apache2-utils \
    libapache2-mod-wsgi-py3 \
    sudo
EXPOSE 8000
COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt
# for production settings, remove root permissions.
RUN useradd -rm -d /home/ubuntu -s /bin/bash \
    -g root -G sudo \
    -u 1001 ubuntu \
    && echo "ubuntu:default" | chpasswd
USER ubuntu
WORKDIR /home/ubuntu
COPY . .
CMD ["python", "/home/ubuntu/manage.py", "runserver", "0.0.0.0:8000"]


# LABEL MAINTAINER Anthony Rozon <arozonm@gmail.com>
# Install dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     xvfb \
#     unzip \
#     openjdk-8-jre-headless

# # Install Chrome
# RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
# RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
# RUN apt-get -y update && apt-get -y install google-chrome-stable --no-install-recommends

# # Setup version variables
# ENV CHROMEDRIVER_VERSION 81.0.4044.69
# ENV ALLURE_VERSION 2.13.3

# # Download ChromeDriver
# RUN wget https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip
# RUN unzip chromedriver_linux64.zip
# RUN rm chromedriver_linux64.zip

# # Install ChromeDriver
# RUN mv chromedriver /usr/local/bin/chromedriver
# RUN chown root:root /usr/local/bin/chromedriver
# RUN chmod 0755 /usr/local/bin/chromedriver

# # Download Allure binaries
# RUN wget -O allure-${ALLURE_VERSION}.zip https://dl.bintray.com/qameta/maven/io/qameta/allure/allure-commandline/${ALLURE_VERSION}/allure-commandline-${ALLURE_VERSION}.zip
# RUN unzip allure-${ALLURE_VERSION}.zip
# RUN rm allure-${ALLURE_VERSION}.zip
