variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Google Cloud region."
  type        = string
  default     = "me-west1"
}

variable "state_bucket_name" {
  description = "Globally unique Cloud Storage bucket for Terraform state."
  type        = string
}
