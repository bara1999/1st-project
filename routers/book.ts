import  express  from 'express';
import Book from '../types/book.js';
import fs from "fs/promises";
import { bookValidationMiddleware } from '../midlleware/book.js';

const filePath = new URL('./../../data/books.json', import.meta.url);
let data: Book.Item[] = []


const router = express.Router();


router.post('/', bookValidationMiddleware); 

router.use(async (req, res, next)=>{
    if(data.length===0)
    data = JSON.parse(await fs.readFile(filePath, { encoding: 'utf8' }));
    next()
})

const write=()=>{
  
    const newData=JSON.stringify(data);
    return fs.writeFile(filePath, newData); 

}
router.get('/', (req:Book.Request, res:Book.Response) => {

    //pagination
    const page= parseInt(req.query.page?.toString()|| '1');
    const pageSize= parseInt(req.query.pageSize?.toString()|| '10');
    let newdata=data.slice((page-1)*pageSize, pageSize*page)
    

    // Filter by name if query parameter exists
    const name = req.query.name;
    if (name) {
        newdata = newdata.filter((book) => book.title.toLowerCase().includes((name as string).toLowerCase()));
    }

  // Sort books if sort query parameter exists
  const sort = req.query.sort;
  if (sort) {
    const sortOrder = sort === "asc" ? 1 : -1;
    newdata = newdata.sort((a, b) => sortOrder * (a.title.localeCompare(b.title)));
  }

  res.send( newdata);

});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const book=data.find(r => r.id === +id);
if(book) {
    res.status(200).send(book);
}
else{
    res.status(404).send("not found");
}
});

router.post('/', (req:Book.Request, res:Book.Response) => {
  
    if(!req.body.title || !req.body.author){
        res.status(404).send("Title and id req");
        return;
    }
    const newBook:Book.Item ={
        id:Date.now(),
        author:req.body.author,
        title:req.body.title,
        publicationYear:req.body.publicationYear,
        

    }
    data.unshift(newBook);
    write().then(() => res.status(200).send("Book created"))
    .catch(err => res.status(500).send("Server Error"));
   
});

router.put('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = data.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).send("the id is invalid");
    }

    data[bookIndex] = { ...data[bookIndex], ...req.body };

   
    write().then(() => res.status(200).send('updated'))
    .catch(err => res.status(500).send("Server Error"));
});


router.delete('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = data.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).send("the id is invalid");
    }
    data.splice(bookIndex, 1);
    write().then(() => res.status(200).send('deleted'))
    .catch(err => res.status(500).send("Server Error"));
   
});
export default router;