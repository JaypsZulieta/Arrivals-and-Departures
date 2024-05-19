import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ValidationExceptionFilter } from '../validation.exception-filter';
import { HttpExceptionFilter } from 'src/http.exeption-filter';
import { GuardsService } from './guards.service';
import { Guard } from './guards.entity';
import { GuardsPipe } from './guards.pipe';

@Controller('guards')
@UseFilters(ValidationExceptionFilter, HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class GuardsController {
  constructor(private guardService: GuardsService) {}

  @Post('first')
  async registerFirst(@Body(GuardsPipe) guard: Guard): Promise<Guard> {
    if (await this.guardService.hasAdmin())
      throw new ForbiddenException('There is already an admin in the system');
    guard.setAdminStatus(true);
    return await this.guardService.register(guard);
  }

  @Post()
  async register(@Body(GuardsPipe) guard: Guard): Promise<Guard> {
    return await this.guardService.register(guard);
  }
}
