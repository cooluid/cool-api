import Router from "koa-router";
import loginController from '../api/LoginController'

const router = new Router()

router.post('/forget', loginController.forget)
router.get('/testapi', loginController.testApi)

export default router