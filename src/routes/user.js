import { Router } from 'express';
import * as userController from '../controllers/user';

const userRouter = Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - firstName
 *       - lastName
 *       - username
 *       - password
 *       - email
 *       - documentNumber
 *       - state
 *     properties:
 *       id:
 *         type: integer
 *         description: Id del usuario.
 *         example: 1
 *       firstName:
 *         type: string
 *         description: Nombre del usuario.
 *         example: Lindo
 *       lastName:
 *         type: string
 *         description: Apellido del usuario.
 *         example: Hermoso
 *       username:
 *         type: string
 *         description: Usuario.
 *         example: lindohermoso
 *       password:
 *         type: string
 *         description: Contraseña del usuario.
 *         example: repollo123
 *       email:
 *         type: string
 *         description: Correo del usuario.
 *         example: lindohermoso@email.com
 *       documentNumber:
 *         type: string
 *         description: Nit del usuario.
 *         example: 1234567890
 *       state:
 *         type: string
 *         description: Estado del usuario.
 *         example: ACTIVE
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Recupera una lista de usuarios.
 *     description: Recupera una lista de usuarios.
 *     tags:
 *       - Usuarios
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
 *                     $ref: '#/definitions/User'
 *       409:
 *         description: Una estructura con informacion de los inconvenientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensage de informacion.
 *                   example: No se pudo obtener una lista de usuarios
 */
userRouter.get('/', userController.getListUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un usuario.
 *     description: Crea un usuario en la base de datos.
 *     tags:
 *       - Usuarios
 *     parameters:
 *     - in: body
 *       name: user
 *       description: El usuario para crear.
 *       schema:
 *         $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: El suario que se creó.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/definitions/User'
 *       409:
 *         description: Una estructura con informacion de los inconvenientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensage de informacion.
 *                   example: No se pudo crear el usuario.
 */
userRouter.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario.
 *     description: Actualizar un usuario en la base de datos.
 *     tags:
 *       - Usuarios
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Id numerico del usuario que se va a actualizar
 *        schema:
 *          type: integer
 *        required: true
 *      - in: body
 *        name: user
 *        description: Los campos del usuario para actualizar.
 *        schema:
 *          $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: El usuario con los campos actualizados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/definitions/User'
 *       409:
 *         description: Una estructura con informacion de los inconvenientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensage de informacion.
 *                   example: No se pudo actualizar el usuario.
 */
userRouter.put('/:id', userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario.
 *     description: Eliminar un usuario en la base de datos (desactivar).
 *     tags:
 *       - Usuarios
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Id numerico del usuario que se va a eliminar
 *        schema:
 *          type: integer
 *        required: true
 *     responses:
 *       200:
 *         description: El usuario con los campos actualizados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/definitions/User'
 *       409:
 *         description: Una estructura con informacion de los inconvenientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensage de informacion.
 *                   example: No se pudo actualizar el usuario.
 */
userRouter.delete('/:id', userController.updateUser);

export default userRouter;
