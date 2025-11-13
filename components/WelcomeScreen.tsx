import React, { useState } from 'react';
import Button from './common/Button';
import Input from './common/Input';

interface WelcomeScreenProps {
  onEnter: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const correctPassword = "vihaan ki maa rand hai";

  const handleStartClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onEnter();
    } else {
      setError('Incorrect password.');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      { !showPasswordPrompt ? (
        <Button onClick={handleStartClick} className="px-8 py-4 text-2xl">
          Start
        </Button>
      ) : (
        <div className="w-full max-w-xs">
            <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-lg font-semibold text-center text-gray-800">
                    Authorization Required
                </h2>
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if(error) setError('');
                    }}
                    autoFocus
                />
                {error && <p className="text-red-600 text-xs text-center">{error}</p>}
                <Button type="submit" className="w-full">
                    Enter
                </Button>
            </form>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;