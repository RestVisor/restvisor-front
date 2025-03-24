import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export const getOrders = async() => {

    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error('GetOrders failed');
    }

    const data = await res.json();

    console.log(data);

};