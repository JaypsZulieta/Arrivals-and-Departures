import { Module, Provider } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StandardStudentService, StudentService } from './students.service';
import { PrismaStudentRepository, StudentRepository } from './students.repository';
import { AuthModule, permissionsFilterProvider } from '../auth/auth.module';
import { SectionsModule } from '../sections/sections.module';
import { StrandsModule } from '../strands/strands.module';
import { TracksModule } from '../tracks/tracks.module';
import { UsersModule } from '../users/users.module';

export const studentServiceProvider = {
  provide: StudentService,
  useClass: StandardStudentService,
} satisfies Provider;

export const studentRepositoryProvider = {
  provide: StudentRepository,
  useClass: PrismaStudentRepository,
} satisfies Provider;

@Module({
  controllers: [StudentsController],
  providers: [
    studentRepositoryProvider,
    studentServiceProvider,
    permissionsFilterProvider,
  ],
  imports: [SectionsModule, StrandsModule, TracksModule, AuthModule, UsersModule],
})
export class StudentsModule {}
