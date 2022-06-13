const BAR_CODE_TYPE = {
    BANK_SLIP: 0,
    TITLE_AND_AGREEMENT: 1
}

const bankSlipFields = {
    fieldOne: {
        start: 0,
        end: 9
    },
    fieldTwo: {
        start: 10,
        end: 20
    },
    fieldThree: {
        start: 21,
        end: 31

    }
}

const titleAndAgreementFields = {
    fieldOne: {
        start: 0,
        end: 11,
    },
    fieldTwo: {
        start: 12,
        end: 23
    },
    fieldThree: {
        start: 24,
        end: 35
    },
    fieldFour: {
        start: 36,
        end: 47
    }
}

const concatenateBarCode = (barCodeWithoutDV, DV, indexConcatenate) => {
    return barCodeWithoutDV.slice(0, indexConcatenate) + DV + barCodeWithoutDV.slice(indexConcatenate);
}

export {
    BAR_CODE_TYPE,
    titleAndAgreementFields,
    bankSlipFields,
    concatenateBarCode
}
