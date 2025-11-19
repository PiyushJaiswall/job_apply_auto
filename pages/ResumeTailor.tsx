import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Job, TailoredResume } from '../types';
import { tailorResume } from '../services/geminiService';
import { FileText, Wand2, Check, ArrowRight, Loader2 } from 'lucide-react';

export const ResumeTailorPage = () => {
  const { jobs, profile, addLog } = useContext(AppContext);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [tailoredData, setTailoredData] = useState<TailoredResume | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedJob = jobs.find((j: Job) => j.id === selectedJobId);

  const handleTailor = async () => {
    if (!selectedJob) return;
    setLoading(true);
    setTailoredData(null);
    addLog(`MS-1: Starting Resume Tailoring for ${selectedJob.company}...`);

    try {
        const result = await tailorResume(profile, selectedJob);
        setTailoredData(result);
        addLog(`MS-1: Tailoring complete. PDF generated.`);
    } catch (e) {
        addLog(`MS-1: Error tailoring resume.`, 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
        {/* Job List Sidebar */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/50 p-4 overflow-y-auto">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Queue</h2>
            <div className="space-y-2">
                {jobs.map((job: Job) => (
                    <div 
                        key={job.id}
                        onClick={() => setSelectedJobId(job.id)}
                        className={`p-3 rounded-lg cursor-pointer border transition-all ${
                            selectedJobId === job.id 
                            ? 'bg-blue-900/20 border-blue-500/50' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                        <h3 className="text-sm font-medium text-white truncate">{job.title}</h3>
                        <p className="text-xs text-slate-400 truncate">{job.company}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 p-8 overflow-y-auto">
            {!selectedJob ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p>Select a job to start tailoring</p>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Resume Studio</h1>
                            <p className="text-slate-400">Target: {selectedJob.company}</p>
                        </div>
                        <button 
                            onClick={handleTailor}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-purple-900/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                            Generative Tailor
                        </button>
                    </div>

                    {/* Results View */}
                    {tailoredData ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Match Analysis */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                    <Check className="text-green-500" size={16}/> Gemini Analysis
                                </h3>
                                <p className="text-slate-300 italic">"{tailoredData.matchAnalysis}"</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {tailoredData.extractedKeywords.map(k => (
                                        <span key={k} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded border border-blue-800">
                                            {k}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Objective Comparison */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 opacity-60">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Original Objective</h4>
                                    <p className="text-sm text-slate-400">{profile.objective}</p>
                                </div>
                                <div className="bg-slate-900 p-6 rounded-xl border border-green-900/50 shadow-inner shadow-green-900/10">
                                    <h4 className="text-xs font-bold text-green-500 uppercase mb-2">Tailored Objective</h4>
                                    <p className="text-sm text-slate-200">{tailoredData.rewrittenObjective}</p>
                                </div>
                            </div>

                            {/* Projects Selection */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Selected & Rewritten Projects</h3>
                                <div className="space-y-4">
                                    {tailoredData.selectedProjectIds.map(pid => {
                                        const original = profile.projects.find(p => p.id === pid);
                                        const rewrittenBullets = tailoredData.rewrittenProjectDescriptions[pid];
                                        return (
                                            <div key={pid} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                                <div className="flex justify-between mb-3">
                                                    <h4 className="font-bold text-blue-400">{original?.title}</h4>
                                                    <div className="flex gap-2">
                                                        {original?.techStack.map(t => (
                                                            <span key={t} className="text-xs text-slate-500 bg-slate-950 px-2 py-0.5 rounded">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                                    <div className="opacity-50 border-r border-slate-800 pr-4">
                                                        <p className="text-xs font-bold text-slate-500 mb-2">BEFORE</p>
                                                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                                                            {original?.description.map((d, i) => <li key={i}>{d}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-green-500 mb-2">AFTER (Metrics & Keywords)</p>
                                                        <ul className="list-disc list-inside space-y-2 text-slate-200">
                                                            {rewrittenBullets?.map((d, i) => <li key={i}>{d}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4 border-t border-slate-800">
                                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-500 transition-colors flex items-center gap-2">
                                    Send to Auto-Apply <ArrowRight size={18}/>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Empty State / Instructions */
                        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
                            <div className="max-w-md mx-auto text-slate-500 text-sm">
                                <p>The AI will analyze the JD against your profile, select the top 3 impactful projects, and rewrite your bullet points to maximize semantic similarity with the requirements.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};