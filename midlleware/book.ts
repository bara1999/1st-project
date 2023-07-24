import Book from '../types/book.js';
import express from 'express';

const bookValidationMiddleware = (req: Book.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.body.title || !req.body.author || !req.body.publicationYear) {
    res.status(400).send('Title, author and publication year are required');
    return;
  }

  next();
};


export {
  bookValidationMiddleware
}