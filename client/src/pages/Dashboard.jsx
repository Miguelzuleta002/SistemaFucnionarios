import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Users, Box } from 'lucide-react';
import api from '../services/api';
import FuncionarioForm from '../components/FuncionarioForm';
import InventarioForm from '../components/InventarioForm';

const Dashboard = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  
  const [activeTab, setActiveTab] = useState(usuario.rol === 'Administrador' ? 'funcionarios' : 'inventarios');
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [showInventarioForm, setShowInventarioForm] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [selectedInventario, setSelectedInventario] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'funcionarios' ? '/funcionarios' : '/inventarios';
      const response = await api.get(endpoint);
      setData(response.data.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 403) {
        setError('No tienes permisos para ver este módulo.');
      } else {
        setError(`Error al cargar ${activeTab}`);
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Está seguro que desea eliminar este ${activeTab === 'funcionarios' ? 'funcionario' : 'inventario'}?`)) {
      try {
        await api.delete(`/${activeTab}/${id}`);
        fetchData();
      } catch (err) {
        alert(`Error al eliminar ${activeTab === 'funcionarios' ? 'funcionario' : 'inventario'}. Solo el administrador tiene permiso.`);
      }
    }
  };

  const handleMockAction = (accion) => {
    // Esto ya no se usa, pero lo dejamos por si acaso
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div style={{ width: '250px', background: 'var(--bg-card)', borderRight: '1px solid var(--border-light)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', color: 'var(--primary)' }}>
          <Users size={28} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Sistema</h2>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {usuario.rol === 'Administrador' && (
            <div 
              onClick={() => setActiveTab('funcionarios')}
              style={{ 
                background: activeTab === 'funcionarios' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', 
                color: activeTab === 'funcionarios' ? 'var(--primary)' : 'var(--text-muted)', 
                padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: '500', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
              <Users size={18} /> Funcionarios
            </div>
          )}
          
          <div 
            onClick={() => setActiveTab('inventarios')}
            style={{ 
              background: activeTab === 'inventarios' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', 
              color: activeTab === 'inventarios' ? 'var(--primary)' : 'var(--text-muted)', 
              padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: '500', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
            <Box size={18} /> Inventarios
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Conectado como:</p>
          <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>{usuario.email} <br/><span className="badge badge-active">{usuario.rol}</span></p>
          
          <button onClick={handleLogout} className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
              Gestión de {activeTab}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {activeTab === 'funcionarios' ? 'Administra el personal de la entidad' : 'Listado de equipos y marcas'}
            </p>
          </div>
          
          {/* BOTÓN CREAR: Solo Admin puede crear Funcionarios o Inventarios/Marcas/Etc */}
          {usuario.rol === 'Administrador' && activeTab === 'funcionarios' && (
            <button onClick={() => { setSelectedFuncionario(null); setShowForm(true); }} className="btn btn-primary">
              <Plus size={18} /> Nuevo Funcionario
            </button>
          )}

          {usuario.rol === 'Administrador' && activeTab === 'inventarios' && (
            <button onClick={() => { setSelectedInventario(null); setShowInventarioForm(true); }} className="btn btn-primary">
              <Plus size={18} /> Nuevo Inventario
            </button>
          )}
        </div>

        {error ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
            {error}
          </div>
        ) : (
          <div className="glass-panel table-container">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando datos...</div>
            ) : (
              <table className="premium-table">
                <thead>
                  {activeTab === 'funcionarios' ? (
                    <tr>
                      <th>Documento</th><th>Nombres</th><th>Apellidos</th><th>Email</th><th>Teléfono</th><th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Serial</th><th>Modelo</th><th>Marca</th><th>Estado</th><th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No hay registros en {activeTab}.
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => (
                      <tr key={item.id || idx}>
                        {activeTab === 'funcionarios' ? (
                          <>
                            <td>{item.documento}</td>
                            <td style={{ fontWeight: '500' }}>{item.nombres}</td>
                            <td>{item.apellidos}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{item.email}</td>
                            <td>{item.telefono || 'N/A'}</td>
                            <td style={{ textAlign: 'right' }}>
                              {usuario.rol === 'Administrador' && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                  <button onClick={() => { setSelectedFuncionario(item); setShowForm(true); }} className="btn" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
                                    <Edit2 size={16} color="var(--primary)" />
                                  </button>
                                  <button onClick={() => handleDelete(item.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{item.serial || 'TEST-001'}</td>
                            <td style={{ fontWeight: '500' }}>{item.modelo || 'Generic Model'}</td>
                            <td>{item.marca || 'Lenovo'}</td>
                            <td><span className="badge badge-active">{item.estado || 'En uso'}</span></td>
                            <td style={{ textAlign: 'right' }}>
                              {usuario.rol === 'Administrador' ? (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                  <button onClick={() => { setSelectedInventario(item); setShowInventarioForm(true); }} className="btn" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
                                    <Edit2 size={16} color="var(--primary)" />
                                  </button>
                                  <button onClick={() => handleDelete(item.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Solo lectura</span>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showForm && activeTab === 'funcionarios' && (
        <FuncionarioForm 
          funcionario={selectedFuncionario} 
          onClose={() => setShowForm(false)} 
          onSave={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}

      {showInventarioForm && activeTab === 'inventarios' && (
        <InventarioForm 
          inventario={selectedInventario} 
          onClose={() => setShowInventarioForm(false)} 
          onSave={() => {
            setShowInventarioForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
