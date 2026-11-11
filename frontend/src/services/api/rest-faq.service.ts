import { apiClient } from './api-client';
import type { IFaqService } from '../contracts';
import type { FAQ } from '../../types';

interface BackendFaq {
  _id?: string;
  id?: string;
  hospitalId: string;
  category: string;
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
}

function mapFaq(f: BackendFaq): FAQ {
  return {
    id: f._id || f.id || '',
    hospitalId: f.hospitalId,
    question: f.question,
    answer: f.answer,
    sortOrder: f.orderIndex,
    isPublished: f.isActive,
    category: f.category,
    createdAt: f.createdAt
  };
}

export class RestFaqService implements IFaqService {
  async getPublishedFaqs(): Promise<FAQ[]> {
    const res = await apiClient.get('/faqs');
    const docs = res.data.data as BackendFaq[];
    return docs.map(mapFaq);
  }

  async getAllFaqs(): Promise<FAQ[]> {
    return this.getPublishedFaqs();
  }

  async saveFaq(faq: Partial<FAQ>): Promise<FAQ> {
    const payload = {
      category: faq.category || 'Geral',
      question: faq.question || '',
      answer: faq.answer || '',
      orderIndex: faq.sortOrder ?? 0,
      isActive: faq.isPublished ?? true
    };

    if (faq.id) {
      const res = await apiClient.put(`/faqs/${faq.id}`, payload);
      return mapFaq(res.data.data);
    } else {
      const res = await apiClient.post('/faqs', payload);
      return mapFaq(res.data.data);
    }
  }

  async deleteFaq(id?: string): Promise<void> {
    if (!id) return;
    await apiClient.delete(`/faqs/${id}`);
  }
}

export const restFaqService = new RestFaqService();
