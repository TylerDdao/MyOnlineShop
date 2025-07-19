import { Link } from "react-router-dom";
import VerticalNavBar from "../../components/sellerComponents/verticalNavBar";
import { orders } from "../../simulateData/data";
import { useTranslation } from "react-i18next";
import { Order } from "../../data/types";
import { useEffect, useState } from "react";
import PriceTag from "../../components/PriceTag";
import ProductCartList from "../../components/ProductCartList";

function AdminOrderDetail(){
    const{t,i18n} = useTranslation();
    const [arrivalDate, setArrivalDate] = useState<string>();
    const status: Order["status"][] = [
        "unknown",
        "on hold",
        "on prepared",
        "on delivered",
        "done",
        "cancelled",
        "refunded"
    ];

    const order = orders[0]

    const formatDate = (order: Order) => {
        const date = order?.arrival_date ? new Date(order.arrival_date) : null;
        if (!date) return order.arrival_date || "N/A";

        if (i18n.language === 'vi') {
            return date.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };
    useEffect(()=>{
        setArrivalDate(formatDate(order));
    }, [i18n])
    return(
        <div className="flex">
            <VerticalNavBar/>
            <div className="h-screen p-5 w-full">
                <Link to={'/admin/order-management'}><button className="primary-button">{t('back to order management')}</button></Link>
                <div className="w-full flex justify-center text-deep_blue title">{t('order')}#{order.order_id}</div>
                <div className="w-full flex justify-evenly">
                    <div className="flex flex-col space-y-10">
                        <div className="flex flex-col space-y-2.5">
                            <div className="h1">{t('order infomation')}</div>
                            <div>
                                <div className="h2">{t('order status')}</div>
                                <select defaultValue={order.status}>
                                    {status.map(index=>(
                                        (index == order.status ? (
                                            <option value={index} key={index} disabled>{index}</option>
                                        ):(
                                            <option value={index} key={index}>{index}</option>
                                        ))
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div className="h2">{t('estimated arrival date')}</div>
                                {order.arrival_date ? (
                                    <div className="h2-b">{arrivalDate}</div>
                                ):(
                                    <div>
                                        <input type="date"/>
                                        <div className="disclaimer text-tomato_red">{t('estimated arrival date is currently n/a')}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2.5">
                            <div className="h1">{t('payment information')}</div>
                            <div>
                                <div className="h2">{t('subtotal')}</div>
                                <PriceTag className="h2-b" value={order.subtotal}/>
                            </div>
                            <div>
                                <div className="h2">{t('delivery fee')}</div>
                                <PriceTag className="h2-b" value={(order.delivery_fee ?? 0)}/>
                            </div>
                            <div>
                                <div className="h2">{t('total')}</div>
                                <PriceTag className="h2-b" value={order.subtotal + (order.delivery_fee ?? 0)}/>
                            </div>
                            <div>
                                <div className="h2">{t('payment type')}</div>
                                <div className="h2-b">{t(order.payment_type)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-10">
                        <div className="flex flex-col space-y-2.5">
                            <div className="h1">{t('customer information')}</div>
                            <div>
                                <div className="h2">{t('name')}</div>
                                <div className="h2-b">{order.customer.customer_name}</div>
                            </div>
                            <div>
                                <div className="h2">{t('phone number')}</div>
                                <div className="h2-b">{order.customer.customer_phone}</div>
                            </div>
                            <div>
                                <div className="h2">{t('email')}</div>
                                {order.customer.customer_email ? (<div className="h2-b">{order.customer.customer_email}</div>) : (<div className="text-gray h2-b">{t("no email")}</div>)}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-10">
                        <div className="flex flex-col space-y-2.5">
                            <div className="h1">{t('cart information')}</div>
                            {order.cart && (<ProductCartList cartList={order.cart} removeable={false}/>)}
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-evenly mt-5">
                    <button className="secondary-button min-w-[200px]">{t("cancel edit")}</button>
                    <button className="primary-button min-w-[200px]">{t("save")}</button>
                    <button className="destructive-button min-w-[200px]">{t("cancel order")}</button>
                </div>
            </div>
        </div>
    )
}

export default AdminOrderDetail;