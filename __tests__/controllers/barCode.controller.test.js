import {beforeEach, jest} from '@jest/globals'
import {
    getAmount,
    getExpirationDateBankSlip,
    getExpirationDateTitleAndAgreement,
    getResultDecoded, verifyBarCode
} from "../../src/controllers/barCode.controller.js";

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

describe('check getExpirationDateBankSlip', () => {
    it('should return null if a days array begin with 0', () => {
        const barCode = '21299058700000020000001121100012100447561740';
        const result = getExpirationDateBankSlip(barCode);

        expect(result).toBeNull();
    })

    it('should return a expiration date valid', () => {
        const barCode = '21299758700000020000001121100012100447561740';
        const result = getExpirationDateBankSlip(barCode);

        const expected = new Date('2018-07-16T03:00:00.000Z');
        expect(result.getTime()).toEqual(expected.getTime());
    })
})

describe('check getExpirationDateTitleAndAgreement', () => {
    it('should return null if a field year > 2050', () => {
        const barCode = '84610000002024401622052061548000000238876270';
        const result = getExpirationDateTitleAndAgreement(barCode);

        expect(result).toBeNull();
    })

    it('should return a expiration date valid', () => {
        const barCode = '84610000002024401622022061548000000238876270';
        const result = getExpirationDateTitleAndAgreement(barCode);

        expect(result).toEqual('2022-06-15');
    })
})

describe('check getAmount', () => {
    it('should return a amount with type bank slip', () => {
        const barCode = '21299758700000020000001121100012100447561740';
        const result = getAmount(barCode, 9, 19, 0);

        const expected = 20;
        expect(result).toEqual(expected.toFixed(2));
    })

    it('should return a amount with type bank slip and not expiration date', () => {
        const barCode = '21299000000000020000001121100012100447561740';
        const result = getAmount(barCode, 9, 19, 0);

        const expected = 20;
        expect(result).toEqual(expected.toFixed(2));
    })

    it('should return a amount with type title and agreement', () => {
        const barCode = '84610000002024401622022061548000000238876270';
        const result = getAmount(barCode, 4, 15, 1);

        const expected = 202.44;
        expect(result).toEqual(expected.toFixed(2));
    })
})

describe('check getResultDecoded', () => {
    it('should return a expiration date null in type bank slip', () => {
        const barCode = '21299000000000020000001121100012100447561740';
        const result = getResultDecoded(barCode, 0);

        expect(result.expirationDate).toBeNull();
        expect(result.amount).toEqual("20.00");
    })

    it('should return a valid expiration date and amount in type bank slip', () => {
        const barCode = '21299758700000020000001121100012100447561740';
        const result = getResultDecoded(barCode, 0);

        const expected = new Date('2018-07-16T03:00:00.000Z');
        expect(result.expirationDate.getTime()).toEqual(expected.getTime());
        expect(result.amount).toEqual("20.00");
    })

    it('should return a expiration date null in type title and agreement', () => {
        const barCode = '84610000002024401622052061548000000238876270';
        const result = getResultDecoded(barCode, 1);

        expect(result.expirationDate).toBeNull();
        expect(result.amount).toEqual("202.44");
    })

    it('should return a valid expiration date and amount in type title and agreement', () => {
        const barCode = '84610000002024401622022061548000000238876270';
        const result = getResultDecoded(barCode, 1);

        expect(result.expirationDate).toEqual('2022-06-15');
        expect(result.amount).toEqual("202.44");
    })
})

describe('check verifyBarCode controller', () => {
    let mockedRes;
    let mockedReq;

    beforeEach(() => {
        mockedReq = mockReq();
        mockedRes = mockRes();
    })

    it('should return an expiration date valid', () => {
        const mockedReqCustom = {...mockedReq};
        mockedReqCustom.params.barCodeResulted = '84610000002024401622022061548000000238876270';
        mockedReqCustom.params.type = 1;
        verifyBarCode(mockedReqCustom, mockedRes);

        expect(mockedRes.status).toHaveBeenCalled();
        expect(mockedRes.send).toHaveBeenCalled();
    })

    it('should return an expiration date invalid', () => {
        const mockedReqCustom = {...mockedReq};
        mockedReqCustom.params.barCodeResulted = '84610000002024401622062061548000000238876270';
        mockedReqCustom.params.type = 1;
        verifyBarCode(mockedReqCustom, mockedRes);

        expect(mockedRes.status).toHaveBeenCalled();
        expect(mockedRes.send).toHaveBeenCalled();
    })
})
