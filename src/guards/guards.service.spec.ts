import { Test, TestingModule } from '@nestjs/testing';
import { GuardsService, StandardGuardService } from './guards.service';
import { Guard, GuardBuilder } from './guards.entity';
import { Sex } from '../people/person.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Quidquid } from 'quidquid-picker';

describe('GuardsService', () => {
  let service: GuardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StandardGuardService],
    }).compile();

    service = module.get<GuardsService>(StandardGuardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hasAdmin', () => {
    it('should return true if there already is an admin in the system', async () => {
      const guard1 = new GuardBuilder().build();
      guard1.setAdminStatus(true);
      await service.register(guard1);
      expect(service.hasAdmin()).resolves.toBe(true);
    });

    it('should return false if there is no admin in the system', () => {
      expect(service.hasAdmin()).resolves.toBe(false);
    });
  });

  describe('register', () => {
    it('should resolve to an instance of Guard given a guard instance as well as being equal to that instance', () => {
      const guard = new GuardBuilder()
        .email('jaypee.zulieta@lsu.edu.ph')
        .password('Xscvsdg5417!')
        .firstname('Jaypee')
        .middlename('Pagalan')
        .lastname('Zulieta')
        .sex(Sex.MALE)
        .build();

      const guardAdded = service.register(guard);
      expect(guardAdded).resolves.toBeInstanceOf(Guard);
      expect(guardAdded).resolves.toEqual(guard);
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
      const updatedGuard = service.update(Quidquid.from(data), guardAdded.getId());
      expect(updatedGuard).resolves.not.toThrow();
      expect(updatedGuard).resolves.not.toThrow(ConflictException);
    });

    it('should throw a NotFoundException if the id being referenced does not exist', () => {
      const updatedGuard = service.update(Quidquid.from({}), '123');
      expect(updatedGuard).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the corresponding guard', () => {
      const guard = new GuardBuilder().build();
      service.register(guard).then((guard) => {
        service.delete(guard).then(() => {
          const guardFound = service.findById(guard.getId());
          expect(guardFound).rejects.toThrow(NotFoundException);
        });
      });
    });

    it('should throw a NotFoundException if the guard to be deleted does not exist', () => {
      const guard = new GuardBuilder().build();
      expect(service.delete(guard)).rejects.toThrow(NotFoundException);
    });
  });
});
