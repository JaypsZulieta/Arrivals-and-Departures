import { Module } from '@nestjs/common';
import { GuardsController } from './guards.controller';

@Module({
  controllers: [GuardsController],
  providers: [],
})
export class GuardsModule {}
