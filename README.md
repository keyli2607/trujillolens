# 👓 TrujilloLens — Óptica y Laboratorio Oftalmológico

Sistema integral de gestión óptica, catálogo digital, laboratorio y panel administrativo inteligente con **LensBot**.

---

## 🚀 Tecnologías

- **Frontend & App:** [Next.js](https://nextjs.org/) (App Router, React SSR)
- **Base de Datos & Auth:** [Supabase](https://supabase.com/)
- **Panel Administrativo:** Panel de decisiones, CRM de pacientes, gestión de inventario/Cardex y facturación electrónica SUNAT
- **Asistente Virtual:** **LensBot** — Asistente inteligente operativo en tiempo real

---

## 📁 Estructura del Proyecto

```text
trujillolens/
├── nextjs-app/             # Aplicación principal Next.js
│   ├── src/                # Código fuente (App Router, componentes, APIs)
│   ├── public/             # Panel administrativo (admin.html), assets y estilos
│   ├── package.json        # Dependencias y scripts
│   └── next.config.mjs     # Configuración de Next.js
├── schema.sql              # Estructura y tablas de base de datos Supabase
└── README.md
```

---

## 🛠️ Instalación y Uso

1. **Entrar al directorio de la aplicación:**
   ```bash
   cd nextjs-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación:**
   - Vitrina y catálogo público: `http://localhost:3000`
   - Panel administrativo: `http://localhost:3000/admin.html`
   - Seguimiento de órdenes: `http://localhost:3000/seguimiento`

---

## 📄 Licencia

Desarrollado para Lens Group Trujillo. Todos los derechos reservados.
