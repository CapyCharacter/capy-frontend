'use client';
import React, { useState } from 'react';
import Button from '@/components/_common/Button';
import { callVoiceCreate } from '@/utils/backend/callVoiceCreate';
import { VoiceCreate } from '@/utils/backend/schemas/VoiceCreate';
import { createNotification } from '@/components/_common/Notification';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/_common/AuthProvider';
import UnauthenticatedPage from '@/components/_common/UnauthenticatedPage';

const CreateVoicePage: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [sampleAudioUrl, setSampleAudioUrl] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const router = useRouter();
    const auth = useAuth();

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) newErrors.name = 'Voice name is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!sampleAudioUrl.trim()) newErrors.sampleAudioUrl = 'Sample audio URL is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        if (validateFields()) {
            const voiceData: VoiceCreate = {
                name,
                description,
                is_public: isPublic,
                sample_audio_url: sampleAudioUrl,
            };
            
            const result = await callVoiceCreate(voiceData);
            if (result instanceof Error) {
                console.error('Failed to create voice:', result.message);
                setSubmitError(result.message);
            } else {
                console.log('Voice created successfully:', result);
                createNotification("Your voice has been created successfully!");
                router.push('/voices');
            }
        } else {
            console.log('Form has errors. Please correct them.');
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
            <h1 className="text-2xl font-bold mb-4">Create a New Voice</h1>
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
                    <label htmlFor="sampleAudioUrl" className="block mb-1">Sample Audio URL</label>
                    <input
                        type="text"
                        id="sampleAudioUrl"
                        value={sampleAudioUrl}
                        onChange={(e) => setSampleAudioUrl(e.target.value)}
                        className={`w-full p-2 border rounded ${errors.sampleAudioUrl ? 'border-red-500' : ''}`}
                        placeholder="Enter sample audio URL"
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
                    label="Create Voice"
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

export default CreateVoicePage;
