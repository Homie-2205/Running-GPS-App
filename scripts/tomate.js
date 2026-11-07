
const PRICE_PER_KILO = 5800;

function recalculatePrice() {
    const pesoInput = document.getElementById('weight').value;
    const precioTotalSpan = document.getElementById('totalPrice');
    
    const currentWeight = parseFloat(pesoInput) || 0;
    const finalPrice = currentWeight * PRICE_PER_KILO;
    
    precioTotalSpan.textContent = finalPrice.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
