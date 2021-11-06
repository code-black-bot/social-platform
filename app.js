const Koa = require('koa')
const jwt = require('koa-jwt');
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const index = require('./routes/index')
const users = require('./routes/users')
const list = require('./routes/list')
const jsonwebtoken = require('jsonwebtoken');
const koajwt = require('koa-jwt');
global.SECRET = 'shared-secret'; // demo，可更换

// var cors = require('cors');
// app.use(
//   cors({
//     origin: '*',
//     maxAge: 5, //指定本次预检请求的有效期，单位为秒。
//     credentials: true, //是否允许发送Cookie
//     allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
//     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
//   })
// );

// 跨域问题 for test
// app.use(async (ctx, next)=> {
//   ctx.set('Access-Control-Allow-Origin', 'http://black.4399.com');
//   ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Accept, X-Requested-With');
//   ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
  
//   if (ctx.method == 'OPTIONS') {
//     ctx.body = 200; 
//   } else {
//     await next();
//   }
// });

// 中间件对token进行验证
// app.use(async (ctx, next) => {
//   return next().catch((err) => {
//       if (err.status === 401) {
//           ctx.status = 401;
//           ctx.body = {
//               code: 401,
//               msg: err.message
//           }
//       } else {
//           throw err;
//       }
//   })
// });

// 中间件对token进行验证
// app.use(async (ctx, next) => {
//   return next().catch((err) => {
//       if (err.status === 401) {
//           ctx.status = 401;
//           ctx.body = {
//               code: 401,
//               msg: err.message
//           }
//       } else {
//           throw err;
//       }
//   })
// });

app.use(jwt({ secret: global.SECRET, passthrough: true }).unless({
    // 登录，注册接口不需要验证
    path: [/^\/login/]
}));

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
// app.use(routeResponse())

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(list.routes(), list.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
app.listen(3004);

module.exports = app
