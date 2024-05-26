import { Body, Controller, Post, Put, UseFilters, UseInterceptors } from '@nestjs/common';
import { StrandsInterceptor } from './strands.interceptor';
import { ValidationExceptionFilter } from '../validation.exception.filter';
import { Strand } from './strands.entity';
import { StrandsService } from './strands.service';

@Controller('strands')
@UseFilters(ValidationExceptionFilter)
export class StrandsController {
  private strandService: StrandsService;

  constructor(strandService: StrandsService) {
    this.strandService = strandService;
  }

  @Post()
  @UseInterceptors(StrandsInterceptor)
  public async createStrand(@Body() strand: Strand): Promise<Strand> {
    return await this.strandService.create(strand);
  }

  @Put()
  @UseInterceptors(StrandsInterceptor)
  public async updateStrand(@Body() strand: Strand): Promise<Strand> {
    return await this.strandService.update(strand);
  }
}
