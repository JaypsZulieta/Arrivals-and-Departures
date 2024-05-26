import { PrismaService } from '../prisma/prisma.service';
import { StrandBuilder } from './strands.entity';
import { PrismaStrandRepository } from './strands.repository';

const service = new PrismaService();
const strandRepository = new PrismaStrandRepository(service);

const findTrackSpy = jest.spyOn(service.track, 'findUniqueOrThrow');
const createSpy = jest.spyOn(service.strand, 'create').mockResolvedValue({} as any);
const updateSpy = jest.spyOn(service.strand, 'update').mockResolvedValue({} as any);
const existByIdSpy = jest.spyOn(strandRepository, 'existById');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PrismaStrandRepository', () => {
  describe('save', () => {
    test('should update the record if it already exists in the database', async () => {
      existByIdSpy.mockResolvedValue(true);
      findTrackSpy.mockResolvedValue({
        id: '123',
        trackName: 'TVL',
        creationDate: new Date(),
      });
      const strand = new StrandBuilder().build();
      await strandRepository.save(strand);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create the record if it does not exist', async () => {
      existByIdSpy.mockResolvedValue(false);
      findTrackSpy.mockResolvedValue({
        id: '123',
        trackName: 'TVL',
        creationDate: new Date(),
      });
      const strand = new StrandBuilder().build();
      await strandRepository.save(strand);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
  });
});
