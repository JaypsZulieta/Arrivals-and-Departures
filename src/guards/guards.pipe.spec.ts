import { ValidationError } from 'quidquid-picker';
import { Guard } from './guards.entity';
import { GuardsPipe } from './guards.pipe';
import { BadRequestException } from '@nestjs/common';

describe('GuardsPipe', () => {
  it('should be defined', () => {
    expect(new GuardsPipe()).toBeDefined();
  });

  describe('transform', () => {
    it('should return an instance of Guard if the input data is acceptable', () => {
      const data = {
        firstname: 'Jaypee',
        middlename: 'Pagalan',
        lastname: 'Zulieta',
        sex: 'male',
        email: 'jaypee.zulieta@lsu.edu.ph',
        password: 'Xscvsdg5417!',
      };
      const guardsPipe = new GuardsPipe();

      const guard = guardsPipe.transform(data);
      expect(guard).resolves.toBeInstanceOf(Guard);
    });

    it('should throw a ValidationError if the firstname is not of type string', () => {
      const data = {
        firstname: 123,
        middlename: 'Pagalan',
        lastname: 'Zulieta',
        sex: 'male',
        email: 'jaypee.zulieta@lsu.edu.ph',
        password: 'Xscvsdg5417!',
      };
      const guardsPipe = new GuardsPipe();
      const guard = guardsPipe.transform(data);
      expect(guard).rejects.toThrow(ValidationError);
    });

    it('should throw a ValidationError if the firstname is not present in the data', () => {
      const data = {
        middlename: 'Pagalan',
        lastname: 'Zulieta',
        sex: 'male',
        email: 'jaypee.zulieta@lsu.edu.ph',
        password: 'Xscvsdg5417!',
      };
      const guardsPipe = new GuardsPipe();
      const guard = guardsPipe.transform(data);
      expect(guard).rejects.toThrow(ValidationError);
    });

    it('should throw a BadRequestException if the sex in the data is not valid', () => {
      const data = {
        firstname: 'Jaypee',
        middlename: 'Pagalan',
        lastname: 'Zulieta',
        sex: 'Apache Attack Helicopter',
        email: 'jaypee.zulieta@lsu.edu.ph',
        password: 'Xscvsdg5417!',
      };
      const guardsPipe = new GuardsPipe();
      const guard = guardsPipe.transform(data);
      expect(guard).rejects.toThrow(BadRequestException);
    });
  });
});
