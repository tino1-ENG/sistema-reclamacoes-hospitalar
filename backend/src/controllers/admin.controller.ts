import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User, type RoleCode } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { role, search } = req.query;
    const query: Record<string, unknown> = {};

    if (role && typeof role === 'string' && role !== 'ALL') {
      query.roles = role as RoleCode;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ];
    }

    const docs = await User.find(query)
      .populate('departmentId', 'name code')
      .sort({ createdAt: -1 });

    const data = docs.map((u) => ({
      id: u._id.toString(),
      hospitalId: u.hospitalId ? u.hospitalId.toString() : 'hosp-001',
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      roles: u.roles,
      isActive: u.status === 'ACTIVE',
      status: u.status,
      departmentId: u.departmentId ? (u.departmentId as unknown as { _id: string })._id?.toString() || u.departmentId.toString() : undefined,
      departmentName: u.departmentId ? (u.departmentId as unknown as { name?: string }).name : undefined,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt
    }));

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fullName, phone, email, roles, departmentId, password } = req.body;

    if (!fullName || !phone) {
      res.status(400).json({
        success: false,
        message: 'Nome e telefone são obrigatórios.'
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password || '123456', 10);
    const userRole = Array.isArray(roles) && roles.length ? roles : ['STAFF'];

    const user = await User.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      roles: userRole,
      departmentId: departmentId || undefined,
      passwordHash,
      status: 'ACTIVE',
      isPhoneVerified: true
    });

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        userName: req.user.fullName,
        action: 'USER_CREATED_BY_ADMIN',
        entity: 'USER',
        entityId: user._id.toString(),
        details: { roles: user.roles, departmentId }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        isActive: true,
        departmentId: user.departmentId ? user.departmentId.toString() : undefined,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Utilizador não encontrado.'
      });
      return;
    }

    user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id.toString(),
        isActive: user.status === 'ACTIVE',
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { entity, action, search, limit = '100' } = req.query;
    const query: Record<string, unknown> = {};

    if (entity && typeof entity === 'string' && entity !== 'ALL') {
      query.entity = entity;
    }
    if (action && typeof action === 'string' && action !== 'ALL') {
      query.action = action;
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { userName: { $regex: q, $options: 'i' } },
        { action: { $regex: q, $options: 'i' } },
        { entityId: { $regex: q, $options: 'i' } }
      ];
    }

    const docs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 100, 500));

    const data = docs.map((log) => ({
      id: log._id.toString(),
      userId: log.userId ? log.userId.toString() : undefined,
      userName: log.userName || 'Sistema',
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      details: log.details,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt
    }));

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}
