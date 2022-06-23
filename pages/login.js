import React from "react";
import { getProviders, signIn } from "next-auth/react";

const Login = ({ providers }) => {
  return (
    <div className="flex flex-col items-center bg-black w-full min-h-screen justify-center">
      <img
        className="w-52"
        src="https://www.logo.wine/a/logo/Spotify/Spotify-Logo.wine.svg"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18d860] text-white px-5 py-3 rounded-full"
            onClick={() => signIn(provider.id, {callbackUrl: "/"})}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
