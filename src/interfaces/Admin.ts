import Base from "./Base";

export interface Admin extends Base {

    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordCreateDate: Date,
    accountStatus: 'ACTIVE' | 'DISABLED',
    accountCreateDate: Date,
    resetPasswordToken: string
    
}