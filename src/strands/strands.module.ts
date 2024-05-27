import { Module, Provider } from '@nestjs/common';
import { StrandsController } from './strands.controller';
import { TracksModule } from '../tracks/tracks.module';
import { StandardStrandsService, StrandsService } from './strands.service';
import { PrismaStrandRepository, StrandRepository } from './strands.repository';
import { AuthModule, permissionsFilterProvider } from '../auth/auth.module';
import { UsersModule } from 'src/users/users.module';

export const strandServiceProvider = {
  provide: StrandsService,
  useClass: StandardStrandsService,
} satisfies Provider;

export const strandRepositoryProvider = {
  provide: StrandRepository,
  useClass: PrismaStrandRepository,
} satisfies Provider;

@Module({
  controllers: [StrandsController],
  providers: [strandServiceProvider, strandRepositoryProvider, permissionsFilterProvider],
  exports: [strandServiceProvider],
  imports: [TracksModule, AuthModule, UsersModule],
})
export class StrandsModule {}
