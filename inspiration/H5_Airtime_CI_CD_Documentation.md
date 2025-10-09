# H5 Airtime Mini-App - CI/CD Pipeline Documentation

## Pipeline Overview

### Pipeline Stages
1. **Code Quality** - Linting, formatting, type checking
2. **Testing** - Unit tests, integration tests, E2E tests
3. **Security** - Dependency scanning, SAST, secrets detection
4. **Build** - Frontend and backend compilation
5. **Deploy** - Staging and production deployments
6. **Monitoring** - Health checks and performance monitoring

## GitHub Actions Workflow

### Main Workflow File
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Code Quality Stage
  code-quality:
    name: Code Quality Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier check
        run: npm run format:check

      - name: TypeScript type check
        run: npm run type-check

      - name: Run SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  # Testing Stage
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: code-quality
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          PLAYWRIGHT_BROWSERS_PATH: 0

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/

  # Security Stage
  security:
    name: Security Checks
    runs-on: ubuntu-latest
    needs: code-quality
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run npm audit
        run: npm audit --audit-level moderate

      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          extra_args: --debug --only-verified

  # Build Stage
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [test, security]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build:frontend

      - name: Build backend
        run: npm run build:backend

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: |
            dist/
            build/

  # Docker Build and Push
  docker:
    name: Build and Push Docker Image
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'push'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Deploy to Staging
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [docker]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Deploy to staging
        uses: azure/k8s-deploy@v1
        with:
          manifests: |
            k8s/staging/
          images: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          kubeconfig: ${{ secrets.KUBE_CONFIG }}

      - name: Run smoke tests
        run: |
          npm run test:smoke -- --env=staging

  # Deploy to Production
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        uses: azure/k8s-deploy@v1
        with:
          manifests: |
            k8s/production/
          images: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          kubeconfig: ${{ secrets.KUBE_CONFIG }}

      - name: Run health checks
        run: |
          npm run test:health -- --env=production

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Kubernetes Deployment Manifests

### Staging Environment
```yaml
# k8s/staging/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: airtime-app-staging
  namespace: staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: airtime-app
      environment: staging
  template:
    metadata:
      labels:
        app: airtime-app
        environment: staging
    spec:
      containers:
      - name: airtime-app
        image: ghcr.io/your-org/h5-airtime:staging
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "staging"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: airtime-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: airtime-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: airtime-app-service
  namespace: staging
spec:
  selector:
    app: airtime-app
    environment: staging
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

### Production Environment
```yaml
# k8s/production/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: airtime-app-production
  namespace: production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: airtime-app
      environment: production
  template:
    metadata:
      labels:
        app: airtime-app
        environment: production
    spec:
      containers:
      - name: airtime-app
        image: ghcr.io/your-org/h5-airtime:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: airtime-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: airtime-secrets
              key: redis-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: airtime-app-service
  namespace: production
spec:
  selector:
    app: airtime-app
    environment: production
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

## Package.json Scripts

### Development Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "vite --port 3000",
    "dev:backend": "nodemon --exec ts-node src/server.ts",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "vite build",
    "build:backend": "tsc && npm run copy:assets",
    "copy:assets": "cp -r public dist/",
    "start": "node dist/server.js",
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "vitest run",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "playwright test",
    "test:smoke": "playwright test --config=playwright.smoke.config.ts",
    "test:health": "playwright test --config=playwright.health.config.ts",
    "lint": "eslint src --ext .ts,.vue --fix",
    "format": "prettier --write src/**/*.{ts,vue,js,json}",
    "format:check": "prettier --check src/**/*.{ts,vue,js,json}",
    "type-check": "tsc --noEmit",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "ts-node prisma/seed.ts",
    "docker:build": "docker build -t h5-airtime .",
    "docker:run": "docker run -p 3000:3000 h5-airtime"
  }
}
```

## Environment Configuration

### Staging Environment
```bash
# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://user:password@staging-db:5432/airtime_staging
REDIS_URL=redis://staging-redis:6379
JWT_SECRET=staging-jwt-secret
SMS_API_KEY=staging-sms-api-key
PAYMENT_GATEWAY_URL=https://api-sandbox.payment-gateway.com
LOG_LEVEL=debug
```

### Production Environment
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:password@prod-db:5432/airtime_prod
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=production-jwt-secret
SMS_API_KEY=production-sms-api-key
PAYMENT_GATEWAY_URL=https://api.payment-gateway.com
LOG_LEVEL=info
```

## Monitoring and Observability

### Health Check Endpoints
```typescript
// src/routes/health.ts
import { Router } from 'express';
import { healthCheck, readinessCheck } from '../services/HealthService';

const router = Router();

// Liveness probe
router.get('/health', async (req, res) => {
  try {
    const health = await healthCheck();
    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Readiness probe
router.get('/ready', async (req, res) => {
  try {
    const readiness = await readinessCheck();
    res.status(200).json(readiness);
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

export default router;
```

### Health Service Implementation
```typescript
// src/services/HealthService.ts
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL!);

export class HealthService {
  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    };
  }

  async readinessCheck() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkExternalServices()
    ]);

    const results = checks.map((check, index) => ({
      service: ['database', 'redis', 'external'][index],
      status: check.status === 'fulfilled' ? 'healthy' : 'unhealthy',
      error: check.status === 'rejected' ? check.reason.message : null
    }));

    const allHealthy = results.every(result => result.status === 'healthy');

    return {
      status: allHealthy ? 'ready' : 'not ready',
      checks: results,
      timestamp: new Date().toISOString()
    };
  }

  private async checkDatabase() {
    await prisma.$queryRaw`SELECT 1`;
  }

  private async checkRedis() {
    await redis.ping();
  }

  private async checkExternalServices() {
    // Check payment gateway, SMS service, etc.
    const responses = await Promise.allSettled([
      fetch(`${process.env.PAYMENT_GATEWAY_URL}/health`),
      fetch(`${process.env.SMS_API_URL}/health`)
    ]);

    responses.forEach(response => {
      if (response.status === 'rejected') {
        throw new Error('External service unavailable');
      }
    });
  }
}
```

## Database Migration Strategy

### Migration Script
```typescript
// scripts/migrate.ts
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    await execAsync('npx prisma migrate deploy');
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigrations();
```

### Rollback Strategy
```typescript
// scripts/rollback.ts
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function rollbackMigration() {
  try {
    console.log('Rolling back database migration...');
    // Implement rollback logic based on your migration strategy
    await execAsync('npx prisma migrate reset --force');
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

rollbackMigration();
```

## Secrets Management

### GitHub Secrets Configuration
```yaml
# Required secrets in GitHub repository settings
secrets:
  - DATABASE_URL
  - REDIS_URL
  - JWT_SECRET
  - SMS_API_KEY
  - PAYMENT_GATEWAY_URL
  - PAYMENT_GATEWAY_SECRET
  - SLACK_WEBHOOK
  - SONAR_TOKEN
  - KUBE_CONFIG
```

### Kubernetes Secrets
```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: airtime-secrets
  namespace: production
type: Opaque
data:
  database-url: <base64-encoded-database-url>
  redis-url: <base64-encoded-redis-url>
  jwt-secret: <base64-encoded-jwt-secret>
  sms-api-key: <base64-encoded-sms-api-key>
  payment-gateway-secret: <base64-encoded-payment-gateway-secret>
```

## Performance Monitoring

### Application Metrics
```typescript
// src/middleware/metrics.ts
import { Request, Response, NextFunction } from 'express';
import { register, Counter, Histogram } from 'prom-client';

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    };
    
    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
  });
  
  next();
};
```

---

*This CI/CD documentation provides a complete DevOps workflow for the H5 Airtime Mini-App, from code quality checks to production deployment and monitoring.*
