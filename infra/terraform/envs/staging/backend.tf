terraform {
  backend "s3" {
    bucket = "your-tf-state-bucket"
    key    = "web-platform/staging/terraform.tfstate"
    region = "us-west-2"
  }
}
