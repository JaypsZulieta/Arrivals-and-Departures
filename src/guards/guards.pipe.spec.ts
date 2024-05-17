import { Guard } from './guards.entity';
import { GuardsPipe } from './guards.pipe';

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
  });
});
