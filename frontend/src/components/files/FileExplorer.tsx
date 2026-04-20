import { useState } from 'react';
import { 
  useGetProjectFoldersQuery, 
  useGetProjectFilesQuery, 
  useUploadFileMutation,
  useCreateFolderMutation
} from '../../features/files/fileApiSlice';
import { 
  HiOutlineFolder, 
  HiOutlineDocument, 
  HiOutlineCloudArrowUp,
  HiOutlineFolderPlus,
  HiOutlineEllipsisVertical,
  HiOutlineInformationCircle
} from 'react-icons/hi2';
import { toast } from 'react-hot-toast';

interface FileExplorerProps {
  projectId: string;
}

const FileExplorer = ({ projectId }: FileExplorerProps) => {
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [isUploading, setIsUploading] = useState(false);
  
  const { data: foldersData, isLoading: foldersLoading } = useGetProjectFoldersQuery(projectId);
  const { data: filesData, isLoading: filesLoading } = useGetProjectFilesQuery({ projectId, folderId: currentFolder });
  const [uploadFile] = useUploadFileMutation();
  const [createFolder] = useCreateFolderMutation();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (currentFolder !== 'root') {
      formData.append('folderId', currentFolder);
    }

    try {
      setIsUploading(true);
      await uploadFile({ projectId, formData }).unwrap();
      toast.success('File uploaded successfully');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    const name = window.prompt('Enter folder name:');
    if (!name) return;

    try {
      await createFolder({ 
        projectId, 
        name, 
        parentId: currentFolder === 'root' ? null : currentFolder 
      }).unwrap();
      toast.success('Folder created');
    } catch (err) {
      toast.error('Failed to create folder');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
      {/* Sidebar - Folders */}
      <div className="lg:w-64 flex flex-col h-full bg-white rounded-2xl border border-[#D3D1C7] overflow-hidden">
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-neutral">Folders</span>
          <button onClick={handleCreateFolder} className="text-primary hover:bg-primary-light p-1 rounded-md transition-colors">
            <HiOutlineFolderPlus className="text-xl" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <button 
            onClick={() => setCurrentFolder('root')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${currentFolder === 'root' ? 'bg-primary text-white shadow-md' : 'text-neutral hover:bg-neutral-light'}`}
          >
            <HiOutlineFolder className="text-lg" />
            <span>Root Directory</span>
          </button>
          
          <div className="mt-2 space-y-1">
            {foldersData?.data.map((folder: any) => (
              <button 
                key={folder._id}
                onClick={() => setCurrentFolder(folder._id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${currentFolder === folder._id ? 'bg-primary text-white shadow-md' : 'text-neutral hover:bg-neutral-light'}`}
              >
                <HiOutlineFolder className="text-lg" />
                <span className="truncate">{folder.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Area - Files */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#D3D1C7] overflow-hidden">
        <div className="p-4 border-b border-neutral-light flex items-center justify-between bg-neutral-light/30">
          <div className="flex items-center space-x-2 text-sm font-bold text-neutral-dark">
            <span className="text-neutral">Documents</span>
            <span className="text-neutral-300">/</span>
            <span className="text-primary">{currentFolder === 'root' ? 'Root' : 'Subfolder'}</span>
          </div>
          
          <label className="btn-primary flex items-center space-x-2 text-xs cursor-pointer">
            <HiOutlineCloudArrowUp className="text-lg" />
            <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {(filesLoading || foldersLoading) ? (
            <p className="text-center text-neutral mt-10">Searching vault...</p>
          ) : filesData?.data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral opacity-50">
               <HiOutlineDocument className="text-6xl mb-4" />
               <p className="font-bold">No files in this directory</p>
               <p className="text-xs">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filesData?.data.map((file: any) => (
                <div key={file._id} className="group relative flex flex-col items-center p-4 rounded-xl hover:bg-neutral-light transition-all border border-transparent hover:border-[#D3D1C7] cursor-pointer">
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <HiOutlineEllipsisVertical className="text-neutral hover:text-primary" />
                   </div>
                   
                   <div className={`w-16 h-20 mb-4 flex items-center justify-center rounded-lg shadow-sm ${
                      file.mimetype.includes('pdf') ? 'bg-red-50 text-red-500' :
                      file.mimetype.includes('sheet') ? 'bg-emerald-50 text-emerald-500' :
                      file.mimetype.includes('image') ? 'bg-amber-50 text-amber-500' : 'bg-primary-light text-primary'
                   }`}>
                      <HiOutlineDocument className="text-4xl" />
                   </div>
                   
                   <p className="text-xs font-bold text-neutral-dark text-center truncate w-full px-2" title={file.originalName}>
                      {file.originalName}
                   </p>
                   <p className="text-[10px] text-neutral mt-1 font-bold">
                      {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                   </p>

                   <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <a 
                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/files/${file._id}/download`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                         DOWNLOAD
                      </a>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-neutral-light/10 border-t border-neutral-light flex items-center text-[10px] text-neutral font-bold tracking-widest">
           <HiOutlineInformationCircle className="mr-2 text-primary" />
           ALL FILES ARE ENCRYPTED AND STORED SECURELY
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
