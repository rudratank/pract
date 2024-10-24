import express from 'express';
import { login, signup ,auditdata} from '../controllers/AuthController.js';
import isAuthenticatedUser from '../middleware/auth.js';
// import { login, signup } from '../controllers/AuthController.js';

const router = express.Router(); 

router.post('/signup', signup);  
router.post('/login', login);
router.get('/audit',isAuthenticatedUser,auditdata);

export default router;
