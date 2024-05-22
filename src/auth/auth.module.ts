import { Module, Provider, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordModule } from '../password/password.module';
import { GuardsModule } from '../guards/guards.module';
import { PermissionsFilter } from './auth.guard';
import { permissionsFilterChain } from './permissions.filter.chain';

const permissionsFilterProvider = {
  provide: PermissionsFilter,
  useValue: permissionsFilterChain,
} satisfies Provider;

@Module({
  controllers: [AuthController],
  providers: [AuthService, permissionsFilterProvider],
  exports: [permissionsFilterProvider],
  imports: [PasswordModule, forwardRef(() => GuardsModule), PasswordModule, UsersModule],
})
export class AuthModule {}
