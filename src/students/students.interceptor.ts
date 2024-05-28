import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { StudentService } from './students.service';
import { SectionService } from '../sections/sections.service';
import { StrandsService } from 'src/strands/strands.service';
import { TrackService } from 'src/tracks/tracks.service';
import { Request } from 'express';
import { Quidquid } from 'quidquid-picker';
import { Sex } from 'src/people/person.entity';
import { StudentBuilder } from './student.entity';

@Injectable()
export class StudentsInterceptor implements NestInterceptor {
  private studentService: StudentService;
  private sectionServicce: SectionService;
  private strandService: StrandsService;
  private trackService: TrackService;

  constructor(
    studentService: StudentService,
    sectionService: SectionService,
    strandService: StrandsService,
    trackService: TrackService,
  ) {
    this.studentService = studentService;
    this.sectionServicce = sectionService;
    this.strandService = strandService;
    this.trackService = trackService;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const reqeustBody = request.body;
    const requestBodyData = Quidquid.from(reqeustBody);
    const studentLrn = await requestBodyData.pickString('lrn');

    if (await this.studentService.existByLrn(studentLrn)) {
      const student = await this.studentService.findByLrn(studentLrn);
      const firstname = await requestBodyData.pickStringOptional('firstname');
      const middlename = await requestBodyData.pickStringOptional('middlename');
      const lastname = await requestBodyData.pickStringOptional('lastname');
      const sex = await requestBodyData.pickStringOptional('sex');
      const guardianPhoneNumber =
        await requestBodyData.pickStringOptional('guardianPhoneNumber');
      const sectionName = await requestBodyData.pickStringOptional('section');
      const strandName = await requestBodyData.pickStringOptional('strand');
      const trackName = await requestBodyData.pickStringOptional('track');

      if (sex && sex != 'male' && sex != 'female')
        throw new BadRequestException("sex must either be 'male' or 'female'");

      if (sectionName && !(await this.sectionServicce.existByName(sectionName)))
        throw new ConflictException(`Section '${sectionName}' does not exist`);

      if (sectionName && strandName) {
        const section = await this.sectionServicce.findByName(sectionName);
        const strand = await this.strandService.findByName(strandName);

        if (strand.getName() != section.getStrand()) {
          const conflictMessage = `'${sectionName}' does not belong to '${strandName}'`;
          throw new ConflictException(conflictMessage);
        }
      }

      if (strandName && trackName) {
        const strand = await this.strandService.findByName(strandName);
        const track = await this.trackService.findByName(trackName);

        if (strand.getTrackName() != track.getName()) {
          const conflictMessage = `'${strandName}' does not belong to '${trackName}'`;
          throw new ConflictException(conflictMessage);
        }
      }

      student.setFirstname(firstname);
      student.setMiddlename(middlename);
      student.setLastname(lastname);
      student.setSex(sex == 'male' ? Sex.MALE : Sex.FEMALE);
      student.setGuardianPhoneNumber(guardianPhoneNumber);
      student.setSection(sectionName);
      request.body = student;
      return next.handle();
    }

    const firstname = await requestBodyData.pickString('firstname');
    const middlename = await requestBodyData.pickStringOptional('middlename');
    const lastname = await requestBodyData.pickString('lastname');
    const sex = await requestBodyData.pickString('sex');

    if (sex != 'male' && sex != 'female')
      throw new BadRequestException("sex must either be 'male' or 'female'");

    const guardianPhoneNumber = await requestBodyData.pickString('guardianPhoneNumber');

    const sectionName = await requestBodyData.pickString('section');
    const strandName = await requestBodyData.pickStringOptional('strand');
    const trackName = await requestBodyData.pickStringOptional('track');

    if (sectionName && !(await this.sectionServicce.existByName(sectionName)))
      throw new ConflictException(`Section '${sectionName}' does not exist`);

    if (sectionName && strandName) {
      const section = await this.sectionServicce.findByName(sectionName);
      const strand = await this.strandService.findByName(strandName);

      if (strand.getName() != section.getStrand()) {
        const conflictMessage = `'${sectionName}' does not belong to '${strandName}'`;
        throw new ConflictException(conflictMessage);
      }
    }

    if (strandName && trackName) {
      const strand = await this.strandService.findByName(strandName);
      const track = await this.trackService.findByName(trackName);

      if (strand.getTrackName() != track.getName()) {
        const conflictMessage = `'${strandName}' does not belong to '${trackName}'`;
        throw new ConflictException(conflictMessage);
      }
    }

    const student = new StudentBuilder()
      .learnerReferenceNumber(studentLrn)
      .firstname(firstname)
      .middlename(!middlename ? null : middlename)
      .lastname(lastname)
      .sex(sex == 'male' ? Sex.MALE : Sex.FEMALE)
      .guardianPhoneNumber(guardianPhoneNumber)
      .section(sectionName)
      .build();

    request.body = student;

    return next.handle();
  }
}
