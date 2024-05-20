import 'dotenv/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Authentication, RefreshAuthentication } from './auth.entity';
import JsonWebtoken from 'jsonwebtoken';
import { UserDetails, UsersService } from 'src/users/users.service';
import { ArgonPasswordEncoder } from 'jaypee-password-encoder';

@Injectable()
export class AuthService {
  private jwtSecretKey: string = process.env.JWT_SECRET_KEY || 'jwtSecret';
  private refreshTokenSecretKey: string =
    process.env.REFRESH_TOKEN_SECRET_KEY || 'refreshTokenSecretKey';
  private usersService: UsersService;
  private passwordEncoder: ArgonPasswordEncoder;

  constructor(usersService: UsersService, passwordEncoder: ArgonPasswordEncoder) {
    this.usersService = usersService;
    this.passwordEncoder = passwordEncoder;
  }

  async signIn(email: string, password: string): Promise<Authentication> {
    const user = await this.usersService.loadByUsername(email);
    if (!(await this.validatePassword(password, user.getPassword())))
      throw new UnauthorizedException('incorrect email or password');
    const payload = { sub: user.getId(), username: user.getEmail() };
    return this.generateAuthentication(user, payload);
  }

  // async refresh(token: string): Promise<RefreshAuthentication> {
  //   const payload = JsonWebtoken.verify(token, this.refreshTokenSecretKey);
  //   const username = payload?.username as string;
  // }

  private async validatePassword(
    plainTextPassword: string,
    encodedPassword: string,
  ): Promise<boolean> {
    return await this.passwordEncoder.validate(plainTextPassword, encodedPassword);
  }

  private generateAuthentication(userDetails: UserDetails, payload: any): Authentication {
    const accessToken = JsonWebtoken.sign(payload, this.jwtSecretKey, {
      expiresIn: '10mins',
    });
    const refreshToken = JsonWebtoken.sign(payload, this.refreshTokenSecretKey, {
      expiresIn: '8hrs',
    });
    return new Authentication(userDetails, accessToken, refreshToken);
  }
}
