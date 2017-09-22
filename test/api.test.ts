import {} from "jest";
import * as supertest from "supertest";
import * as mongoose from "mongoose";

import { app, server } from "../src/server";
import Todo from "../src/models/Todo";

let request : supertest.SuperTest < supertest.Test >;
const cleanUp = async() => {
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
const registData = (data : Array < {
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
            .save({validateBeforeSave: false})
            .then(rec => {
                return rec
                    ._id
                    .toHexString();
            });
        return item;
    });
    return ret;
};

describe("api test", () => {
    beforeAll(async() => {
        request || (request = supertest(app));
        mongoose.connect("mongodb://localhost:27017/todolist", {
            useMongoClient: true,
            promiseLibrary: global.Promise
        });
    });
    afterAll(() => {
        server.close();
    });
    describe("登録API test", () => {
        beforeAll(async() => {
            await cleanUp();
        });
        it("パラメータ[title,body]のパターン", async(done) => {
            const res = await request
                .post("/add_1/")
                .type("form")
                .send({title: "買い物メモ", body: "ネギ、豆腐、納豆"});
            const todoData = JSON.parse(res.text);
            expect(res.status).toBe(201);
            expect(todoData.title).toBe("買い物メモ");
            expect(todoData.body).toBe("ネギ、豆腐、納豆");
            done();
        });
        it("パラメータ[title]のパターン", async(done) => {
            const res = await request
                .post("/add_1/")
                .type("form")
                .send({title: "買い食い禁止！"});
            const todoData = JSON.parse(res.text);
            expect(res.status).toBe(201);
            expect(todoData.title).toBe("買い食い禁止！");
            expect(todoData.body).toBe("");
            done();
        });
        it("パラメータ[body]のパターン", async(done) => {
            const res = await request
                .post("/add_1/")
                .type("form")
                .send({body: "帰ったらお風呂を沸かす"});
            const todoData = JSON.parse(res.text);
            expect(res.status).toBe(201);
            expect(todoData.title).toBe("");
            expect(todoData.body).toBe("帰ったらお風呂を沸かす");
            done();
        });
        it("BODYにデータが無いパターン", async(done) => {
            const res = await request
                .post("/add_1/")
                .type("form")
                .send({});
            const todoData = JSON.parse(res.text);
            expect(res.status).toBe(201);
            expect(todoData.title).toBe("");
            expect(todoData.body).toBe("");
            done();
        });
    });
    describe("ルートAPI test", () => {
        const testData : any = [
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
        beforeAll(async() => {
            await cleanUp();
            await registData(testData);
        });
        it("root [userid=father]", async(done) => {
            const res = await request.get("/father/");
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text)).toMatchObject(testData.filter(data => {
                return data.userid === "father";
            }));
            done();
        });
        it("root [userid=mother]", async(done) => {
            const res = await request.get("/mother/");
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text)).toMatchObject(testData.filter(data => {
                return data.userid === "mother";
            }));
            done();
        });
        it("root [userid=son]", async(done) => {
            const res = await request.get("/son/");
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text)).toMatchObject(testData.filter(data => {
                return data.userid === "son";
            }));
            done();
        });
        it("root [userid=nodata]", async(done) => {
            const res = await request.get("/nodata/");
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text)).toMatchObject([]);
            done();
        });
    });
    describe("削除API test", () => {
        const testData : any = [
            {
                userid: "destroy_1",
                title: "朝タスク",
                body: "みんなを起こす、洗濯機回す、ごはん作る、洗濯物干す、食器洗う"
            }, {
                userid: "destroy_1",
                title: "朝ごはんメニュー",
                body: "白米、味噌汁、冷奴"
            }, {
                userid: "destroy_2",
                title: "朝タスク",
                body: "ふとんを片付ける、掃除する、出勤準備"
            }, {
                userid: "destroy_2",
                title: "出勤準備",
                body: "洗顔、化粧"
            }
        ];
        let todos : any;
        beforeAll(async() => {
            await cleanUp();
            todos = await registData(testData);
        });
        it("削除→検索", async(done) => {
            todos[1].then(async(todo) => {
                const res = await request
                    .delete(`/destroy_1/${todo._id}`)
                    .type("form")
                    .send({});
                expect(res.status).toBe(204);
                expect(res.text).toBe("");
                expect(JSON.parse((await request.get(encodeURI(`/destroy_1/${todo.title}`))).text)).toMatchObject([]);
                done();
            });
        });
        it("削除id不正", async(done) => {
            const res = await request
                .delete("/destroy_1/12345")
                .type("form")
                .send({});
            expect(res.status).toBe(422);
            done();
        });
        it("削除idなし", async(done) => {
            const res = await request
                .delete("/destroy_1/")
                .type("form")
                .send({});
            expect(res.status).toBe(404);
            done();
        });
        it("削除ユーザ不正", async(done) => {
            const res = await request
                .delete("/destroy_9/12345")
                .type("form")
                .send({});
            expect(res.status).toBe(422);
            done();
        });
    });
    describe("検索API test", () => {
        beforeAll(async() => {
            const testData : any = [
                {
                    userid: "search_1",
                    title: "朝タスク",
                    body: "みんなを起こす、洗濯機回す、ごはん作る、洗濯物干す、食器洗う"
                }, {
                    userid: "search_1",
                    title: "朝ごはんメニュー",
                    body: "白米、味噌汁、冷奴"
                }, {
                    userid: "search_2",
                    title: "朝タスク",
                    body: "ふとんを片付ける、掃除する、出勤準備"
                }, {
                    userid: "search_2",
                    title: "出勤準備",
                    body: "洗顔、化粧"
                }, {
                    userid: "search_3",
                    title: "朝タスク",
                    body: "顔洗う、学校の準備"
                }
            ];
            await cleanUp();
            await registData(testData);
        });
        it("search bodyのみ該当", async(done) => {
            const res = await request.get(encodeURI("/search_1/洗う"));
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text)).toMatchObject([
                {
                    userid: "search_1",
                    title: "朝タスク",
                    body: "みんなを起こす、洗濯機回す、ごはん作る、洗濯物干す、食器洗う"
                }
            ]);
            done();
        });
        it("search titleとbodyに該当", async(done) => {
            const res = await request.get(encodeURI("/search_2/準備"));
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text)).toMatchObject([
                {
                    userid: "search_2",
                    title: "朝タスク",
                    body: "ふとんを片付ける、掃除する、出勤準備"
                }, {
                    userid: "search_2",
                    title: "出勤準備",
                    body: "洗顔、化粧"
                }
            ]);
            done();
        });
    });
    describe("更新API test", () => {
        let todos : any;
        beforeAll(async() => {
            const testData : any = [
                {
                    userid: "update_1",
                    title: "朝タスク",
                    body: "みんなを起こす、洗濯機回す、ごはん作る、洗濯物干す、食器洗う"
                }, {
                    userid: "update_1",
                    title: "朝ごはんメニュー",
                    body: "白米、味噌汁、冷奴"
                }, {
                    userid: "update_2",
                    title: "朝タスク",
                    body: "ふとんを片付ける、掃除する、出勤準備"
                }, {
                    userid: "update_2",
                    title: "出勤準備",
                    body: "洗顔、化粧"
                }
            ];
            await cleanUp();
            todos = await registData(testData);
        });
        it("update パラメータ全部あり", async(done) => {
            const id = (await todos[1])._id;
            const res = await request
                .put("/update_1/")
                .type("form")
                .send({_id: id, title: "TODO更新テスト", body: "テストで更新"});
            expect(res.status).toBe(200);
            // console.log(res.text);
            const todoData = JSON.parse(res.text);
            expect(todoData._id).toBe(id);
            expect(todoData.userid).toBe("update_1");
            expect(todoData.title).toBe("TODO更新テスト");
            expect(todoData.body).toBe("テストで更新");
            done();
        });
        it("update _idなし", async(done) => {
            const res = await request
                .put("/update_2/")
                .type("form")
                .send({title: "TODO更新テスト", body: "テストで更新"});
            expect(res.status).toBe(422);
            done();
        });
        it("update titleなし", async(done) => {
            const id = (await todos[2])._id;
            const res = await request
                .put("/update_2/")
                .type("form")
                .send({_id: id, body: "テストで更新"});
            expect(res.status).toBe(200);
            const todoData = JSON.parse(res.text);
            expect(todoData._id).toBe(id);
            expect(todoData.userid).toBe("update_2");
            expect(todoData.title).toBe("");
            expect(todoData.body).toBe("テストで更新");
            done();
        });
        it("update bodyなし", async(done) => {
            const id = (await todos[3])._id;
            const res = await request
                .put("/update_2/")
                .type("form")
                .send({_id: id, title: "TODO更新テスト"});
            expect(res.status).toBe(200);
            const todoData = JSON.parse(res.text);
            expect(todoData._id).toBe(id);
            expect(todoData.userid).toBe("update_2");
            expect(todoData.title).toBe("TODO更新テスト");
            expect(todoData.body).toBe("");
            done();
        });
        it("update _idが不正", async(done) => {
            const res = await request
                .put("/update_2/")
                .type("form")
                .send({_id: "12345", title: "TODO更新テスト", body: "テストで更新"});
            expect(res.status).toBe(422);
            done();
        });
    });
});