import request from 'supertest';
import  app  from '../app';
import { StatusCodes } from 'http-status-codes';

describe('Customer routes', () => {
    describe('POST /customer', () => {
        it('should create a new customer', async () => {
            const newCustomer = {
                gsmNumber: '+994773221221',
                name: 'Mirza',
                surname: 'Nacafov',
                birthDate: '1997-08-08'
            };

            const response = await request(app).post('/customer').send(newCustomer);

            expect(response.status).toBe(StatusCodes.CREATED);
            expect(response.body.message).toBe('Customer created successfully');
            expect(response.body.customer).toMatchObject(newCustomer);
        });

        it('Default balance should be 100', async () => {
            const newCustomer = {
                gsmNumber: '+994773221221',
                name: 'Mirza',
                surname: 'Nacafov',
                birthDate: '1997-08-08'
            };

            const response = await request(app).post('/customer').send(newCustomer);
            expect(response.status).toBe(StatusCodes.CREATED);
            expect(response.body.customer.balance).toBe(100);

        });

        it('should return error for duplciate gsmNumber', async () => {
            const newCustomer = {
                gsmNumber: '+994773221221',
                name: 'Mirza',
                surname: 'Nacafov',
                birthDate: '1997-08-08'
            };

            await request(app).post('/customer').send(newCustomer);

            const response = await request(app).post('/customer').send(newCustomer);

            expect(response.status).toBe(StatusCodes.CONFLICT);
            expect(response.body.message).toContain('Customer already exists with GSM number');
        });

        it('should validate required fields', async () => {
            const newCustomer = {
                name: 'Mirza',
                surname: 'Nacafov'
            };

            const response = await request(app).post('/customer').send(newCustomer);

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBeTruthy();
        });
    });

    describe('PATCH /customer/:gsmNumber/balance', () => {
        it('should update customer balance', async () => {
            const newCustomer = {
                gsmNumber: '+994773221221',
                name: 'Mirza',
                surname: 'Nacafov',
                birthDate: '1997-08-08'
            };

            await request(app).post('/customer').send(newCustomer);

            const response = await request(app).patch(`/customer/${newCustomer.gsmNumber}/balance`).send({ balance: 200 });

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.message).toBe('balance updated successfully');
            expect(response.body.customer.balance).toBe(200);
        });

        it('should return error for non existing customer', async () => {
            const response = await request(app).patch('/customer/+994773221221/balance').send({ balance: 200 });

            expect(response.status).toBe(StatusCodes.NOT_FOUND);
            expect(response.body.message).toContain('Customer not found with GSM number');
        });

        it('should validate required fields', async () => {
            const response = await request(app).patch('/customer/+994773221221/balance').send({});

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBeTruthy();
        });

        it('balance should be a number and positive', async () => {
            const response = await request(app).patch('/customer/+994773221221/balance').send({ balance: -100 });

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBeTruthy();
        });
    });

    describe('GET /customer/:gsmNumber', () => {
        it('should get customer by gsmNumber', async () => {
            const newCustomer = {
                gsmNumber: '+994773221221',
                name: 'Mirza',
                surname: 'Nacafov',
                birthDate: '1997-08-08'
            };

            await request(app).post('/customer').send(newCustomer);

            const response = await request(app).get(`/customer/${newCustomer.gsmNumber}`);

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.customer).toMatchObject(newCustomer);
        });

        it('should return error for non existing customer', async () => {
            const response = await request(app).get('/customer/+994773221221');

            expect(response.status).toBe(StatusCodes.NOT_FOUND);
            expect(response.body.message).toContain('Customer not found with GSM number');
        });
    });

});