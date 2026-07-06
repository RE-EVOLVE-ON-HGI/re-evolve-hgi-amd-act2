import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMS_KEY } from './roles.decorator';
import { JwtPayload } from './jwt.strategy';

/** Enforces RBAC (permission set) + ABAC (tenant isolation) on every request. */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMS_KEY, [
      ctx.getHandler(), ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as JwtPayload | undefined;
    if (!user) throw new ForbiddenException('No identity on request');

    const granted = new Set(user.perms ?? []);
    const ok = required.every((p) => granted.has(p) || granted.has('*'));
    if (!ok) throw new ForbiddenException(`Missing permission: ${required.join(', ')}`);

    // ABAC tenant isolation — body/params orgId must match the token's tenant
    const targetOrg = req.body?.orgId ?? req.params?.orgId ?? req.query?.orgId;
    if (targetOrg && targetOrg !== user.orgId) {
      throw new ForbiddenException('Cross-tenant access denied');
    }
    return true;
  }
}
