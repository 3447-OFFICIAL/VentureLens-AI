module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "venturelens-vpc-${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.28"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      min_size     = 2
      max_size     = 10
      desired_size = 3
      instance_types = ["t3.xlarge"]
    }
    compute = {
      min_size     = 1
      max_size     = 5
      desired_size = 2
      instance_types = ["c6i.2xlarge"]
      labels = {
        role = "agents"
      }
    }
  }
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "venturelens-db-${var.environment}"
  engine     = "postgres"
  engine_version = "15.3"
  instance_class = "db.r6g.large"
  allocated_storage = 100

  db_name  = "venturelens"
  username = "vladmin"
  port     = 5432

  multi_az               = true
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [module.vpc.default_security_group_id]
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "venturelens-redis-${var.environment}"
  engine               = "redis"
  node_type            = "cache.t4g.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

resource "aws_s3_bucket" "frontend" {
  bucket = "venturelens-app-${var.environment}"
}

resource "aws_s3_bucket" "documents" {
  bucket = "venturelens-docs-${var.environment}"
}

resource "aws_secretsmanager_secret" "app_secrets" {
  name = "venturelens/prod/secrets"
}
