variable "project_name" {
  description = "Project name used for naming resources"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}

