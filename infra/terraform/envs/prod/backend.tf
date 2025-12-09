terraform {
  backend "s3" {
    bucket = "your-tf-state-bucket"
    key    = "web-platform/prod/terraform.tfstate"
    region = "us-west-2"
  }
}
