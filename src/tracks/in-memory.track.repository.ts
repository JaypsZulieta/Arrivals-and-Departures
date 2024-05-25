import { NotFoundException } from '@nestjs/common';
import { PaginationOptions, PaginatedContent } from '../pagination';
import { Track } from './track.entity';
import { TrackRepository } from './track.repository';

export class InMemoryTrackRepository implements TrackRepository {
  private tracks: Track[] = [];

  public async count(): Promise<number> {
    return this.tracks.length;
  }

  public async save(track: Track): Promise<Track> {
    if (await this.existById(track.getId())) {
      const trackFound = await this.findById(track.getId());
      trackFound.setName(track.getName());
      return trackFound;
    }
    this.tracks.push(track);
    return track;
  }

  public async existById(id: string): Promise<boolean> {
    const track = this.tracks.find((track) => track.getId() == id);
    return !track ? false : true;
  }

  public async existByName(name: string): Promise<boolean> {
    const track = this.tracks.find((track) => track.getName() == name);
    return !track ? false : true;
  }

  public async findById(id: string): Promise<Track> {
    const track = this.tracks.find((track) => track.getId() == id);
    if (!track) throw new NotFoundException(`track with id ${id} does not exist`);
    return track;
  }

  public async findByName(name: string): Promise<Track> {
    const track = this.tracks.find((track) => track.getName() == name);
    if (!track) throw new NotFoundException(`track with name ${name} does not exist`);
    return track;
  }

  public async findAll(
    options?: PaginationOptions | undefined,
  ): Promise<PaginatedContent<Track>> {
    const take = options?.pageSize || 20;
    const currentPage = options?.pageNumber || 1;
    const skip = (currentPage - 1) * take;
    const totalItems = await this.count();
    const totalPages = Math.ceil(totalItems / take);
    const content: Track[] = [];
    for (let index = skip; index < take + 1; index++) {
      content.push(this.tracks[index]);
    }
    return { totalItems, totalPages, content, currentPage };
  }

  public async delete(track: Track): Promise<void> {
    this.tracks = this.tracks.filter(
      (trackToKeep) => trackToKeep.getId() != track.getId(),
    );
  }
}
