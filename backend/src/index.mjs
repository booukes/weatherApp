import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/test/:msg', (req, res)=>{
    if(req.params.msg){
        const message = req.params.msg
        res.json({message: message})
    }
})

app.listen(PORT, ()=>{
    console.log(`Running on Port ${PORT}`)
})

//req param - :param
//access req params - req.params
//req query params - req.query
//destruct query params const {query:{param, param}}=req;
