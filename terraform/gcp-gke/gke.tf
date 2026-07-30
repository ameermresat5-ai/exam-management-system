resource "google_container_cluster" "main" {
  project  = var.project_id
  name     = var.gke_cluster_name
  location = var.region

  enable_autopilot    = true
  deletion_protection = true

  network    = google_compute_network.main.id
  subnetwork = google_compute_subnetwork.main.id

  release_channel {
    channel = "REGULAR"
  }

  ip_allocation_policy {
    cluster_secondary_range_name  = var.gke_pods_range_name
    services_secondary_range_name = var.gke_services_range_name
  }

  resource_labels = local.common_labels

  depends_on = [
    google_project_service.required_apis,
    google_compute_subnetwork.main
  ]

  lifecycle {
    prevent_destroy = true
  }
}
