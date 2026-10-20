import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, type IUser, type RoleCode } from '../models/User.js';
import { Hospital } from '../models/Hospital.js';
import { AuditLog } from '../models/AuditLog.js';
import { env } from '../config/env.js';

export class AuthService {
  async login(identifier: string, passwordPlain: string, _roleHint?: RoleCode) {
    // Normalização básica de telefone ou email
    const cleanId = identifier.trim();
    const isEmail = cleanId.includes('@');

    const user = await User.findOne(
      isEmail
        ? { email: cleanId.toLowerCase() }
        : {
            $or: [
              { phone: cleanId },
              { phone: cleanId.replace(/\s+/g, '') },
              { phone: `+258 ${cleanId.replace(/^\+258\s*/, '')}` },
              { phone: cleanId.startsWith('+258') ? cleanId : `+258 ${cleanId}` }
            ]
          }
    ).populate('hospitalId');

    if (!user) {
      throw new Error('Credenciais inválidas. Verifique o identificador e a palavra-passe.');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Esta conta encontra-se desativada ou suspensa. Contacte a administração.');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new Error('Credenciais inválidas. Verifique o identificador e a palavra-passe.');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = this.generateToken(user);

    // Registar em auditoria
    await AuditLog.create({
      userId: user._id,
      userName: user.fullName,
      action: 'LOGIN_SUCCESS',
      entity: 'USER',
      entityId: user._id.toString(),
      details: { roles: user.roles }
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        hospitalId: user.hospitalId ? (user.hospitalId as unknown as { _id: string })._id.toString() : '',
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        status: user.status,
        departmentId: user.departmentId ? user.departmentId.toString() : undefined
      }
    };
  }

  async registerPatient(data: { fullName: string; phone: string; email?: string; password: string }) {
    // Obter hospital padrão de Moçambique (HCM)
    let hospital = await Hospital.findOne({ code: 'HCM-01' });
    if (!hospital) {
      hospital = await Hospital.create({
        name: 'Hospital Central de Maputo',
        code: 'HCM-01',
        address: 'Av. Eduardo Mondlane, Maputo, Moçambique',
        phone: '+258 21 325 000',
        timezone: 'Africa/Maputo',
        currency: 'MZN'
      });
    }

    const cleanPhone = data.phone.trim().replace(/\s+/g, '');
    const formattedPhone = cleanPhone.startsWith('+258') ? cleanPhone : `+258 ${cleanPhone.replace(/^258/, '')}`;

    const existingUser = await User.findOne({
      $or: [
        { phone: formattedPhone },
        ...(data.email ? [{ email: data.email.trim().toLowerCase() }] : [])
      ]
    });

    if (existingUser) {
      throw new Error('Já existe uma conta registada com este número de telefone ou email.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      hospitalId: hospital._id,
      fullName: data.fullName.trim(),
      phone: formattedPhone,
      email: data.email ? data.email.trim().toLowerCase() : undefined,
      passwordHash,
      roles: ['PATIENT'],
      status: 'ACTIVE',
      isPhoneVerified: false
    });

    const token = this.generateToken(user);

    await AuditLog.create({
      userId: user._id,
      userName: user.fullName,
      action: 'PATIENT_REGISTER',
      entity: 'USER',
      entityId: user._id.toString(),
      details: { phone: formattedPhone }
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        hospitalId: hospital._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        status: user.status
      }
    };
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      {
        id: user._id.toString(),
        hospitalId: user.hospitalId.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        departmentId: user.departmentId ? user.departmentId.toString() : undefined
      },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

export const authService = new AuthService();
