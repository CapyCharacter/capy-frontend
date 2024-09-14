'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/_common/Button';
import { callCharacterUpdate } from '@/utils/backend/callCharacterUpdate';
import { callCharacterGetById } from '@/utils/backend/callCharacterGetById';
import { CharacterUpdate } from '@/utils/backend/schemas/CharacterUpdate';
import { CharacterInfo } from '@/utils/backend/schemas/CharacterInfo';
import { createNotification } from '@/components/_common/Notification';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/_common/AuthProvider';
import UnauthenticatedPage from '@/components/_common/UnauthenticatedPage';

const EditCharacterPage: React.FC<{ params: { character_id: string } }> = ({ params }) => {
    const [character, setCharacter] = useState<CharacterInfo | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tagline, setTagline] = useState('');
    const [definition, setDefinition] = useState('');
    const [greeting, setGreeting] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [voiceId, setVoiceId] = useState<number | undefined>(undefined);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const router = useRouter();
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            return;
        }

        const fetchCharacter = async () => {
            const result = await callCharacterGetById({ characterId: parseInt(params.character_id) });
            if (result instanceof Error) {
                console.error('Failed to fetch character:', result.message);
                setSubmitError(result.message);
            } else {
                setCharacter(result);
                setName(result.name);
                setDescription(result.description);
                setTagline(result.tagline);
                setDefinition(result.definition);
                setGreeting(result.greeting);
                setIsPublic(result.is_public);
                setAvatarUrl(result.avatar_url);
                setVoiceId(result.voice_id ?? undefined);
            }
        };
        fetchCharacter();
    }, [params.character_id, auth]);

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!tagline.trim()) newErrors.tagline = 'Tagline is required';
        if (!definition.trim()) newErrors.definition = 'Definition is required';
        if (!greeting.trim()) newErrors.greeting = 'Greeting is required';
        if (!avatarUrl.trim()) newErrors.avatarUrl = 'Avatar URL is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        if (validateFields()) {
            const characterData: CharacterUpdate = {
                name,
                description,
                tagline,
                definition,
                greeting,
                is_public: isPublic,
                avatar_url: avatarUrl,
                voice_id: voiceId,
            };

            const result = await callCharacterUpdate({
                characterId: parseInt(params.character_id),
                characterUpdate: characterData,
            });

            if (result instanceof Error) {
                console.error('Failed to update character:', result.message);
                setSubmitError(result.message);
            } else {
                console.log('Character updated successfully:', result);
                createNotification("Your character has been updated successfully!");
                router.push('/characters');
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

    if (!character) {
        return <div>Loading...</div>;
    }

    return (
        auth.isAuthenticated ? (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Edit Character</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <label htmlFor="description" className="block mb-1">Description</label>
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
                        <label htmlFor="tagline" className="block mb-1">Tagline</label>
                        <input
                            type="text"
                            id="tagline"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className={`w-full p-2 border rounded ${errors.tagline ? 'border-red-500' : ''}`}
                            placeholder="Enter character tagline"
                        />
                        {errors.tagline && <p className="text-red-500 text-sm mt-1">{errors.tagline}</p>}
                    </div>

                    <div>
                        <label htmlFor="definition" className="block mb-1">Definition</label>
                        <textarea
                            id="definition"
                            value={definition}
                            onChange={(e) => setDefinition(e.target.value)}
                            className={`w-full p-2 border rounded ${errors.definition ? 'border-red-500' : ''}`}
                            rows={3}
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
                            rows={3}
                            placeholder="Enter character greeting"
                        ></textarea>
                        {errors.greeting && <p className="text-red-500 text-sm mt-1">{errors.greeting}</p>}
                    </div>

                    <div>
                        <label htmlFor="avatarUrl" className="block mb-1">Avatar URL</label>
                        <input
                            type="text"
                            id="avatarUrl"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className={`w-full p-2 border rounded ${errors.avatarUrl ? 'border-red-500' : ''}`}
                            placeholder="Enter avatar URL"
                        />
                        {errors.avatarUrl && <p className="text-red-500 text-sm mt-1">{errors.avatarUrl}</p>}
                    </div>

                    <div>
                        <label htmlFor="voiceId" className="block mb-1">Voice ID</label>
                        <input
                            type="number"
                            id="voiceId"
                            value={voiceId || ''}
                            onChange={(e) => setVoiceId(e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter voice ID (optional)"
                        />
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
                        label="Update Character"
                        type="submit"
                        centerText={true}
                    />
                    <Button
                        variant="secondary"
                        label="View all characters"
                        onClick={() => router.push('/characters')}
                        centerText={true}
                    />
                    {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
                </form>
            </div>
        ) : (
            <UnauthenticatedPage />
        )
    );
};

export default EditCharacterPage;

