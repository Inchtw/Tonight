const { AuthenticationError,ForbiddenError, UserInputError,ApolloError} = require('apollo-server-express');

require('dotenv').config();
// const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
let access_expired = process.env.TOKEN_EXPIRE;
// const got = require('got');
const { query, transaction, commit, rollback } = require('../../utils/mysqlcon');
const SecrectKEY = process.env.SecrectKEY;

const signUp = async (args) => {

    let {name, email,password} = args.userInput;
    if(!name||!email||!password){

        throw new UserInputError('Wrong format');

    }

    try {
        await transaction();

        const emails = await query('SELECT email FROM user WHERE email = ?', [email]);
        if (emails.length > 0) {
            console.log('hi');
            await commit();
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
        const result = await query(queryStr, user);
        let id = result.insertId;
        user.id = id;
        const accessToken = jwt.sign({ id, provider: 'native', name, email, photo: '/imgs/defaultphoto.jpg' }, SecrectKEY, { expiresIn: access_expired });
        user.accessToken =accessToken;
        await commit();
        return { user };
    } catch (error) {
        await rollback();
        throw  error ;
    }
};

const signIn = async (args) => {
    let { email, password } = args.Userlogin;
    let hash = crypto.createHash('sha256');
    try {
        await transaction();
        const users = await query('select * from user where email = ? AND password = ?', [email , hash.update(password + SecrectKEY).digest('hex') ]);
        if (users.length === 0) {
            await commit();
            return { error: 'Email or password incorrect!' };
        }
        const loginAt = new Date();
        let user = users[0];
        const accessToken = jwt.sign({ id : user.id , provider: user.provider, name : user.name , photo : user.photo, email : user.email, loginAt}, SecrectKEY, { expiresIn: access_expired });
        user.accessToken =accessToken;
        await commit();
        return user ;
    } catch (error) {
        await rollback();
        return { error };
    }
};


const createCocktail = async (args,context) =>{
    let {name, ori_image,description,category,ingredients,steps} = args.cocktailInput;
    let author_id = context.me;

    try {
        await transaction();
        let authors =  await query('Select name from user where id = ?',author_id);
        let author= authors[0];
        let cocktail_info = {
            name,
            ori_image,
            description,
            resource : 'Tonight',
            author_id ,
            author : author.name,
            ingredients : JSON.stringify(ingredients),
            category ,
            steps: JSON.stringify(steps),
            createdAt: context.tools.moment().format('YYYY/MM/DD HH:mm:ss'),
        };
        const createQuery = 'INSERT INTO cocktails SET ?';

        console.log(cocktail_info);

        let cockinsert =  await query(createQuery,cocktail_info);
        cocktail_info.link = `detail.html?id=${cockinsert.insertId}`;
        cocktail_info.ingredients =ingredients;
        cocktail_info.steps =steps;
        cocktail_info.id = cockinsert.insertId;
        // need to update link
        await commit();
        console.log(cocktail_info);
        return cocktail_info ;
    } catch (error) {
        await rollback();
        console.log(error);
        return { error };
    }
};


const commentCocktail = async (args,context) =>{

    if(context.me){
        let { cocktail_id,rank,comment,img,title} = args.commentInput;
        let user_id = context.me;
        try {
            let commentInfos = {  user_id,cocktail_id,rank,comment,img,title};
            await transaction();
            const commentQuery = 'INSERT INTO comments SET ?';

            let commentInfo =  await query(commentQuery,commentInfos);
            await query('UPDATE cocktails SET comment = IFNULL(comment, 0) +1 WHERE id = ? ', cocktail_id);
            await query(`UPDATE cocktails SET cocktails.rank = (SELECT AVG(comments.rank) 
            FROM comments where comments.cocktail_id = ?
            ) WHERE id = ? `, [cocktail_id,cocktail_id]);
            await commit();
            console.log(commentInfo);
            return commentInfos;
        } catch (error) {
            await rollback();
            console.log(error);
            return { error };
        }
    }
    throw new ApolloError('need login');



};

module.exports = {
    signUp,
    signIn,
    createCocktail,
    commentCocktail

};