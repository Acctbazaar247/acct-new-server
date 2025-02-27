import { InvoiceReturn } from '@nowpaymentsio/nowpayments-api-js/src/actions/create-invoice';
import axios from 'axios';
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../errors/ApiError';

const createNowPayInvoice = async ({
  pay_currency_btc,
  ...invoice
}: {
  price_amount: number;
  ipn_callback_url: string;
  order_id: string;
  order_description?: string;
  success_url: string;
  cancel_url: string;

  pay_currency_btc: boolean | undefined;
}): Promise<InvoiceReturn> => {
  const nowPaymentsApiKey = config.nowPaymentApiKey || ''; // Use your sandbox API key
  // Use the sandbox API URL
  const sandboxApiUrl = config.nowPaymentInvoiceUrl || '';

  try {
    const response = await axios.post(
      sandboxApiUrl,
      {
        ...invoice,
        price_amount: invoice.price_amount,
        ipn_callback_url: invoice.ipn_callback_url
          ? config.baseServerUrl + invoice.ipn_callback_url
          : undefined,
        price_currency: 'USD',
        pay_currency: pay_currency_btc ? 'BTC' : undefined,
        // is_fee_paid_by_user: true,
      },
      {
        headers: {
          'x-api-key': nowPaymentsApiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
  }
};
export default createNowPayInvoice;
