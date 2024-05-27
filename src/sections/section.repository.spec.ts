import { PrismaService } from '../prisma/prisma.service';
import { PrismaSectionRepository, SectionRepository } from './section.repository';
import { SectionBuilder } from './sections.entity';

export const mockSectionRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  existById: jest.fn(),
  existByName: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  delete: jest.fn(),
} satisfies jest.Mocked<SectionRepository>;

const prismaService = new PrismaService();
const repository = new PrismaSectionRepository(prismaService);

const createSpy = jest
  .spyOn(prismaService.section, 'create')
  .mockResolvedValue({} as any);
const updateSpy = jest
  .spyOn(prismaService.section, 'update')
  .mockResolvedValue({} as any);
jest.spyOn(prismaService.track, 'findUniqueOrThrow').mockResolvedValue({
  id: '123',
  trackName: 'TVL',
  creationDate: new Date(),
});
jest.spyOn(prismaService.strand, 'findUniqueOrThrow').mockResolvedValue({
  id: '123',
  strandName: 'Programming',
  trackId: '123',
  creationDate: new Date(),
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PrismaSectionRepository', () => {
  describe('save', () => {
    test('should call the update method if the entry already exists in the database', async () => {
      jest.spyOn(repository, 'existById').mockResolvedValue(true);
      const section = new SectionBuilder().build();
      await repository.save(section);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    test('should call the create method if the entry does not exist in the databse', async () => {
      jest.spyOn(repository, 'existById').mockResolvedValue(false);
      const section = new SectionBuilder().build();
      await repository.save(section);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
  });
});
