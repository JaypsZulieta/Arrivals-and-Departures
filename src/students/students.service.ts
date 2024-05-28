import { PaginatedContent, PaginationOptions } from '../pagination';
import { Student } from './student.entity';
import { StudentRepository } from './students.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

export abstract class StudentService {
  abstract create(student: Student): Promise<Student>;
  abstract findByLrn(lrn: string): Promise<Student>;
  abstract existByLrn(lrn: string): Promise<boolean>;
  abstract count(): Promise<number>;
  abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Student>>;
  abstract update(student: Student): Promise<Student>;
  abstract delete(lrn: string): Promise<void>;
}

@Injectable()
export class StandardStudentService implements StudentService {
  private repository: StudentRepository;

  constructor(repository: StudentRepository) {
    this.repository = repository;
  }

  public async create(student: Student): Promise<Student> {
    const learnerReferenceNumber = student.getLearnerReferenceNumber();
    if (await this.existByLrn(learnerReferenceNumber)) {
      const conflictMessage = `student with lrn '${learnerReferenceNumber}' already exists`;
      throw new ConflictException(conflictMessage);
    }
    return await this.repository.save(student);
  }

  public async findByLrn(lrn: string): Promise<Student> {
    if (!(await this.existByLrn(lrn)))
      throw new NotFoundException(`student with lrn '${lrn}' does not exist`);
    return await this.repository.findByLrn(lrn);
  }

  public async existByLrn(lrn: string): Promise<boolean> {
    return await this.repository.existByLrn(lrn);
  }

  public async count(): Promise<number> {
    return await this.repository.count();
  }

  public async findAll(options?: PaginationOptions): Promise<PaginatedContent<Student>> {
    return await this.repository.findAll(options);
  }

  public async update(student: Student): Promise<Student> {
    const learnerReferenceNumber = student.getLearnerReferenceNumber();
    if (!(await this.existByLrn(learnerReferenceNumber))) {
      const conflictMessage = `student with lrn '${learnerReferenceNumber}' does not exist`;
      throw new NotFoundException(conflictMessage);
    }
    return await this.repository.save(student);
  }

  public async delete(lrn: string): Promise<void> {
    const student = await this.findByLrn(lrn);
    await this.repository.delete(student);
  }
}
