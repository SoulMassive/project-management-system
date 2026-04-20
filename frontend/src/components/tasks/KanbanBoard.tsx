import { useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  closestCorners,
  type DragStartEvent,
  type DragEndEvent
} from '@dnd-kit/core';

import { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { useUpdateTaskStatusMutation } from '../../features/tasks/taskApiSlice';
import { toast } from 'react-hot-toast';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Completed' },
];

interface KanbanBoardProps {
  tasks: any[];
}

const KanbanBoard = ({ tasks }: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<any>(null);
  const [updateStatus] = useUpdateTaskStatusMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc: any, col) => {
      acc[col.id] = tasks.filter(t => t.status === col.id);
      return acc;
    }, {});
  }, [tasks]);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Determine if we dropped over a column or another card
    let newStatus = overId;
    if (!COLUMNS.find(c => c.id === overId)) {
      const overTask = tasks.find(t => t._id === overId);
      newStatus = overTask?.status || activeTask?.status;
    }

    if (activeTask.status !== newStatus) {
      try {
        await updateStatus({ id: taskId, status: newStatus }).unwrap();
      } catch (err) {
        toast.error('Failed to update status');
      }
    }

    setActiveTask(null);
  };

  return (
    <div className="flex gap-6 h-full min-h-[600px] overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-6 h-full">
          {COLUMNS.map(col => (
            <KanbanColumn 
              key={col.id} 
              id={col.id} 
              title={col.title} 
              tasks={tasksByColumn[col.id]} 
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
