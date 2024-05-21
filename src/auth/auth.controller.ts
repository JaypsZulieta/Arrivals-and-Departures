import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Headers,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http.exeption-filter';
import { ValidationExceptionFilter } from '../validation.exception.filter';
import {
  Authentication,
  EmailAndPasswordCredentials,
  RefreshAuthentication,
} from './auth.entity';
import { AuthPipe } from './auth.pipe';
import { AuthService } from './auth.service';
import { JsonWebtokenExceptionFilter } from 'src/jsonwebtoken.exception.filter';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(ValidationExceptionFilter, HttpExceptionFilter, JsonWebtokenExceptionFilter)
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

  @Put()
  async refresh(
    @Headers('Authorization') header: string,
  ): Promise<RefreshAuthentication> {
    const token = header.split('Bearer ')[1] as string;
    return this.authService.refresh(token);
  }
}
