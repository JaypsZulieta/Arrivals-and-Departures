import { PrismaService } from '../prisma/prisma.service';
import { GuardBuilder } from './guards.entity';
import { PrismaGuardRepository } from './guards.repository';

describe('GuardsRepository', () => {
  const prismaService = new PrismaService();
  const prismaGuardsRepository = new PrismaGuardRepository(prismaService);
  const createGuardSpy = jest
    .spyOn(prismaService.guard, 'create')
    .mockResolvedValue({} as any);
  const createPersonSpy = jest
    .spyOn(prismaService.person, 'create')
    .mockResolvedValue({} as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    test('should insert into person and guard tables if the guard does not already exist', async () => {
      const existByIdSpy = jest
        .spyOn(prismaGuardsRepository, 'existById')
        .mockResolvedValue(false);

      const guard = new GuardBuilder().build();

      await prismaGuardsRepository.save(guard);

      expect(existByIdSpy).toHaveBeenCalledWith(guard.getId());
      expect(createPersonSpy).toHaveBeenCalledTimes(1);
      expect(createGuardSpy).toHaveBeenCalledTimes(1);
    });

    test('should update a record in the person and guard tables if the guard does exist', async () => {
      const existByIdSpy = jest
        .spyOn(prismaGuardsRepository, 'existById')
        .mockResolvedValue(true);
      const updatePersonSpy = jest
        .spyOn(prismaService.person, 'update')
        .mockResolvedValue({} as any);
      const updateGuardSpy = jest
        .spyOn(prismaService.guard, 'update')
        .mockResolvedValue({} as any);
      const guard = new GuardBuilder().build();

      await prismaGuardsRepository.save(guard);

      expect(updatePersonSpy).toHaveBeenCalledTimes(1);
      expect(updateGuardSpy).toHaveBeenCalledTimes(1);
      expect(existByIdSpy).toHaveBeenCalledWith(guard.getId());
      expect(createGuardSpy).not.toHaveBeenCalled();
      expect(createPersonSpy).not.toHaveBeenCalled();
    });
  });
});
