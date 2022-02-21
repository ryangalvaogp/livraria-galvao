import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storageTypes = {
    local: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'booksOnCSV'),
        filename: function (req, file, cb) {
            const keyID = crypto.randomBytes(2).toString('hex');//@ts-expect-error
            file.key = `${keyID}-${file.originalname}`//@ts-expect-error
            cb(null, file.key);
            
        },
    }),
}

export default {
    storage: storageTypes['local']
}