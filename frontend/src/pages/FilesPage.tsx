import { useState } from 'react';
import FileExplorer from '../components/files/FileExplorer';
import { HiOutlineFolder, HiOutlineMagnifyingGlass, HiOutlineCloudArrowUp, HiOutlineBriefcase } from 'react-icons/hi2';
import { useGetProjectsQuery } from '../features/projects/projectApiSlice';

const FilesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery({});

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">Digital Assets</h1>
          <p className="text-neutral mt-1 text-sm">Manage project documents and shared files</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
              <input 
                type="text" 
                placeholder="Search files..." 
                className="bg-white border border-[#D3D1C7] rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <button className="btn-primary flex items-center gap-2">
              <HiOutlineCloudArrowUp className="text-lg" />
              <span>Upload</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Project Selection Sidebar */}
        <div className="space-y-6">
          <div className="card p-4">
            <h3 className="text-xs font-bold text-neutral uppercase tracking-widest mb-4">Projects</h3>
            <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
               {projectsLoading ? (
                 <p className="text-xs text-neutral p-2">Loading projects...</p>
               ) : projectsData?.data.map((project: any) => (
                 <button 
                   key={project._id}
                   onClick={() => setSelectedProjectId(project._id)}
                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                     selectedProjectId === project._id ? 'bg-primary-light text-primary' : 'text-neutral hover:bg-neutral-light hover:text-neutral-dark'
                   }`}
                 >
                   <HiOutlineBriefcase className="shrink-0" />
                   <span className="truncate">{project.name}</span>
                 </button>
               ))}
            </div>
          </div>

          <div className="card p-4">
             <h3 className="text-xs font-bold text-neutral uppercase tracking-widest mb-4">Storage Usage</h3>
             <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                   <span className="text-neutral">Documents</span>
                   <span className="text-neutral-dark">1.2 GB</span>
                </div>
                <div className="w-full bg-neutral-light h-1.5 rounded-full overflow-hidden">
                   <div className="bg-primary h-full" style={{ width: '65%' }}></div>
                </div>
             </div>
          </div>
        </div>

        {/* Main Explorer */}
        <div className="md:col-span-3">
          {selectedProjectId ? (
            <FileExplorer projectId={selectedProjectId} />
          ) : (
            <div className="card h-[600px] flex flex-col items-center justify-center text-center p-10 bg-white/50 border-dashed border-2">
               <div className="w-20 h-20 bg-neutral-light rounded-full flex items-center justify-center mb-6">
                  <HiOutlineFolder className="text-4xl text-neutral" />
               </div>
               <h3 className="text-lg font-bold text-neutral-dark mb-2">No Project Selected</h3>
               <p className="text-neutral max-w-xs mx-auto">Please select a project from the sidebar to view and manage its documents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
