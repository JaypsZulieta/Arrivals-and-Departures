import { ConflictException } from '@nestjs/common';
import { StrandBuilder } from './strands.entity';
import { StrandRepository } from './strands.repository';
import { StandardStrandsService } from './strands.service';

const strandRepository: jest.Mocked<StrandRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  existById: jest.fn(),
  existByName: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  delete: jest.fn(),
};

const strandService = new StandardStrandsService(strandRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('StandardStrandService', () => {
  describe('update', () => {
    test('should throw a ConflictException if the strand name exists and does not belong to the strand being updated', async () => {
      const strandToBeUpdated = new StrandBuilder().name('Programming').build();
      const mockReturnStrand = new StrandBuilder().name('Programming').build();
      strandRepository.findByName.mockResolvedValue(mockReturnStrand);
      const action = async () => {
        await strandService.update(strandToBeUpdated);
      };
      expect(action).rejects.toThrow(ConflictException);
    });

    test('should call the StrandRepository.save method if the name exists but belongs to the strand being updated', async () => {
      const strand = new StrandBuilder().build();
      strandRepository.findByName.mockResolvedValue(strand);
      await strandService.update(strand);
      expect(strandRepository.save).toHaveBeenCalledTimes(1);
    });

    test('should call the StrandRepository.save method if the name does not exist', async () => {
      const strand = new StrandBuilder().build();
      strandRepository.findByName.mockRejectedValue(() => {
        throw new Error();
      });

      await strandService.update(strand);
      expect(strandRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
