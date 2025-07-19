import { useTranslation } from "react-i18next";
import VerticalNavBar from "../../components/sellerComponents/verticalNavBar";
import { useAuth } from "../../AuthContext";
import { useState } from "react";
import { User } from "../../data/types";
import SHA256 from 'crypto-js/sha256';
import axios from "axios";
import { log } from "console";
import { useNavigate } from "react-router-dom";

function Login(){
    const { login } = useAuth();
    const [userName, setUserName] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const navigate = useNavigate()

    const handleHashingPassword = (string) =>{
        setPassword(SHA256(string).toString());
    }

    const handleLogin = async () =>{
        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/login`, {user_name: userName, password: password})

            if(res.status == 200 && res.data.success){
                login({user_name: userName, password: null, user_id: res.data.user_id})
                navigate('/admin/order-management');
            }
        } catch (error) {
            if(error.status == 401){
                console.warn(error.message)
                alert(t('login failed'))
            }
            else{
                console.error(error.message)
                alert(t('something is wrong, please try again'))
            }
            
        }
    }

    const {t} = useTranslation();
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center text-center">
            <div className="bg-deep_blue p-2.5 text-white">
                <div className="h1">{t('admin login')}</div>
                <div className="flex flex-col space-y-2.5 mt-5 items-center">
                    <div className="flex flex-col items-start w-full">
                        <div className="h2-b">{t('user name')}</div>
                        <input className="bg-white border border-deep_blue placeholder:text-gray text-black w-full" placeholder={t('user name')} onChange={(e)=>setUserName(e.target.value)} required/>
                    </div>
                    <div className="flex flex-col items-start w-full">
                        <div className="h2-b">{t('password')}</div>
                        <input type="password" className="bg-white border border-deep_blue placeholder:text-gray text-black w-full" placeholder={t('password')} onChange={(e)=>handleHashingPassword(e.target.value)} required/>
                    </div>
                    <button className="bg-white border border-deep_blue w-full text-deep_blue h2" onClick={handleLogin}>{t('login')}</button>
                </div>
            </div>
        </div>
    )
}

export default Login;