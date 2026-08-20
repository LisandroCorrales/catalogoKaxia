import React, { useState, useEffect, useRef } from "react";

const formatDisplay = (rawStr, insertedIdx = -1) => {
  return rawStr
    .split("")
    .map((char, idx) => (idx === insertedIdx ? char : "•"))
    .join("");
};

export default function UsersTab({
  usersList = [],
  currentUser = {},
  onCreateUser,
  onUpdatePassword,
  onDeleteUser,
  onRestoreUser
}) {
  const [newUser, setNewUser] = useState({ username: "", role: "Vendedor" });
  
  // Alta de Usuario - Visibilidad de contraseña
  const [createPassword, setCreatePassword] = useState("");
  const [createDisplayValue, setCreateDisplayValue] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const createTimerRef = useRef(null);

  // Edición de Usuario - Visibilidad de contraseña
  const [editingUserPasswordId, setEditingUserPasswordId] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [editDisplayValue, setEditDisplayValue] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const editTimerRef = useRef(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState(""); // "" (Todos) | "Admin" | "Vendedor"
  const [filterStatus, setFilterStatus] = useState("active"); // "active" | "deleted" | "all"

  useEffect(() => {
    return () => {
      if (createTimerRef.current) clearTimeout(createTimerRef.current);
      if (editTimerRef.current) clearTimeout(editTimerRef.current);
    };
  }, []);

  const handleSubmitNewUser = (e) => {
    e.preventDefault();
    if (!newUser.username.trim()) return;
    
    const finalPassword = createPassword.trim() || "123456";
    onCreateUser(newUser.username.trim(), finalPassword, newUser.role);
    
    setNewUser({ username: "", role: "Vendedor" });
    setCreatePassword("");
    setCreateDisplayValue("");
    setShowCreatePassword(false);
    if (createTimerRef.current) clearTimeout(createTimerRef.current);
  };

  const toggleShowCreatePassword = () => {
    setShowCreatePassword((prev) => {
      const next = !prev;
      if (next) {
        setCreateDisplayValue(createPassword);
        if (createTimerRef.current) clearTimeout(createTimerRef.current);
      } else {
        setCreateDisplayValue(formatDisplay(createPassword, -1));
      }
      return next;
    });
  };

  const handleCreatePasswordChange = (e) => {
    const val = e.target.value;
    if (showCreatePassword) {
      setCreatePassword(val);
      setCreateDisplayValue(val);
      return;
    }

    let newRaw = "";
    if (val.length === 0) {
      newRaw = "";
      setCreateDisplayValue("");
    } else if (val.length > createDisplayValue.length) {
      // Carácter añadido
      let diffIdx = 0;
      while (diffIdx < createDisplayValue.length && val[diffIdx] === createDisplayValue[diffIdx]) {
        diffIdx++;
      }
      const insertedCount = val.length - createDisplayValue.length;
      const insertedText = val.substring(diffIdx, diffIdx + insertedCount);
      newRaw = createPassword.substring(0, diffIdx) + insertedText + createPassword.substring(diffIdx);

      const lastInsertedIdx = diffIdx + insertedCount - 1;
      setCreateDisplayValue(formatDisplay(newRaw, lastInsertedIdx));

      if (createTimerRef.current) clearTimeout(createTimerRef.current);
      createTimerRef.current = setTimeout(() => {
        setCreateDisplayValue(formatDisplay(newRaw, -1));
      }, 1500);
    } else if (val.length < createDisplayValue.length) {
      // Carácter borrado
      let diffIdx = 0;
      while (diffIdx < val.length && val[diffIdx] === createDisplayValue[diffIdx]) {
        diffIdx++;
      }
      const deletedCount = createDisplayValue.length - val.length;
      newRaw = createPassword.substring(0, diffIdx) + createPassword.substring(diffIdx + deletedCount);

      setCreateDisplayValue(formatDisplay(newRaw, -1));
      if (createTimerRef.current) clearTimeout(createTimerRef.current);
    } else {
      // Reemplazo
      let temp = createPassword.split("");
      for (let i = 0; i < val.length; i++) {
        if (val[i] !== "•") {
          temp[i] = val[i];
        }
      }
      newRaw = temp.join("");
      setCreateDisplayValue(formatDisplay(newRaw, -1));
      if (createTimerRef.current) clearTimeout(createTimerRef.current);
    }
    setCreatePassword(newRaw);
  };

  // --- MÉTODOS DE EDICIÓN ---
  const startEditingPassword = (userId) => {
    setEditingUserPasswordId(userId);
    setNewPasswordVal("");
    setEditDisplayValue("");
    setShowEditPassword(false);
    if (editTimerRef.current) clearTimeout(editTimerRef.current);
  };

  const handleUpdatePassword = (userId) => {
    if (!newPasswordVal.trim()) return;
    onUpdatePassword(userId, newPasswordVal.trim());
    setEditingUserPasswordId(null);
    setNewPasswordVal("");
    setEditDisplayValue("");
    setShowEditPassword(false);
    if (editTimerRef.current) clearTimeout(editTimerRef.current);
  };

  const toggleShowEditPassword = () => {
    setShowEditPassword((prev) => {
      const next = !prev;
      if (next) {
        setEditDisplayValue(newPasswordVal);
        if (editTimerRef.current) clearTimeout(editTimerRef.current);
      } else {
        setEditDisplayValue(formatDisplay(newPasswordVal, -1));
      }
      return next;
    });
  };

  const handleEditPasswordChange = (e) => {
    const val = e.target.value;
    if (showEditPassword) {
      setNewPasswordVal(val);
      setEditDisplayValue(val);
      return;
    }

    let newRaw = "";
    if (val.length === 0) {
      newRaw = "";
      setEditDisplayValue("");
    } else if (val.length > editDisplayValue.length) {
      // Carácter añadido
      let diffIdx = 0;
      while (diffIdx < editDisplayValue.length && val[diffIdx] === editDisplayValue[diffIdx]) {
        diffIdx++;
      }
      const insertedCount = val.length - editDisplayValue.length;
      const insertedText = val.substring(diffIdx, diffIdx + insertedCount);
      newRaw = newPasswordVal.substring(0, diffIdx) + insertedText + newPasswordVal.substring(diffIdx);

      const lastInsertedIdx = diffIdx + insertedCount - 1;
      setEditDisplayValue(formatDisplay(newRaw, lastInsertedIdx));

      if (editTimerRef.current) clearTimeout(editTimerRef.current);
      editTimerRef.current = setTimeout(() => {
        setEditDisplayValue(formatDisplay(newRaw, -1));
      }, 1500);
    } else if (val.length < editDisplayValue.length) {
      // Carácter borrado
      let diffIdx = 0;
      while (diffIdx < val.length && val[diffIdx] === editDisplayValue[diffIdx]) {
        diffIdx++;
      }
      const deletedCount = editDisplayValue.length - val.length;
      newRaw = newPasswordVal.substring(0, diffIdx) + newPasswordVal.substring(diffIdx + deletedCount);

      setEditDisplayValue(formatDisplay(newRaw, -1));
      if (editTimerRef.current) clearTimeout(editTimerRef.current);
    } else {
      // Reemplazo
      let temp = newPasswordVal.split("");
      for (let i = 0; i < val.length; i++) {
        if (val[i] !== "•") {
          temp[i] = val[i];
        }
      }
      newRaw = temp.join("");
      setEditDisplayValue(formatDisplay(newRaw, -1));
      if (editTimerRef.current) clearTimeout(editTimerRef.current);
    }
    setNewPasswordVal(newRaw);
  };

  // Filtrado de usuarios
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    
    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = !user.isDeleted;
    } else if (filterStatus === "deleted") {
      matchesStatus = !!user.isDeleted;
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-slate-100 font-sans">Gestionar Cuentas de Usuario</h2>
        <p className="text-xs text-slate-400 mt-1">Crea, modifica contraseñas o realiza bajas lógicas de Vendedores y Administradores.</p>
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
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={createDisplayValue}
                  onChange={handleCreatePasswordChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-mono"
                  placeholder="Por defecto: 123456"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={toggleShowCreatePassword}
                  className="absolute right-3.5 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer select-none"
                >
                  {showCreatePassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
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

        {/* Panel de Tabla y Filtros */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Barra de Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4.5 rounded-xl bg-[#0f131c]/15 border border-white/5 text-left">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Buscar por usuario</label>
              <input
                type="text"
                placeholder="Ej: vendedor_juan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Filtrar por rol</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-semibold"
              >
                <option value="" className="bg-[#0f131c]">Todos los roles</option>
                <option value="Vendedor" className="bg-[#0f131c]">Vendedor</option>
                <option value="Admin" className="bg-[#0f131c]">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Estado de Cuenta</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 font-semibold"
              >
                <option value="active" className="bg-[#0f131c]">Activos</option>
                <option value="deleted" className="bg-[#0f131c]">Eliminados (Baja Lógica)</option>
                <option value="all" className="bg-[#0f131c]">Todos</option>
              </select>
            </div>
          </div>

          {/* Tabla de Resultados (Solo en Escritorio) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-white/5 bg-[#0f131c]/30">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-[#0f131c]/80 text-[10px] uppercase font-bold tracking-wider text-slate-500 select-none">
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-slate-500 italic bg-white/[0.01]">
                      No se encontraron usuarios con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => {
                    const isSelf = currentUser && currentUser.id === user.id;
                    const isEditing = editingUserPasswordId === user.id;
                    
                    return (
                      <tr key={user.id} className={`hover:bg-white/[0.01] transition-colors ${user.isDeleted ? "opacity-60 bg-red-950/5" : ""}`}>
                        <td className="p-4 font-bold text-slate-200">
                          <span>{user.username}</span>
                          {isSelf && (
                            <span className="ml-2 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Tú
                            </span>
                          )}
                          {user.isDeleted && (
                            <span className="ml-2 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                              Eliminado
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
                          {user.isDeleted ? (
                            <div className="flex justify-end gap-3.5">
                              <button
                                onClick={() => onRestoreUser(user.id)}
                                className="text-xs font-bold text-green-400 hover:text-green-300 transition-colors cursor-pointer border-0 bg-transparent"
                              >
                                Restaurar
                              </button>
                            </div>
                          ) : isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <div className="relative flex items-center">
                                <input
                                  type="text"
                                  value={editDisplayValue}
                                  onChange={handleEditPasswordChange}
                                  className="bg-black/60 border border-white/15 rounded-xl pl-2.5 pr-8 py-1 text-xs text-white focus:outline-none focus:border-slate-500 w-36 font-mono"
                                  placeholder="Nueva contraseña"
                                  autoComplete="off"
                                />
                                <button
                                  type="button"
                                  onClick={toggleShowEditPassword}
                                  className="absolute right-2 text-slate-500 hover:text-slate-200 cursor-pointer select-none"
                                >
                                  {showEditPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                              <button
                                onClick={() => handleUpdatePassword(user.id)}
                                className="text-xs font-bold text-green-400 hover:text-green-300 cursor-pointer border-0 bg-transparent shrink-0"
                              >
                                Aceptar
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUserPasswordId(null);
                                  setNewPasswordVal("");
                                  setEditDisplayValue("");
                                  setShowEditPassword(false);
                                }}
                                className="text-xs font-bold text-slate-500 hover:text-slate-400 cursor-pointer border-0 bg-transparent shrink-0"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-3.5">
                              <button
                                onClick={() => startEditingPassword(user.id)}
                                className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
                              >
                                Cambiar Clave
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
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Vista de Tarjetas en Móviles */}
          <div className="block md:hidden space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 italic bg-[#0f131c]/10 border border-dashed border-white/5 rounded-xl">
                No se encontraron usuarios con los filtros seleccionados.
              </div>
            ) : (
              filteredUsers.map(user => {
                const isSelf = currentUser && currentUser.id === user.id;
                const isEditing = editingUserPasswordId === user.id;

                return (
                  <div 
                    key={user.id} 
                    className={`p-4 rounded-xl border border-white/5 bg-[#0f131c]/30 space-y-3 ${user.isDeleted ? "opacity-60 bg-red-950/5" : ""}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-200 text-sm">
                          {user.username}
                          {isSelf && (
                            <span className="ml-2 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Tú
                            </span>
                          )}
                          {user.isDeleted && (
                            <span className="ml-2 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                              Eliminado
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Rol: <span className="font-bold text-slate-300">{user.role === "Admin" ? "Administrador" : "Vendedor"}</span>
                        </span>
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          user.role === "Admin" 
                            ? "bg-[#6b21a8]/20 text-[#c084fc] border border-[#a855f7]/30" 
                            : "bg-[#1e3a8a]/20 text-[#60a5fa] border border-[#3b82f6]/30"
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Nueva Contraseña</label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-grow flex items-center">
                            <input
                              type="text"
                              value={editDisplayValue}
                              onChange={handleEditPasswordChange}
                              className="bg-black/60 border border-white/15 rounded-xl pl-2.5 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-slate-500 w-full font-mono"
                              placeholder="Contraseña"
                              autoComplete="off"
                            />
                            <button
                              type="button"
                              onClick={toggleShowEditPassword}
                              className="absolute right-2 text-slate-500 hover:text-slate-200 cursor-pointer select-none"
                            >
                              {showEditPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => handleUpdatePassword(user.id)}
                            className="text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-xl cursor-pointer"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => {
                              setEditingUserPasswordId(null);
                              setNewPasswordVal("");
                              setEditDisplayValue("");
                              setShowEditPassword(false);
                            }}
                            className="text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 px-3 py-1.5 rounded-xl cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 justify-end pt-2.5 border-t border-white/5">
                      {user.isDeleted ? (
                        <button
                          onClick={() => onRestoreUser(user.id)}
                          className="text-xs font-bold bg-green-500/10 text-green-400 hover:bg-green-500/25 px-4 py-1.5 rounded-lg border border-green-500/20 transition-colors cursor-pointer"
                        >
                          Restaurar
                        </button>
                      ) : (
                        <>
                          {!isEditing && (
                            <button
                              onClick={() => startEditingPassword(user.id)}
                              className="text-xs font-bold bg-white/5 text-slate-300 hover:bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer"
                            >
                              Cambiar Clave
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteUser(user.id)}
                            disabled={isSelf}
                            className="text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500/25 disabled:opacity-30 disabled:hover:bg-red-500/10 px-3.5 py-1.5 rounded-lg border border-red-500/20 transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
