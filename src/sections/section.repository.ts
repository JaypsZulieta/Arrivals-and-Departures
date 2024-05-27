import { Injectable } from '@nestjs/common';
import { PaginatedContent, PaginationOptions } from '../pagination';
import { Section, SectionBuilder } from './sections.entity';
import { PrismaService } from '../prisma/prisma.service';
import {
  Track as PrismaTrackData,
  Strand as PrismaStrandData,
  Section as PrismaSectionData,
} from '@prisma/client';

export abstract class SectionRepository {
  abstract save(section: Section): Promise<Section>;
  abstract findById(id: string): Promise<Section>;
  abstract findByName(name: string): Promise<Section>;
  abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Section>>;
  abstract existById(id: string): Promise<boolean>;
  abstract existByName(name: string): Promise<boolean>;
  abstract count(): Promise<number>;
  abstract delete(section: Section): Promise<void>;
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

@Injectable()
export class PrismaSectionRepository implements SectionRepository {
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  public async save(section: Section): Promise<Section> {
    if (await this.existById(section.getId()))
      return await this.updateInDatabase(section);
    return await this.insertIntoDatabase(section);
  }

  public async findById(id: string): Promise<Section> {
    const sectionData = await this.prismaService.section.findUniqueOrThrow({
      where: { id },
    });
    const strandData = await this.getStrandData(sectionData);
    const trackData = await this.getTrackData(strandData);
    return this.buildSection(sectionData, strandData, trackData);
  }

  public async findByName(name: string): Promise<Section> {
    const sectionData = await this.prismaService.section.findUniqueOrThrow({
      where: { sectionName: name },
    });
    const strandData = await this.getStrandData(sectionData);
    const trackData = await this.getTrackData(strandData);
    return this.buildSection(sectionData, strandData, trackData);
  }

  public async findAll(options?: PaginationOptions): Promise<PaginatedContent<Section>> {
    const currentPage = options?.pageNumber || 1;
    const take = options?.pageSize || 20;
    const skip = (currentPage - 1) * take;
    const totalItems = await this.count();
    const totalPages = Math.ceil(totalItems / take);
    const content = await this.fetchAllSections(take, skip);
    return { totalItems, totalPages, content, currentPage };
  }

  public async existById(id: string): Promise<boolean> {
    return (await this.prismaService.section.count({ where: { id } })) > 0;
  }

  public async existByName(name: string): Promise<boolean> {
    return (await this.prismaService.section.count({ where: { sectionName: name } })) > 0;
  }

  public async count(): Promise<number> {
    return await this.prismaService.section.count();
  }

  public async delete(section: Section): Promise<void> {
    await this.prismaService.section.delete({ where: { id: section.getId() } });
  }

  private buildSection(
    sectionData: PrismaSectionData,
    strandData: PrismaStrandData,
    trackData: PrismaTrackData,
  ): Section {
    return new SectionBuilder()
      .id(sectionData.id)
      .name(sectionData.sectionName)
      .gradeLevel(sectionData.gradeLevel)
      .strand(strandData.strandName)
      .track(trackData.trackName)
      .creationDate(sectionData.creationDate)
      .build();
  }

  private async getStrandData(data: PrismaSectionData): Promise<PrismaStrandData> {
    return await this.prismaService.strand.findUniqueOrThrow({
      where: { id: data.strandId },
    });
  }

  private async getTrackData(data: PrismaStrandData): Promise<PrismaTrackData> {
    return await this.prismaService.track.findUniqueOrThrow({
      where: { id: data.trackId },
    });
  }

  private async insertIntoDatabase(section: Section): Promise<Section> {
    const strandData = await this.prismaService.strand.findUniqueOrThrow({
      where: { strandName: section.getStrand() },
    });
    const trackData = await this.prismaService.track.findUniqueOrThrow({
      where: { id: strandData.trackId },
    });
    const sectionData = await this.prismaService.section.create({
      data: {
        id: section.getId(),
        sectionName: section.getName(),
        gradeLevel: section.getGradeLevel(),
        strandId: strandData.id,
        creationDate: section.getCreationDate(),
      },
    });
    return this.buildSection(sectionData, strandData, trackData);
  }

  private async updateInDatabase(section: Section): Promise<Section> {
    const strandData = await this.prismaService.strand.findUniqueOrThrow({
      where: { strandName: section.getStrand() },
    });
    const trackData = await this.prismaService.track.findUniqueOrThrow({
      where: { id: strandData.trackId },
    });
    const sectionData = await this.prismaService.section.update({
      data: {
        sectionName: section.getName(),
        gradeLevel: section.getGradeLevel(),
        strandId: strandData.id,
      },
      where: { id: section.getId() },
    });
    return this.buildSection(sectionData, strandData, trackData);
  }

  private async fetchAllSections(take: number, skip: number): Promise<Section[]> {
    return await Promise.all(
      await this.prismaService.section
        .findMany({
          take,
          skip,
          orderBy: { creationDate: 'desc' },
        })
        .then((data) =>
          data.map(async (sectionData) => {
            const strandData = await this.getStrandData(sectionData);
            const trackData = await this.getTrackData(strandData);
            return this.buildSection(sectionData, strandData, trackData);
          }),
        ),
    );
  }
}
