import axios from 'axios';
import { ICustomer } from '../../../libraries/shared-types/src';

const CUSTOMER_SERVICE_URL = 'http://localhost:8081';

export const getCustomerByGsm = async (gsmNumber: string): Promise<ICustomer> => {
    const response = await axios.get(`${CUSTOMER_SERVICE_URL}/customer/gsm/${gsmNumber}`);
    const customer: ICustomer = response.data.customer;
    if (!customer) {
        throw new Error('Customer not found');
    }
    return customer;
};

export const updateCustomerBalance = async (gsmNumber: string, balance: number): Promise<void> => {
    await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${gsmNumber}/balance`, { balance });
};