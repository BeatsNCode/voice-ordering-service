import { useState } from 'react';
import type { OrderResult } from '../types/order';

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

export const SpeechLogic = (result: OrderResult) => {

    const availableItems = result.availableItems.map(item => ({
        name: item.name,
        quantity: item.quantity
    }))

    const unavailableItems = result.unavailableItems.map(item => item.name)

    if (availableItems.length === 0 && 
        result.unavailableItems.length === 0 && 
        result.invalidItems.length > 0 ) {
        return "Sorry, I couldn't find any of these items on the menu."
    }

    if (availableItems.length === 0 && 
        result.unavailableItems.length > 0 && 
        result.invalidItems.length === 0 ) {
        
            if (unavailableItems.length === 1) {
                return `${unavailableItems} is out of stock.`
            }

            const firstItems = unavailableItems.slice(0,-1).map(item=> item)
            const lastItem = unavailableItems[unavailableItems.length-1]


        return `${firstItems.join(', ')} and ${lastItem} are not in stock.`
    }

    if (availableItems.length > 0 && 
        result.unavailableItems.length === 0 && 
        result.invalidItems.length === 0 ) {

            if (availableItems.length === 1) {
                return `${availableItems[0].name} was added to the cart.`
            }

            const firstItems = availableItems.slice(0,-1).map(item=> item.name)
            const lastItem = availableItems[availableItems.length-1].name


        return `${firstItems.join(', ')} and ${lastItem} have been added to the cart.`
    }

    return "Sorry, I couldn't process your order."
}