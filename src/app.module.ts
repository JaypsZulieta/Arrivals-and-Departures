import { Module } from '@nestjs/common';
import { GuardsModule } from './guards/guards.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [GuardsModule, AuthModule],
})
export class AppModule {}
