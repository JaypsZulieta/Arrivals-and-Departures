import { PrismaService } from '../prisma/prisma.service';
import { GuardBuilder } from './guards.entity';
import { GuardsRepository, PrismaGuardRepository } from './guards.repository';

describe('GuardsRepository', () => {
  let prismaGuardsRepository: GuardsRepository;
  let prismaService: PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaService = new PrismaService();
    prismaGuardsRepository = new PrismaGuardRepository(prismaService);
  });

  describe('save', () => {
    test('should insert into person and guard tables if the guard does not already exist', async () => {
      const existByIdSpy = jest
        .spyOn(prismaGuardsRepository, 'existById')
        .mockResolvedValue(false);
      const createGuardSpy = jest
        .spyOn(prismaService.guard, 'create')
        .mockResolvedValue({} as any);
      const createPersonSpy = jest
        .spyOn(prismaService.person, 'create')
        .mockResolvedValue({} as any);

      const guard = new GuardBuilder().build();

      prismaGuardsRepository.save(guard).then(() => {
        // Assert
        expect(existByIdSpy).toHaveBeenCalledWith(guard.getId());
        expect(createPersonSpy).toHaveBeenCalledTimes(1);
        expect(createGuardSpy).toHaveBeenCalledTimes(1);
      });
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
      prismaGuardsRepository.save(guard).then(() => {
        expect(existByIdSpy).toHaveBeenCalledWith(guard.getId());
        expect(updatePersonSpy).toHaveBeenCalledTimes(1);
        expect(updateGuardSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
