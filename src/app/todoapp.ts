interface TodoData {
    id : number,
    title : string,
    body : string
}
interface PostData {
    title : string,
    body : string
}
export default class TodoApi {
    private todos : object = {};

    constructor(public id) {}

    getUserTodo(user) : TodoData[] {
        this.todos[user] || (this.todos[user] = [{}]);
        return this.todos[user];
    }

    root() : string {
        return JSON.stringify(this.getUserTodo(this.id));
    }

    search() {
        let todo = this.getUserTodo(this.id);
        return 'ready now';
    }

    add(content : PostData) : number {
        let todo = this.getUserTodo(this.id);
        let addData = Object.assign({
            id: (new Date()).getTime()
        }, content);
        todo.push(addData);
        return addData.id;
    }

    update(content : TodoData) : string {return 'ready now';}

    destroy(id : number) : string {return 'ready now';}
}
