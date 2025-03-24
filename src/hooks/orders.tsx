import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../services/api'

const API_URL = import.meta.env.VITE_API_URL;

export const getOrderList = async() => {

    const res = await getOrders();

    console.log(res);

};