import { useState } from 'react';
import { LabelInput } from './label-input';

export const JoinGame = ({ socket }: { socket: any }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    console.log('join-game', username);
    socket.emit('join-game', username);
  };

  return (
    <div className={`mt-10 w-full space-y-4 flex flex-col`}>
      <LabelInput
        id="username"
        label="Enter username:"
        placeholder="Enter value"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed"
        onClick={() => {
          handleSubmit();
        }}
      >
        Join
      </button>
    </div>
  );
};
