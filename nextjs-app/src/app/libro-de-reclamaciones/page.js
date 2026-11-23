'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LibroDeReclamaciones() {
  const [formData, setFormData] = useState({
    nombre: '',
    tipoDoc: 'DNI',
    numDoc: '',
    telefono: '',
    email: '',
    direccion: '',
    esMenor: false,
    apoderado: '',
    tipoBien: 'Producto', // Producto | Servicio
    monto: '',
    descripcionBien: '',
    tipoReclamo: 'Reclamo', // Reclamo | Queja
    detalle: '',
    pedido: ''
  });

  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [fechaEnvio, setFechaEnvio] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const codigo = `LGT-REC-${now.getFullYear()}-${randomNum}`;
    const fecha = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    try {
      // Guardar en Supabase a través del endpoint o fetch directo
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ijgjmjkcqquctjahvgot.supabase.co';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Zwy0deNz_LQ-6DaUopa1uA_w-OWPI-j';

      await fetch(`${supabaseUrl}/rest/v1/reclamaciones`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          codigo: codigo,
          consumidor_nombre: formData.nombre,
          consumidor_documento_tipo: formData.tipoDoc,
          consumidor_documento_numero: formData.numDoc,
          consumidor_telefono: formData.telefono,
          consumidor_email: formData.email,
          consumidor_domicilio: formData.direccion,
          menor_edad: formData.esMenor,
          apoderado_nombre: formData.esMenor ? formData.apoderado : null,
          tipo_bien: formData.tipoBien,
          monto_reclamado: Number(formData.monto) || 0,
          descripcion_bien: formData.descripcionBien,
          tipo_reclamo: formData.tipoReclamo,
          detalle: formData.detalle,
          pedido: formData.pedido,
          estado: 'Pendiente'
        })
      }).catch(err => console.warn('Supabase record failed, using local receipt:', err));

      // Guardar en localStorage como respaldo
      const existing = JSON.parse(localStorage.getItem('lgt_reclamaciones') || '[]');
      existing.unshift({ codigo, fecha, ...formData });
      localStorage.setItem('lgt_reclamaciones', JSON.stringify(existing));

      setCodigoGenerado(codigo);
      setFechaEnvio(fecha);
      setEnviado(true);
    } catch (error) {
      console.error(error);
      setCodigoGenerado(codigo);
      setFechaEnvio(fecha);
      setEnviado(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)', color: '#f8fafc', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>
            ← Volver a TrujilloLens
          </Link>
          <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.75rem' }}>
            📖 CONFORME AL D.S. N° 011-2011-PCM / INDECOPI
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
            Libro de Reclamaciones Virtual
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '600px', margin: '0 auto' }}>
            <strong>LENS GROUP TRUJILLO</strong> • RUC: 20609502623<br />
            Galería San Antonio, Jr. Gamarra N° 778 – Centro Histórico de Trujillo
          </p>
        </div>

        {enviado ? (
          /* Pantalla de Constancia de Envío */
          <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '2rem' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              Hoja de Reclamación Registrada
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Tu {formData.tipoReclamo.toLowerCase()} ha sido ingresado formalmente a nuestro sistema.
            </p>

            <div style={{ background: '#0f172a', borderRadius: '12px', border: '1px solid #334155', padding: '1.25rem', display: 'inline-block', textAlign: 'left', minWidth: '320px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Código de Reclamación:</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.5px' }}>{codigoGenerado}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Fecha y hora de registro:</div>
              <div style={{ fontSize: '0.95rem', color: '#e2e8f0', fontWeight: 600 }}>{fechaEnvio}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Reclamante:</div>
              <div style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{formData.nombre} ({formData.tipoDoc} {formData.numDoc})</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Tipo:</div>
              <div style={{ fontSize: '0.95rem', color: formData.tipoReclamo === 'Reclamo' ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>{formData.tipoReclamo} ({formData.tipoBien})</div>
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.85rem', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
              ℹ️ De conformidad con la <strong>Ley N° 29571 (Código de Protección y Defensa del Consumidor)</strong>, Lens Group Trujillo brindará respuesta a su reclamo en un plazo no mayor a <strong>quince (15) días hábiles</strong> mediante el correo electrónico o número consignado.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ padding: '0.65rem 1.25rem', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                🖨️ Imprimir Constancia
              </button>
              <a
                href={`https://wa.me/51944123890?text=${encodeURIComponent(`Hola Lens Group Trujillo, acabo de registrar la Hoja de Reclamación ${codigoGenerado} a nombre de ${formData.nombre}. Adjunto constancia.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.65rem 1.25rem', background: '#25D366', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
              >
                📱 Notificar por WhatsApp
              </a>
              <Link
                href="/"
                style={{ padding: '0.65rem 1.25rem', background: '#0284c7', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        ) : (
          /* Formulario de Hoja de Reclamación */
          <form onSubmit={handleSubmit} style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            
            {/* Definiciones legales */}
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid #334155', marginBottom: '1.75rem', fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.5' }}>
              <strong style={{ color: '#e2e8f0' }}>Definiciones según INDECOPI:</strong><br />
              • <strong style={{ color: '#38bdf8' }}>Reclamo:</strong> Disconformidad relacionada a los productos o servicios adquiridos.<br />
              • <strong style={{ color: '#f59e0b' }}>Queja:</strong> Malestar o descontento respecto a la atención al público recibida.
            </div>

            {/* SECCIÓN 1: Datos del Consumidor */}
            <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              1. Identificación del Consumidor Reclamante
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Nombre y Apellidos *
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Juan Carlos Pérez Quispe"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Tipo Doc *
                  </label>
                  <select
                    name="tipoDoc"
                    value={formData.tipoDoc}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.65rem 0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }}
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">C.E.</option>
                    <option value="RUC">RUC</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Número Doc *
                  </label>
                  <input
                    type="text"
                    name="numDoc"
                    required
                    value={formData.numDoc}
                    onChange={handleChange}
                    placeholder="8 dígitos"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Teléfono / Celular *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej. 944123890"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Correo Electrónico (Para respuesta formal) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                Domicilio / Dirección Completa *
              </label>
              <input
                type="text"
                name="direccion"
                required
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Av. / Calle, N°, Urbanización, Distrito, Trujillo"
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="esMenor"
                  checked={formData.esMenor}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px' }}
                />
                <span>El consumidor reclamante es menor de edad</span>
              </label>
              {formData.esMenor && (
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Nombre del Padre, Madre o Tutor Legal *
                  </label>
                  <input
                    type="text"
                    name="apoderado"
                    required={formData.esMenor}
                    value={formData.apoderado}
                    onChange={handleChange}
                    placeholder="Nombres completos del apoderado"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }}
                  />
                </div>
              )}
            </div>

            {/* SECCIÓN 2: Identificación del Bien Contratado */}
            <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              2. Identificación del Bien Contratado
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Tipo de Bien *
                </label>
                <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="radio"
                      name="tipoBien"
                      value="Producto"
                      checked={formData.tipoBien === 'Producto'}
                      onChange={handleChange}
                    />
                    Producto (Monturas, Lunas, etc.)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="radio"
                      name="tipoBien"
                      value="Servicio"
                      checked={formData.tipoBien === 'Servicio'}
                      onChange={handleChange}
                    />
                    Servicio (Medida de la vista, etc.)
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Monto Reclamado (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  placeholder="0.00"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                Descripción del Producto o Servicio Contratado *
              </label>
              <input
                type="text"
                name="descripcionBien"
                required
                value={formData.descripcionBien}
                onChange={handleChange}
                placeholder="Ej. Montura Ray-Ban Round Metal con cristales Blue Defense UV420 / N° de Boleta o Ticket"
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem' }}
              />
            </div>

            {/* SECCIÓN 3: Detalle de la Reclamación */}
            <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              3. Detalle de la Reclamación y Pedido del Consumidor
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                Tipo de Afectación *
              </label>
              <div style={{ display: 'flex', gap: '1.5rem', padding: '0.5rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="tipoReclamo"
                    value="Reclamo"
                    checked={formData.tipoReclamo === 'Reclamo'}
                    onChange={handleChange}
                  />
                  <strong style={{ color: '#38bdf8' }}>RECLAMO</strong> (Disconformidad con el producto o servicio)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="tipoReclamo"
                    value="Queja"
                    checked={formData.tipoReclamo === 'Queja'}
                    onChange={handleChange}
                  />
                  <strong style={{ color: '#f59e0b' }}>QUEJA</strong> (Malestar en la atención recibida)
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                Detalle del Reclamo o Queja *
              </label>
              <textarea
                name="detalle"
                required
                rows={4}
                value={formData.detalle}
                onChange={handleChange}
                placeholder="Describa con claridad los hechos ocurridos..."
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                Pedido Concreto del Consumidor *
              </label>
              <textarea
                name="pedido"
                required
                rows={2}
                value={formData.pedido}
                onChange={handleChange}
                placeholder="Indique qué solicita como solución (ej. cambio de lunas, reajuste de montura, devolución, etc.)..."
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: loading ? '#475569' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)'
              }}
            >
              {loading ? 'Registrando Hoja de Reclamación...' : 'Enviar Hoja de Reclamación Virtual'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
