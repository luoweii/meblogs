const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const koaConnect = require('koa-connect');
const compression = require('compression');
const router = require('./routers');
const getPort = require('get-port');
const mongoose = require('mongoose');

const dev = process.env.NODE_ENV !== 'production';

mongoose.connect('mongodb://localhost/upage');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {// 连接成功
    setTimeout(() => {
        console.log('connect mongodb success.');
        // var user = new User({ name: "luowei",phone:'18202818863' });
        // user.save();
    }, 1000);
});

const koa = new Koa();
koa.keys = ['luowei'];
koa.use(logger());
koa.use(bodyParser());
koa.use(session(koa));
if (!dev) koa.use(koaConnect(compression()));
koa.use(router.routes());
koa.use(router.allowedMethods());
(async () => {
    let port = await getPort({port: [5000, 5001, 5002, 5003]});
    koa.listen(port, () => {
        console.log(`server is running at http://localhost:${port}, in ${process.env.NODE_ENV || 'dev'}`)
    });
})();

/*
// logger
app.use(async (ctx, next) => {
    console.log('logger start')
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    console.log('time start')
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// response
app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(3000);
*/
