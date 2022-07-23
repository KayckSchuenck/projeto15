import express,{json} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import categoryRouter from '../routes/categoryRoute.js'
import gamesRouter from '../routes/gamesRoute.js'
import customersRouter from '../routes/customersRoute.js'
import rentalsRouter from '../routes/rentalsRoute.js'

dotenv.config()

const server=express()
server.use(cors())
server.use(json())

server.use(categoryRouter)
server.use(gamesRouter)
server.use(customersRouter)
server.use(rentalsRouter)

server.listen(process.env.PORT)