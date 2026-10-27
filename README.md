# Client Gateway

API Gateway hecho con **NestJS** y **TypeScript**, parte del proyecto del curso [NestJS + Microservicios](https://www.udemy.com/course/nestjs-microservicios/) (Udemy, DevTalles). Es el único punto de entrada HTTP: recibe las peticiones de los clientes y las reenvía a los microservicios a través de **NATS**.

> Proyecto de práctica, **en progreso**. Se actualiza a medida que avanza el curso.

## Arquitectura

```
Cliente HTTP  →  client-gateway  ──NATS──→  products-ms
                                 ──NATS──→  orders-ms
                                 ──NATS──→  payments-ms (próximamente)
```

Repositorios relacionados en la organización [developer-ortega-microservicios](https://github.com/developer-ortega-microservicios).

## Funcionalidades

- Rutas REST para productos y órdenes que delegan en los microservicios
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

### Órdenes — `/orders`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/orders` | Crear una orden con sus ítems |
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

Para que las rutas respondan, `products-ms` y `orders-ms` deben estar corriendo y conectados al mismo servidor NATS.

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
