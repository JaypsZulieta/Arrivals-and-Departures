import { Module, Provider } from '@nestjs/common';
import { GuardUsersService, UsersService } from './users.service';
import { GuardsModule, guardsServiceProvider } from '../guards/guards.module';

export const userServiceProvider = {
  provide: UsersService,
  useClass: GuardUsersService,
} satisfies Provider;

@Module({
  providers: [userServiceProvider],
  exports: [userServiceProvider],
  imports: [GuardsModule],
})
export class UsersModule {}
