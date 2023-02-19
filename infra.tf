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

data "external" "git_describe" {
  program = ["sh", "-c", "echo '{\"output\": \"'\"$(git describe --tags)\"'\"}'"]
}

resource "random_password" "django_secret" {
  length = 48
  special = true
}

module "basic-deployment" {
  source  = "jdevries3133/basic-deployment/kubernetes"
  version = "3.0.0"

  app_name  = "songmaker"
  container = "jdevries3133/song_maker_gallery:${data.external.git_describe.result.output}"
  domain    = "songmakergallery.com"

  extra_env = {
    SECRET_KEY = random_password.django_secret.result
  }
}
