import {} from "jest";
import { request, registData } from "./utils/setting";

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
    let todos: any;
    beforeAll(async() => {
        todos = await registData(testData);
    });
    it("削除→検索", async(done) => {
        todos[1].then(async(todo) => {
            const res = await request
                .post(`/destroy_1/destroy/${todo._id}`)
                .type("form")
                .send({});
            expect(res.status).toBe(200);
            expect(res.text).toBe("end");
            expect(JSON.parse((await request.get(encodeURI(`/destroy_1/search/${todo.title}`))).text)).toMatchObject([]);
            done();
        });
    });
});
