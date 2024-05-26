import { PaginatedContent, PaginationOptions } from 'src/pagination';
import { Strand, StrandBuilder } from './strands.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Strand as PrismaStrandData, Track as PrismaTrackData } from '@prisma/client';

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

@Injectable()
export class PrismaStrandRepository implements StrandRepository {
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  public async save(strand: Strand): Promise<Strand> {
    if (await this.existById(strand.getId())) {
      return await this.updateInDatabase(strand);
    }
    return await this.insertToDatabase(strand);
  }

  public async findById(id: string): Promise<Strand> {
    const strandData = await this.prismaService.strand.findUniqueOrThrow({
      where: { id },
    });
    const trackData = await this.findTrackData(strandData);
    return this.buildStrand(strandData, trackData);
  }

  public async findByName(name: string): Promise<Strand> {
    const strandData = await this.prismaService.strand.findUniqueOrThrow({
      where: { strandName: name },
    });
    const trackData = await this.findTrackData(strandData);
    return this.buildStrand(strandData, trackData);
  }

  public async existById(id: string): Promise<boolean> {
    return (await this.prismaService.strand.count({ where: { id } })) > 0;
  }
  public async existByName(name: string): Promise<boolean> {
    return (await this.prismaService.strand.count({ where: { strandName: name } })) > 0;
  }
  public async count(): Promise<number> {
    return await this.prismaService.strand.count();
  }
  public async findAll(
    options?: PaginationOptions | undefined,
  ): Promise<PaginatedContent<Strand>> {
    const take = options?.pageSize || 20;
    const currentPage = options?.pageNumber || 1;
    const skip = (currentPage - 1) * take;
    const totalItems = await this.count();
    const totalPages = Math.ceil(totalItems / take);
    const content = await this.fetchAll(take, skip);
    return { totalItems, totalPages, content, currentPage };
  }

  public async delete(strand: Strand): Promise<void> {
    await this.prismaService.strand.delete({ where: { id: strand.getId() } });
  }

  private async findTrackData(strandData: PrismaStrandData): Promise<PrismaTrackData> {
    return await this.prismaService.track.findUniqueOrThrow({
      where: { id: strandData.trackId },
    });
  }

  private async insertToDatabase(strand: Strand): Promise<Strand> {
    const trackData = await this.prismaService.track.findUniqueOrThrow({
      where: { trackName: strand.getTrackName() },
    });
    const strandData = await this.prismaService.strand.create({
      data: {
        id: strand.getId(),
        strandName: strand.getName(),
        trackId: trackData.id,
        creationDate: strand.getCreationDate(),
      },
    });
    return this.buildStrand(strandData, trackData);
  }

  private async fetchAll(take: number, skip: number): Promise<Strand[]> {
    return await Promise.all(
      await this.prismaService.strand
        .findMany({
          take,
          skip,
          orderBy: { creationDate: 'desc' },
        })
        .then((data) =>
          data.map(async (strandData) => {
            const trackData = await this.findTrackData(strandData);
            return this.buildStrand(strandData, trackData);
          }),
        ),
    );
  }

  private async updateInDatabase(strand: Strand): Promise<Strand> {
    const trackData = await this.prismaService.track.findUniqueOrThrow({
      where: { trackName: strand.getTrackName() },
    });
    const strandData = await this.prismaService.strand.update({
      data: {
        strandName: strand.getName(),
        trackId: trackData.id,
      },
      where: { id: strand.getId() },
    });
    return this.buildStrand(strandData, trackData);
  }

  private buildStrand(strandData: PrismaStrandData, trackData: PrismaTrackData): Strand {
    return new StrandBuilder()
      .id(strandData.id)
      .name(strandData.strandName)
      .track(trackData.trackName)
      .creationDate(strandData.creationDate)
      .build();
  }
}
