# Client Gateway

API Gateway hecho con **NestJS** y **TypeScript**, parte del proyecto del curso [NestJS + Microservicios](https://www.udemy.com/course/nestjs-microservicios/) (Udemy, DevTalles). Es el único punto de entrada HTTP: recibe las peticiones de los clientes y las reenvía a los microservicios a través de **NATS**.

> Proyecto de práctica completado: este servicio forma parte de una tienda de 5 microservicios desplegada en **Google Kubernetes Engine (GKE)** con Helm. Ver el [launcher](https://github.com/developer-ortega-microservicios/products-launcher).

## Arquitectura

```
Cliente HTTP  →  client-gateway  ──NATS──→  products-ms
                                 ──NATS──→  orders-ms ──NATS──→ payments-ms ──→ Stripe
                                 ──NATS──→  auth-ms
```

Repositorios relacionados en la organización [developer-ortega-microservicios](https://github.com/developer-ortega-microservicios).

## Funcionalidades

- Rutas REST para productos, órdenes y autenticación que delegan en los microservicios
- Autenticación con **JWT**: `auth-ms` emite y verifica los tokens
- Al crear una orden devuelve también la sesión de pago de **Stripe** (`paymentSession`)
- Endpoint de health check en `/` (lo usa el balanceador de GKE)
- Comunicación con los microservicios por mensajes sobre **NATS**
- Validación de DTOs y de parámetros (`ParseUUIDPipe`, `ParseIntPipe`)
- Paginación y filtro de órdenes por estado
- Manejo de excepciones con un filtro personalizado (`RpcCustomExceptionFilter`)
- Variables de entorno validadas con **Joi**

## Endpoints

### Productos — `/products`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/products` | Crear un producto |
| GET | `/products` | Listar productos (paginado) |
| GET | `/products/:id` | Obtener un producto |
| PATCH | `/products/:id` | Actualizar un producto |
| DELETE | `/products/:id` | Eliminar un producto |

### Autenticación — `/auth`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registrar un usuario |
| POST | `/auth/login` | Iniciar sesión (devuelve el token JWT) |
| GET | `/auth/verify` | Verificar el token JWT (devuelve el usuario y el token) |

### Órdenes — `/orders`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/orders` | Crear una orden con sus ítems; devuelve la orden y su sesión de pago de Stripe |
| GET | `/orders` | Listar órdenes (paginado, filtro por estado) |
| GET | `/orders/id/:id` | Obtener una orden por UUID |
| GET | `/orders/:status` | Listar órdenes por estado |
| PATCH | `/orders/:id` | Cambiar el estado de una orden |

## Stack técnico

- **NestJS** + **TypeScript**
- **NATS** — mensajería entre microservicios (`@nestjs/microservices`)
- **Joi** — validación de variables de entorno
- **class-validator** — validación de DTOs
- **Vitest**, **Oxlint** y **Prettier**

## Cómo correrlo localmente

1. Levantar el servidor de NATS (requiere Docker):
   ```bash
   docker network create nats
   docker run -d --name nats --network nats -p 4222:4222 -p 8222:8222 nats
   ```

2. Clonar e instalar:
   ```bash
   git clone https://github.com/developer-ortega-microservicios/client-gateway.git
   cd client-gateway
   npm install
   ```
   Si npm falla con `Cannot read properties of null (reading 'edgesOut')`, usar `npm install --legacy-peer-deps`.

3. Crear un archivo `.env` en la raíz (usar `.env.example` como referencia):
   ```
   PORT=3000
   NATS_SERVERS=nats://localhost:4222
   ```

4. Iniciar en modo desarrollo:
   ```bash
   npm run start:dev
   ```

Para que las rutas respondan, los microservicios (`products-ms`, `orders-ms`, `payments-ms` y `auth-ms`) deben estar corriendo y conectados al mismo servidor NATS. La forma más simple es levantar todo con el [launcher](https://github.com/developer-ortega-microservicios/products-launcher).

## Despliegue

- **Imagen de producción:** `dockerfile.prod` (build multi-etapa sobre `node:22-alpine`).
- **Build y publicación:** `cloudbuild.yml` construye la imagen con Cloud Build y la sube a **Artifact Registry** (`image-registry/client-gateway`).
- **Kubernetes:** se despliega en GKE Autopilot con el chart de Helm `k8s/tienda-gke` del [launcher](https://github.com/developer-ortega-microservicios/products-launcher); se comunica con el resto de servicios por NATS dentro del clúster.
- **Exposición pública:** el Ingress de GKE enruta `/*` hacia este servicio y `/payments/*` hacia `payments-ms`.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del gateway |
| `NATS_SERVERS` | Servidores de NATS, separados por coma |

## Scripts disponibles

```bash
npm run start:dev   # Desarrollo con recarga automática
npm run build       # Compila a /dist
npm run start:prod  # Ejecuta el build
npm run lint        # Oxlint
npm run test        # Pruebas unitarias
```
