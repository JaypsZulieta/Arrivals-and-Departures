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
  UseInterceptors,
} from '@nestjs/common';
import { Section } from './sections.entity';
import { SectionsInterceptor } from './sections.interceptor';
import { SectionService } from './sections.service';
import { ValidationExceptionFilter } from '../validation.exception.filter';
import { HttpExceptionFilter } from '../http.exeption-filter';
import { JsonWebtokenExceptionFilter } from '../jsonwebtoken.exception.filter';
import { PaginatedContent } from '../pagination';
import { ResponseMessage } from '../message.entity';

@Controller('sections')
@UseFilters(ValidationExceptionFilter, HttpExceptionFilter, JsonWebtokenExceptionFilter)
export class SectionsController {
  private sectionsService: SectionService;

  constructor(sectionService: SectionService) {
    this.sectionsService = sectionService;
  }

  @Post()
  @UseInterceptors(SectionsInterceptor)
  public async create(@Body() section: Section): Promise<Section> {
    return await this.sectionsService.create(section);
  }

  @Get()
  public async findAll(
    @Query('pageSize', new DefaultValuePipe('20'), ParseIntPipe) pageSize?: number,
    @Query('pageNumber', new DefaultValuePipe('1'), ParseIntPipe) pageNumber?: number,
  ): Promise<PaginatedContent<Section>> {
    return await this.sectionsService.findAll({ pageSize, pageNumber });
  }

  @Get(':sectionId')
  public async findOne(@Param('sectionId') id: string): Promise<Section> {
    return await this.sectionsService.findById(id);
  }

  @Get('name/:name')
  public async findByName(@Param('name') name: string): Promise<Section> {
    return await this.sectionsService.findByName(name);
  }

  @Put()
  @UseInterceptors(SectionsInterceptor)
  public async update(@Body() section: Section): Promise<Section> {
    return await this.sectionsService.update(section);
  }

  @Delete(':strandId')
  public async delete(@Param('strandId') id: string): Promise<ResponseMessage> {
    return await this.sectionsService
      .delete(id)
      .then(() => new ResponseMessage(`section withd '${id}' successfully deleted`));
  }
}
