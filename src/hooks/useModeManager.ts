import { useState } from 'react';
import { modes } from '@/lib/tracker_api';

export const useModeManager = () => {
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  const handleModeSwitch = async () => {
    if (isKidsMode) {
      setShowPasscodeModal(true);
    } else {
      await modes.kids();
      setIsKidsMode(true);
    }
  };

  const handlePasscodeSuccess = async () => {
    setIsKidsMode(false);       
    await modes.standard();
    setShowPasscodeModal(false);
  };

  return {
    isKidsMode,
    showPasscodeModal,
    handleModeSwitch,
    handlePasscodeSuccess,
    setShowPasscodeModal
  };
};