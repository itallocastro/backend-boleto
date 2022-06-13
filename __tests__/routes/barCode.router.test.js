import request from 'supertest'
import app from "../../src/server.js";

describe('check barCode router', function () {
    it('should call only verifyCharacters', async () => {
        const barCode = '2129000119211000121090447561740597587000000200f';
        const response = await request(app).get('/boleto/'+barCode);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual( '{"error":"Invalid characters"}');
    })

    it('should call only verifyCharacters and validationBarCode', async () => {
        const barCode = '21290001192110001210904475617405975870000002002';
        const response = await request(app).get('/boleto/'+barCode);
        expect(response.status).toEqual(400);
        expect(response.text).toEqual( '{"error":"Invalid typeable line"}');
    })

    it('should return a valid response', async () => {
        const barCode = '21290001192110001210904475617405975870000002000';
        const response = await request(app).get('/boleto/'+barCode);
        expect(response.status).toEqual(200);
    })
});

