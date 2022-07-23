import connection from '../src/database.js'
import joi from 'joi';
import dayjs from 'dayjs';

export async function getRentals(req,res){
    const {customerId,gameId}=req.query
    let rentals;
    try{
        if(customerId&&gameId) {
            rentals= await connection.query(`
            SELECT rentals.*,customers.name AS "customerName",games.name AS "gameName",games."categoryId",categories.name AS "categoryName" FROM rentals JOIN customers ON customers.id=rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id=games."categoryId" WHERE gameId=$1 AND customerId=$2
            `,[gameId,customerId])
        }
        if(gameId&&!customerId){
            rentals= await connection.query(`
            SELECT rentals.*,customers.name AS "customerName",games.name AS "gameName",games."categoryId",categories.name AS "categoryName" FROM rentals JOIN customers ON customers.id=rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id=games."categoryId" WHERE gameId=$1
            `,[gameId])
        }
        if(!gameId&&customerId){
            rentals= await connection.query(`
            SELECT rentals.*,customers.name AS "customerName",games.name AS "gameName",games."categoryId",categories.name AS "categoryName" FROM rentals JOIN customers ON customers.id=rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id=games."categoryId" WHERE customerId=$1
            `,[customerId])
        }
        if(!gameId&&!customerId){
            rentals= await connection.query(`
            SELECT rentals.*,customers.name AS "customerName",games.name AS "gameName",games."categoryId",categories.name AS "categoryName" FROM rentals JOIN customers ON customers.id=rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id=games."categoryId"
            `)
        }
        
        const joinRentals=rentals.rows.map(elem=> {
            return {
                ...elem,
                customer:{
                    id:elem.customerId,
                    name:elem.customerName
                },
                game:{
                    id:elem.gameId,
                    name:elem.gameName,
                    categoryId:elem.categoryId,
                    categoryName:elem.categoryName
                }
            }
        })
        joinRentals.forEach(elem=>{
            delete elem.customerName
            delete elem.gameName
            delete elem.categoryId
            delete elem.categoryName
        })
        res.send(joinRentals)
    } catch(e){
        res.status(500).send('Erro com o servidor')
    } 
}

export async function postRentals(req,res){
    const schemaRentals=joi.object({
        customerId:joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().integer().min(1).required(),
    })
    try{
        const validation=schemaRentals.validate(req.body)
        if(validation.error) return res.sendStatus(400)
        const {customerId,gameId,daysRented}=req.body
        const {rows:customerExists}=await connection.query(`
        SELECT id FROM customers WHERE id=$1`,[customerId])
        const {rows:gameQuery}=await connection.query(`
        SELECT id,pricePerDay,stockTotal FROM games WHERE id=$1`,[gameId])
        if(gameQuery.length===0||customerExists.length===0) return res.sendStatus(400)
        const {rows:numberRentals}=await connection.query(`
        SELECT * FROM rentals WHERE "gameId"=$1`,[gameQuery[0].id])
        if(numberRentals.length>=gameQuery[0].stockTotal) return res.sendStatus(400)
        const originalPrice=daysRented*gameQuery[0].pricePerDay
        const rentDate=dayjs().format("YYYY-MM-DD")
        await connection.query(`INSERT INTO rentals (customerId,gameId,rentDate,daysRented,returnDate,originalPrice,delayFee) VALUES ($1,$2,$3,$4,$5,$6,$7)`,[customerId,gameId,rentDate,daysRented,null,originalPrice,null])
        res.sendStatus(201)
    } catch(e){
        res.status(500).send('Erro com o servidor')
    } 
}

export async function deleteRentals(req,res){
    const {id}=req.params
    const {rows:rentExists}=await connection.query(`
    SELECT id,returnDate FROM rentals WHERE id=$1`,[id])
    if(rentExists.length===0) return res.sendStatus(404)
    if(!rentExists[0].returnDate) return res.sendStatus(400)
    res.sendStatus(200)
}
    