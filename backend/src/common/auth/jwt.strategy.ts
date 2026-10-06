import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;          // user id
  orgId: string;        // tenant
  roles: string[];
  perms: string[];      // resource:action
}

const cookieToken = (request: { headers?: { cookie?: string } } | undefined): string | null => {
  const cookies = request?.headers?.cookie;
  if (!cookies) return null;
  const match = cookies.split(';').map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith('hgi_session='));
  return match ? decodeURIComponent(match.slice('hgi_session='.length)) : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('jwt.secret'),
    });
  }
  async validate(payload: JwtPayload) {
    return payload; // attached to req.user
  }
}
