export const parseOrder = (transcript, menuData) => {
    const orderItems = []

    const normalizedTranscript = transcript.toLowerCase()

    for (const item of menuData) {
        const itemName = item.name.toLowerCase()

        if (normalizedTranscript.includes(itemName)) {
            orderItems.push(item)
        }
    }

    console.log('Parsed order items:', orderItems)

    return orderItems
}