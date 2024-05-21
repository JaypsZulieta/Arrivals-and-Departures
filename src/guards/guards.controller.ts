import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ValidationExceptionFilter } from '../validation.exception.filter';
import { HttpExceptionFilter } from '../http.exeption-filter';
import { GuardsService } from './guards.service';
import { Guard } from './guards.entity';
import { GuardsPipe } from './guards.pipe';
import { ArgonPasswordEncoder } from 'jaypee-password-encoder';
import { AdminOnlyGuard } from '../auth/auth.guard';

@Controller('guards')
@UseFilters(ValidationExceptionFilter, HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class GuardsController {
  constructor(
    private guardService: GuardsService,
    private passwordEncoder: ArgonPasswordEncoder,
  ) {}

  @Post('first')
  async registerFirst(@Body(GuardsPipe) guard: Guard): Promise<Guard> {
    if (await this.guardService.hasAdmin())
      throw new ForbiddenException('There is already an admin in the system');
    guard.setAdminStatus(true);
    guard.setPassword(await this.passwordEncoder.encode(guard.getPassword()));
    return await this.guardService.register(guard);
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  async register(@Body(GuardsPipe) guard: Guard): Promise<Guard> {
    guard.setPassword(await this.passwordEncoder.encode(guard.getPassword()));
    return await this.guardService.register(guard);
  }
}
