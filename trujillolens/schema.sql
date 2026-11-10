-- ==============================================================================
-- LENS GROUP TRUJILLO — ESQUEMA COMPLETO DE BASE DE DATOS (SUPABASE / POSTGRESQL)
-- ==============================================================================
-- Instrucciones:
-- Copia y pega TODO este código en el "SQL Editor" de tu proyecto Supabase y haz clic en "RUN".
-- Habilita el acceso completo para la clave pública (anon) y crea datos iniciales para todas las secciones.
-- ==============================================================================

-- 0. EXTENSIÓN PARA UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA: usuarios (Administradores, Vendedores, Técnicos de Laboratorio)
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dni varchar UNIQUE NOT NULL,
  pin varchar NOT NULL,
  nombres varchar NOT NULL,
  apellidos varchar NOT NULL,
  rol varchar DEFAULT 'admin',
  activo boolean DEFAULT true,
  is_active boolean DEFAULT true,
  bloqueado_hasta timestamp with time zone,
  creado_en timestamp with time zone DEFAULT now()
);

-- 2. TABLA: pacientes (Ficha clínica y CRM)
CREATE TABLE IF NOT EXISTS pacientes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dni varchar UNIQUE NOT NULL,
  nombres varchar NOT NULL,
  apellido_paterno varchar NOT NULL,
  apellido_materno varchar NOT NULL DEFAULT '',
  celular varchar,
  fecha_nacimiento date,
  genero varchar,
  ocupacion varchar,
  direccion text,
  registrado_por uuid REFERENCES usuarios(id) ON DELETE SET NULL,
  creado_en timestamp with time zone DEFAULT now()
);

-- 3. TABLA: ventas (Comprobantes, Ventas de Mostrador y Pedidos)
CREATE TABLE IF NOT EXISTS ventas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_ticket varchar UNIQUE NOT NULL,
  paciente_id uuid REFERENCES pacientes(id) ON DELETE SET NULL,
  paciente_nombre varchar,
  paciente_dni varchar,
  paciente_telefono varchar,
  vendedor_id uuid REFERENCES usuarios(id) ON DELETE SET NULL,
  sucursal_id uuid,
  tipo_doc varchar DEFAULT 'boleta',
  montura_marca varchar,
  montura_descripcion text,
  luna_descripcion text,
  precio_total numeric DEFAULT 0,
  costo_total numeric DEFAULT 0,
  metodo_pago varchar DEFAULT 'Efectivo',
  condicion_pago varchar DEFAULT 'Pagado 100%',
  tipo_pedido varchar DEFAULT 'Normal',
  estado_entrega varchar DEFAULT 'Por Entregar',
  fecha_entrega timestamp with time zone,
  creado_en timestamp with time zone DEFAULT now()
);

-- 4. TABLA: ordenes_laboratorio (Seguimiento de Taller y Biselado)
CREATE TABLE IF NOT EXISTS ordenes_laboratorio (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  venta_id uuid REFERENCES ventas(id) ON DELETE CASCADE,
  numero_ticket varchar NOT NULL,
  estado varchar DEFAULT 'En Cola',
  urgente boolean DEFAULT false,
  notas_taller text,
  creado_en timestamp with time zone DEFAULT now(),
  iniciado_en timestamp with time zone,
  completado_en timestamp with time zone
);

-- 5. TABLA: marcas_mercaderia (Marcas de Monturas y Lunas)
CREATE TABLE IF NOT EXISTS marcas_mercaderia (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre varchar NOT NULL UNIQUE
);

-- 6. TABLA: catalogo_mercaderia (Catálogo de Productos para la Venta)
CREATE TABLE IF NOT EXISTS catalogo_mercaderia (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo_sistema varchar UNIQUE NOT NULL,
  nombre_autogenerado varchar,
  modelo varchar,
  categoria varchar,
  material varchar,
  marca_id uuid REFERENCES marcas_mercaderia(id) ON DELETE SET NULL,
  etiquetas_publico jsonb DEFAULT '{}',
  etiquetas_tecnicas jsonb DEFAULT '{}',
  precio_venta numeric DEFAULT 0,
  activo boolean DEFAULT true,
  imagen text,
  creado_en timestamp with time zone DEFAULT now()
);

-- 7. TABLA: stock_mercaderia (Existencias por Producto)
CREATE TABLE IF NOT EXISTS stock_mercaderia (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id uuid REFERENCES catalogo_mercaderia(id) ON DELETE CASCADE,
  cantidad int DEFAULT 0
);

-- 8. TABLA: inventario_monturas (Control de Stock Físico en Tienda)
CREATE TABLE IF NOT EXISTS inventario_monturas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo varchar UNIQUE NOT NULL,
  marca varchar NOT NULL,
  modelo varchar NOT NULL,
  color varchar,
  tipo varchar,
  categoria varchar,
  cantidad int DEFAULT 0,
  umbral_minimo int DEFAULT 3,
  costo numeric DEFAULT 0,
  precio_venta numeric DEFAULT 0,
  activo boolean DEFAULT true,
  sucursal_id uuid,
  actualizado_en timestamp with time zone DEFAULT now()
);

-- 9. TABLA: banco_lunas (Kardex de Cristales Oftálmicos)
CREATE TABLE IF NOT EXISTS banco_lunas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  catalogo_luna_id uuid,
  marca varchar DEFAULT 'Lunas',
  tipo_cristal varchar,
  tratamiento varchar,
  cantidad int DEFAULT 0,
  cantidad_minima int DEFAULT 5,
  grado varchar,
  esfera numeric DEFAULT 0,
  cilindro numeric DEFAULT 0,
  costo numeric DEFAULT 0,
  precio_venta numeric DEFAULT 0,
  sucursal_id uuid,
  actualizado_en timestamp with time zone DEFAULT now()
);

-- ==============================================================================
-- DESHABILITAR ROW LEVEL SECURITY (RLS) PARA ACCESO DIRECTO CON ANON KEY
-- ==============================================================================
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE ventas DISABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_laboratorio DISABLE ROW LEVEL SECURITY;
ALTER TABLE marcas_mercaderia DISABLE ROW LEVEL SECURITY;
ALTER TABLE catalogo_mercaderia DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_mercaderia DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_monturas DISABLE ROW LEVEL SECURITY;
ALTER TABLE banco_lunas DISABLE ROW LEVEL SECURITY;

-- Otorgar todos los permisos a las conexiones públicas y autenticadas
GRANT ALL ON TABLE usuarios TO anon, authenticated, service_role;
GRANT ALL ON TABLE pacientes TO anon, authenticated, service_role;
GRANT ALL ON TABLE ventas TO anon, authenticated, service_role;
GRANT ALL ON TABLE ordenes_laboratorio TO anon, authenticated, service_role;
GRANT ALL ON TABLE marcas_mercaderia TO anon, authenticated, service_role;
GRANT ALL ON TABLE catalogo_mercaderia TO anon, authenticated, service_role;
GRANT ALL ON TABLE stock_mercaderia TO anon, authenticated, service_role;
GRANT ALL ON TABLE inventario_monturas TO anon, authenticated, service_role;
GRANT ALL ON TABLE banco_lunas TO anon, authenticated, service_role;

-- ==============================================================================
-- DATOS INICIALES (SEED DATA) — RELLENO PARA TODAS LAS SECCIONES ("CARPETAS")
-- ==============================================================================

-- 1. USUARIOS DEL SISTEMA
INSERT INTO usuarios (dni, pin, nombres, apellidos, rol) 
VALUES 
  ('12345678', '1234', 'Admin', 'Sistema', 'admin'),
  ('70123456', '2026', 'Carlos', 'Miranda', 'superadmin'),
  ('45892147', '1122', 'Valeria', 'Gómez', 'seller')
ON CONFLICT (dni) DO UPDATE 
SET pin = EXCLUDED.pin, rol = EXCLUDED.rol;

-- 2. PACIENTES
INSERT INTO pacientes (dni, nombres, apellido_paterno, apellido_materno, celular, ocupacion, direccion)
VALUES
  ('45892147', 'Ana Lucía', 'Morales', 'Chávez', '944123890', 'Arquitecta', 'Jr. Pizarro 420, Trujillo'),
  ('71245890', 'Roberto', 'Castillo', 'Díaz', '958741236', 'Docente Universitario', 'Av. España 1240, Trujillo'),
  ('42369854', 'Mariana', 'Paredes', 'Silva', '962145873', 'Ingeniera de Sistemas', 'Urb. California Mz B Lt 4'),
  ('70963215', 'Andrea', 'Fernández', 'Ruiz', '974581236', 'Diseñadora Gráfica', 'Av. Mansiche 890, Trujillo'),
  ('18456321', 'Jorge Luis', 'Vásquez', 'Cruz', '949852147', 'Contador Público', 'Jr. San Martín 550, Trujillo')
ON CONFLICT (dni) DO NOTHING;

-- 3. MARCAS
INSERT INTO marcas_mercaderia (nombre) 
VALUES 
  ('Ray-Ban'), ('Oakley'), ('Miraflex'), ('Nano Vista'), 
  ('Vogue'), ('Carrera'), ('InkaLens'), ('Sylvane'), ('Mely')
ON CONFLICT (nombre) DO NOTHING;

-- 4. VENTAS
INSERT INTO ventas (
  numero_ticket, paciente_nombre, paciente_dni, paciente_telefono, 
  montura_marca, montura_descripcion, luna_descripcion, precio_total, costo_total, 
  metodo_pago, condicion_pago, tipo_pedido, estado_entrega
) VALUES
  ('LGT-2025-0342', 'Carlos Mendoza Quispe', '45892148', '944123890', 'Ray-Ban', 'Montura Ray-Ban Round Metal + Cristales Antirreflejo Blue Protect UV400', 'Blue Protect UV400', 540, 210, 'Yape', 'Pagado 100%', 'Normal', 'Listo para Recojo'),
  ('LGT-2025-0210', 'Roberto Castillo Díaz', '71245890', '958741236', 'InkaLens', 'Cristales Fotocromáticos Transition Gen 8 + Montura Titanio Flexible', 'Fotocromático Gen 8', 460, 175, 'Tarjeta Visa', 'Pagado 100%', 'Urgente', 'En Taller'),
  ('LGT-2025-0105', 'Mariana Paredes Silva', '42369854', '962145873', 'Vogue', 'Lunas Progresivas Digitales FreeForm + Montura Vogue Eyewear', 'Antirreflejo HD Premium', 680, 230, 'Efectivo', 'Pagado 100%', 'Normal', 'En Taller'),
  ('LGT-2025-0450', 'Andrea Fernández Ruiz', '70963215', '974581236', 'Oakley', 'Gafas de Sol Oakley Polarizadas con Graduación Espejada', 'Polarizado + Espejado Azul', 590, 245, 'Plin', 'Pagado 100%', 'Normal', 'Por Iniciar'),
  ('LGT-2025-0500', 'Jorge Luis Vásquez', '18456321', '949852147', 'Carrera', 'Montura Ultraligera de Titanio + Cristales Monofocales Crizal', 'Crizal Easy UV', 490, 190, 'Yape', 'Pagado 100%', 'Normal', 'Listo para Recojo'),
  ('LGT-2026-0612', 'Luciana Alva Benites', '72658412', '941582369', 'Sylvane', 'Montura Oftálmica Sylvane + Cristales Blue Defense para Trabajo Digital', 'Blue Defense UV420', 380, 135, 'Transferencia BCP', 'Pagado 100%', 'Urgente', 'En Taller'),
  ('LGT-2026-0615', 'Víctor Hugo Ramos', '18965412', '955214876', 'Ray-Ban', 'Gafas de Sol Ray-Ban Aviator Polarized G-15', 'Polarizado G-15', 520, 250, 'Efectivo', 'Pagado 100%', 'Normal', 'Por Iniciar'),
  ('LGT-2026-0620', 'Camila Sotelo Barreto', '75321458', '966325874', 'Mely', 'Montura Mely Habana + Cristales Antirreflejo SuperClean', 'Antirreflejo Hidrofóbico', 320, 115, 'Yape', 'Pagado 100%', 'Normal', 'Listo para Recojo')
ON CONFLICT (numero_ticket) DO NOTHING;

-- 5. ÓRDENES DE LABORATORIO
INSERT INTO ordenes_laboratorio (numero_ticket, estado, urgente, notas_taller, venta_id)
SELECT 
  v.numero_ticket,
  CASE 
    WHEN v.numero_ticket IN ('LGT-2025-0342', 'LGT-2025-0500', 'LGT-2026-0620') THEN 'Listo para Recojo'
    WHEN v.numero_ticket IN ('LGT-2025-0210', 'LGT-2025-0105', 'LGT-2026-0612') THEN 'En Proceso'
    ELSE 'En Cola'
  END,
  CASE 
    WHEN v.numero_ticket IN ('LGT-2025-0210', 'LGT-2026-0612') THEN true 
    ELSE false 
  END,
  v.paciente_nombre || ' - ' || v.montura_descripcion,
  v.id
FROM ventas v
WHERE NOT EXISTS (
  SELECT 1 FROM ordenes_laboratorio o WHERE o.numero_ticket = v.numero_ticket
);

-- 6. INVENTARIO DE MONTURAS
INSERT INTO inventario_monturas (codigo, marca, modelo, color, tipo, categoria, cantidad, umbral_minimo, costo, precio_venta)
VALUES
  ('INV-001', 'Ray-Ban', 'Aviator Classic Dorado (RB3025)', 'Dorado / G-15', 'Metal', 'Sol Polarizado', 2, 5, 250, 520),
  ('INV-002', 'Ray-Ban', 'Wayfarer Midnight Black (RB2140)', 'Negro Brillante', 'Acetato', 'Sol Clásico', 8, 4, 230, 480),
  ('INV-003', 'Oakley', 'Holbrook Polarized OO9102', 'Negro Mate', 'O Matter', 'Sol Deportivo', 3, 5, 245, 590),
  ('INV-004', 'Vogue', 'Cat-Eye VO5211S Acetato', 'Carey Habana', 'Acetato', 'Oftálmico Femenino', 4, 4, 180, 420),
  ('INV-005', 'Carrera', 'Champion Classic Aviador', 'Negro / Rojo', 'Optyl', 'Sol Unisex', 6, 3, 190, 490),
  ('INV-006', 'InkaLens', 'Titanium Flex TR-90 Ultraligero', 'Azul Marino', 'TR-90 / Titanio', 'Oftálmico Flexible', 9, 5, 130, 360),
  ('INV-007', 'Sylvane', 'Elegance Rose Gold Metálico', 'Rose Gold', 'Metal Quirúrgico', 'Oftálmico Premium', 2, 4, 135, 380),
  ('INV-008', 'Mely', 'Fashion Acetato Habana', 'Habana Miel', 'Acetato', 'Oftálmico Juvenil', 11, 5, 115, 320)
ON CONFLICT (codigo) DO UPDATE 
SET cantidad = EXCLUDED.cantidad, precio_venta = EXCLUDED.precio_venta;

-- 7. BANCO DE LUNAS (KARDEX DE CRISTALES)
INSERT INTO banco_lunas (marca, tipo_cristal, tratamiento, cantidad, cantidad_minima, costo, precio_venta)
VALUES
  ('Lunas', 'Cristales Blue Protect UV400', 'Blue Protect / Antirreflejo Digital', 3, 8, 70, 180),
  ('Lunas', 'Progresivo Digital FreeForm', 'Antirreflejo HD Premium', 7, 4, 190, 580),
  ('Lunas', 'Fotocromático Transition Gen 8', 'Fotosensible Gris / UV400', 5, 6, 140, 390),
  ('Lunas', 'Policarbonato Antirreflejo SuperClean', 'Hidrofóbico Antirreflejo', 12, 5, 50, 140),
  ('Lunas', 'Resina Monofocal Alto Índice 1.67', 'Filtro Luz Azul y Rayaduras', 8, 4, 90, 260)
ON CONFLICT DO NOTHING;

-- 8. CATÁLOGO DE PRODUCTOS (NIÑOS Y ADULTOS)
INSERT INTO catalogo_mercaderia (codigo_sistema, nombre_autogenerado, modelo, categoria, material, precio_venta, activo, imagen)
VALUES
  ('KID-SILI-001', 'Miraflex Flexible Azul 0-3 años', 'Flexible Azul', 'Niños', 'Silicona Flexible', 120, true, 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80'),
  ('KID-TR90-002', 'Nano Vista Deportivo TR90 4-8 años', 'Deportivo TR90', 'Niños', 'TR-90', 150, true, 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&q=80'),
  ('KID-SILI-003', 'InkaLens Kids Princesa Rosa 4-8 años', 'Princesa Rosa', 'Niños', 'Silicona Flexible', 110, true, 'https://plus.unsplash.com/premium_photo-1675807963495-2ba19356cc5b?w=400&q=80'),
  ('KID-TR90-004', 'Ray-Ban Junior Wayfarer Kids 9-12 años', 'Wayfarer Kids', 'Niños', 'Acetato/TR-90', 210, true, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80'),
  ('ADU-ACE-001', 'Ray-Ban Wayfarer Classic Negro', 'Wayfarer Classic', 'Adultos', 'Acetato', 420, true, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80'),
  ('ADU-MET-002', 'Oakley Holbrook Metal Plata', 'Holbrook', 'Adultos', 'Metal', 480, true, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80'),
  ('ADU-ACE-003', 'Vogue Cat-Eye Elegance Carey', 'Cat-Eye Elegance', 'Adultos', 'Acetato', 350, true, 'https://images.unsplash.com/photo-1589785890913-912c96c4b2ff?w=400&q=80'),
  ('ADU-TIT-004', 'Carrera Titanium Aviator Dorado', 'Titanium Aviator', 'Adultos', 'Titanio', 550, true, 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80')
ON CONFLICT (codigo_sistema) DO UPDATE 
SET precio_venta = EXCLUDED.precio_venta, activo = EXCLUDED.activo;

-- Refrescar la caché del esquema PostgREST
NOTIFY pgrst, 'reload schema';
