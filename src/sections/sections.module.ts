import { Module, Provider } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { TracksModule } from '../tracks/tracks.module';
import { StrandsModule } from '../strands/strands.module';
import { SectionService, StandardSectionService } from './sections.service';
import { PrismaSectionRepository, SectionRepository } from './section.repository';
import { AuthModule, permissionsFilterProvider } from '../auth/auth.module';
import { UsersModule } from 'src/users/users.module';

export const sectionServiceProvider = {
  provide: SectionService,
  useClass: StandardSectionService,
} satisfies Provider;

export const sectionRepositoryProvider = {
  provide: SectionRepository,
  useClass: PrismaSectionRepository,
} satisfies Provider;

@Module({
  controllers: [SectionsController],
  providers: [
    sectionServiceProvider,
    sectionRepositoryProvider,
    permissionsFilterProvider,
  ],
  exports: [sectionServiceProvider],
  imports: [TracksModule, StrandsModule, AuthModule, UsersModule],
})
export class SectionsModule {}
