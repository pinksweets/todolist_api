import {} from "jest";
import {　request, registData } from "./utils/setting";

describe("ルートAPI test", () => {
    it("root /:userid/", async(done) => {
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
        await registData(testData);

        const res_1 = await request.get("/father/");
        expect(res_1.status).toBe(200);
        expect(JSON.parse(res_1.text)).toMatchObject(testData.filter(data => {
            return data.userid === "father";
        }));

        const res_2 = await request.get("/mother/");
        expect(res_2.status).toBe(200);
        expect(JSON.parse(res_2.text)).toMatchObject(testData.filter(data => {
            return data.userid === "mother";
        }));

        const res_3 = await request.get("/son/");
        expect(res_3.status).toBe(200);
        expect(JSON.parse(res_3.text)).toMatchObject(testData.filter(data => {
            return data.userid === "son";
        }));

        done();
    });
});
