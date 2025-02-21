export default class UPay {

    static  TYPE_CASH = '0';
    static  TYPE_CARD = '1';
    static  TYPE_PAYPAL = '2';
    static  TYPE_CORPORATE = '3';

    static  CARD_TYPE_OTHER = '0';
    static  CARD_TYPE_VISA = '1';
    static  CARD_TYPE_MASTERCARD = '2';
    static  CARD_TYPE_AMEX = '3';
    static  CARD_TYPE_DISCOVER = '4';

    static paymentIcon(method, typeCard = '') {
        switch (method) {
            case UPay.TYPE_CASH:
                return 'assets/img/payment_cash.png';
            case UPay.TYPE_CARD:
                switch (typeCard) {
                    case UPay.CARD_TYPE_VISA:
                        return 'assets/img/payment_card_visa.png';
                    case UPay.CARD_TYPE_MASTERCARD:
                        return 'assets/img/payment_card_mastercard.png';
                    case UPay.CARD_TYPE_AMEX:
                        return 'assets/img/payment_card_amex.png';
                    case UPay.CARD_TYPE_DISCOVER:
                        return 'assets/img/payment_card_discover.png';
                    case UPay.CARD_TYPE_OTHER:
                    default:
                        return 'assets/img/payment_card.png';
                }
                break;
            case UPay.TYPE_PAYPAL:
                return 'assets/img/payment_paypal.png';
            default:
                return 'assets/img/payment_card.png';
        }
    }
}