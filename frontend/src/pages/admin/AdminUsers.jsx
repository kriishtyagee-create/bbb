import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Search, Filter, Shield, GraduationCap, Building2, BookOpen } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let query = `?search=${encodeURIComponent(search)}`;
      if (roleFilter !== 'All') query += `&role=${roleFilter}`;
      const res = await adminAPI.getUsers(query);
      setUsers(res.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case 'industry':
        return <Building2 className="w-3.5 h-3.5 text-indigo-600" />;
      case 'academician':
        return <BookOpen className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-rose-600" />
          National Platform Users Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage authenticated Students, Enterprise Employers, Faculty Deans, and Platform Admins.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {['All', 'student', 'industry', 'academician', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  roleFilter === r
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r === 'All' ? 'All Roles' : r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user email..."
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-lg">ID</th>
                  <th className="p-3">Official Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Profile Entity Name</th>
                  <th className="p-3 rounded-r-lg">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-400">#{u.id}</td>
                    <td className="p-3 font-bold text-slate-900">{u.email}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-bold capitalize text-slate-800">
                        {getRoleIcon(u.role)}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      {u.profile?.name || u.profile?.company_name || 'System Admin'}
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
