import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NavBar from '../components/NavBar';
function Translate() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // language will change asynchronously
  };

  // Listen for language change and update state
  useEffect(() => {
    const onLanguageChanged = (lng) => {
      setCurrentLang(lng);
    };

    i18n.on('languageChanged', onLanguageChanged);

    // Cleanup listener
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, [i18n]);

  return (
    <div>
      <NavBar/>
      <h1>{t('welcome')}</h1>
      <button onClick={() => changeLanguage('en')}>🇺🇸 English</button>
      <button onClick={() => changeLanguage('vi')}>🇻🇳 Vietnamese</button>
      
      <img
        alt="Current Language Flag"
        style={{ width: '100px', height: '100px' }}
        src={`/images/${currentLang}.png`} // dynamic image based on lang
      />
    </div>
  );
}

export default Translate;
