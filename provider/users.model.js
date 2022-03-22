import initModels from "../models/init-models.js";
import database from "../config/database.js";
const models = initModels(database);
export default {
    async findAllUser(offset, size){
        const users= await models.userTable.findAll({offset: offset, limit: size});
      
        for(var i = 0 ;i<users.length;i++){
            delete users[i].dataValues.password;
        }
        return users;
    },
    async findUserByEmail(email){
        const newUser = await models.userTable.findAll({
            where:{
                email:email,
            }
        });
        return newUser;
    },
    async addNewUser(user){
        await models.userTable.create({
            name:user.name,
            email:user.email,
            password:user.password
        })

    },
    async addNewUserRole(id,role){
        await models.userRole.create({id:id,role: role})
    },
    async findUserById(id){
        const user = await models.userTable.findAll({
            where:{
                id:id,
            }
        });
        return user;
    },
    async updateUserStatus(id){
        await models.userTable.update({verified:'1'}, 
            {
                where:{
                    id:id
                }
            })
    }

}