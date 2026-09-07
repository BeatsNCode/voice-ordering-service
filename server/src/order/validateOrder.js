import {interpretOrder} from './interpretOrder.js';

export const validateOrder = async (transcript, menu) => {
    const orderItems = await interpretOrder(transcript, menu);
    const available = orderItems.filter(item => menu.some(menuItem => menuItem.item_id === item.item_id && menuItem.available === true));

    return available;
};

