variable "aws_region" {
  description = "AWS Region for deployment"
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment (e.g., prod, staging)"
  default     = "prod"
}

variable "cluster_name" {
  description = "Name of the EKS Cluster"
  default     = "venturelens-eks-prod"
}
