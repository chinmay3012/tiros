function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center" style={{ fontFamily: 'Kode Mono, monospace', color: 'hsl(220, 13%, 13%)' }}>
                    Shipping Policy
                </h1>
                
                <div className="prose prose-lg max-w-none space-y-4" style={{ color: 'hsl(220, 13%, 13%)', fontFamily: 'Poppins, sans-serif' }}>
                    <h2 className="text-xl font-semibold">SHIPMENT PROCESSING TIME</h2>
                    <p>
                        All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or
                        holidays. If we are experiencing a high volume of orders (e.g., during a &quot;New Drop&quot;), shipments may be
                        delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant
                        delay in shipment of your order, we will contact you via email or telephone.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">SHIPPING RATES &amp; DELIVERY ESTIMATES</h2>
                    <p>
                        Shipping charges for your order will be calculated and displayed at checkout.
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Standard Domestic (India): 3-5 business days.</li>
                        <li>Express Domestic: 2-4 business days.</li>
                        <li>International Shipping: 7-21 business days depending on location.</li>
                    </ul>
                    <p>
                        <span className="font-semibold">Note:</span> Delivery delays can occasionally occur due to courier issues or weather conditions.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">SHIPMENT CONFIRMATION &amp; ORDER TRACKING</h2>
                    <p>
                        You will receive a Shipment Confirmation email once your order has shipped containing your tracking
                        number(s). The tracking number will be active within 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ShippingPolicy;

