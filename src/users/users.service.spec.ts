import { GuardUsersService, UsersService } from './users.service';
import { GuardsService, StandardGuardService } from '../guards/guards.service';
import { GuardBuilder } from '../guards/guards.entity';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaGuardRepository } from '../guards/guards.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let guardsService: GuardsService;

  beforeEach(async () => {
    guardsService = new StandardGuardService(
      new PrismaGuardRepository(new PrismaService()),
    );
    service = new GuardUsersService(guardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loadByUsername', () => {
    it('should return a UserDetails after registering a guard', async () => {
      const guard = new GuardBuilder().build();
      const registeredGuard = await guardsService.register(guard);
      const user = await service.loadByUsername(registeredGuard.getEmail());
      expect(user).toEqual(registeredGuard);
    });

    it('shoud throw a ForbiddenException if the user is not found', () => {
      const user = service.loadByUsername('hello');
      expect(user).rejects.toThrow(UnauthorizedException);
    });
  });
});
