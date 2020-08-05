module.exports = {
    newUser : {
        subscribe :  async (parent,args,{ pubsub})=>{
            return pubsub.asyncIterator('NewUser');
        }
    },
    newViewer:{
        subscribe :  async(parent,args,{ pubsub})=>{
            return await pubsub.asyncIterator('new_viewer');
        }
    }
};