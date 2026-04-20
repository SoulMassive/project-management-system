import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, closestCorners, type DragEndEvent, type DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { HiOutlinePlus, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useGetMyTasksQuery, useUpdateTaskStatusMutation } from '../features/tasks/taskApiSlice';
import KanbanColumn from '../components/tasks/KanbanColumn';
import KanbanCard from '../components/tasks/KanbanCard';
import { toast } from 'react-hot-toast';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-primary' },
  { id: 'doing', title: 'In Progress', color: 'bg-info' },
  { id: 'review', title: 'Review', color: 'bg-warning' },
  { id: 'done', title: 'Completed', color: 'bg-success' },
];

const TasksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTask, setActiveTask] = useState<any>(null);
  const { data, isLoading } = useGetMyTasksQuery({});
  const [updateStatus] = useUpdateTaskStatusMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksByColumn = useMemo(() => {
    if (!data?.data) return {};
    const filtered = data.data.filter((t: any) => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return COLUMNS.reduce((acc: any, col) => {
      acc[col.id] = filtered.filter((t: any) => t.status === col.id);
      return acc;
    }, {});
  }, [data, searchQuery]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = data?.data.find((t: any) => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    let newStatus = overId;
    if (!COLUMNS.find(c => c.id === overId)) {
      const overTask = data?.data.find((t: any) => t._id === overId);
      newStatus = overTask?.status || activeTask?.status;
    }

    if (activeTask.status !== newStatus) {
      try {
        await updateStatus({ id: taskId, status: newStatus }).unwrap();
        toast.success('Task status updated');
      } catch (err) {
        toast.error('Failed to update status');
      }
    }

    setActiveTask(null);
  };

  if (isLoading) return <div className="p-10 text-center text-neutral">Loading your workspace...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">My Workflow</h1>
          <p className="text-neutral mt-1 text-sm">Organize and track your assigned tasks</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="bg-white border border-[#D3D1C7] rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <button className="btn-primary flex items-center gap-2">
              <HiOutlinePlus className="text-lg" />
              <span>New Task</span>
           </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 h-[calc(100vh-220px)] overflow-x-auto pb-4 custom-scrollbar">
          {COLUMNS.map(col => (
            <KanbanColumn 
              key={col.id} 
              id={col.id} 
              title={col.title} 
              tasks={tasksByColumn[col.id] || []} 
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

export default TasksPage;
