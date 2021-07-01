import { Router } from 'express';
import { getListUser, createUser, updateUser } from '../controllers';

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    users:
 *      type: object
 *      properties:
 *        nit:
 *          type: string
 *          description: numero de cédula del usuario con al menos 7 dígitos
 *        email:
 *          type: string
 *          description: email de acceso del usuario
 *        password:
 *          type: string
 *          description: contraseña alfanumérica de mínimo 8 caracteres
 *      required:
 *        - nit
 *        - email
 *        - password
 *      example:
 *        nit: 1234567
 *        email: email@email.com
 *        password: password123
 */

// Get /api/users
/**
 * /api/users:
 *  get:
 *    summary: Retorna la lista de usuarios registrados
 *    responses:
 *      200:
 *        description: Lista de usuarios
 *        constent:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/users'
 */
router.get('/', getListUser);

// Post /api/users
router.post('/', createUser);

// Put /api/users/:id
router.put('/:id', updateUser);

// Delete /api/users/:id
router.delete('/:id', updateUser);

export { router };
