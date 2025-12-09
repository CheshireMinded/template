output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.static_site.bucket
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain"
  value       = aws_cloudfront_distribution.static_site.domain_name
}

output "full_domain" {
  description = "Custom domain used for the static site"
  value       = aws_route53_record.static_site_alias.fqdn
}

