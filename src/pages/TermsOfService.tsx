import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="SafeGuard Nigeria" className="w-32 h-auto" />
            </div>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground mt-2">Last Updated: January 2025</p>
          </CardHeader>
          
          <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p className="text-foreground/90 leading-relaxed">
                By accessing and using SafeGuard Nigeria ("the App"), you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the App. These terms apply to all users, including parents, 
                guardians, and children using the family safety features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Description of Service</h2>
              <p className="text-foreground/90 leading-relaxed">
                SafeGuard Nigeria provides a comprehensive family safety platform designed to protect children and families in Nigeria. 
                Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Real-time location tracking and geofencing capabilities</li>
                <li>Emergency alert system and SOS features</li>
                <li>Parental control and screen time management</li>
                <li>Threat detection and danger zone mapping</li>
                <li>Device security monitoring</li>
                <li>Family connection and communication features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. User Eligibility and Accounts</h2>
              <p className="text-foreground/90 leading-relaxed mb-2">
                <strong>Age Requirements:</strong> Users must be at least 18 years old to create a parent account. Children under 18 
                may use the App only with parental consent and supervision through a linked parent account.
              </p>
              <p className="text-foreground/90 leading-relaxed mb-2">
                <strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account 
                credentials and for all activities under your account. You must notify us immediately of any unauthorized access.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                <strong>Accurate Information:</strong> You agree to provide accurate, current, and complete information during 
                registration and to update such information as necessary.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Parental Consent and Responsibilities</h2>
              <p className="text-foreground/90 leading-relaxed mb-2">
                Parents and guardians who create accounts and link child accounts represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>They have legal authority over the child they are monitoring</li>
                <li>They have obtained proper consent to monitor the child's activities and location</li>
                <li>They will use the App's features responsibly and in the best interest of the child</li>
                <li>They will respect the child's privacy and dignity while using monitoring features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Acceptable Use Policy</h2>
              <p className="text-foreground/90 leading-relaxed mb-2">You agree NOT to use the App to:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Violate any applicable laws or regulations</li>
                <li>Monitor individuals without proper legal authority or consent</li>
                <li>Harass, stalk, or harm any person</li>
                <li>Submit false emergency alerts or danger zone reports</li>
                <li>Interfere with the App's security features or functionality</li>
                <li>Reverse engineer, decompile, or attempt to extract source code</li>
                <li>Use the App for any commercial purpose without authorization</li>
                <li>Transmit malware, viruses, or harmful code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Location Services and Tracking</h2>
              <p className="text-foreground/90 leading-relaxed">
                The App uses device location services to provide safety features. By using location-based features, you consent to 
                the collection, processing, and storage of location data. Location tracking requires explicit permission from the 
                device user. Parents must obtain consent from their children before enabling location tracking features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Emergency Services</h2>
              <p className="text-foreground/90 leading-relaxed">
                While SafeGuard Nigeria provides emergency alert features, it is NOT a substitute for official emergency services. 
                In case of a real emergency, always contact local authorities (police, medical services) immediately by calling 
                emergency numbers (112, 199, etc.). We do not guarantee response times or the effectiveness of emergency alerts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Data Accuracy and Limitations</h2>
              <p className="text-foreground/90 leading-relaxed">
                Location data, threat assessments, and other information provided by the App may not always be accurate or complete. 
                The App depends on device sensors, network connectivity, and third-party services. We are not liable for inaccuracies, 
                delays, or failures in data collection or transmission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Intellectual Property</h2>
              <p className="text-foreground/90 leading-relaxed">
                All content, features, and functionality of the App, including but not limited to text, graphics, logos, icons, images, 
                and software, are the exclusive property of SafeGuard Nigeria and are protected by international copyright, trademark, 
                and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Disclaimer of Warranties</h2>
              <p className="text-foreground/90 leading-relaxed">
                THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
                WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. USE THE APP AT YOUR OWN RISK.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">11. Limitation of Liability</h2>
              <p className="text-foreground/90 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAFEGUARD NIGERIA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES 
                RESULTING FROM YOUR USE OR INABILITY TO USE THE APP, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">12. Termination</h2>
              <p className="text-foreground/90 leading-relaxed">
                We reserve the right to suspend or terminate your account and access to the App at any time, with or without notice, 
                for any reason, including violation of these Terms. You may terminate your account at any time through the App settings. 
                Upon termination, your right to use the App will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">13. Modifications to Terms</h2>
              <p className="text-foreground/90 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or 
                in-app notification. Your continued use of the App after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">14. Governing Law</h2>
              <p className="text-foreground/90 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, 
                without regard to its conflict of law provisions. Any disputes arising from these Terms or use of the App shall 
                be subject to the exclusive jurisdiction of Nigerian courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">15. Contact Information</h2>
              <p className="text-foreground/90 leading-relaxed">
                For questions or concerns about these Terms of Service, please contact us at:
              </p>
              <p className="text-foreground/90 leading-relaxed mt-2">
                Email: legal@safeguardnigeria.com<br />
                Address: SafeGuard Nigeria, Lagos, Nigeria
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">16. Severability</h2>
              <p className="text-foreground/90 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated 
                to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center">
                By using SafeGuard Nigeria, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
