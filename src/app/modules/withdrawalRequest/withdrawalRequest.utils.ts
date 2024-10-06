import axios from 'axios';
import config from '../../../config';

// Define the interface for the withdrawal parameters
type WithdrawalParams = {
  tx: string;
  account_bank: string;
  account_number: string;
  amount: number;
  narration?: string; // Optional field
};
const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

// Function to initiate the withdrawal
export const initiateWithdrawal = async ({
  tx,
  account_bank,
  account_number,
  amount,
  narration = 'Withdrawal transaction', // Default narration if none is provided
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
WithdrawalParams): Promise<any> => {
  try {
    const allBanks = await fetchBankCodes();
    const account_bank_code = allBanks.find(
      bank =>
        bank.bank_name.toLocaleLowerCase() === account_bank.toLocaleLowerCase()
    )?.bank_code;
    // Prepare the payout request payload
    const payload = {
      account_bank: account_bank_code, // Bank code or bank identifier (e.g., 044 for Access Bank)
      account_number, // Bank account number
      amount, // Amount to withdraw
      currency: 'NGN', // Currency code (e.g., NGN, USD)
      narration, // A note about the withdrawal
      reference: tx, // Unique transaction reference
      callback_url: `${config.baseServerUrl}/currency-request/webhook`, // Optional: callback URL
    };
    console.log(payload);
    // Make a POST request to the Flutterwave Payout API
    if (payload.account_bank) {
      const response = await axios.post(
        `${FLUTTERWAVE_BASE_URL}/transfers`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${config.flutterwave_public_key}`, // Authorization header
            'Content-Type': 'application/json', // Content type header
          },
        }
      );

      // Return Flutterwave's transfer response
      return response.data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle any errors that occurred during the request
    console.error('Error initiating withdrawal:', error);
  }
};
// Function to fetch bank codes
export const fetchBankCodes = async (): Promise<
  { bank_name: string; bank_code: string }[]
> => {
  try {
    const response = await axios.get(`${FLUTTERWAVE_BASE_URL}/banks/NG`, {
      headers: {
        Authorization: `Bearer ${config.flutterwave_public_key}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Adjust according to the actual response structure
  } catch (error) {
    console.error('Error fetching bank codes:', error);
    throw new Error('Unable to fetch bank codes');
  }
};
