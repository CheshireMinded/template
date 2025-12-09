output "static_site_bucket_name" {
  description = "S3 bucket used for static site hosting"
  value       = module.static_site.bucket_name
}

output "static_site_distribution_domain" {
  description = "CloudFront distribution domain for static site"
  value       = module.static_site.cloudfront_domain_name
}

output "frontend_ecr_repository_url" {
  description = "ECR repository URL for frontend images"
  value       = module.web_app.frontend_ecr_repository_url
}

output "backend_ecr_repository_url" {
  description = "ECR repository URL for backend images"
  value       = module.web_app.backend_ecr_repository_url
}

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate for this environment"
  value       = module.dns_tls.certificate_arn
}
