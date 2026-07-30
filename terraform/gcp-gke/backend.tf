terraform {
  backend "gcs" {
    bucket = "exam-management-system-502914-tfstate"
    prefix = "gcp-gke/production"
  }
}
