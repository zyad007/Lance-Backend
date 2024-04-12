import { query } from "../db";
import { Test } from "../interfaces/Test";
import { BaseModel } from "./BaseModel";

export class TestModel extends BaseModel<Test, TestModel>('sessions', () => TestModel) implements Test {

    public prop1: number;
    public prop2: number;

    constructor(test: Test) {
        super(test.id);
        Object.assign(this, test)
    }

}
