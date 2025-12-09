variable "project_name" {
  description = "Project name used for naming resources"
  type        = string
}

variable "domain_name" {
  description = "Root domain (e.g. example.com)"
  type        = string
}

variable "subdomain" {
  description = "Subdomain (e.g. www, landing)"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for domain_name"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN for CloudFront (must be in us-east-1)"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}

