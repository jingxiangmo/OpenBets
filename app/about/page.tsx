import React from 'react';

export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">About WeShallSee.xyz</h1>

      <p className="mb-4">
        From romance to current events, and politics to trivia, WeShallSee.xyz is a game that lets you and your friends create bets and track outcomes. Our goal is to provide a game for friends to challenge each other&apos;s predictions and put their money where their mouth is.
      </p>

      <p className="mb-10">

        This was a weekend hackathon project by <a href="https://jingxiangmo.com" className="text-blue-600 hover:underline">JX</a> and <a href="https://beaumccartney.dev" className="text-blue-600 hover:underline">Beau</a> for Fraser, who loves prediction markets and bets us on everything, and Kishan, who forgets his wallet exists when he loses.
      </p>

      <p className="mb-4 text-gray-400 italic">
      Please note that WeShallSee.xyz is intended for entertainment purposes only. Nothing on this platform constitutes a legally binding contract or agreement. WeShallSee.xyz and its creators are not responsible for any financial losses or disputes that may arise from the use of this platform. For the avoidance of doubt, WeShallSee.xyz does not facilitate any real financial transactions or outcomes, and all activities on this platform are purely for entertainment purposes without any monetary value or legal enforceability.
      </p>


    </div>
  );
}