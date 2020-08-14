const users = [
    {
        id: 1,
        provider: 'native',
        email: 'test1@gmail.com',
        password: 'test1password',
        name: 'test1',
        photo: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
    },
    {
        id:2,
        provider: 'native',
        email: 'test2@gmail.com',
        password: 'test2passwod',
        name: 'test2',
        photo: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
    },
    {
        id:3,
        provider: 'native',
        email: 'test3@gmail.com',
        password: 'test3passwod',
        name: 'test3',
        photo: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
    },
];

const cocktails = [
    {
        category: 'Vodka',
        name: 'cocktail1',
        description: 'cocktail1 1',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 PartWhiskey","1 PartTequila","1 PartEverclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',
        createdAt: '2020/08/02 13:57:55',
        author_id : 1
    },
    {
        category: 'Rum',
        name: 'cocktail2',
        description: 'cocktail1 2',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 PartWhiskey","1 PartTequila","1 PartEverclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',

        createdAt: '2020/08/02 13:57:55',
        author_id : 1
    },
    {
        category: 'Gin',
        name: 'cocktail3',
        description: 'cocktail1 3',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 PartWhiskey","1 PartTequila","1 PartEverclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',

        createdAt: '2020/08/02 13:57:55',
        author_id : 1
    },
    {
        category: 'Vodka',
        name: 'cocktail4',
        description: 'cocktail1 4',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 PartWhiskey","1 PartTequila","1 PartEverclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',

        createdAt: '2020/08/02 13:57:55',
        author_id : 2
    },
    {
        category: 'Rum',
        name: 'cocktail 5',
        description: 'cocktail5  5',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 PartWhiskey","1 PartTequila","1 PartEverclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',

        createdAt: '2020/08/02 13:57:55',
        author_id : 2
    },
    {
        category: 'Gin',
        name: 'cocktail6',
        description: 'cocktail1 6',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 PartWhiskey","1 PartTequila","1 PartEverclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',

        createdAt: '2020/08/02 13:57:55',
        author_id : 2
    },
    {
        category: 'Vodka',
        name: 'cocktail7',
        description: 'cocktail7 1',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 PartWhiskey","1 PartTequila","1 PartEverclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',

        createdAt: '2020/08/02 13:57:55',
        author_id : 3
    },
    {
        category: 'Rum',
        name: 'cocktail8',
        description: 'cocktail8 2',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 PartWhiskey","1 PartTequila","1 PartEverclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',

        createdAt: '2020/08/02 13:57:55',
        author_id : 3
    },
    {
        category: 'Gin',
        name: 'cocktail9',
        description: 'cocktail1 9',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 Part Whiskey","1 Part nTequila","1 Part\Everclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',

        createdAt: '2020/08/02 13:57:55',
        author_id : 3
    },
    {
        category: 'Gin',
        name: 'cocktail9',
        description: 'cocktail1 9',
        ori_image: 'https://inch-stylish.s3-ap-southeast-1.amazonaws.com/User/default/defaultimg.jpg',
        resource: 'Tonight',
        link: 'https://tonight-drink.website/',
        author: 'test',
        ingredients: '["1 Part Whiskey","1 Part Tequila","1 Partverclear"]',
        steps: '["In an ice filled glass combine liquors and shake well to mix.","Strain into shot glass."]',

        createdAt: '2020/08/02 13:57:55',
        author_id : 3
    }
];

const comments = [
    {
        user_id: 1,
        cocktail_id: 4,
        comment: 'wowwowow',
        rank :3,
        img: 'https://inch-stylish.s3.ap-southeast-1.amazonaws.com/User/Cockctails/1/comments/21/1596417382713.jpeg',
        title: 'good' ,
    },
    {
        user_id: 2,
        cocktail_id: 1,
        comment: 'wowwowow',
        rank :4,
        img: 'https://inch-stylish.s3.ap-southeast-1.amazonaws.com/User/Cockctails/1/comments/21/1596417382713.jpeg',
        title: 'good' ,
    },{
        user_id: 3,
        cocktail_id: 5,
        comment: 'wowwowow',
        rank :5,
        img: 'https://inch-stylish.s3.ap-southeast-1.amazonaws.com/User/Cockctails/1/comments/21/1596417382713.jpeg',
        title: 'good' ,
    },
];




module.exports = {
    users,
    cocktails,
    comments
};