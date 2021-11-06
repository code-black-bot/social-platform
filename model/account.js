const Sequelize  = require('sequelize');
const config = require("../config/database");

const sequelize = new Sequelize(config.database,config.username,config.password,{
    host:config.host,
    port:config.port,
    dialect:config.dialect,
    pool:{
        max:5,
        min:0,
        idle:10000
    }
})

// 用户信息表
const Account = sequelize.define('account',{
    username:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    role:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

Account.sync({force:false});
module.exports = {
    Account
};