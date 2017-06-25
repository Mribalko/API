/**
 * Created by mriba on 10.06.2017.
 */
const port = process.env.POR || 3000;
const express = require('express');
const app = express();

let usersArray = [];

// преобразование исходного массива пользователей
function transformArray(offset, limit, fields){

    // копируем массив объектов
    let arr = JSON.parse(JSON.stringify(usersArray));

    // если указана фильтрация полей. Ограничений сверху нет, так как могут передаваться поля, которых нет в объектах
    // например, ?fields=id,test,name
    if(fields.length > 0) {

        arr.map(item => {
            if (fields.indexOf('id') == -1)
                delete item.id;
            if (fields.indexOf('name') == -1)
                delete item.name;
            if (fields.indexOf('score') == -1)
                delete item.score;

            return item;
        });
    }

    if(limit && offset)
        return arr.slice(offset, limit);
    if(limit)
        return arr.slice(0, limit);
    if(offset)
        return arr.slice(offset);

    return arr;
}

// информация о всех пользователях
app.get('/users', function (req, res) {

    let limit = req.query.limit;
    let offset = req.query.offset;
    let fields = req.query.fields;
    let fieldsArray = [];

    if(fields)
        fieldsArray = fields
                    .split(',')
                    .map(item =>{
                        return item.trim().toLowerCase();
                    });

    if(req.query.limit && (isNaN(parseInt(limit)) || limit <= 0))
        return res
            .status(400)
            .send({message: 'Передан неверный параметр limit'});

    if(req.query.offset && (isNaN(parseInt(offset))  || offset < 0 || offset >= usersArray.length))
        return res
            .status(400)
            .send({message: 'Передан неверный параметр offset'});

    if(usersArray.length > 0)
        res
            .status(200)
            .send(
                   transformArray(offset, limit, fieldsArray)
            );
    else
        res
            .status(500)
            .send({message: 'Нет пользователей'});
});

// информация об одном пользователе
app.get('/users/:id', function (req, res) {

    let id = req.params.id;

    let index = usersArray.findIndex(obj => obj.id == id);

    if(index < 0)
        res
            .status(400)
            .send({message: 'Передан некорректный параметр id'});
    else {

        res
            .status(200)
            .send({
                message: 'Пользователь найден',
                id: usersArray[index].id,
                name: usersArray[index].name,
                score: usersArray[index].score
            });
    }
});

// добавление пользователя
app.post('/users', function(req, res) {
    "use strict";
    let name = req.header('name');
    let score = req.header('score');
    let id;
    // если массив пустой, то идентификатор 1
    if(usersArray.length == 0)
        id = 1;
    else
        // иначе следующее число за значением идентификатора последнего элемента массива
        id = usersArray[usersArray.length - 1].id + 1;


    if(name && score){
       usersArray.push({
           id: id,
           name: name,
           score: score
       });
       res
           .status(200)
           .send({
                    message: 'Добавлен пользователь',
                    id: id,
                    name: name,
                    score: score
           });
    }
    else
        res
            .status(400)
            .send({message: 'Для добавления пользователя должны быть переданы параметры name и score'});
});

// обновление данных пользователя
app.put('/users/:id', function(req, res) {
    "use strict";
    let id = req.params.id;
    let name = req.header('name');
    let score = req.header('score');

    let index = usersArray.findIndex(obj => obj.id == id);

    if(index < 0)
        res
            .status(400)
            .send({message: 'Передан некорректный параметр id'});
    else if(name || score){
        if(name) usersArray[index].name = name;
        if(score) usersArray[index].score = score;
        res
            .status(200)
            .send({
                    message: 'Обновлен пользователь',
                    id: id,
                    name: name,
                    score: score
            });
    }
    else {
        res
            .status(400)
            .send({message: 'Не передан ни один из параметров name, score'});
    }

});

// удаление пользователя
app.delete('/users/:id', function (req, res) {

    let id = req.params.id;

    let index = usersArray.findIndex(obj => obj.id == id);

    if(index < 0)
        res
            .status(400)
            .send({message: 'Передан некорректный параметр id'});
    else {

        usersArray.splice(index, 1);

        res
            .status(200)
            .send({
                    message: 'Пользователь удален',
                    id: id
            });
    }

});

app.listen(port, function () {
    console.log(`Server on port ${port}!`);
});
