import express, { response } from 'express'
import 'dotenv/config'
import logger from './logger.js';
import morgan from 'morgan';

const morganFormat = ':method :url :status :response-time';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(morgan(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(' ')[0],
                url: message.split(' ')[1],
                status: message.split(' ')[2],
                responseTime: message.split(' ')[3],
            };
            logger.info(JSON.stringify(logObject));
        }
    }
}))

let data = [];
let nextId = 1;

// Add a new tea
app.post('/data', (req, res) => {
    const {name, price} = req.body;
    const newData = {id: nextId++, name, price};
    data.push(newData);
    res.status(200).send(newData);
});

// Get a tea with id
app.get('/data', (req, res) => {
    res.status(200).send(data);
});

app.get('/data/:id', (req, res) => {
    const entry = (data.find( t => t.id === parseInt(req.params.id)));

    if(!entry){
        return res.status(404).send("Not Found");
    }
    res.status(200).send(entry);
});

// Update data
app.put('/data/:id', (req, res) => {
    const entry = (data.find( t => t.id === parseInt(req.params.id)));

    if(!entry){
        return res.status(404).send("Not Found");
    }

    const {name, price} = req.body;
    entry.name = name;
    entry.price = price;
    res.status(200).send(entry)
})

app.delete('/data/:id', (req, res) => {
    const index = data.findIndex(t => t.id === parseInt(req.params.id));
    if(index === -1){
        return res.status(404).send("Not found");
    } 
    data.splice(index, 1);
    return res.status(201).send(`deleted data with id: ${req.params.id}`);
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}...`);
})