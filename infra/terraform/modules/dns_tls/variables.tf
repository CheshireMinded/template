variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for the domain"
  type        = string
}

variable "domain_name" {
  description = "Primary domain name for the certificate (e.g., example.com)"
  type        = string
}

variable "subject_alternative_names" {
  description = "List of additional domains (SANs) for the certificate"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to ACM certificate"
  type        = map(string)
  default     = {}
}

# Note: ACM certificates for CloudFront must be in us-east-1
# The calling module should provide a provider alias for us-east-1

