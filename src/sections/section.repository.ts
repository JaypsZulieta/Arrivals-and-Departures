import { PaginatedContent, PaginationOptions } from '../pagination';
import { Section } from './sections.entity';

export abstract class SectionRepository {
  public abstract save(section: Section): Promise<Section>;
  public abstract findById(id: string): Promise<Section>;
  public abstract findByName(id: string): Promise<Section>;
  public abstract findAll(
    options?: PaginationOptions,
  ): Promise<PaginatedContent<Section>>;
  public abstract existById(id: string): Promise<boolean>;
  public abstract existByName(name: string): Promise<boolean>;
  public abstract count(): Promise<number>;
  public abstract delete(section: Section): Promise<Section>;
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
