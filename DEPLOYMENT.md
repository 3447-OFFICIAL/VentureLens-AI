# Deployment Guide - VentureLens AI

VentureLens AI supports production-grade deployments on AWS, GCP, and Vercel/Render.

---

## 1. Vercel & Render (SaaS Deployment)

### Frontend (Vercel)
The Next.js frontend is fully optimized for Vercel deployment with dynamic routing and standalone output configurations.
1. Connect your repository to Vercel.
2. In Project Settings, set the Build Command to `npm run build` and Root Directory to `frontend`.
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend base API URL (e.g. `https://api.venturelens.ai`).
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.

### Backend & Workers (Render)
1. Create a **Web Service** on Render for the FastAPI backend:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Create a **Background Worker** on Render for the Celery process:
   - Start Command: `celery -A app.celery_worker.celery worker --loglevel=info`
3. Configure environment variables:
   - `DATABASE_URL`: PostgreSQL connection string.
   - `REDIS_URL`: Redis instance connection URL.
   - `QDRANT_URL`: Qdrant Cloud cluster endpoint.

---

## 2. Google Cloud Platform (GCP Deployment)

We recommend using **Cloud Run** for low-overhead containerized autoscaling.

```bash
# 1. Build and push backend image to Artifact Registry
gcloud builds submit --tag gcr.io/your-project-id/venturelens-backend ./backend

# 2. Deploy backend service to Cloud Run
gcloud run deploy venturelens-backend \
  --image gcr.io/your-project-id/venturelens-backend \
  --platform managed \
  --port 8000 \
  --env-vars-file backend.env.yaml \
  --allow-unauthenticated
```

---

## 3. Amazon Web Services (AWS Deployment)

For AWS, deploy using **Elastic Container Service (ECS)** on **AWS Fargate**.

1. Create an **Elastic Container Registry (ECR)** repository for backend and frontend.
2. Host PostgreSQL on **Amazon RDS** (Multi-AZ) and Redis on **Amazon ElastiCache**.
3. Launch ECS Fargate tasks using the production-ready `docker-compose` setups.
4. Put the services behind an **Application Load Balancer (ALB)** with HTTPS certificate maps.
