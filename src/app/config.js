import createNumberMask from 'text-mask-addons/dist/createNumberMask';
export const CONFIG = {
    numberDecimalSpaceMaskOptions:{
        mask: createNumberMask({
                prefix: '',
                suffix: '',
                includeThousandsSeparator: true,
                thousandsSeparatorSymbol: ' ',
                allowDecimal: true,
                decimalSymbol: ',',
                decimalLimit: 2,
                integerLimit: 4,
                requireDecimal: false,
                allowNegative: true,
                allowLeadingZeroes: false
            })
    },
    numberSpaceMaskOptions:{
        mask: createNumberMask({
                prefix: '',
                suffix: '',
                includeThousandsSeparator: true,
                thousandsSeparatorSymbol: ' ',
                allowDecimal: false,
                integerLimit: 2,
                requireDecimal: false,
                allowNegative: true,
                allowLeadingZeroes: false
            })
    }
}