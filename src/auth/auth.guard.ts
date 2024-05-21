import 'dotenv/config';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import JsonWebtoken from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AdminOnlyGuard implements CanActivate {
  private jwtSecretKey: string = process.env.JWT_SECRET_KEY || 'jwtSecretKey';
  constructor(private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split('Bearer ')[1] as string;
    const payload = JsonWebtoken.verify(token, this.jwtSecretKey);
    const username = payload['username'] as string;
    const user = await this.userService.loadByUsername(username).catch(() => {
      throw new ForbiddenException('Forbidden');
    });
    return user.isAdmin();
  }
}
