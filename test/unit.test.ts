import {} from "jest";
import * as mongoose from "mongoose";
import * as todo from "../src/controllers/todo";
import Todo from "../src/models/Todo";

describe("unit test", () => {
    beforeAll(async() => {
        const mongourl = "mongodb://localhost:27017/todolist";
        mongoose.connect(mongourl, {
            useMongoClient: true,
            promiseLibrary: global.Promise
        });
        const docs = await Todo.find();
        docs.forEach(item => {
            Todo.findByIdAndRemove(item._id, (err, res) => {
                if (err) {
                    throw err;
                }
                return "removed";
            });
        });
        const testData : Array < any > = [
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
        testData.map(async(item) => {
            return await(new Todo(item)).save({
                validateBeforeSave: false
            }, (err, ret) => {
                return ret
                    ._id
                    .toHexString();
            });
        });
    });
    describe("todo.root()", () => {
        it("ユーザID father", async(done) => {
            expect(JSON.parse(await todo.root("father"))).toMatchObject([
                {
                    userid: "father",
                    title: "朝タスク",
                    body: "みんなを起こす、洗濯機回す、ごはん作る、洗濯物干す、食器洗う"
                }, {
                    userid: "father",
                    title: "朝ごはんメニュー",
                    body: "白米、味噌汁、冷奴"
                }
            ]);
            done();
        });
        it("ユーザID mother", async(done) => {
            expect(JSON.parse(await todo.root("mother"))).toMatchObject([
                {
                    userid: "mother",
                    title: "朝タスク",
                    body: "ふとんを片付ける、掃除する、出勤準備"
                }, {
                    userid: "mother",
                    title: "出勤準備",
                    body: "洗顔、化粧"
                }
            ]);
            done();
        });
        it("ユーザID son", async(done) => {
            expect(JSON.parse(await todo.root("son"))).toMatchObject([
                {
                    userid: "son",
                    title: "朝タスク",
                    body: "顔洗う、学校の準備"
                }
            ]);
            done();
        });
    });

    describe("todo.add()", () => {
        it("userid,title,body", async(done) => {
            const ret = await todo.add("unit_1", "title unit_1", "body unit_1");
            expect(ret["userid"]).toBe("unit_1");
            expect(ret["title"]).toBe("title unit_1");
            expect(ret["body"]).toBe("body unit_1");
            done();
        });
        it("title,body", async(done) => {
            const ret = await todo.add("", "title unit_2", "body unit_2");
            expect(ret["userid"]).toBe("");
            expect(ret["title"]).toBe("title unit_2");
            expect(ret["body"]).toBe("body unit_2");
            done();
        });
        it("userid,body", async(done) => {
            const ret = await todo.add("unit_3", "", "body unit_3");
            expect(ret["userid"]).toBe("unit_3");
            expect(ret["title"]).toBe("");
            expect(ret["body"]).toBe("body unit_3");
            done();
        });
        it("userid,title", async(done) => {
            const ret = await todo.add("unit_4", "title unit_4", "");
            expect(ret["userid"]).toBe("unit_4");
            expect(ret["title"]).toBe("title unit_4");
            expect(ret["body"]).toBe("");
            done();
        });
        it("引数が全部空", async(done) => {
            const ret = await todo.add("", "", "");
            expect(ret["userid"]).toBe("");
            expect(ret["title"]).toBe("");
            expect(ret["body"]).toBe("");
            done();
        });
    });

    describe("todo.search()", () => {
        it("ユーザID father 該当あり", async(done) => {
            expect(JSON.parse(await todo.search("father", "ごはん"))).toMatchObject([
                {
                    userid: "father",
                    title: "朝タスク",
                    body: "みんなを起こす、洗濯機回す、ごはん作る、洗濯物干す、食器洗う"
                }, {
                    userid: "father",
                    title: "朝ごはんメニュー",
                    body: "白米、味噌汁、冷奴"
                }
            ]);
            done();
        });
        it("ユーザID father 該当なし", async(done) => {
            expect(JSON.parse(await todo.search("father", "化粧"))).toMatchObject([]);
            done();
        });
    });

    describe("todo.update()", () => {
        let testId : any;
        beforeAll(async() => {
            testId = await(new Todo({userid: "son", title: "朝タスク", body: "顔洗う、学校の準備"})).save({
                validateBeforeSave: false
            }, (err, ret) => {
                return ret
                    ._id
                    .toHexString();
            });
        });
        it("ユーザID son 更新", async(done) => {
            expect({"__v": 0, "_id": "59c399fd8796a714946595d3", "body": "たべる", "title": "ごはん", "userid": "sonx"}).toMatchObject({"body": "たべる", "title": "ごはん", "userid": "sonx"});
            const ret = await todo.update(testId._id, "son", "ごはん", "たべる");
            expect(ret["userid"]).toBe("son");
            expect(ret["title"]).toBe("ごはん");
            expect(ret["body"]).toBe("たべる");
            done();
        });
        it("ユーザID son 更新エラー", async(done) => {
            await expect(todo.update("12345", "son", "ごはん", "たべる"))
                .rejects
                .toBeInstanceOf(mongoose.CastError);
            done();
        });
    });
});
