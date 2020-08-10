const { AuthenticationError} = require('apollo-server-express');



const getMyInfo = async (context)=>{
    if(context.me){
        let myinfo = await context.tools.DB.query('select * from user where id=?',[context.me]);

        return myinfo[0];
    }
    else{
        throw new AuthenticationError('Need login!');
    }

};

const getUserInfo = async(args,context)=>{

    return await context.tools.DB.query('select id, name ,photo ,email from user where id =?', [args.id]);


};




module.exports = {
    getMyInfo,
    getUserInfo

};