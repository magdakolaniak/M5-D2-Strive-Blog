import { body } from 'express-validator';

export const postValidation = [
  body('category').exists().withMessage('You have to provide the category'),
  body('title').exists().withMessage('You have to provide the title'),
  body('cover')
    .exists()
    .withMessage('You have to provide the URL')
    .isURL()
    .withMessage('You have to provide valid URL address'),
  body('readTime.value')
    .exists()
    .withMessage('You have to provide a value here')
    .isInt()
    .withMessage('Time must be an integer'),
  body('readTime.unit')
    .exists()
    .withMessage('You have to provide an unit of the time'),
  body('content').exists().withMessage('You have to specify content'),
];
