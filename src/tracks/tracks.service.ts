import { Quidquid } from 'quidquid-picker';
import { PaginatedContent, PaginationOptions } from '../pagination';
import { Track } from './track.entity';
import { TrackRepository } from './track.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

export abstract class TrackService {
  public abstract create(track: Track): Promise<Track>;
  public abstract findById(id: string): Promise<Track>;
  public abstract findByName(name: string): Promise<Track>;
  public abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Track>>;
  public abstract update(data: Quidquid, id: string): Promise<Track>;
  public abstract deleteById(id: string): Promise<void>;
}

@Injectable()
export class StandardTrackService implements TrackService {
  private trackRepository: TrackRepository;

  constructor(trackRepository: TrackRepository) {
    this.trackRepository = trackRepository;
  }

  public async create(track: Track): Promise<Track> {
    const trackId = track.getId();
    const trackName = track.getName();
    if (await this.trackRepository.existById(trackId))
      throw new ConflictException(`track with id ${trackId} already exists`);
    if (await this.trackRepository.existByName(trackName))
      throw new ConflictException(`track with name ${trackName} already exists`);
    return await this.trackRepository.save(track);
  }

  public async findById(id: string): Promise<Track> {
    if (!(await this.trackRepository.existById(id)))
      throw new NotFoundException(`track with id ${id} was not found`);
    return await this.trackRepository.findById(id);
  }

  public async findByName(name: string): Promise<Track> {
    if (!(await this.trackRepository.existByName(name)))
      throw new NotFoundException(`track with name ${name} does not exist`);
    return await this.trackRepository.findByName(name);
  }

  public async findAll(options?: PaginationOptions): Promise<PaginatedContent<Track>> {
    return await this.trackRepository.findAll(options);
  }

  public async update(data: Quidquid, id: string): Promise<Track> {
    const trackName = await data.pickStringOptional('name');
    const track = await this.findById(id);
    const isNotOwner = track.getName() != trackName;
    const trackNameAlreadyExist =
      trackName && (await this.trackRepository.existByName(trackName));
    if (trackNameAlreadyExist && isNotOwner)
      throw new ConflictException(`track name ${trackName} already taken`);
    track.setName(trackName);
    return await this.trackRepository.save(track);
  }

  public async deleteById(id: string): Promise<void> {
    const track = await this.findById(id);
    await this.trackRepository.delete(track);
  }
}
