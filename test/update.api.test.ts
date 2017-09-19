import {} from "jest";
import { request, registData, cleanUp } from "./utils/before";

describe("integration test", () => {
    it("update /:userid/update", async(done) => {
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
        const todos = await registData(testData);
        todos[2].then(async(todo) => {
            const res = await request
                .post("/update_2/update")
                .type("form")
                .send({_id: todo._id, title: "TODO更新テスト", body: "テストで更新"});
            const todoData = JSON.parse(res.text);
            expect(todoData._id).toBe(todo._id);
            expect(todoData.userid).toBe("update_2");
            expect(todoData.title).toBe("TODO更新テスト");
            expect(todoData.body).toBe("テストで更新");
            done();
        });
    });
});
