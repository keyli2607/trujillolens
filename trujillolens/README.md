# TrujilloLensGroup

## Panel administrativo y Supabase local

La aplicación Next.js incluye un panel privado en `/admin` para consultar pacientes, ventas, órdenes de laboratorio e inventario. También permite registrar pacientes, actualizar estados del taller e importar de forma idempotente los pedidos de `orders.json`.

Configura `nextjs-app/.env.local` a partir de `nextjs-app/.env.example`:

```env
SUPABASE_URL=http://127.0.0.1:44321
SUPABASE_SERVICE_ROLE_KEY=clave_service_role_local
ADMIN_SESSION_SECRET=una_frase_secreta_larga
```

`SUPABASE_SERVICE_ROLE_KEY` solo se usa en rutas server-side y nunca debe exponerse al navegador. Con Supabase local activo, inicia Next.js desde `nextjs-app` con `npm run dev` y abre `http://localhost:3000/admin`.

El botón **Importar orders.json** evita duplicados por `numero_ticket`. Revísalo antes de ejecutarlo porque crea pacientes, ventas y órdenes en la base local.