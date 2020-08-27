require('dotenv').config();
const {request, expect} = require('./setting.js');
const {users} = require('./fake_data');
const user1 = users[0];
const user = {
  email: user1.email,
  password: user1.password,
};

describe('get profile with login status', () => {
  it('sign in get my profile', async () => {
    const res = await request
        .post('/graphql')
        .send({query: `mutation Login($email: String!, $password: String!) {
                login(Userlogin: {email: $email, password: $password }) {
                  id
                  accessToken
                  name
                }
              }
              `, variables: user})
        .expect(200);
    expect(res.body.data.login).to.have.property('accessToken');
    const {accessToken} = res.body.data.login;
    await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '+ accessToken)
        .send({query: ` {
                me{
                  id
                  name
                  photo
                  post{
                    id
                    name
                    likes
                    rank
                    resource
                    ori_image
                    category
                    resource
                    link
                    likes
                    views
                    comment
                  }
                  subscriptions
                  {
                    name
                    photo
                    id
                    post{
                        id
                    }
                    likes{
                        id
                    }
                    followers{
                        id
                    }
                  }
                  followers{
                    name
                    photo
                    id
                    post{
                        id
                    }
                    likes{
                        id
                    }
                    followers{
                        id
                    }
                  }
                  likes{
                    id
                    name
                    likes
                    rank
                    resource
                    ori_image
                    category
                    resource
                    link
                    likes
                    views
                    comment
                  }
                }
              }
              `})
        .expect(200);
  });
  it('get my profile without sign in', async () => {
    const res = await request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({query: ` {
                me{
                  id
                  name
                  photo
                  post{
                    id
                    name
                    likes
                    rank
                    resource
                    ori_image
                    category
                    resource
                    link
                    likes
                    views
                    comment       
                  }
                  subscriptions
                  {
                    name
                    photo
                    id
                    post{
                        id
                    }
                    likes{
                        id
                    }
                    followers{
                        id
                    }
                  }
                  followers{
                    name
                    photo
                    id
                    post{
                        id
                    }
                    likes{
                        id
                    }
                    followers{
                        id
                    }
                  }
                  likes{
                    id
                    name
                    likes
                    rank
                    resource
                    ori_image
                    category
                    resource
                    link
                    likes
                    views
                    comment
                  }
                }
              }
              `});
    expect(res.body).to.have.own.property('errors');
  });
  it('get other profile without sign in', async () => {
    const res = await request
        .post('/graphql')
        .send({query: ` {
                users(id:${user1.id}){
                  id
                  name
                  photo
                  post{
                    id
                    name
                    likes
                    rank
                    resource
                    ori_image
                    category
                    resource
                    link
                    likes
                    views
                    comment
                  }
                  subscriptions
                  {
                    name
                    photo
                    id
                    post{
                        id
                    }
                    likes{
                        id
                    }
                    followers{
                        id
                    }
                  }
                  followers{
                    name
                    photo
                    id
                    post{
                        id
                    }
                    likes{
                        id
                    }
                    followers{
                        id
                    }
                  }
                  likes{
                    id
                    name
                    likes
                    rank
                    resource
                    ori_image
                    category
                    resource
                    link
                    likes
                    views
                    comment
                  }
                }
              }
              `})
        .expect(200);
  });
});
