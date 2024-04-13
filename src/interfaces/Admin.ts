import Base from "./Base";

export interface Admin extends Base {

    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordCreateData: Date,
    accountStatus: 'ACTIVE' | 'DISABLED',
    accountCreateData: Date
    
}