import {  Controller,  UseFilters } from '@nestjs/common';
import { ValidationExceptionFilter } from 'src/validation.exception-filter';

@Controller('guards')
@UseFilters(ValidationExceptionFilter)
export class GuardsController {
  
}
