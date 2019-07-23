const Router = require('koa-router');
const fs = require('fs');

const router = new Router();

router.get('/api/session', async (ctx, next) => {
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    console.log(n);
    ctx.response.body = '<h1>session </h1>' + n
});

const files = fs.readdirSync(__dirname+'/../controllers');
console.log(files);
// 过滤出.js文件:
const js_files = files.filter((file)=>{
    return file.endsWith('.js');
});
// 处理每个js文件:
for (let f of js_files) {
    console.log(`process controller: ${f}...`);
    // 导入js文件:
    let mapping = require('../controllers/' + f);
    for (let url in mapping) {
        if (url.startsWith('GET ')) {
            // 如果url类似"GET xxx":
            let path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            // 如果url类似"POST xxx":
            let path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}


module.exports = router;