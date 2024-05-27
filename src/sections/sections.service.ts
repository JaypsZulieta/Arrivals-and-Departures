import { PaginatedContent, PaginationOptions } from 'src/pagination';
import { Section } from './sections.entity';
import { SectionRepository } from './section.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

export abstract class SectionService {
  public abstract create(section: Section): Promise<Section>;
  public abstract findById(id: string): Promise<Section>;
  public abstract findByName(name: string): Promise<Section>;
  public abstract findAll(
    options?: PaginationOptions,
  ): Promise<PaginatedContent<Section>>;
  public abstract existById(id: string): Promise<boolean>;
  public abstract existByName(name: string): Promise<boolean>;
  public abstract count(): Promise<number>;
  public abstract update(section: Section): Promise<Section>;
  public abstract delete(id: string): Promise<void>;
}

@Injectable()
export class StandardSectionService implements SectionService {
  private repository: SectionRepository;

  constructor(repository: SectionRepository) {
    this.repository = repository;
  }

  public async create(section: Section): Promise<Section> {
    const sectionId = section.getId();
    const sectionName = section.getName();
    if (await this.existById(sectionId))
      throw new ConflictException(`section with id '${sectionId}' already exists`);
    if (await this.existByName(sectionName))
      throw new ConflictException(`section with name '${sectionName}' already exists`);
    return await this.repository.save(section);
  }

  public async findById(id: string): Promise<Section> {
    if (!(await this.existById(id)))
      throw new NotFoundException(`Section with id '${id}' does not exist`);
    return await this.repository.findById(id);
  }

  public async findByName(name: string): Promise<Section> {
    if (!(await this.existByName(name)))
      throw new NotFoundException(`Section with name '${name}' does not exist`);
    return await this.repository.findByName(name);
  }

  public async findAll(options?: PaginationOptions): Promise<PaginatedContent<Section>> {
    return await this.repository.findAll(options);
  }

  public async existById(id: string): Promise<boolean> {
    return await this.repository.existById(id);
  }

  public async existByName(name: string): Promise<boolean> {
    return await this.repository.existByName(name);
  }

  public async count(): Promise<number> {
    return await this.repository.count();
  }

  public async update(section: Section): Promise<Section> {
    const sectionName = section.getName();
    if (!(await this.existById(section.getId())))
      throw new NotFoundException(`section with name ${sectionName} does not exists`);
    if (await this.nameIsNotAvailable(section))
      throw new ConflictException(`section with name ${sectionName} already exists`);
    return await this.repository.save(section);
  }

  private async nameIsNotAvailable(section: Section): Promise<boolean> {
    return !(await this.repository
      .findByName(section.getName())
      .then((existingSection) => existingSection.getId() == section.getId())
      .catch(() => true));
  }

  public async delete(id: string): Promise<void> {
    await this.findById(id).then(
      async (section) => await this.repository.delete(section),
    );
  }
}
