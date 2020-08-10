require('dotenv').config();
const {request,expect} = require('./setting.js');
const {users} = require('./fake_data');


describe('users sign up sign in check', () => {

    it('sign up',(done) => {
        const user = {
            name: 'testShouldPass',
            email: 'testShouldPass@gmail.com',
            password: 'password'
        };

        request
            .post('/graphql')
            .send({ query: `mutation createser($email: String!, $password: String!,$name:String!) {
            createUser(userInput: {email: $email, password: $password ,name :$name}) {
              id
              accessToken
            }
          }`,variables:user})

            .expect(200)
            .end((err,res) => {
                if (err) {return done(err);}
                expect(res.body.data.createUser).to.have.property('id');
                expect(res.body.data.createUser).to.have.property('accessToken');
                done();
            });
    });

    it('sign up without name or email or password', async () => {
        const user1 = {
            email: 'testNoName@gmail.com',
            password: 'password'
        };
        const user2 = {
            name: 'testNoMail',
            password: 'password'
        };
        const user3 = {
            name: 'testNoPassword',
            email: 'testNoPassword@gmail.com',
        };
        await request
            .post('/graphql')
            .send({ query: `mutation createser($email: String!, $password: String!,$name:String!) {
                createUser(userInput: {email: $email, password: $password ,name :$name}) {
                  id
                  accessToken
                }
              }`,variables:user1})
            .expect(400);
        await request
            .post('/graphql')
            .send({ query: `mutation createser($email: String!, $password: String!,$name:String!) {
                createUser(userInput: {email: $email, password: $password ,name :$name}) {
                  id
                  accessToken
                }
              }`,variables:user2})
            .expect(400);

        await request
            .post('/graphql')
            .send({ query: `mutation createser($email: String!, $password: String!,$name:String!) {
                createUser(userInput: {email: $email, password: $password ,name :$name}) {
                  id
                  accessToken
                }
              }`,variables:user3})
            .expect(400);
    });

    /**
     * Native Sign In
     */

    it('native sign in with correct password', async () => {
        const user1 = users[0];
        const user = {
            email: user1.email,
            password: user1.password
        };
        let res = await request
            .post('/graphql')
            .send({ query: `mutation Login($email: String!, $password: String!) {
                login(Userlogin: {email: $email, password: $password }) {
                  id
                  accessToken
                  name
                }
              }
              `,variables:user});
        const data = res.body.data;
        expect(data.login).to.have.property('id');
        expect(data.login).to.have.property('accessToken');
    });

    it('native sign in without email or password', async () => {
        const user1 = users[0];
        const userNoEmail = {
            password: user1.password
        };

        let res = await request
            .post('/graphql')
            .send({ query: `mutation Login($email: String!, $password: String!) {
                login(Userlogin: {email: $email, password: $password }) {
                  id
                  accessToken
                  name
                }
              }
              `,variables:userNoEmail})
            .expect(400);
        expect(res.body).to.have.own.property('errors');
        const userNoPassword = {
            email: user1.email,
        };

        let res2 = await request
            .post('/graphql')
            .send({ query: `mutation Login($email: String!, $password: String!) {
                login(Userlogin: {email: $email, password: $password }) {
                  id
                  accessToken
                  name
                }
              }
              `,variables:userNoPassword})
            .expect(400);
        expect(res2.body).to.have.own.property('errors');
    });

    it('native sign in with wrong password', async () => {
        const user1 = users[0];
        const user = {
            email: user1.email,
            password: 'wrong password'
        };
        let res = await request
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ query: `mutation Login($email: String!, $password: String!) {
            login(Userlogin: {email: $email, password: $password }) {
              id
              accessToken
              name
            }
          }
          `,variables:user});
        expect(res.body).to.have.own.property('errors');
    });

    it('native sign in with malicious password', async () => {
        const user1 = users[0];
        const user = {
            email: user1.email,
            password: '" OR 1=1; -- '
        };
        let res = await request
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ query: `mutation Login($email: String!, $password: String!) {
        login(Userlogin: {email: $email, password: $password }) {
          id
          accessToken
          name
                 }
                }
             `,variables:user});
        expect(res.body).to.have.own.property('errors');
    });

});




