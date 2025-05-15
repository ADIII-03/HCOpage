import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Terms and Conditions</h1>
                
                <div className="space-y-6 text-gray-600">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
                        <p>
                            Welcome to Humanity Club Organization (HCO). These Terms and Conditions govern your use of our 
                            website and services. HCO is registered under the Indian Trusts Act, 1882, and operates as a 
                            non-profit organization in India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Acceptance of Terms</h2>
                        <p>
                            By accessing our website and using our services, you agree to be bound by these Terms and 
                            Conditions. If you disagree with any part of these terms, please do not use our website or services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Donations</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>All donations are voluntary and non-refundable</li>
                            <li>Donations are subject to Indian tax laws and regulations</li>
                            <li>We provide donation receipts for tax purposes</li>
                            <li>Online donations are processed through secure payment gateways</li>
                            <li>We maintain transparency in the utilization of donations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Intellectual Property</h2>
                        <p>
                            The content on this website, including text, graphics, logos, and images, is the property of 
                            HCO and is protected by Indian copyright laws. You may not use our content without our 
                            express written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Volunteer Participation</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Volunteer participation is subject to our screening process</li>
                            <li>Volunteers must adhere to our code of conduct</li>
                            <li>We reserve the right to terminate volunteer engagement</li>
                            <li>Volunteers are not entitled to any remuneration</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Limitation of Liability</h2>
                        <p>
                            HCO shall not be liable for any direct, indirect, incidental, consequential, or punitive 
                            damages arising out of your access to or use of our website and services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Governing Law</h2>
                        <p>
                            These Terms and Conditions are governed by the laws of India. Any disputes shall be subject 
                            to the exclusive jurisdiction of the courts in [Your City], India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Compliance with Laws</h2>
                        <p>
                            We comply with all applicable Indian laws, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Indian Trusts Act, 1882</li>
                            <li>Income Tax Act, 1961</li>
                            <li>Foreign Contribution (Regulation) Act, 2010</li>
                            <li>Information Technology Act, 2000</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Modifications</h2>
                        <p>
                            We reserve the right to modify these Terms and Conditions at any time. Continued use of our 
                            website and services after any modifications indicates your acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Contact Information</h2>
                        <p>
                            For any questions regarding these Terms and Conditions, please contact us at:<br />
                            Email: info@hco.org<br />
                            Phone: [Your Phone Number]<br />
                            Address: [Your Organization's Address]
                        </p>
                        <p className="mt-4">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions; 