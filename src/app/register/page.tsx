import RegisterForm from "@/components/login/RegisterForm";

export default function RegisterPage() {

  return (
    <div className = "w-full flex items-center justify-center h-screen text-black bg-gray-200">
      <div className = "flex flex-col">
        <h1 className = "text-5xl">Register</h1>
        <RegisterForm/>
      </div>
      {/* School listing will go here */}
    </div>
  );
}
