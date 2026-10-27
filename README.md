# Client Gateway

API Gateway hecho con **NestJS** y **TypeScript**, parte del proyecto del curso [NestJS + Microservicios](https://www.udemy.com/course/nestjs-microservicios/) (Udemy, DevTalles). Es el único punto de entrada HTTP: recibe las peticiones de los clientes y las reenvía a cada microservicio.

> Proyecto de práctica, **en progreso**. Se actualiza a medida que avanza el curso.

## Qué se va a construir

- Rutas REST que delegan en los microservicios (`products-ms`, `orders-ms`, `payments-ms`)
- Comunicación con los microservicios por Message Patterns (TCP, luego NATS)
- Paginación y envío de payloads
- Manejo de excepciones con un filtro personalizado (RPC)
- Configuración con variables de entorno

## Arquitectura

```
Cliente HTTP  →  client-gateway  →  products-ms
                                 →  orders-ms
                                 →  payments-ms
```

Repositorios relacionados en la organización [developer-ortega-microservicios](https://github.com/developer-ortega-microservicios).

## Stack técnico

- **NestJS** + **TypeScript**
- **Vitest** — pruebas
- **Oxlint** y **Prettier** — calidad y formato del código

## Cómo correrlo localmente

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/developer-ortega-microservicios/client-gateway.git
   cd client-gateway
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```
   Si npm falla con `Cannot read properties of null (reading 'edgesOut')`, usar `npm install --legacy-peer-deps`.

3. Crear un archivo `.env` en la raíz (usar `.env.example` como referencia):
   ```
   PORT=3000
   ```

4. Iniciar en modo desarrollo:
   ```bash
   npm run start:dev
   ```

## Scripts disponibles

```bash
npm run start:dev   # Desarrollo con recarga automática
npm run build       # Compila a /dist
npm run start:prod  # Ejecuta el build
npm run lint        # Oxlint
npm run test        # Pruebas unitarias
```

## Nats
```
docker run -d --name nats --network nats -p 4222:4222 -p 8222:8222 nats
```
