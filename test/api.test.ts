import {} from 'jest';
import * as supertest from 'supertest';
import * as app from '../src/server';
import * as todo from '../src/controllers/todo';
import * as mongodb from "mongodb";
import * as mongoose from "mongoose";
import Todo from '../src/models/Todo';
import * as assert from 'assert';

let request : supertest.SuperTest < supertest.Test >;
const mongourl = "mongodb://localhost:27017/todolist";
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
    }
]
beforeAll(() => {
    request = supertest(app);
    // テストデータ登録
    mongodb
        .MongoClient
        .connect(mongourl, (err, db) => {
            Todo.find((err, res) => {
                res.forEach(item => {
                    Todo.findByIdAndRemove(item._id, (err, res) => {
                        if (err) 
                            throw err;
                        return 'removed';
                    });
                });
            });
            testData.forEach(item => {
                (new Todo(item))
                    .save()
                    .then(rec => {
                        item["_id"] = rec._id.toHexString();
                    });
            });
            db.close();
        });
});

describe("integration test", () => {
    it("root /:userid/", (done) => {
        request
            .get("/father/")
            .expect(res => {
                assert.equal(JSON.stringify(testData.filter(data => {
                    return data.userid === "father";
                })), res.text);
            })
            .expect(200, done);
    });
    it("search /:userid/search", (done) => {
        request
            .get("/mother/search/準備")
            .expect(res => {
                console.log(res.text);
            })
            .expect(200, done);
    });
    it("add /:userid/add", (done) => {
        request
            .post("/mother/add")
            .type("form")
            .send({title: "TODO登録テスト", body: "テストで登録"})
            .expect(res => {
                console.log(res.text);
            })
            .expect(200, done);
    });
    it("update /:userid/update", (done) => {
        request
            .post("/mother/update")
            .type("form")
            .send({_id: testData[2]._id, title: "TODO更新テスト", body: "テストで更新"})
            .expect(res => {
                console.log(`updateId: ${testData[2]._id}`);
                console.log(JSON.stringify(res));
            })
            .expect(200, done);
    });
    it("destroy /:userid/destroy/:id", (done) => {
        request
            .post(`/father/destroy/${testData[0]._id}`)
            .type("form")
            .send({})
            .expect(res => {
                console.log(`destroyId: ${testData[0]._id}`);
                console.log(JSON.stringify(res));
            })
            .expect(200, done);
    });
});
