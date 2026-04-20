import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { useGetProjectsQuery } from '../features/projects/projectApiSlice';
import { useGetActivityLogsQuery } from '../features/admin/adminApiSlice';
import { useGetNotificationsQuery } from '../features/notifications/notificationApiSlice';
import { 
  HiOutlineBriefcase, 
  HiOutlineCheckBadge, 
  HiOutlineUsers, 
  HiOutlineClock 
} from 'react-icons/hi2';
import { format } from 'date-fns';

const Dashboard = () => {
  const { data: projectsData } = useGetProjectsQuery({});
  const { data: logsData } = useGetActivityLogsQuery({ limit: 10 });
  const { data: notifsData } = useGetNotificationsQuery({});

  const stats = [
    { label: 'Total Projects', value: projectsData?.pagination.total || 0, icon: HiOutlineBriefcase, color: 'bg-primary' },
    { label: 'Active Tasks', value: 24, icon: HiOutlineCheckBadge, color: 'bg-success' }, // Mock for now
    { label: 'Total Clients', value: 12, icon: HiOutlineUsers, color: 'bg-info' }, // Mock for now
    { label: 'Upcoming Deadlines', value: 3, icon: HiOutlineClock, color: 'bg-warning' },
  ];

  const chartData = useMemo(() => {
    if (!projectsData) return [];
    const stages = ['Lead', 'Proposal', 'Development', 'Testing', 'Live', 'Maintenance'];
    return stages.map(stage => ({
      name: stage,
      count: projectsData.data.filter((p: any) => p.stage === stage).length
    }));
  }, [projectsData]);

  const COLORS = ['#534AB7', '#378ADD', '#1D9E75', '#BA7517', '#D85A30', '#888780'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-dark">Dashboard Overview</h1>
        <p className="text-neutral mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="card p-6 flex items-center space-x-4">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
              <stat.icon className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-neutral-dark">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Stage Funnel */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-neutral-dark">Project Pipeline</h3>
            <span className="text-[10px] font-bold text-neutral uppercase border px-2 py-1 rounded">By Stage</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EFE8" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#888780' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#888780' }} />
                <Tooltip 
                  cursor={{ fill: '#F1EFE8' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card p-6">
          <h3 className="font-bold text-neutral-dark mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {projectsData?.data.filter((p:any) => p.endDate).slice(0, 5).map((project: any) => (
              <div key={project._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-light transition-all border border-transparent hover:border-neutral-light">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-danger-light text-danger flex items-center justify-center text-xs font-bold">
                    {project.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-dark truncate w-32">{project.name}</p>
                    <p className="text-[10px] text-neutral font-medium">{format(new Date(project.endDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-danger bg-danger-light px-2 py-0.5 rounded">
                  DUE SOON
                </span>
              </div>
            ))}
            {(!projectsData || projectsData.data.length === 0) && <p className="text-xs text-neutral">No upcoming deadlines.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="font-bold text-neutral-dark mb-6">System Pulse</h3>
          <div className="space-y-4">
            {logsData?.data.slice(0, 6).map((log: any) => (
              <div key={log._id} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-neutral-light flex items-center justify-center text-neutral shrink-0">
                  <HiOutlineClock />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-dark">
                    <span className="font-bold text-primary">{log.userId?.name}</span> {log.action}
                  </p>
                  <p className="text-[10px] text-neutral mt-0.5">{format(new Date(log.createdAt), 'h:mm a • MMM d')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Notifications Summary */}
        <div className="card p-6">
          <h3 className="font-bold text-neutral-dark mb-6">Recent Notifications</h3>
          <div className="space-y-4">
             {notifsData?.data.slice(0, 4).map((notif: any) => (
                <div key={notif._id} className={`p-4 rounded-xl border ${notif.isRead ? 'bg-neutral-light/30 border-transparent' : 'bg-primary-light/30 border-primary/10'}`}>
                   <p className="text-sm font-bold text-neutral-dark">{notif.title}</p>
                   <p className="text-xs text-neutral mt-1">{notif.body}</p>
                   <p className="text-[10px] text-primary font-bold mt-2 uppercase tracking-widest">{format(new Date(notif.createdAt), 'MMM d, p')}</p>
                </div>
             ))}
             {(!notifsData || notifsData.data.length === 0) && <p className="text-xs text-neutral">Clean slate! No notifications.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
