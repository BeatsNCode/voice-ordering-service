import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const interpretOrder = async (transcript, menu) => {
    const interaction = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: `
            You are an order interpretation system.

            Do not talk to the customer.
            Do not explain anything.
            Extract EVERY item the customer requests.

            Match requested items to the provided menu when possible.

            If a requested item does not exist on the menu:
            - do not omit it
            - set item_id to null
            - preserve what the customer asked for in requested_name

            Customer transcript:
            ${transcript}

            Available menu:
            ${JSON.stringify(menu)}
        `
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
                                    type: ["string", "null"]
                                },
                                name: {
                                    type: "string"
                                },
                                price: {
                                    type: "number"
                                },
                                quantity: {
                                    type: "integer",
                                    minimum: 1
                                },
                                available: {
                                    type: "boolean"
                                }
                            },
                            required: ["item_id", "name", "price", "quantity", "available"]
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
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        available: item.available
    }));

    return orderItems;
};