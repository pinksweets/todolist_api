import {} from "jest";
import { request, registData, cleanUp } from "./utils/setting";

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
