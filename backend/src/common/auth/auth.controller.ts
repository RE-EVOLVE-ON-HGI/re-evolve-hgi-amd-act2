import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email?: string; password?: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!body.email || !body.password) throw new UnauthorizedException('Invalid credentials');
    const user = await this.auth.validateUser(body.email, body.password);
    const tokens = await this.auth.issueTokens(user);
    response.cookie('hgi_session', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    return { session: { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken } };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  session(@Req() request: Request & { user: JwtPayload }) {
    return { session: { user: request.user } };
  }
}
