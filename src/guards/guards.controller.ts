import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { GuardsPipe } from './guards.pipe';
import { Guard } from './guards.entity';
import { ValidationExceptionFilter } from 'src/validation.exception-filter';

@Controller('guards')
@UseFilters(ValidationExceptionFilter)
export class GuardsController {
  @Post()
  getGuard(@Body(GuardsPipe) guard: Guard): Guard {
    return guard;
  }
}
