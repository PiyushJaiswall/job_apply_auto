import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { Job, ApplicationStatus } from '../types';
import { Terminal, Play, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

const StatusColumn = ({ title, status, jobs, color }: any) => (
  <div className="bg-slate-900/50 flex flex-col rounded-lg h-full border border-slate-800">
    <div className={`p-3 border-b border-slate-800 ${color} bg-opacity-10 font-semibold text-sm uppercase tracking-wide`}>
        {title} <span className="ml-2 opacity-50 text-xs bg-slate-800 px-2 py-0.5 rounded">{jobs.length}</span>
    </div>
    <div className="p-3 space-y-3 overflow-y-auto flex-1">
        {jobs.map((job: Job) => (
            <div key={job.id} className="bg-slate-900 p-3 rounded border border-slate-800 shadow-sm hover:border-slate-600 transition-colors cursor-grab active:cursor-grabbing">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-white text-sm">{job.company}</h4>
                    <a href={job.url} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-blue-400"><ExternalLink size={12}/></a>
                </div>
                <p className="text-xs text-slate-400 mb-2 truncate">{job.title}</p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{job.postedDate}</span>
                    {job.matchScore && <span className="text-green-500 font-mono">{job.matchScore}%</span>}
                </div>
            </div>
        ))}
    </div>
  </div>
);

export const TrackerPage = () => {
  const { jobs, addLog } = useContext(AppContext);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const filterByStatus = (s: ApplicationStatus) => jobs.filter((j: Job) => j.status === s);

  // Playwright Simulation
  const runAutomation = () => {
    const pendingJob = jobs.find((j: Job) => j.status === ApplicationStatus.QUEUED);
    if(!pendingJob) return;

    setActiveJob(pendingJob);
    setConsoleOutput([]);
    
    const steps = [
        `[Playwright] Launching browser (Headless: true)...`,
        `[Playwright] Context created. Loading storageState.json (Session cookie)...`,
        `[Playwright] Navigating to ${pendingJob.url}...`,
        `[Wait] Waiting for selector 'button[aria-label="Easy Apply"]'...`,
        `[Action] Clicked 'Easy Apply'.`,
        `[Form] Filling Name: "Alex Dev"`,
        `[Form] Filling Email: "alex.dev@example.com"`,
        `[Form] Uploading Resume: "resume_${pendingJob.id}_tailored.pdf"...`,
        `[Validation] 98% accuracy check passed.`,
        `[Warning] Stopping before Final Submit (Safety Mode Enabled).`
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i >= steps.length) {
            clearInterval(interval);
            setActiveJob(null);
            addLog(`MS-3: Pre-filled application for ${pendingJob.company}. Ready for review.`);
        } else {
            setConsoleOutput(prev => [...prev, steps[i]]);
            i++;
        }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
            <h1 className="text-2xl font-bold text-white">Application Tracker</h1>
            <p className="text-slate-400">Microservice 3: Automation & State Management</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-black rounded-lg border border-slate-800 w-96 h-32 p-3 font-mono text-xs overflow-y-auto text-green-400 shadow-lg">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-1 mb-1 text-slate-500">
                    <Terminal size={12} /> Playwright Console
                </div>
                {consoleOutput.map((line, i) => (
                    <div key={i} className="truncate">{line}</div>
                ))}
                {!activeJob && <span className="text-slate-600 animate-pulse">_ Waiting for command...</span>}
            </div>
            <button 
                onClick={runAutomation}
                disabled={!!activeJob}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 h-fit self-center disabled:opacity-50"
            >
                <Play size={18} /> Run Batch
            </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
        <StatusColumn 
            title="Queued" 
            status={ApplicationStatus.QUEUED} 
            jobs={filterByStatus(ApplicationStatus.QUEUED)} 
            color="text-slate-400"
        />
        <StatusColumn 
            title="Tailoring / Prefilling" 
            status={ApplicationStatus.TAILORING} 
            jobs={[]} // Empty for demo, would be populated by state
            color="text-blue-400"
        />
        <StatusColumn 
            title="Applied" 
            status={ApplicationStatus.APPLIED} 
            jobs={filterByStatus(ApplicationStatus.APPLIED)} 
            color="text-green-400"
        />
        <StatusColumn 
            title="Interview" 
            status={ApplicationStatus.INTERVIEW} 
            jobs={filterByStatus(ApplicationStatus.INTERVIEW)} 
            color="text-purple-400"
        />
      </div>
    </div>
  );
};