import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const FuncionarioForm = ({ funcionario, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    documento: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (funcionario) {
      setFormData(funcionario);
    }
  }, [funcionario]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (funcionario?.id) {
        await api.put(`/funcionarios/${funcionario.id}`, formData);
      } else {
        await api.post('/funcionarios', formData);
      }
      onSave(); // Refrescar lista
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar funcionario');
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
          {funcionario?.id ? 'Editar Funcionario' : 'Nuevo Funcionario'}
        </h2>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label>Nombres</label>
            <input type="text" name="nombres" className="input-field" value={formData.nombres} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Apellidos</label>
            <input type="text" name="apellidos" className="input-field" value={formData.apellidos} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Documento</label>
            <input type="text" name="documento" className="input-field" value={formData.documento} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Teléfono</label>
            <input type="text" name="telefono" className="input-field" value={formData.telefono || ''} onChange={handleChange} />
          </div>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Dirección</label>
            <input type="text" name="direccion" className="input-field" value={formData.direccion || ''} onChange={handleChange} />
          </div>
          
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-light)' }} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Funcionario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuncionarioForm;
