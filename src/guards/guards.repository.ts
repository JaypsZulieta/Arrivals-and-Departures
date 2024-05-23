import { Guard, GuardBuilder } from './guards.entity';
import { Sex } from '../people/person.entity';
import { Guard as GuardData, Person as PersonData } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PaginatedContent, PaginationOptions } from 'src/pagination';

export abstract class GuardsRepository {
  abstract countAdmins(): Promise<number>;
  abstract hasAdmin(): Promise<boolean>;
  abstract save(guard: Guard): Promise<Guard>;
  abstract findById(id: string): Promise<Guard>;
  abstract findByEmail(email: string): Promise<Guard>;
  abstract findAll(options?: PaginationOptions): Promise<PaginatedContent<Guard>>;
  abstract existByEmail(email: string): Promise<boolean>;
  abstract existById(id: string): Promise<boolean>;
  abstract delete(guard: Guard): Promise<void>;
}

@Injectable()
export class PrismaGuardRepository implements GuardsRepository {
  private prismService: PrismaService;

  public constructor(prismService: PrismaService) {
    this.prismService = prismService;
  }

  public async countAdmins(): Promise<number> {
    return await this.prismService.guard.count({ where: { admin: true } });
  }

  public async count(): Promise<number> {
    return await this.prismService.guard.count();
  }

  public async hasAdmin(): Promise<boolean> {
    return (await this.countAdmins()) > 0;
  }

  public async save(guard: Guard): Promise<Guard> {
    if (await this.existById(guard.getId())) {
      return await this.updateGuardData(guard);
    }
    return await this.insertGuardData(guard);
  }

  public async findById(id: string): Promise<Guard> {
    const guardData = await this.prismService.guard.findUniqueOrThrow({ where: { id } });
    const personData = await this.prismService.person.findUniqueOrThrow({
      where: { id: guardData.personId },
    });
    return this.buildGuard(guardData, personData);
  }

  public async findByEmail(email: string): Promise<Guard> {
    const guardData = await this.prismService.guard.findUniqueOrThrow({
      where: { email },
    });
    const personData = await this.prismService.person.findUniqueOrThrow({
      where: { id: guardData.personId },
    });
    return this.buildGuard(guardData, personData);
  }

  public async existByEmail(email: string): Promise<boolean> {
    return (await this.prismService.guard.count({ where: { email } })) > 0;
  }

  public async existById(id: string): Promise<boolean> {
    return (await this.prismService.guard.count({ where: { id } })) > 0;
  }

  public async delete(guard: Guard): Promise<void> {
    const guardData = await this.prismService.guard.findUniqueOrThrow({
      where: { id: guard.getId() },
    });
    await this.prismService.person.delete({ where: { id: guardData.personId } });
  }

  public async findAll(
    options?: PaginationOptions | undefined,
  ): Promise<PaginatedContent<Guard>> {
    const currentPage = options?.pageNumber || 1;
    const take = options?.pageSize || 20;
    const skip = (currentPage - 1) * take;
    const totalItems = await this.count();
    const totalPages = Math.ceil(totalItems / take);
    const content: Guard[] = await this.fetchGuardData(take, skip);
    return { totalItems, totalPages, content, currentPage };
  }

  private buildGuard(guardData: GuardData, personData: PersonData): Guard {
    const guardEntity = new GuardBuilder()
      .firstname(personData.firstname)
      .middlename(personData.middlename)
      .lastname(personData.lastname)
      .email(guardData.email)
      .password(guardData.password)
      .build();
    guardEntity.setAvatarURL(personData.avatarURL);
    guardEntity.setId(guardData.id);
    guardEntity.setAdminStatus(guardData.admin);
    guardEntity.setDisabledStatus(guardData.disabled);
    if (personData.sex == 'female') guardEntity.setSex(Sex.FEMALE);
    else guardEntity.setSex(Sex.MALE);
    return guardEntity;
  }

  private async updateGuardData(guard: Guard): Promise<Guard> {
    const guardData = await this.prismService.guard.update({
      data: {
        email: guard.getEmail(),
        password: guard.getPassword(),
        admin: guard.isAdmin(),
        disabled: guard.isDisabled(),
      },
      where: { id: guard.getId() },
    });
    const personData = await this.prismService.person.update({
      data: {
        firstname: guard.getFirstname(),
        middlename: guard.getMiddlename(),
        lastname: guard.getLastname(),
        sex: guard.getSex() as 'female' | 'male',
        avatarURL: guard.getAvatarURL(),
      },
      where: { id: guardData.personId },
    });
    return this.buildGuard(guardData, personData);
  }

  private async insertGuardData(guard: Guard): Promise<Guard> {
    const personData = await this.prismService.person.create({
      data: {
        firstname: guard.getFirstname(),
        middlename: guard.getMiddlename(),
        lastname: guard.getLastname(),
        sex: guard.getSex() as 'male' | 'female',
        avatarURL: guard.getAvatarURL(),
        creationDate: guard.getCreationDate(),
      },
    });
    const guardData = await this.prismService.guard.create({
      data: {
        id: guard.getId(),
        email: guard.getEmail(),
        password: guard.getPassword(),
        admin: guard.isAdmin(),
        disabled: guard.isDisabled(),
        personId: personData.id,
      },
    });
    return this.buildGuard(guardData, personData);
  }

  private async fetchGuardData(take: number, skip: number): Promise<Guard[]> {
    return await Promise.all(
      await this.prismService.guard
        .findMany({
          take,
          skip,
          orderBy: { peson: { creationDate: 'desc' } },
        })
        .then(async (guardData) => {
          return guardData.map(async (guardData) => {
            const personData = await this.prismService.person.findUniqueOrThrow({
              where: { id: guardData.personId },
            });
            return this.buildGuard(guardData, personData);
          });
        }),
    );
  }
}
