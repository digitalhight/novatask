
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import { Project, Task, Status, AppState } from './types';
import { Icons } from './constants';

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Cyberpunk Redesign', description: 'Refonte de l\'interface avec des éléments neon.', color: '#06b6d4' },
  { id: '2', name: 'System Core', description: 'Optimisation du noyau applicatif.', color: '#a855f7' }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('nova_task_state');
    if (saved) return JSON.parse(saved);
    return {
      projects: INITIAL_PROJECTS,
      tasks: [],
      activeProjectId: INITIAL_PROJECTS[0].id
    };
  });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState<Status | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('nova_task_state', JSON.stringify(state));
  }, [state]);

  const addProject = (name: string, description: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
      activeProjectId: newProject.id
    }));
    setShowProjectModal(false);
  };

  const deleteProject = (id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      tasks: prev.tasks.filter(t => t.projectId !== id),
      activeProjectId: prev.activeProjectId === id ? (prev.projects[0]?.id || null) : prev.activeProjectId
    }));
  };

  const addTask = (title: string, description: string, priority: any, status: Status) => {
    if (!state.activeProjectId) return;
    const newTask: Task = {
      id: Date.now().toString(),
      projectId: state.activeProjectId,
      title,
      description,
      status,
      priority,
      createdAt: Date.now()
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    setShowTaskModal(null);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    }));
  };

  const deleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const activeProject = state.projects.find(p => p.id === state.activeProjectId);
  const projectTasks = state.tasks.filter(t => t.projectId === state.activeProjectId);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar 
        projects={state.projects}
        activeProjectId={state.activeProjectId}
        onSelectProject={(id) => setState(prev => ({ ...prev, activeProjectId: id }))}
        onAddProject={() => setShowProjectModal(true)}
        onDeleteProject={deleteProject}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeProject ? (
          <>
            <header className="px-8 py-6 border-b border-cyan-900/30 flex justify-between items-center bg-slate-900/30 backdrop-blur-lg">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                  <h2 className="text-2xl font-orbitron font-bold tracking-tight text-white">{activeProject.name}</h2>
                </div>
                <p className="text-slate-400 text-sm max-w-2xl font-light italic">{activeProject.description}</p>
              </div>
              <button 
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-purple-600/20 border border-purple-500/50 text-purple-300 rounded-lg text-xs font-bold hover:bg-purple-600/40 transition-all font-orbitron"
              >
                PARTAGER
              </button>
            </header>

            <div className="flex-1 overflow-hidden relative">
              <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
              <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <KanbanBoard 
                tasks={projectTasks} 
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onAddTask={(status) => setShowTaskModal(status)}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-6">
            <div className="w-24 h-24 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center opacity-40">
              <Icons.Project />
            </div>
            <p className="font-orbitron tracking-widest text-xs uppercase">SÉLECTIONNEZ UN PROTOCOLE DE PROJET</p>
            <button 
              onClick={() => setShowProjectModal(true)}
              className="px-8 py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all font-bold"
            >
              CRÉER UN NOUVEAU PROJET
            </button>
          </div>
        )}
      </main>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-8 rounded-2xl border border-cyan-500/30">
            <h3 className="text-xl font-orbitron font-bold text-cyan-400 mb-6 uppercase tracking-wider">Nouveau Projet</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addProject(formData.get('name') as string, formData.get('description') as string);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Nom</label>
                  <input name="name" required autoFocus className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors" placeholder="ex: Redesign Orbital" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Description</label>
                  <textarea name="description" rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Objectifs du protocole..." />
                </div>
              </div>
              <div className="mt-8 flex space-x-3">
                <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 py-3 text-slate-400 text-xs font-bold tracking-widest hover:bg-slate-800 rounded-lg transition-colors">ANNULER</button>
                <button type="submit" className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold tracking-widest rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">INITIALISER</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-8 rounded-2xl border border-cyan-500/30">
            <h3 className="text-xl font-orbitron font-bold text-cyan-400 mb-6 uppercase tracking-wider">Nouvelle Tâche</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addTask(
                formData.get('title') as string, 
                formData.get('description') as string, 
                formData.get('priority') as any,
                showTaskModal
              );
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Titre</label>
                  <input name="title" required autoFocus className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Nom de la tâche" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Description</label>
                  <textarea name="description" rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Détails techniques..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Priorité</label>
                  <select name="priority" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors">
                    <option value="low">FAIBLE</option>
                    <option value="medium">MOYENNE</option>
                    <option value="high">URGENT</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex space-x-3">
                <button type="button" onClick={() => setShowTaskModal(null)} className="flex-1 py-3 text-slate-400 text-xs font-bold tracking-widest hover:bg-slate-800 rounded-lg transition-colors">ANNULER</button>
                <button type="submit" className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold tracking-widest rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">DÉPLOYER</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowShareModal(false)}>
          <div className="glass-panel w-full max-w-sm p-8 rounded-2xl border border-cyan-500/30" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-orbitron font-bold text-white mb-4 uppercase tracking-wider">PARTAGER LE PROTOCOLE</h3>
            <p className="text-slate-400 text-sm mb-6 font-light">Lien d'accès crypté généré pour vos collaborateurs. Les protocoles de sécurité sont actifs.</p>
            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold tracking-widest rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            >
              FERMER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
