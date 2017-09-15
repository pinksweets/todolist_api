import {default as Todo, TodoModel} from '../models/Todo';
import {Request, Response, NextFunction} from 'express';
import * as mongodb from "mongodb";

export let root = async(userid : string) => {
    let query = Todo.find({userid: userid});
    return JSON.stringify(await query.exec());
};

export let search = async(userid : string, keyword : string) => {
    let query = Todo.find({
        $or: [
            {
                title: new RegExp(keyword, 'i')
            }, {
                body: new RegExp(keyword, 'i')
            }
        ],
        userid: userid
    });
    let res = await query.exec();
    return JSON.stringify(res);
};

export let add = async(userid : string, title : string, body : string) => {
    let todo = new Todo({userid: userid, title: title, body: body});
    let _id = await todo.save((err, product) => {
        if (err) 
            throw err;
        return product
            ._id
            .toHexString();
    });
    return _id;
};

export let update = async(_id : string, userid : string, title : string, body : string) => {
    let todo = {
        userid: userid,
        title: title,
        body: body
    };
    await Todo
        .findByIdAndUpdate(_id, todo)
        .exec();
    return "end";
};

export let destroy = async(_id : string) => {
    await Todo
        .findByIdAndRemove(_id)
        .exec();
    return "end";
};
