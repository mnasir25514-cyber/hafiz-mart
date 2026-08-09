function sendWhatsAppMessage(orderItems, totalAmount, address, contactNumber) {
    const phoneNumber = '+923141322340'; // Replace with your WhatsApp number using country code, e.g. 923001234567
    const message = formatOrderMessage(orderItems, totalAmount, address, contactNumber);
    const apiUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(apiUrl, '_blank');
}

function formatOrderMessage(orderItems, totalAmount, address, contactNumber) {
    let message = 'Order Details:%0A%0A';
    orderItems.forEach(item => {
        message += `Product: ${item.name}%0A`;
        message += `Size: ${item.size}%0A`;
        message += `Quantity: ${item.quantity}%0A`;
        message += `Price: ${item.price}%0A%0A`;
    });
    message += `Total Amount: ${formatCurrency(totalAmount)}%0A`;
    message += `Delivery Address: ${address}%0A`;
    message += `Contact Number: ${contactNumber}%0A%0A`;
    message += 'Thank you for your order!';
    return message;
}

function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}

window.sendWhatsAppMessage = sendWhatsAppMessage;
