import { ConflictException, NotFoundException } from '@nestjs/common';
import { StudentBuilder } from './student.entity';
import { StudentRepository } from './students.repository';
import { StandardStudentService } from './students.service';

const mockStudentRepository = {
  save: jest.fn(),
  findByLrn: jest.fn(),
  existByLrn: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  delete: jest.fn(),
} satisfies jest.Mocked<StudentRepository>;

const service = new StandardStudentService(mockStudentRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('StandardStudentService', () => {
  describe('create', () => {
    test('should throw a ConflictException if the lrn already exists', () => {
      mockStudentRepository.existByLrn.mockResolvedValue(true);
      const student = new StudentBuilder().build();
      const action = async () => {
        await service.create(student);
      };
      expect(action).rejects.toThrow(ConflictException);
    });

    test('shoudld call the StudentRepository.save method if the student does not exist yet', async () => {
      mockStudentRepository.existByLrn.mockResolvedValue(false);
      const student = new StudentBuilder().build();
      await service.create(student);
      expect(mockStudentRepository.save).toHaveBeenCalledWith(student);
    });
  });

  describe('update', () => {
    describe('update', () => {
      test('should throw a NotFoundException if the student does not exist', () => {
        mockStudentRepository.existByLrn.mockResolvedValue(false);
        const student = new StudentBuilder().build();
        const action = async () => {
          await service.update(student);
        };
        expect(action).rejects.toThrow(NotFoundException);
      });

      test('should call the StudentRepository.save method if the student does exist', async () => {
        mockStudentRepository.existByLrn.mockResolvedValue(true);
        const student = new StudentBuilder().build();
        await service.update(student);
        expect(mockStudentRepository.save).toHaveBeenCalledWith(student);
      });
    });
  });
});
