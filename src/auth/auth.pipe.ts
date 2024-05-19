import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { EmailAndPasswordCredentials } from './auth.entity';
import { Quidquid } from 'quidquid-picker';

@Injectable()
export class AuthPipe
  implements PipeTransform<any, Promise<EmailAndPasswordCredentials>>
{
  async transform(value: any): Promise<EmailAndPasswordCredentials> {
    const objectValue = Quidquid.from(value);
    const email = await objectValue.pickString('email');
    const password = await objectValue.pickString('password');
    return new EmailAndPasswordCredentials(email, password);
  }
}
