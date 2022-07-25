import connection from "../src/database.js"

export async function rentalsValidation(req,res,next){
    const {id}=req.params
    const {rows:rentExists}=await connection.query(`
    SELECT * FROM rentals WHERE id=$1`,[id])
    if(rentExists.length===0) return res.sendStatus(404)
    res.locals.exists=rentExists[0]
    next()
}