import { useState } from 'react';
import { useGetProjectsQuery } from '../features/projects/projectApiSlice';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlinePlus, 
  HiOutlineFunnel, 
  HiOutlineCalendar
} from 'react-icons/hi2';
import { formatDistanceToNow } from 'date-fns';

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: any = {
    Critical: 'bg-red-100 text-red-700',
    High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ stage: '', status: '', type: '' });
  const { data, isLoading } = useGetProjectsQuery(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">Projects</h1>
          <p className="text-neutral mt-1">Track and manage your active project portfolio</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <HiOutlinePlus className="text-xl" />
          <span>New Project</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-6">
          <div className="card p-5">
            <div className="flex items-center space-x-2 text-neutral-dark font-bold mb-4">
              <HiOutlineFunnel />
              <span>Filters</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-neutral uppercase mb-2 block">Stage</label>
                <select 
                  onChange={(e) => setFilters({...filters, stage: e.target.value})}
                  className="w-full bg-neutral-light border-none rounded-lg p-2 text-xs font-semibold outline-none"
                >
                  <option value="">All Stages</option>
                  {['Lead', 'Proposal', 'Development', 'Testing', 'Live', 'Maintenance'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral uppercase mb-2 block">Status</label>
                <select 
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full bg-neutral-light border-none rounded-lg p-2 text-xs font-semibold outline-none"
                >
                  <option value="">All Statuses</option>
                  {['In Progress', 'Delayed', 'Completed', 'On Hold'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="flex-1">
          {isLoading ? (
            <p>Loading projects...</p>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {data?.data.map((project: any) => (
                <div 
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="card p-6 cursor-pointer group hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold ${
                      project.status === 'Delayed' ? 'bg-danger-light text-danger' : 
                      project.status === 'Completed' ? 'bg-success-light text-success' : 'bg-primary-light text-primary'
                    }`}>
                      {project.name.charAt(0)}
                    </div>
                    <PriorityBadge priority={project.priority} />
                  </div>

                  <h3 className="font-bold text-neutral-dark truncate mb-1">{project.name}</h3>
                  <p className="text-xs text-neutral font-medium mb-4">{project.clientId?.name || 'Unknown Client'}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        project.status === 'In Progress' ? 'bg-primary' :
                        project.status === 'Delayed' ? 'bg-warning' :
                        project.status === 'Completed' ? 'bg-success' : 'bg-neutral'
                      }`}></span>
                      {project.status}
                    </div>
                    <span className="bg-primary-light text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                      {project.stage}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[10px] font-bold text-neutral">
                      <span>PROGRESS</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-neutral-light h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-light">
                    <div className="flex items-center text-xs text-neutral">
                      <HiOutlineCalendar className="mr-1" />
                      <span>{project.endDate ? formatDistanceToNow(new Date(project.endDate)) + ' left' : 'No deadline'}</span>
                    </div>
                    <div className="flex -space-x-2">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-neutral-light flex items-center justify-center text-[8px] font-bold">U</div>
                       ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
