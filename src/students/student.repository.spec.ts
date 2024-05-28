import { PrismaService } from '../prisma/prisma.service';
import { StudentBuilder } from './student.entity';
import { PrismaStudentRepository } from './students.repository';

const prismaService = new PrismaService();
const repository = new PrismaStudentRepository(prismaService);

const createStudentSpy = jest
  .spyOn(prismaService.student, 'create')
  .mockResolvedValue({} as any);
const createPersonSpy = jest
  .spyOn(prismaService.person, 'create')
  .mockResolvedValue({} as any);
const updateStudentSpy = jest
  .spyOn(prismaService.student, 'update')
  .mockResolvedValue({} as any);
const updatePersonSpy = jest
  .spyOn(prismaService.person, 'update')
  .mockResolvedValue({} as any);
const existByLrnSpy = jest.spyOn(repository, 'existByLrn');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PrismaStudentRepository', () => {
  describe('save', () => {
    test('should call update if the student already exists', async () => {
      existByLrnSpy.mockResolvedValue(true);
      const student = new StudentBuilder().build();
      await repository.save(student);
      expect(updateStudentSpy).toHaveBeenCalledTimes(1);
      expect(updatePersonSpy).toHaveBeenCalledTimes(1);
    });

    test('should call create if the student does not exist yet', async () => {
      existByLrnSpy.mockResolvedValue(false);
      const student = new StudentBuilder().build();
      await repository.save(student);
      expect(createPersonSpy).toHaveBeenCalledTimes(1);
      expect(createStudentSpy).toHaveBeenCalledTimes(1);
    });
  });
});
