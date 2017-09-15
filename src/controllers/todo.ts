import {default as Todo, TodoModel} from '../models/Todo';
import {Request, Response, NextFunction} from 'express';

export let root = async(userid : string) => {
    let query = Todo.find({userid: userid});
    return JSON.stringify(await query.exec());
};

export let search = async(userid : string, keyword : string) => {
    let query = Todo.find({
        $or: [
            {
                title: keyword
            }, {
                body: keyword
            }
        ],
        userid: {
            $eq: userid
        }
    });
    return JSON.stringify(await query.exec());
};

export let add = async(userid : string, title : string, body : string) => {
    let todo = new Todo({userid: userid, title: title, body: body});
    let _id = await todo.save((err, product) => {
        if (err) 
            throw err;
        return product._id;
    });
    return _id;
};

export let update = async(_id : string, userid : string, title : string, body : string) => {
    let todo = {
        userid: userid,
        title: title,
        body: body
    };
    return await Todo.update(_id, {$set: todo}).exec((err, res) => {
        return JSON.stringify(res);
    });
};

export let destroy = async(_id : string) => {
    return await Todo.findByIdAndRemove(_id).exec();
};
