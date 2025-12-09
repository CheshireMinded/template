variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Project name used for tagging"
  type        = string
  default     = "web-platform"
}

variable "domain_name" {
  description = "Root domain used for static site and app"
  type        = string
  default     = "example.com"
}

variable "static_site_subdomain" {
  description = "Subdomain for static site (e.g. landing.example.com)"
  type        = string
  default     = "landing"
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for the primary domain"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default = {
    "environment" = "staging"
    "project"     = "web-platform"
  }
}
