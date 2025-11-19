import { GoogleGenAI, Type } from "@google/genai";
import { Profile, Job, TailoredResume } from "../types";

// Initialize the API client
// Note: In a real production app, this would be on the backend.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'dummy-key-for-ui-demo' });

export const analyzeMatch = async (profile: Profile, job: Job): Promise<{ score: number, reasoning: string }> => {
  if (!process.env.API_KEY) {
    // Mock response if no key
    return {
        score: Math.floor(Math.random() * 30) + 70,
        reasoning: "Simulated match score (API Key missing). The skills overlap significantly with the job description."
    };
  }

  try {
    const prompt = `
      Act as a Hiring Manager. Compare the following candidate profile and job description.
      
      JOB DESCRIPTION:
      ${job.title} at ${job.company}
      ${job.description}

      CANDIDATE PROFILE:
      Skills: ${profile.skills.join(', ')}
      Experience: ${profile.experience.join('; ')}
      Projects: ${profile.projects.map(p => p.title + ": " + p.techStack.join(', ')).join('; ')}

      Output a JSON object with a 'score' (0-100) and a short 'reasoning' string explaining the score.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Match analysis failed", error);
    return { score: 0, reasoning: "Analysis failed due to API error." };
  }
};

export const tailorResume = async (profile: Profile, job: Job): Promise<TailoredResume> => {
    if (!process.env.API_KEY) {
        // Mock tailored response
        const selectedProjects = profile.projects.slice(0, 3);
        return {
            jobId: job.id,
            originalProfileId: "p1",
            extractedKeywords: ["React", "AI", "Automation"],
            matchAnalysis: "Strong match for frontend and AI skills.",
            rewrittenObjective: `To leverage deep experience in ${job.title} roles to drive innovation at ${job.company}.`,
            selectedProjectIds: selectedProjects.map(p => p.id),
            rewrittenProjectDescriptions: selectedProjects.reduce((acc, p) => ({
                ...acc,
                [p.id]: p.description.map(d => `Optimized: ${d}`)
            }), {})
        };
    }

    try {
        const prompt = `
        You are an expert Resume Writer and ATS Specialist.
        
        TASK:
        1. Extract top 5 keywords from the Job Description (JD).
        2. Rewrite the Candidate's Objective to align with the JD.
        3. Select the 3 MOST RELEVANT projects from the candidate's list that match the JD requirements.
        4. Rewrite the project bullet points to be result-oriented, using keywords from the JD.
        
        JOB DESCRIPTION:
        ${job.title} at ${job.company}
        ${job.description}
        
        CANDIDATE PROJECTS:
        ${JSON.stringify(profile.projects)}
        
        CANDIDATE OBJECTIVE:
        ${profile.objective}
        
        Output strictly JSON matching this schema:
        {
            "rewrittenObjective": "string",
            "selectedProjectIds": ["string"],
            "rewrittenProjectDescriptions": { "projectId": ["string"] },
            "extractedKeywords": ["string"],
            "matchAnalysis": "string"
        }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        return JSON.parse(response.text || "{}") as TailoredResume;

    } catch (e) {
        console.error("Tailoring failed", e);
        throw e;
    }
}