terraform {

  backend "s3" {
    bucket = "my-sites-terraform-remote-state"
    key    = "song_maker_gallery_state"
    region = "us-east-2"
  }

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.7.1"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.4.1"
    }

  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

resource "random_password" "django_secret" {
  length = 48
  special = true
}

module "basic-deployment" {
  source  = "jdevries3133/basic-deployment/kubernetes"
  version = "0.0.8"

  app_name  = "songmaker"
  container = "jdevries3133/song_maker_gallery:3.1.5"
  domain    = "songmakergallery.com"

  extra_env = {
    SECRET_KEY = random_password.django_secret.result
  }
}
