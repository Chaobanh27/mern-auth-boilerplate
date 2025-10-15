import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { roleCheckingMiddleware } from '~/middlewares/roleCheckingMiddleware'

const Router = express.Router()

//lưu ý: route refresh token phải để trên cùng nếu không sẽ sinh ra lỗi API refresh token sẽ bị lỗi 410 luôn nên không hoạt động
Router.route('/refresh_token')
  .get(userController.refreshToken)
Router.route('/get_2fa_qr_code')
  .get(authMiddleware.isAuthorized, userController.get2FaQrCode)
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: đăng ký người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Thành công
 */
Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: đăng nhập người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Thành công
 */
Router.route('/login')
  .post(userValidation.login, userController.login)

/**
 * @swagger
 * /users/logout:
 *   delete:
 *     summary: đăng xuất người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Thành công
 */
Router.route('/logout')
  .delete(authMiddleware.isAuthorized, userController.logout)

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: cập nhật người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Thành công
 */
Router.route('/update')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('avatar'),
    userValidation.update,
    userController.update
  )

Router.route('/get_all_users')
  .get(
    authMiddleware.isAuthorized,
    roleCheckingMiddleware.isValidPermission(['user_read']),
    userController.getAllUsers
  )

Router.route('/get_all_roles')
  .get(
    authMiddleware.isAuthorized,
    userController.getAllRoles
  )

Router.route('/forgot-password')
  .post(userController.forgotPassword)
Router.route('/reset-password')
  .post(userController.resetPassword)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/setup_2fa')
  .post(authMiddleware.isAuthorized, userController.setup2FA)

Router.route('/verify_2fa')
  .put(authMiddleware.isAuthorized, userController.verify2FA)
Router.route('/:id')
  .get(authMiddleware.isAuthorized, userController.getUser)
export const userRoute = Router