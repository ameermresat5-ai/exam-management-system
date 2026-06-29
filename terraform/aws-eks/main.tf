# WARNING:
# This Terraform folder is a cloud infrastructure template for project demonstration.
# Running terraform apply creates paid AWS resources.
# The local deployment for this project uses Minikube, not AWS.

locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}