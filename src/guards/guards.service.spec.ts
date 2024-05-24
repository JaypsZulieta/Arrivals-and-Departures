import { ArgonPasswordEncoder } from 'jaypee-password-encoder';
import { GuardsRepository } from './guards.repository';
import { StandardGuardService } from './guards.service';
import { GuardBuilder } from './guards.entity';
import { ConflictException } from '@nestjs/common';

const guardsRepository: jest.Mocked<GuardsRepository> = {
  countAdmins: jest.fn(),
  hasAdmin: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  existByEmail: jest.fn(),
  existById: jest.fn(),
  delete: jest.fn(),
};
const passwordEncoder = new ArgonPasswordEncoder();
const guardsService = new StandardGuardService(guardsRepository, passwordEncoder);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('StandardGuardsService', () => {
  describe('register', () => {
    test('should throw a ConflictException if the guard with id already exists', () => {
      guardsRepository.existById.mockResolvedValue(true);
      const guard = new GuardBuilder().build();
      expect(async () => {
        await guardsService.register(guard);
      }).rejects.toThrow(ConflictException);
    });

    test('should throw a Conflict exception if the guard with email already exists', () => {
      guardsRepository.existByEmail.mockRejectedValue(true);
      const guard = new GuardBuilder().build();
      expect(async () => {
        await guardsService.register(guard);
      }).rejects.toThrow(ConflictException);
    });

    test("should call the GuardRepository.save method if the id and email aren't taken", async () => {
      guardsRepository.existByEmail.mockResolvedValue(false);
      guardsRepository.existById.mockResolvedValue(false);
      const guard = new GuardBuilder().build();
      await guardsService.register(guard);
      expect(guardsRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
