'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/_common/Button';
import VoiceSelector from '@/components/voice/VoiceSelector';
import { VoiceInfo } from '@/utils/backend/schemas/VoiceInfo';
import { useRouter } from 'next/navigation';
import { callCharacterCreate } from '@/utils/backend/callCharacterCreate';
import { createNotification } from '@/components/_common/Notification';
import { useAuth } from '@/components/_common/AuthProvider';
import UnauthenticatedPage from '@/components/_common/UnauthenticatedPage';

const CreateCharacterPage: React.FC = () => {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [definition, setDefinition] = useState('');
    const [greeting, setGreeting] = useState('');
    const [voice, setVoice] = useState<VoiceInfo | null>(null);
    const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);
    const [visibility, setVisibility] = useState<'Public' | 'Private'>('Private');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const router = useRouter();

    const auth = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        //////////// VALIDATION ////////////

        const newErrors: { [key: string]: string } = {};
        let hasErrors = false;

        if (!avatarUrl.trim()) newErrors.avatarUrl = 'Avatar URL is required';
        if (!name.trim()) newErrors.name = 'Character name is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!definition.trim()) newErrors.definition = 'Definition is required';
        if (!greeting.trim()) newErrors.greeting = 'Greeting is required';
        if (!voice) newErrors.voice = 'Voice selection is required';

        setErrors(newErrors);
        hasErrors = Object.keys(newErrors).length > 0;
        ////////////////////////////////////

        if (hasErrors || voice === null) {
            return;
        }

        callCharacterCreate({
            characterCreate: {
                avatar_url: avatarUrl,
                name,
                description,
                tagline: "default",
                definition,
                greeting,
                voice_id: voice.id,
                is_public: visibility === 'Public',
            },
        });

        createNotification('Character created successfully');
        router.push('/characters');
    };

    const visibilitySubmenuItems = [
        {
            label: "Public",
            icon: "/images/icons/public.svg",
            onClick: () => setVisibility('Public'),
        },
        {
            label: "Private",
            icon: "/images/icons/private.svg",
            onClick: () => setVisibility('Private'),
        },
    ];

    return (
        auth.isAuthenticated ? (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Create a New AI Character</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="avatarUrl" className="block mb-1">Avatar Image Link</label>
                        <input
                            type="text"
                            id="avatarUrl"
                            value={avatarUrl}
                            onChange={(e) => {
                                setAvatarUrl(e.target.value);
                                setIsImageLoaded(false); // Reset image loaded state when URL changes
                            }}
                            className={`w-full p-2 border rounded ${errors.avatarUrl ? 'border-red-500' : ''}`}
                            placeholder="Enter avatar image URL"
                        />
                        {errors.avatarUrl && <p className="text-red-500 text-sm mt-1">{errors.avatarUrl}</p>}
                        {avatarUrl && isImageLoaded && (
                            <div className="mt-2">
                                <Image
                                    src={avatarUrl}
                                    alt="Character Avatar"
                                    width={100}
                                    height={0}
                                    style={{ height: 'auto' }}
                                    className="rounded"
                                    onLoad={() => setIsImageLoaded(true)}
                                    onError={() => setIsImageLoaded(false)}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="name" className="block mb-1">Character Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Enter character name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block mb-1">Character Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
                            rows={3}
                            placeholder="Enter character description"
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label htmlFor="definition" className="block mb-1">Character Definition</label>
                        <textarea
                            id="definition"
                            value={definition}
                            onChange={(e) => setDefinition(e.target.value)}
                            className={`w-full p-2 border rounded ${errors.definition ? 'border-red-500' : ''}`}
                            rows={5}
                            placeholder="Enter character definition"
                        ></textarea>
                        {errors.definition && <p className="text-red-500 text-sm mt-1">{errors.definition}</p>}
                    </div>

                    <div>
                        <label htmlFor="greeting" className="block mb-1">Greeting</label>
                        <textarea
                            id="greeting"
                            value={greeting}
                            onChange={(e) => setGreeting(e.target.value)}
                            className={`w-full p-2 border rounded ${errors.greeting ? 'border-red-500' : ''}`}
                            rows={2}
                            placeholder="Enter character greeting"
                        ></textarea>
                        {errors.greeting && <p className="text-red-500 text-sm mt-1">{errors.greeting}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Voice</label>
                        <Button
                            variant="secondary"
                            label={voice ? voice.name : "Select Voice"}
                            onClick={() => setIsVoiceSelectorOpen(true)}
                            className={errors.voice ? 'border-red-500' : ''}
                        />
                        {errors.voice && <p className="text-red-500 text-sm mt-1">{errors.voice}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Visibility</label>
                        <Button
                            variant="secondary"
                            label={visibility}
                            submenuItems={visibilitySubmenuItems}
                            expandPopupMenuOnClick={true}
                            displayExpandPopupMenuIcon={true}
                        />
                    </div>

                    <Button
                        variant="very_primary"
                        label="Create Character"
                        type="submit"
                        centerText={true}
                    />

                    <Button
                        variant="secondary"
                        label="View all characters"
                        onClick={() => router.push('/characters')}
                        centerText={true}
                    />
                </form>

                <VoiceSelector
                    open={isVoiceSelectorOpen}
                    onClose={() => setIsVoiceSelectorOpen(false)}
                    setVoice={(selectedVoice) => {
                        setVoice(selectedVoice);
                        setIsVoiceSelectorOpen(false);
                    }}
                />
            </div>
        ) : (
            <UnauthenticatedPage />
        )
    );
};

export default CreateCharacterPage;
