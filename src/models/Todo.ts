import * as mongoose from 'mongoose';

export type TodoModel = mongoose.Document & {
    userid: string,
    title: string,
    body: string
}

export const todoSchema = new mongoose.Schema({
    userid: String,
    title: String,
    body: String
});

const Todo = mongoose.model("todos", todoSchema);
export default Todo;
