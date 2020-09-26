module.exports = (sequelize,DataTypes) => {
    const USERS= sequelize.define("USERS",{
        username:{
            type: DataTypes.STRING(256),
            primaryKey: true
        },
        password:{
            type: DataTypes.STRING(100),
            allowNull:false
        },
    },{
        timestamps: false
    });

    return USERS;
}