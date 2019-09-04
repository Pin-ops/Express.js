const express = require('express');
const bodyparser = require('body-parser');
const { calculator } = require('./helper');
const moment = require('moment');
const fs = require('fs');

const app = express();

//Middleware
app.use(bodyparser.json());

//Middleware


var myToDos = [
    'Go to the German course!',
    'Visit the Burgermeister',
    'Revise the notes',
]


//Calculator

app.get('/', (req, res) => {
    res.send('Hello!');
})

app.get('/calculator/:num1/:num2/:operator', (req, res) => {
    let { num1, num2, operator } = req.params;
    res.send(String(calculator(num1, num2, operator)));
})


//TO_DO APP

app.get('/todo', (req, res) => {
    res.send(myToDos)
})

// Add to the todo list

app.post('/todo', (req, res) => {
    myToDos.push(req.body.todo)
    res.send(myToDos);
})

//Delete from Todo list

app.delete('/todo/:todo', (req, res) => {
    let { todo } = req.params;
    myToDos = myToDos.filter(p => p !== todo);
    res.send(myToDos);
})

//Get The future

app.get('/future/:hours', (req, res) => {
    let myFuture = moment().add(req.params.hours, 'hours').format('LLL')
    res.send(myFuture);

});

//Check username

app.post('/login', (req, res) => {
    let { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        res.send('You are logged in!');
    } else {
        res.sendStatus(401);
    }
});


//Customer Report

app.post('/report', (req, res) => {
    let { customer } = req.body;
    let isItExist = fs.existsSync('./report')

    if (!isItExist) {
        fs.mkdirSync('./report');
    }
    fs.writeFileSync(`./report/${customer}.json`, JSON.stringify(req.body));

    res.send('Saved!')

});

//Get Report
app.get('/report', (req, res) => {
    let dir = fs.readdirSync('./report');
    let customers = dir.map(customer => customer.replace('.json', ''));
    res.send(customers)
})






app.listen(3090, () => { console.log('Server is listening ...'); })