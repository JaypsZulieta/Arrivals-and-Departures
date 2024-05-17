import { ValidationExceptionFilter } from 'src/validation.exception-filter';
import { Guard } from './guards.entity';
import { GuardsPipe } from './guards.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';

@Controller('guards')
@UseFilters(ValidationExceptionFilter)
export class GuardsController {
  @Post()
  register(@Body(GuardsPipe) guard: Guard): Promise<Guard> {
    throw Error('unimplemented method');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Guard> {
    throw Error('unimplemented method');
  }

  @Get()
  findAll(
    @Query('pageNumber', ParseIntPipe) pageNumber?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
  ): Promise<Guard[]> {
    throw Error('unimplemented method');
  }

  @Patch(':id')
  update(@Body() updateData: any, @Param('id') id: string): Promise<Guard> {
    throw Error('unimplemented method');
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    throw Error('unimplemented method');
  }
}
