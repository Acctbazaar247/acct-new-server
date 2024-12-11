import axios from 'axios';
import config from '../config';

// Define the environment variables for security
const KORA_API_BASE_URL = 'https://api.korapay.com';
const KORA_API_SECRET_KEY = config.koraApiSecretKey;

type CheckoutRequest = {
  amount: number; // The amount to charge
  currency: string; // Currency code, e.g., "NGN", "USD"
  customerName: string; // Customer's name
  customerEmail: string; // Customer's email
  reference: string; // Unique transaction reference
  description?: string; // Description of the transaction
  callbackUrl: string; // Callback URL for payment status updates
};

type CheckoutResponse = {
  checkoutUrl: string; // URL to redirect the user to
};

export const createKoraPayCheckout = async (
  request: CheckoutRequest
): Promise<CheckoutResponse> => {
  try {
    // Endpoint for Kora Pay checkout
    const endpoint = `${KORA_API_BASE_URL}/checkout`; // Update to the actual endpoint

    // Set up headers
    const headers = {
      Authorization: `Bearer ${KORA_API_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };

    // Make the API request
    const response = await axios.post(endpoint, request, { headers });

    // Extract the checkout URL from the response
    if (response.data && response.data.data && response.data.data.checkoutUrl) {
      return { checkoutUrl: response.data.data.checkoutUrl };
    } else {
      throw new Error('Invalid response format from Kora Pay API');
    }
  } catch (error) {
    // Handle errors
    console.error('Error making checkout request:', error);
    throw new Error('Failed to create Kora Pay checkout request');
  }
};

// Example usage
(async () => {
  try {
    const checkoutRequest: CheckoutRequest = {
      amount: 5000,
      currency: 'NGN',
      customerName: 'John Doe',
      customerEmail: 'johndoe@example.com',
      reference: `txn-${Date.now()}`,
      description: 'Purchase of goods',
      callbackUrl: 'https://yourdomain.com/payment/callback',
    };

    const response = await createKoraPayCheckout(checkoutRequest);
    console.log('Checkout URL:', response.checkoutUrl);
  } catch (error) {
    console.error(error);
  }
})();
