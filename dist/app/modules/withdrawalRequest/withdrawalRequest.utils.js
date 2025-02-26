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
exports.initiateWithdrawal = exports.fetchBankCodes = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';
// Function to fetch bank codes
const fetchBankCodes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${FLUTTERWAVE_BASE_URL}/banks/NG`, {
            headers: {
                Authorization: `Bearer ${config_1.default.flutterwave_public_key}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Adjust according to the actual response structure
    }
    catch (error) {
        console.error('Error fetching bank codes:', error);
        throw new Error('Unable to fetch bank codes');
    }
});
exports.fetchBankCodes = fetchBankCodes;
// Function to initiate the withdrawal
const initiateWithdrawal = ({ tx, account_bank, account_number, amount, narration = 'Withdrawal transaction', // Default narration if none is provided
 }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const allBanks = yield (0, exports.fetchBankCodes)();
        const account_bank_code = (_a = allBanks.data.find(bank => bank.name.toLocaleLowerCase() === account_bank.toLocaleLowerCase())) === null || _a === void 0 ? void 0 : _a.code;
        if (!account_bank_code) {
            throw new Error('No banks found in the system.');
        }
        // Prepare the payout request payload
        const payload = {
            account_bank: account_bank_code, // Bank code or bank identifier (e.g., 044 for Access Bank)
            account_number, // Bank account number
            amount: amount * config_1.default.withdrawDollarRate, // Amount to withdraw
            currency: 'NGN', // Currency code (e.g., NGN, USD)
            narration, // A note about the withdrawal
            reference: tx, // Unique transaction reference
            callback_url: `${config_1.default.baseServerUrl}/currency-request/webhook`, // Optional: callback URL
            debit_currency: 'NGN',
        };
        console.log(payload);
        // Make a POST request to the Flutterwave Payout API
        if (payload.account_bank) {
            const response = yield axios_1.default.post(`${FLUTTERWAVE_BASE_URL}/transfers`, payload, {
                headers: {
                    Authorization: `Bearer ${config_1.default.flutterwave_public_key}`, // Authorization header
                    'Content-Type': 'application/json', // Content type header
                },
            });
            // Return Flutterwave's transfer response
            return response.data;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        // Handle any errors that occurred during the request
        // console.error('Error initiating withdrawal:', error);
    }
});
exports.initiateWithdrawal = initiateWithdrawal;
