import request from 'supertest';
import  app  from '../app';
import { StatusCodes } from 'http-status-codes';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Transaction routes', () => {

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    describe('POST /transaction/transfer', () => {
        it('should transfer money between customers', async () => {

            mockedAxios.get.mockImplementation((url) => {
                if(url.includes('+994773221221')) {
                    return Promise.resolve({ data: { customer: {
                        name: 'Mirza',
                        surname: 'Nacafov',
                        birthDate: '1997-08-08',
                        gsmNumber: '+994773221221',
                        balance: 100
                    }} });
                };
                if(url.includes('+994773221222')) {
                    return Promise.resolve({ data: { customer: {
                        name: 'Mirza',
                        surname: 'Nacafov',
                        birthDate: '1997-08-08',
                        gsmNumber: '+994773221222',
                        balance: 100
                    }} });
                };
            });


            const transferData = {
                from: '+994773221221',
                to: '+994773221222',
                amount: 50
            };

            const response = await request(app).post('/transaction/transfer').send(transferData);

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.message).toBe('Transfer sucessfull');
            expect(response.body.balance).toBe(50);
        });

        it('should return error for insufficient balance', async () => {

            mockedAxios.get.mockImplementation((url) => {
                if(url.includes('+994773221221')) {
                    return Promise.resolve({ data: { customer: {
                        name: 'Mirza',
                        surname: 'Nacafov',
                        birthDate: '1997-08-08',
                        gsmNumber: '+994773221221',
                        balance: 100
                    }} });
                };
                if(url.includes('+994773221222')) {
                    return Promise.resolve({ data: { customer: {
                        name: 'Mirza',
                        surname: 'Nacafov',
                        birthDate: '1997-08-08',
                        gsmNumber: '+994773221222',
                        balance: 100
                    }} });
                };
            });

            const transferData = {
                from: '+994773221221',
                to: '+994773221222',
                amount: 150
            };

            const response = await request(app).post('/transaction/transfer').send(transferData);

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBe('Insufficient balance');
        });
    });

    describe('POST /transaction/topup', () => {
        it('should top up customer balance', async () => {

            mockedAxios.get.mockImplementation((url) => {
                if(url.includes('+994773221221')) {
                    return Promise.resolve({ data: { customer: {
                        name: 'Mirza',
                        surname: 'Nacafov',
                        birthDate: '1997-08-08',
                        gsmNumber: '+994773221221',
                        balance: 100
                    }} });
                };
            });

            const topUpData = {
                gsmNumber: '+994773221221',
                amount: 50
            };

            const response = await request(app).post('/transaction/topup').send(topUpData);

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.message).toBe('Top-up sucessfull');
            expect(response.body.balance).toBe(150);
        });

        it('should return error for non existing customer', async () => {

            mockedAxios.get.mockImplementation((url) => {
                if(url.includes('+994773221222')) {
                    return Promise.resolve({ data: { customer: null} });
                };
            });

            const topUpData = {
                gsmNumber: '+994773221222',
                amount: 50
            };

            const response = await request(app).post('/transaction/topup').send(topUpData);

            expect(response.status).toBe(StatusCodes.NOT_FOUND);
            expect(response.body.message).toContain('Customer not found with GSM number');
        });

        it('should validate required fields', async () => {
            const response = await request(app).post('/transaction/topup').send({});

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBeTruthy();
        });

        it('amount should be a number and positive', async () => {
            const response = await request(app).post('/transaction/topup').send({ gsmNumber: '+994773221221', amount: -100 });

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBeTruthy();
        });
    });

    describe('POST /transaction/purchase', () => {
        it('should purchase from customer balance', async () => {

            mockedAxios.get.mockImplementation((url) => {
                if(url.includes('+994773221221')) {
                    return Promise.resolve({ data: { customer: {
                        name: 'Mirza',
                        surname: 'Nacafov',
                        birthDate: '1997-08-08',
                        gsmNumber: '+994773221221',
                        balance: 100
                    }} });
                };
            });

            const purchaseData = {
                gsmNumber: '+994773221221',
                amount: 50
            };

            const response = await request(app).post('/transaction/purchase').send(purchaseData);

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.message).toBe('Purchase sucessfull');
            expect(response.body.balance).toBe(50);
        });

        it('should return error for non existing customer', async () => {

            mockedAxios.get.mockImplementation((url) => {
                if(url.includes('+994773221222')) {
                    return Promise.resolve({ data: { customer: null} });
                };
            });

            const purchaseData = {
                gsmNumber: '+994773221222',
                amount: 50
            };

            const response = await request(app).post('/transaction/purchase').send(purchaseData);

            expect(response.status).toBe(StatusCodes.NOT_FOUND);
            expect(response.body.message).toContain('Customer not found with GSM number');
        });

        it('should validate required fields', async () => {
            const response = await request(app).post('/transaction/purchase').send({});

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBeTruthy();
        });

    });

    describe('POST /transaction/refund', () => {
        it('should refund to customer balance', async () => {
            mockedAxios.get.mockImplementation((url) => {
                if(url.includes('+994773221221')) {
                    return Promise.resolve({ data: { customer: {
                        name: 'Mirza',
                        surname: 'Nacafov',
                        birthDate: '1997-08-08',
                        gsmNumber: '+994773221221',
                        balance: 100
                    }} });
                };
            });

            await request(app).post('/transaction/purchase').send({
                gsmNumber:"+994773221221",
                amount: 10
            });

            const refundData = {
                gsmNumber: '+994773221221',
                amount: 5
            };

            const response = await request(app).post('/transaction/refund').send(refundData);

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.message).toBe('Refund successful');
            expect(response.body.balance).toBe(105);
        });

        it('should return error for non existing purchase', async () => {

            mockedAxios.get.mockImplementation((url) => {
                if(url.includes('+994773221222')) {
                    return Promise.resolve({ data: { customer: null} });
                };
            });

            const refundData = {
                gsmNumber: '+994773221222',
                amount: 50
            };

            const response = await request(app).post('/transaction/refund').send(refundData);

            expect(response.status).toBe(StatusCodes.NOT_FOUND);
            expect(response.body.message).toContain('No purchase found');
        });

        it('should validate required fields', async () => {
            const response = await request(app).post('/transaction/refund').send({});

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBeTruthy();
        });

        it('amount should be a number and positive', async () => {
            const response = await request(app).post('/transaction/refund').send({ gsmNumber: '+994773221221', amount: -100 });

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBeTruthy
        });
    });
});