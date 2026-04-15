# Kubernetes Deployment Guide - Free Shop Backend Microservices

## Overview

This guide provides step-by-step instructions for deploying the Free Shop Backend microservices to Kubernetes. The deployment includes:

- **10 Microservices**: Auth, User, Product, Order, Payment, Inventory, Vendor, Notification, Analytics, API Gateway
- **Infrastructure Services**: PostgreSQL (9 databases), Redis, RabbitMQ
- **Configuration Management**: ConfigMap for non-sensitive data, Secrets for credentials
- **Scalability**: HorizontalPodAutoscalers configured for automatic scaling

## Architecture

### ConfigMap (Non-Sensitive Configuration)

File: `k8s/config/freeshop-config.yaml`

All non-sensitive environment variables are managed via ConfigMap:
- Database host, port, username
- Redis configuration
- RabbitMQ configuration
- Service port numbers
- Node environment

### Secrets (Sensitive Data)

File: `k8s/secrets/app-secrets.yaml`

All credentials and sensitive data are stored in Kubernetes Secrets:
- Database password
- Redis password
- RabbitMQ credentials
- JWT secrets
- External API keys (Cloudinary, bKash)
- Firebase credentials
- SMTP configuration

## Prerequisites

1. **Kubernetes Cluster** (v1.20+)
   ```bash
   kubectl version --client
   ```

2. **Install Tools**
   ```bash
   # Install kubectl
   # Install Docker (for image building and pushing)
   ```

3. **Container Registry**
   - Docker Hub, GCR, or private registry
   - Update image references in all service deployment files

4. **Storage Class** (for PostgreSQL persistent volumes)
   - Available by default in most K8s clusters

## Step 1: Create Namespace

```bash
kubectl create namespace freeshop
```

## Step 2: Update Image Registry References

Replace `YOUR_REGISTRY` in all service YAML files with your actual Docker registry:

```bash
# Update all service deployments
for file in k8s/services/*/service.yaml; do
  sed -i 's|YOUR_REGISTRY|your-docker-registry|g' "$file"
done
```

Or manually update in each file:
- `k8s/services/auth-service/auth-service.yaml`
- `k8s/services/user-service/user-service.yaml`
- `k8s/services/product-service/product-service.yaml`
- ... (and all other services)

## Step 3: Build and Push Docker Images

```bash
# Build all microservice images
docker compose -f docker-compose.yml build

# Push to registry
docker push your-docker-registry/freeshop-auth-service:latest
docker push your-docker-registry/freeshop-user-service:latest
docker push your-docker-registry/freeshop-product-service:latest
docker push your-docker-registry/freeshop-order-service:latest
docker push your-docker-registry/freeshop-payment-service:latest
docker push your-docker-registry/freeshop-inventory-service:latest
docker push your-docker-registry/freeshop-vendor-service:latest
docker push your-docker-registry/freeshop-notification-service:latest
docker push your-docker-registry/freeshop-analytics-service:latest
docker push your-docker-registry/freeshop-api-gateway:latest
```

## Step 4: Apply ConfigMap

```bash
kubectl apply -f k8s/config/freeshop-config.yaml
```

**Verify:**
```bash
kubectl get configmap -n freeshop
kubectl describe configmap freeshop-config -n freeshop
```

## Step 5: Create and Apply Secrets

### Option A: From Existing .env File

```bash
kubectl create secret generic freeshop-secrets \
  --from-literal=POSTGRES_PASSWORD='your-postgres-password' \
  --from-literal=REDIS_PASSWORD='your-redis-password' \
  --from-literal=RABBITMQ_USER='freeshop_mq' \
  --from-literal=RABBITMQ_PASS='your-rabbitmq-password' \
  --from-literal=JWT_SECRET='your-jwt-secret' \
  --from-literal=JWT_REFRESH_SECRET='your-jwt-refresh-secret' \
  --from-literal=JWT_EXPIRES_IN='15m' \
  --from-literal=JWT_REFRESH_EXPIRES_IN='7d' \
  --from-literal=ADMIN_SECRET_KEY='your-admin-key' \
  --from-literal=CLOUDINARY_CLOUD_NAME='your-cloud-name' \
  --from-literal=CLOUDINARY_API_KEY='your-api-key' \
  --from-literal=CLOUDINARY_API_SECRET='your-api-secret' \
  --from-literal=BKASH_APP_KEY='your-bkash-key' \
  --from-literal=BKASH_APP_SECRET='your-bkash-secret' \
  --from-literal=BKASH_USERNAME='your-bkash-user' \
  --from-literal=BKASH_PASSWORD='your-bkash-password' \
  --from-literal=BKASH_BASE_URL='https://tokenized.sandbox.bka.sh/v1.2.0-beta' \
  --from-literal=SMTP_HOST='smtp.gmail.com' \
  --from-literal=SMTP_PORT='587' \
  --from-literal=SMTP_USER='your-email@gmail.com' \
  --from-literal=SMTP_PASS='your-app-password' \
  --from-literal=EMAIL_FROM='noreply@freeshop.com' \
  --from-literal=FIREBASE_PROJECT_ID='your-firebase-project' \
  --from-literal=FIREBASE_CLIENT_EMAIL='your-firebase-email' \
  --from-literal=FIREBASE_PRIVATE_KEY='your-firebase-key' \
  -n freeshop
```

### Option B: From YAML File

Use the existing `k8s/secrets/app-secrets.yaml` (with base64-encoded values):

```bash
kubectl apply -f k8s/secrets/app-secrets.yaml
```

**Verify:**
```bash
kubectl get secrets -n freeshop
kubectl describe secret freeshop-secrets -n freeshop
```

## Step 6: Deploy Infrastructure Services

### PostgreSQL

```bash
kubectl apply -f k8s/infrastructure/postgres/
```

**Wait for PostgreSQL to be ready:**
```bash
kubectl rollout status statefulset/postgres -n freeshop --timeout=5m
```

### Redis

```bash
kubectl apply -f k8s/infrastructure/redis/
```

### RabbitMQ

```bash
kubectl apply -f k8s/infrastructure/rabbitmq/
```

**Verify all infrastructure is running:**
```bash
kubectl get pods -n freeshop -l tier=infrastructure
```

## Step 7: Deploy Microservices

Deploy all services in order (databases must be ready first):

```bash
# Deploy all services
for service in auth user product order payment inventory vendor notification analytics; do
  echo "Deploying ${service}-service..."
  kubectl apply -f k8s/services/${service}-service/${service}-service.yaml
done

# Deploy API Gateway
kubectl apply -f k8s/services/api-gateway/api-gateway.yaml
```

**Or deploy all at once:**
```bash
kubectl apply -f k8s/services/
```

## Step 8: Verify Deployments

```bash
# Check all pods
kubectl get pods -n freeshop

# Check specific service
kubectl describe pod <pod-name> -n freeshop

# View logs
kubectl logs -f <pod-name> -n freeshop

# Watch rollout status
kubectl rollout status deployment/<service-name> -n freeshop --timeout=5m
```

## Step 9: Set Up Ingress (Optional)

For external access, configure ingress:

```bash
# Apply ingress configuration
kubectl apply -f k8s/ingress/ingress.yaml

# For HTTPS with cert-manager
kubectl apply -f k8s/ingress/cert-manager-issuer.yaml
```

## Step 10: Access the API Gateway

```bash
# Get API Gateway service IP/port
kubectl get svc api-gateway -n freeshop

# Port forward for local testing
kubectl port-forward svc/api-gateway 3000:3000 -n freeshop
```

**API Documentation:** http://localhost:3000/api-docs

## Environment Variables Reference

### Database Configuration (from ConfigMap)

```yaml
POSTGRES_HOST: postgres
POSTGRES_PORT: 5432
POSTGRES_USER: freeshop_user
```

### Database URLs (constructed in pods)

Services construct database URLs using environment variables:
```
AUTH_DATABASE_URL: postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/freeshop_auth
USER_DATABASE_URL: postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/freeshop_user
PRODUCT_DATABASE_URL: postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/freeshop_product
ORDER_DATABASE_URL: postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/freeshop_order
PAYMENT_DATABASE_URL: postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/freeshop_payment
INVENTORY_DATABASE_URL: postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/freeshop_inventory
VENDOR_DATABASE_URL: postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/freeshop_vendor
NOTIFICATION_DATABASE_URL: postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/freeshop_notification
ANALYTICS_DATABASE_URL: postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/freeshop_analytics
```

### Redis Configuration

```yaml
REDIS_HOST: redis
REDIS_PORT: 6379
REDIS_PASSWORD: <from secrets>
REDIS_URL: redis://:<REDIS_PASSWORD>@$(REDIS_HOST):$(REDIS_PORT)
```

### RabbitMQ Configuration

```yaml
RABBITMQ_HOST: rabbitmq
RABBITMQ_PORT: 5672
RABBITMQ_USER: <from secrets>
RABBITMQ_PASS: <from secrets>
RABBITMQ_URL: amqp://$(RABBITMQ_USER):$(RABBITMQ_PASS)@$(RABBITMQ_HOST):$(RABBITMQ_PORT)
```

## Troubleshooting

### Pods not starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n freeshop

# Check logs
kubectl logs <pod-name> -n freeshop

# Check resource limits
kubectl top pod -n freeshop
```

### Database connection issues

```bash
# Test PostgreSQL connection from a pod
kubectl run -it --rm debug --image=postgres:15-alpine --restart=Never -n freeshop -- \
  psql -h postgres -U freeshop_user -d freeshop_auth
```

### Missing secrets/configmap

```bash
# Verify secrets exist
kubectl get secrets -n freeshop

# Verify configmap exists
kubectl get configmap -n freeshop

# Check values
kubectl get configmap freeshop-config -n freeshop -o yaml
```

## Scaling

### Manual scaling

```bash
# Scale a specific deployment
kubectl scale deployment auth-service --replicas=3 -n freeshop

# Scale API Gateway (already configured with HPA 1-2 replicas)
kubectl scale deployment api-gateway --replicas=5 -n freeshop
```

### Automatic scaling (HorizontalPodAutoscaler)

All services are configured with HPA that scales based on CPU utilization:
- Min replicas: 1
- Max replicas: 3
- Target CPU utilization: 65%

```bash
# Check HPA status
kubectl get hpa -n freeshop
kubectl describe hpa auth-service-hpa -n freeshop
```

## Monitoring and Logging

### Watch pod status

```bash
kubectl get pods -n freeshop -w
```

### Stream logs from all services

```bash
kubectl logs -f -l app=auth-service -n freeshop
kubectl logs -f -l app=api-gateway -n freeshop
```

### Monitor resource usage

```bash
kubectl top nodes
kubectl top pods -n freeshop
```

## Cleanup

```bash
# Delete all resources in namespace
kubectl delete namespace freeshop

# Delete specific resources
kubectl delete -f k8s/services/ -n freeshop
kubectl delete -f k8s/infrastructure/ -n freeshop
kubectl delete configmap freeshop-config -n freeshop
kubectl delete secret freeshop-secrets -n freeshop
```

## Security Best Practices

✅ **Implemented:**
- All sensitive data in Secrets (never in ConfigMap)
- RBAC with service accounts per namespace
- Resource limits defined for all pods
- Health checks (liveness & readiness probes)
- Non-root containers (Alpine Linux)
- ImagePullPolicy set to Always

⚠️ **Additional Recommendations:**
- Enable NetworkPolicies to restrict traffic
- Use Pod Security Policies
- Implement audit logging
- Use TLS for all communication
- Regularly update base images
- Scan images for vulnerabilities

## Next Steps

1. **Setup CI/CD Pipeline**
   - Automate image builds and pushes
   - Automated Kubernetes deployments

2. **Configure Monitoring**
   - Install Prometheus for metrics
   - Setup Grafana dashboards
   - Configure alerts

3. **Setup Log Aggregation**
   - ELK Stack or similar
   - Centralized logging

4. **Database Backups**
   - Implement regular PostgreSQL backups
   - Test restore procedures

5. **Disaster Recovery**
   - Plan for node failures
   - Setup cross-zone redundancy

## Support

For issues or questions:
1. Check logs: `kubectl logs <pod> -n freeshop`
2. Describe resources: `kubectl describe <resource> -n freeshop`
3. Check events: `kubectl get events -n freeshop`
