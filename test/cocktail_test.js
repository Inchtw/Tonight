require('dotenv').config();
const {request,expect} = require('./setting.js');
const {cocktails} = require('./fake_data');
const {users} = require('./fake_data');
const user1 = users[0];
const user = {
    email: user1.email,
    password: user1.password
};

describe('cocktails check', () => {
    it('create cocktail',async () => {
        const res = await request
            .post('/graphql')
            .send({ query: `mutation Login($email: String!, $password: String!) {
                login(Userlogin: {email: $email, password: $password }) {
                  id
                  accessToken
                  name
                }
              }
              `,variables:user})
            .expect(200);
        expect(res.body.data.login).to.have.property('accessToken');
        const {accessToken} = res.body.data.login;
        const cocktail = {
            name: 'cokc',
            ori_image: '123',
            description: '1234',
            ingredients: ['123','123'],
            steps: ['123','1234'],
            category: 'nothing',
        };

        await request
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer '+ accessToken)
            .send({ query: `mutation createcocktail( $name: String!, $ori_image: String! , $description: String, $ingredients: [String!], $steps: [String!]!, $category :String!) {
                createCocktail(cocktailInput: {name: $name , ori_image:$ori_image , description: $description,ingredients:$ingredients,steps:$steps,category:$category}) {
                  id
                  name
                  
                }}`,variables:cocktail})

            .expect(200);
    });
    it('create comment',async () => {
        const res = await request
            .post('/graphql')
            .send({ query: `mutation Login($email: String!, $password: String!) {
                login(Userlogin: {email: $email, password: $password }) {
                  id
                  accessToken
                  name
                }
              }
              `,variables:user})
            .expect(200);
        expect(res.body.data.login).to.have.property('accessToken');
        const {accessToken} = res.body.data.login;
        const comment = {
            cocktail_id: 4,
            comment: 'wowwowow',
            rank :5,
            img: 'https://inch-stylish.s3.ap-southeast-1.amazonaws.com/User/Cockctails/1/comments/21/1596417382713.jpeg',
            title: 'good' ,
        };
        let commentRes = await request
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer '+ accessToken)
            .send({ query: `mutation comment(
            $cocktail_id: ID!
            $img: String!
            $comment: String
            $rank: Int!
            $title: String
          ) {
            commentCocktail(
              commentInput: {
                cocktail_id: $cocktail_id
                img: $img
                comment: $comment
                rank: $rank
                title: $title
              }
            ) {
              comment
              rank
            }
          }
          `,variables:comment})
            .expect(200);
        expect(commentRes.body.data.commentCocktail).to.have.property('comment');

    });

    it('cocktail paging', async () => {
        const res = await request
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ query: `
            {   categories  
                reciepesPaging(
                  first: 9
                  after: 0
                  ingredient: ""
                  category: ""
                  author: ""
                  sort: "DESC"
                ) {
                  edges {
                    cursor
                    node {
                      id
                      name
                      ori_image
                      category
                      resource
                      link
                      likes
                      rank
                      views
                      comment
                    }
                  }
                  pageInfo {
                    totalPageCount
                    hasNextPage
                    hasPreviousPage
                  }
                }
              }
              ` })
            .expect(200);
        expect(res.body.data).to.have.property('categories');
        expect(res.body.data).to.have.property('reciepesPaging');

    }
    );





});


