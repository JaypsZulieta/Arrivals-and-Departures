import Crypto from 'crypto';

type StrandConstructorArguments = {
  id?: string;
  name: string;
  track: string;
  creationDate?: Date;
};

export class Strand {
  private id: string = Crypto.randomUUID();
  private name: string;
  private track: string;
  private creationDate: Date = new Date();

  constructor(constructorArguments: StrandConstructorArguments) {
    if (constructorArguments.id) this.id = constructorArguments.id;
    if (constructorArguments.creationDate)
      this.creationDate = constructorArguments.creationDate;
    this.name = constructorArguments.name;
    this.track = constructorArguments.track;
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
  public setTrackName(name?: string): void {
    if (name) this.track = name;
  }

  public getTrackName(): string {
    return this.track;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }
}

export class StrandBuilder {
  private idToSet?: string;
  private nameToSet: string = 'generic track';
  private trackToSet: string = 'generic strand';
  private creationDateToSet?: Date;

  public id(id: string): StrandBuilder {
    this.idToSet = id;
    return this;
  }

  public name(name: string): StrandBuilder {
    this.nameToSet = name;
    return this;
  }

  public track(track: string): StrandBuilder {
    this.trackToSet = track;
    return this;
  }

  public creationDate(date: Date): StrandBuilder {
    this.creationDateToSet = date;
    return this;
  }

  public build(): Strand {
    return new Strand({
      id: this.idToSet,
      name: this.nameToSet,
      track: this.trackToSet,
      creationDate: this.creationDateToSet,
    });
  }
}
