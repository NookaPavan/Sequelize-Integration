var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.database, process.env.username, process.env.password, process.env.options);

fs.readdirSync(__dirname)
  .filter(file => file.indexOf(".") !== 0 && file !== "index.js")
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

sequelize.sync({
  force : false,
  logging : console.log
}).then(function () {
  console.log('Database Connected!!');
}).catch(function (err) {
  console.log(err, "Something went wrong with the Database Connection!")
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports= db;