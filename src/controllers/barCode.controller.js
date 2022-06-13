import {BAR_CODE_TYPE} from "../utils/validation.utils.js";

const getExpirationDateBankSlip = (field) => {
    const days = field.slice(5, 9);
    if(days[0] === '0') {
        return null;
    }
    const baseDate = new Date('10-07-1997');
    const expirationDate = new Date(baseDate.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds

    return expirationDate;
}

const getExpirationDateTitleAndAgreement = (field) => {
    const date = field.slice(19, 27);
    const year = Number(date.slice(0,4));
    if(year >= 1997 && year <= 2050) {
        return `${year}-${date.slice(4,6)}-${date.slice(6)}`;
    }
    return null;
}

const getAmount = (field, start, end, type) => {
    let amount = field.slice(start, end);
    if(type === BAR_CODE_TYPE.BANK_SLIP) {
        const fieldDays = field.slice(5, 9);
        if(fieldDays[0] === '0') {
            amount = fieldDays + amount;
        }
    }
    let amountFormatted = Number(amount.slice(0, amount.length - 2)) + amount.slice(amount.length - 2)/100;
    return amountFormatted.toFixed(2);
}

const getResultDecoded = (barCodeResulted, type) => {
    if(type === BAR_CODE_TYPE.TITLE_AND_AGREEMENT) {
        return {
            expirationDate: getExpirationDateTitleAndAgreement(barCodeResulted),
            amount: getAmount(barCodeResulted, 4, 15, type)
        }
    }
    return {
        expirationDate: getExpirationDateBankSlip(barCodeResulted),
        amount: getAmount(barCodeResulted, 9, 19, type)
    }
}

const verifyBarCode = (req, res) => {
    try {
        const {barCodeResulted, type} = req;
        const {expirationDate, amount} = getResultDecoded(barCodeResulted, type);
        return res.status(200).send({
            barCode: barCodeResulted,
            amount,
            expirationDate: expirationDate ? expirationDate : 'Data de vencimento não fornecida'
        });
    } catch (e) {
        return res.status(400).send({error: 'An unforeseen error occurred'})
    }
}

export {
    getExpirationDateBankSlip,
    getExpirationDateTitleAndAgreement,
    getAmount,
    getResultDecoded,
    verifyBarCode
}
