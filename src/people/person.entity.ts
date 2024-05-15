export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
}

export abstract class Person {
  private firstname: string;
  private middlename: string | null;
  private lastname: string;
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

  public setFirstname(firstname: string): void {
    this.firstname = firstname;
  }

  public getMiddlename(): string | null {
    return this.middlename;
  }

  public setMiddlename(middlename: string | null): void {
    this.middlename = middlename;
  }

  public getLastname(): string {
    return this.lastname;
  }

  public setLastname(lastname: string): void {
    this.lastname = lastname;
  }

  public getSex(): string {
    return this.sex.toString();
  }

  public setSex(sex: Sex): void {
    this.sex = sex;
  }

  public getAvatarURL(): string {
    return this.avatarURL;
  }

  public setAvatarURL(avatarURL: string): void {
    this.avatarURL = avatarURL;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }
}
