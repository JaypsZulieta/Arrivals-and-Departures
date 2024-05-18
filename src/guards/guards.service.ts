import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Guard } from './guards.entity';
import { Quidquid } from 'quidquid-picker';
import { Sex } from '../people/person.entity';

export abstract class GuardsService {
  abstract register(guard: Guard): Promise<Guard>;
  abstract findById(id: string): Promise<Guard>;
  abstract findByEmail(email: string): Promise<Guard>;
  abstract delete(guard: Guard): Promise<void>;
  abstract update(data: Quidquid, id: string): Promise<Guard>;
}

@Injectable()
export class StandardGuardService extends GuardsService {
  private guardsRegistered: Guard[] = [];

  async register(guard: Guard): Promise<Guard> {
    if (await this.existByEmail(guard.getEmail()))
      throw new ConflictException(`The email '${guard.getEmail()} is already taken'`);
    this.guardsRegistered.push(guard);
    return guard;
  }

  private async existByEmail(email: string): Promise<boolean> {
    const existingGuard = this.guardsRegistered.find(
      (guard) => guard.getEmail() == email,
    );
    return !existingGuard ? false : true;
  }

  async findById(id: string): Promise<Guard> {
    const existingGuard = this.guardsRegistered.find((guard) => guard.getId() == id);
    if (!existingGuard) throw new NotFoundException(`guard with id ${id} does not exist`);
    return existingGuard;
  }

  async findByEmail(email: string): Promise<Guard> {
    const existingGuard = this.guardsRegistered.find(
      (guard) => guard.getEmail() == email,
    );
    if (!existingGuard)
      throw new NotFoundException(`Guard with email ${email} does not exist`);
    return existingGuard;
  }

  private async existById(id: string): Promise<boolean> {
    const existingGuard = this.guardsRegistered.find((guard) => guard.getId() == id);
    return !existingGuard ? false : true;
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
    if (!(await this.existById(id)))
      throw new NotFoundException(`Guard with id ${id} does not exist`);
    const guard = await this.findById(id);
    if (email && (await this.existByEmail(email)) && guard.getEmail() != email)
      throw new ConflictException(`The email ${email} is already taken`);
    guard.setFirstname(firstname);
    guard.setMiddlename(middlename);
    guard.setLastname(lastname);
    if (sex?.toLocaleLowerCase() == Sex.MALE.toString().toLowerCase())
      guard.setSex(Sex.MALE);
    else guard.setSex(Sex.FEMALE);
    guard.setEmail(email);
    guard.setPassword(password);
    guard.setAdminStatus(isAdmin);
    guard.setDisabledStatus(isDisabled);
    return guard;
  }

  async delete(guard: Guard): Promise<void> {
    if (!(await this.existById(guard.getId())))
      throw new NotFoundException(`Guard with id ${guard.getId()} does not exist`);
    this.guardsRegistered = this.guardsRegistered.filter(
      (guardInDatabase) => guardInDatabase.getId() != guard.getId(),
    );
  }
}
