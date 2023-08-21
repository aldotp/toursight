import Multer from 'multer';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import Images from '../models/image.js';
import db from '../config/database.js';
import { QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
// import { v4 } from 'uuid';

// uuidv4();
// const uuid = uuid.v1;

dotenv.config()

export const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT, 
    credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY,
    },
})

export const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: '5 * 1024 * 1024'},  
}).single('image');

export const bucket = storage.bucket(process.env.GCS_BUCKET);

export const uploadByUser = async (req,res,cb) => {
    const username = req.body.username
    // const newFileName = Date.now() + "-" + req.file.originalname;
    const newFileName = uuidv4() + "-" + req.file.originalname;
    const blob = bucket.file(newFileName);
    const blobStream = blob.createWriteStream();

    
    blobStream.on("error", err => console.log(err));
    if (req.file.mimetype == "image/png" || req.file.mimetype == "image/jpg" || req.file.mimetype == "image/jpeg") {
        blobStream.on("finish", () => {
            const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;    
            Images.create({
                uploadedBy: username,
                image: publicUrl
            })
            .then(() => res.status(201).send({ 
                message: 'Upload Success',
                uploadedBy: username,
                image: publicUrl
            }));
        }) } else {
            res.status(405).json({message: "Only jpg, jpeg, and png images are allowed"});
        }
        return blobStream.end(req.file.buffer);
}

// export const getUploadedImageByUsername = async(req, res) => {
//     const username = req.body.username;
//     const images = await db.query(
//         `SELECT * FROM user_image WHERE uploadedBy ='` + username + `';`,
//         {
//             type: QueryTypes.SELECT,
//             raw: true,
//         }
//     );
//     if (images.length > null){
//         return res.status(200).json(images);
//     } 
//     return res.status(204).json({ message: "No Images Uploaded"}); 
// }
export const getUploadedImageByUsername = async(req, res) => {
    const username = req.query.username;
    const images = await db.query(
        `SELECT * FROM users_image WHERE uploadedBy ='` + username + `';`,
        {
            type: QueryTypes.SELECT,
            raw: true,
        }
    );
    if (images.length > null){
        return res.status(200).json(images);
    } 
    return res.status(204).json({ message: "No Images Uploaded"}); 
}


export const getImageByid = async(req, res) => {
    let id = req.params.id;
    const image = await db.query(
        `SELECT * FROM users_image WHERE id = ${id};`,
        {
            type: QueryTypes.SELECT,
            raw: true,
        }
    );
    if(image) {
        return res.status(200).send(image);
    }
    return res.status(204).send({message: "Image not found"});
}

export const getAllImgByUser = async(req, res) => {
    try{
        // const image = await Images.findAll();
        const image = await db.query(
            `SELECT * FROM users_image;`,
            {
                type: QueryTypes.SELECT,
                raw: true,
            }
        );
        if(image.length > 0){
            return res.status(200).json(image);
        }
        return res.status(204).json({message: "No Images uploaded by user"});
    } catch (err) {
        return res.json(err);
    }
}

// export const getUploadedImageByIduser = async(req, res) => {
//     let userId = req.params.userId;
//     let image = await Images.findAll({
//         where:{
//             userId: userId
//         }
//     });
//     res.status(200).send(image);
// }