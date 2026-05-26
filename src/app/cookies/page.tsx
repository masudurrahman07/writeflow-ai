import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Cookie Policy</h1>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">What Are Cookies</h2>
        <p className="text-muted-foreground">
          Cookies are small text files stored on your device when you visit a website. They help us provide a better experience by remembering your preferences and analyzing how you use our service.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">How We Use Cookies</h2>
        <p className="text-muted-foreground">
          We use essential cookies for authentication and security, preference cookies to remember your theme and language settings, and analytics cookies to understand how WriteFlow AI is used so we can improve it.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Third-Party Cookies</h2>
        <p className="text-muted-foreground">
          We may use trusted third-party services such as Google Analytics and authentication providers that set their own cookies. These are governed by the respective third-party privacy policies.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Managing Cookies</h2>
        <p className="text-muted-foreground">
          You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of WriteFlow AI.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Contact</h2>
        <p className="text-muted-foreground">
          If you have questions about our use of cookies, please contact us at{" "}
          <a href="mailto:hello@writeflow.ai" className="text-primary underline">hello@writeflow.ai</a>.
        </p>
      </section>
      <div className="text-center mt-8">
        <Link href="/privacy" className="text-sm text-primary underline underline-offset-4 hover:text-foreground transition-colors">
          View our Privacy Policy
        </Link>
      </div>
    </div>
  );
}
