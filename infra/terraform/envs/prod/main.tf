terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ACM certificates for CloudFront must be in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

module "dns_tls" {
  source = "../../modules/dns_tls"

  providers = {
    aws = aws.us_east_1
  }

  hosted_zone_id = var.hosted_zone_id
  domain_name    = var.domain_name

  subject_alternative_names = [
    "app.${var.domain_name}",
    "api.${var.domain_name}",
    "${var.static_site_subdomain}.${var.domain_name}"
  ]

  tags = var.tags
}

module "static_site" {
  source = "../../modules/static_site"

  project_name   = var.project_name
  domain_name    = var.domain_name
  subdomain      = var.static_site_subdomain
  hosted_zone_id = var.hosted_zone_id
  certificate_arn = module.dns_tls.certificate_arn
  tags            = var.tags
}

module "web_app" {
  source = "../../modules/web_app"

  project_name = var.project_name
  tags         = var.tags
}
