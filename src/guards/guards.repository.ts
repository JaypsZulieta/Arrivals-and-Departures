import { Guard, GuardBuilder } from './guards.entity';
import { Sex } from '../people/person.entity';
import { Guard as GuardData, Person as PersonData } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export abstract class GuardsRepository {
  abstract countAdmins(): Promise<number>;
  abstract hasAdmin(): Promise<boolean>;
  abstract save(guard: Guard): Promise<Guard>;
  abstract findById(id: string): Promise<Guard>;
  abstract findByEmail(email: string): Promise<Guard>;
  abstract existByEmail(email: string): Promise<boolean>;
  abstract existById(id: string): Promise<boolean>;
  abstract delete(guard: Guard): Promise<void>;
}

export class PrismaGuardRepository implements GuardsRepository {
  private prismService: PrismaService;

  public constructor(prismService: PrismaService) {
    this.prismService = prismService;
  }

  public async countAdmins(): Promise<number> {
    return await this.prismService.guard.count({ where: { admin: true } });
  }

  public async hasAdmin(): Promise<boolean> {
    return (await this.countAdmins()) > 0;
  }

  public async save(guard: Guard): Promise<Guard> {
    if (await this.existById(guard.getId())) {
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
        email: guard.getEmail(),
        password: guard.getPassword(),
        admin: guard.isAdmin(),
        disabled: guard.isDisabled(),
        personId: personData.id,
      },
    });
    return this.buildGuard(guardData, personData);
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
    if (personData.sex == 'female') guardEntity.setSex(Sex.FEMALE);
    else guardEntity.setSex(Sex.MALE);
    return guardEntity;
  }
}
