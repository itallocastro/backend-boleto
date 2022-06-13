import {Router} from "express";
import {barCodeController} from '../controllers';
import {validationBarCode} from '../middlewares'
const router = Router();

router.get('/boleto/:barCode', validationBarCode.validCharacters, validationBarCode.validationBarCode, barCodeController.verifyBarCode);

export default router;
