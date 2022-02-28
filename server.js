const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: '864900',
        database: 'smart-brain',
    },
});

app.use(bodyParser.json());
app.use(cors());

const found = (id, req, res) => {
    let found = false;
    knex.select('*')
        .from('users')
        .where({
            id: id,
        })
        .then((user) => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('no data');
            }
        })
        .catch((err) => res.status(400).json('error'));
};

const database = {
    users: [
        {
            id: '123',
            name: 'test',
            email: 'test@',
            password: '123',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '456',
            name: 'sally',
            email: 'sally@gmail.com',
            password: '456',
            entries: 0,
            joined: new Date(),
        },
    ],
};

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    knex('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date(),
        })
        .then((user) => res.json(user))
        .catch((err) => res.status(404).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
    const id = req.params.id;
    found(id, req, res);
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    return res.status(404).json('no data');
});

app.listen(3001, () => {
    console.log('app is running on port 3001');
});
