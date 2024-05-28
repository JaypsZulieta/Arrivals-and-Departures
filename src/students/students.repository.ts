import { PaginatedContent, PaginationOptions } from '../pagination';
import { Student } from './student.entity';

export abstract class StudentRepository {
  abstract save(student: Student): Promise<Student>;
  abstract findByLrn(lrn: string): Promise<Student>;
  abstract findAll(options: PaginationOptions): Promise<PaginatedContent<Student>>;
  abstract existByLrn(lrn: string): Promise<boolean>;
  abstract count(): Promise<number>;
  abstract delete(student: Student): Promise<Student>;
}
