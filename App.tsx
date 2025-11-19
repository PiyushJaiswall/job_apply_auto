import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Send, 
  Settings, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';

// Components
import { BlueprintView } from './components/BlueprintView';

// Pages (Inline for simplicity in this single-shot architecture, normally separate files)
import { DashboardPage } from './pages/Dashboard';
import { JobSearchPage } from './pages/JobSearch';
import { ResumeTailorPage } from './pages/ResumeTailor';
import { TrackerPage } from './pages/ApplicationTracker';

// Context
export const AppContext = React.createContext<any>(null);
import { MY_PROFILE, INITIAL_JOBS } from './services/mockData';
import { Job, Profile } from './types';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const App = () => {
  // Global State
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [profile, setProfile] = useState<Profile>(MY_PROFILE);
  const [logs, setLogs] = useState<any[]>([]);

  const addLog = (msg: string, type: 'info'|'error' = 'info') => {
    setLogs(prev => [{ id: Date.now(), msg, type, time: new Date() }, ...prev]);
  };

  return (
    <AppContext.Provider value={{ jobs, setJobs, profile, setProfile, logs, addLog }}>
      <HashRouter>
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-20">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-xl">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">AI</div>
                <span>AutoHire</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">v3.0.1-beta</p>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">Operations</div>
              <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
              <SidebarItem to="/search" icon={Search} label="Job Search" />
              <SidebarItem to="/tailor" icon={FileText} label="Resume Tailor" />
              <SidebarItem to="/tracker" icon={Send} label="Auto-Apply" />
              
              <div className="mt-8 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">Documentation</div>
              <SidebarItem to="/blueprint" icon={BookOpen} label="System Blueprint" />
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center gap-3 p-2 rounded bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">AD</div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{profile.name}</p>
                  <p className="text-xs text-slate-500 truncate">Pro Plan</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto relative bg-slate-950">
             <Routes>
               <Route path="/" element={<DashboardPage />} />
               <Route path="/search" element={<JobSearchPage />} />
               <Route path="/tailor" element={<ResumeTailorPage />} />
               <Route path="/tracker" element={<TrackerPage />} />
               <Route path="/blueprint" element={<BlueprintView />} />
             </Routes>
          </main>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
