import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { LOGIN_ROUTES, SINGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return false;
    }
    if (!password.length) {
      toast.error("Please Enter Your Password");
      return false;
    }

    const data = {
      email: email.trim(),
      password: password,
    };

    setLoading(true);
    try {
      // const token = localStorage.getItem("token");
      const link = LOGIN_ROUTES;
      console.log(link);

      const response = await axios.post(link, data, {
        // withCredentials: true,
      });
      // console.log(response);
      localStorage.setItem("token",response.data.token)

      if (response.status === 200) {
        toast.success("Welcome!!",response.data.user.email);
        navigate("/show");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill out all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = {
      email: email.trim(),
      password: password,
    };

    setLoading(true);
    try {
      const response = await axios.post(SINGNUP_ROUTE, data, {
        // withCredentials: true,
      });
      console.log(response);

      if (response.status === 200) {
        toast.success("Signup successful");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-800">
      <div className="relative bg-white shadow-2xl rounded-3xl h-4/5 w-[90vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] flex xl:grid xl:grid-cols-2 overflow-hidden">
        <div className="hidden xl:flex flex-col items-center justify-center bg-gray-700 text-white rounded-l-3xl p-10">
          <img src="" alt="victory emoji" className="h-20 mb-6 animate-bounce" />
          <h1 className="text-5xl font-extrabold mb-4">Welcome</h1>
          <p className="text-lg font-medium text-center">
            Start chatting with friends instantly on the best chat app!
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-10 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="login">
            <TabsList className="mb-6 flex justify-center space-x-4">
              <TabsTrigger
                value="login"
                className="text-xl font-semibold border-b-4 border-transparent text-gray-400 transition-all duration-300 hover:text-black hover:border-blue-500 data-[state=active]:text-black data-[state=active]:border-blue-500 p-2"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="text-xl font-semibold border-b-4 border-transparent text-gray-400 transition-all duration-300 hover:text-black hover:border-blue-500 data-[state=active]:text-black data-[state=active]:border-blue-500 p-2"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="flex flex-col gap-6">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="rounded-full py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-300 w-full"
                onClick={handleLogin}
              >
                Login
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="flex flex-col gap-6">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                className="rounded-full py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-300 w-full"
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Auth;
