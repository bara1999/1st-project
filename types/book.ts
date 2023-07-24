import express from "express";
namespace Book{
    export interface Item{
    id: number,
    title: string,
    author: string,
    publicationYear: number

    }
    export interface Request extends express.Request {
        body: {
            title: string,
            author: string,
            publicationYear: number
        }
        query:{
            page: string,
            pageSize: string,
            sort: string,
            name: string
        }
      }
    
      export interface Response extends express.Response { 
        send: (body: string |  Array<Item>   // Item[]
      ) => this
    
      }
    
}

export default Book;