const captcha = require('trek-captcha');
const User = require('../models/user');
const sha1 = require('sha1');
const state = require('../state');

let findUser = phone => new Promise((resolve, reject) => {
    User.findOne({phone}, (err, doc) => {
        if (err) {
            reject(err);
        }
        resolve(doc);
    });
});

module.exports = {
    //图片验证码
    'GET /api/captcha': async (ctx, next) => {
        await next();
        const {token, buffer} = await captcha();
        ctx.body = buffer;
        ctx.type = 'image/png';
        ctx.session.captcha = token;
    },
    //用户注册
    'POST /api/register': async (ctx, next) => {
        await next();
        let captcha = ctx.request.body.captcha;
        if (captcha !== ctx.session.captcha) {
            ctx.body = {
                state: state.state_failed,
                msg: '图片验证码错误',
            };
            return;
        }
        let doc = await findUser(ctx.request.body.phone);
        if (doc) {
            ctx.status = 200;
            ctx.body = {
                state: state.state_failed,
                msg: '用户已存在',
            };
        } else {
            let user = new User({
                phone: ctx.request.body.phone,
                password: sha1(ctx.request.body.password), //加密
            });
            await new Promise((resolve, reject) => {
                user.save((err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
            ctx.status = 200;
            ctx.body = {
                state: state.state_success,
                msg: '注册成功'
            }
        }
    },
    //用户登录
    'POST /api/login':async (ctx, next) =>{
        await next();
        let captcha = ctx.request.body.captcha;
        if (captcha !== ctx.session.captcha) {
            ctx.body = {
                state: state.state_failed,
                msg: '图片验证码错误',
            };
            return;
        }

        let phone = ctx.request.body.phone;
        let password = sha1(ctx.request.body.password);
        let doc = await findUser(phone);
        if(!doc){
            ctx.status = 200;
            ctx.body = {
                state: state.state_failed,
                msg: '用户不存在'
            }
        }else if(doc.password === password){
            ctx.status = 200;
            ctx.body = {
                state: state.state_success,
                msg: '登录成功'
            };
        }else{
            ctx.status = 200;
            ctx.body = {
                state: state.state_failed,
                msg: '密码错误'
            };
        }
    },
    //根据手机号获取用户信息
    'GET /api/user/:phone': async (ctx, next) => {
        let phone = ctx.params.phone;
        findUser(phone);
    },
};
