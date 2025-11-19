import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Database, Server, Shield, Terminal, Cpu, Layers } from 'lucide-react';

const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-700 rounded-lg mb-4 bg-slate-800/50 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-6 border-t border-slate-700 bg-slate-900/50 text-slate-300 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export const BlueprintView = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Architecture Blueprint</h1>
        <p className="text-slate-400">
          Detailed technical specification for the 3-microservice AutoHire ecosystem.
        </p>
      </div>

      <Section title="1. High-Level Architecture" icon={Layers}>
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded border border-slate-700 font-mono text-xs overflow-x-auto">
            <pre>{`
[Internet] <--> [Proxies/VPN] <--> [Job Search Engine (MS-2)]
                                          |
                                          v
                                   [Redis Queue (Jobs)]
                                          |
                                          v
[User Profile DB] ----------------> [Resume Tailor (MS-1)] <--> [Gemini API]
                                          |
                                          v
                                   [Tailored PDF + JSON]
                                          |
                                          v
                                  [App Prefill Engine (MS-3)] <--> [Playwright]
                                          |
                                          v
                                   [Target Job Portals]
            `}</pre>
          </div>
          <p>
            The system is composed of three distinct Node.js/Python microservices communicating via Redis streams.
            Each service scales independently on Kubernetes.
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>MS-1 (Tailor):</strong> Node.js + Gemini Flash 2.5. CPU intensive for PDF generation.</li>
            <li><strong>MS-2 (Search):</strong> Python + Scrapy/Selenium. Network I/O bound. Rotates IPs.</li>
            <li><strong>MS-3 (Apply):</strong> TypeScript + Playwright. Memory intensive (Headless browsers).</li>
          </ul>
        </div>
      </Section>

      <Section title="2. Service 1: Resume Tailoring Engine" icon={Cpu}>
        <h4 className="text-white font-bold">Responsibilities</h4>
        <p>Accepts JD & Profile -> Outputs PDF & Metadata.</p>
        
        <h4 className="text-white font-bold mt-4">API Specification</h4>
        <div className="bg-slate-950 p-3 rounded font-mono text-sm border border-slate-700">
          <p className="text-green-400">POST /api/v1/tailor</p>
          <pre className="text-slate-400 mt-2">{`
Request:
{
  "job_description": "string",
  "profile_id": "uuid",
  "config": { "tone": "professional", "max_pages": 1 }
}

Response:
{
  "resume_pdf_url": "s3://bucket/resume_123.pdf",
  "metadata": {
    "skills_matched": ["React", "AWS"],
    "match_score": 85
  }
}
          `}</pre>
        </div>
        
        <h4 className="text-white font-bold mt-4">Core Logic</h4>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Embedding:</strong> Uses <code>text-embedding-004</code> to vectorise JD.</li>
          <li><strong>Ranking:</strong> Cosine similarity against project vectors. Top 3 selected.</li>
          <li><strong>Generation:</strong> <code>gemini-2.5-flash</code> rewrites bullets using STAR method.</li>
        </ul>
      </Section>

      <Section title="3. Service 2: Job Search & Matching" icon={Terminal}>
        <h4 className="text-white font-bold">Strategy</h4>
        <p>Hybrid approach using RSS feeds (safe) and Headless scraping (fallback).</p>
        
        <h4 className="text-white font-bold mt-4">Database Schema (Jobs)</h4>
        <div className="bg-slate-950 p-3 rounded font-mono text-sm border border-slate-700">
          <pre className="text-slate-400">{`
TABLE jobs (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  company VARCHAR(255),
  jd_text TEXT,
  jd_vector VECTOR(768), -- pgvector extension
  apply_url TEXT,
  source_enum VARCHAR(50),
  match_score DECIMAL(5,2),
  created_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'NEW'
);
          `}</pre>
        </div>
      </Section>

      <Section title="4. Service 3: Application Prefill" icon={Terminal}>
         <h4 className="text-white font-bold">Playwright Automation Strategy</h4>
         <ul className="list-disc list-inside ml-4 mb-4">
            <li><strong>Session Persistence:</strong> Save <code>storageState.json</code> after manual login to avoid 2FA on every run.</li>
            <li><strong>Humanization:</strong> Random mouse movements (Bezier curves) and typing delays (50ms-150ms).</li>
            <li><strong>Selector Strategy:</strong> Use semantic locators <code>getByRole('textbox', {name: 'email'})</code> instead of fragile XPaths.</li>
         </ul>

         <h4 className="text-white font-bold">State Machine</h4>
         <div className="flex gap-2 mt-2 text-xs font-mono">
            <span className="bg-slate-700 px-2 py-1 rounded">QUEUED</span>
            <span>→</span>
            <span className="bg-blue-900 px-2 py-1 rounded">NAVIGATING</span>
            <span>→</span>
            <span className="bg-yellow-900 px-2 py-1 rounded">FILLING</span>
            <span>→</span>
            <span className="bg-purple-900 px-2 py-1 rounded">UPLOAD_RESUME</span>
            <span>→</span>
            <span className="bg-green-900 px-2 py-1 rounded">PENDING_SUBMIT</span>
         </div>
      </Section>

      <Section title="5. Database & Storage" icon={Database}>
        <h4 className="text-white font-bold">PostgreSQL + Redis + S3</h4>
        <ul className="list-disc list-inside ml-4">
            <li><strong>PostgreSQL:</strong> Relational data (Profiles, Jobs, App History).</li>
            <li><strong>Redis:</strong> Job Queue (BullMQ) for processing pipelines. Caching scrape results.</li>
            <li><strong>S3/MinIO:</strong> Stores generated PDF resumes and debug screenshots from Playwright.</li>
        </ul>
      </Section>

      <Section title="6. Security & Compliance" icon={Shield}>
        <h4 className="text-white font-bold">Anti-Bot & Safety</h4>
        <p>To prevent IP bans and ToS violations:</p>
        <ul className="list-disc list-inside ml-4 mt-2">
            <li><strong>Rate Limiting:</strong> Max 5 applications per hour per site.</li>
            <li><strong>User-Agent Rotation:</strong> Use a pool of valid, modern UA strings.</li>
            <li><strong>No Auto-Submit:</strong> The bot stops at the "Review" page. User clicks "Submit" manually to ensure accuracy and avoid CAPTCHA complications.</li>
            <li><strong>Secrets:</strong> All credentials (LinkedIn password, API Keys) stored in HashiCorp Vault or K8s Secrets.</li>
        </ul>
      </Section>

      <Section title="7. DevOps & Deployment" icon={Server}>
         <p>Deployed via Helm Charts on a K3s cluster.</p>
         <div className="bg-slate-950 p-3 rounded font-mono text-sm border border-slate-700 mt-2">
            <p>helm install auto-hire ./charts/auto-hire --set replicas.tailor=2</p>
         </div>
         <p className="mt-2"><strong>CI/CD:</strong> GitHub Actions triggers docker builds. 'Canary' release for the Scraper service to test new site layouts.</p>
      </Section>
    </div>
  );
};