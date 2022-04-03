FROM python:3.10-alpine as develop

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1


RUN apk update && apk upgrade
RUN apk add --no-cache \
    curl \
    npm \
    build-base \
    libffi-dev \
    postgresql-dev \
    libpq-dev \
    python3-dev \
    musl-dev \
    openssl-dev

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH=$PATH:/root/.cargo/bin

# backend dependencies
WORKDIR /app
COPY requirements.txt .
# pip will put packages in here if it exists
RUN mkdir /root/.local
RUN pip install -r requirements.txt

# frontend dependencies
WORKDIR /app/frontend
COPY frontend/package.json .
COPY frontend/package-lock.json .
RUN npm install


# copy and setup whole app
WORKDIR /app
COPY . .

WORKDIR /app/frontend
RUN npm run build
WORKDIR /app

# if the SECRET_KEY is not definied, django management commands will not run
ARG SECRET_KEY="any value"
RUN python manage.py collectstatic --no-input


FROM python:3.10-alpine as production

RUN apk add --no-cache libpq

WORKDIR /app

# this copies previously installed and compiled python (pip) dependencies
COPY --from=develop /usr/local/lib/python3.10/lib-dynload /usr/local/lib/python3.10/lib-dynload
COPY --from=develop /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# copy project source code, including static build artifacts, node_modules, etc.
COPY --from=develop /app .

ENTRYPOINT [ "sh", "entrypoint.sh" ]
