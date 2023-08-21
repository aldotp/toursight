import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';
import db from './config/database.js';
import Users from './models/user-model.js';
import Toursight from './models/toursight-model.js';
import Images from './models/image.js';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());
app.use(cookieParser());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Connect to database
try {
    await db.authenticate();
    console.log('Connected to Database MySQL');
    await Users.sync(); // tabel Users
    await Toursight.sync(); // tabel Toursight
    await Images.sync();

} catch (err) {
    console.log(err);
}



// Endpoint
app.get('/', function(err,res){
    res.status(200).send('Welcome to Toursight Restful API');
})
app.get("/admin", (req,res) => {
    axios
    .get("https://belajarteknologi.space/api/users")
    .then((res) => res.data)
    .then((json) => res.render("users", {json}));
})

app.use(`/api`, routes);

// static Image folder
// app.use('/images', express.static('./images'));


// set HOST and PORT
const PORT =  8080;

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});

