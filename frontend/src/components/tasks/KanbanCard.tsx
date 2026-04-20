import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineListBullet, 
  HiOutlineCalendar,
  HiOutlineUser
} from 'react-icons/hi2';

interface KanbanCardProps {
  task: any;
  isOverlay?: boolean;
}

const KanbanCard = ({ task, isOverlay }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const priorityStyles: any = {
    Critical: 'bg-red-500',
    High: 'bg-orange-500',
    Medium: 'bg-amber-500',
    Low: 'bg-emerald-500',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white p-4 rounded-xl shadow-sm border border-[#D3D1C7] cursor-grab active:cursor-grabbing group transition-all
        ${isDragging ? 'opacity-30' : 'hover:border-primary/50 hover:shadow-md'}
        ${isOverlay ? 'shadow-xl rotate-3 scale-105 border-primary' : ''}
      `}
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className={`w-1.5 h-1.5 rounded-full ${priorityStyles[task.priority]}`}></div>
        <span className="text-[10px] font-bold text-neutral uppercase">{task.priority}</span>
      </div>

      <h4 className="text-sm font-bold text-neutral-dark mb-3 line-clamp-2">{task.title}</h4>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-3 text-neutral">
          <div className="flex items-center space-x-1">
            <HiOutlineListBullet className="text-xs" />
            <span className="text-[10px] font-bold">
              {task.subtasks?.filter((s:any) => s.isCompleted).length}/{task.subtasks?.length}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <HiOutlineChatBubbleLeftRight className="text-xs" />
            <span className="text-[10px] font-bold">{task.comments?.length || 0}</span>
          </div>
        </div>

        <div className="flex -space-x-2">
          {task.assignedTo?.map((user: any) => (
            <div key={user._id} className="w-6 h-6 rounded-full border-2 border-white bg-neutral-light flex items-center justify-center text-[8px] font-bold text-neutral-dark overflow-hidden">
               {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : user.name.charAt(0)}
            </div>
          ))}
          {(!task.assignedTo || task.assignedTo.length === 0) && (
             <div className="w-6 h-6 rounded-full border-2 border-white bg-neutral-light flex items-center justify-center text-neutral">
                <HiOutlineUser className="text-[10px]" />
             </div>
          )}
        </div>
      </div>

      {task.dueDate && (
        <div className="mt-3 flex items-center text-[10px] text-neutral font-medium">
          <HiOutlineCalendar className="mr-1" />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default KanbanCard;
