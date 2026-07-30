resource "google_service_account" "backend" {
  project      = var.project_id
  account_id   = "exam-backend-gsa"
  display_name = "Exam Management Backend"
  description  = "Google service account used by the backend workload."
}

resource "google_project_iam_member" "backend_roles" {
  for_each = toset([
    "roles/cloudsql.client",
    "roles/secretmanager.secretAccessor"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.backend.email}"
}
