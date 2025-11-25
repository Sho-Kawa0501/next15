terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# AWS 東京（ap-northeast-1）＝ S3 / Route53 / CloudFront など
provider "aws" {
  region = "ap-northeast-1"
}

# CloudFront 用 ACM は us-east-1
provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}
