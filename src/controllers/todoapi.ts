import {default as Todo } from "../models/Todo";
import { Request, Response, NextFunction } from "express";
import * as todo from "./todo";

export let rootApi = (req : Request, res : Response) => {
    const userid : string = req.params.userid;
    todo
        .root(userid)
        .then((todos) => {
            res.send(todos);
        });
};

export let searchApi = (req : Request, res : Response) => {
    const userid : string = req.params.userid,
        keyword : string = req.params.keyword;
    todo
        .search(userid, keyword)
        .then((todos) => {
            res.send(todos);
        });
};

export let addApi = (req : Request, res : Response) => {
    const userid = req.params.userid,
        title = req.body.title || "",
        body = req.body.body || "";
    todo
        .add(userid, title, body)
        .then((ret) => {
            res.send(ret);
        });
};

export let updateApi = (req : Request, res : Response) => {
    const userid = req.params.userid,
        title = req.body.title || "",
        body = req.body.body || "",
        _id = req.body._id;
    if (_id) {
        todo
        .update(_id, userid, title, body)
        .then((ret) => {
            res.send(ret);
        });
    } else {
        res.sendStatus(422);
    }
};

export let destroyApi = (req : Request, res : Response) => {
    const _id = req.params.id;
    todo
        .destroy(_id)
        .then((ret) => {
            res.send(ret);
        });
};
