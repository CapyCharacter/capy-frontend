'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/_common/Button';
import { callVoiceUpdate } from '@/utils/backend/callVoiceUpdate';
import { callVoicesGet } from '@/utils/backend/callVoicesGet';
import { VoiceUpdate } from '@/utils/backend/schemas/VoiceUpdate';
import { createNotification } from '@/components/_common/Notification';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/_common/AuthProvider';
import UnauthenticatedPage from '@/components/_common/UnauthenticatedPage';

const EditVoicePage: React.FC<{ params: { voice_id: string } }> = ({ params }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [newSampleAudioUrl, setSampleAudioUrl] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const router = useRouter();
    const auth = useAuth();

    const [oldName, setOldName] = useState('');
    const [oldDescription, setOldDescription] = useState('');
    const [oldIsPublic, setOldIsPublic] = useState(false);

    useEffect(() => {
        const fetchVoice = async () => {
            const result = await callVoicesGet();
            if (result instanceof Error) {
                console.error('Failed to fetch voices:', result.message);
                setSubmitError(result.message);
            } else {
                const voice = result.find(v => v.id === parseInt(params.voice_id));
                if (voice) {
                    setName(voice.name);
                    setDescription(voice.description);
                    setIsPublic(voice.is_public);
                    setOldName(voice.name);
                    setOldDescription(voice.description);
                    setOldIsPublic(voice.is_public);
                } else {
                    setSubmitError('Voice not found');
                }
            }
        };
        fetchVoice();
    }, [params.voice_id]);

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        if (validateFields()) {
            const voiceData: VoiceUpdate = {};
            
            if (name !== oldName) voiceData.name = name;
            if (description !== oldDescription) voiceData.description = description;
            if (isPublic !== oldIsPublic) voiceData.is_public = isPublic;
            if (newSampleAudioUrl) voiceData.sample_audio_url = newSampleAudioUrl;
            
            if (Object.keys(voiceData).length === 0) {
                createNotification("No changes were made.");
                return;
            }
            
            const result = await callVoiceUpdate(parseInt(params.voice_id), voiceData);
            if (result instanceof Error) {
                console.error('Failed to update voice:', result.message);
                setSubmitError(result.message);
            } else {
                createNotification("Your voice has been updated successfully!");
                router.push('/voices');
            }
        }
    };

    const visibilitySubmenuItems = [
        {
            label: "Public",
            icon: "/images/icons/public.svg",
            onClick: () => setIsPublic(true),
        },
        {
            label: "Private",
            icon: "/images/icons/private.svg",
            onClick: () => setIsPublic(false),
        },
    ];

    return auth.isAuthenticated ? (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Voice</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-1">Voice Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Enter voice name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block mb-1">Voice Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
                        rows={3}
                        placeholder="Enter voice description"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label htmlFor="sampleAudioUrl" className="block mb-1">New Sample Audio URL</label>
                    <input
                        type="text"
                        id="sampleAudioUrl"
                        value={newSampleAudioUrl}
                        onChange={(e) => setSampleAudioUrl(e.target.value)}
                        className={`w-full p-2 border rounded ${errors.sampleAudioUrl ? 'border-red-500' : ''}`}
                        placeholder="Enter new sample audio URL"
                    />
                    {errors.sampleAudioUrl && <p className="text-red-500 text-sm mt-1">{errors.sampleAudioUrl}</p>}
                </div>

                <div>
                    <label className="block mb-1">Visibility</label>
                    <Button
                        variant="secondary"
                        label={isPublic ? "Public" : "Private"}
                        submenuItems={visibilitySubmenuItems}
                        expandPopupMenuOnClick={true}
                        displayExpandPopupMenuIcon={true}
                    />
                </div>

                <Button
                    variant="very_primary"
                    label="Update Voice"
                    type="submit"
                    centerText={true}
                />
                <Button
                    variant="secondary"
                    label="View all voices"
                    onClick={() => router.push('/voices')}
                    centerText={true}
                />
                {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
            </form>
        </div>
    ) : (
        <UnauthenticatedPage />
    );
};

export default EditVoicePage;
