import Crypto from 'crypto';
import { Person, Sex } from '../people/person.entity';

export class Guard extends Person {
  private id: string = Crypto.randomUUID();
  private email: string;
  private password: string;
  private admin: boolean;
  private disabled: boolean;

  constructor(
    firstname: string,
    middlename: string | null,
    lastname: string,
    sex: Sex,
    email: string,
    password: string,
  ) {
    super(firstname, middlename, lastname, sex);
    this.email = email;
    this.password = password;
  }

  public getId(): string {
    return this.id;
  }

  public setEmail(email?: string) {
    if (email) this.email = email;
  }

  public getEmail(): string {
    return this.email;
  }

  public setPassword(password?: string) {
    if (password) this.password = password;
  }

  public getPassword(): string {
    return this.password;
  }

  public isAdmin(): boolean {
    return this.admin;
  }

  public setAdminStatus(status?: boolean): void {
    if (status) this.admin = status;
  }

  public isDisabled(): boolean {
    return this.disabled;
  }

  public setDisabledStatus(status?: boolean): void {
    if (status) this.disabled = status;
  }
}

export class GuardBuilder {
  private firstnameToSet: string = 'John';
  private middlenameToSet: string | null = null;
  private lastnameToSet: string = 'Smith';
  private sexToSet: Sex = Sex.MALE;
  private emailToSet: string = 'john.smith@email.com';
  private passwordToSet: string = 'password';

  firstname(firstname: string): GuardBuilder {
    this.firstnameToSet = firstname;
    return this;
  }

  middlename(middlename: string | null): GuardBuilder {
    this.middlenameToSet = middlename;
    return this;
  }

  lastname(lastname: string): GuardBuilder {
    this.lastnameToSet = lastname;
    return this;
  }

  sex(sex: Sex): GuardBuilder {
    this.sexToSet = sex;
    return this;
  }

  email(email: string): GuardBuilder {
    this.emailToSet = email;
    return this;
  }

  password(password: string): GuardBuilder {
    this.passwordToSet = password;
    return this;
  }

  build(): Guard {
    return new Guard(
      this.firstnameToSet,
      this.middlenameToSet,
      this.lastnameToSet,
      this.sexToSet,
      this.emailToSet,
      this.passwordToSet,
    );
  }
}
