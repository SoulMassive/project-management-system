import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProjectQuery, useUpdateProjectStageMutation } from '../features/projects/projectApiSlice';
import { 
  HiOutlineChevronLeft, 
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineChatBubbleOvalLeft,
  HiOutlinePlus
} from 'react-icons/hi2';
import { toast } from 'react-hot-toast';
import KanbanBoard from '../components/tasks/KanbanBoard';
import { useGetProjectTasksQuery } from '../features/tasks/taskApiSlice';
import FileExplorer from '../components/files/FileExplorer';

const stages = ['Lead', 'Proposal', 'Development', 'Testing', 'Live', 'Maintenance'];

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tasks');
  const { data, isLoading } = useGetProjectQuery(id);
  const { data: tasksData, isLoading: tasksLoading } = useGetProjectTasksQuery({ projectId: id });
  const [updateStage, { isLoading: isUpdatingStage }] = useUpdateProjectStageMutation();

  if (isLoading) return <div className="p-10">Loading Project...</div>;
  const project = data.data;

  const handleStageChange = async (newStage: string) => {
    try {
      await updateStage({ id, stage: newStage }).unwrap();
      toast.success(`Project moved to ${newStage}`);
    } catch (err: any) {
      toast.error(err?.data?.error || 'Stage transition failed');
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/projects')}
        className="flex items-center text-sm text-neutral hover:text-primary transition-colors"
      >
        <HiOutlineChevronLeft className="mr-1" />
        Back to Projects
      </button>

      {/* Hero / Header Section */}
      <div className="card p-8 bg-white overflow-visible">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-neutral-dark">{project.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                project.status === 'Delayed' ? 'bg-danger-light text-danger' : 'bg-primary-light text-primary'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-neutral font-medium">{project.clientId?.name} • <span className="text-primary">{project.type}</span></p>
          </div>
          
          <div className="flex -space-x-3">
            {project.teamMembers?.map((m: any) => (
              <div key={m._id} className="w-10 h-10 rounded-full border-4 border-white bg-neutral-light flex items-center justify-center text-xs font-bold text-neutral-dark" title={m.name}>
                {m.name.charAt(0)}
              </div>
            ))}
            <button className="w-10 h-10 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-sm hover:scale-110 transition-transform">
              +
            </button>
          </div>
        </div>

        {/* Stage Stepper */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-light -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            {stages.map((stage, idx) => {
              const stageIdx = stages.indexOf(project.stage);
              const isActive = stage === project.stage;
              const isCompleted = idx < stageIdx;
              const isLocked = idx > stageIdx;

              return (
                <button
                  key={stage}
                  disabled={isLocked || isUpdatingStage}
                  onClick={() => handleStageChange(stage)}
                  className={`relative z-10 flex flex-col items-center group transition-all ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white transition-all shadow-md ${
                    isActive ? 'bg-primary scale-125' : 
                    isCompleted ? 'bg-success' : 'bg-neutral-light'
                  }`}>
                    {isCompleted ? <HiOutlineCheckCircle className="text-white" /> : <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-neutral'}`}></div>}
                  </div>
                  <span className={`mt-3 text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-neutral'}`}>
                    {stage}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Meta */}
        <div className="lg:w-80 space-y-6">
          <div className="card p-6 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-neutral uppercase mb-4 flex items-center">
                <HiOutlineTag className="mr-2" /> Details
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral">Priority</span>
                  <span className="font-bold text-danger">{project.priority}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral">Budget</span>
                  <span className="font-bold text-neutral-dark">${project.budget?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-neutral">Client</span>
                   <span className="font-bold text-primary cursor-pointer hover:underline">View Client</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-light">
              <h4 className="text-xs font-bold text-neutral uppercase mb-4 flex items-center">
                <HiOutlineClock className="mr-2" /> Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral">Start Date</span>
                  <span className="font-bold text-neutral-dark">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral">Deadline</span>
                  <span className="font-bold text-neutral-dark">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex space-x-8 border-b border-[#D3D1C7] px-2">
            {[
              { id: 'tasks', label: 'Tasks', icon: HiOutlineCheckCircle },
              { id: 'files', label: 'Files', icon: HiOutlineTag },
              { id: 'notes', label: 'Notes', icon: HiOutlineChatBubbleOvalLeft },
              { id: 'team', label: 'Timeline', icon: HiOutlineClock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-primary' : 'text-neutral hover:text-primary-dark'
                }`}
              >
                <tab.icon />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'tasks' && (
              tasksLoading ? <p>Loading tasks...</p> : 
              tasksData?.data.length > 0 ? <KanbanBoard tasks={tasksData.data} /> : (
                <div className="card p-10 text-center flex flex-col items-center justify-center border-dashed border-2">
                  <HiOutlineCheckCircle className="text-5xl text-neutral-light mb-4" />
                  <h4 className="font-bold text-neutral-dark mb-1">No tasks created yet</h4>
                  <p className="text-sm text-neutral mb-6">Start by creating the first task for this project</p>
                  <button className="btn-primary flex items-center space-x-2">
                    <HiOutlinePlus />
                    <span>Add First Task</span>
                  </button>
                </div>
              )
            )}
            
            {activeTab === 'notes' && (
              <div className="space-y-6">
                 <div className="card p-6">
                    <textarea 
                       placeholder="Add a private note for the team..."
                       className="w-full bg-neutral-light rounded-xl p-4 text-sm outline-none min-h-[100px] mb-4"
                    ></textarea>
                    <div className="flex justify-end">
                       <button className="btn-primary">Post Note</button>
                    </div>
                 </div>
              </div>
            )}
            
            {activeTab === 'files' && (
              <FileExplorer projectId={id!} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
