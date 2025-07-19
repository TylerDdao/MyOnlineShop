import "../index.css";
import {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {BsSearch, BsCartFill, BsList   }  from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";

import { useLocation, Link, useNavigate, useSearchParams} from "react-router-dom";
import united_state_flag from "../assets/united_state_flag.png"
import vietnam_flag from "../assets/vietnam_flag.png"
import { CartItem } from "../data/types";
const NavBar = () => {
  const location = useLocation();
  const path = location.pathname
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [searchActive, setSearchActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([])
  const[item, setItem] = useState<number|null>(null)
  const [query, setQuery] = useState<string>()
  const navigate = useNavigate()

  const flagMap = {
    en: united_state_flag,
    vi: vietnam_flag,
  };

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

  const handleOpenSearch = () =>{
    setSearchActive(!searchActive);
  }

  const handleSearch = () =>{
    navigate(`/products?query=${query}`);
    navigate(0); // forces a soft reload of the current route
  }
  // const [searchParams] = useSearchParams();
  // useEffect(() => {
  //   const query = searchParams.get("query");
  //   if (query) {
  //     fetchProducts(query);
  //   }
  // }, [searchParams]);

  const toggleMobileMenu = () => {
    setMenuActive(!menuActive);
  };
  return (
    <nav className="bg-deep_blue sticky top-0 w-full text-white lg:px-20 p-5 z-50">
        <div className="flex justify-between items-center">
            <div id="shop-name" className="title">{t('shop name')}</div>
            <div className="lg:hidden display flex items-center space-x-5">
              {menuActive ? (
                <div className="lg:hidden display" onClick={toggleMobileMenu}><RxCross1 aria-label="Close Menu" className="w-auto h-10"/></div>
              ) : (
                <div className="lg:hidden display" onClick={toggleMobileMenu}><BsList aria-label="Open Menu" className="w-auto h-10"/></div>
              )}
              <div><button onClick={handleOpenSearch}><BsSearch aria-label="Search" className="w-auto h-10"/></button></div>
              <Link to="/my-cart"><BsCartFill aria-label="My Cart" className="w-auto h-10"/></Link>
            </div>

            <ul className="lg:flex lg:flex-row lg:space-x-20 lg:items-center lg:display hidden">
                <li className={`${path === '/' ? 'h1' : 'h1-b'}`}><Link to="/" >{t('home')}</Link></li>
                <li className={`${path.startsWith('/products') ? 'h1' : 'h1-b'}`}><Link to="/products">{t('products')}</Link></li>
                <li className={`${path.startsWith('/my-order') || window.location.pathname === '/my-order/:orderId' ? 'h1' : 'h1-b'}`}><Link to="/my-order">{t('my order')}</Link></li>
                <li><Link to="/my-cart"><BsCartFill aria-label="My Cart" className="w-auto lg:h-10"/></Link><div>{item}</div></li>
                <li><button onClick={handleOpenSearch}><BsSearch aria-label="Search" className="w-auto lg:h-10"/></button></li>
                <li><button onClick={() => handleChangeLanguage(currentLang === 'en' ? 'vi' : 'en')}><img key={currentLang} alt={`${currentLang}`} className="w-auto lg:h-5 lg:inline-block lg:mr-2" src={flagMap[currentLang]} onError={(e) => e.currentTarget.src = flagMap[currentLang]}/><span className="p">{t('language')}</span></button></li>
            </ul>
        </div>

        {menuActive &&(
          <div>
            <ul className="lg:hidden display flex flex-col space-y-5 py-10 px-5 absolute left-0 bg-deep_blue w-screen">
                  <li className={`${path === '/' ? 'h1' : 'h1-b'}`}><Link to="/" >{t('home')}</Link></li>
                  <li className={`${path.startsWith('/products') ? 'h1' : 'h1-b'}`}><Link to="/products">{t('products')}</Link></li>
                  <li className={`${path.startsWith('/my-order') || window.location.pathname === '/my-order/:orderId' ? 'h1' : 'h1-b'}`}><Link to="/my-order">{t('my order')}</Link></li>
                  <li><button onClick={() => handleChangeLanguage(currentLang === 'en' ? 'vi' : 'en')}><img key={currentLang} alt={`${currentLang}`} className="lg:hidden display w-auto h-5 inline-block mr-2" src={flagMap[currentLang]} onError={(e) => e.currentTarget.src = flagMap[currentLang]}/><span className="p">{t('language')}</span></button></li>
            </ul>
          </div>
        )}

        <div id="search-bar" className={`absolute w-screen h-screen bg-white/30 backdrop-blur-sm top-0 left-0 flex flex-col justify-center text-center ${searchActive ? '' : 'hidden' }`}>
            <div className="flex justify-center"><button onClick={handleOpenSearch} className="text-black h1"><RxCross1 aria-label="Close Search" className="w-auto h-10"/></button></div>
            <div className="lg:flex lg:justify-center lg:space-x-5">
              <input type="text" className="border border-black text-black lg:max-w-[500px] h-fit"  placeholder={t('enter product name')} onChange={(e) => setQuery(e.target.value)}/> 
              <button className="primary-button" onClick={handleSearch}>{t('search')}</button> 
            </div>
        </div>
    </nav>
  );
}

export default NavBar;