import { apiClient } from './api-client';

export interface AIChatResponse {
  sessionId: string;
  response: string;
  suggestedAction?: Record<string, unknown>;
}

export interface AISummaryResponse {
  summary: string;
  keyPoints: string[];
  urgencyReasoning: string;
}

export interface AIReplyResponse {
  draft: string;
  requiresHumanReview: boolean;
}

export interface AITriageResponse {
  suggestedDepartmentId?: string;
  suggestedDepartmentName?: string;
  suggestedPriority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  confidenceScore: number;
  rationale: string;
}

export interface AIStatusResponse {
  configuredProvider: string;
  activeProvider: string;
  isLocalAvailable: boolean;
  isGeminiAvailable: boolean;
  localUrl: string;
  localModel: string;
  geminiModel: string;
}

export class RestAIService {
  async chat(message: string, sessionId?: string): Promise<AIChatResponse> {
    const res = await apiClient.post('/ai/chat', { message, sessionId });
    return res.data.data;
  }

  async getStatus(): Promise<AIStatusResponse> {
    const res = await apiClient.get('/ai/status');
    return res.data.data;
  }

  async triage(title: string, description: string): Promise<AITriageResponse> {
    const res = await apiClient.post('/ai/triage', { title, description });
    return res.data.data;
  }

  async summarize(processId: string): Promise<AISummaryResponse> {
    const res = await apiClient.post('/ai/summarize', { processId });
    return res.data.data;
  }

  async suggestReply(processId: string, staffNotes?: string): Promise<AIReplyResponse> {
    const res = await apiClient.post('/ai/suggest-reply', { processId, staffNotes });
    return res.data.data;
  }
}

export const aiService = new RestAIService();
