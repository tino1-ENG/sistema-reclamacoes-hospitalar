import { Process, Feedback } from '../models/index.js';
import type { AuthenticatedUser } from '../types/express.d.js';
import mongoose from 'mongoose';

export class DashboardService {
  async getMetrics(user: AuthenticatedUser) {
    const baseQuery: Record<string, unknown> = {};

    if (user.roles.includes('PATIENT')) {
      baseQuery.patientId = new mongoose.Types.ObjectId(user.id);
    } else if (user.roles.includes('STAFF')) {
      if (user.departmentId) {
        baseQuery.$or = [
          { assignedStaffId: new mongoose.Types.ObjectId(user.id) },
          { departmentId: new mongoose.Types.ObjectId(user.departmentId) }
        ];
      } else {
        baseQuery.assignedStaffId = new mongoose.Types.ObjectId(user.id);
      }
    }

    const totalProcesses = await Process.countDocuments(baseQuery);
    const pendingTriage = await Process.countDocuments({ ...baseQuery, status: { $in: ['SUBMITTED', 'TRIAGE'] } });
    const inReview = await Process.countDocuments({ ...baseQuery, status: { $in: ['ASSIGNED', 'IN_REVIEW'] } });
    const answered = await Process.countDocuments({ ...baseQuery, status: 'ANSWERED' });
    const closed = await Process.countDocuments({ ...baseQuery, status: 'CLOSED' });

    // Prazos em risco ou vencidos
    const now = new Date();
    const slaBreached = await Process.countDocuments({
      ...baseQuery,
      status: { $nin: ['CLOSED', 'ANSWERED'] },
      slaDueAt: { $lt: now }
    });

    const slaComplianceRate =
      totalProcesses > 0 ? Math.round(((totalProcesses - slaBreached) / totalProcesses) * 100) : 100;

    // Média de satisfação
    const feedbacks = await Feedback.find();
    const satisfactionScore =
      feedbacks.length > 0
        ? parseFloat((feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1))
        : 4.8;

    return {
      totalProcesses,
      pendingTriage,
      inReview,
      answered,
      closed,
      slaBreached,
      slaComplianceRate,
      satisfactionScore
    };
  }
}

export const dashboardService = new DashboardService();
