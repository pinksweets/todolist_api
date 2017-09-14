import assert from 'power-assert';
import target from '../src/app/todoapp';

describe("Test", () => {
    it("root", () => {
        let t = new target('test001');
        assert.equal(t.root(), "[{}]");
    });
    it("登録", () => {
        let t = new target("test001");
        assert.equal(typeof t.add({title: "タイトル", body: "内容"}), "number");
    });
    it("検索", () => {
        let t = new target('test001');
        assert.equal(t.search(), "");
    });
    it("更新", () => {
        let t = new target('test001');
        let data = {
            id: 1,
            title: "更新後のタイトル",
            body: "更新後の内容"
        };
        assert.equal(t.update(data), "");
    });
    it("削除", () => {
        let t = new target('test001');
        assert.equal(t.destroy(1), "");
    });
});