import { query } from "../db";
import Base from "../interfaces/Base";

type ChildConstructor<T, K> = new (x: T) => K;

export function BaseModel<T extends Base, K>(TABLE_NAME: string, ChildClass: any) {

    abstract class BaseModel {

        constructor(public id: number) {

        }

        public async save(): Promise<void> {
            const [keys, values] = BaseModel.extractKeysAndValues(structuredClone(this));

            const keysSeq = keys.map((x, index) => `${x}=$${index + 2}`).join(',')

            const queryText = `UPDATE ${TABLE_NAME} SET ${keysSeq}  WHERE id=$1 RETURNING *`

            const { rows } = await query(queryText, [this.id, ...values]);

            const modelDb: T = rows[0];

            BaseModel.objSnakeToCamle(modelDb);

            Object.assign(this, modelDb);

            return;
        }

        public async delete(): Promise<boolean> {

            const { rows } = await query(`DELETE FROM ${TABLE_NAME} WHERE id=$1 IS TRUE RETURNING *`, [this.id]);

            for (const key in this) {
                if(key === 'id') {
                    this['id'] = 0;
                    continue;
                }
                delete this[key];
            }

            return !!rows.length;

        }

        public static async getById(id: number): Promise<K | undefined> {
            const { rows } = await query(`SELECT * FROM ${TABLE_NAME} WHERE id=$1`, [id]);

            if (!rows.length) return undefined;

            const modelDb: T = rows[0];

            this.objSnakeToCamle(modelDb);

            return new (ChildClass() as ChildConstructor<T, K>)(modelDb);
        }

        public static async getAll(): Promise<K[] | undefined> {
            const { rows } = await query(`SELECT * FROM ${TABLE_NAME}`, []);

            if (!rows.length) return undefined;

            const modelsDb: T[] = rows;

            modelsDb.forEach(x => {
                this.objSnakeToCamle(x);
            })

            return modelsDb.map(x => new (ChildClass() as ChildConstructor<T, K>)(x));
        }

        public static async save(entity: T): Promise<K | undefined> {
            const updateFlag = entity.id !== 0;
            let rowDb: any[];
            const [keys, values] = this.extractKeysAndValues(entity);

            if (updateFlag) {

                const keysSeq = keys.map((x, index) => `${x}=$${index + 2}`).join(',')

                const queryText = `UPDATE ${TABLE_NAME} SET ${keysSeq}  WHERE id=$1 RETURNING *`
                const { rows } = await query(queryText, [entity.id, ...values]);
                rowDb = rows;
            } else {

                const keySeq = this.exctractKeySeq(keys);

                const { rows } = await query(`INSERT INTO ${TABLE_NAME} (${keys.join(',')}) VALUES (${keySeq}) RETURNING *`, values)
                rowDb = rows
            }

            if (!rowDb.length) return undefined;

            const modelDb: T = rowDb[0];

            this.objSnakeToCamle(modelDb);

            return new (ChildClass() as ChildConstructor<T, K>)(modelDb);
        }

        public static async deleteById(id: number): Promise<boolean> {
            const { rows } = await query(`DELETE FROM ${TABLE_NAME} WHERE id=$1 IS TRUE RETURNING *`, [id]);

            return !!rows.length;
        }

        private static extractKeysAndValues(entity: any): [string[], any[]] {
            let idIndex: number;

            let values = Object.values(entity);

            // Filter Id from keys any convert to snake_case
            let keysSnakeCase = Object.keys(entity)
                .map(x => x.split(/(?=[A-Z])/).join('_').toLowerCase())
                .filter((x, index) => {
                    if (x === 'id') idIndex = index;

                    return x !== 'id'
                });

            // Filter Id from values
            values.splice(idIndex!, 1);


            return [keysSnakeCase, values];
        }

        private static exctractKeySeq(keys: string[]): string {
            return keys.map((x, index) => `$${index + 1}`).join(',');
        }

        private static objSnakeToCamle(obj: any): void {
            Object.keys(obj).forEach(x => {
                if(x === 'id') return;
                if(!x.includes('_') || !x.includes('-')) return;
                const newX = x.toLowerCase().replace(/([-_][a-z])/ig, group =>
                    group
                        .toUpperCase()
                        .replace('-', '')
                        .replace('_', ''))
                obj[newX] = obj[x];
                delete obj[x]; 
            });
        }

    }

    return BaseModel;
}