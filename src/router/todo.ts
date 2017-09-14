import {Router} from 'express';
import TodoApi from '../app/todoapp';
const todoRouter : Router = Router();

todoRouter.get('/:user/', (req, res) => {
    let todo = new TodoApi(req.params.user);
    res.send(todo.root());
});
todoRouter.get('/:user/search', (req, res) => {
    let todo = new TodoApi(req.params.user);
    todo.search();
});
todoRouter.post('/:user/add', (req, res) => {
    let todo = new TodoApi(req.params.user);
    todo.add(req.body);
});
todoRouter.post('/:user/update', (req, res) => {
    let todo = new TodoApi(req.params.user);
    todo.update(req.body);
});
todoRouter.post('/:user/destroy', (req, res) => {
    let todo = new TodoApi(req.params.user);
    todo.destroy(req.body);
});

export default todoRouter;
