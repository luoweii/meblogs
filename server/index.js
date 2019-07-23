const Koa = require('koa');
const app = new Koa();

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