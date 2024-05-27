import { PaginatedContent, PaginationOptions } from '../pagination';
import { Section } from './sections.entity';

export abstract class SectionRepository {
  abstract save(section: Section): Promise<Section>;
  abstract findById(id: string): Promise<Section>;
  abstract findByName(id: string): Promise<Section>;
  abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Section>>;
  abstract existById(id: string): Promise<boolean>;
  abstract existByName(name: string): Promise<boolean>;
  abstract count(): Promise<number>;
  abstract delete(section: Section): Promise<Section>;
}

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
