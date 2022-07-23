import { Router } from "express";
import {getRentals,postRentals,finishRentals,deleteRentals} from "../controllers/rentals.js"
import { rentalsValidation } from "../middlewares/rentalsValidation.js";

const rentalsRouter=Router()

rentalsRouter.get('/rentals',getRentals)
rentalsRouter.post('/rentals',postRentals)
rentalsRouter.post('/rentals/:id/return',rentalsValidation,finishRentals)
rentalsRouter.delete('/rentals/:id',rentalsValidation,deleteRentals)

export default rentalsRouter