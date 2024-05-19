import { Module, Provider } from '@nestjs/common';
import { GuardsController } from './guards.controller';
import { GuardsService, StandardGuardService } from './guards.service';

export const guardsServiceProvider = {
  provide: GuardsService,
  useClass: StandardGuardService,
} satisfies Provider;

@Module({
  controllers: [GuardsController],
  providers: [guardsServiceProvider],
  exports: [guardsServiceProvider],
})
export class GuardsModule {}
