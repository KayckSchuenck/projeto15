import { Router } from "express";
import {getCustomers,postCustomers,getCustomersId,updateCustomers} from "../controllers/customers.js"
import { validateCostumer } from "../middlewares/customersValidation.js";

const customersRouter=Router()

customersRouter.get('/customers',getCustomers)
customersRouter.get('/customers/:id',getCustomersId)
customersRouter.post('/customers',validateCostumer,postCustomers)
customersRouter.put('/customers/:id',validateCostumer,updateCustomers)

export default customersRouter