function sendWhatsAppMessage(
    orderItems,
    totalAmount,
    address,
    contactNumber
) {
    const phoneNumber = "923141322340";

    let message =
        "🛒 HAFIZ MART - NEW ORDER\n\n";

    orderItems.forEach(item => {
        const itemTotal =
            Number(item.unitPrice) *
            Number(item.quantity);

        message +=
            `Product: ${item.name}\n` +
            `Size: ${item.size}\n` +
            `Quantity: ${item.quantity}\n` +
            `Price: PKR ${itemTotal.toLocaleString("en-PK")}\n\n`;
    });

    message +=
        "------------------------------\n";

    message +=
        `TOTAL: PKR ${Number(totalAmount).toLocaleString("en-PK")}\n\n`;

    message +=
        `Address: ${address}\n`;

    message +=
        `Contact: ${contactNumber}\n\n`;

    message +=
        "Payment: Cash on Delivery\n\n";

    message +=
        "Thank you for ordering from HAFIZ MART!";

    const url =
        `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}

window.sendWhatsAppMessage =
    sendWhatsAppMessage;
