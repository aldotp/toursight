import multer from 'multer';
import path from 'path';

// for local save without bucket
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, './images');
    },
    filename: function (req, file, cb) {
       cb(null, file.originalname);
    }
 });
 
export const uploadImg = multer({ 
   storage: storage,
   limits: { fileSize: '2 * 1024 * 1024'},
   fileFilter: (req,file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const mimeType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname));

      if(mimeType && extname) {
         return cb(null, true);
      }
      cb('Format image tidak sesuai');
   }
  }).single('image'); // or .array('images', 3);


  
export const uploadStorage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, './upload');
   },
   filename: function (req, file, cb) {
      cb(null, 'predict-image.jpg');
   }
});

export const uploadLoader = multer({ 
   storage: uploadStorage,
   limits: { fileSize: '2 * 1024 * 1024'},
   fileFilter: (req,file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const mimeType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname));

      if(mimeType && extname) {
         return cb(null, true);
      }
      cb('Format image tidak sesuai');
   }
  }).single('image'); // or .array('images', 3);

