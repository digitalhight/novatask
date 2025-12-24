
import React from 'react';
import { Task, Status, Priority } from '../types';
import { Icons } from '../constants';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (status: Status) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onUpdateTask, onDeleteTask, onAddTask }) => {
  const columns: { title: string; status: Status; color: string }[] = [
    { title: 'À FAIRE', status: 'todo', color: 'border-slate-700' },
    { title: 'EN COURS', status: 'in-progress', color: 'border-cyan-500/50' },
    { title: 'TERMINÉ', status: 'done', color: 'border-emerald-500/50' }
  ];

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'low': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
    }
  };

  return (
    <div className="flex h-full gap-6 overflow-x-auto p-6 custom-scrollbar items-start">
      {columns.map((col) => (
        <div key={col.status} className="flex-shrink-0 w-80 flex flex-col max-h-full">
          <div className={`flex items-center justify-between mb-6 p-3 rounded-lg bg-slate-900/50 border-l-4 ${col.color}`}>
            <h3 className="text-xs font-orbitron font-bold tracking-widest text-slate-300 uppercase">
              {col.title}
            </h3>
            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">
              {tasks.filter(t => t.status === col.status).length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1 pb-4">
            {tasks
              .filter(t => t.status === col.status)
              .map((task) => (
                <div 
                  key={task.id}
                  className="group relative glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-slate-100 mb-1 leading-tight group-hover:text-cyan-300 transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 font-light">
                    {task.description}
                  </p>

                  <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-800">
                    <div className="flex items-center space-x-2">
                      <select 
                        value={task.status}
                        onChange={(e) => onUpdateTask(task.id, { status: e.target.value as Status })}
                        className="bg-transparent text-[10px] text-cyan-500 font-bold focus:outline-none cursor-pointer hover:bg-slate-800 px-1 rounded"
                      >
                        <option value="todo">TRANSFÉRER VERS...</option>
                        <option value="in-progress">EN COURS</option>
                        <option value="done">TERMINÉ</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            
            <button 
              onClick={() => onAddTask(col.status)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-slate-800 hover:border-cyan-500/30 text-slate-500 hover:text-cyan-400 flex items-center justify-center transition-all duration-300 group"
            >
              <span className="text-xs font-bold tracking-widest group-hover:scale-105 transition-transform">+ NOUVELLE TÂCHE</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
