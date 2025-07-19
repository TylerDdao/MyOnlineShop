import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsReceipt, BsFillBoxFill  } from "react-icons/bs";


const VerticalNavBar = () =>{
    const {t} = useTranslation()
    const location = useLocation()
    const path = location.pathname
    return(
        <div className="min-w-[450px] h-screen bg-deep_blue flex flex-col items-center justify-center text-center px-2.5 space-y-5">
            <Link to={"/admin/order-management"} className={`${path.startsWith("/admin/order-management") ? 'bg-white text-deep_blue' : 'text-white border border-white'} w-full py-2.5 h1-b`}><div className={`flex justify-center items-center space-x-2.5`}><BsReceipt className="w-8 h-auto"/><div>{t('order management')}</div></div></Link>
            <Link to={"/admin/inventory-management"} className={`${path.startsWith("/admin/inventory-management") ? 'bg-white text-deep_blue' : 'text-white border border-white'} w-full py-2.5 h1-b`}><div className={`flex justify-center space-x-2.5`}><BsFillBoxFill className="w-8 h-auto"/><div>{t('inventory management')}</div></div></Link>
        </div>
    )
}

export default VerticalNavBar;