import { Module, Provider, forwardRef } from '@nestjs/common';
import { GuardsController } from './guards.controller';
import { GuardsService, StandardGuardService } from './guards.service';
import { PasswordModule } from '../password/password.module';
import { ArgonPasswordEncoder } from 'jaypee-password-encoder';
import { UsersModule } from '../users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { GuardsRepository, PrismaGuardRepository } from './guards.repository';

export const guardsServiceProvider = {
  provide: GuardsService,
  useClass: StandardGuardService,
} satisfies Provider;

export const guardsRepositoryProvider = {
  provide: GuardsRepository,
  useClass: PrismaGuardRepository,
} satisfies Provider;

@Module({
  imports: [PasswordModule, forwardRef(() => UsersModule), forwardRef(() => AuthModule)],
  controllers: [GuardsController],
  providers: [guardsServiceProvider, ArgonPasswordEncoder, guardsRepositoryProvider],
  exports: [guardsServiceProvider, guardsRepositoryProvider],
})
export class GuardsModule {}
