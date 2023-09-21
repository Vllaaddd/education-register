import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { findSome, getAll, getOne, importAll, removeOne, updateEmployee } from './controllers/EmployeeController.js';
import createDocument from './controllers/DocumentControler.js'
import { employeeValidation, loginValidation } from './validations.js';

import handleValidationErrors from './utils/handleValidationErrors.js';

import { login } from './controllers/UserControler.js'
import { addOneEducation, getAllEducations, getOneEducation, removeOneEducation, updateOneEducation, findSomeEducation } from './controllers/EducationController.js'


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:password123!@cluster0.8fjt6iz.mongodb.net/?retryWrites=true&w=majority')

app.get('/importEmployees/:sheetsId', employeeValidation, importAll)
app.get('/employees', getAll)
app.get('/employees/:id', getOne)
app.get('/employeesByName/:name', findSome)
app.put('/employees/:id', updateEmployee)
app.delete('/employeeDelete/:id', removeOne)

app.post('/auth/login', loginValidation, handleValidationErrors, login)

app.post('/education', addOneEducation)
app.get('/education', getAllEducations)
app.get('/education/:id', getOneEducation)
app.post('/education/:updateId', updateOneEducation)
app.delete('/education/:id', removeOneEducation)
app.get('/educationByName/:name', findSomeEducation)

app.post('/createDocument', createDocument)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});