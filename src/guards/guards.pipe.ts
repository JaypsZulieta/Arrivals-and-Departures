import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Quidquid } from 'quidquid-picker';
import { Guard, GuardBuilder } from './guards.entity';
import { Sex } from '../people/person.entity';

@Injectable()
export class GuardsPipe implements PipeTransform<any, Promise<Guard>> {
  async transform(value: any): Promise<Guard> {
    const objectValue = Quidquid.from(value);
    return await this.convertToGuardInstance(objectValue);
  }

  private async convertToGuardInstance(objectValue: Quidquid): Promise<Guard> {
    const firstname = await objectValue.pickString('firstname');
    const middlename =
      (await objectValue.pickStringOptional('middlename')) || null;
    const lastname = await objectValue.pickString('lastname');
    const sex = await objectValue.pickString('sex');
    const email = await objectValue.pickString('email');
    const password = await objectValue.pickString('password');

    if (this.notValidSex(sex))
      throw new BadRequestException('sex must either be Male or Female');

    const guard = new GuardBuilder()
      .firstname(firstname)
      .middlename(middlename)
      .lastname(lastname)
      .email(email)
      .password(password)
      .build();
    return this.setSexToGuard(sex, guard);
  }

  private notValidSex(sex: string): boolean {
    return sex.toLowerCase() != 'male' && sex.toLowerCase() != 'female';
  }

  private setSexToGuard(sex: string, guard: Guard): Guard {
    if (sex.toLowerCase() == 'male') guard.setSex(Sex.MALE);
    else guard.setSex(Sex.FEMALE);
    return guard;
  }
}
