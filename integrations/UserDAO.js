const Models= require('./model');

module.exports = {
    create: (row) => {
      const result = Models.User.create({
        username:    row[0],
        password:    row[1]
      })
      return result;
    },
    bulkCreate: (rows) => {
      users=[]
      rows.forEach(element => {
        const result = {
          username: element[0],
          password: element[1] 
        };
        users.push(result);
      });
      return Models.User.bulkCreate(users);
    },
    findAll : ()=>{
      return Models.User.findAll();
    },
    findUsers: ()=>{
      return Model.User.findAll({
        attributes: ['username']
      });
    },
    findUser: (name,pwd)=>{
      return Model.User.findAll({
        where: {
          username: name,
          password: pwd
        }
      });
    },
    firstUser: ()=>{
      return Model.User.findAll({ offset: 0, limit: 1 });
    },
    count: ()=>{
      return Model.User.findAll({
        attributes: {
          include: [
            [sequelize.fn('COUNT', sequelize.col('username')), 'counts'] //SELECT username,password,COUNT(username) AS counts FROM
          ],
          exclude: ['password']
        }
      });
    },

};