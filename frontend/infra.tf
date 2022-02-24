terraform {

  backend "s3" {
    bucket = "my-sites-terraform-remote-state"
    key    = "song_maker_storybook"
    region = "us-east-2"
  }

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.8.0"
    }

  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}


// factoring this out makes this config much easier to copy and paste for
// similar simple single-container deploys
variable "app_name" {
  type = string
  default = "smg-stories"
}

resource "kubernetes_namespace" "app_ns" {
  metadata {
    name = var.app_name
  }
}


resource "kubernetes_deployment" "app_deploy" {
  metadata {
    name      = "${var.app_name}-deployment"
    namespace = kubernetes_namespace.app_ns.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "${var.app_name}"
      }
    }

    template {
      metadata {
        labels = {
          app = "${var.app_name}"
        }
      }
      spec {
        container {
          name  = "${var.app_name}"
          image = "jdevries3133/song_maker_storybook:3.1.5"
        }
      }
    }
  }
}

resource "kubernetes_service" "app_service" {
  metadata {
    name      = "${var.app_name}-service"
    namespace = kubernetes_namespace.app_ns.metadata[0].name
  }

  spec {
    selector = {
      app = "${var.app_name}"
    }
    session_affinity = "ClientIP"
    port {
      port        = 8080
      target_port = 80
    }
  }
}

resource "kubernetes_ingress_v1" "app_ingress" {
  metadata {
    name      = "${var.app_name}-ingress"
    namespace = kubernetes_namespace.app_ns.metadata[0].name
  }

  spec {
    ingress_class_name = "public"
    tls {
      hosts = ["${var.app_name}.us"]
    }
    rule {
      host = "stories.songmakergallery.com"
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service.app_service.metadata.0.name
              port {
                number = kubernetes_service.app_service.spec.0.port.0.port
              }
            }
          }
        }
      }
    }
  }

}
