import { body } from "express-validator";

export const employeeValidation = [
    body('fullName', "Введіть повне ім'я").isString().isLength({min: 6}),
    body('email', "Введіть повне ім'я").isEmail(),
    body('status', "Неправильний статус").isString().isLength({min: 5}),
    body('startOfWork', "Неправильний формат дати").isString({min: 6}),
    body('profession', "Введіть професію").isString().isLength({min: 5}),
    body('schedule', "Введіть графік").isString().isLength({min: 5}),
    body('leader', "Введіть лідера").isString().isLength({min: 5}),
]

export const loginValidation = [
    body('email', "Неправильний формат почти").isEmail(),
]