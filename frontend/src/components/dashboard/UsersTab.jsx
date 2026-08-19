import React, { useState } from "react";

export default function UsersTab({
  usersList = [],
  currentUser = {},
  onCreateUser,
  onUpdatePassword,
  onResetPassword,
  onDeleteUser
}) {
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "Vendedor" });
  const [editingUserPasswordId, setEditingUserPasswordId] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState("");

  const handleSubmitNewUser = (e) => {
    e.preventDefault();
    if (!newUser.username.trim()) return;
    onCreateUser(newUser.username.trim(), newUser.password.trim(), newUser.role);
    setNewUser({ username: "", password: "", role: "Vendedor" });
  };

  const handleUpdatePassword = (userId) => {
    if (!newPasswordVal.trim()) return;
    onUpdatePassword(userId, newPasswordVal.trim());
    setEditingUserPasswordId(null);
    setNewPasswordVal("");
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-slate-100 font-sans">Gestionar Cuentas de Usuario</h2>
        <p className="text-xs text-slate-400 mt-1">Crea, modifica contraseñas o elimina accesos de Vendedores y Administradores.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Alta */}
        <div className="bg-[#0f131c]/30 border border-white/5 p-5 rounded-2xl h-fit">
          <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Nuevo Usuario</h3>
          <form onSubmit={handleSubmitNewUser} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-medium"
                placeholder="Ej: vendedor_juan"
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Contraseña Inicial
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20"
                placeholder="Por defecto: 123456"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Rol del Usuario
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-semibold"
              >
                <option value="Vendedor" className="bg-[#0f131c]">Vendedor</option>
                <option value="Admin" className="bg-[#0f131c]">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 text-xs rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-black/10 cursor-pointer border-0"
            >
              Crear Usuario
            </button>
          </form>
        </div>

        {/* Tabla de Usuarios */}
        <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-white/5 bg-[#0f131c]/30 h-fit">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-[#0f131c]/80 text-[10px] uppercase font-bold tracking-wider text-slate-500 select-none">
                <th className="p-4">Usuario</th>
                <th className="p-4">Rol</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {usersList.map(user => {
                const isSelf = currentUser && currentUser.id === user.id;
                const isEditing = editingUserPasswordId === user.id;
                
                return (
                  <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-bold text-slate-200">
                      <span>{user.username}</span>
                      {isSelf && (
                        <span className="ml-2 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Tú
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        user.role === "Admin" 
                          ? "bg-[#6b21a8]/20 text-[#c084fc] border border-[#a855f7]/30" 
                          : "bg-[#1e3a8a]/20 text-[#60a5fa] border border-[#3b82f6]/30"
                      }`}>
                        {user.role === "Admin" ? "Administrador" : "Vendedor"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="text"
                            value={newPasswordVal}
                            onChange={(e) => setNewPasswordVal(e.target.value)}
                            className="bg-black/60 border border-white/15 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-slate-500 w-32 font-mono"
                            placeholder="Nueva contraseña"
                          />
                          <button
                            onClick={() => handleUpdatePassword(user.id)}
                            className="text-xs font-bold text-green-400 hover:text-green-300 cursor-pointer border-0 bg-transparent"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => {
                              setEditingUserPasswordId(null);
                              setNewPasswordVal("");
                            }}
                            className="text-xs font-bold text-slate-500 hover:text-slate-400 cursor-pointer border-0 bg-transparent"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-3.5">
                          <button
                            onClick={() => {
                              setEditingUserPasswordId(user.id);
                              setNewPasswordVal("");
                            }}
                            className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
                          >
                            Cambiar Clave
                          </button>
                          <button
                            onClick={() => onResetPassword(user.id)}
                            className="text-xs font-bold text-blue-400 hover:text-blue-350 transition-colors cursor-pointer border-0 bg-transparent"
                            title="Blanquear contraseña a '123456'"
                          >
                            Blanquear
                          </button>
                          <button
                            onClick={() => onDeleteUser(user.id)}
                            disabled={isSelf}
                            className="text-xs font-bold text-red-400 hover:text-red-300 disabled:opacity-30 transition-colors cursor-pointer border-0 bg-transparent"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
