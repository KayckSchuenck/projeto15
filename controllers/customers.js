import connection from "../src/database.js";

export async function getCustomers(req,res){
    const {cpf}=req.query
    let customers;
  try{
    if(cpf){
        customers = await connection.query('SELECT * FROM customers WHERE cpf LIKE "$1%"',[cpf])
    } else{
        customers = await connection.query('SELECT * FROM customers')
    }
    res.send(customers.rows)
  } catch(e){
      res.status(500).send('Erro com o servidor')
  } 
}

export async function getCustomersId(req,res){
  const {id}=req.params
  try{
    const customers = await connection.query('SELECT * FROM customers WHERE id=$1',[id])
    if (customers.rows.length===0) return res.sendStatus(404)
    res.send(customers.rows)
  } catch(e){
      res.status(500).send('Erro com o servidor')
  } 
}

export async function postCustomers(req,res){
  try{
      const {name,phone,cpf,birthday}=req.body
      await connection.query('INSERT INTO customers (name,phone,cpf,birthday) values ($1,$2,$3,$4)',[name,phone,cpf,birthday])
      res.sendStatus(201)
  } catch(e){
    res.status(500).send('Erro com o servidor')
  } 
}

export async function updateCustomers(req,res){
  const {id}=req.params
  try{
    const {name,phone,cpf,birthday}=req.body
    await connection.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5'[name,phone,cpf,birthday,id])
    res.sendStatus(200)
  } catch(e){
    res.status(500).send('Erro com o servidor')
  } 
}