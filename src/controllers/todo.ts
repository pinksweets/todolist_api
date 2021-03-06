import Todo from "../models/Todo";

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
    return await todo.save((err, product) => {
        if (err) {
            throw err;
        }
        return product
            ._id
            .toHexString();
    });
};

export let update = (_id : string, userid : string, title : string, body : string) => {
    const todo = {
        userid: userid,
        title: title,
        body: body
    };
    return Todo
        .findByIdAndUpdate(_id, todo, {new: true})
        .exec();
};

export let destroy = (_id : string, userid : string) => {
    return Todo
        .findOneAndRemove({_id: _id, userid: userid})
        .exec();
};
