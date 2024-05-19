import { Module } from '@nestjs/common';
import { ArgonPasswordEncoder } from 'jaypee-password-encoder';

@Module({
  providers: [ArgonPasswordEncoder],
  exports: [ArgonPasswordEncoder],
})
export class PasswordModule {}
