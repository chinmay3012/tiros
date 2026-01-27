function RefundCancellationPolicy() {
    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center" style={{ fontFamily: 'Kode Mono, monospace', color: 'hsl(220, 13%, 13%)' }}>
                    Refund and Cancellation Policy
                </h1>
                
                <div className="prose prose-lg max-w-none space-y-4" style={{ color: 'hsl(220, 13%, 13%)', fontFamily: 'Poppins, sans-serif' }}>
                    <h2 className="text-xl font-semibold">RETURNS (THE 7-DAY WINDOW)</h2>
                    <p>
                        Our policy lasts 7 days. If 7 days have gone by since your delivery, unfortunately, we cannot offer you a
                        refund or exchange. To be eligible for a return, your item must be unused and in the same condition that
                        you received it. It must also be in the original packaging.
                    </p>
                    <p>
                        <span className="font-semibold">Note on Paddles:</span> For hygiene and performance integrity reasons, any paddle where the
                        shrink-wrap on the handle has been removed or the face shows ball marks is strictly non-returnable.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">CANCELLATIONS</h2>
                    <p>
                        Orders are processed quickly to ensure fast delivery. You may request a cancellation within 6 hours of
                        placing the order. After this window, the order may have already been handed over to our logistics
                        partners. If the order has already shipped, you must follow the standard Return process upon arrival
                        (shipping costs will not be refunded).
                    </p>

                    <h2 className="text-xl font-semibold mt-4">REFUNDS (IF APPLICABLE)</h2>
                    <p>
                        Once your return is received and inspected, we will send you an email to notify you that we have received
                        your returned item. We will also notify you of the approval or rejection of your refund. If you are
                        approved, then your refund will be processed, and a credit will automatically be applied to your credit
                        card or original method of payment, within 7-10 working days.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">EXCHANGES/REPLACEMENT (IF APPLICABLE)</h2>
                    <p>
                        We only replace or exchange items if they are defective or damaged due to a manufacturing fault. If you
                        need to exchange or replace it for the same item, send us an email at topshotinfra@gmail.com within 3
                        days of delivery. If any replacement / exchange is approved the new item will be delivered to you within
                        3 - 5 business days to your registered address from the date of approval.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">SHIPPING RETURNS</h2>
                    <p>
                        You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are
                        non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RefundCancellationPolicy;

