import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Job, ApplicationStatus } from '../types';
import { analyzeMatch } from '../services/geminiService';
import { Search, Briefcase, MapPin, Plus, RefreshCw, Loader2 } from 'lucide-react';

export const JobSearchPage = () => {
  const { jobs, setJobs, profile, addLog } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('Senior Full Stack Engineer');
  const [isSearching, setIsSearching] = useState(false);

  // Simulator for MS-2: Job Search Engine
  const handleSearch = async () => {
    setIsSearching(true);
    addLog(`MS-2: Searching sources (LinkedIn, Indeed) for "${searchTerm}"...`);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 2000));
    
    // Mock finding a new job
    const newJob: Job = {
      id: `j-${Date.now()}`,
      title: searchTerm,
      company: "TechGiant AI " + Math.floor(Math.random() * 100),
      location: "Remote",
      type: "Contract",
      source: "Scraper Bot",
      postedDate: new Date().toISOString().split('T')[0],
      status: ApplicationStatus.QUEUED,
      url: "https://example.com/job",
      description: `We are seeking a ${searchTerm} with experience in React and Node.js. 
      You will work on our core automated systems. Ideally experience with Python and AI agents.`
    };

    // Call Gemini for matching score
    addLog(`MS-2: Analyzing match score for ${newJob.company}...`);
    const matchResult = await analyzeMatch(profile, newJob);
    
    const scoredJob = { ...newJob, matchScore: matchResult.score, matchReasoning: matchResult.reasoning };
    
    setJobs((prev: Job[]) => [scoredJob, ...prev]);
    addLog(`MS-2: Found job at ${newJob.company} with ${matchResult.score}% match.`);
    setIsSearching(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-white">Job Search Engine</h1>
            <p className="text-slate-400 text-sm mt-1">Microservice 2: Aggregator & Matcher</p>
        </div>
        <div className="flex gap-2">
             <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs border border-green-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Scraper Active
             </span>
        </div>
      </div>

      {/* Search Control */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-8 flex gap-4">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="Job Title, Keywords, or Company"
            />
        </div>
        <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
        >
            {isSearching ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            Run Scraper
        </button>
      </div>

      {/* Job Feed */}
      <div className="space-y-4">
        {jobs.map((job: Job) => (
            <div key={job.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-4 text-slate-400 text-sm mt-1">
                            <span className="flex items-center gap-1"><Briefcase size={14}/> {job.company}</span>
                            <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                            <span className="text-slate-600">via {job.source}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        {job.matchScore && (
                            <div className={`text-xl font-bold ${job.matchScore > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {job.matchScore}% Match
                            </div>
                        )}
                        <span className="text-xs text-slate-500 block mt-1">{job.postedDate}</span>
                    </div>
                </div>
                
                <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800 text-sm text-slate-400 line-clamp-2">
                    {job.description}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                        <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">React</span>
                        <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">Node.js</span>
                    </div>
                    {job.status === ApplicationStatus.QUEUED && (
                         <button className="text-blue-400 text-sm hover:text-blue-300 font-medium flex items-center gap-1">
                             Add to Tailoring Queue <Plus size={16} />
                         </button>
                    )}
                    {job.status !== ApplicationStatus.QUEUED && (
                        <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                            STATUS: {job.status}
                        </span>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};