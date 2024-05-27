import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SectionService } from './sections.service';
import { StrandsService } from '../strands/strands.service';
import { TrackService } from '../tracks/tracks.service';
import { Request } from 'express';
import { Quidquid } from 'quidquid-picker';
import { SectionBuilder } from './sections.entity';

@Injectable()
export class SectionsInterceptor implements NestInterceptor {
  private sectionsService: SectionService;
  private strandService: StrandsService;
  private trackService: TrackService;

  constructor(
    sectionService: SectionService,
    strandService: StrandsService,
    trackService: TrackService,
  ) {
    this.sectionsService = sectionService;
    this.strandService = strandService;
    this.trackService = trackService;
  }

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestBody = request.body;
    const requestBodyData = Quidquid.from(requestBody);
    const sectionId = await requestBodyData.pickStringOptional('id');
    if (sectionId && (await this.sectionsService.existById(sectionId))) {
      const section = await this.sectionsService.findById(sectionId);
      const sectionName = await requestBodyData.pickStringOptional('name');
      const strandName = await requestBodyData.pickStringOptional('strand');
      const trackName = await requestBodyData.pickStringOptional('track');

      if (strandName && !(await this.strandService.existByName(strandName)))
        throw new NotFoundException(`Strand withd name '${strandName}' does not exist`);

      if (trackName && strandName) {
        const track = await this.trackService.findByName(trackName);
        const strand = await this.strandService.findByName(strandName);
        if (track.getName() != strand.getTrackName()) {
          const message = `'${strandName}' does not belong to '${trackName}'`;
          throw new ConflictException(message);
        }
      }
      section.setName(sectionName);
      section.setStrand(strandName);
      request.body = section;
      return next.handle();
    }

    const sectionName = await requestBodyData.pickString('name');
    const gradeLevel = await requestBodyData.pickString('gradeLevel');
    const strandName = await requestBodyData.pickString('strand');
    const trackName = await requestBodyData.pickStringOptional('track');

    if (trackName) {
      const track = await this.trackService.findByName(trackName);
      const strand = await this.strandService.findByName(strandName);
      if (track.getName() != strand.getTrackName()) {
        const message = `'${strandName}' does not belong to '${trackName}'`;
        throw new ConflictException(message);
      }
    }
    const section = new SectionBuilder().name(sectionName).strand(strandName).build();

    if (gradeLevel == 'G11') section.setGradeLevel(gradeLevel);
    else if (gradeLevel == 'G12') section.setGradeLevel(gradeLevel);
    else throw new BadRequestException("gradeLevel must be either 'G11' or 'G12'");

    request.body = section;
    return next.handle();
  }
}
