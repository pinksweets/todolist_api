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

        expect(JSON.parse((await request.get("/father/")).text)).toMatchObject(testData.filter(data => {
            return data.userid === "father";
        }));

        expect(JSON.parse((await request.get("/mother/")).text)).toMatchObject(testData.filter(data => {
            return data.userid === "mother";
        }));

        expect(JSON.parse((await request.get("/son/")).text)).toMatchObject(testData.filter(data => {
            return data.userid === "son";
        }));

        done();
    });
});
