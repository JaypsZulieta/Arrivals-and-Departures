import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StrandsInterceptor } from './strands.interceptor';
import { ValidationExceptionFilter } from '../validation.exception.filter';
import { Strand } from './strands.entity';
import { StrandsService } from './strands.service';
import { HttpExceptionFilter } from '../http.exeption-filter';
import { PaginatedContent } from '../pagination';
import { ResponseMessage } from '../message.entity';
import { AdminOnly, AuthGuard } from '../auth/auth.guard';
import { JsonWebtokenExceptionFilter } from '../jsonwebtoken.exception.filter';

@Controller('strands')
@UseFilters(ValidationExceptionFilter, HttpExceptionFilter, JsonWebtokenExceptionFilter)
export class StrandsController {
  private strandService: StrandsService;

  constructor(strandService: StrandsService) {
    this.strandService = strandService;
  }

  @Post()
  @UseInterceptors(StrandsInterceptor)
  @AdminOnly()
  @UseGuards(AuthGuard)
  public async createStrand(@Body() strand: Strand): Promise<Strand> {
    return await this.strandService.create(strand);
  }

  @Get(':strandId')
  @UseGuards(AuthGuard)
  public async findOne(@Param('strandId') id: string): Promise<Strand> {
    return await this.strandService.findById(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  public async findMany(
    @Query('pageNumber', new DefaultValuePipe('1'), ParseIntPipe) pageNumber?: number,
    @Query('pageSize', new DefaultValuePipe('20'), ParseIntPipe) pageSize?: number,
  ): Promise<PaginatedContent<Strand>> {
    return await this.strandService.findAll({ pageNumber, pageSize });
  }

  @Put()
  @UseInterceptors(StrandsInterceptor)
  @AdminOnly()
  @UseGuards(AuthGuard)
  public async updateStrand(@Body() strand: Strand): Promise<Strand> {
    return await this.strandService.update(strand);
  }

  @Delete(':strandId')
  @AdminOnly()
  @UseGuards(AuthGuard)
  public async delete(@Param('strandId') id: string): Promise<ResponseMessage> {
    return await this.strandService
      .delete(id)
      .then(() => new ResponseMessage(`strand with id '${id}' was successfully deleted`));
  }
}
