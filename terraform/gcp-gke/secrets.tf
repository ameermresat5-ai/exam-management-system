resource "google_secret_manager_secret" "backend" {
  for_each = local.backend_secret_ids

  project   = var.project_id
  secret_id = each.value

  labels = local.common_labels

  replication {
    auto {}
  }

  depends_on = [
    google_project_service.required_apis
  ]
}
