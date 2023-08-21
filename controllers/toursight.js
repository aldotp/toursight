import Toursight from '../models/toursight-model.js';
import { Op, QueryTypes } from 'sequelize';
import db from '../config/database.js';
import dotenv from 'dotenv';
import Multer from 'multer';
import { Storage } from '@google-cloud/storage';

dotenv.config()

export const getAllToursight = async(req, res, next) => {
    try{
        const toursight = await db.query(
            `SELECT * FROM toursight;`,
            {
                type: QueryTypes.SELECT,
                raw: true,
            }
        );

        res.json(toursight);
    } catch (err) {
        console.log(err);
    }
};


export const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT, 
    credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY,
    }
})

export const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: { 
        fileSize: '5 * 1024 * 1024'
    },
    fileFilter: (req,file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
  
        if(mimeType && extname) {
           return cb(null, true);
        }
        cb('Format image tidak sesuai');
     }
}).single('image');

export const bucket = storage.bucket(process.env.GCS_BUCKET_DUMMY);

export const uploadDummy = async (req,res) => {
    const name = req.body.name;
    const category = req.body.category;
    const location = req.body.location;
    const image = req.file.originalname
    const deskripsi = req.body.deskripsi;
    
    const blob = bucket.file("images/"+ image);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", err => console.log(err));

    blobStream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_DUMMY}/${blob.name}`;
        Toursight.create({
            name: name,
            category: category,
            location: location,
            image: publicUrl,
            deskripsi: deskripsi
        })
        .then(() => res.status(201).send({ 
            message: 'Upload Success',
            name: name,
            category: category,
            location: location,
            image: publicUrl,
            deskripsi: deskripsi
        }));
    })
    blobStream.end(req.file.buffer);
}


// export const addToursight = async(req, res) => {
//     let input = {
//         name: req.body.name,
//         location: req.body.location,
//         category: req.body.category,
//         image: req.file.path,
//         deskripsi: req.body.deskripsi
//     }
//     const toursight = await Toursight.create(input)
//     res.status(200).send(toursight);
//     console.log(toursight);
// };


export const getToursightByid = async(req, res) => {
    let id = req.params.id;
    
    const toursight = await db.query(
        `SELECT * FROM toursight WHERE id = ${id};`,
        {
            type: QueryTypes.SELECT,
            raw: true,
        }
    );
    if(toursight){
        return res.status(200).json(toursight);
    }
    return res.status(204).json({message: "Toursight id not found"});
}


export const searchToursightByKeyword = async(req, res) => {
    const keyword = req.query.keyword;
    const name = await db.query(
        `SELECT * FROM toursight WHERE name LIKE '%` + keyword + `%';`,
        {
            type: QueryTypes.SELECT,
            raw: true,
        }
    );
    const category = await db.query(
        `SELECT * FROM toursight WHERE category LIKE '%` + keyword + `%';`,
        {
            type: QueryTypes.SELECT,
            raw: true,
        }
    );
    const city = await db.query(
        `SELECT * FROM toursight WHERE city LIKE '%` + keyword + `%';`,
        {
            type: QueryTypes.SELECT,
            raw: true,
        }
    )

    if(name.length > 0){
        return res.status(200).json(name);
    } else if (category.length > 0){
        return res.status(200).json(category);
    } else if (city.length > 0){
        return res.status(200).json(city);
    }
    return res.status(204).json({message: "Toursight name not found"});
}

export const getDataByClassName = async(req, res) => {
    const getData = req.body.classname;
    const toursight = await db.query(
        `SELECT * FROM toursight WHERE name LIKE '%` + getData + `%' LIMIT 1;`,
        {
            type: QueryTypes.SELECT,
            raw: true,
        }
    );
    if(toursight.length > 0){
        return res.status(200).json(toursight);
    }
    return res.status(204).json({message: "Toursight not found"});
}

export const getDataByCategory = async(req, res ) => {
    const category = req.query.category

    const toursight = await db.query(
        `SELECT * FROM toursight WHERE category LIKE '%` + category + `%';`,
        {
            type: QueryTypes.SELECT,
            raw: true,
        }
    )
    if(toursight.length > 0){
        return res.status(200).json(toursight);
    }
    return res.status(204).json({message: "Category not found"});
}

export const getDatabyCity = async(req,res) => {
    const city = req.body.city;
    const toursight = await db.query(
        `SELECT * FROM toursight WHERE city LIKE '%` + city + `%';`,
        {
            type: QueryTypes.SELECT,
            raw: true,
        }
    )
    if(toursight.length > 0){
        return res.status(200).json(toursight);
    }
    return res.status(204).json({message: "No Toursight Found"});
}




    // `SELECT * FROM toursight WHERE city LIKE '%` + city + `%'`:
