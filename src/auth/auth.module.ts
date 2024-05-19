import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule, userServiceProvider } from '../users/users.module';
import { PasswordModule } from '../password/password.module';
import { ArgonPasswordEncoder } from 'jaypee-password-encoder';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, userServiceProvider],
  imports: [UsersModule, PasswordModule, GuardsModule, PasswordModule],
})
export class AuthModule {}
