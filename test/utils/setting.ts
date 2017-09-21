import {} from "jest";
import * as supertest from "supertest";
import * as mongoose from "mongoose";

import { app, server } from "../../src/server";
import * as todo from "../../src/controllers/todo";
import Todo from "../../src/models/Todo";

export let request : supertest.SuperTest < supertest.Test >;
export const cleanUp = async() => {
    const docs = await Todo.find();
    docs.forEach(item => {
        Todo.findByIdAndRemove(item._id, (err, res) => {
            if (err) {
                throw err;
            }
            return "removed";
        });
    });
};
export const registData = (data : Array < {
    _id: string,
    userid: string,
    title: string,
    body: string
} >) : Array < Promise < {
    _id: string,
    userid: string,
    title: string,
    body: string
} > > => {
    const ret = data.map(async(item) => {
        item["_id"] = await(new Todo(item))
            .save({validateBeforeSave : false})
            .then(rec => {
                return rec
                    ._id
                    .toHexString();
            });
        return item;
    });
    return ret;
};

beforeAll(() => {
    request || (request = supertest(app));
    mongoose.connect("mongodb://localhost:27017/todolist", {
        useMongoClient: true,
        promiseLibrary: global.Promise
    });
});
afterAll(() => {
    server.close();
    cleanUp();
});
