import { query } from "../db";
import { Product } from "../interfaces/Product";

export const create = async (product: Product) => {

    const queryText = 'INSERT INTO products ( \
    description, \
    prod_status \
    ) VALUES ($1,$2) RETURNING *'

    const { rows } = await query(queryText, [
        product.description,
        product.prodStatus
    ])

    const res: Product = recursiveToCamel(rows[0])
    return res;

}

export const getById = async (id: number) => {
    const { rows } = await query('SELECT * FROM products WHERE id=$1', [id])

    if (!rows[0]) {
        return undefined
    }

    const product: Product = recursiveToCamel(rows[0]);
    return product
}

export const getAll = async () => {
    const { rows } = await query('SELECT * FROM products', []);
    return rows.map(x => recursiveToCamel(x) as Product);
}

export const deleteById = async (id: number) => {
    await query('DELETE FROM products WHERE id=$1', [id]);
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

    const queryText = `UPDATE products SET ${querys.join(',')} WHERE id = $1 RETURNING *`

    const { rows } = await query(queryText, [id, ...values]);

    const product: Product = recursiveToCamel(rows[0])
    return product;
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

    const queryText = `SELECT * FROM products WHERE ${querys.join(' AND ')}`;

    const { rows } = await query(queryText, [...values]);

    const product: Product = recursiveToCamel(rows[0])
    return product;
}

export const getMany = async (props: any) => {
    const querys: string[] = [];
    const values: any[] = [];

    let i = 1;
    for (const [key, value] of Object.entries(props)) {
        querys.push(camleToSnake(key) + '=' + '$' + i );
        values.push(value);
    }

    const queryText = `SELECT * FROM products WHERE ${querys.join(' AND ')}`;

    const { rows } = await query(queryText, [...values]);

    return rows.map(x => recursiveToCamel(x) as Product);
}


const ProductModel = {
    create,
    getById,
    getAll,
    getOne,
    getMany,
    updateById,
    deleteById
}

export default ProductModel;

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