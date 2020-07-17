const users = [];

// Join user to chat
function userJoin(socket_id, userId, room, userName) {
    const user = { socket_id, userId, room, userName };
    const index = users.findIndex(user => user.socket_id === socket_id);
    if (index !== -1) {
        users.splice(index, 1);
        users.push(user);
    } else {
        users.push(user);
    }
    return user;
}

// Get current user
function getCurrentUser(socket_id) {
    return users.find(user => user.socket_id == socket_id);
}

// User leaves chat
function userLeave(socket_id) {
    const index = users.findIndex(user => user.socket_id === socket_id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

function nowUsers() {
    return users;
}

const moment = require('moment');

// function formatMessage(user, message) {
//     return {
//         user,
//         message,
//         time: moment().format('HH:mm')
//     };
// }


const filterPostsByUserId = userId =>
    posts.filter(post => userId === post.authorId);

const filterUsersByUserIds = userIds =>
    users.filter(user => userIds.includes(user.id));

const findUserByUserId = userId => users.find(user => user.id === Number(userId));

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    nowUsers
};