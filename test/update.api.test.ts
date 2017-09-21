import {} from "jest";
import { request, registData } from "./utils/setting";
import Todo from "../src/models/Todo";

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
        todos = await registData(testData);
    });
    it("update /:userid/update", async(done) => {
        const id = (await todos[2])._id;
        const res = await request
            .post("/update_2/update")
            .type("form")
            .send({_id: id, title: "TODO更新テスト", body: "テストで更新"});
        expect(res.status).toBe(200);
        const todoData = JSON.parse(res.text);
        expect(todoData._id).toBe(id);
        expect(todoData.userid).toBe("update_2");
        expect(todoData.title).toBe("TODO更新テスト");
        expect(todoData.body).toBe("テストで更新");
        done();
    });
    it("update _idなし", async(done) => {
        const res = await request
            .post("/update_2/update")
            .type("form")
            .send({title: "TODO更新テスト", body: "テストで更新"});
        expect(res.status).toBe(422);
        done();
    });
    it("update titleなし", async(done) => {
        const id = (await todos[0])._id;
        const res = await request
            .post("/update_2/update")
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
        const id = (await todos[2])._id;
        const res = await request
            .post("/update_2/update")
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
            .post("/update_2/update")
            .type("form")
            .send({_id: "12345", title: "TODO更新テスト", body: "テストで更新"});
        expect(res.status).toBe(422);
        done();
    });
});
