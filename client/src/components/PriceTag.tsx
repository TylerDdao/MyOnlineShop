// components/FormattedPrice.jsx
import React from 'react';
import {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';

const PriceTag = ({ value, className="", currency = 'VND', showCurrency = true }) => {
    const { t, i18n } = useTranslation();
    let locale;
    if(i18n.language === 'vi') {
        locale = 'vi-VN';
    }
    else if(i18n.language === 'en') {
        locale = 'en-US';
    }
    useEffect(() => {
        const onLanguageChanged = (lng) => {
        if(i18n.language === 'vi') {
            locale = 'vi-VN';
        }
        else if(i18n.language === 'en') {
            locale = 'en-US';
        }
        };
    
        i18n.on('languageChanged', onLanguageChanged);
    
        // Cleanup listener
        return () => {
        i18n.off('languageChanged', onLanguageChanged);
        };
    }, [i18n]);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <span className={`${className}`}>
      {formatted} {showCurrency && currency}
    </span>
  );
};

export default PriceTag;
