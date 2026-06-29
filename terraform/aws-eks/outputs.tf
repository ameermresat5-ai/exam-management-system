output "cluster_name" {
  description = "EKS cluster name."
  value       = aws_eks_cluster.main.name
}

output "region" {
  description = "AWS region used by this template."
  value       = var.aws_region
}

output "database_endpoint" {
  description = "RDS PostgreSQL endpoint."
  value       = aws_db_instance.postgres.endpoint
}

output "vpc_id" {
  description = "VPC ID created for the cluster."
  value       = aws_vpc.main.id
}