import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TIMEOUT = 500;

export const fetchNumbers = async (numberType) => {
  try {
    console.log(`Attempting to fetch ${numberType} numbers...`);
    
    const accessToken = process.env.ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('Access token not configured');
    }
    console.log('Access token found');

    const endpointMap = {
      'p': 'http://20.244.56.144/numbers/primes',
      'f': 'http://20.244.56.144/numbers/fibo',
      'e': 'http://20.244.56.144/numbers/even',
      'r': 'http://20.244.56.144/numbers/rand'
    };

    const endpoint = endpointMap[numberType];
    
    if (!endpoint) {
      throw new Error(`Invalid number type: ${numberType}`);
    }
    console.log(`Making request to endpoint: ${endpoint}`);

    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      timeout: 500
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response data:`, response.data);
    
    if (!response.data.numbers) {
      console.warn('No numbers property found in response data');
      console.log('Full response:', JSON.stringify(response.data));
      return [];
    }
    
    console.log(`Received ${response.data.numbers.length} numbers`);
    
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Error fetching ${numberType} numbers:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Request details:', error.request._currentUrl);
    }
    return [];
  }
};