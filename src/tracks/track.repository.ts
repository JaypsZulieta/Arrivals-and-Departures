import { PaginatedContent, PaginationOptions } from 'src/pagination';
import { Track } from './track.entity';

export abstract class TrackRepository {
  public abstract save(track: Track): Promise<Track>;
  public abstract existById(id: string): Promise<boolean>;
  public abstract existByName(name: string): Promise<boolean>;
  public abstract findById(id: string): Promise<Track>;
  public abstract findByName(name: string): Promise<Track>;
  public abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Track>>;
  public abstract delete(track: Track): Promise<void>;
}
