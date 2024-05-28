import { NotFoundException } from '@nestjs/common';
import { SectionRepository } from './section.repository';
import { SectionBuilder } from './sections.entity';
import { SectionService, StandardSectionService } from './sections.service';
import { mockSectionRepository } from './section.repository.spec';

let repository: jest.Mocked<SectionRepository>;
let service: SectionService;

beforeEach(() => {
  repository = mockSectionRepository;
  service = new StandardSectionService(repository);
  jest.clearAllMocks();
});

describe('StandardSectionRepository', () => {
  describe('update', () => {
    test('should throw a NotFoundException if the section does not exist', async () => {
      const section = new SectionBuilder().build();
      repository.existById.mockResolvedValue(false);
      const action = async () => {
        await service.update(section);
      };
      expect(action).rejects.toThrow(NotFoundException);
    });

    test('should throw a ConflictException if the sectionName is already taken', async () => {
      const section = new SectionBuilder().build();
      const mockReturnSection = new SectionBuilder().build();
      repository.findByName.mockResolvedValue(mockReturnSection);
      const action = async () => {
        await service.update(section);
      };
      expect(action).rejects.toThrow(NotFoundException);
    });

    test('should call the SectionRepository.save method if the sectionName already belongs to section being updated', async () => {
      const section = new SectionBuilder().build();
      repository.existById.mockResolvedValue(true);
      repository.findByName.mockResolvedValue(section);
      await service.update(section);
      expect(repository.save).toHaveBeenCalledWith(section);
    });

    test('should call the SectionRepository.save method if the sectionName does not exist yet', async () => {
      const section = new SectionBuilder().build();
      repository.existById.mockResolvedValue(true);
      repository.findByName.mockRejectedValue(() => {
        throw Error();
      });
      await service.update(section);
      expect(repository.save).toHaveBeenCalledWith(section);
    });
  });
});
