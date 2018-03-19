'use strict';

const Hapi = require('hapi');
const delay = require('delay');
const Joi = require('joi');

const schema = Joi.object().keys({
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string().email()
}).with('password', 'email');

const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'GET',
    path: '/hello/{param?}',
    handler: function (request, h) {
        return `Hello ${encodeURIComponent(request.params.param)}!`;
    }
});
server.route({
    method: 'POST',
    path: '/test/{email}/{password}',
    handler: function (request, h) {

        const result = Joi.validate({
            email: request.params.email,
            password: encodeURIComponent(request.params.password)
        }, schema);

        if (result.error !== null) {
            return false;
        }

        return delay(2000).then(() => {
            return {"ok": 1};
        });
    }
});

server.route({
    method: 'POST',
    path: '/cache/{ints}',
    handler: function (request, h) {
        return delay(2000).then(() => {
            return request.params.ints.split(",").sort(function (a, b) {
                return b - a;
            });
        });
    }
});


async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();