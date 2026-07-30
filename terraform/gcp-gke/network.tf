resource "google_compute_network" "main" {
  project                 = var.project_id
  name                    = var.network_name
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"

  depends_on = [
    google_project_service.required_apis
  ]
}

resource "google_compute_subnetwork" "main" {
  project                  = var.project_id
  name                     = var.subnetwork_name
  region                   = var.region
  network                  = google_compute_network.main.id
  ip_cidr_range            = var.subnetwork_cidr
  private_ip_google_access = true

  secondary_ip_range {
    range_name    = var.gke_pods_range_name
    ip_cidr_range = var.gke_pods_cidr
  }

  secondary_ip_range {
    range_name    = var.gke_services_range_name
    ip_cidr_range = var.gke_services_cidr
  }
}

resource "google_compute_global_address" "private_services" {
  project       = var.project_id
  name          = "${var.application_name}-private-services"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network = google_compute_network.main.id
  service = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [
    google_compute_global_address.private_services.name
  ]

  depends_on = [
    google_project_service.required_apis
  ]
}
