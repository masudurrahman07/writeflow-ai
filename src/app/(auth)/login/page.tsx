export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account.
          </p>
        </div>
        {/* Auth form will go here */}
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Login form coming soon.
        </div>
      </div>
    </div>
  );
}
