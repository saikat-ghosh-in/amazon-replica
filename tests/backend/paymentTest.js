import { formatAmount } from '../../backend/payment.js';

describe('formatCurrency test', () => {
    it('checks for cents', () => {
        expect(formatAmount(2001)).toEqual('20.01');
        expect(formatAmount(20)).toEqual('0.20');

    });
    it('checks for 0', () => {
        expect(formatAmount(0)).toEqual('0.00');

    });
    it('checks for decimal cents', () => {
        expect(formatAmount(3012.4)).toEqual('30.12');
        expect(formatAmount(3012.8)).toEqual('30.13');

    });
});