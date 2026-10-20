// HospitalCare — Serviço Mock de Perguntas Frequentes (FAQ)

import type { IFaqService } from '../contracts';
import type { FAQ } from '../../types';
import { mockFaqs } from './mock-data';

class MockFaqService implements IFaqService {
  private faqs: FAQ[] = [...mockFaqs];

  async getPublishedFaqs(): Promise<FAQ[]> {
    await new Promise((r) => setTimeout(r, 120));
    return this.faqs
      .filter((f) => f.isPublished)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getAllFaqs(): Promise<FAQ[]> {
    await new Promise((r) => setTimeout(r, 120));
    return [...this.faqs].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async saveFaq(data: Partial<FAQ>): Promise<FAQ> {
    await new Promise((r) => setTimeout(r, 200));
    if (data.id) {
      const idx = this.faqs.findIndex((f) => f.id === data.id);
      if (idx !== -1) {
        this.faqs[idx] = { ...this.faqs[idx], ...data } as FAQ;
        return this.faqs[idx];
      }
    }
    const newFaq: FAQ = {
      id: `faq-${Date.now()}`,
      hospitalId: 'hosp-001',
      question: data.question || '',
      answer: data.answer || '',
      sortOrder: data.sortOrder || this.faqs.length + 1,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      category: data.category || 'Geral',
      createdAt: new Date().toISOString()
    };
    this.faqs.push(newFaq);
    return newFaq;
  }

  async deleteFaq(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 150));
    this.faqs = this.faqs.filter((f) => f.id !== id);
  }
}

export const mockFaqService = new MockFaqService();
