const routeResponse = function(){
    return async (ctx,next)=>{
        ctx.type = 'json';
        ctx.success = function(data,msg){
            ctx.body = {
                code : 0,
                msg : msg,
                data : data
            }
        }
        ctx.fail = function(msg){
            ctx.body = {
                code:-1,
                msg:msg
            }
        }
        await next();
    }
}

module.exports = routeResponse 