import { PaginatedContent, PaginationOptions } from 'src/pagination';
import { Student } from './student.entity';

export abstract class StudentService {
  abstract create(student: Student): Promise<Student>;
  abstract findByLrn(lrn: string): Promise<Student>;
  abstract existByLrn(lrn: string): Promise<boolean>;
  abstract count(): Promise<number>;
  abstract findAll(options: PaginationOptions): Promise<PaginatedContent<Student>>;
  abstract update(student: Student): Promise<Student>;
  abstract delete(lrn: string): Promise<void>;
}
