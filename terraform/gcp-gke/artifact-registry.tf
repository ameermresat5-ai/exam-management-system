resource "google_artifact_registry_repository" "main" {
  project       = var.project_id
  location      = var.region
  repository_id = var.artifact_registry_name
  description   = "Docker images for the Exam Management System"
  format        = "DOCKER"

  labels = local.common_labels

  depends_on = [
    google_project_service.required_apis
  ]
}
