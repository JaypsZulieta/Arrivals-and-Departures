import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Strand } from './strands.entity';
import { StrandRepository } from './strands.repository';
import { PaginatedContent, PaginationOptions } from '../pagination';

export abstract class StrandsService {
  public abstract create(strand: Strand): Promise<Strand>;
  public abstract existById(id: string): Promise<boolean>;
  public abstract existByName(name: string): Promise<boolean>;
  public abstract findById(id: string): Promise<Strand>;
  public abstract findByName(name: string): Promise<Strand>;
  public abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Strand>>;
  public abstract count(): Promise<number>;
  public abstract update(strand: Strand): Promise<Strand>;
  public abstract delete(id: string): Promise<void>;
}

@Injectable()
export class StandardStrandsService implements StrandsService {
  private strandRepository: StrandRepository;

  constructor(strandRepository: StrandRepository) {
    this.strandRepository = strandRepository;
  }

  public async create(strand: Strand): Promise<Strand> {
    const strandId = strand.getId();
    const strandName = strand.getName();
    if (await this.existById(strandId))
      throw new ConflictException(`Strand withd id '${strand.getId()}' already exists`);
    if (await this.existByName(strand.getName()))
      throw new ConflictException(`Strand withd name '${strandName}' already exists`);
    return this.strandRepository.save(strand);
  }

  public existById(id: string): Promise<boolean> {
    return this.strandRepository.existById(id);
  }

  public existByName(name: string): Promise<boolean> {
    return this.strandRepository.existByName(name);
  }

  public async findById(id: string): Promise<Strand> {
    if (!(await this.existById(id)))
      throw new NotFoundException(`Strand with id '${id}' does not exist`);
    return await this.strandRepository.findById(id);
  }

  public async findByName(name: string): Promise<Strand> {
    if (!(await this.existByName(name)))
      throw new NotFoundException(`Strand with name '${name}' does not exist`);
    return await this.strandRepository.findByName(name);
  }

  public findAll(options?: PaginationOptions): Promise<PaginatedContent<Strand>> {
    return this.strandRepository.findAll(options);
  }

  public count(): Promise<number> {
    return this.strandRepository.count();
  }

  public async update(strand: Strand): Promise<Strand> {
    if (!(await this.nameIsAvailable(strand)))
      throw new ConflictException(`Name '${strand.getName()}' is already taken`);
    return await this.strandRepository.save(strand);
  }

  private async nameIsAvailable(strand: Strand): Promise<boolean> {
    return await this.findByName(strand.getName())
      .then((existingStrand) => (existingStrand.getId() != strand.getId() ? false : true))
      .catch(() => true);
  }

  public async delete(id: string): Promise<void> {
    const strand = await this.findById(id);
    await this.strandRepository.delete(strand);
  }
}
