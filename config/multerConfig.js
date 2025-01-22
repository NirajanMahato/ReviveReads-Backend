const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const fs = require('fs');

// Create uploads directories if they don't exist
const createUploadsDirectories = () => {
  const dirs = ['./uploads', './uploads/users', './uploads/books'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadsDirectories();

// Multer file filter
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Storage configuration for user avatars
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/users');
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, buffer) => {
      const filename = buffer.toString('hex') + path.extname(file.originalname);
      cb(null, filename);
    });
  }
});

// Storage configuration for book images
const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/books');
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, buffer) => {
      const filename = buffer.toString('hex') + path.extname(file.originalname);
      cb(null, filename);
    });
  }
});

// // Image compression middleware
// const compressImage = async (req, res, next) => {
//   if (!req.file && !req.files) return next();

//   const compress = async (file) => {
//     try {
//       await sharp(file.path)
//         .resize(800, 800, { // Max dimensions
//           fit: 'inside',
//           withoutEnlargement: true
//         })
//         .jpeg({ quality: 80 }) // Compress to JPEG
//         .toFile(file.path + '_compressed');

//       // Replace original with compressed version
//       fs.unlinkSync(file.path);
//       fs.renameSync(file.path + '_compressed', file.path);
//     } catch (error) {
//       console.error('Image compression error:', error);
//     }
//   };

//   if (req.file) {
//     // Single file
//     await compress(req.file);
//   } else if (req.files) {
//     // Multiple files
//     await Promise.all(req.files.map(file => compress(file)));
//   }

//   next();
// };

// Upload configurations
const uploadUserAvatar = multer({
  storage: userStorage,
  fileFilter: fileFilter,
  limits: {
    files: 1 // Single file only
  }
});

const uploadBookImages = multer({
  storage: bookStorage,
  fileFilter: fileFilter,
  limits: {
    files: 4 // Maximum 4 files
  }
});

module.exports = {
  uploadUserAvatar: uploadUserAvatar.single('avatar'),
  uploadBookImages: uploadBookImages.array('images', 4),
//   compressImage
};