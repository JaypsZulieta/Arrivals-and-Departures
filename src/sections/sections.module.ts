import { Module, Provider } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { TracksModule } from '../tracks/tracks.module';
import { StrandsModule } from '../strands/strands.module';
import { SectionService, StandardSectionService } from './sections.service';
import { PrismaSectionRepository, SectionRepository } from './section.repository';

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
  providers: [sectionServiceProvider, sectionRepositoryProvider],
  imports: [TracksModule, StrandsModule],
})
export class SectionsModule {}
