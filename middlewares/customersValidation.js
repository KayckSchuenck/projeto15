export async function validateCostumer(req,res,next){
    const schemaCustomers=joi.object({
        name: joi.string().required() ,
        phone: joi.string().min(10).max(11).required(),
        cpf: joi.string().length(11).required(),
        birthday: joi.date().format("YYYY-MM-DD").required(),
    })
    try{
        const validation=schemaCustomers.validate(req.body)
        if(validation.error) return res.sendStatus(400)
        const {cpf}=req.body
        const cpfAlreadyExists=await connection.query('SELECT * FROM customers WHERE cpf=$1',[cpf])
        if(cpfAlreadyExists.rows.length!==0) return res.sendStatus(409)
        next()
    } catch(e){
        res.status(500).send('Erro com o servidor')
    } 
}