"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKoraPayCheckout = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
// Define the environment variables for security
const KORA_API_BASE_URL = 'https://api.korapay.com';
const KORA_API_SECRET_KEY = config_1.default.koraApiSecretKey;
const createKoraPayCheckout = (request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Endpoint for Kora Pay checkout
        const endpoint = `${KORA_API_BASE_URL}/checkout`; // Update to the actual endpoint
        // Set up headers
        const headers = {
            Authorization: `Bearer ${KORA_API_SECRET_KEY}`,
            'Content-Type': 'application/json',
        };
        // Make the API request
        const response = yield axios_1.default.post(endpoint, request, { headers });
        // Extract the checkout URL from the response
        if (response.data && response.data.data && response.data.data.checkoutUrl) {
            return { checkoutUrl: response.data.data.checkoutUrl };
        }
        else {
            throw new Error('Invalid response format from Kora Pay API');
        }
    }
    catch (error) {
        // Handle errors
        console.error('Error making checkout request:', error);
        throw new Error('Failed to create Kora Pay checkout request');
    }
});
exports.createKoraPayCheckout = createKoraPayCheckout;
// Example usage
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkoutRequest = {
            amount: 5000,
            currency: 'NGN',
            customerName: 'John Doe',
            customerEmail: 'johndoe@example.com',
            reference: `txn-${Date.now()}`,
            description: 'Purchase of goods',
            callbackUrl: 'https://yourdomain.com/payment/callback',
        };
        const response = yield (0, exports.createKoraPayCheckout)(checkoutRequest);
        console.log('Checkout URL:', response.checkoutUrl);
    }
    catch (error) {
        console.error(error);
    }
}))();
