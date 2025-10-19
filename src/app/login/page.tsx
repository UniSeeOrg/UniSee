import LoginForm from "@/components/login/LoginForm";
export default function LoginPage() {

  return (
    <div className = "w-full flex items-center justify-center h-screen text-black bg-gray-200">
      <div className = "flex flex-col">
        <h1 className = "text-5xl">Login </h1>
        <LoginForm/>
      </div>
      {/* School listing will go here */}
    </div>
  );
}
