import { Router } from "express";
import {verifyToken} from '../middleware/Authmiddleware.js'
import { searchContacts } from "../controllers/ContactsControllers.js";

const contactsRouts=Router();

contactsRouts.post("/search",verifyToken,searchContacts);

export default contactsRouts;