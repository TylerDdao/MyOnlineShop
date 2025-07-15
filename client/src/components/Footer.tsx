import "../index.css";
import {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {BsFacebook , BsInstagram, BsFillTelephoneFill, BsFillEnvelopeFill   }  from "react-icons/bs";
const Footer = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const handleChangeLanguage = (lang) => {
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
    <nav className="bg-deep_blue bottom-0 w-full text-white lg:px-20 lg:py-5 p-5">
        <div className="space-y-5">
            <div id="shop-name" className="title lg:mb-5">{t('shop name')}</div>
            <div className="lg:flex lg:flex-row flex-col space-y-5 lg:space-x-20">
              <div>
                <div className="h1 lg:mb-2.5">{t('follow us')}</div>
                <ul className="lg:space-y-2.5">
                  <li className="p"><BsFacebook className="w-auto lg:h-6 inline-block mr-2.5"/>My Online Shop</li>
                  <li className="p"><BsInstagram className="w-auto lg:h-6 inline-block mr-2.5"/>@myonlineshop</li>
                </ul>
              </div>

              <div>
                <div className="h1 lg:mb-2.5 h2">{t('contact')}</div>
                <ul className="lg:space-y-2.5">
                  <li className="p"><BsFillTelephoneFill className="w-auto lg:h-6 inline-block mr-2.5"/><span id="shop_phone">{t('loading')}</span></li>
                  <li className="p"><BsFillEnvelopeFill className="w-auto lg:h-6 inline-block mr-2.5"/><span id="shop_email">{t('loading')}</span></li>
                </ul>
              </div>
            </div>
        </div>
    </nav>
  );
}

export default Footer;