import {default as Todo, TodoModel } from "../models/Todo";
import { Request, Response, NextFunction } from "express";
import * as mongodb from "mongodb";

export let root = async(userid : string) => {
    const query = Todo.find({userid: userid});
    return JSON.stringify(await query.exec());
};

export let search = async(userid : string, keyword : string) => {
    const query = Todo.find({
        $or: [
            {
                title: new RegExp(keyword, "i")
            }, {
                body: new RegExp(keyword, "i")
            }
        ],
        userid: userid
    });
    const res = await query.exec();
    return JSON.stringify(res);
};

export let add = async(userid : string, title : string, body : string) => {
    const todo = new Todo({userid: userid, title: title, body: body});
    const _id = await todo.save((err, product) => {
        if (err)
            throw err;
        return product
            ._id
            .toHexString();
    });
    return _id;
};

export let update = async(_id : string, userid : string, title : string, body : string) => {
    const todo = {
        userid: userid,
        title: title,
        body: body
    };
    const res = await Todo
        .findByIdAndUpdate(_id, todo, {new: true})
        .exec();
    return JSON.stringify(res);
};

export let destroy = async(_id : string) => {
    await Todo
        .findByIdAndRemove(_id)
        .exec();
    return "end";
};
