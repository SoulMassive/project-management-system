import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetClientQuery, useAddCommunicationMutation } from '../features/clients/clientApiSlice';
import { format } from 'date-fns';
import { 
  HiOutlineChevronLeft, 
  HiOutlineChatBubbleLeftEllipsis, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineMapPin,
  HiOutlinePlus
} from 'react-icons/hi2';
import { toast } from 'react-hot-toast';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [commContent, setCommContent] = useState('');
  const [commType, setCommType] = useState('note');

  const { data, isLoading, error } = useGetClientQuery(id);
  const [addCommunication, { isLoading: isAddingComm }] = useAddCommunicationMutation();

  const handleAddComm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commContent.trim()) return;
    
    try {
      await addCommunication({ id, content: commContent, type: commType }).unwrap();
      setCommContent('');
      toast.success('Communication logged');
    } catch (err) {
      toast.error('Failed to log');
    }
  };

  if (isLoading) return <div className="p-10">Loading profile...</div>;
  if (error) return <div className="p-10 text-danger">Client not found</div>;

  const client = data.data;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/clients')}
        className="flex items-center text-sm text-neutral hover:text-primary transition-colors"
      >
        <HiOutlineChevronLeft className="mr-1" />
        Back to Clients
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Profile Meta */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-primary rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-xl shadow-primary/20">
              {client.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-neutral-dark">{client.name}</h2>
            <p className="text-neutral font-medium mb-6">{client.company || 'Private Client'}</p>
            
            <div className="space-y-4 text-left border-t border-neutral-light pt-6">
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 bg-neutral-light rounded-lg flex items-center justify-center text-neutral mr-3">
                  <HiOutlineEnvelope />
                </div>
                <div>
                  <p className="text-[10px] text-neutral font-bold uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-neutral-dark">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 bg-neutral-light rounded-lg flex items-center justify-center text-neutral mr-3">
                  <HiOutlinePhone />
                </div>
                <div>
                  <p className="text-[10px] text-neutral font-bold uppercase tracking-wider">Phone</p>
                  <p className="font-semibold text-neutral-dark">{client.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 bg-neutral-light rounded-lg flex items-center justify-center text-neutral mr-3">
                  <HiOutlineMapPin />
                </div>
                <div>
                  <p className="text-[10px] text-neutral font-bold uppercase tracking-wider">Address</p>
                  <p className="font-semibold text-neutral-dark truncate max-w-[200px]">{client.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-primary-dark text-white">
            <p className="text-sm font-bold uppercase tracking-wider opacity-60 mb-1">Billing Info</p>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Currency</span>
                <span className="font-bold">{client.billingInfo?.currency || 'INR'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">GST Number</span>
                <span className="font-bold">{client.gstNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Terms</span>
                <span className="font-bold">{client.billingInfo?.paymentTerms || 'Net 30'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Tabs Content */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex space-x-8 border-b border-[#D3D1C7] px-2">
            {['Overview', 'Projects', 'Communications', 'Documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.toLowerCase() ? 'text-primary' : 'text-neutral hover:text-primary-dark'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h4 className="font-bold text-neutral-dark mb-4">Summary</h4>
                  <p className="text-sm text-neutral leading-relaxed">
                    Client since {format(new Date(client.createdAt), 'MMMM yyyy')}. 
                    Currently has 3 active projects and 2 pending proposals.
                  </p>
                </div>
                <div className="card p-6 border-dashed border-2 flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-neutral mb-4">Quick add project for this client</p>
                  <button className="btn-primary text-xs flex items-center space-x-2">
                    <HiOutlinePlus />
                    <span>Create New Project</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'communications' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <form onSubmit={handleAddComm}>
                    <div className="flex space-x-4 mb-4">
                      {['Note', 'Email', 'Call', 'Meeting'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setCommType(type.toLowerCase())}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            commType === type.toLowerCase() 
                            ? 'bg-primary text-white' 
                            : 'bg-neutral-light text-neutral hover:bg-neutral/20'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder={`Logging a ${commType}...`}
                      value={commContent}
                      onChange={(e) => setCommContent(e.target.value)}
                      className="w-full bg-neutral-light border-none rounded-xl p-4 text-sm outline-none mb-4 min-h-[100px] focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    ></textarea>
                    <div className="flex justify-end">
                      <button disabled={isAddingComm} className="btn-primary flex items-center space-x-2">
                        <HiOutlineChatBubbleLeftEllipsis />
                        <span>Log Activity</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-light">
                  {client.communications?.slice().reverse().map((comm: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-8 top-1 w-7 h-7 rounded-full border-4 border-neutral-light flex items-center justify-center text-[10px] ${
                        comm.type === 'email' ? 'bg-info text-white' :
                        comm.type === 'call' ? 'bg-success text-white' :
                        comm.type === 'meeting' ? 'bg-warning text-white' : 'bg-neutral text-white'
                      }`}>
                        {comm.type.charAt(0).toUpperCase()}
                      </div>
                      <div className="card p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold uppercase text-primary">{comm.type}</span>
                          <span className="text-[10px] text-neutral">{format(new Date(comm.createdAt), 'MMM d, p')}</span>
                        </div>
                        <p className="text-sm text-neutral-dark">{comm.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && <div className="card p-10 text-center text-neutral">No projects linked yet</div>}
            {activeTab === 'documents' && <div className="card p-10 text-center text-neutral">Storage module integration pending</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
