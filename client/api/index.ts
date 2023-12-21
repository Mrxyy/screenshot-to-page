'use client';
import { set } from 'lodash';
import axios from 'redaxios';

const APi = axios.create({});

export const backendApi = axios.create({
    baseURL: '/api',
});

export default APi;
