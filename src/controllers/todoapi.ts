import {default as Todo, TodoModel} from '../models/Todo';
import {Request, Response, NextFunction} from 'express';
import * as todo from './todo';

export let rootApi = (req : Request, res : Response) => {
    let userid : string = req.params.userid;
    todo.root(userid).then((todos) => {
        res.send(todos);
    });
};

export let searchApi = (req : Request, res : Response) => {
    let userid : string = req.params.userid,
        keyword : string = req.params.keyword;
    res.send(todo.search(userid, keyword));
};

export let addApi = (req : Request, res : Response) => {
    let userid = req.params.userid,
        title = req.body.title,
        body = req.body.body;
    res.send(todo.add(userid, title, body));
};

export let updateApi = (req : Request, res : Response) => {
    let userid = req.params.userid,
        title = req.body.title,
        body = req.body.body,
        _id = req.body._id;
    res.send(todo.update(_id, userid, title, body));
};

export let destroyApi = (req : Request, res : Response) => {
    let _id = req.params._id;
    res.send(todo.destroy(_id));
};
