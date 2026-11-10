import { NextResponse } from "next/server";
import { supabaseAdminRequest } from "../../../lib/supabase-admin";

export async function GET() {
    try {
        // 1. Traemos el catálogo de mercadería activo
        const productos = await supabaseAdminRequest("catalogo_mercaderia", {
            params: {
                select: "id,codigo_sistema,nombre_autogenerado,modelo,categoria,material,marca_id,etiquetas_publico,etiquetas_tecnicas,precio_venta,activo",
                activo: "eq.true"
            }
        });

        // 2. Traemos las marcas y stock de mercadería en paralelo
        const [stockRegistros, marcasRegistros] = await Promise.all([
            supabaseAdminRequest("stock_mercaderia", {
                params: { select: "producto_id,cantidad" }
            }).catch(() => []),
            supabaseAdminRequest("marcas_mercaderia", {
                params: { select: "id,nombre" }
            }).catch(() => [])
        ]);

        if (!Array.isArray(productos)) {
            return NextResponse.json([]);
        }

        const stockList = Array.isArray(stockRegistros) ? stockRegistros : [];
        const marcasList = Array.isArray(marcasRegistros) ? marcasRegistros : [];
        const marcaMap = Object.fromEntries(marcasList.map((m) => [m.id, m.nombre]));

        // Mapa de imágenes según categoría/material de fallback de alta calidad
        const getImageFallback = (prod) => {
            const cat = (prod.categoria || "").toLowerCase();
            const mat = (prod.material || "").toLowerCase();
            if (cat.includes("solar") || cat.includes("sol")) return "/images/sunglasses_wayfarer.jpg";
            if (cat.includes("contacto")) return "/images/contact_lenses.jpg";
            if (mat.includes("metal") || mat.includes("titanio")) return "/images/optics_titanium.jpg";
            return "/images/optics_acetate.jpg";
        };

        // 3. Cruzamos la información: sumamos stock y asignamos marca e imagen
        const productosConStock = productos.map((prod) => {
            const stocksDelProducto = stockList.filter((s) => s.producto_id === prod.id);
            const stockTotal = stocksDelProducto.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);

            return {
                ...prod,
                marca: marcaMap[prod.marca_id] || "Lens Group",
                imagen: prod.imagen || getImageFallback(prod),
                stock_total: stockTotal
            };
        });

        // 4. Filtramos para enviar solo los productos que tengan un stock mayor a 0
        const disponibles = productosConStock.filter((prod) => prod.stock_total > 0);

        return NextResponse.json(disponibles);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 503 });
    }
}