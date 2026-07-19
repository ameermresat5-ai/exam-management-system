variable "project_id" {
  description = "The Google Cloud project ID used for the deployment."
  type        = string
}

variable "region" {
  description = "The primary Google Cloud region."
  type        = string
  default     = "me-west1"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "production"

  validation {
    condition = contains(
      ["development", "staging", "production"],
      var.environment
    )

    error_message = "Environment must be development, staging, or production."
  }
}

variable "application_name" {
  description = "Name used as a prefix for Google Cloud resources."
  type        = string
  default     = "exam-management-system"
}

variable "gke_cluster_name" {
  description = "Name of the Google Kubernetes Engine cluster."
  type        = string
  default     = "exam-management-gke"
}

variable "artifact_registry_name" {
  description = "Name of the Artifact Registry Docker repository."
  type        = string
  default     = "exam-management-images"
}

variable "cloud_sql_instance_name" {
  description = "Name of the Cloud SQL PostgreSQL instance."
  type        = string
  default     = "exam-management-postgres"
}
