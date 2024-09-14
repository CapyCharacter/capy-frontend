"use client";

import React, { useEffect, useState } from 'react';
import { callVoicesGet } from '@/utils/backend/callVoicesGet';
import { VoiceInfo } from '@/utils/backend/schemas/VoiceInfo';
import Button from '@/components/_common/Button';
import { useRouter } from 'next/navigation';
import Section from "@/components/_common/Section";
import { createNotification } from "@/components/_common/Notification";
import Image from 'next/image';

const VoicePage: React.FC = () => {
    const [voices, setVoices] = useState<VoiceInfo[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchVoices = async () => {
            const result = await callVoicesGet();
            if (result instanceof Error) {
                createNotification(result.message);
            } else {
                setVoices(result);
            }
        };

        fetchVoices();
    }, []);

    const handleCreateVoice = () => {
        router.push('/voices/create');
    };

    const handleEditVoice = (voiceId: number) => {
        router.push(`/voices/edit/${voiceId}`);
    };

    return (
        <main className="pt-4 px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Voices</h2>
                <Button
                    variant="very_primary"
                    icon={<div style={{ fill: 'white', stroke: 'white', strokeWidth: 2 }}>
                        <Image src="/images/icons/plus.svg" alt="Plus" width={24} height={24} />
                    </div>}
                    label="Create New Voice"
                    onClick={handleCreateVoice}
                />
            </div>
            <Section title="">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {voices.map((voice, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-4 rounded-lg shadow flex flex-col justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleEditVoice(voice.id)}
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{voice.name}</h3>
                                <p className="text-sm text-gray-600">{voice.description}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {voice.is_public ? 'Public' : 'Private'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </main>
    );
};

export default VoicePage;
