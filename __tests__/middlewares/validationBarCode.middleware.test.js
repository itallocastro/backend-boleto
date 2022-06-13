import {beforeEach, jest} from '@jest/globals'
import {
    validCharacters,
    validationBarCode,
    isValidDVMod11,
    isValidDVMod10,
    verifyBankSlip,
    verifyAllDV,
    verifyTitleAndAgreement
} from "../../src/middlewares/validationBarCode.middleware.js";

const mockReq = () => {
    return {
        params: {

        }
    };
}
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
}
const mockNext = () => {
    return jest.fn()
}
describe('check validCharacters', () => {
    let mockedRes;
    let mockedReq;
    let mockedNext;

    beforeEach(() => {
        mockedReq = mockReq();
        mockedRes = mockRes();
        mockedNext = mockNext();
    })

    it('should return error with invalid character', () => {
        const mockedReqCustom = {...mockedReq};
        mockedReqCustom.params.barCode = '2129000119211000121090447561740597587000000200f';
        validCharacters(mockedReqCustom, mockedRes, mockedNext);
        expect(mockedRes.status).toHaveBeenCalled();
        expect(mockedRes.send).toHaveBeenCalled();
        expect(mockedNext).not.toHaveBeenCalled();
    })

    it('should return error with barCode size > 48', () => {
        const mockedReqCustom = {...mockedReq};
        mockedReqCustom.params.barCode = '2129000119211000121090447561740597587000000200000';
        validCharacters(mockedReqCustom, mockedRes, mockedNext);
        expect(mockedRes.status).toHaveBeenCalled();
        expect(mockedRes.send).toHaveBeenCalled();
        expect(mockedNext).not.toHaveBeenCalled();
    });

    it('should return error with barCode size < 47', () => {
        const mockedReqCustom = {...mockedReq};
        mockedReqCustom.params.barCode = '2129000119211000121090447561740597587000000200';
        validCharacters(mockedReqCustom, mockedRes, mockedNext);
        expect(mockedRes.status).toHaveBeenCalled();
        expect(mockedRes.send).toHaveBeenCalled();
        expect(mockedNext).not.toHaveBeenCalled();
    });

    it('should call next with valid character', () => {
        const mockedReqCustom = {...mockedReq};
        mockedReqCustom.params.barCode = '21290001192110001210904475617405975870000002000';
        validCharacters(mockedReqCustom, mockedRes, mockedNext);

        expect(mockedRes.status).not.toHaveBeenCalled();
        expect(mockedRes.send).not.toHaveBeenCalled();
    })
})

describe('check validationBarCode', () => {
    let mockedRes;
    let mockedReq;
    let mockedNext;

    beforeEach(() => {
        mockedReq = mockReq();
        mockedRes = mockRes();
        mockedNext = mockNext();
    })

    it('should return error if verifyAllDiv return null', () => {
        const mockedReqCustom = {...mockedReq};
        mockedReqCustom.params.barCode = '21290001192110001210904475617405975870000002030';
        validationBarCode(mockedReqCustom, mockedRes, mockedNext);

        expect(mockedRes.status).toHaveBeenCalled();
        expect(mockedRes.send).toHaveBeenCalled();
        expect(mockedNext).not.toHaveBeenCalled();
    })

    it('should return error if verifyAllDiv return null with barCode of type title and agreement', () => {
        const mockedReqCustom = {...mockedReq};
        mockedReqCustom.params.barCode = '212900011921100012109044756174059758700000020300';
        validationBarCode(mockedReqCustom, mockedRes, mockedNext);

        expect(mockedRes.status).toHaveBeenCalled();
        expect(mockedRes.send).toHaveBeenCalled();
        expect(mockedNext).not.toHaveBeenCalled();
    })

    it('should call next with barCode valid', () => {
        const mockedReqCustom = {...mockedReq};
        mockedReqCustom.params.barCode = '21290001192110001210904475617405975870000002000';
        validationBarCode(mockedReqCustom, mockedRes, mockedNext);

        expect(mockedRes.status).not.toHaveBeenCalled();
        expect(mockedRes.send).not.toHaveBeenCalled();
        expect(mockedNext).toHaveBeenCalled();
    })
})

describe('check verifyAllDV', () => {

    it('should return undefined with barCode DV invalid with type 0', () => {
        const barCode = '21290001192110001210904475617405975870000002030';
        const result = verifyAllDV(barCode, 0);
        expect(result).toBeUndefined();
    })

    it('should return undefined with barCode DV invalid with type 1', () => {
        const barCode = '21290001192110001210904475617405975870000002030';
        const result = verifyAllDV(barCode, 1);
        expect(result).toBeUndefined();
    })

    it('should return a barCode valid', () => {
        const barCode = '21290001192110001210904475617405975870000002000';
        const result = verifyAllDV(barCode, 0);
        expect(result).toEqual('21299758700000020000001121100012100447561740');
    })

})

describe('check isValidDVMod10', () => {

    it('should return false with barCode DV invalid', () => {
        const barCode = '212900012';
        const DV = 9;
        const result = isValidDVMod10(barCode, DV);

        expect(result).toBeFalsy();
    })

    it('should return true with barCode DV valid', () => {
        const barCode = '212900011';
        const DV = 9;
        const result = isValidDVMod10(barCode, DV);

        expect(result).toBeTruthy();
    })

    it('should return true with barCode DV valid where dvCalculated equal 10', () => {
        const barCode = '20615480000';
        const DV = 0;
        const result = isValidDVMod10(barCode, DV);

        expect(result).toBeTruthy();
    })

})

describe('check isValidDVMod11', () => {

    it('should return true with barCode DV valid', () => {
        const barCode = '85860000000';
        const DV = 4;
        const result = isValidDVMod11(barCode, DV, 1);

        expect(result).toBeTruthy();
    })

    it('should return false with barCode DV invalid', () => {
        const barCode = '85860000021';
        const DV = 4;
        const result = isValidDVMod11(barCode, DV, 1);

        expect(result).toBeFalsy();
    })

    it('should return true with barCode DV valid dvCalculate % 11 = 0 type 1', () => {
        const barCode = '01230067896';
        const DV = 0;
        const result = isValidDVMod11(barCode, DV, 1);

        expect(result).toBeTruthy();
    })

    it('should return true with barCode DV valid dvCalculate % 11 = 0 type 0', () => {
        const barCode = '01230067896';
        const DV = 1;
        const result = isValidDVMod11(barCode, DV, 0);

        expect(result).toBeTruthy();
    })
})

describe('check verifyBankSlip', () => {

    it('should return undefined with barCode invalid', () => {
        const barCode = '21290001192110001210904475617405975870000002001';
        const result = verifyBankSlip(barCode);
        expect(result).toBeUndefined();
    })

    it('should return barCodeResulted with barCode valid', () => {
        const barCode = '21290001192110001210904475617405975870000002000';
        const result = verifyBankSlip(barCode);
        expect(result).toEqual('21299758700000020000001121100012100447561740');
    })
})


describe('check verifyTitleAndAgreement', () => {

    it('should return undefined with barCode invalid', () => {
        const barCode = '846100000021024401622022206154800000002388762705';
        const result = verifyTitleAndAgreement(barCode);
        expect(result).toBeUndefined();
    })

    it('should return barCodeResulted with barCode valid', () => {
        const barCode = '846100000021024401622022206154800000002388762706';
        const result = verifyTitleAndAgreement(barCode);
        expect(result).toEqual('84610000002024401622022061548000000238876270');
    })
})
