
import './share-modal.js';

// État de l'application
const state = {
    projects: [
        { id: 1, name: 'Cyberpunk Redesign', description: 'Interface neon' },
        { id: 2, name: 'System Core', description: 'Optimisation' }
    ],
    tasks: [
        { id: 101, projectId: 1, title: 'Shader Neon', status: 'todo' },
        { id: 102, projectId: 1, title: 'Grid System', status: 'in-progress' }
    ],
    activeProjectId: 1
};

// Sélecteurs
const projectList = document.getElementById('project-list');
const kanbanContainer = document.getElementById('kanban-container');
const projectTitle = document.getElementById('active-project-title');

// Fonctions de rendu
const renderProjects = () => {
    if (!projectList) return;
    projectList.innerHTML = state.projects.map(p => `
        <div class="group flex items-center p-3 rounded-xl cursor-pointer transition-all border ${state.activeProjectId === p.id ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg' : 'border-transparent hover:bg-slate-800'}" 
             onclick="window.switchProject(${p.id})">
            <div class="w-2 h-2 rounded-full bg-cyan-500 mr-3 shadow-[0_0_8px_rgba(6,182,212,1)]"></div>
            <span class="text-sm ${state.activeProjectId === p.id ? 'text-white' : 'text-slate-400'}">${p.name}</span>
        </div>
    `).join('');
};

const renderKanban = () => {
    if (!kanbanContainer) return;
    const columns = [
        { id: 'todo', label: 'À FAIRE' },
        { id: 'in-progress', label: 'EN COURS' },
        { id: 'done', label: 'TERMINÉ' }
    ];

    const activeProject = state.projects.find(p => p.id === state.activeProjectId);
    projectTitle.textContent = activeProject ? activeProject.name : 'Sélectionnez un projet';

    kanbanContainer.innerHTML = columns.map(col => `
        <div class="flex-shrink-0 w-80 flex flex-col h-full">
            <div class="flex items-center justify-between mb-6 p-3 bg-slate-900/50 rounded-lg border-l-2 border-cyan-500">
                <h3 class="text-xs font-bold tracking-widest text-slate-300 font-['Orbitron']">${col.label}</h3>
            </div>
            <div class="space-y-4 overflow-y-auto custom-scrollbar flex-1">
                ${state.tasks
                    .filter(t => t.projectId === state.activeProjectId && t.status === col.id)
                    .map(task => `
                        <div class="p-4 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-all group">
                            <h4 class="text-sm font-semibold text-white mb-2">${task.title}</h4>
                            <div class="flex justify-between items-center text-[10px] text-slate-500">
                                <span>#${task.id}</span>
                                <span class="text-cyan-500/50 font-bold">HIGH PRIORITY</span>
                            </div>
                        </div>
                    `).join('')}
            </div>
        </div>
    `).join('');
};

// API Globale pour les événements onclick
window.switchProject = (id) => {
    state.activeProjectId = id;
    renderProjects();
    renderKanban();
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    renderKanban();
});
