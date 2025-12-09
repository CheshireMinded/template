# SSM Secrets Role

This Ansible role demonstrates how to fetch secrets from AWS Systems Manager (SSM) Parameter Store and use them in deployments.

## Prerequisites

1. AWS credentials configured (via environment variables, IAM role, or AWS CLI config)
2. `boto3` Python package installed on the Ansible control node
3. IAM permissions to read SSM parameters:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Action": [
         "ssm:GetParameter",
         "ssm:GetParameters"
       ],
       "Resource": "arn:aws:ssm:*:*:parameter/web-platform/*"
     }]
   }
   ```

## Usage

### Example 1: Fetch secrets and set as Ansible variables

```yaml
- hosts: localhost
  roles:
    - role: ssm_secrets
      vars:
        ssm_secrets:
          - name: DATABASE_URL
            ssm_path: /web-platform/prod/DATABASE_URL
          - name: AUTH_JWT_SECRET
            ssm_path: /web-platform/prod/AUTH_JWT_SECRET
        aws_region: us-west-2
```

### Example 2: Fetch secrets and create Kubernetes secret

```yaml
- hosts: localhost
  roles:
    - role: ssm_secrets
      vars:
        ssm_secrets:
          - name: DATABASE_URL
            ssm_path: /web-platform/prod/DATABASE_URL
          - name: AUTH_JWT_SECRET
            ssm_path: /web-platform/prod/AUTH_JWT_SECRET
          - name: POSTGRES_PASSWORD
            ssm_path: /web-platform/prod/POSTGRES_PASSWORD
        create_k8s_secret: true
        secret_name: backend-secrets
        namespace: web-platform
        aws_region: us-west-2
```

## Variables

- `ssm_secrets` (required): List of secrets to fetch
  - `name`: Variable name to set in Ansible
  - `ssm_path`: SSM parameter path
- `aws_region` (optional): AWS region (default: `us-west-2`)
- `create_k8s_secret` (optional): Create Kubernetes secret (default: `false`)
- `secret_name` (optional): Kubernetes secret name (default: `backend-secrets`)
- `namespace` (optional): Kubernetes namespace (default: `web-platform`)

## Security Notes

- All tasks use `no_log: true` to prevent secret values from appearing in logs
- Never commit secret values to version control
- Use encrypted SSM parameters (SecureString) for sensitive data
- Rotate secrets regularly

