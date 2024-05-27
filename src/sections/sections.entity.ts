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
