import { Body, Controller, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { StrandsInterceptor } from './strands.interceptor';
import { ValidationExceptionFilter } from '../validation.exception.filter';
import { Strand } from './strands.entity';

@Controller('strands')
@UseFilters(ValidationExceptionFilter)
export class StrandsController {
  @Post()
  @UseInterceptors(StrandsInterceptor)
  public async createStrand(@Body() strand: Strand): Promise<any> {
    console.log(strand.getName());
    console.log(strand.getTrackName());
    return strand;
  }
}
