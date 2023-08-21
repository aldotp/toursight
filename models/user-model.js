import { DataTypes} from 'sequelize';
import db from '../config/database.js';


const Users = db.define('users', {
    id:{
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
       type: DataTypes.INTEGER
    },
    username:{
        type: DataTypes.STRING(20),
        unique: true
    },
    email:{
        type: DataTypes.STRING(100),
        unique: true
    },
    password:{
        type: DataTypes.STRING(200)
    },
    refresh_token:{
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
});

export default Users;