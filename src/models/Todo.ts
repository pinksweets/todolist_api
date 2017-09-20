import * as mongoose from "mongoose";

const Todo = mongoose.model("todos", new mongoose.Schema({userid: String, title: String, body: String}, { validateBeforeSave : false }));
export default Todo;
