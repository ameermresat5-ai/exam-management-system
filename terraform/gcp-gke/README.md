# Google Cloud GKE Terraform Deployment

This folder contains the active Google Cloud infrastructure configuration for
the Full Stack Exam Management System.

Google Cloud is the production deployment target for this project.

## Planned infrastructure

- Google Kubernetes Engine
- Artifact Registry
- Cloud SQL for PostgreSQL
- Secret Manager
- Google IAM service accounts
- Workload Identity
- GitHub Actions authentication using OIDC
- Kubernetes ingress and public load balancing
- Terraform remote state in Google Cloud Storage

## Current status

The folder currently contains the Terraform provider and project variables.

Cloud resources have not yet been added or created.

## AWS implementation

The AWS EKS Terraform implementation remains available in:

    terraform/aws-eks/

The AWS configuration is maintained as a portfolio and multi-cloud
infrastructure example.

It is not used by the active Google Cloud deployment pipeline.

## Safe commands

The following commands format and validate the configuration without creating
cloud resources:

    terraform fmt
    terraform init -backend=false
    terraform validate

## Paid command warning

Do not run the following command until the Google Cloud project, billing,
budget controls, variables, and infrastructure plan have been reviewed:

    terraform apply

Google Cloud resources such as GKE and Cloud SQL can generate charges.

## Local variables

Create a local variable file from the example:

    cp terraform.tfvars.example terraform.tfvars

Replace the placeholder project ID with the real Google Cloud project ID.

The real terraform.tfvars file must not be committed.

## Deployment target

The active deployment architecture is:

    GitHub Actions
          |
          v
    Google Artifact Registry
          |
          v
    Google Kubernetes Engine
          |
          +-- Frontend
          +-- Backend
          +-- Monitoring
          |
          v
    Cloud SQL PostgreSQL

## Repository infrastructure layout

    terraform/
    |-- aws-eks/
    |   `-- Portfolio AWS infrastructure example
    |
    `-- gcp-gke/
        `-- Active Google Cloud deployment infrastructure

## Important separation

AWS and Google Cloud must use separate:

- Terraform folders
- Terraform state files
- Cloud credentials
- Providers
- Variables
- Deployment workflows

The Google Cloud workflow must never run Terraform commands inside the
terraform/aws-eks directory.
