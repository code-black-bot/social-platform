const router = require('koa-router')();
const accountController = require('../controller/account');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

// 登录路由
router.post('/login',accountController.login);
router.post('/account',accountController.addAccount);
router.put('/account',accountController.updateAccount);

module.exports = router
