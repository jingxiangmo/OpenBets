import { SignUpButton } from "@clerk/nextjs";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-gray-800 px-4 sm:px-6 lg:px-8 min-h-[33vh]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center">WeShallSee.xyz</h1>
      <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-center max-w-2xl">
        Gonna bet your friend? We shall see...
      </p>
      <SignUpButton>
        <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-md transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95">
          🤝 Signup to Bet
        </button>
      </SignUpButton>
    </div>
  );
};

export default LandingPage;
