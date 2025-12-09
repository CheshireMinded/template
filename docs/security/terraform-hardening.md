# Terraform Hardening Guide (Template)

This guide outlines recommended security practices for Terraform configurations used in production systems.

---

## 1. IAM Best Practices

- Do not use wildcard permissions (`*`)  
- Use separate roles for CI, services, developers  
- Rotate credentials regularly  
- Enable MFA for human accounts  

---

## 2. Networking

- Restrict public ingress  
- Use private subnets for sensitive workloads  
- Use security groups with least privilege  

---

## 3. Encryption

- Enable KMS encryption for:  
  - S3 buckets  
  - RDS/DB instances  
  - Secrets Manager  
  - EBS volumes  

---

## 4. State Management

- Store state in a secure backend (S3 + DynamoDB lock)  
- Restrict access to state files  
- Enable versioning on state bucket  

---

## 5. Additional Recommendations

- Use `tfsec` or `checkov` for static analysis  
- Tag all resources with ownership metadata  
- Review Terraform plan before apply  

