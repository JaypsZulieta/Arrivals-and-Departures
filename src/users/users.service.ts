import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GuardsService } from '../guards/guards.service';
import { Guard } from '../guards/guards.entity';

export abstract class UserDetails {
  abstract getUsername(): string;
  abstract getPassword(): string;
  abstract isDisabled(): boolean;
  abstract isAdmin(): boolean;
}

export abstract class UsersService {
  abstract loadByUsername(username: string): Promise<Guard>;
}

@Injectable()
export class GuardUsersService extends UsersService {
  constructor(private guardService: GuardsService) {
    super();
  }

  public async loadByUsername(username: string): Promise<Guard> {
    try {
      return await this.guardService.findByEmail(username);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new ForbiddenException('incorrect username or password');
      throw error;
    }
  }
}
