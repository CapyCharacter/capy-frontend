import React, { useEffect, useState } from 'react';
import Button from '@/components/_common/Button';
import { VoiceInfo } from '@/utils/backend/schemas/VoiceInfo';
import { useRouter } from 'next/navigation';
import { callVoicesGet } from '@/utils/backend/callVoicesGet';

// VoiceCard component
const VoiceCard: React.FC<{ voice: VoiceInfo; onSelect: (voice: VoiceInfo) => void }> = ({ voice, onSelect }) => {
  return (
    <Button
      variant="secondary"
      icon="/images/fake-voice-icon.png"
      label={
        <div className="flex flex-col items-start">
          <span>{voice.name}</span>
          <span className="text-sm text-gray-500">Creator Name</span>
        </div>
      }
      className="w-full mb-2"
      onClick={() => onSelect(voice)}
    />
  );
};

// VoiceSelector component
const VoiceSelector: React.FC<{ open: boolean; onClose: () => void; setVoice: (voice: VoiceInfo) => void }> = ({ open, onClose, setVoice }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'discover' | 'your-voices'>('discover');

  const [allVoices, setAllVoices] = useState<VoiceInfo[]>([]);
  const [yourVoices, setYourVoices] = useState<VoiceInfo[]>([]);

  useEffect(() => {
    callVoicesGet().then((voices) => {
      if (voices instanceof Error) {
        console.error(voices.message);
      } else {
        setAllVoices(voices);
        setYourVoices(voices);
      }
    });
  }, []);

  const handleVoiceSelect = (voice: VoiceInfo) => {
    setVoice(voice);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 relative">
        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
          <button type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">Select Voice</h2>
          <Button
            variant="primary"
            icon="/images/icons/plus.svg"
            label="Create"
            onClick={() => {
                /* Handle create action */
                router.push('/voices/create');
            }}
          />
        </div>
        <div className="p-4">
          <div className="flex mb-4">
            <button type="button"
              className={`flex-1 py-2 ${activeTab === 'discover' ? 'bg-gray-200' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('discover')}
            >
              Discover
            </button>
            <button type="button"
              className={`flex-1 py-2 ${activeTab === 'your-voices' ? 'bg-gray-200' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('your-voices')}
            >
              Your Voices
            </button>
          </div>
          <div>
            {activeTab === 'discover' ? allVoices.map((voice) => (
              <VoiceCard key={voice.id} voice={voice} onSelect={handleVoiceSelect} />
            )) : yourVoices.map((voice) => (
              <VoiceCard key={voice.id} voice={voice} onSelect={handleVoiceSelect} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSelector;
