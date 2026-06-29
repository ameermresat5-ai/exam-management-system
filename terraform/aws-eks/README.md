# AWS EKS Terraform Template

This folder is a template for project demonstration for the Full Stack Exam Management System.
It shows cloud infrastructure knowledge and is not required for local development.

The local deployment uses Minikube. AWS EKS is only a production/cloud design example.

## Warning

Do not run `terraform apply` unless you want paid AWS resources.

This template includes resources that can create AWS charges, including EKS, EC2 worker nodes, NAT Gateway, and RDS PostgreSQL.
No real AWS credentials or real secrets are included in this repository.

## Design

- AWS EKS for Kubernetes
- AWS RDS PostgreSQL for managed database
- VPC with public and private subnets
- EKS managed node group in private subnets
- Security groups for EKS and RDS
- Outputs for cluster name, region, database endpoint, and VPC ID

## Safe Commands

These commands are safe for formatting and validation work:

```bash
terraform fmt
terraform init
terraform validate
```

## Dangerous Paid Command

```bash
terraform apply
```

Do not run the command above unless you intentionally want to create paid AWS resources.

## Variables

Copy `terraform.tfvars.example` only for local experimentation, then replace example placeholders with values appropriate for your own AWS account. Never commit real secrets.