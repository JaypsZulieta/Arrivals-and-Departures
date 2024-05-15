import { Body, Controller, Post } from '@nestjs/common';
import { GuardsPipe } from './guards.pipe';
import { Guard } from './guards.entity';

@Controller('guards')
export class GuardsController {
  @Post()
  getGuard(@Body(GuardsPipe) guard: Guard): Guard {
    return guard;
  }
}
