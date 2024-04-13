import Base from "./Base";

export interface User extends Base {

    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordCreateDate: Date,
    country: string,
    dateOfBirth: Date,
    accountStatus: 'ACTIVE' | 'DISABLED',
    accountCreateDate: Date,
    emailValidation: boolean
    gender: 'MALE' | 'FEMALE'

}