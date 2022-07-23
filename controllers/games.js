import connection from "../src/database.js"
import joi from 'joi'

export async function getGames(req,res){
    const {name}=req.query
    try{
      let games;
      if(!name){
        games= await connection.query('SELECT games.*,category.name AS "categoryName" FROM games, JOIN category ON games."categoryId"=category.id')
      } else{
        games= await connection.query('SELECT games.*,category.name AS "categoryName" FROM games, JOIN category ON games."categoryId"=category.id WHERE games.name LIKE "$1%"',[name])
      }
      res.send(games.rows)
    } catch(e){
        res.status(500).send('Erro com o servidor')
    } 
}

export async function postGames(req,res){
    const schemaGames=joi.object({
        name: joi.string().required() ,
        image: joi.string().uri().required(),
        stockTotal: joi.number().min(1).required(),
        categoryId: joi.number().required(),
        pricePerDay: joi.number().min(1).required(),
    })
    try{
        const validation=schemaGames.validate(req.body)
        if(validation.error) return res.sendStatus(400)
        const {name,categoryId,image,stockTotal,pricePerDay}=req.body
        const nameAlreadyExists=await connection.query('SELECT * FROM games WHERE name=$1',[name])
        if(nameAlreadyExists.rows.length!==0) return res.sendStatus(409)
        const allCategoryIds=await connection.query('SELECT id FROM categories')
        const categoryExists=allCategoryIds.rows.filter(elem => elem===categoryId)
        if(categoryExists.length===0) return res.sendStatus(400)
        await connection.query('INSERT INTO games (name,image,stockTotal,categoryId,pricePerDay) values ($1,$2,$3,$4,$5)',[name,image,stockTotal,categoryId,pricePerDay])
        res.sendStatus(201)
    } catch(e){
        res.status(500).send('Erro com o servidor')
    } 
}