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

@Injectable()
export class StrandsInterceptor implements NestInterceptor {
  private trackService: TrackService;

  constructor(trackService: TrackService) {
    this.trackService = trackService;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    console.log('before the handler');
    const request = context.switchToHttp().getRequest<Request>();
    const requestBodyData = Quidquid.from(request.body);
    const trackName = await requestBodyData.pickString('trackName');
    if (!(await this.trackService.existByName(trackName)))
      throw new NotFoundException(`'${trackName}' does not exist`);
    const strandName = await requestBodyData.pickString('name');
    const strand = new StrandBuilder().name(strandName).track(trackName).build();
    request.body = strand;
    return next.handle();
  }
}
