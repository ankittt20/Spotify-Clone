import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { SwitchHorizontalIcon } from "@heroicons/react/outline";
import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, VolumeOffIcon, VolumeUpIcon, } from "@heroicons/react/solid";
import {debounce} from "lodash";

const Player = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(80);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken && !currentTrackId) {
      fetchCurrentSong();
      setVolume(80);
    }
  }, [spotifyApi, currentTrackId, session]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
        spotifyApi.setVolume(volume).catch((err) => {});
    }, 300), []
  )

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);


  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
        if(data.body?.is_playing) {
            spotifyApi.pause().catch((err) => {});
            setIsPlaying(false);
        } else {
            spotifyApi.play().catch((err) => {});
            setIsPlaying(true);
        }
    });
  }

  return (
    <div className="text-white h-24 bg-gradient-to-b from-black to-gray-800 grid grid-cols-3 text-xs md:text-base px-2 md:px-8">

      {/* LEFT SECTION */}
      <div className="flex items-center space-x-4">
        <img
          className="w-12 h-12"
          src={songInfo?.album?.images?.[0]?.url}
        />
        <div className="hidden md:inline">
          <h3 className="text-xs sm:text-base">{songInfo?.name}</h3>
          <p className="text-xs text-gray-400">
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>

      {/* CENTER SECTION */}
        <div className="flex items-center justify-evenly space-x-3">
            <SwitchHorizontalIcon className="w-[500px] sm:w-5 sm:h-5 cursor-pointer hover:scale-125 transition transform-duration-100 ease-out" />
            <RewindIcon className="w-[500px] sm:w-5 sm:h-5 cursor-pointer hover:scale-125 transition transform-duration-100 ease-out" />

            {isPlaying ? (
                <PauseIcon onClick={handlePlayPause} className="w-[1000px] sm:w-10 sm:h-10 cursor-pointer hover:scale-125 transition transform-duration-100 ease-out" />
            ) : (<PlayIcon onClick={handlePlayPause} className="w-[1000px] sm:w-10 sm:h-10 cursor-pointer hover:scale-125 transition transform-duration-100 ease-out" />)}

            <FastForwardIcon className="w-[500px] sm:w-5 sm:h-5cursor-pointer hover:scale-125 transition transform-duration-100 ease-out" />
            <ReplyIcon className="w-[500px] sm:w-5 sm:h-5 cursor-pointer hover:scale-125 transition transform-duration-100 ease-out" />

        </div>

        {/* RIGHT SECTION */}
        <div className="hidden sm:flex items-center space-x-3 md:space-x-4 justify-end pr-5 ">
            <VolumeOffIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="w-5 h-5 cursor-pointer hover:scale-125 transition transform-duration-100 ease-out"/>
            <input className="w-14 md:w-28 " type="range" value={volume} onChange={e => setVolume(Number(e.target.value))} min={0} max={100} />
            <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="w-5 h-5 cursor-pointer hover:scale-125 transition transform-duration-100 ease-out"/>            
        </div>
    </div>
  );
};

export default Player;
