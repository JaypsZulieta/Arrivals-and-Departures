import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http.exeption-filter';
import { ValidationExceptionFilter } from '../validation.exception-filter';
import { Authentication, EmailAndPasswordCredentials } from './auth.entity';
import { AuthPipe } from './auth.pipe';
import { AuthService } from './auth.service';

@Controller('auth')
@UseFilters(ValidationExceptionFilter, HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post()
  async signIn(
    @Body(AuthPipe) credentials: EmailAndPasswordCredentials,
  ): Promise<Authentication> {
    const email = credentials.getEmail();
    const password = credentials.getPassword();
    return await this.authService.signIn(email, password);
  }
}
