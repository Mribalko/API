/**
 * Created by mriba on 11.06.2017.
 */
const port = process.env.POR || 3000;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let usersArray = [];

//{"jsonrpc": 2.0, "method": "add", "params": {"name": "test", "score": 22}, "id": 2}

function add(name, score){
    // если массив пустой, то идентификатор 1
    if(usersArray.length == 0)
        id = 1;
    else
    // иначе следующее число за значением идентификатора последнего элемента массива
        id = usersArray[usersArray.length - 1].id + 1;

    usersArray.push({
        id: id,
        name: name,
        score: score
    });

    return JSON.stringify({
            jsonrpc: '2.0',
            result: {
                name : name,
                score: score
            },
            id: id});
}

function update(id, name, score){

    let index = usersArray.findIndex(obj => obj.id == id);
    if(name) usersArray[index].name = name;
    if(score) usersArray[index].score = score;

    return JSON.stringify({
        jsonrpc: '2.0',
        result: {
            name : name,
            score: score
        },
        id: id});
}

function remove(id){
    let index = usersArray.findIndex(obj => obj.id == id);
    usersArray.splice(index, 1);

    return JSON.stringify({
        jsonrpc: '2.0',
        result: 'removed',
        id: id});

}

function view(id){
    if(id){
        let index = usersArray.findIndex(obj => obj.id == id);
        return JSON.stringify({
            jsonrpc: '2.0',
            result: {
                name : usersArray[index].name,
                score: usersArray[index].score
            },
            id: id});
    }
    else{
        let resultArray = [];
        usersArray.forEach(function(item){
            resultArray.push(
                {
                    jsonrpc: '2.0',
                    result: {
                        name : item.name,
                        score: item.score
                    },
                    id: item.id
                });
        });
        return JSON.stringify(resultArray);
    }
}

app.use(bodyParser.json());
app.post("/rpc", function(req, res) {
    const method = req.body.method;
    let id = req.body.id;
    let name = req.body.params.name;
    let score = req.body.params.score;
    let index = usersArray.findIndex(obj => obj.id == id);

    switch(method){
        case 'add':

            if(name && score){
                res
                    .status(200)
                    .send(add(name, score));
            }
            else
                res
                    .status(400)
                    .send(
                        {"jsonrpc": "2.0", "error": {"code": -32602, "message": "Invalid params"}, "id": null}
                    );

            break;
        case 'update':

            if(index >= 0 && (name || score))
                res
                    .status(200)
                    .send(update(id, name, score));
            else
                res
                    .status(400)
                    .send(
                        {"jsonrpc": "2.0", "error": {"code": -32602, "message": "Invalid params"}, "id": null}
                    );
            break;
        case 'remove':

            if(index >= 0)
                res
                    .status(200)
                    .send(remove(id));
            else
                res
                    .status(400)
                    .send(
                        {"jsonrpc": "2.0", "error": {"code": -32602, "message": "Invalid params"}, "id": null}
                    );
            break;
        case 'view':

            if(id && index < 0){
                    res
                        .status(400)
                        .send(
                            {"jsonrpc": "2.0", "error": {"code": -32602, "message": "Invalid params"}, "id": null}
                        );
            }
            else
                res
                    .status(200)
                    .send(view(id));

            if(usersArray.length == 0)
                res
                    .status(500)
                    .send(
                        {"jsonrpc": "2.0", "error": {"code": -32000, "message": "Server error"}, "id": null}
                    );
            break;
        default:
            res
                .status(400)
                .send(
                    {"jsonrpc": "2.0", "error": {"code": -32602, "message": "Invalid params"}, "id": null}
                    );
    }


});

app.listen(port, function () {
    console.log(`Server on port ${port}!`);
});