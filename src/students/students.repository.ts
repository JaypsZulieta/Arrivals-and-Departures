import { Injectable } from '@nestjs/common';
import {
  PaginatedContent,
  PaginatedContentBuilder,
  PaginationOptions,
} from '../pagination';
import { Student, StudentBuilder } from './student.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Sex } from '../people/person.entity';
import {
  Person as PersonData,
  Track as TrackData,
  Strand as StrandData,
  Student as StudentData,
  Section as SectionData,
} from '@prisma/client';

export abstract class StudentRepository {
  abstract save(student: Student): Promise<Student>;
  abstract findByLrn(lrn: string): Promise<Student>;
  abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Student>>;
  abstract existByLrn(lrn: string): Promise<boolean>;
  abstract count(): Promise<number>;
  abstract delete(student: Student): Promise<void>;
}

@Injectable()
export class PrismaStudentRepository implements StudentRepository {
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  public async save(student: Student): Promise<Student> {
    const learnerReferenceNumber = student.getLearnerReferenceNumber();
    if (await this.existByLrn(learnerReferenceNumber))
      return await this.updateInDatabase(student);
    return this.insertToDatabase(student);
  }

  public async findByLrn(lrn: string): Promise<Student> {
    const studentData = await this.prismaService.student.findUniqueOrThrow({
      where: { learnerReferenceNumber: lrn },
    });
    return await this.findAndBuildStudent(studentData);
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedContent<Student>> {
    const currentPage = options?.pageNumber || 1;
    const take = options?.pageSize || 20;
    const skip = (currentPage - 1) * take;
    const totalItems = await this.count();
    const totalPages = Math.ceil(totalItems / take);
    const content = await this.fetchAll(take, skip);
    return new PaginatedContentBuilder<Student>()
      .totalItems(totalItems)
      .totalPages(totalPages)
      .content(content)
      .currentPage(currentPage)
      .build();
  }

  public async existByLrn(lrn: string): Promise<boolean> {
    return (
      (await this.prismaService.student.count({
        where: { learnerReferenceNumber: lrn },
      })) > 0
    );
  }

  public async count(): Promise<number> {
    return await this.prismaService.student.count();
  }

  public async delete(student: Student): Promise<void> {
    await this.prismaService.student.delete({
      where: { learnerReferenceNumber: student.getLearnerReferenceNumber() },
    });
  }

  private buildStudent(
    studentData: StudentData,
    personData: PersonData,
    sectionData: SectionData,
    strandData: StrandData,
    trackData: TrackData,
  ): Student {
    return new StudentBuilder()
      .learnerReferenceNumber(studentData.learnerReferenceNumber)
      .firstname(personData.firstname)
      .middlename(personData.middlename)
      .lastname(personData.lastname)
      .sex(personData.sex == 'male' ? Sex.MALE : Sex.FEMALE)
      .guardianPhoneNumber(studentData.guardianPhoneNumber)
      .section(sectionData.sectionName)
      .track(trackData.trackName)
      .strand(strandData.strandName)
      .build();
  }

  private async findAndBuildStudent(studentData: StudentData): Promise<Student> {
    const sectionData = await this.prismaService.section.findUniqueOrThrow({
      where: { id: studentData.sectionId },
    });
    const strandData = await this.getStrandData(sectionData);
    const trackData = await this.getTrackData(strandData);
    const personData = await this.prismaService.person.findUniqueOrThrow({
      where: { id: studentData.personId },
    });
    return this.buildStudent(studentData, personData, sectionData, strandData, trackData);
  }

  private async insertToDatabase(student: Student): Promise<Student> {
    const sectionData = await this.getSectionData(student.getSection());
    const strandData = await this.getStrandData(sectionData);
    const trackData = await this.getTrackData(strandData);
    const personData = await this.prismaService.person.create({
      data: {
        avatarURL: student.getAvatarURL(),
        firstname: student.getFirstname(),
        middlename: student.getMiddlename(),
        lastname: student.getLastname(),
        sex: student.getSex() as 'male' | 'female',
      },
    });
    const studentData = await this.prismaService.student.create({
      data: {
        learnerReferenceNumber: student.getLearnerReferenceNumber(),
        sectionId: sectionData.id,
        personId: personData.id,
        guardianPhoneNumber: student.getGuardianPhoneNumber(),
      },
    });
    return this.buildStudent(studentData, personData, sectionData, strandData, trackData);
  }

  private async getSectionData(sectionName: string): Promise<SectionData> {
    return await this.prismaService.section.findUniqueOrThrow({ where: { sectionName } });
  }

  private async getStrandData(sectionData: SectionData): Promise<StrandData> {
    return await this.prismaService.strand.findUniqueOrThrow({
      where: { id: sectionData.strandId },
    });
  }

  private async getTrackData(strandData: StrandData): Promise<TrackData> {
    return await this.prismaService.track.findUniqueOrThrow({
      where: { id: strandData.trackId },
    });
  }

  private async updateInDatabase(student: Student): Promise<Student> {
    const sectionData = await this.getSectionData(student.getSection());
    const strandData = await this.getStrandData(sectionData);
    const trackData = await this.getTrackData(strandData);
    const studentData = await this.prismaService.student.update({
      data: {
        guardianPhoneNumber: student.getGuardianPhoneNumber(),
        sectionId: sectionData.id,
      },
      where: { learnerReferenceNumber: student.getLearnerReferenceNumber() },
    });
    const personData = await this.prismaService.person.update({
      data: {
        avatarURL: student.getAvatarURL(),
        firstname: student.getFirstname(),
        middlename: student.getMiddlename(),
        lastname: student.getLastname(),
        sex: student.getSex() as 'male' | 'female',
      },
      where: { id: studentData.personId },
    });
    return this.buildStudent(studentData, personData, sectionData, strandData, trackData);
  }

  private async fetchAll(take: number, skip: number): Promise<Student[]> {
    return await Promise.all(
      await this.prismaService.student
        .findMany({
          take,
          skip,
          orderBy: { person: { creationDate: 'desc' } },
        })
        .then((data) =>
          data.map(async (studentData) => await this.findAndBuildStudent(studentData)),
        ),
    );
  }
}
