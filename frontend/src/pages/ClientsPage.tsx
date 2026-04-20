import { useState } from 'react';
import { useGetClientsQuery, useDeleteClientMutation } from '../features/clients/clientApiSlice';
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineEnvelope, HiOutlinePhone, HiOutlineBuildingOffice } from 'react-icons/hi2';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ClientsPage = () => {
  const [search, setSearch] = useState('');
  const { data: clientsData, isLoading } = useGetClientsQuery({ search });
  const [deleteClient] = useDeleteClientMutation();
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this client?')) {
      try {
        await deleteClient(id).unwrap();
        toast.success('Client deleted');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">Clients</h1>
          <p className="text-neutral mt-1">Manage your customer relationships</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <HiOutlinePlus className="text-xl" />
          <span>Add Client</span>
        </button>
      </div>

      <div className="card p-4 flex items-center space-x-4">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral text-lg" />
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-light border-none rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <select className="bg-neutral-light border-none rounded-lg px-4 py-2 text-sm font-medium outline-none cursor-pointer">
          <option>All Industries</option>
          <option>Technology</option>
          <option>Retail</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading clients...</p>
        ) : clientsData?.data.map((client: any) => (
          <div 
            key={client._id} 
            onClick={() => navigate(`/clients/${client._id}`)}
            className="card p-6 cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary text-xl font-bold">
                {client.name.charAt(0)}
              </div>
              <button 
                onClick={(e) => handleDelete(e, client._id)}
                className="p-2 text-neutral hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <HiOutlineEnvelope className="text-lg" title="Delete" />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-neutral-dark truncate">{client.name}</h3>
            <div className="flex items-center text-sm text-neutral mt-1 mb-4">
              <HiOutlineBuildingOffice className="mr-1" />
              <span className="truncate">{client.company || 'Individual'}</span>
            </div>

            <div className="space-y-2 border-t border-neutral-light pt-4">
              <div className="flex items-center text-xs text-neutral">
                <HiOutlineEnvelope className="mr-2 text-primary" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center text-xs text-neutral">
                <HiOutlinePhone className="mr-2 text-primary" />
                <span>{client.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-[10px] text-neutral uppercase font-bold tracking-wider">Active Projects</span>
              <span className="bg-success-light text-success px-2 py-0.5 rounded text-[10px] font-bold">3 ACTIVE</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;
