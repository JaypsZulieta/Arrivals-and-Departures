import { Module, Provider, forwardRef } from '@nestjs/common';
import { GuardsController } from './guards.controller';
import { GuardsService, StandardGuardService } from './guards.service';
import { PasswordModule } from '../password/password.module';
import { ArgonPasswordEncoder } from 'jaypee-password-encoder';
import { UsersModule } from '../users/users.module';

export const guardsServiceProvider = {
  provide: GuardsService,
  useClass: StandardGuardService,
} satisfies Provider;

@Module({
  imports: [PasswordModule, forwardRef(() => UsersModule)],
  controllers: [GuardsController],
  providers: [guardsServiceProvider, ArgonPasswordEncoder],
  exports: [guardsServiceProvider],
})
export class GuardsModule {}
