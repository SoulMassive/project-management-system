import { NavLink } from 'react-router-dom';
import { 
  HiOutlineSquares2X2, 
  HiOutlineBriefcase, 
  HiOutlineUsers, 
  HiOutlineClipboardDocumentList, 
  HiOutlineFolder, 
  HiOutlineUserGroup, 
  HiOutlineChartBar, 
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle
} from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HiOutlineSquares2X2, roles: ['Admin', 'Manager', 'Developer', 'Sales'] },
  { name: 'Projects', path: '/projects', icon: HiOutlineBriefcase, roles: ['Admin', 'Manager', 'Developer'] },
  { name: 'Clients', path: '/clients', icon: HiOutlineUsers, roles: ['Admin', 'Manager', 'Sales'] },
  { name: 'Tasks', path: '/tasks', icon: HiOutlineClipboardDocumentList, roles: ['Admin', 'Manager', 'Developer', 'Sales'] },
  { name: 'Files', path: '/files', icon: HiOutlineFolder, roles: ['Admin', 'Manager', 'Developer', 'Sales'] },
  { name: 'Team', path: '/team', icon: HiOutlineUserGroup, roles: ['Admin', 'Manager'] },
  { name: 'Reports', path: '/reports', icon: HiOutlineChartBar, roles: ['Admin', 'Manager'] },
  { name: 'Settings', path: '/settings', icon: HiOutlineCog6Tooth, roles: ['Admin'] },
];

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-dark/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen w-60 bg-primary text-white flex flex-col z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <HiOutlineBriefcase className="text-2xl" />
        </div>
        <span className="text-xl font-bold tracking-wider">PMS</span>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-white/10 text-white border-l-4 border-white' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon className="text-xl" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 mb-4 p-2">
          <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center border-2 border-white/20 overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold uppercase">{user?.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <span className={`
              text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
              ${user?.role === 'Admin' ? 'bg-purple-500' : 
                user?.role === 'Manager' ? 'bg-teal-500' : 
                user?.role === 'Developer' ? 'bg-amber-500' : 'bg-orange-500'}
            `}>
              {user?.role}
            </span>
          </div>
        </div>
        <button 
          onClick={() => dispatch(logout())}
          className="w-full flex items-center space-x-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          <HiOutlineArrowLeftOnRectangle className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
