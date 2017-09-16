import {} from "jest";
import * as supertest from "supertest";
import * as mongodb from "mongodb";
import * as mongoose from "mongoose";

import * as app from "../src/server";
import * as todo from "../src/controllers/todo";
import Todo from "../src/models/Todo";

let request : supertest.SuperTest < supertest.Test >;
const mongourl = "mongodb://localhost:27017/todolist";
// tslint:disable-next-line:prefer-const
let testData : any = [
    {
        userid: "father",
        title: "朝タスク",
        body: "みんなを起こす、洗濯機回す、ごはん作る、洗濯物干す、食器洗う"
    }, {
        userid: "father",
        title: "朝ごはんメニュー",
        body: "白米、味噌汁、冷奴"
    }, {
        userid: "mother",
        title: "朝タスク",
        body: "ふとんを片付ける、掃除する、出勤準備"
    }, {
        userid: "mother",
        title: "出勤準備",
        body: "洗顔、化粧"
    }, {
        userid: "son",
        title: "朝タスク",
        body: "顔洗う、学校の準備"
    }
];

describe("integration test", async() => {
    beforeAll(() => {
        request = supertest(app);
        // テストデータ登録
        mongodb
            .MongoClient
            .connect(mongourl, async(err, db) => {
                const docs = await Todo.find();
                docs.forEach(item => {
                    Todo.findByIdAndRemove(item._id, (err, res) => {
                        if (err) {
                            throw err;
                        }
                        return "removed";
                    });
                });
                testData.forEach(item => {
                    (new Todo(item))
                        .save()
                        .then(rec => {
                            item["_id"] = rec
                                ._id
                                .toHexString();
                        });
                });
                db.close();
            });
    });
    it("root /:userid/", async(done) => {
        const res = await request.get("/father/");
        const todoData = testData.filter(data => {
            return data.userid === "father";
        });
        expect(JSON.parse(res.text)).toMatchObject(todoData);
        done();
    });
    it("search /:userid/search", async(done) => {
        const res = await request.get(encodeURI("/mother/search/準備"));
        const todoData = testData.filter(data => {
            return data.userid === "mother" && data.title === "出勤準備";
        });
        expect(JSON.parse(res.text)).toMatchObject(todoData);
        done();
    });
    it("add /:userid/add", async(done) => {
        const res = await request
            .post("/mother/add")
            .type("form")
            .send({title: "TODO登録テスト", body: "テストで登録"});
        const todoData = JSON.parse(res.text);
        expect(todoData.title).toEqual("TODO登録テスト");
        expect(todoData.body).toEqual("テストで登録");
        done();
    });
    it("update /:userid/update", async(done) => {
        const res = await request
            .post("/mother/update")
            .type("form")
            .send({_id: testData[2]._id, title: "TODO更新テスト", body: "テストで更新"});
        const todoData = JSON.parse(res.text);
        expect(todoData._id).toBe(testData[2]._id);
        expect(todoData.title).toBe("TODO更新テスト");
        expect(todoData.body).toBe("テストで更新");
        done();
    });
    it("destroy /:userid/destroy/:id", async(done) => {
        const res = await request
            .post(`/father/destroy/${testData[4]._id}`)
            .type("form")
            .send({});
        expect(res.text).toBe("end");
        done();
    });
});
