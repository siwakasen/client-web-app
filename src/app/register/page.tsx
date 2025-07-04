import RegisterForm from "./_components/register-form";
import WelcomeSection from "./_components/welcome-section";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid lg:grid-cols-2 min-h-screen h-screen w-full">
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex w-full h-full min-h-screen items-center justify-center bg-gray-100">
          <WelcomeSection />
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex justify-center w-full h-full items-center">
          <RegisterForm />
        </div>

        {/* Mobile Welcome Section */}
        <div className="lg:hidden order-first">
          <WelcomeSection />
        </div>
      </div>
    </div>
  );
}
