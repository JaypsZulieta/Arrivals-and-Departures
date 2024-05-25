import { Module, Provider } from '@nestjs/common';
import { StandardTrackService, TrackService } from './tracks.service';

const trackServiceProvider = {
  provide: TrackService,
  useClass: StandardTrackService,
} satisfies Provider;

@Module({
  providers: [trackServiceProvider],
})
export class TracksModule {}
