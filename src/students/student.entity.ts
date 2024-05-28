import { Person, Sex } from '../people/person.entity';

type StudentConstructorArguments = {
  learnerReferenceNumber: string;
  section: string;
  gradeLevel: 'G11' | 'G12';
  strand: string;
  track: string;
  guardianPhoneNumber: string;
  firstname: string;
  middlnemae: string | null;
  lastname: string;
  sex: Sex;
};

export class Student extends Person {
  private learnerReferenceNumber: string;
  private gradeLevel: 'G11' | 'G12';
  private section: string;
  private strand: string;
  private track: string;
  private guardianPhoneNumber: string;

  constructor(constructorArguments: StudentConstructorArguments) {
    super(
      constructorArguments.firstname,
      constructorArguments.middlnemae,
      constructorArguments.lastname,
      constructorArguments.sex,
    );
    this.learnerReferenceNumber = constructorArguments.learnerReferenceNumber;
    this.section = constructorArguments.section;
    this.strand = constructorArguments.strand;
    this.track = constructorArguments.track;
    this.gradeLevel = constructorArguments.gradeLevel;
    this.guardianPhoneNumber = constructorArguments.guardianPhoneNumber;
  }

  public getLearnerReferenceNumber(): string {
    return this.learnerReferenceNumber;
  }

  public getGradeLevel(): 'G11' | 'G12' {
    return this.gradeLevel;
  }

  public getSection(): string {
    return this.section;
  }

  public setSection(section?: string): void {
    if (section) this.section = section;
  }

  public getStrand(): string {
    return this.strand;
  }

  public getTrack(): string {
    return this.track;
  }

  public getGuardianPhoneNumber(): string {
    return this.guardianPhoneNumber;
  }

  public setGuardianPhoneNumber(phoneNumber?: string): void {
    if (phoneNumber) this.guardianPhoneNumber = phoneNumber;
  }
}
