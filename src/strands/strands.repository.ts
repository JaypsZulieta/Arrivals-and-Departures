import { PaginatedContent, PaginationOptions } from 'src/pagination';
import { Strand } from './strands.entity';

export abstract class StrandRepository {
  public abstract save(strand: Strand): Promise<Strand>;
  public abstract findById(id: string): Promise<Strand>;
  public abstract findByName(name: string): Promise<Strand>;
  public abstract existById(id: string): Promise<boolean>;
  public abstract existByName(name: string): Promise<boolean>;
  public abstract count(): Promise<number>;
  public abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Strand>>;
  public abstract delete(strand: Strand): Promise<void>;
}
