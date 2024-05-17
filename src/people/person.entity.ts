import { ApiProperty } from '@nestjs/swagger';

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
}

export abstract class Person {
  @ApiProperty({
    type: String,
  })
  private firstname: string;

  private middlename: string | null;

  @ApiProperty()
  private lastname: string;

  @ApiProperty({
    enum: ['male', 'female'],
  })
  private sex: Sex;

  private avatarURL: string = 'https://robohash.org/user';
  private creationDate: Date = new Date();

  constructor(
    firstname: string,
    middlename: string | null,
    lastname: string,
    sex: Sex,
  ) {
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.sex = sex;
  }

  public getFirstname(): string {
    return this.firstname;
  }

  public setFirstname(firstname?: string): void {
    if (firstname) this.firstname = firstname;
  }

  public getMiddlename(): string | null {
    return this.middlename;
  }

  public setMiddlename(middlename?: string | null): void {
    if (middlename) this.middlename = middlename;
  }

  public getLastname(): string {
    return this.lastname;
  }

  public setLastname(lastname?: string): void {
    if (lastname) this.lastname = lastname;
  }

  public getSex(): string {
    return this.sex.toString();
  }

  public setSex(sex?: Sex): void {
    if (sex) this.sex = sex;
  }

  public getAvatarURL(): string {
    return this.avatarURL;
  }

  public setAvatarURL(avatarURL?: string): void {
    if (avatarURL) this.avatarURL = avatarURL;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }
}
