import axios from 'axios';
import { ICustomer, CustomerNotFoundError } from '../../../../libraries/shared-types';

const API_GATEWAY_URL = process.env.API_GATEWAY_SERVICE;

export const getCustomerByGsm = async (gsmNumber: string): Promise<ICustomer> => {
    const response = await axios.get(`${API_GATEWAY_URL}/customer/${gsmNumber}`);
    const customer: ICustomer = response.data.customer;
    if (!customer) {
        throw new CustomerNotFoundError(gsmNumber);
    }
    return customer;
};

export const updateCustomerBalance = async (gsmNumber: string, balance: number) => {
    return await axios.patch(`${API_GATEWAY_URL}/customer/${gsmNumber}/balance`, { balance });
};