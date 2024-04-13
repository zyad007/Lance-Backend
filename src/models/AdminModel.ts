import { query } from "../db";
import { Admin } from "../interfaces/Admin";
import { User } from "../interfaces/User";

export const create = async (admin: Admin) => {

    const queryText = 'INSERT INTO admins (\
    first_name, \
    last_name, \
    email, \
    password, \
    password_create_date, \
    account_status, \
    account_create_date) \
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'

    const { rows } = await query(queryText, [
        admin.firstName,
        admin.lastName,
        admin.email,
        admin.password,
        admin.accountStatus
    ])

    const res: Admin = recursiveToCamel(rows[0])
    return res;

}

export const getById = async (id: number) => {
    const { rows } = await query('SELECT * FROM admins WHERE id=$1', [id])

    if (!rows[0]) {
        return undefined
    }

    const admin: Admin = recursiveToCamel(rows[0]);
    return admin
}

export const getAll = async () => {
    const { rows } = await query('SELECT * FROM admins', []);
    return rows.map(x => recursiveToCamel(x) as Admin);
}

export const getByEmail = async (email: string) => {
    const { rows } = await query('SELECT * FROM admins WHERE email = $1', [email]);

    if (!rows[0]) return undefined;

    const user = recursiveToCamel(rows[0]) as Admin;
    return user;
}

export const deleteById = async (id: number) => {
    await query('DELETE FROM admins WHERE id=$1', [id]);
    return
}


export const updateById = async (id: number, newProps: any) => {

    const querys: string[] = [];
    const values: any[] = [];

    let i = 2;
    for (const [key, value] of Object.entries(newProps)) {
        querys.push(camleToSnake(key) + '=' + '$' + i);
        values.push(value);
        i++;
    }

    console.log(querys);

    const queryText = `UPDATE admins SET ${querys.join(',')} WHERE id = $1 RETURNING *`

    const { rows } = await query(queryText, [id, ...values]);

    const admin: Admin = recursiveToCamel(rows[0])
    return admin;
}

export const getOne = async (props: any) => {
    const querys: string[] = [];
    const values: any[] = [];

    let i = 1;
    for (const [key, value] of Object.entries(props)) {
        querys.push(camleToSnake(key) + '=' + '$' + i );
        values.push(value);
        i++;
    }

    const queryText = `SELECT * FROM admins WHERE ${querys.join(' AND ')}`;

    const { rows } = await query(queryText, [...values]);

    const admin: Admin = recursiveToCamel(rows[0])
    return admin;
}

export const getMany = async (props: any) => {
    const querys: string[] = [];
    const values: any[] = [];

    let i = 1;
    for (const [key, value] of Object.entries(props)) {
        querys.push(camleToSnake(key) + '=' + '$' + i );
        values.push(value);
    }

    const queryText = `SELECT * FROM admins WHERE ${querys.join(' AND ')}`;

    const { rows } = await query(queryText, [...values]);

    return rows.map(x => recursiveToCamel(x) as Admin);
}


//////////////////////////////////////////////
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

const camleToSnake = (str: string) => str.split(/(?=[A-Z])/).join('_').toLowerCase();