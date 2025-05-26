
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface-soft">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-3xl text-text-primary text-center">
                Terms of Service
              </CardTitle>
              <p className="text-center text-text-secondary">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Acceptance of Terms</h2>
                <p className="text-text-secondary">
                  By accessing and using HealthProAssist, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do 
                  not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">2. Use License</h2>
                <p className="text-text-secondary mb-4">
                  Permission is granted to temporarily download one copy of the materials on HealthProAssist's 
                  website for personal, non-commercial transitory viewing only. This is the grant of a license, 
                  not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Privacy Policy</h2>
                <p className="text-text-secondary">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and 
                  protect your information when you use our service. By using our service, you agree to 
                  the collection and use of information in accordance with our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">4. AI Assistant Disclaimer</h2>
                <p className="text-text-secondary">
                  AVA, our AI assistant, provides information and recommendations based on the data provided. 
                  While we strive for accuracy, the AI recommendations should not replace professional medical 
                  or legal advice. Always consult with qualified professionals before making important care decisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Service Availability</h2>
                <p className="text-text-secondary">
                  We reserve the right to modify or discontinue, temporarily or permanently, the service 
                  (or any part thereof) with or without notice at any time. You agree that we shall not 
                  be liable to you or to any third party for any modification, suspension, or discontinuance 
                  of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Contact Information</h2>
                <p className="text-text-secondary">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-surface-soft rounded-lg">
                  <p className="text-text-primary">
                    Email: legal@healthproassist.com<br />
                    Phone: 1-800-HEALTH (432-584)<br />
                    Address: 123 Healthcare Blvd, Austin, TX 78701
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
