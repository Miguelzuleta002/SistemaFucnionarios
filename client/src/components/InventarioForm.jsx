import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const InventarioForm = ({ inventario, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    serial: '',
    modelo: '',
    descripcion: '',
    color: '',
    precio: '',
    marca_id: '',
    estado_equipo_id: '',
    tipo_equipo_id: ''
  });
  
  const [opciones, setOpciones] = useState({ marcas: [], estados: [], tipos: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar opciones para los selects
    const loadOpciones = async () => {
      try {
        const res = await api.get('/inventarios/opciones');
        setOpciones(res.data.data);
      } catch (err) {
        console.error("Error cargando opciones", err);
      }
    };
    loadOpciones();

    if (inventario) {
      setFormData({
        ...inventario,
        marca_id: inventario.marca_id || '',
        estado_equipo_id: inventario.estado_equipo_id || '',
        tipo_equipo_id: inventario.tipo_equipo_id || ''
      });
    }
  }, [inventario]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (inventario?.id) {
        await api.put(`/inventarios/${inventario.id}`, formData);
      } else {
        await api.post('/inventarios', formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar inventario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }} className="fade-in">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
          {inventario?.id ? 'Editar Inventario' : 'Nuevo Inventario'}
        </h2>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label>Serial</label>
            <input type="text" name="serial" className="input-field" value={formData.serial} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Modelo</label>
            <input type="text" name="modelo" className="input-field" value={formData.modelo} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Color</label>
            <input type="text" name="color" className="input-field" value={formData.color || ''} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Precio</label>
            <input type="number" name="precio" className="input-field" value={formData.precio || ''} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Marca</label>
            <select name="marca_id" className="input-field" value={formData.marca_id} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {opciones.marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          
          <div className="input-group">
            <label>Tipo de Equipo</label>
            <select name="tipo_equipo_id" className="input-field" value={formData.tipo_equipo_id} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {opciones.tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Estado del Equipo</label>
            <select name="estado_equipo_id" className="input-field" value={formData.estado_equipo_id} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {opciones.estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Descripción</label>
            <textarea name="descripcion" className="input-field" value={formData.descripcion || ''} onChange={handleChange} rows="3" />
          </div>
          
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-light)' }} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Inventario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventarioForm;
