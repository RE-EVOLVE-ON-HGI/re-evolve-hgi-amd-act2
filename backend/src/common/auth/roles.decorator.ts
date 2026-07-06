import { SetMetadata } from '@nestjs/common';
export const PERMS_KEY = 'required_perms';
/** Require resource:action permissions, e.g. @RequirePerms('agents:execute') */
export const RequirePerms = (...perms: string[]) => SetMetadata(PERMS_KEY, perms);
