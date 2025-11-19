import { Profile, Job, ApplicationStatus } from '../types';

export const MY_PROFILE: Profile = {
  name: "Alex Dev",
  email: "alex.dev@example.com",
  phone: "+1-555-0199",
  linkedin: "linkedin.com/in/alexdev",
  github: "github.com/alexdev",
  objective: "Senior Full Stack Engineer looking for challenging roles in AI/ML automation.",
  skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker", "Kubernetes", "AWS", "Google Cloud", "Gemini API"],
  education: ["B.S. Computer Science, Tech University (2018)"],
  experience: ["Senior Engineer at TechCorp (2021-Present)", "Software Engineer at StartUp Inc (2018-2021)"],
  projects: [
    {
      id: "p1",
      title: "E-Commerce Microservices",
      techStack: ["Node.js", "RabbitMQ", "PostgreSQL"],
      description: ["Built a scalable order processing system.", "Reduced latency by 40% using message queues."]
    },
    {
      id: "p2",
      title: "AI Chatbot Platform",
      techStack: ["Python", "LangChain", "React"],
      description: ["Developed a RAG-based chatbot for customer support.", "Integrated vector database for knowledge retrieval."]
    },
    {
      id: "p3",
      title: "Real-time Analytics Dashboard",
      techStack: ["React", "D3.js", "WebSocket"],
      description: ["Visualized high-frequency trading data.", "Optimized frontend rendering performance."]
    },
    {
      id: "p4",
      title: "Cloud Infrastructure Automation",
      techStack: ["Terraform", "AWS", "Go"],
      description: ["Automated VPC and EC2 provisioning.", "Implemented CI/CD pipelines for infrastructure code."]
    },
    {
      id: "p5",
      title: "Mobile Health App",
      techStack: ["React Native", "Firebase"],
      description: ["Built a cross-platform app for patient monitoring.", "Implemented HIPAA-compliant data storage."]
    },
    {
      id: "p6",
      title: "Blockchain Voting System",
      techStack: ["Solidity", "Web3.js"],
      description: ["Designed a decentralized voting mechanism.", "Audited smart contracts for security vulnerabilities."]
    }
  ]
};

export const INITIAL_JOBS: Job[] = [
  {
    id: "j1",
    title: "Senior AI Engineer",
    company: "DeepMindOps",
    location: "Remote",
    type: "Full-time",
    source: "LinkedIn",
    postedDate: "2023-10-25",
    status: ApplicationStatus.QUEUED,
    url: "https://linkedin.com/jobs/view/123456",
    description: "We are looking for a Senior AI Engineer to build agentic workflows. Must have experience with LLMs, Python, and Vector DBs. Experience with React is a plus for building internal tools."
  },
  {
    id: "j2",
    title: "Frontend Tech Lead",
    company: "CreativeUi Ltd",
    location: "New York, NY",
    type: "Hybrid",
    source: "Indeed",
    postedDate: "2023-10-26",
    status: ApplicationStatus.APPLIED,
    url: "https://indeed.com/viewjob?jk=78910",
    description: "Leading a team of 5 developers. Deep expertise in React, TypeScript, and Accessibility standards required. Dashboard experience preferred."
  },
  {
    id: "j3",
    title: "DevOps Specialist",
    company: "CloudScale",
    location: "Austin, TX",
    type: "On-site",
    source: "Company Site",
    postedDate: "2023-10-24",
    status: ApplicationStatus.INTERVIEW,
    url: "https://cloudscale.io/careers/devops",
    description: "Manage Kubernetes clusters and CI/CD pipelines. Experience with Terraform and AWS is mandatory. Golang scripting is desired."
  }
];