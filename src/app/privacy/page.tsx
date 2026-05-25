import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      <Accordion type="multiple" className="space-y-2">
        <AccordionItem value="info">
          <AccordionTrigger>Information We Collect</AccordionTrigger>
          <AccordionContent>
            <p>We collect information you provide when you create an account, such as your name, email address, and authentication data. We also collect usage data, including how you interact with WriteFlow AI, and the prompts you submit to our AI services.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="use">
          <AccordionTrigger>How We Use Your Information</AccordionTrigger>
          <AccordionContent>
            <p>Your information is used to deliver and improve our services, personalize your experience, and communicate important updates. We may analyze usage data to enhance WriteFlow AI’s features and performance.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="security">
          <AccordionTrigger>Data Storage & Security</AccordionTrigger>
          <AccordionContent>
            <p>Your data is stored securely in MongoDB Atlas. Passwords are encrypted using industry-standard hashing. We implement safeguards to protect your information from unauthorized access or disclosure.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="third-party">
          <AccordionTrigger>Third-Party Services</AccordionTrigger>
          <AccordionContent>
            <p>We use trusted third-party services such as Google Authentication and the Gemini API to provide core functionality. These services may collect and process your data according to their own privacy policies.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rights">
          <AccordionTrigger>Your Rights</AccordionTrigger>
          <AccordionContent>
            <p>You have the right to access, delete, or export your personal data. Contact us at any time to exercise these rights or for assistance regarding your information.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="contact">
          <AccordionTrigger>Contact Us</AccordionTrigger>
          <AccordionContent>
            <p>If you have questions or concerns about this Privacy Policy, please contact us at <a href="mailto:hello@writeflow.ai" className="text-primary underline">hello@writeflow.ai</a>.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
