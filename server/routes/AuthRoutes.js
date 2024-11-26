import express from 'express';
import { login, signup ,getUserInfo,updateProfile,addProfileImage,removeProfileImage,auditdata, logout} from '../controllers/AuthController.js';
import isAuthenticatedUser from '../middleware/auth.js';
import { verifyToken } from '../middleware/Authmiddleware.js';
// import { login, signup } from '../controllers/AuthController.js';
import multer from 'multer';

const router = express.Router(); 
const uploads = multer({dest:"uploads/profiles"});

router.post('/signup', signup);  
router.post('/login', login);
router.get('/userinfo', verifyToken, getUserInfo)
router.post('/update-profile', verifyToken, updateProfile)
router.post('/add-profile-image',verifyToken, uploads.single("profile-image") ,addProfileImage);
router.delete('/remove-profile-image',verifyToken,removeProfileImage);
router.get('/audit',isAuthenticatedUser,auditdata);
router.post('/logout',logout)

export default router;
