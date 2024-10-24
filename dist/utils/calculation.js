"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementByPercentage = void 0;
function findOriginalNumber(sum, percentage) {
    const factor = 1 + percentage / 100; // Convert percentage to multiplier (5% becomes 1.05)
    return sum / factor; // Divide the sum by the factor to get the original number
}
exports.default = findOriginalNumber;
function incrementByPercentage(value, percentage) {
    const factor = 1 + percentage / 100; // Convert percentage to multiplier
    return value * factor; // Multiply value by the factor to get the incremented value
}
exports.incrementByPercentage = incrementByPercentage;
