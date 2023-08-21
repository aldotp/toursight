import { Router } from 'express';
import { getUsers, Login, Register, Logout } from '../controllers/users.js';
import { verifyToken } from '../middlewares/VerifyToken.js';
import { refreshToken } from '../controllers/refreshToken.js';
import { getAllToursight, getDataByCategory, getDatabyCity, getDataByClassName, getToursightByid, searchToursightByKeyword, uploadDummy } from '../controllers/toursight.js';
// import { uploadImg, uploadLoader } from '../middlewares/Multer.js';
import { multer, getAllImgByUser, getImageByid, getUploadedImageByUsername, uploadByUser } from '../controllers/image.js';




const router = Router();

// Auth Register and Login
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', verifyToken, refreshToken);
router.delete('/logout', verifyToken, Logout);

// Resource Admin
router.post('/dummy', multer, uploadDummy); // Upload Dummy Data 
router.get('/users', getUsers);

// router.post('/dummy', uploadImg, addToursight);

// Resource User
router.get('/toursight', verifyToken, getAllToursight); //homepage setelah login tampilkan toursight
router.get('/toursight/:id', verifyToken, getToursightByid); // menampilkan data berdasarkan id
router.get('/search', verifyToken, searchToursightByKeyword); // search toursight berdasarkan nama
router.get('/getdatabyimg', verifyToken, getDataByClassName); //search dengan menampilkan satu data dari classname
router.get('/category', verifyToken, getDataByCategory);
router.post('/image', verifyToken, multer, uploadByUser);
router.get('/image', verifyToken, getAllImgByUser);
router.get('/image/:id', verifyToken, getImageByid);
router.get('/imageuser', verifyToken, getUploadedImageByUsername);
router.get('/city', verifyToken, getDatabyCity);

// Upload Image untuk temporary image recognition

// router.post('/tmp', verifyToken, uploadLoader, (req, res) => {
//     const image = req.file;
//     res.json({
//         message: 'Upload Success',
//         result: image
//     });
// });
// router.post('/predict', getInfoByImg);

export default router;

