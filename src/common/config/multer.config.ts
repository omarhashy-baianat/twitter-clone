import * as multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file: Express.Multer.File, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file: Express.Multer.File, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv'];
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('invalid file format'), false);
  }
};

export const MulterFileHandler = multer({ storage, fileFilter });
