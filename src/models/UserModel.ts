import { query } from "../db";
import { User } from "../interfaces/User";

export const create = async (user: User) => {

    const queryText = 'INSERT INTO users (\
    first_name, \
    last_name, \
    email, \
    password, \
    password_create_date, \
    country, \
    date_of_birth, \
    account_status, \
    account_create_date, \
    email_validation, \
    gender) \
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *'

    const { rows } = await query(queryText, [
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.passwordCreateDate,
        user.country,
        user.dateOfBirth,
        user.accountStatus,
        user.accountCreateDate,
        user.emailValidation,
        user.gender
    ])

    const res: User = recursiveToCamel(rows[0])
    return res;

}

export const getById = async (id: number) => {
    const { rows } = await query('SELECT * FROM users WHERE id=$1', [id])

    if (!rows[0]) {
        return undefined
    }

    const user: User = recursiveToCamel(rows[0]);
    return user
}

export const getAll = async () => {
    const { rows } = await query('SELECT * FROM users', []);
    return rows.map(x => recursiveToCamel(x) as User);
}

export const getByEmail = async (email: string) => {
    const {rows} = await query('SELECT * FROM users WHERE email = $1', [email]);

    if(!rows[0]) return undefined;

    const user = recursiveToCamel(rows[0]) as User;
    return user;
}

export const deleteById = async (id: number) => {
    await query('DELETE FROM users WHERE id=$1', [id]);
    return
}





const recursiveToCamel = (item: any): any => {
    if (Array.isArray(item)) {
        return item.map(el => recursiveToCamel(el));
    } else if (typeof item === 'function' || item !== Object(item)) {
        return item;
    }
    return Object.fromEntries(
        Object.entries(item).map(([key, value]) => [
            key.replace(/([-_][a-z])/gi, c => c.toUpperCase().replace(/[-_]/g, '')),
            recursiveToCamel(value),
        ]),
    );
};
