import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
                
                <div className="space-y-6 text-gray-600">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
                        <p>
                            Humanity Club Organization (HCO), registered under the Indian Trusts Act, 1882, is committed to protecting your privacy. 
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you interact with our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Personal identification information (Name, email address, phone number, etc.)</li>
                            <li>Donation information and transaction details</li>
                            <li>Volunteer registration information</li>
                            <li>Feedback and correspondence</li>
                            <li>Website usage data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Use of Information</h2>
                        <p>We use the collected information for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Processing donations and issuing receipts</li>
                            <li>Communicating about our programs and activities</li>
                            <li>Responding to inquiries and feedback</li>
                            <li>Improving our services and website</li>
                            <li>Complying with legal obligations</li>
                            <li>Sending newsletters and updates (with consent)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
                        <p>
                            We implement appropriate security measures to protect against unauthorized access, alteration, 
                            disclosure, or destruction of your information. However, no method of transmission over the 
                            Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Third-Party Disclosure</h2>
                        <p>
                            We do not sell or trade your information to third parties. We may share your information with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Service providers who assist in our operations</li>
                            <li>Government authorities when required by law</li>
                            <li>Payment processors for donation transactions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your information</li>
                            <li>Opt-out of communications</li>
                            <li>File a complaint with relevant authorities</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact Information</h2>
                        <p>
                            For any questions or concerns about this Privacy Policy, please contact us at:<br />
                            Email: info@hco.org<br />
                            Phone: [Your Phone Number]<br />
                            Address: [Your Organization's Address]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Updates to Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. The updated version will be indicated by 
                            an updated "Last Updated" date and the updated version will be effective as soon as it is posted.
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

export default PrivacyPolicy; 