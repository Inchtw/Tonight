const { UserInputError,ApolloError} = require('apollo-server-express');

require('dotenv').config();
// const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
let access_expired = process.env.TOKEN_EXPIRE;
// const got = require('got');
const SecrectKEY = process.env.SecrectKEY;

const signUp = async (args,context) => {

    let {name, email,password} = args.userInput;
    if(!name||!email||!password){

        throw new UserInputError('Wrong format');

    }

    try {
        await context.tools.DB.transaction();

        const emails = await context.tools.DB.query('SELECT email FROM user WHERE email = ?', [email]);
        if (emails.length > 0) {
            console.log('hi');
            await context.tools.DB.commit();
            throw new UserInputError('Email Already Existed!');
        }
        let hash = crypto.createHash('sha256');
        const user = {
            provider: 'native',
            email: email,
            password: hash.update(password+SecrectKEY).digest('hex'),
            name: name,
            photo: '/imgs/defaultphoto.jpg'
        };
        const queryStr = 'INSERT INTO user SET ?';
        const result = await context.tools.DB.query(queryStr, user);
        let id = result.insertId;
        user.id = id;
        const accessToken = jwt.sign({ id, provider: 'native', name, email, photo: '/imgs/defaultphoto.jpg' }, SecrectKEY, { expiresIn: access_expired });
        user.accessToken =accessToken;
        await context.tools.DB.commit();
        return { user };
    } catch (error) {
        await context.tools.DB.rollback();
        throw  error ;
    }
};

const signIn = async (args,context) => {
    let { email, password } = args.Userlogin;
    let hash = crypto.createHash('sha256');
    try {
        await context.tools.DB.transaction();
        const users = await context.tools.DB.query('select * from user where email = ? AND password = ?', [email , hash.update(password + SecrectKEY).digest('hex') ]);
        if (users.length === 0) {
            await context.tools.DB.commit();
            return new UserInputError( 'Email or password incorrect!');
        }
        const loginAt = new Date();
        let user = users[0];
        const accessToken = jwt.sign({ id : user.id , provider: user.provider, name : user.name , photo : user.photo, email : user.email, loginAt}, SecrectKEY, { expiresIn: access_expired });
        user.accessToken =accessToken;
        await context.tools.DB.commit();
        return user ;
    } catch (error) {
        await context.tools.DB.rollback();
        return { error };
    }
};


const subscribeAuthor =  async (args,context) =>{
    let {me,tools} = context;
    let {SubscribeInput}= args;

    if(me){
        let users = await tools.DB.query('select * from user where id =? ',SubscribeInput.id);
        let check = await tools.DB.query('select * from user_subscribe_join where user_id =? and author_id=? ',[me, SubscribeInput.id]);
        if(check.length===0&&users.length){
            try {
                await tools.DB.transaction();
                await tools.DB.query('INSERT INTO user_subscribe_join SET ?', [ {user_id:me,author_id:SubscribeInput.id}]);
                await tools.DB.commit();
                await context.dataloaders.userLoaders.userSubscriptionsDataLoader.clear(context.me);
                await context.dataloaders.userLoaders.userFollowersDataLoader.clear(+SubscribeInput.id);
                return true;
            } catch (error) {
                console.log(error);
                await tools.DB.rollback();
                return {error};
            }
        }else if(check.length>0){
            try {
                await tools.DB.transaction();
                await tools.DB.query('delete from user_subscribe_join where user_id =? and author_id=?',[me, SubscribeInput.id]);
                await tools.DB.commit();
                await context.dataloaders.userLoaders.userSubscriptionsDataLoader.clear(context.me);
                await context.dataloaders.userLoaders.userFollowersDataLoader.clear(+SubscribeInput.id);
                return false;
            } catch (error) {
                console.log(error);
                await tools.DB.rollback();
                return {error};
            }
        }
        throw new ApolloError('Wrong author id!');

    }
    throw new ApolloError('Need Login to subscribe!');



};


module.exports = {
    signUp,
    signIn,
    subscribeAuthor

};