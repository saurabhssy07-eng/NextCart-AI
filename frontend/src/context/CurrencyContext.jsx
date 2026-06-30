import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Fixed conversion rates based on INR (since prices are stored in INR)
// Examples: 1 USD = 83 INR -> rate is 1/83
// 1 EUR = 90 INR -> rate is 1/90
const EXCHANGE_RATES = {
  INR: 1,
  USD: 1 / 83,
  EUR: 1 / 90,
};

const CURRENCY_LOCALES = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE', // typical for EUR formatting
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState('INR');

  // Load from local storage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('nextcart_currency');
    if (savedCurrency && EXCHANGE_RATES[savedCurrency]) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency) => {
    if (EXCHANGE_RATES[newCurrency]) {
      setCurrencyState(newCurrency);
      localStorage.setItem('nextcart_currency', newCurrency);
    }
  };

  const formatPrice = (priceInINR) => {
    if (priceInINR === null || priceInINR === undefined || isNaN(priceInINR)) return '';
    
    const rate = EXCHANGE_RATES[currency] || 1;
    const convertedPrice = priceInINR * rate;
    const locale = CURRENCY_LOCALES[currency] || 'en-IN';
    
    // For INR, we usually don't want decimals if it's whole. 
    // For USD/EUR, standard 2 decimal places.
    const options = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'INR' ? 0 : 2,
      maximumFractionDigits: currency === 'INR' ? 0 : 2,
    };

    return new Intl.NumberFormat(locale, options).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};
