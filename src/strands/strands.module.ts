import { Module } from '@nestjs/common';
import { StrandsController } from './strands.controller';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  controllers: [StrandsController],
  imports: [TracksModule],
})
export class StrandsModule {}
