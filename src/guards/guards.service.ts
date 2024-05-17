import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Guard } from './guards.entity';

export abstract class GuardsService {
  abstract register(guard: Guard): Promise<Guard>;
  abstract findById(id: string): Promise<Guard>;
  abstract findByEmail(email: string): Promise<Guard>;
  abstract delete(guard: Guard): Promise<void>;
}

@Injectable()
export class StandardGuardService extends GuardsService {
  private guardsRegistered: Guard[] = [];

  async register(guard: Guard): Promise<Guard> {
    if (await this.existByEmail(guard.getEmail()))
      throw new ConflictException(
        `The email '${guard.getEmail()} is already taken'`,
      );
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
    const existingGuard = this.guardsRegistered.find(
      (guard) => guard.getId() == id,
    );
    if (!existingGuard)
      throw new NotFoundException(`guard with id ${id} does not exist`);
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
    const existingGuard = this.guardsRegistered.find(
      (guard) => guard.getId() == id,
    );
    return !existingGuard ? false : true;
  }

  async delete(guard: Guard): Promise<void> {
    if (!(await this.existById(guard.getId())))
      throw new NotFoundException(
        `Guard with id ${guard.getId()} does not exist`,
      );
    this.guardsRegistered = this.guardsRegistered.filter(
      (guardInDatabase) => guardInDatabase.getId() != guard.getId(),
    );
  }
}
