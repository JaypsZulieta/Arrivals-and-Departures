import { Test, TestingModule } from '@nestjs/testing';
import { GuardsService, StandardGuardService } from './guards.service';
import { Guard, GuardBuilder } from './guards.entity';
import { Sex } from '../people/person.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

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
          const guard2 = new GuardBuilder()
            .email('jaypee.zulieta@lsu.edu.ph')
            .build();

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
});
