import {} from "jest";
import { request, registData } from "./utils/setting";

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
        await registData(testData);
    });
    it("search /:userid/search", async(done) => {
        const res_1 = await request.get(encodeURI("/search_1/search/洗う"));
        expect(res_1.status).toBe(200);
        expect(JSON.parse(res_1.text)).toMatchObject([
            {
                userid: "search_1",
                title: "朝タスク",
                body: "みんなを起こす、洗濯機回す、ごはん作る、洗濯物干す、食器洗う"
            }
        ]);

        const res_2 = await request.get(encodeURI("/search_2/search/準備"));
        expect(res_2.status).toBe(200);
        expect(JSON.parse(res_2.text)).toMatchObject([
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
