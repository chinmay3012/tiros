function ReturnPolicy() {
    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center" style={{ fontFamily: 'Kode Mono, monospace', color: 'hsl(220, 13%, 13%)' }}>
                    Return Policy
                </h1>
                
                <div className="prose prose-lg max-w-none" style={{ color: 'hsl(220, 13%, 13%)', fontFamily: 'Poppins, sans-serif' }}>
                    <p className="mb-4">
                        We offer refund / exchange within first 15 days 15 days
                        from the date of your purchase. If have passed
                        since your purchase, you will not be offered a return, exchange or refund of any kind. In order to become
                        eligible for a return or an exchange, (i) the purchased item should be unused and in the same condition as
                        you received it, (ii) the item must have original packaging, (iii) if the item that you purchased on a sale,
                        then the item may not be eligible for a return / exchange. Further, only such items are replaced by us
                        (based on an exchange request), if such items are found defective or damaged.
                    </p>
                    
                    <p className="mb-4">
                        You agree that there may be a certain category of products / items that are exempted from returns or
                        refunds. Such categories of the products would be identified to you at the item of purchase. For exchange
                        / return accepted request(s) (as applicable), once your returned product / item is received and inspected
                        by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further.
                        If the same has been approved after the quality check at our end, your request (i.e. return / exchange) will
                        be processed in accordance with our policies.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ReturnPolicy;

