import { animationDefaultOption } from "@/lib/utils";
import Lottie from "react-lottie";

function EmptyChatContainer() {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden transition-all duration-300">
      {/* Lottie animation with specified options */}
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOption}
      />
      
      {/* Container for text with animation */}
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 text-center">
        <h3 className="text-3xl lg:text-4xl font-medium poppins-medium transition-all duration-300">
          Hi <span className="text-purple-500">!</span>
          Welcome to    
          <span className="text-purple-500"> ChatAura</span> Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
}

export default EmptyChatContainer;
