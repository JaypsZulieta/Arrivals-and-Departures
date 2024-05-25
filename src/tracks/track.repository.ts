import { PaginatedContent, PaginationOptions } from 'src/pagination';
import { Track, TrackBuilder } from './track.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Track as PrismaTrackData } from '@prisma/client';

export abstract class TrackRepository {
  public abstract count(): Promise<number>;
  public abstract save(track: Track): Promise<Track>;
  public abstract existById(id: string): Promise<boolean>;
  public abstract existByName(name: string): Promise<boolean>;
  public abstract findById(id: string): Promise<Track>;
  public abstract findByName(name: string): Promise<Track>;
  public abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Track>>;
  public abstract delete(track: Track): Promise<void>;
}

@Injectable()
export class PrismaTrackRepository implements TrackRepository {
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  public async count(): Promise<number> {
    return await this.prismaService.track.count();
  }

  public async save(track: Track): Promise<Track> {
    if (await this.existById(track.getId())) {
      return await this.updateTrack(track);
    }
    return await this.createTrack(track);
  }

  public async existById(id: string): Promise<boolean> {
    return (await this.prismaService.track.count({ where: { id } })) > 0;
  }

  public async existByName(name: string): Promise<boolean> {
    return (await this.prismaService.track.count({ where: { trackName: name } })) > 0;
  }

  public async findById(id: string): Promise<Track> {
    return await this.prismaService.track
      .findUniqueOrThrow({ where: { id } })
      .then((trackData) => this.buildTrack(trackData));
  }

  public async findByName(name: string): Promise<Track> {
    return await this.prismaService.track
      .findUniqueOrThrow({ where: { trackName: name } })
      .then((trackData) => this.buildTrack(trackData));
  }
  public async findAll(
    options?: PaginationOptions | undefined,
  ): Promise<PaginatedContent<Track>> {
    const currentPage = options?.pageNumber || 1;
    const take = options?.pageSize || 20;
    const skip = (currentPage - 1) * take;
    const totalItems = await this.count();
    const totalPages = Math.ceil(totalItems / take);
    const content = await this.fetchTrackData(take, skip);
    return { totalItems, totalPages, content, currentPage };
  }

  public async delete(track: Track): Promise<void> {
    await this.prismaService.track.delete({ where: { id: track.getId() } });
  }

  private buildTrack(data: PrismaTrackData): Track {
    return new TrackBuilder()
      .id(data.id)
      .name(data.trackName)
      .creationDate(data.creationDate)
      .build();
  }

  private async createTrack(track: Track): Promise<Track> {
    return await this.prismaService.track
      .create({
        data: {
          id: track.getId(),
          trackName: track.getName(),
          creationDate: track.getCreationDate(),
        },
      })
      .then((data) => this.buildTrack(data));
  }

  private async updateTrack(track: Track): Promise<Track> {
    return await this.prismaService.track
      .update({
        data: { trackName: track.getName() },
        where: { id: track.getId() },
      })
      .then((data) => this.buildTrack(data));
  }

  private async fetchTrackData(take: number, skip: number): Promise<Track[]> {
    return await this.prismaService.track
      .findMany({
        take,
        skip,
        orderBy: { creationDate: 'desc' },
      })
      .then((data) => data.map((data) => this.buildTrack(data)));
  }
}
