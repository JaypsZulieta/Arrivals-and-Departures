import Crypto from 'crypto';
import { UserDetails } from '../users/users.service';
import { GuardBuilder } from '../guards/guards.entity';

type TrackConstructorArguments = {
  id?: string;
  name: string;
  creationDate?: Date;
  createdBy: UserDetails;
};

export class Track {
  private id: string = Crypto.randomUUID();
  private name: string;
  private creationDate: Date = new Date();
  private createdBy: UserDetails;

  constructor(constructorArguments: TrackConstructorArguments) {
    if (constructorArguments.id) this.id = constructorArguments.id;
    if (constructorArguments.creationDate)
      this.creationDate = constructorArguments.creationDate;
    this.createdBy = constructorArguments.createdBy;
    this.name = constructorArguments.name;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public getCreator(): UserDetails {
    return this.createdBy;
  }
}

export class TrackBuilder {
  private idToSet?: string;
  private nameToSet: string = 'EPYC';
  private creationDateToSet?: Date;
  private creatorToSet: UserDetails = new GuardBuilder().build();

  public id(id: string): TrackBuilder {
    this.idToSet = id;
    return this;
  }

  public name(name: string): TrackBuilder {
    this.nameToSet = name;
    return this;
  }

  public creationDate(date: Date): TrackBuilder {
    this.creationDateToSet = date;
    return this;
  }

  public creator(creator: UserDetails): TrackBuilder {
    this.creatorToSet = creator;
    return this;
  }

  public build(): Track {
    return new Track({
      id: this.idToSet,
      name: this.nameToSet,
      creationDate: this.creationDateToSet,
      createdBy: this.creatorToSet,
    });
  }
}
