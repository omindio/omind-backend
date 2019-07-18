import multer from 'multer';

/*
const _storage = multer.diskStorage({
  //destination: function(req, file, cb) {
  //cb(null, `${appRoot}/tmp`);
  //},
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
});
*/

const _storage = multer.memoryStorage();

const _fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const UploadMidleware = multer({
  storage: _storage,
  limits: {
    fileSize: 1 * 1000000,
  },
  fileFilter: _fileFilter,
});

export default UploadMidleware;
