module.exports = {
  valid_input_fields: {
    ripple_address: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz',
    cold_wallet_secret: process.env.RIPPLE_ACCOUNT_SECRET,
    currencies: {
      'POP': 100
    }
  },
  invalid_input_no_address: {
    ripple_address: '',
    cold_wallet_secret: process.env.RIPPLE_ACCOUNT_SECRET,
    currencies: {
      'POP': 100
    }
  },
  invalid_input_address: {
    ripple_address: 'asdfasdfsdfw',
    cold_wallet_secret: process.env.RIPPLE_ACCOUNT_SECRET,
    currencies: {
      'POP': 100
    }
  },
  invalid_input_no_secret: {
    ripple_address: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz',
    cold_wallet_secret: '',
    currencies: {
      'POP': 100
    }
  },
  invalid_input_secret: {
    ripple_address: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz',
    cold_wallet_secret: 'sdfsadf',
    currencies: {
      'POP': 100
    }
  },
  invalid_input_no_currency: {
    ripple_address: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz',
    cold_wallet_secret: 'sdfsadf'
  },
  invalid_input_currency: {
    ripple_address: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz',
    cold_wallet_secret: 'sdfsadf',
    currencies: {
      'POP': 'asdfasdf'
    }
  }
};