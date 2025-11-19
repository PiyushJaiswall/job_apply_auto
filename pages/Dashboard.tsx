import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Job, ApplicationStatus } from '../types';
import { BarChart, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <div className={`p-2 rounded-lg bg-opacity-20 ${color.bg} ${color.text}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
  </div>
);

export const DashboardPage = () => {
  const { jobs, logs } = useContext(AppContext);

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j: Job) => j.status === ApplicationStatus.APPLIED).length,
    interviews: jobs.filter((j: Job) => j.status === ApplicationStatus.INTERVIEW).length,
    queued: jobs.filter((j: Job) => j.status === ApplicationStatus.QUEUED).length,
  };

  const data = [
    { name: 'Applied', value: stats.applied, color: '#3b82f6' },
    { name: 'Queued', value: stats.queued, color: '#eab308' },
    { name: 'Interview', value: stats.interviews, color: '#22c55e' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Mission Control</h1>
      <p className="text-slate-400 mb-8">Overview of your automated job hunt ecosystem.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Jobs Tracked" value={stats.total} icon={Activity} color={{ bg: 'bg-blue-500', text: 'text-blue-500' }} />
        <StatCard title="Auto-Applied" value={stats.applied} icon={CheckCircle} color={{ bg: 'bg-green-500', text: 'text-green-500' }} />
        <StatCard title="Pending Tailor" value={stats.queued} icon={Clock} color={{ bg: 'bg-yellow-500', text: 'text-yellow-500' }} />
        <StatCard title="Interviews" value={stats.interviews} icon={BarChart} color={{ bg: 'bg-purple-500', text: 'text-purple-500' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity Log</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic">System initialization complete. Waiting for agents...</p>
            ) : (
              logs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 text-sm border-b border-slate-800/50 pb-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className="text-slate-300">{log.msg}</p>
                    <p className="text-slate-500 text-xs mt-1">{log.time.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Pipeline Status</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
             {data.map((d) => (
               <div key={d.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                   <span className="text-slate-300">{d.name}</span>
                 </div>
                 <span className="font-mono text-slate-400">{d.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};