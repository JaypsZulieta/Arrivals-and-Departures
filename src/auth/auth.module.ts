import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordModule } from '../password/password.module';
import { GuardsModule } from '../guards/guards.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PasswordModule, GuardsModule, PasswordModule, UsersModule],
})
export class AuthModule {}
