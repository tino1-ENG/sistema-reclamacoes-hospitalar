import { apiClient } from './api-client';
import type { IFaqService } from '../contracts';
import type { FAQ } from '../../types';

interface BackendFaq {
  _id: string;
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
    id: f._id,
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

  saveFaq(faq: Partial<FAQ>): Promise<FAQ> {
    return Promise.resolve({
      id: faq.id || Math.random().toString(),
      hospitalId: 'HCM-01',
      question: faq.question || '',
      answer: faq.answer || '',
      sortOrder: faq.sortOrder || 1,
      isPublished: faq.isPublished ?? true,
      category: faq.category || 'Geral',
      createdAt: new Date().toISOString()
    });
  }

  deleteFaq(id?: string): Promise<void> {
    void id;
    return Promise.resolve();
  }
}

export const restFaqService = new RestFaqService();
