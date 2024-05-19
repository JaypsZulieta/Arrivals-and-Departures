import { Module, Provider } from '@nestjs/common';
import { GuardsController } from './guards.controller';
import { GuardsService, StandardGuardService } from './guards.service';
import { PasswordModule } from '../password/password.module';
import { ArgonPasswordEncoder } from 'jaypee-password-encoder';

export const guardsServiceProvider = {
  provide: GuardsService,
  useClass: StandardGuardService,
} satisfies Provider;

@Module({
  imports: [PasswordModule],
  controllers: [GuardsController],
  providers: [guardsServiceProvider, ArgonPasswordEncoder],
  exports: [guardsServiceProvider],
})
export class GuardsModule {}
