function sendWhatsAppMessage(orderItems, totalAmount, address, contactNumber) {
    const phoneNumber = "+923141322340";

    const message = formatOrderMessage(
        orderItems,
        totalAmount,
        address,
        contactNumber
    );

    const apiUrl =
        `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(apiUrl, "_blank");
}

function formatOrderMessage(
    orderItems,
    totalAmount,
    address,
    contactNumber
) {
    let message = `🛒 HAFIZ MART — ORDER RECEIPT

━━━━━━━━━━━━━━━━━━━━

`;

    orderItems.forEach(item => {
        message += `Product: ${item.name}
Size: ${item.size}
Quantity: ${item.quantity}
Price: ${formatCurrency(item.unitPrice * item.quantity)}

━━━━━━━━━━━━━━━━━━━━

`;
    });

    message += `Total Amount: ${formatCurrency(totalAmount)}

Delivery Address:
${address}

Contact Number:
${contactNumber}

━━━━━━━━━━━━━━━━━━━━

Thank you for your order!
HAFIZ MART`;

    return message;
}

function formatCurrency(value) {
    return `PKR ${Number(value).toLocaleString("en-PK")}`;
}

window.sendWhatsAppMessage = sendWhatsAppMessage;
