import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Track } from './track.entity';
import { TrackService } from './tracks.service';
import { TracksPipe } from './tracks.pipe';
import { PaginatedContent } from '../pagination';
import { Quidquid } from 'quidquid-picker';
import { ValidationExceptionFilter } from '../validation.exception.filter';
import { HttpExceptionFilter } from '../http.exeption-filter';
import { JsonWebtokenExceptionFilter } from '../jsonwebtoken.exception.filter';
import { AdminOnly, AuthGuard } from '../auth/auth.guard';

@Controller('tracks')
@UseFilters(ValidationExceptionFilter, HttpExceptionFilter, JsonWebtokenExceptionFilter)
export class TracksController {
  private trackService: TrackService;

  constructor(trackService: TrackService) {
    this.trackService = trackService;
  }

  @Post()
  @AdminOnly()
  @UseGuards(AuthGuard)
  public async createTrack(@Body(TracksPipe) track: Track): Promise<Track> {
    return await this.trackService.create(track);
  }

  @Get(':trackId')
  @UseGuards(AuthGuard)
  public async findById(@Param('trackId') id: string): Promise<Track> {
    return await this.trackService.findById(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  public async findMany(
    @Query('pageSize', new DefaultValuePipe('20'), ParseIntPipe) pageSize?: number,
    @Query('pageNumber', new DefaultValuePipe('1'), ParseIntPipe) pageNumber?: number,
  ): Promise<PaginatedContent<Track>> {
    return await this.trackService.findAll({ pageNumber, pageSize });
  }

  @Patch(':trackId')
  @AdminOnly()
  @UseGuards(AuthGuard)
  public async update(
    @Body() updateData: any,
    @Param('trackId') id: string,
  ): Promise<Track> {
    return await this.trackService.update(Quidquid.from(updateData), id);
  }

  @Delete(':trackId')
  @AdminOnly()
  @UseGuards(AuthGuard)
  public async delete(@Param('trackId') id: string): Promise<{ message: string }> {
    await this.trackService.deleteById(id);
    return { message: `track with id ${id} successfully deleted` };
  }
}
