import { useTranslation } from "react-i18next";
import VerticalNavBar from "../../components/sellerComponents/verticalNavBar";

import { orders } from "../../simulateData/data";
import PriceTag from "../../components/PriceTag";
import { useEffect } from "react";
import { Order } from "../../data/types";
import { Link } from "react-router-dom";

function OrderManagement(){
    const {t, i18n} = useTranslation();
    useEffect(() => {
        i18n.changeLanguage("en");
    }, []);

    const formatDate = (order: Order) => {
        const date = order?.arrival_date ? new Date(order.arrival_date) : null;
        if (!date) return 'N/A';

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

    return (
        <div className="flex">
        <VerticalNavBar/>
        <div className="px-5 pb-5 w-full h-screen overflow-y-auto flex flex-col space-y-5">
            <div className="sticky top-0 p-5 backdrop-blur-sm bg-white/70">
                <div className="flex space-x-5">
                    <input placeholder={t('tìm kiếm đơn hàng')} />
                    <button className="primary-button">{t('tìm kiếm')}</button>
                </div>
            </div>
            <div className="flex flex-col space-y-5 w-full">
                {orders.map(order =>{
                    const date = formatDate(order);
                    return(
                        <div className="border border-deep_blue p-2.5 flex flex-col w-full" key={order.order_id}>
                        <div className="h1 text-deep_blue">{t('đơn hàng')}# {order.order_id}</div>
                        <div className="flex justify-evenly">
                            <div className="flex flex-col space-y-2.5">
                                <div>
                                    <div className="h2">{t('customer name')}</div>
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

                                <div>
                                    <div className="h2">{t('delivery address')}</div>
                                    <div className="h2-b">{order.address.street}</div>
                                    <div className="h2-b">{order.address.ward}</div>
                                    <div className="h2-b">{order.address.district}</div>
                                    <div className="h2-b">{order.address.city}</div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2.5">
                                <div>
                                    <div className="h2">{t('subtotal')}</div>
                                    <PriceTag className="h2-b" value={order.subtotal} />
                                </div>

                                <div>
                                    <div className="h2">{t('delivery fee')}</div>
                                    <PriceTag className="h2-b" value={order.delivery_fee} />
                                </div>

                                <div>
                                    <div className="h2">{t('total')}</div>
                                    <PriceTag className="h2-b" value={order.subtotal + (order.delivery_fee ?? 0)} />
                                </div>

                                <div>
                                    <div className="h2">{t('payment type')}</div>
                                    <div className="h2-b">{t(order.payment_type)}</div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2.5">
                                <div>
                                    <div className="h2">{t('order status')}</div>
                                    <div className="h2-b">{order.status}</div>
                                </div>

                                <div>
                                    <div className="h2">{t('estimated arrival date')}</div>
                                    {order.arrival_date ? (<div className="h2-b">{date}</div>) : (<div className="h2-b text-gray">{t('n/a')}</div>)}
                                </div>

                                <div className="flex space-x-5">
                                    <Link to={`/admin/order-management/${order.order_id}`}><button className="primary-button">{t('detail')}</button></Link>
                                    <button className="destructive-button bg-tomato-red">{t('delete order')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
        </div>
    )
}

export default OrderManagement;