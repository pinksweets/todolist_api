import {} from "jest";
import { request, registData } from "./utils/setting";

describe("検索API test", () => {
    it("search /:userid/search", async(done) => {
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

        expect(JSON.parse((await request.get(encodeURI("/search_1/search/洗う"))).text)).toMatchObject([
            {
                userid: "search_1",
                title: "朝タスク",
                body: "みんなを起こす、洗濯機回す、ごはん作る、洗濯物干す、食器洗う"
            }
        ]);

        expect(JSON.parse((await request.get(encodeURI("/search_2/search/準備"))).text)).toMatchObject([
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
