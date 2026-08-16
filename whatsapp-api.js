function sendWhatsAppMessage(
    orderItems,
    totalAmount,
    address,
    contactNumber
) {

    const phoneNumber =
        "923141322340";


    const message =
        formatOrderMessage(
            orderItems,
            totalAmount,
            address,
            contactNumber
        );


    const apiUrl =
        `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;


    window.open(
        apiUrl,
        "_blank"
    );
}


function formatOrderMessage(
    orderItems,
    totalAmount,
    address,
    contactNumber
) {

    let message =
        "🛒 HAFIZ MART - NEW ORDER\n\n";


    message +=
        "ORDER DETAILS\n";

    message +=
        "-------------------------\n\n";


    orderItems.forEach(item => {

        const itemTotal =
            item.unitPrice * item.quantity;


        message +=
            `Product: ${item.name}\n`;

        message +=
            `Size: ${item.size}\n`;

        message +=
            `Quantity: ${item.quantity}\n`;

        message +=
            `Price: PKR ${itemTotal.toLocaleString("en-PK")}\n\n`;

    });


    message +=
        "-------------------------\n";


    message +=
        `TOTAL: PKR ${Number(totalAmount).toLocaleString("en-PK")}\n\n`;


    message +=
        "DELIVERY INFORMATION\n\n";


    message +=
        `Address: ${address}\n`;

    message +=
        `Contact: ${contactNumber}\n\n`;


    message +=
        "Payment: Cash on Delivery\n\n";


    message +=
        "Thank you for ordering from HAFIZ MART!";


    return message;
}


window.sendWhatsAppMessage =
    sendWhatsAppMessage;
