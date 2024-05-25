import Crypto from 'crypto';

type TrackConstructorArguments = {
  id?: string;
  name: string;
  creationDate?: Date;
};

export class Track {
  private id: string = Crypto.randomUUID();
  private name: string;
  private creationDate: Date = new Date();

  constructor(constructorArguments: TrackConstructorArguments) {
    if (constructorArguments.id) this.id = constructorArguments.id;
    if (constructorArguments.creationDate)
      this.creationDate = constructorArguments.creationDate;
    this.name = constructorArguments.name;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name?: string): void {
    if (name) this.name = name;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }
}

export class TrackBuilder {
  private idToSet?: string;
  private nameToSet: string = 'EPYC';
  private creationDateToSet?: Date;

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

  public build(): Track {
    return new Track({
      id: this.idToSet,
      name: this.nameToSet,
      creationDate: this.creationDateToSet,
    });
  }
}
