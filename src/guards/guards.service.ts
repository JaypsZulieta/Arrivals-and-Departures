import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Guard } from './guards.entity';
import { Quidquid } from 'quidquid-picker';
import { Sex } from '../people/person.entity';
import { GuardsRepository } from './guards.repository';

export abstract class GuardsService {
  abstract register(guard: Guard): Promise<Guard>;
  abstract findById(id: string): Promise<Guard>;
  abstract findByEmail(email: string): Promise<Guard>;
  abstract delete(guard: Guard): Promise<void>;
  abstract update(data: Quidquid, id: string): Promise<Guard>;
  abstract hasAdmin(): Promise<boolean>;
}

@Injectable()
export class StandardGuardService extends GuardsService {
  private guardsRepository: GuardsRepository;

  constructor(guardsRepository: GuardsRepository) {
    super();
    this.guardsRepository = guardsRepository;
  }

  async hasAdmin(): Promise<boolean> {
    return await this.guardsRepository.hasAdmin();
  }

  async register(guard: Guard): Promise<Guard> {
    if (await this.guardsRepository.existById(guard.getId()))
      throw new ConflictException(`Guard ${guard.getId()} already exists`);
    if (await this.guardsRepository.existByEmail(guard.getEmail()))
      throw new ConflictException(`The email '${guard.getEmail()} is already taken'`);
    return this.guardsRepository.save(guard);
  }

  async findById(id: string): Promise<Guard> {
    if (!(await this.guardsRepository.existById(id)))
      throw new NotFoundException(`guard with ${id} does not exist`);
    return await this.guardsRepository.findById(id);
  }

  async findByEmail(email: string): Promise<Guard> {
    if (!(await this.guardsRepository.existByEmail(email)))
      throw new NotFoundException(`guard with email ${email} does not exist`);
    return await this.guardsRepository.findByEmail(email);
  }

  async update(data: Quidquid, id: string): Promise<Guard> {
    const firstname = await data.pickStringOptional('firstname');
    const middlename = await data.pickStringOptional('middlename');
    const lastname = await data.pickStringOptional('lastname');
    const sex = await data.pickStringOptional('sex');
    const email = await data.pickStringOptional('email');
    const password = await data.pickStringOptional('password');
    const isAdmin = await data.pickBooleanOptional('isAdmin');
    const isDisabled = await data.pickBooleanOptional('isDisabled');

    const doesNotExistById = !(await this.guardsRepository.existById(id));
    const doesNotExistByEmail =
      email && !(await this.guardsRepository.existByEmail(email));

    if (doesNotExistById)
      throw new NotFoundException(`Guard with id ${id} does not exist`);
    const guard = await this.findById(id);

    if (doesNotExistByEmail && guard.getEmail() != email)
      throw new ConflictException(`The email ${email} is already taken`);
    guard.setFirstname(firstname);
    guard.setMiddlename(middlename);
    guard.setLastname(lastname);
    if (sex?.toLowerCase() == Sex.MALE.toString().toLowerCase()) guard.setSex(Sex.MALE);
    else guard.setSex(Sex.FEMALE);
    guard.setEmail(email);
    guard.setPassword(password);
    guard.setAdminStatus(isAdmin);
    guard.setDisabledStatus(isDisabled);
    return this.guardsRepository.save(guard);
  }

  async delete(guard: Guard): Promise<void> {
    if (!(await this.guardsRepository.existById(guard.getId())))
      throw new NotFoundException(`guard with id ${guard.getId()} does not exist `);
    await this.guardsRepository.delete(guard);
  }
}
