import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTrash, HiOutlinePencil, HiOutlineUserPlus, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import api from '../lib/api';

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  ADMIN: { bg: '#EEEDFE', color: '#534AB7' },
  MANAGER: { bg: '#E1F5EE', color: '#085041' },
  DEVELOPER: { bg: '#FAEEDA', color: '#633806' },
  SALES: { bg: '#FAECE7', color: '#4A1B0C' }
};

function getInitials(name: string) {
  return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
}

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const params: any = {};
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    api.get('/admin/users', { params }).then(r => { setUsers(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const toggleActive = async (id: string, isActive: boolean) => {
    await api.patch(`/admin/users/${id}`, { isActive: !isActive });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !isActive } : u));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2C2C2A', margin: 0 }}>Team</h1>
          <p style={{ color: '#888780', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>{users.length} member{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/team/new')}><HiOutlineUserPlus /> Invite User</button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <HiOutlineMagnifyingGlass style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888780' }} />
          <input className="input" style={{ paddingLeft: '2.25rem' }} placeholder="Search members…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ maxWidth: '160px' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {['ADMIN','MANAGER','DEVELOPER','SALES'].map(r => <option key={r} value={r}>{r.charAt(0)+r.slice(1).toLowerCase()}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F1EFE8' }}>
              {['Member','Role','Status','Last Active','Actions'].map(h => (
                <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: '#888780' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888780' }}>Loading...</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid #F1EFE8' }}>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar avatar-md" style={{ background: ROLE_COLORS[u.role]?.bg, color: ROLE_COLORS[u.role]?.color }}>
                      {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : getInitials(u.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#2C2C2A' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888780' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span className="badge" style={{ background: ROLE_COLORS[u.role]?.bg, color: ROLE_COLORS[u.role]?.color }}>{u.role.toLowerCase()}</span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <button onClick={() => toggleActive(u.id, u.isActive)} style={{
                    background: u.isActive ? '#E1F5EE' : '#F1EFE8',
                    color: u.isActive ? '#085041' : '#888780',
                    border: 'none', borderRadius: '999px', padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                  }}>
                    {u.isActive ? '● Active' : '○ Inactive'}
                  </button>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#888780' }}>
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-sm btn-ghost"><HiOutlinePencil /></button>
                    <button className="btn btn-sm btn-ghost" style={{ color: '#D85A30' }}><HiOutlineTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888780' }}>No users found</div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
