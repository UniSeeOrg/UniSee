import RegisterForm from "@/components/login/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Register
          </h1>
          <p className="text-gray-600">
            Join UniSee to share your college experience
          </p>
        </div>
        <RegisterForm/>
      </div>
    </div>
  );
}
