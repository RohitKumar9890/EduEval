import admin from 'firebase-admin';
import multer from 'multer';
import path from 'path';

// Firebase Storage bucket
let bucket = null;

export const initializeStorage = () => {
  try {
    if (admin.apps.length > 0) {
      bucket = admin.storage().bucket();
      console.log('Firebase Storage initialized');
    }
  } catch (error) {
    console.error('Firebase Storage initialization failed:', error);
  }
};

// Multer configuration for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'text/plain',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Upload file to Firebase Storage
export const uploadToFirebase = async (file, folder = 'materials') => {
  try {
    if (!bucket) {
      throw new Error('Firebase Storage not initialized');
    }

    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', async () => {
        // Make file publicly accessible
        await fileUpload.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        resolve({
          fileName: file.originalname,
          fileUrl: publicUrl,
          filePath: fileName,
          fileSize: file.size,
          fileType: file.mimetype,
          uploadedAt: new Date(),
        });
      });

      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw error;
  }
};

// Delete file from Firebase Storage
export const deleteFromFirebase = async (filePath) => {
  try {
    if (!bucket) {
      throw new Error('Firebase Storage not initialized');
    }

    const file = bucket.file(filePath);
    await file.delete();
    console.log(`File deleted: ${filePath}`);
    return true;
  } catch (error) {
    console.error('Firebase delete error:', error);
    throw error;
  }
};

// Get file metadata
export const getFileMetadata = async (filePath) => {
  try {
    if (!bucket) {
      throw new Error('Firebase Storage not initialized');
    }

    const file = bucket.file(filePath);
    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error('Get metadata error:', error);
    throw error;
  }
};

// Get signed URL (for private files)
export const getSignedUrl = async (filePath, expiresIn = 3600) => {
  try {
    if (!bucket) {
      throw new Error('Firebase Storage not initialized');
    }

    const file = bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });

    return url;
  } catch (error) {
    console.error('Get signed URL error:', error);
    throw error;
  }
};

// List files in a folder
export const listFiles = async (folder = 'materials') => {
  try {
    if (!bucket) {
      throw new Error('Firebase Storage not initialized');
    }

    const [files] = await bucket.getFiles({ prefix: folder });
    
    return files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      created: file.metadata.timeCreated,
      updated: file.metadata.updated,
    }));
  } catch (error) {
    console.error('List files error:', error);
    throw error;
  }
};
