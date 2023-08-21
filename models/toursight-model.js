import { DataTypes} from 'sequelize';
import db from '../config/database.js';


const Toursight = db.define('toursight', {
    id:{
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
       type: DataTypes.INTEGER
    },
    name:{
        type: DataTypes.STRING(100)
    },
    city:{
        type: DataTypes.STRING(200),
    },
    location:{
        type: DataTypes.TEXT
    },
    category:{
        type: DataTypes.STRING(50)
    },
    image:{
        type: DataTypes.STRING(255)
    },
    deskripsi:{
        type: DataTypes.TEXT
    },
    history:{
        type: DataTypes.TEXT
    }


}, {
    freezeTableName: true,
    timestamps: false
});

export default Toursight;