import { useState } from "react";
import victory from "@/assets/victory.svg";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { LOGIN_ROUTES, SINGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { userAppStore } from "@/Store";

function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const {setUserInfo}=userAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return false;
    }

    const data = { email: email.trim(), password: password };
    setLoading(true);
    try {
      const response = await axios.post(LOGIN_ROUTES, data, {
        withCredentials: true, 
      });

      if (response.status === 200) {
        setUserInfo(response.data.user)
        toast.success("Welcome!!", response.data.user.email);
        if(response.data.user.profileSetup)navigate("/chat")
          else navigate("/profile");
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
  
    const data = { email: email.trim(), password: password };
    setLoading(true);
  
    try {
      const response = await axios.post(SINGNUP_ROUTE, data, {
        withCredentials: true, 
      });
  
      if (response.status === 201) {
        setUserInfo(response.data.user);
        toast.success("Signup successful");
        navigate("/profile")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
      <div className="relative bg-white shadow-xl rounded-3xl h-[85vh] w-full max-w-4xl flex flex-col md:flex-row overflow-hidden transform transition duration-500 hover:scale-105">
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-10 rounded-l-3xl">
          <img src={victory} alt="welcome illustration" className="h-24 mb-6 animate-bounce" />
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-center text-lg font-medium">
            Connect with your friends and explore more with our app!
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-10 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="login">
            <TabsList className="mb-6 flex justify-center space-x-4">
              <TabsTrigger
                value="login"
                className="text-xl font-semibold border-b-4 border-transparent text-gray-400 transition duration-300 hover:text-indigo-700 hover:border-indigo-500 data-[state=active]:text-indigo-700 data-[state=active]:border-indigo-500 p-2"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="text-xl font-semibold border-b-4 border-transparent text-gray-400 transition duration-300 hover:text-indigo-700 hover:border-indigo-500 data-[state=active]:text-indigo-700 data-[state=active]:border-indigo-500 p-2"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="flex flex-col gap-6">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-4 text-lg bg-gray-100 text-gray-700 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-4 text-lg bg-gray-100 text-gray-700 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="rounded-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 w-full"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="flex flex-col gap-6">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-4 text-lg bg-gray-100 text-gray-700 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-4 text-lg bg-gray-100 text-gray-700 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-full p-4 text-lg bg-gray-100 text-gray-700 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-indigo-500 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                className="rounded-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 w-full"
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
