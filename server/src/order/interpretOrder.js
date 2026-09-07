import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const interpretOrder = async (transcript, menu) => {
    const interaction = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: `
        You are an order interpretation system.

        Your job is NOT to talk to the customer.
        Do NOT explain anything.
        Do NOT provide advice.
        Only extract items from the customer's order.

        Customer transcript:
        ${transcript}

        Available menu:
        ${JSON.stringify(menu)}`
        ,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: {
                type: "object",
                properties: {
                    items: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                item_id: {
                                    type: "string"
                                },
                                quantity: {
                                    type: "integer",
                                    minimum: 1
                                },
                                available: {
                                    type: "boolean"
                                }
                            },
                            required: ["item_id", "quantity", "available"]
                        }
                    }
                },
                required: ["items"]
            }
        }
    });

    const result = JSON.parse(interaction.output_text);
    const orderItems = result.items.map(item => ({
        item_id: item.item_id,
        quantity: item.quantity,
        available: item.available
    }));

    console.log(orderItems);
    return orderItems;
};