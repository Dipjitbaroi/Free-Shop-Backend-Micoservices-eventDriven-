# Resource Allocation & Capacity Planning

**Last Updated**: April 9, 2026  
**Status**: Production Configuration ✅

---

## Table of Contents

1. [VPS Specifications](#vps-specifications)
2. [Resource Requests vs Limits](#resource-requests-vs-limits)
3. [Infrastructure Components](#infrastructure-components)
4. [Microservices Allocation](#microservices-allocation)
5. [Total Resource Usage](#total-resource-usage)
6. [Horizontal Pod Autoscaler (HPA)](#horizontal-pod-autoscaler-hpa)
7. [Scaling Scenarios](#scaling-scenarios)
8. [Resource Monitoring](#resource-monitoring)

---

## VPS Specifications

### Hardware

```
┌─────────────────────────────────────┐
│   VPS (Single-Node k3s Cluster)     │
├─────────────────────────────────────┤
│ CPU (vCPU):          6 cores        │
│ RAM (Memory):        18 GB          │
│ Storage (SSD):       300 GB         │
│ Network:             Gigabit        │
│ OS:                  Ubuntu 20.04+  │
└─────────────────────────────────────┘
```

### Available Resources After System Overhead

```
Total CPU:       6000m
System Reserved: ~400m (k3s, kubelet, system services)
Available:       5600m

Total Memory:    18 GB (18432 MiB)
System Reserved: ~1.5 GB (k3s, kubelet, system services)
Available:       16.5 GB (16896 MiB)
```

---

## Resource Requests vs Limits

### Understanding Requests and Limits

| Term | Description | Impact |
|------|-------------|--------|
| **Request** | Guaranteed minimum resource | Pod gets scheduled only if this is available |
| **Limit** | Maximum resource usage | Pod is throttled or killed if exceeded |

### Strategy Applied

```
REQUEST: Conservative (what pods need normally)
└─→ Used for scheduling and HPA triggers

LIMIT: Higher (allows bursting)
└─→ Prevents runaway consumption
```

---

## Infrastructure Components

### PostgreSQL Database

**Purpose**: 9 separate databases (one per service)  
**Location**: Running on VPS with persistent storage

```yaml
# PostgreSQL Container Resources
CPU Request:     500m (0.5 vCPU)
CPU Limit:       1000m (1 vCPU)
Memory Request:  1 GB (1024 MiB)
Memory Limit:    2 GB (2048 MiB)
Replicas:        1 (no redundancy in single-node)
Storage:         100 GB PVC (persistent volume claim)
```

### Redis Cache

**Purpose**: Session storage, caching, rate limiting  
**Location**: Running on VPS

```yaml
# Redis Container Resources
CPU Request:     100m (0.1 vCPU)
CPU Limit:       300m (0.3 vCPU)
Memory Request:  256 MiB
Memory Limit:    512 MiB
Replicas:        1 (no redundancy in single-node)
Storage:         20 GB PVC
```

### RabbitMQ Message Broker

**Purpose**: Event bus for inter-service communication  
**Location**: Running on VPS

```yaml
# RabbitMQ Container Resources
CPU Request:     250m (0.25 vCPU)
CPU Limit:       500m (0.5 vCPU)
Memory Request:  512 MiB
Memory Limit:    1 GB (1024 MiB)
Replicas:        1 (no redundancy in single-node)
Storage:         50 GB PVC
```

### **Infrastructure Total (Requests)**

```
Total CPU Request:     850m
Total Memory Request:  1792 MiB (1.75 GB)
Total Storage:         170 GB
```

### **Infrastructure Total (Limits)**

```
Total CPU Limit:       1800m
Total Memory Limit:    3584 MiB (3.5 GB)
```

---

## Microservices Allocation

### Tier 1: API Gateway (Entry Point)

```yaml
Service:         api-gateway
Purpose:         HTTP routing, authentication, rate limiting
Min Replicas:    2 (always running)
Max Replicas:    2 (protected for single-node)
CPU Request:     150m per pod
CPU Limit:       500m per pod
Memory Request:  256 MiB per pod
Memory Limit:    512 MiB per pod
HPA Trigger:     CPU 70%
```

**Allocation (2 pods)**:
- CPU Request: 300m
- CPU Limit: 1000m
- Memory Request: 512 MiB
- Memory Limit: 1024 MiB

---

### Tier 2: Core Services (9 services)

#### Service Template

```yaml
Services:        auth-service
                 user-service
                 product-service
                 order-service
                 payment-service
                 inventory-service
                 vendor-service
                 notification-service
                 analytics-service

Min Replicas:    1 (can scale down)
Max Replicas:    2 (protected for single-node)
CPU Request:     100m per pod
CPU Limit:       500m per pod
Memory Request:  256 MiB per pod
Memory Limit:    512 MiB per pod
HPA Trigger:     CPU 70%
```

**Allocation (1 pod per service)**:
- Single Pod: 100m CPU request, 256 MiB memory request
- 9 Services Total:
  - CPU Request: 900m
  - CPU Limit: 4500m
  - Memory Request: 2304 MiB (2.25 GB)
  - Memory Limit: 4608 MiB (4.5 GB)

---

## Total Resource Usage

### At Minimum Scale (No Auto-Scaling)

```
┌────────────────────────────────────────────────────────┐
│           MINIMUM SCALE ALLOCATION                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Infrastructure:                                        │
│   PostgreSQL:      500m CPU  |  1 GB RAM               │
│   Redis:           100m CPU  |  256 MiB RAM            │
│   RabbitMQ:        250m CPU  |  512 MiB RAM            │
│   Subtotal:        850m      |  1.75 GB                │
│                                                        │
│ Microservices:                                         │
│   API Gateway (2):    300m CPU  |  512 MiB RAM         │
│   Core Services (9):  900m CPU  |  2.25 GB RAM         │
│   Subtotal:          1200m      |  2.75 GB             │
│                                                        │
│ k3s System:          ~400m     |  ~1.5 GB              │
│                                                        │
├────────────────────────────────────────────────────────┤
│ TOTAL REQUESTED:     2450m CPU (40.8%)                 │
│                      5.75 GB RAM (32%)                 │
│ AVAILABLE:           5600m CPU                         │
│                      16.5 GB RAM                       │
│ UNUSED BUFFER:       3150m CPU (56%)                   │
│                      10.75 GB RAM (65%)                │
└────────────────────────────────────────────────────────┘
```

### At Maximum Scale (Full Auto-Scaling)

```
┌────────────────────────────────────────────────────────┐
│          MAXIMUM SCALE ALLOCATION (HPA Triggered)      │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Infrastructure (same):                                 │
│   Total:             850m CPU  |  1.75 GB              │
│                                                        │
│ Microservices at Max:                                  │
│   API Gateway (2):    300m CPU  |  512 MiB RAM         │
│                       (maxReplicas: 2, no scale)       │
│                                                        │
│   Core Services (18):1800m CPU  |  4.5 GB RAM          │
│                       (9 services × 2 pods each)       │
│                       (maxReplicas: 2 each)            │
│                                                        │
│ k3s System:          ~400m     |  ~1.5 GB              │
│                                                        │
├────────────────────────────────────────────────────────┤
│ TOTAL REQUESTED:     3350m CPU (55.8%)                 │
│                      7.75 GB RAM (47%)                 │
│ AVAILABLE:           5600m CPU                         │
│                      16.5 GB RAM                       │
│ UNUSED BUFFER:       2250m CPU (40%)                   │
│                      8.75 GB RAM (53%)                 │
└────────────────────────────────────────────────────────┘
```

---

## Horizontal Pod Autoscaler (HPA)

### HPA Configuration per Service

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: freeshop
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  
  minReplicas: 2        # Always run at least 2 pods
  maxReplicas: 2        # Never exceed 2 (single-node safe)
  
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # Scale when CPU > 70%
  
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
```

### Core Services HPA

```yaml
minReplicas: 1         # Scale down to 1 pod (save resources)
maxReplicas: 2         # Scale up to max 2 pods (single-node safe)
targetCPUPercentage: 70%
```

### Protection Against Single-Node Overload

```
Why maxReplicas: 2?
├─ Single node: Can't distribute pods across nodes
├─ Limit prevents exhausting all CPU/RAM
├─ Ensures system stability
└─ Leaves headroom for emergencies

Example Scenario:
├─ If auth-service hits 80% CPU
├─ Would normally scale to 2 pods
├─ 2 × 100m = 200m CPU (still within budget)
├─ System stays stable ✅

If we allowed maxReplicas: 5:
├─ 5 × 100m = 500m CPU per service
├─ 5 × 256 MiB = 1.25 GB RAM per service
├─ 9 services × 5 = 45 pods total
├─ Would need ~4500m CPU + ~11.25 GB RAM
├─ Exceeds VPS capacity (5600m / 16.5 GB)
├─ System would crash ❌
```

---

## Scaling Scenarios

### Scenario 1: Normal Traffic (Minimal Scale)

```
Time: 2 AM - Low traffic
└─ API Gateway: 2 pods (300m CPU, 512 MiB)
└─ Auth Service: 1 pod (100m CPU, 256 MiB)
└─ Other services: 1 pod each (900m CPU, 2.25 GB)
└─ Total: 1200m CPU, 2.75 GB RAM
└─ Status: ✅ Plenty of headroom
```

### Scenario 2: Peak Traffic (Max Scale)

```
Time: 10 AM - High traffic
└─ API Gateway: remains 2 pods (300m CPU)
└─ Auth Service: scales to 2 pods (200m CPU)
└─ Product Service: scales to 2 pods (200m CPU)
└─ Order Service: scales to 2 pods (200m CPU)
└─ Other services: remain 1 pod (500m CPU)
└─ Total: ~1600-1800m CPU, ~5.5-6 GB RAM
└─ Status: ✅ Still safe (well within limits)
```

### Scenario 3: Burst Traffic (Emergency)

```
Time: 12 PM - Flash sale (all services max scale)
└─ API Gateway: 2 pods (300m CPU)
└─ All 9 services: 2 pods each (1800m CPU)
└─ Total: 2100m CPU, 4.5 GB RAM (services only)
└─ With infrastructure: 2950m CPU, 6.25 GB RAM
└─ Status: ✅ Safe (still 55% headroom)
```

### Scenario 4: Stress Limit (Maximum Workload)

```
Time: Hypothetical (if all limits applied)
└─ All pods at 100% CPU limit
└─ Infrastructure: 1800m
└─ Microservices at max: 7500m
└─ Total requested: 9300m
└─ Available: 5600m
└─ Status: ❌ EXCEEDS VPS (stress tested, not normal)
└─ Note: Requests (2950m) << Limits (9300m)
└─ This is the trade-off design
```

---

## Resource Monitoring

### Commands to Monitor

```bash
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n freeshop

# Check HPA status
kubectl get hpa -n freeshop

# Watch real-time scaling
kubectl get pods -n freeshop -w

# Check resource requests/limits
kubectl describe pod -n freeshop <pod-name> | grep -A 5 "Requests"
```

### Expected Monitoring Output

```
# kubectl top nodes
NAME           CPU(cores)   CPU%    MEMORY(Mi)   MEMORY%
vps-node       2500m        41%     8192         48%

# kubectl top pods -n freeshop (sample)
NAME                                CPU(m)   MEMORY(Mi)
api-gateway-xxxxx-xxxxx             45       128
auth-service-xxxxx-xxxxx            30       85
product-service-xxxxx-xxxxx         28       92
postgresql-xxxxx-xxxxx              120      1024
rabbitmq-xxxxx-xxxxx                65       412
redis-xxxxx-xxxxx                   12       78

# kubectl get hpa -n freeshop
NAME           REFERENCE              TARGETS    MINPODS  MAXPODS  REPLICAS
api-gateway    Deployment/api-gateway 42%/70%    2        2        2
auth-service   Deployment/auth        15%/70%    1        2        1
product-srv    Deployment/product     28%/70%    1        2        1
```

### Alerts to Set Up

```yaml
# Critical: CPU usage > 80% (system getting tight)
ALERT: VPSCPUUsageHigh
CONDITION: sum(node_cpu_usage) > 4480m  # 80% of 5600m

# Warning: Memory usage > 70% (approaching limit)
ALERT: VPSMemoryUsageHigh
CONDITION: sum(node_memory_usage) > 11.55 GB  # 70% of 16.5 GB

# Critical: Pod eviction risk
ALERT: PodEvictionRisk
CONDITION: available_memory < 2 GB

# Warning: HPA at max
ALERT: HPAMaxedOut
CONDITION: current_replicas == max_replicas for 5+ min
```

---

## Cost Analysis (Example Pricing)

### VPS Monthly Cost Breakdown

| Component                   | Cost            | Justification       |
|-----------------------------|-----------------|---------------------|
| 6 CPU @ $0.05/hour          |     $216        | Compute resource    |
| 18 GB RAM @ $0.01/hour      |     $72         | Memory resource     |
| 300 GB SSD @ $0.10/GB/month |     $30         | Storage             |
| Bandwidth (1TB/month)       |     $50         | Network egress      |
| **Total**                   | **~$368/month** | All-in managed cost |

### Cost Optimization Opportunities

```
Current: 6 CPU / 18 GB RAM
├─ Actual peak usage: ~3 CPU / 6 GB RAM (50% utilization)
├─ Headroom: Needed for burst handling + stability
└─ Option 1: Upgrade to 8 CPU/24 GB (+$100/mo) if traffic grows
└─ Option 2: Stay current, add monitoring alerts, scale horizontally later
```

---

## Capacity Planning Guidelines

### Safe Operating Range

```
CPU Usage:     30-60% of available (1680m - 3360m)
Memory Usage:  35-50% of available (5.7 GB - 8.25 GB)
```

### When to Upgrade VPS

```
Upgrade if:
✓ Peak CPU consistently > 4000m (70% of 5600m)
✓ Memory often > 12 GB (73% of 16.5 GB)
✓ HPA constantly at maxReplicas (pods can't scale further)
✓ Eviction events occurring (pods getting OOMKilled)

Upgrade size:
├─ Current: 6 CPU / 18 GB RAM
├─ Recommended next: 8 CPU / 24 GB RAM
└─ Alternative: Add second node (distributed k3s cluster)
```

### When to Scale Horizontally

```
Multi-Node Cluster (2+ nodes):
├─ Remove HPA maxReplicas: 2 limits
├─ Enable full auto-scaling to 5-10 pods per service
├─ Distribute load across multiple nodes
├─ Better fault tolerance (service survives node failure)
├─ Requires:
│  ├─ Load balancer (for distributed ingress)
│  ├─ Persistent volume storage (NFS/EBS)
│  └─ Network setup between nodes
└─ Cost: 2× VPS instances + storage = ~$700-900/month
```

---

## Summary Table

| Component           | Request      | Limit       | Purpose           |
|---------------------|--------------|-------------|-------------------|
| **Infrastructure**  |              |             |                   |
| PostgreSQL          | 500m/1GB     | 1000m/2GB   | Database          |
| Redis               | 100m/256Mi   | 300m/512Mi  | Cache             |
| RabbitMQ            | 250m/512Mi   | 500m/1GB    | Message Bus       |
| **Microservices**   |              |             |                   |
| API Gateway (2)     | 300m/512Mi   | 1000m/1GB   | Routing           |
| Core Services (9×1) | 900m/2.25GB  | 4500m/4.5GB | Business Logic    |
| **Total Min**       | 1200m/2.75GB | 6000m/6.5GB | Normal Load       |
| **Total Max**       | 1200m/2.75GB | 6000m/6.5GB | At HPA Limits     |
| **VPS Available**   | 5600m/16.5GB | —           | Physical Limits   |
| **Utilization**     | 21%          | —           | Normal conditions |

---

**Document State**: Production Ready ✅  
**Last Verified**: April 9, 2026  
**Next Review**: When traffic increases or services added
