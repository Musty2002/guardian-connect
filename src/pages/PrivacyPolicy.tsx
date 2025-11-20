import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground mt-2">Last Updated: January 2025</p>
          </CardHeader>
          
          <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Introduction</h2>
              <p className="text-foreground/90 leading-relaxed">
                SafeGuard Nigeria ("we," "our," or "us") is committed to protecting your privacy and the privacy of your family. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile 
                application and services. By using SafeGuard Nigeria, you consent to the data practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">2.1 Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
                <li><strong>Profile Information:</strong> Emergency contacts, family connections, and preferences</li>
                <li><strong>Identity Verification:</strong> Age verification for parental accounts</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">2.2 Location Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li><strong>Real-time Location:</strong> GPS coordinates, accuracy, and timestamp</li>
                <li><strong>Location History:</strong> Past location data for safety tracking</li>
                <li><strong>Geofence Data:</strong> Safe zones and boundary alerts</li>
                <li><strong>Danger Zone Reports:</strong> User-reported incident locations</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">2.3 Device Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li><strong>Device Identifiers:</strong> Device ID, operating system, and version</li>
                <li><strong>Battery Status:</strong> Battery level for emergency alerts</li>
                <li><strong>Network Information:</strong> Connection type and status</li>
                <li><strong>Security Events:</strong> Unauthorized access attempts and security alerts</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">2.4 Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li><strong>App Usage:</strong> Screen time, app activity, and blocked apps</li>
                <li><strong>Feature Usage:</strong> Which features you use and how often</li>
                <li><strong>Emergency Alerts:</strong> Alert history and response times</li>
                <li><strong>Interaction Data:</strong> Button clicks, navigation patterns</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">2.5 Camera and Photos</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li><strong>Security Photos:</strong> Photos captured during security events (with permission)</li>
                <li><strong>Profile Pictures:</strong> Optional user profile images</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
              <p className="text-foreground/90 leading-relaxed mb-2">We use collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li><strong>Safety Services:</strong> Provide real-time location tracking, emergency alerts, and threat detection</li>
                <li><strong>Parental Controls:</strong> Enable parents to monitor and manage children's device usage</li>
                <li><strong>Communication:</strong> Facilitate family connections and emergency notifications</li>
                <li><strong>Service Improvement:</strong> Analyze usage patterns to enhance features and user experience</li>
                <li><strong>Security:</strong> Detect and prevent unauthorized access, fraud, and abuse</li>
                <li><strong>Compliance:</strong> Meet legal obligations and respond to lawful requests</li>
                <li><strong>Support:</strong> Provide customer service and technical assistance</li>
                <li><strong>Notifications:</strong> Send important updates, alerts, and safety information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">4.1 Family Members</h3>
              <p className="text-foreground/90 leading-relaxed">
                Location and activity information is shared with linked family members (parents/children) as part of the family 
                safety features. Parents can view their children's location, screen time, and app usage. Children can view their 
                own data and connected family members.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">4.2 Emergency Contacts</h3>
              <p className="text-foreground/90 leading-relaxed">
                During emergency situations, your location and emergency alert information may be shared with designated emergency 
                contacts and, if necessary, local authorities.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">4.3 Service Providers</h3>
              <p className="text-foreground/90 leading-relaxed">
                We may share information with trusted third-party service providers who assist us in operating the App, conducting 
                business, or servicing you, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90 mt-2">
                <li>Cloud hosting and storage providers</li>
                <li>Analytics and performance monitoring services</li>
                <li>Push notification services</li>
                <li>Payment processors (for premium features, if applicable)</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">4.4 Legal Requirements</h3>
              <p className="text-foreground/90 leading-relaxed">
                We may disclose information when required by law, court order, or government request, or when we believe disclosure 
                is necessary to protect our rights, your safety, or the safety of others, investigate fraud, or respond to a 
                government request.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">4.5 Business Transfers</h3>
              <p className="text-foreground/90 leading-relaxed">
                If SafeGuard Nigeria is involved in a merger, acquisition, or sale of assets, your information may be transferred 
                to the acquiring entity.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">4.6 We DO NOT</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Sell your personal information to third parties</li>
                <li>Share your data for advertising purposes</li>
                <li>Disclose children's information without parental consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Children's Privacy</h2>
              <p className="text-foreground/90 leading-relaxed mb-2">
                We take children's privacy seriously and comply with applicable children's privacy laws:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Children under 18 can only use the App through a parent-controlled account</li>
                <li>We require verifiable parental consent before collecting children's information</li>
                <li>Parents can review, modify, or delete their children's information at any time</li>
                <li>We collect only the minimum information necessary for safety features</li>
                <li>Children's data is protected with the same security measures as adult data</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed mt-3">
                Parents have the right to refuse further collection of their child's information and can request deletion of 
                previously collected data through the App settings or by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Data Security</h2>
              <p className="text-foreground/90 leading-relaxed mb-2">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li><strong>Encryption:</strong> Data is encrypted in transit (HTTPS/TLS) and at rest</li>
                <li><strong>Access Controls:</strong> Strict authentication and authorization mechanisms</li>
                <li><strong>Secure Storage:</strong> Data stored in secure, compliant cloud infrastructure</li>
                <li><strong>Regular Audits:</strong> Periodic security assessments and vulnerability testing</li>
                <li><strong>Data Minimization:</strong> We collect only necessary information</li>
                <li><strong>Employee Training:</strong> Staff trained on data protection and privacy</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed mt-3">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to 
                protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Data Retention</h2>
              <p className="text-foreground/90 leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide services. Specific 
                retention periods:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90 mt-2">
                <li><strong>Account Data:</strong> Retained until account deletion</li>
                <li><strong>Location History:</strong> 90 days, unless deleted earlier by user</li>
                <li><strong>Emergency Alerts:</strong> 1 year for safety records</li>
                <li><strong>Security Events:</strong> 6 months</li>
                <li><strong>Backup Logs:</strong> 30 days</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed mt-3">
                After retention periods expire or upon account deletion, we will delete or anonymize your information, except 
                where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Your Rights and Choices</h2>
              <p className="text-foreground/90 leading-relaxed mb-2">You have the following rights regarding your information:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for optional features like location tracking</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed mt-3">
                To exercise these rights, visit the Settings page in the App or contact us at privacy@safeguardnigeria.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Location Services</h2>
              <p className="text-foreground/90 leading-relaxed">
                Location tracking is a core feature of SafeGuard Nigeria. You can control location permissions through your device 
                settings. Note that disabling location services will limit the App's safety features. We collect location data only 
                when the App is active or when background location is explicitly enabled for safety monitoring.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Push Notifications</h2>
              <p className="text-foreground/90 leading-relaxed">
                We send push notifications for emergency alerts, safety updates, and geofence events. You can manage notification 
                preferences in the App settings or your device settings. Critical safety alerts may still be sent even if general 
                notifications are disabled.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">11. Third-Party Services</h2>
              <p className="text-foreground/90 leading-relaxed">
                The App may contain links to third-party websites or services. We are not responsible for the privacy practices of 
                these third parties. We encourage you to read their privacy policies before providing any information to them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">12. International Data Transfers</h2>
              <p className="text-foreground/90 leading-relaxed">
                Your information may be stored and processed in servers located outside Nigeria, including in the United States 
                and Europe. We ensure that appropriate safeguards are in place to protect your information in accordance with this 
                Privacy Policy and applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">13. Changes to This Privacy Policy</h2>
              <p className="text-foreground/90 leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will 
                notify you of significant changes via email or in-app notification. The "Last Updated" date at the top indicates 
                when the policy was last revised. Your continued use after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">14. Contact Us</h2>
              <p className="text-foreground/90 leading-relaxed">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-3 text-foreground/90">
                <p><strong>Email:</strong> privacy@safeguardnigeria.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@safeguardnigeria.com</p>
                <p><strong>Address:</strong> SafeGuard Nigeria, Lagos, Nigeria</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">15. Regulatory Compliance</h2>
              <p className="text-foreground/90 leading-relaxed">
                We comply with the Nigeria Data Protection Regulation (NDPR) and other applicable data protection laws. If you 
                believe we have not complied with this Privacy Policy or applicable laws, you have the right to lodge a complaint 
                with the National Information Technology Development Agency (NITDA) or other relevant regulatory authority.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center">
                By using SafeGuard Nigeria, you acknowledge that you have read and understood this Privacy Policy and consent 
                to the collection, use, and disclosure of your information as described herein.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
