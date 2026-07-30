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

output "network_name" {
  description = "Custom VPC used by GKE and Cloud SQL."
  value       = google_compute_network.main.name
}

output "subnetwork_name" {
  description = "Regional subnetwork used by GKE."
  value       = google_compute_subnetwork.main.name
}

output "artifact_registry_repository" {
  description = "Artifact Registry repository path."
  value = format(
    "%s-docker.pkg.dev/%s/%s",
    var.region,
    var.project_id,
    google_artifact_registry_repository.main.repository_id
  )
}

output "gke_cluster_name" {
  description = "GKE Autopilot cluster name."
  value       = google_container_cluster.main.name
}

output "gke_cluster_location" {
  description = "GKE Autopilot cluster region."
  value       = google_container_cluster.main.location
}

output "cloud_sql_connection_name" {
  description = "Cloud SQL connection name used by the Auth Proxy."
  value       = google_sql_database_instance.main.connection_name
}

output "cloud_sql_private_ip" {
  description = "Private IP address assigned to Cloud SQL."
  value       = google_sql_database_instance.main.private_ip_address
}

output "backend_service_account_email" {
  description = "Google service account used by the backend."
  value       = google_service_account.backend.email
}

output "backend_secret_ids" {
  description = "Secret Manager secret containers for the backend."
  value       = local.backend_secret_ids
}
