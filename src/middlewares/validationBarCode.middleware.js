import {
    BAR_CODE_TYPE,
    bankSlipFields,
    titleAndAgreementFields,
    concatenateBarCode
} from "../utils/validation.utils.js";

const validCharacters = (req, res, next) => {
    const { barCode } = req.params;
    if(!/^[0-9]+$/.test(barCode) || (barCode.length < 47 || barCode.length > 48)) {
        return res.status(400).send({error: 'Invalid characters'});
    }
    next();
}

const validationBarCode = (req, res, next) => {
    const {barCode} = req.params;
    let type = BAR_CODE_TYPE.BANK_SLIP;
    if(barCode.length === 48) {
        type = BAR_CODE_TYPE.TITLE_AND_AGREEMENT;
    }
    const barCodeResulted = verifyAllDV(barCode, type)
    if(!barCodeResulted) {
        return res.status(400).send({error: 'Invalid typeable line'})
    }
    req.barCodeResulted = barCodeResulted;
    req.type = type;
    next();
}

const verifyAllDV = (barCode, type) => {
    if(type === BAR_CODE_TYPE.BANK_SLIP) {
        return verifyBankSlip(barCode);
    }
    return verifyTitleAndAgreement(barCode)
}

const verifyBankSlip = (barCode) => {
    const fieldOne = barCode.slice(bankSlipFields.fieldOne.start, bankSlipFields.fieldOne.end);
    const fieldTwo = barCode.slice(bankSlipFields.fieldTwo.start, bankSlipFields.fieldTwo.end);
    const fieldThree = barCode.slice(bankSlipFields.fieldThree.start, bankSlipFields.fieldThree.end);

    let barCodeOrderedWithoutDV = fieldOne.slice(0,4);
    barCodeOrderedWithoutDV = barCodeOrderedWithoutDV.concat(barCode.slice(33), fieldOne.slice(4, 9), fieldTwo, fieldThree);

    if(
        isValidDVMod10(fieldOne, Number(barCode[bankSlipFields.fieldOne.end])) &&
        isValidDVMod10(fieldTwo, Number(barCode[bankSlipFields.fieldTwo.end])) &&
        isValidDVMod10(fieldThree, Number(barCode[bankSlipFields.fieldThree.end])) &&
        isValidDVMod11(barCodeOrderedWithoutDV, Number(barCode[32]), BAR_CODE_TYPE.BANK_SLIP)
    ) {
        return concatenateBarCode(barCodeOrderedWithoutDV, barCode[32], 4);
    }
    return;
}

const verifyTitleAndAgreement = (barCode) => {
    const fieldOne = barCode.slice(titleAndAgreementFields.fieldOne.start, titleAndAgreementFields.fieldOne.end);
    const fieldTwo = barCode.slice(titleAndAgreementFields.fieldTwo.start, titleAndAgreementFields.fieldTwo.end);
    const fieldThree = barCode.slice(titleAndAgreementFields.fieldThree.start, titleAndAgreementFields.fieldThree.end);
    const fieldFour = barCode.slice(titleAndAgreementFields.fieldFour.start, titleAndAgreementFields.fieldFour.end);

    let barCodeWithoutDVGeneral = [...barCode];
    barCodeWithoutDVGeneral = fieldOne.concat(fieldTwo, fieldThree, fieldFour);
    barCodeWithoutDVGeneral = [...barCodeWithoutDVGeneral];
    barCodeWithoutDVGeneral.splice(3, 1);

    const type = BAR_CODE_TYPE.TITLE_AND_AGREEMENT;

    let validationDVFunction = barCode[2] === '6' || barCode[2] === '7' ?
        isValidDVMod10 :
        (
            barCode[2] === '8' || barCode[2] === '9' ? isValidDVMod11 : null
        );

    if(
        validationDVFunction &&
        validationDVFunction(barCodeWithoutDVGeneral, Number(barCode[3]), type) &&
        validationDVFunction(fieldOne, Number(barCode[titleAndAgreementFields.fieldOne.end]), type) &&
        validationDVFunction(fieldTwo, Number(barCode[titleAndAgreementFields.fieldTwo.end]), type) &&
        validationDVFunction(fieldThree, Number(barCode[titleAndAgreementFields.fieldThree.end]), type) &&
        validationDVFunction(fieldFour, Number(barCode[titleAndAgreementFields.fieldFour.end]), type)
    ) {
        barCodeWithoutDVGeneral = barCodeWithoutDVGeneral.join('');
        return concatenateBarCode(barCodeWithoutDVGeneral, barCode[3], 3);
    }
    return;
}

const isValidDVMod10 = (field, DV) => {
    const splitString = [...field];
    const reverseField = splitString.reverse();
    let total = 0
    reverseField.forEach((character, index) => {
        let valueCharacter = character*(index % 2 === 0 ? 2 : 1);
        while(valueCharacter > 9) {
            valueCharacter = Math.floor(valueCharacter / 10) + (valueCharacter % 10)
        }
        total += valueCharacter;
    });
    let dvCalculated = 10 - total % 10;
    if(dvCalculated === 10) {
        dvCalculated = 0;
    }
    return dvCalculated === DV;
}

const isValidDVMod11 = (field, DV, type) => {
    const splitString = [...field];
    const reverseField = splitString.reverse();
    let total = 0;
    let multiplier = 2;

    reverseField.forEach((character) => {
        let valueCharacter = character*(multiplier);
        multiplier = multiplier % 9 === 0 ? 2 : multiplier + 1;
        total += valueCharacter;
    });

    let dvCalculated = 11 - total % 11;
    if(dvCalculated % 10 === 0 || dvCalculated % 11 === 0) {
        if(type === BAR_CODE_TYPE.BANK_SLIP) {
            dvCalculated = 1;
        } else {
            dvCalculated = 0;
        }
    }

    return dvCalculated === DV;
}

export {
    validCharacters,
    validationBarCode,
    verifyAllDV,
    verifyTitleAndAgreement,
    verifyBankSlip,
    isValidDVMod11,
    isValidDVMod10
}
