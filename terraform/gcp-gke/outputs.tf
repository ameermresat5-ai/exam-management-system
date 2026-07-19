output "project_id" {
  description = "Google Cloud project used by this Terraform configuration."
  value       = var.project_id
}

output "region" {
  description = "Primary Google Cloud deployment region."
  value       = var.region
}

output "required_api_services" {
  description = "Google Cloud APIs managed by Terraform."
  value       = sort(tolist(local.required_apis))
}
