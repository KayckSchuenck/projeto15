import { Router } from "express";
import {getRentals,postRentals,finishRentals,deleteRentals} from "../controllers/rentals.js"

const rentalsRouter=Router()

rentalsRouter.get('/rentals',getRentals)
rentalsRouter.post('/rentals',postRentals)
rentalsRouter.post('/rentals/:id/return',finishRentals)
rentalsRouter.delete('/rentals',deleteRentals)

export default rentalsRouter