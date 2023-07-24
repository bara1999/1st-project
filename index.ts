// const fs = require("fs")
// const path = require("path")
import fs from "fs/promises"
import express from 'express';
import bookRouter from './routers/book.js'

//import { loggerMiddleware } from './middlewares/generic.js';


const app = express();//consturctor
const port=3000;

app.use(express.json());

//app.use(loggerMiddleware); // just tp logs users path we add peth

app.get('/', async (req, res) =>{
    const filePath = new URL('./../data/books.json', import.meta.url);
    // const contents = await readFile(filePath, { encoding: 'utf8' });
  
    const data = JSON.parse(await fs.readFile(filePath, { encoding: 'utf8' }));
    console.log(data[0])
    res.send("Hello" + data[0].title);
});

app.use('/book',bookRouter);

app.use((req, res) =>{
    res.status(404).send("NotFound");
})//اي ريكويست يعني رابط مش موجود اصلا عندي بصير يعطيني هيك
//http://localhost:3000/ta
app.listen(port,()=>{
console.log(` the app run on ${port}`);

});
