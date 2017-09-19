import {} from "jest";
import { request } from "./utils/before";

describe("登録API test", () => {
    it("パラメータ[title,body]のパターン", async(done) => {
        const res = await request
            .post("/add_1/add")
            .type("form")
            .send({title: "買い物メモ", body: "ネギ、豆腐、納豆"});
        const todoData = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(todoData.title).toBe("買い物メモ");
        expect(todoData.body).toBe("ネギ、豆腐、納豆");
        done();
    });
    it("パラメータ[title]のパターン", async(done) => {
        const res = await request
            .post("/add_1/add")
            .type("form")
            .send({title: "買い食い禁止！"});
        const todoData = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(todoData.title).toBe("買い食い禁止！");
        expect(todoData.body).toBe("");
        done();
    });
    it("パラメータ[body]のパターン", async(done) => {
        const res = await request
            .post("/add_1/add")
            .type("form")
            .send({body: "帰ったらお風呂を沸かす"});
        const todoData = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(todoData.title).toBe("");
        expect(todoData.body).toBe("帰ったらお風呂を沸かす");
        done();
    });
    it("BODYにデータが無いパターン", async(done) => {
        const res = await request
            .post("/add_1/add")
            .type("form")
            .send({});
        const todoData = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(todoData.title).toBe("");
        expect(todoData.body).toBe("");
        done();
    });
});
