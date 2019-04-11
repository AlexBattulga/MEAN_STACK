const body = require('body-parser');
const e = require('express');
const m = require('mongoose');

const { POST: port = 8000 } = process.env;
const app = e();

m.connect('mongodb://localhost/1955_Api', { useNewUrlParser: true });
m.connection.on('connected', () => console.log('connected to mongodb'));

app.use(body.json());

app.get('/', function(req, res){
    People.find({})
    .then(data =>{
        res.json(data);
    })
    .catch(error =>{
        console.log(error);
    })
})

app.get('/new/:name', function(req, res){
    People.create({
        name: req.params.name
    })
    .then(data =>{
        res.json(data);
    })
    .catch(error =>{
        console.log(error);
    })
})

app.get('/new/:name', function(req, res){
    People.create({
        name: req.params.name
    })
    .then(data =>{
        res.json(data);
    })
    .catch(error =>{
        console.log(error);
    })
})

app.get('/remove/:name', function(req, res){
    People.remove({
        name: req.params.name
    })
    .then(data =>{
        res.json(data);
    })
    .catch(error =>{
        console.log(error);
    })
})

app.get('/:name', function(req, res){
    People.findOne({
        name: req.params.name
    })
    .then(data =>{
        res.json(data);
    })
    .catch(error =>{
        console.log(error);
    })
})

const PeopleSchema = new m.Schema({
    name: String
},{
    timestamps: true
});

const People = m.model('People', PeopleSchema);

//Port configuration
app.listen(port, () => console.log(`express server listening on port ${port}`));