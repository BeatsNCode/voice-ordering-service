import {interpretOrder} from './order/interpretOrder.js';

export const validateOrder = async (transcript, menu) => {
    const orderItems = await interpretOrder(transcript, menu);
    const validItems = orderItems.filter(item => menu.some(menuItem => menuItem.item_id === item.item_id));

    return validItems;
};