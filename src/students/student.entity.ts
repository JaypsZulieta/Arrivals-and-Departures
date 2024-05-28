import { Exclude } from 'class-transformer';
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
  @Exclude()
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

export class StudentBuilder {
  private lrnToSet: string = '123456789012';
  private gradeLevelToSet: 'G11' | 'G12' = 'G12';
  private sectionToSet: string = 'EPYC';
  private strandToSet: string = 'Programming';
  private trackToSet: string = 'Technical Vocational and Livelihood Track';
  private guardianPhoneNumberToSet: string = '+6309053861265';
  private firstnameToSet: string = 'John';
  private middlenameToSet: string | null = null;
  private lastnameToSet: string = 'Smith';
  private sexToSet: Sex = Sex.MALE;

  public learnerReferenceNumber(lrn: string): StudentBuilder {
    this.lrnToSet = lrn;
    return this;
  }

  public gradeLevel(level: 'G11' | 'G12'): StudentBuilder {
    this.gradeLevelToSet = level;
    return this;
  }

  public section(section: string): StudentBuilder {
    this.sectionToSet = section;
    return this;
  }

  public strand(strand: string): StudentBuilder {
    this.strandToSet = strand;
    return this;
  }

  public track(track: string): StudentBuilder {
    this.trackToSet = track;
    return this;
  }

  public guardianPhoneNumber(number: string): StudentBuilder {
    this.guardianPhoneNumberToSet = number;
    return this;
  }

  public firstname(firstname: string): StudentBuilder {
    this.firstnameToSet = firstname;
    return this;
  }

  public middlename(middlename: string | null): StudentBuilder {
    this.middlenameToSet = middlename;
    return this;
  }

  public lastname(lastname: string): StudentBuilder {
    this.lastnameToSet = lastname;
    return this;
  }

  public sex(sex: Sex): StudentBuilder {
    this.sexToSet = sex;
    return this;
  }

  public build(): Student {
    return new Student({
      learnerReferenceNumber: this.lrnToSet,
      gradeLevel: this.gradeLevelToSet,
      section: this.sectionToSet,
      strand: this.strandToSet,
      track: this.trackToSet,
      guardianPhoneNumber: this.guardianPhoneNumberToSet,
      firstname: this.firstnameToSet,
      middlnemae: this.middlenameToSet,
      lastname: this.lastnameToSet,
      sex: this.sexToSet,
    });
  }
}
