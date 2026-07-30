resource "google_storage_bucket" "terraform_state" {
  name          = var.state_bucket_name
  project       = var.project_id
  location      = upper(var.region)
  storage_class = "STANDARD"

  force_destroy               = false
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  # Versioning already protects Terraform state history.
  # Disable the additional default soft-delete retention period.
  soft_delete_policy {
    retention_duration_seconds = 0
  }

  labels = {
    application = "exam-management-system"
    environment = "production"
    managed_by  = "terraform"
    purpose     = "terraform-state"
  }

  lifecycle {
    prevent_destroy = true
  }
}
