import express,{json} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import Router from './routes/Routes.js'
import Router from './routes/Routes.js'

dotenv.config()

const server=express()
server.use(cors())
server.use(json())

server.use(Router)
server.use(Router)

server.listen(process.env.PORT)