import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs"

const colors = [
  "from-indigo-500",
  "from-gray-500",
  "from-green-600",
  "from-yellow-500",
  "from-pink-500",
];

const Center = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then((data) => {
      setPlaylist(data.body);
    }).catch((err) => console.log("Something Went Wrong!" , err));
  }, [spotifyApi, playlistId]);


  return (
    <div className="flex-grow h-screen overflow-y-scroll overflow-hidden">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 text-white opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2" onClick={signOut}>
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt="Profile Pic"
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`md:flex items-end space-x-7 bg-gradient-to-b to-black ${color} md:h-96 text-white p-10 `}
      >
        <img className="h-72 w-72  sm:h-64 sm:w-64 shadow-5xl mx-auto sm:mx-0 mt-12 sm:mt-0" src={playlist?.images?.[0]?.url} alt="" />
        <div className="mt-5 sm:mt-0">
          <p>
            PUBLIC PLAYLIST
          </p>
          <h1 className="text-2xl h sm:text-sm md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
