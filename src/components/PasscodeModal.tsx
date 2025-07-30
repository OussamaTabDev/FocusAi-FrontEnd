import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Shield, Lock } from 'lucide-react';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PasscodeModal: React.FC<PasscodeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPasscode = localStorage.getItem('kids-mode-passcode') || '1234';
    
    if (passcode === savedPasscode) {
      onSuccess();
      setPasscode('');
      setError('');
    } else {
      setError('Incorrect passcode. Please try again.');
      setPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <Card className="p-8 max-w-md w-full mx-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-300 dark:border-blue-700">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            Parent Access Required
          </h2>
          <p className="text-blue-600 dark:text-blue-400 mt-2">
            Enter your passcode to switch to Standard Mode
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter 4-digit passcode"
              className="text-center text-2xl tracking-widest h-16 bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-700"
              maxLength={4}
              autoFocus
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Unlock
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
            🔒 Default passcode is <strong>1234</strong><br />
            Change it in Settings → Kids Mode
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PasscodeModal;