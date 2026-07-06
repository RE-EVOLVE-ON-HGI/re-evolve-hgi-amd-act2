import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PermissionsGuard } from './permissions.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ secret: c.get('jwt.secret') }),
    }),
  ],
  providers: [JwtStrategy, PermissionsGuard, AuthService],
  exports: [JwtStrategy, PermissionsGuard, AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
