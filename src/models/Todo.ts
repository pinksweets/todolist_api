import * as mongoose from "mongoose";

export const todoSchema = new mongoose.Schema({
    userid: String,
    title: String,
    body: String
});

const Todo = mongoose.model("todos", todoSchema);
export default Todo;
