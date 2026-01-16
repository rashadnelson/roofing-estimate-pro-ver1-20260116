import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-4xl font-extrabold tracking-tight mb-8">
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using PlumbPro Estimate, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  PlumbPro Estimate provides a web-based platform for creating, managing, and sending 
                  professional estimates. The service includes estimate creation tools, PDF generation, 
                  email delivery, and client management features.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4">3. Subscription and Payment</h2>
                <p className="text-muted-foreground mb-4">
                  Access to PlumbPro Estimate requires a paid subscription:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Annual subscription fee: $149/year</li>
                  <li>Payment is processed through Stripe</li>
                  <li>Access is granted immediately upon successful payment</li>
                  <li>Subscriptions auto-renew unless cancelled</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4">4. User Responsibilities</h2>
                <p className="text-muted-foreground mb-4">
                  You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Ensuring the accuracy of information you provide</li>
                  <li>Complying with all applicable laws and regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content, features, and functionality of PlumbPro Estimate are owned by us and are 
                  protected by copyright, trademark, and other intellectual property laws. You retain 
                  ownership of any content you create using our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  PlumbPro Estimate is provided "as is" without warranties of any kind. We are not liable 
                  for any indirect, incidental, special, or consequential damages arising from your use 
                  of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4">7. Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your access to the service at our discretion, 
                  particularly for violations of these terms. You may cancel your subscription at any time 
                  through your account settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4">8. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may update these terms from time to time. We will notify you of significant changes 
                  via email or through the service. Continued use after changes constitutes acceptance.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4">9. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, contact us at:{" "}
                  <a href="mailto:support@plumbproestimate.dev" className="text-accent hover:underline">
                    support@plumbproestimate.dev
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
