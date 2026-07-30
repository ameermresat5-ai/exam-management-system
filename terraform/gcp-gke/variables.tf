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

variable "network_name" {
  description = "Name of the custom Google Cloud VPC."
  type        = string
  default     = "exam-management-vpc"
}

variable "subnetwork_name" {
  description = "Name of the regional Google Cloud subnetwork."
  type        = string
  default     = "exam-management-subnet"
}

variable "subnetwork_cidr" {
  description = "Primary IP range used by the regional subnetwork."
  type        = string
  default     = "10.10.0.0/20"
}

variable "gke_pods_range_name" {
  description = "Name of the secondary IP range used by Kubernetes Pods."
  type        = string
  default     = "exam-management-pods"
}

variable "gke_pods_cidr" {
  description = "Secondary IP range used by Kubernetes Pods."
  type        = string
  default     = "10.20.0.0/16"
}

variable "gke_services_range_name" {
  description = "Name of the secondary IP range used by Kubernetes Services."
  type        = string
  default     = "exam-management-services"
}

variable "gke_services_cidr" {
  description = "Secondary IP range used by Kubernetes Services."
  type        = string
  default     = "10.30.0.0/20"
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

variable "cloud_sql_database_name" {
  description = "Name of the PostgreSQL application database."
  type        = string
  default     = "exam_management"
}

variable "cloud_sql_database_version" {
  description = "PostgreSQL version used by Cloud SQL."
  type        = string
  default     = "POSTGRES_16"
}

variable "cloud_sql_tier" {
  description = "Cloud SQL machine tier."
  type        = string
  default     = "db-f1-micro"
}
