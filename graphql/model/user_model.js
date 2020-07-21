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

    try {
        await transaction();

        const emails = await query('SELECT email FROM user WHERE email = ? FOR UPDATE', [email]);
        if (emails.length > 0) {
            await commit();
            return { error: 'Email Already Exists' };
        }
        let hash = crypto.createHash('sha256');
        const user = {
            provider: 'native',
            email: email,
            password: hash.update(password+SecrectKEY).digest('hex'),
            name: name
        };
        const queryStr = 'INSERT INTO user SET ?';
        const result = await query(queryStr, user);
        let id = result.insertId;
        user.id = id;
        const accessToken = jwt.sign({ id, provider: 'native', name, email, }, SecrectKEY, { expiresIn: access_expired });
        user.accessToken =accessToken;
        await commit();
        return { user };
    } catch (error) {
        await rollback();
        return { error };
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
        const accessToken = jwt.sign({ id : user.id , provider: user.provider, name : user.name , email : user.email, loginAt}, SecrectKEY, { expiresIn: access_expired });
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
    let author = 'me';

    try {
        await transaction();
        let cocktail_info = {
            name,
            ori_image,
            description,
            resource : 'Tonight',
            link: '/',
            author,
            ingredients : JSON.stringify(ingredients),
            category ,
            steps: JSON.stringify(steps),
            createdAt: context.tools.moment().format('YYYY/MM/DD HH:mm:ss'),
            authorId : 123
        };
        const createQuery = 'INSERT INTO cocktails SET ?';
        console.log(cocktail_info);

        let cockinsert =  await query(createQuery,cocktail_info);
        cocktail_info.ingredients =ingredients;
        cocktail_info.steps =steps;
        cocktail_info.id = cockinsert.insertId;
        await commit();
        console.log(cocktail_info);
        return cocktail_info ;
    } catch (error) {
        await rollback();
        console.log(error);
        return { error };
    }
};

module.exports = {
    signUp,
    signIn,
    createCocktail

};