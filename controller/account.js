const { username } = require('../config/database');
const AccountService = require('../service/account');
const jsonwebtoken = require('jsonwebtoken');

const login = async(ctx,next)=>{
    const { username,password } = ctx.request.body;

    if(username==='' || password===''){
        ctx.body = {
            status:-1,
            msg:'请填写用户名和密码'
        }
        return
    }
    await AccountService.getAccountByUserName(username).then(res=>{
        let account = res[0];
        if(!account){
            ctx.body = {
                status:-2,
                msg:'用户名不存在'
            }
            return
        }
        if(account.password !== password){
            ctx.body = {
                status:-3,
                msg:"密码错误"
            }
            return
        }
        const token = jsonwebtoken.sign(username, global.SECRET)
        //添加鉴权
        ctx.body = {
            status:0,
            msg:'登录成功',
            token:token
        }
    })
};
const addAccount = async (ctx,next)=>{
    const account = ctx.request.body;
    const count = AccountService.getAccountByUserName(account,username);
    ctx.type = 'json';
    if(count){
        ctx.body = {
            status:1,
            msg:'当前用户名已经存在！'
        }
    } else {
        await AccountService.createAccount(account);
        ctx.type = 'json';
        ctx.body = {
            status:0,
            msg:'创建成功！'
        }
    }
}
const updateAccount = async(ctx,next)=>{
    const id = ctx.params.id;
    const account = ctx.request.body;
    await AccountService.updateAccount(id,account);
    ctx.type = 'json';
    ctx.body = {
        status:0,
        msg:'更新成功！'
    };
}

module.exports={ login,addAccount,updateAccount };