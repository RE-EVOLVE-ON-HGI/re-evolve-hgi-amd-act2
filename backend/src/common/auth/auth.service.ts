import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<JwtPayload> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: { include: { permissions: true } } } } },
    });
    if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const roles = user.roles.map((r) => r.role.key);
    const perms = user.roles.flatMap((r) => r.role.permissions.map((p) => p.key));
    return { sub: user.id, orgId: user.orgId, roles, perms: [...new Set(perms)] };
  }

  async issueTokens(payload: JwtPayload) {
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<number>('jwt.accessTtl'),
    });
    const refreshToken = await this.jwt.signAsync(
      { sub: payload.sub, orgId: payload.orgId },
      { expiresIn: this.config.get<number>('jwt.refreshTtl') },
    );
    return { accessToken, refreshToken };
  }
}
