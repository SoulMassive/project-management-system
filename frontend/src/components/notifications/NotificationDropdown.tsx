import { useState } from 'react';
import { 
  useGetNotificationsQuery, 
  useMarkAsReadMutation, 
  useMarkAllAsReadMutation 
} from '../../features/notifications/notificationApiSlice';
import { 
  HiOutlineBell, 
  HiOutlineEnvelopeOpen,
  HiOutlineEnvelope,
  HiOutlineXMark,
  HiOutlineCheckBadge
} from 'react-icons/hi2';
import { format } from 'date-fns';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useGetNotificationsQuery({});
  const [markRead] = useMarkAsReadMutation();
  const [markAllRead] = useMarkAllAsReadMutation();

  const unreadCount = data?.data.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all ${isOpen ? 'bg-primary-light text-primary' : 'text-neutral hover:bg-neutral-light hover:text-primary'}`}
      >
        <HiOutlineBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-[#D3D1C7] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-neutral-light flex items-center justify-between">
              <h3 className="font-bold text-neutral-dark text-sm">Notifications</h3>
              <button 
                onClick={() => markAllRead(undefined)}
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
              >
                Mark all read
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-neutral">Filtering alerts...</div>
              ) : data?.data.length === 0 ? (
                <div className="p-8 text-center">
                   <HiOutlineCheckBadge className="text-4xl text-neutral-light mx-auto mb-2" />
                   <p className="text-xs text-neutral font-medium">All caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-light">
                  {data.data.map((notif: any) => (
                    <div 
                      key={notif._id} 
                      onClick={() => markRead(notif._id)}
                      className={`p-4 flex space-x-3 cursor-pointer transition-all ${notif.isRead ? 'opacity-60 bg-white' : 'bg-primary-light/10 hover:bg-primary-light/20'}`}
                    >
                      <div className={`mt-1 p-1.5 rounded-lg shrink-0 ${notif.isRead ? 'bg-neutral-light text-neutral' : 'bg-primary text-white'}`}>
                        {notif.isRead ? <HiOutlineEnvelopeOpen /> : <HiOutlineEnvelope />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className={`text-xs truncate ${notif.isRead ? 'font-medium' : 'font-bold text-primary'}`}>
                            {notif.title}
                          </p>
                          <button className="text-neutral hover:text-danger opacity-0 group-hover:opacity-100">
                             <HiOutlineXMark />
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral leading-relaxed line-clamp-2">{notif.body}</p>
                        <p className="text-[9px] text-neutral mt-1 font-bold uppercase tracking-widest">
                          {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button className="w-full p-3 bg-neutral-light/30 text-[10px] font-bold text-neutral hover:text-primary transition-colors border-t border-neutral-light uppercase tracking-widest">
               View All Notifications
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;

