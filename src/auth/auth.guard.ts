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

export const AdminOnly = Reflector.createDecorator();

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecretKey: string = process.env.JWT_SECRET_KEY || 'jwtSecretKey';
  private userService: UsersService;
  private reflector: Reflector;

  constructor(userService: UsersService, reflector: Reflector) {
    this.userService = userService;
    this.reflector = reflector;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const adminOnly = this.reflector.get(AdminOnly, context.getHandler());
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split('Bearer ')[1] as string;
    const payload = JsonWebtoken.verify(token, this.jwtSecretKey);
    const username = payload['username'] as string;
    const user = await this.userService.loadByUsername(username).catch(() => {
      throw new ForbiddenException('Forbidden');
    });
    if (adminOnly == undefined) return true;
    return user.isAdmin();
  }
}
