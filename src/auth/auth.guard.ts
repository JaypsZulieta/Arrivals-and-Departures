import 'dotenv/config';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import JsonWebtoken from 'jsonwebtoken';
import { UserDetails, UsersService } from 'src/users/users.service';

export const AdminOnly = Reflector.createDecorator();
export const OwnerOnly = Reflector.createDecorator();

export abstract class PermissionsFilter {
  protected nextFilter?: PermissionsFilter;

  public setNextFilter(filter: PermissionsFilter): PermissionsFilter {
    this.nextFilter = filter;
    return this.nextFilter;
  }

  abstract filter(
    context: ExecutionContext,
    reflector: Reflector,
    request: Request,
    user: UserDetails,
  ): Promise<boolean>;
}

export class AdminPermissionsFilter extends PermissionsFilter {
  public async filter(
    context: ExecutionContext,
    reflector: Reflector,
    request: Request,
    user: UserDetails,
  ): Promise<boolean> {
    const adminOnly = reflector.get(AdminOnly, context.getHandler());
    if (adminOnly != undefined && !user.isAdmin()) return false;
    if (this.nextFilter) return this.nextFilter.filter(context, reflector, request, user);
    return true;
  }
}

export class OwnerPermissionsFilter extends PermissionsFilter {
  public async filter(
    context: ExecutionContext,
    reflector: Reflector,
    request: Request,
    user: UserDetails,
  ): Promise<boolean> {
    const ownerOnly = reflector.get(OwnerOnly, context.getHandler());
    const ownerId = request.params?.guardId as string;
    if (ownerOnly != undefined && user.getId() != ownerId) return false;
    if (this.nextFilter) return this.nextFilter.filter(context, reflector, request, user);
    return true;
  }
}
@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecretKey: string = process.env.JWT_SECRET_KEY || 'jwtSecretKey';
  private userService: UsersService;
  private reflector: Reflector;
  private permissionsFilter: PermissionsFilter;

  constructor(
    userService: UsersService,
    permissionsFilter: PermissionsFilter,
    reflector: Reflector,
  ) {
    this.userService = userService;
    this.reflector = reflector;
    this.permissionsFilter = permissionsFilter;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split('Bearer ')[1] as string;
    const payload = JsonWebtoken.verify(token, this.jwtSecretKey);
    const username = payload['username'] as string;
    try {
      const user = await this.userService.loadByUsername(username);
      return this.permissionsFilter.filter(context, this.reflector, request, user);
    } catch (error) {
      return false;
    }
  }
}
