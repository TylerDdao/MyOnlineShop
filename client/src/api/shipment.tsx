import axios from 'axios';
import { ShipmentFeeResponse } from "../data/types";

export const fetchShipmentFee = async ({
  address,
  province,
  district,
  pick_province = "Hà Nội",
  pick_district = "Nam Từ Liêm",
  weight,
  value,
  deliver_option = "none"
}: {
  address: string;
  province: string;
  district: string;
  pick_province: string;
  pick_district: string;
  weight: number;
  value: number;
  deliver_option: string;
}): Promise<ShipmentFeeResponse> => {
  try {
    const response = await axios.get<ShipmentFeeResponse>('https://services.giaohangtietkiem.vn/services/shipment/fee', {
      params: {
        address,
        province,
        district,
        pick_province,
        pick_district,
        weight,
        value,
        deliver_option
      },
      headers: {
        'Token': '27MWTwQQzchQa9nK6Q9U3Fi1x1VBPnOzL57jT8U',
        'X-Client-Source': '{PARTNER_CODE}'
      }
    });

    console.log('Shipment fee data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching shipment fee:', error);
    throw error;
  }
};
