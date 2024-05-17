import { Module } from '@nestjs/common';
import { GuardsController } from './guards.controller';
import { GuardsService, StandardGuardService } from './guards.service';

@Module({
  controllers: [GuardsController],
  providers: [{ provide: GuardsService, useClass: StandardGuardService }],
})
export class GuardsModule {}
