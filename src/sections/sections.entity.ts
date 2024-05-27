import Crypto from 'crypto';

type SectionConstructorArguments = {
  id?: string;
  name: string;
  strand: string;
  track: string;
  creationDate?: Date;
};

export class Section {
  private id: string = Crypto.randomUUID();
  private name: string;
  private strand: string;
  private track: string;
  private creationDate: Date = new Date();

  constructor(constructoArguments: SectionConstructorArguments) {
    if (constructoArguments.id) this.id = constructoArguments.id;
    if (constructoArguments.creationDate)
      this.creationDate = constructoArguments.creationDate;
    this.strand = constructoArguments.strand;
    this.track = constructoArguments.track;
    this.name = constructoArguments.name;
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

  public setStrand(strand?: string): void {
    if (strand) this.strand = strand;
  }

  public getStrand(): string {
    return this.strand;
  }

  public getTrack(): string {
    return this.track;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }
}

export class SectionBuilder {
  private idToSet?: string;
  private nameToSet: string = 'Epyc';
  private strandToSet: string = 'Programming';
  private trackToSet: string = 'Technical Vocational and Livelihood Track';
  private creationDateToSet?: Date;

  public id(id: string): SectionBuilder {
    this.idToSet = id;
    return this;
  }

  public name(name: string): SectionBuilder {
    this.nameToSet = name;
    return this;
  }

  public strand(strand: string): SectionBuilder {
    this.strandToSet = strand;
    return this;
  }

  public track(track: string): SectionBuilder {
    this.trackToSet = track;
    return this;
  }

  public creationDate(date: Date): SectionBuilder {
    this.creationDateToSet = date;
    return this;
  }

  public build(): Section {
    return new Section({
      id: this.idToSet,
      name: this.nameToSet,
      strand: this.strandToSet,
      track: this.trackToSet,
      creationDate: this.creationDateToSet,
    });
  }
}
