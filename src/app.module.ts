import { Module } from '@nestjs/common';
import { GuardsModule } from './guards/guards.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PasswordModule } from './password/password.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [GuardsModule, AuthModule, UsersModule, PasswordModule, PrismaModule],
})
export class AppModule {}
