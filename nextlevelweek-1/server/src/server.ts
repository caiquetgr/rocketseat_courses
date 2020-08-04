import express from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());
app.listen(3333);

/*
const users = [
    'Mario',
    'Sonic'
];

app.get('/users', (request, response) => {

    const search = request.query.search;

    const filteredUsers = search ? users.filter(user => user.includes(String(search))) : users;

    return response.json(filteredUsers);

});

app.get('/users/:id', (request, response) => {

    const id = Number(request.params.id);

    return response.json(users[id]);

})

app.post('/users', (request, response) => {

    const requestBody = request.body;

    const user = {
        'name': requestBody.name,
        'email': requestBody.email
    }

    return response.json(user);
})
*/