import type { OrderResult } from '../types/order';
import { calculateOrderTotal } from '../types/order';

export const playSpeech = async (text: string) => {
    try {
        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate speech');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    } catch (error) {
        console.error('Error generating speech:', error);
    }
};

export const speechLogic = (result: OrderResult) => {

    const formatList = (items: string[]) => {
        if (items.length === 1) {
            return items[0]
        }
        

        const firstItems = items.slice(0, -1)
        const lastItem = items[items.length - 1]

        return `${firstItems.join(', ')} and ${lastItem}`
    }

    const formatItem = (item: { name: string, quantity: number }) => {
        if (item.quantity === 1) {
            return item.name
        }

        if (item.name.endsWith('s')) {
            return `${item.quantity} ${item.name}`
        }

        return `${item.quantity} ${item.name}s`
    }

    const availableItems = result.availableItems.map(item => formatItem(({
        name: item.name,
        quantity: item.quantity
    })))

    const unavailableItemNames = result.unavailableItems.map(item => item.name)
    const invalidItemNames = result.invalidItems.map(item => item.name)

    const availableText = formatList(
        availableItems
    )

    const unavailableText = formatList(unavailableItemNames)

    const invalidText = formatList(invalidItemNames)

    const orderTotal = calculateOrderTotal(result)

    if (availableItems.length > 0 &&
        unavailableItemNames.length > 0 &&
        invalidItemNames.length === 0
    ) {
        return `
            ${availableText} ${availableItems.length === 1 ? 'was' : 'were'} added to the cart. 
            Unfortunately, ${unavailableText} ${unavailableItemNames.length === 1 ? 'is' : 'are'} out of stock. 
            Your total is ${orderTotal}.
        `
    }

    if (
        availableItems.length > 0 &&
        unavailableItemNames.length === 0 &&
        invalidItemNames.length > 0
    ) {
        return `
            ${availableText} ${availableItems.length === 1 ? 'was' : 'were'} added to the cart. 
            We don't offer ${invalidText} at this location. Your total is ${orderTotal}
        `
    }

    if (
        availableItems.length === 0 &&
        unavailableItemNames.length > 0 &&
        invalidItemNames.length > 0
    ) {
        return `
            ${unavailableText} ${unavailableItemNames.length === 1 ? 'is' : 'are'} currently out of stock. 
            We don't offer ${invalidText} at this location.
        `
    }

    if (
        availableItems.length > 0 &&
        unavailableItemNames.length === 0 &&
        invalidItemNames.length === 0
    ) {
        return `
            ${availableText} ${
                availableItems.length === 1 ? 'was' : 'were'
            } added to the cart.
            Your total is ${orderTotal}.
        `
    }

    return "Sorry, I couldn't process your order."
}