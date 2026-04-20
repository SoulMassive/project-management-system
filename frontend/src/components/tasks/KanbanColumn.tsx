import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: any[];
}

const KanbanColumn = ({ id, title, tasks }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col w-72 bg-neutral-light/50 rounded-2xl p-4 border border-[#D3D1C7] min-h-[500px]">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-bold text-neutral-dark uppercase tracking-wider">{title}</h3>
        <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-neutral border border-[#D3D1C7]">
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex-1 space-y-4">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task._id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
