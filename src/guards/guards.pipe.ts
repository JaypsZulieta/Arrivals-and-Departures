import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Quidquid, ValidationError } from 'quidquid-picker';
import { Guard, GuardBuilder } from './guards.entity';
import { Sex } from 'src/people/person.entity';

@Injectable()
export class GuardsPipe implements PipeTransform<any, Promise<Guard>> {
  async transform(value: any): Promise<Guard> {
    try {
      const objectValue = Quidquid.from(value);
      const firstname = await objectValue.pickString('firstname');
      const middlename =
        (await objectValue.pickStringOptional('middlename')) || null;
      const lastname = await objectValue.pickString('lastname');
      const sex = await objectValue.pickString('sex');
      const email = await objectValue.pickString('email');
      const password = await objectValue.pickString('password');

      if (sex.toLowerCase() != 'male' && sex.toLowerCase() != 'female')
        throw new BadRequestException('sex must either be Male or Female');

      const guard = new GuardBuilder()
        .firstname(firstname)
        .middlename(middlename)
        .lastname(lastname)
        .email(email)
        .password(password)
        .build();

      if (sex.toLowerCase() == 'male') guard.setSex(Sex.MALE);
      else guard.setSex(Sex.FEMALE);

      return guard;
    } catch (error) {
      if (error instanceof ValidationError)
        throw new BadRequestException(error.message);
      throw error;
    }
  }
}
