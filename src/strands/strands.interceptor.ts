import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Quidquid } from 'quidquid-picker';
import { TrackService } from 'src/tracks/tracks.service';
import { StrandBuilder } from './strands.entity';
import { StrandsService } from './strands.service';

@Injectable()
export class StrandsInterceptor implements NestInterceptor {
  private trackService: TrackService;
  private strandService: StrandsService;

  constructor(trackService: TrackService, strandService: StrandsService) {
    this.trackService = trackService;
    this.strandService = strandService;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    let request = context.switchToHttp().getRequest<Request>();
    const requestBody = request.body;
    const requestData = Quidquid.from(requestBody);
    const strandId = await requestData.pickStringOptional('id');
    if (strandId && (await this.strandService.existById(strandId))) {
      const strand = await this.strandService.findById(strandId);
      const strandName = await requestData.pickStringOptional('name');
      const trackName = await requestData.pickStringOptional('track');
      if (trackName && !(await this.trackService.existByName(trackName)))
        throw new NotFoundException(`track with name ${trackName} does not exist`);
      strand.setName(strandName);
      strand.setTrackName(trackName);
      request.body = strand;
      return next.handle();
    }
    const strandName = await requestData.pickString('name');
    const trackName = await requestData.pickString('track');
    if (!(await this.trackService.existByName(trackName)))
      throw new NotFoundException(`track with name ${trackName} does not exist`);
    const strand = new StrandBuilder().name(strandName).track(trackName).build();
    request.body = strand;
    return next.handle();
  }
}
