
import React from 'react';
import { Project } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onDeleteProject: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  activeProjectId, 
  onSelectProject, 
  onAddProject,
  onDeleteProject 
}) => {
  return (
    <aside className="w-72 glass-panel h-screen flex flex-col border-r border-cyan-900/30">
      <div className="p-6">
        <h1 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          NOVATASK
        </h1>
        <p className="text-[10px] text-cyan-500 tracking-[0.2em] font-orbitron mt-1">PROTOCOLE DE GESTION</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2 pb-20">
        <div className="flex items-center justify-between px-2 mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Projets</span>
          <button 
            onClick={onAddProject}
            className="p-1.5 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-all duration-300 border border-cyan-500/30"
          >
            <Icons.Plus />
          </button>
        </div>

        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-500 border ${
              activeProjectId === project.id 
              ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
              : 'border-transparent hover:bg-slate-800/50 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" 
                style={{ color: project.color, backgroundColor: project.color }}
              />
              <span className={`text-sm font-medium ${activeProjectId === project.id ? 'text-cyan-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {project.name}
              </span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProject(project.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
            >
              <Icons.Trash />
            </button>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-10 opacity-40">
            <p className="text-xs italic">Aucun projet actif</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-cyan-900/30 bg-slate-900/50">
        <div className="flex items-center space-x-3 text-xs text-cyan-500/70">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
          <span className="font-orbitron">SYSTEM ONLINE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
