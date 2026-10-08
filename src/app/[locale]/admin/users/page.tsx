'use client';

import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Shield, ShieldCheck, Mail, Lock, User as UserIcon, 
  Trash2, Edit3, CheckCircle2, AlertCircle, RefreshCw, Key
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'ADMIN',
    active: true,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al cargar usuarios' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'ADMIN',
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      password: '', // Leave empty unless changing
      role: user.role,
      active: user.active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingUser) {
        // PUT update
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage({ type: 'success', text: 'Usuario actualizado correctamente.' });
          setIsModalOpen(false);
          fetchUsers();
        } else {
          setMessage({ type: 'error', text: data.error || 'Error al actualizar usuario' });
        }
      } else {
        // POST create
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage({ type: 'success', text: `Usuario ${data.user.username} creado exitosamente.` });
          setIsModalOpen(false);
          fetchUsers();
        } else {
          setMessage({ type: 'error', text: data.error || 'Error al crear usuario' });
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error en la petición' });
    }
  };

  const toggleUserStatus = async (user: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !user.active }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`¿Estás seguro de eliminar el usuario "${username}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Usuario eliminado exitosamente.' });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al eliminar usuario' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-base-300 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Gestión de Usuarios Administradores
          </h1>
          <p className="text-base-content/70 mt-1">
            Administra los usuarios con acceso al panel de control de Idealy, asigna roles y gestiona credenciales en PostgreSQL.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchUsers} disabled={loading} className="btn btn-outline btn-sm gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm gap-2">
            <UserPlus className="w-4 h-4" />
            Agregar Usuario
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} shadow-sm`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-base-300 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Usuarios Registrados ({users.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content/60 font-medium">Cargando usuarios de la base de datos...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-base-content/30 mx-auto" />
            <p className="text-base-content/70 font-medium">No hay usuarios registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-md w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th>Usuario / Nombre</th>
                  <th>Correo Electrónico</th>
                  <th>Rol / Permisos</th>
                  <th>Estado</th>
                  <th>Fecha de Registro</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase();

                  return (
                    <tr key={u.id} className="hover:bg-base-50/50 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-extrabold flex items-center justify-center text-base border border-primary/20">
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-base-content">{u.name}</div>
                            <div className="text-xs text-base-content/60 font-mono">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="font-medium text-sm text-base-content/80">{u.email}</td>
                      <td>
                        <span
                          className={`badge font-bold gap-1 ${
                            u.role === 'SUPER_ADMIN'
                              ? 'badge-warning text-warning-content'
                              : u.role === 'ADMIN'
                              ? 'badge-primary'
                              : 'badge-ghost'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleUserStatus(u)}
                          className={`badge cursor-pointer transition-all font-bold ${
                            u.active ? 'badge-success' : 'badge-error'
                          }`}
                        >
                          {u.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="text-xs text-base-content/60">
                        {new Date(u.createdAt).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="text-right space-x-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="btn btn-ghost btn-xs text-primary gap-1"
                          title="Editar Usuario"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          className="btn btn-ghost btn-xs text-error gap-1"
                          title="Eliminar Usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR USUARIO */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              {editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre completo */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Nombre Completo</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3.5 text-base-content/40" />
                  <input
                    type="text"
                    className="input input-bordered w-full pl-9"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mauricio González"
                    required
                  />
                </div>
              </div>

              {/* Nombre de usuario */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Nombre de Usuario (Username)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm text-base-content/40 font-bold">@</span>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-8"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="mauricio.idealy"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Correo Electrónico</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3.5 text-base-content/40" />
                  <input
                    type="email"
                    className="input input-bordered w-full pl-9"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hello@idealy.com.mx"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    {editingUser ? 'Nueva Contraseña (Opcional)' : 'Contraseña de Acceso'}
                  </span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3.5 text-base-content/40" />
                  <input
                    type="password"
                    className="input input-bordered w-full pl-9"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? 'Dejar en blanco para conservar la actual' : '••••••••'}
                    required={!editingUser}
                  />
                </div>
              </div>

              {/* Rol */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Rol y Permisos</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Acceso Total)</option>
                  <option value="ADMIN">ADMIN (Administrador)</option>
                  <option value="EDITOR">EDITOR (Publicaciones & Contenidos)</option>
                </select>
              </div>

              {/* Activo Switch */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <span className="label-text font-bold">Usuario Activo</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="modal-action">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary gap-2">
                  <Key className="w-4 h-4" />
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
