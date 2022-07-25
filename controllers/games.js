import connection from "../src/database.js"
import joi from 'joi'

export async function getGames(req,res){
    const {name}=req.query
    let games;
    try{
      if(!name){
        games= await connection.query('SELECT games.*,categories.name AS "categoryName" FROM games JOIN categories ON categories.id=games."categoryId"')
      } else{
        games= await connection.query('SELECT games.*,categories.name AS "categoryName" FROM games JOIN categories ON categories.id=games."categoryId" WHERE games.name ILIKE "$1%"',[name])
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
        const categoryExists=await connection.query('SELECT id FROM categories WHERE id=$1',[categoryId])
        if(categoryExists.rows.length===0) return res.sendStatus(400)
        await connection.query('INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)',[name,image,stockTotal,categoryId,pricePerDay])
        res.sendStatus(201)
    } catch(e){
        res.status(500).send('Erro com o servidor')
    } 
}