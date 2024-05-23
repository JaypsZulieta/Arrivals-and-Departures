import { GuardsService, StandardGuardService } from './guards.service';
import { Guard, GuardBuilder } from './guards.entity';
import { Sex } from '../people/person.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Quidquid } from 'quidquid-picker';
import { PrismaClient } from '@prisma/client';
import { PrismaGuardRepository } from './guards.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('GuardsService', () => {
  let service: GuardsService;
  const prismaClient = new PrismaClient();

  beforeEach(async () => {
    await prismaClient.person.deleteMany().then(() => {
      service = new StandardGuardService(new PrismaGuardRepository(new PrismaService()));
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hasAdmin', () => {
    it('should return true if there already is an admin in the system', async () => {
      const guard1 = new GuardBuilder().build();
      guard1.setAdminStatus(true);
      await service.register(guard1);
      expect(await service.hasAdmin()).toBe(true);
    });

    it('should return false if there is no admin in the system', () => {
      expect(service.hasAdmin()).resolves.toBe(false);
    });
  });

  describe('register', () => {
    it('should resolve to an instance of Guard given a guard instance as well as being equal to that instance', async () => {
      const guard = new GuardBuilder()
        .email('jaypee.zulieta@lsu.edu.ph')
        .password('Xscvsdg5417!')
        .firstname('Jaypee')
        .middlename('Pagalan')
        .lastname('Zulieta')
        .sex(Sex.MALE)
        .build();

      const guardAdded = await service.register(guard);
      expect(guardAdded).toBeInstanceOf(Guard);
    });

    it('should throw a ConflictException if the email is alreay taken', () => {
      service
        .register(new GuardBuilder().email('jaypee.zulieta@lsu.edu.ph').build())
        .then(() => {
          const guard2 = new GuardBuilder().email('jaypee.zulieta@lsu.edu.ph').build();
          const guardAdded = service.register(guard2);
          expect(guardAdded).rejects.toThrow(ConflictException);
        });
    });
  });

  describe('findById', () => {
    it('should return a the guard with the corresponding id', () => {
      const guard = new GuardBuilder().build();
      service.register(guard).then(() => {
        const guardFound = service.findById(guard.getId());
        expect(guardFound).resolves.toBeInstanceOf(Guard);
        expect(guardFound).resolves.toEqual(guard);
      });
    });

    it('should throw a NotFoundException if the guard wasnt found', () => {
      const guardFound = service.findById('123');
      expect(guardFound).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return the guard with the corresponding email', async () => {
      const guard = new GuardBuilder().build();
      service.register(guard).then(() => {
        const guardFound = service.findByEmail(guard.getEmail());
        expect(guardFound).resolves.toEqual(guard);
      });
    });

    it('should throw a NotFoundException if a guard with that email does not exist', () => {
      const guardFound = service.findByEmail('jadjada');
      expect(guardFound).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return the guard instance with the properties updated', async () => {
      const data = {
        firstname: 'Jaypee',
        middlename: 'Pagalan',
        lastname: 'Zulieta',
        sex: 'male',
        email: 'jaypee.zulieta@lsu.edu.ph',
        password: 'Xscvsdg5417!',
        isAdmin: true,
        isDisabled: true,
      };
      const updateData = Quidquid.from(data);
      const guard = new GuardBuilder().build();
      const guardAdded = await service.register(guard);
      await service.update(updateData, guardAdded.getId());

      const guardFound = await service.findById(guardAdded.getId());

      expect(data.firstname).toBe(guardFound.getFirstname());
      expect(data.middlename).toBe(guardFound.getMiddlename());
      expect(data.lastname).toBe(guardFound.getLastname());
      expect(data.sex).toBe(guardFound.getSex().toString());
      expect(data.email).toBe(guardFound.getEmail());
      expect(data.password).toBe(guardFound.getPassword());
      expect(data.isAdmin).toBe(guardFound.isAdmin());
      expect(data.isDisabled).toBe(guardFound.isDisabled());
    });

    it('should throw a ConflictError if it tries to update the email that is already taken', async () => {
      const data = {
        email: 'john.smith@email.com',
      };
      const guard1 = new GuardBuilder().build();
      const guard2 = new GuardBuilder().email('person@email.com').build();
      await service.register(guard1);
      await service.register(guard2);
      const updatedGuard = service.update(Quidquid.from(data), guard2.getId());
      expect(updatedGuard).rejects.toThrow(ConflictException);
    });

    it('should not throw an error if the email value is the same as the value that was already there', async () => {
      const guard = new GuardBuilder().build();
      const data = {
        email: 'john.smith@email.com',
      };
      const guardAdded = await service.register(guard);
      const updatedGuard = await service.update(Quidquid.from(data), guardAdded.getId());
      expect(updatedGuard).toBe(Guard);
    });

    it('should throw a NotFoundException if the id being referenced does not exist', async () => {
      expect(async () => await service.update(Quidquid.from({}), '123')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the corresponding guard', () => {
      const guard = new GuardBuilder().build();
      service.register(guard).then((guard) => {
        service.delete(guard).then(() => {
          expect(async () => {
            await service.findById(guard.getId());
          }).toThrow(NotFoundException);
        });
      });
    });

    it('should throw a NotFoundException if the guard to be deleted does not exist', async () => {
      const guard = new GuardBuilder().build();
      expect(async () => {
        await service.delete(guard);
      }).toThrow(NotFoundException);
    });
  });
});
