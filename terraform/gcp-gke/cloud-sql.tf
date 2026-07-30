resource "google_sql_database_instance" "main" {
  project          = var.project_id
  name             = var.cloud_sql_instance_name
  region           = var.region
  database_version = var.cloud_sql_database_version

  deletion_protection = true

  settings {
    tier              = var.cloud_sql_tier
    availability_type = "ZONAL"

    disk_type       = "PD_SSD"
    disk_size       = 10
    disk_autoresize = true

    user_labels = local.common_labels

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
    }

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = false
    }
  }

  depends_on = [
    google_project_service.required_apis,
    google_service_networking_connection.private_vpc_connection
  ]

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_sql_database" "application" {
  project  = var.project_id
  name     = var.cloud_sql_database_name
  instance = google_sql_database_instance.main.name
}
