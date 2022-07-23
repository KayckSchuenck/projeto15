import connection from "../src/database.js";

export async function getCategory(req,res){
  try{
    const {name}=req.body
    if(!name) res.sendStatus(400)
    const category = await connection.query('SELECT * FROM categories')
    res.send(category.rows)
  } catch(e){
      res.status(500).send('Erro com o servidor')
  } 
}

export async function postCategory(req,res){
    try{
        const {name}=req.body
        const alreadyExists=await connection.query('SELECT * FROM categories WHERE name=$1',[name])
        if(alreadyExists.rows.length!==0) return res.sendStatus(409)
        await connection.query('INSERT INTO categories (name) VALUES ($1)',[name])
        res.sendStatus(201)
    } catch(e){
        res.status(500).send('Erro com o servidor')
    } 
    
}
