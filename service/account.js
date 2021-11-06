const { Account } = require('../model/account');

class AccountService{
    // id查询
    async getAccountById(id){
        return Account.findAll({
            where:{
                id:id
            }
        })
    }
    // username查询
    async getAccountByUserName(name){
        return Account.findAll({
            where:{
                username:name
            }
        })
    }
    // 创建账户
    async createAccount(account){
        return Account.create(account);
    }
    // 更新账户
    async updateAccount(id,account){
        const item = await this.getAccountById(id);
        if(item){
            return item.update(account);
        } else {
            throw new Error('the account is not exist');
        }
    }
}

module.exports = new AccountService();