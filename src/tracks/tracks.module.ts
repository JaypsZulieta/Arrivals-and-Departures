import { Module, Provider } from '@nestjs/common';
import { StandardTrackService, TrackService } from './tracks.service';
import { PrismaTrackRepository, TrackRepository } from './track.repository';
import { TracksController } from './tracks.controller';
import { UsersModule } from '../users/users.module';
import { permissionsFilterProvider } from '../auth/auth.module';

const trackServiceProvider = {
  provide: TrackService,
  useClass: StandardTrackService,
} satisfies Provider;

const trackRepositoryProvider = {
  provide: TrackRepository,
  useClass: PrismaTrackRepository,
} satisfies Provider;

@Module({
  providers: [trackServiceProvider, trackRepositoryProvider, permissionsFilterProvider],
  controllers: [TracksController],
  exports: [trackServiceProvider],
  imports: [UsersModule],
})
export class TracksModule {}
