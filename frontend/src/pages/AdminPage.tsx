import { useState } from 'react';
import { 
  useGetUsersQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useGetActivityLogsQuery
} from '../features/admin/adminApiSlice';
import { format } from 'date-fns';
import { HiOutlineUserPlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineClock } from 'react-icons/hi2';
import { toast } from 'react-hot-toast';

const RoleBadge = ({ role }: { role: string }) => {
  const colors: any = {
    Admin: 'bg-purple-100 text-purple-700',
    Manager: 'bg-teal-100 text-teal-700',
    Developer: 'bg-amber-100 text-amber-700',
    Sales: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors[role] || 'bg-gray-100 text-gray-700'}`}>
      {role}
    </span>
  );
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({});
  const { data: logsData, isLoading: logsLoading } = useGetActivityLogsQuery({});
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleToggleStatus = async (user: any) => {
    try {
      await updateUser({ id: user._id, isActive: !user.isActive }).unwrap();
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">Admin Control Center</h1>
          <p className="text-neutral mt-1">Manage users and track system activities</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <HiOutlineUserPlus className="text-xl" />
          <span>Add New User</span>
        </button>
      </div>

      <div className="flex space-x-1 p-1 bg-white border border-[#D3D1C7] rounded-xl w-64 shadow-sm">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-neutral hover:bg-neutral-light'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'logs' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-neutral hover:bg-neutral-light'}`}
        >
          Activity Logs
        </button>
      </div>

      <div className="card overflow-hidden">
        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-light border-b border-[#D3D1C7]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3D1C7]">
                {usersLoading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-neutral">Loading users...</td></tr>
                ) : usersData?.data.map((user: any) => (
                  <tr key={user._id} className="hover:bg-neutral-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold">
                          {user.avatarUrl ? <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover" /> : user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-dark">{user.name}</p>
                          <p className="text-xs text-neutral">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(user)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.isActive ? 'bg-success' : 'bg-neutral'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral">
                      {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, p') : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-neutral hover:text-primary transition-colors">
                          <HiOutlinePencilSquare className="text-xl" />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="p-2 text-neutral hover:text-danger transition-colors">
                          <HiOutlineTrash className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-6">
              {logsLoading ? (
                <p className="text-center text-neutral">Loading activity...</p>
              ) : logsData?.data.map((log: any) => (
                <div key={log._id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-neutral-light transition-colors">
                  <div className={`p-2 rounded-lg ${
                    log.entityType === 'Project' ? 'bg-primary-light text-primary' :
                    log.entityType === 'Task' ? 'bg-info-light text-info' :
                    log.entityType === 'Client' ? 'bg-success-light text-success' :
                    'bg-warning-light text-warning'
                  }`}>
                    <HiOutlineClock className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-dark">
                      <span className="text-primary">{log.userId?.name || 'System'}</span> 
                      {` ${log.action}`}
                      <span className="text-neutral mx-2">•</span>
                      <span className="text-xs text-neutral">{log.entityType}</span>
                    </p>
                    <p className="text-xs text-neutral mt-1">
                      {format(new Date(log.createdAt), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
