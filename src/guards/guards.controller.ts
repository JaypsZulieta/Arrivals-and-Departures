import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ValidationExceptionFilter } from '../validation.exception.filter';
import { HttpExceptionFilter } from '../http.exeption-filter';
import { GuardsService } from './guards.service';
import { Guard } from './guards.entity';
import { GuardsPipe } from './guards.pipe';
import { ArgonPasswordEncoder, PasswordEncoder } from 'jaypee-password-encoder';
import { AdminOnly, AuthGuard, OwnerOnly } from '../auth/auth.guard';
import { JsonWebtokenExceptionFilter } from '../jsonwebtoken.exception.filter';
import { Quidquid } from 'quidquid-picker';
import { PaginatedContent } from 'src/pagination';

@Controller('guards')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(ValidationExceptionFilter, HttpExceptionFilter, JsonWebtokenExceptionFilter)
export class GuardsController {
  private guardService: GuardsService;
  private passwordEncoder: PasswordEncoder;

  constructor(guardService: GuardsService, passwordEncoder: ArgonPasswordEncoder) {
    this.guardService = guardService;
    this.passwordEncoder = passwordEncoder;
  }

  @Post('first')
  public async registerFirst(@Body(GuardsPipe) guard: Guard): Promise<Guard> {
    if (await this.guardService.hasAdmin())
      throw new ForbiddenException('There is already an admin in the system');
    guard.setAdminStatus(true);
    guard.setPassword(await this.passwordEncoder.encode(guard.getPassword()));
    return await this.guardService.register(guard);
  }

  @Post()
  @AdminOnly()
  @UseGuards(AuthGuard)
  public async register(@Body(GuardsPipe) guard: Guard): Promise<Guard> {
    guard.setPassword(await this.passwordEncoder.encode(guard.getPassword()));
    return await this.guardService.register(guard);
  }

  @Get(':guardId')
  @UseGuards(AuthGuard)
  public async findOne(@Param('guardId') guardId: string) {
    return this.guardService.findById(guardId);
  }

  @Get()
  public async findAll(
    @Query('pageNummber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<PaginatedContent<Guard>> {
    return await this.guardService.findAll({ pageNumber: pageNumber || 1, pageSize });
  }

  @Patch(':guardId')
  @OwnerOnly()
  @UseGuards(AuthGuard)
  public async updateGuard(
    @Body() requestBody: any,
    @Param('guardId') id: string,
  ): Promise<Guard> {
    const updateData = Quidquid.from(requestBody);
    return await this.guardService.update(updateData, id);
  }

  @Delete(':id')
  @AdminOnly()
  @UseGuards(AuthGuard)
  public async deleteGuard(@Param('id') id: string): Promise<{ message: string }> {
    const guard = await this.guardService.findById(id);
    const message = `successfully deleted ${guard.getFirstname()} ${guard.getLastname()}`;
    await this.guardService.delete(guard);
    return { message };
  }
}
