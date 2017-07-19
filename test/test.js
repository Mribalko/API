const supertest = require('supertest');

describe('REST API', () => {
    let server;
    let userId;
    before((done) => {
        require('../REST API');
        setTimeout(() => {
            server = supertest.agent('http://localhost:3000');
            // создаем тестового пользователя, запоминаем id
            server
                .post('/users')
                .set({name: 'test', score: 5})
                .end((err, res) => {
                    userId = res.body.id;
            });
            done();
        }, 1000);
    });

    describe('Добавление пользователей', () => {

        it('Post /users с параметрами должен вернуть 200', done => {
            server
                .post('/users')
                .set({name: 'test', score: 5})
                .expect(200, done);

        });

        it('Post /users с параметрами любого типа должен вернуть 200', done => {
            server
                .post('/users')
                .set({name: '2', score: 'test'})
                .expect(200, done);

        });

        it('Post /users без параметров должен вернуть 400', done => {
            server
                .post('/users')
                .expect(400, done);
        });

        it('Post /users без параметра score должен вернуть 400', done => {
            server
                .post('/users')
                .set({name: 'test'})
                .expect(400, done);
        });

        it('Post /users без параметра name должен вернуть 400', done => {
            server
                .post('/users')
                .set({score: 5})
                .expect(400, done);
        });
    });

    describe('Удаление пользователя', () => {

        it('Delete /users с id существующего пользователя должен вернуть 200', done => {

            server
                .del('/users/' + userId)
                .expect(200, done);
        });

        it('Delete /users без параметра должен вернуть 404', done => {

            server
                .del('/users')
                .expect(404, done);
        });

        it('Delete /users с id несуществующего пользователя должен вернуть 400', done => {

            server
                .del('/users/9999')
                .expect(400, done);
        });

    });
});

