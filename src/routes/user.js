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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Recupera una lista de usuarios.
 *     description: Recupera una lista de usuarios. Se pueden enviar querys para filtrar ó ordenar los datos a recuperar, tambien como para paginarlos.
 *     responses:
 *       200:
 *         description: Una lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Id del usuario.
 *                         example: 1
 *                       firstName:
 *                         type: string
 *                         description: Nombre del usuario.
 *                         example: Lindo
 *                       lastName:
 *                         type: string
 *                         description: Apellido del usuario.
 *                         example: Hermoso
 *                       username:
 *                         type: string
 *                         description: Usuario.
 *                         example: lindohermoso
 *                       password:
 *                         type: string
 *                         description: Contraseña del usuario.
 *                         example: repollo123
 *                       email:
 *                         type: string
 *                         description: Correo del usuario.
 *                         example: lindohermoso@email.com
 *                       nit:
 *                         type: string
 *                         description: Nit del usuario.
 *                         example: 1234567890
 *                       state:
 *                         type: string
 *                         description: Estado del usuario.
 *                         example: ACTIVE
 */
router.get('/', getListUser);

// Post /api/users
router.post('/', createUser);

// Put /api/users/:id
router.put('/:id', updateUser);

// Delete /api/users/:id
router.delete('/:id', updateUser);

export { router };
