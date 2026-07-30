locals {
  common_labels = {
    application = "exam-management-system"
    environment = var.environment
    managed_by  = "terraform"
  }

  backend_secret_ids = {
    db_user     = "${var.application_name}-db-user"
    db_password = "${var.application_name}-db-password"
    db_name     = "${var.application_name}-db-name"
    jwt_secret  = "${var.application_name}-jwt-secret"
    cors_origin = "${var.application_name}-cors-origin"
  }
}
