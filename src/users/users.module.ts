import { Module, Provider, forwardRef } from '@nestjs/common';
import { GuardUsersService, UsersService } from './users.service';
import { GuardsModule } from '../guards/guards.module';

export const userServiceProvider = {
  provide: UsersService,
  useClass: GuardUsersService,
} satisfies Provider;

@Module({
  providers: [userServiceProvider],
  exports: [userServiceProvider],
  imports: [forwardRef(() => GuardsModule)],
})
export class UsersModule {}
