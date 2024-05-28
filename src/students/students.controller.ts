import {
  Body,
  ClassSerializerInterceptor,
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
import { HttpExceptionFilter } from '../http.exeption-filter';
import { JsonWebtokenExceptionFilter } from '../jsonwebtoken.exception.filter';
import { ValidationExceptionFilter } from '../validation.exception.filter';
import { Student } from './student.entity';
import { StudentService } from './students.service';
import { StudentsInterceptor } from './students.interceptor';
import { AdminOnly, AuthGuard } from '../auth/auth.guard';
import { PaginatedContent } from '../pagination';
import { ResponseMessage } from 'src/message.entity';

@Controller('students')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(ValidationExceptionFilter, HttpExceptionFilter, JsonWebtokenExceptionFilter)
export class StudentsController {
  private studentService: StudentService;

  constructor(studentService: StudentService) {
    this.studentService = studentService;
  }

  @Post()
  @AdminOnly()
  @UseGuards(AuthGuard)
  @UseInterceptors(StudentsInterceptor)
  public async create(@Body() student: Student): Promise<Student> {
    return await this.studentService.create(student);
  }

  @Get(':lrn')
  @UseGuards(AuthGuard)
  public async findByLrn(@Param('lrn') lrn: string): Promise<Student> {
    return await this.studentService.findByLrn(lrn);
  }

  @Get()
  @UseGuards(AuthGuard)
  public async findAll(
    @Query('pageNumber', new DefaultValuePipe('1'), ParseIntPipe) pageNumber?: number,
    @Query('pageSize', new DefaultValuePipe('20'), ParseIntPipe) pageSize?: number,
  ): Promise<PaginatedContent<Student>> {
    return await this.studentService.findAll({ pageNumber, pageSize });
  }

  @Put()
  @AdminOnly()
  @UseGuards(AuthGuard)
  @UseInterceptors(StudentsInterceptor)
  public async update(@Body() student: Student): Promise<Student> {
    return await this.studentService.update(student);
  }

  @Delete(':lrn')
  @AdminOnly()
  @UseGuards(AuthGuard)
  public async delete(@Param('lrn') lrn: string): Promise<ResponseMessage> {
    const message = `student with lrn '${lrn}' has succesfully been deleted`;
    return await this.studentService.delete(lrn).then(() => new ResponseMessage(message));
  }
}
