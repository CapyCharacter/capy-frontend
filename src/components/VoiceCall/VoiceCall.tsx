'use client'

import { ConversationInfo } from "@/utils/backend/schemas/ConversationInfo";
import { useCallback, useEffect, useState, useRef } from "react";
import { useAuth } from "../_common/AuthProvider";
import UnauthenticatedPage from "../_common/UnauthenticatedPage";
import { callAIService } from "@/utils/backend/callAIService";

export function VoiceCallFullscreen({ conversation, open, onClose, audioContext }: {
    conversation: ConversationInfo | false | null,
    open: boolean,
    onClose: () => void,
    audioContext: AudioContext | null,
}) {
    const auth = useAuth();
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isDialing, setIsDialing] = useState(true);
    const audioStream = useRef<MediaStream | null>(null);
    const audioRecorder = useRef<MediaRecorder | null>(null);
    const isRecording = useRef(false);

    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const requestMicrophonePermission = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Microphone permission granted');
            setIsDialing(false);
            audioStream.current = stream;
            audioRecorder.current = new MediaRecorder(stream);

            return true;
        } catch (error) {
            console.error('Error requesting microphone permission:', error);
            return false;
        }
    }, []);

    const onRecordingReady = useCallback(async (event: BlobEvent) => {
        if (isRecording.current) {
            return;
        }
        if (event.data.size > 0) {
            if (!auth.isAuthenticated || !conversation) {
                return;
            }

            const arrayBuffer: ArrayBuffer = await event.data.arrayBuffer();

            callAIService({
                type: "VoiceCall",
                input_audio_wav: arrayBuffer,
                conversation_id: conversation.id,
                token: auth.token,
            }, async (output) => {
                if (output.is_finished) {
                    return;
                }
                if (output.error) {
                    return;
                }

                if ('output_audio_wav' in output && typeof output.output_audio_wav !== 'undefined') {
                    if (!audioContext) {
                        return;
                    }

                    const blob = new Blob([output.output_audio_wav], { type: 'audio/wav' });

                    const audioURL = URL.createObjectURL(blob);
                    const newAudio = new Audio(audioURL);
                    setAudio(newAudio);

                    newAudio.play().catch(e => {
                        console.error('Error playing audio:', e);
                    });
                } else {
                    console.error('output_audio_wav is not defined');
                    return;
                }
            });
        }
    }, [auth, conversation]);

    useEffect(() => {
        if (open) {
            try {
                if (!audioContext) {
                    return;
                }
                audioContext.resume();
                (window as any).audioContext = audioContext;

                (window as any).audioRecorder = (stream: MediaStream) => {
                    const recorder = new MediaRecorder(stream);
                    recorder.addEventListener('dataavailable', onRecordingReady);
                    return recorder;
                };

                navigator.mediaDevices.getUserMedia(
                    {
                        'audio': true,
                    }).then(x => (window as unknown as {
                        audioStream: (x: MediaStream) => any
                    }).audioStream(x))
                    .catch(e => {
                        alert('Stream generation failed: ' + e);
                    });
            } catch (e) {
                alert('getUserMedia threw exception :' + e);
            }

            requestMicrophonePermission().then(result => {
                if (!result || !audioRecorder.current) return;

                audioRecorder.current.addEventListener('dataavailable', onRecordingReady);
            });

            return () => {
                audioRecorder.current?.removeEventListener('dataavailable', onRecordingReady);
            }
        }
    }, [open, requestMicrophonePermission]);

    const startRecording = useCallback(() => {
        if (!audioRecorder.current) return;
        isRecording.current = true;
        audioRecorder.current.start();
    }, []);

    const stopRecording = useCallback(() => {
        if (!audioRecorder.current) return;
        isRecording.current = false;
        audioRecorder.current.stop();
    }, []);

    const restartRecording = useCallback(() => {
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/state
        //console.log('recorder ' +  recorder.state )

        // need otherwise I get on Chrome the error:
        // Failed to execute 'stop' on 'MediaRecorder': The MediaRecorder's state is 'inactive'.
        if (audioRecorder.current && audioRecorder.current.state != 'inactive') {
            audioRecorder.current.stop();
        }

        if (audioRecorder.current && audioRecorder.current.state == 'inactive') {
            audioRecorder.current.start();
        }

        isRecording.current = true;
    }, []);

    const abortRecording = useCallback(() => {
        if (audioRecorder.current) {
            audioRecorder.current.stop();
            isRecording.current = true;
        }
    }, []);

    useEffect(() => {
        document.addEventListener('prespeechstart', restartRecording);
        // document.addEventListener('speechstart', startRecording);
        document.addEventListener('speechstop', stopRecording);
        document.addEventListener('speechabort', abortRecording);

        return () => {
            document.removeEventListener('prespeechstart', restartRecording);
            // document.removeEventListener('speechstart', startRecording);
            document.removeEventListener('speechstop', stopRecording);
            document.removeEventListener('speechabort', abortRecording);
        };
    }, []);

    const handleEndCall = useCallback(() => {
        onClose();
        abortRecording();
    }, [onClose, abortRecording]);

    return auth.isAuthenticated ? (<>
        <div className="absolute top-0 left-0 w-full h-full" style={{
            visibility: open ? 'visible' : 'hidden',
            zIndex: 99999,
            background: '#fff',
        }}></div>

        <BackgroundWhenDialing active={open && isDialing} />
        <BackgroundWhenInCall active={open && !isDialing} />

        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-evenly items-center py-16" style={{
            visibility: open ? 'visible' : 'hidden',
            zIndex: 99999,
            background: 'transparent',
        }}>
            {conversation && conversation.character && (
                <div className="w-32 h-32 rounded-full overflow-hidden">
                    <img
                        src={conversation.character.avatar_url || "/images/default-user-avatar.png"}
                        alt={conversation.character.name || "Character"}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="flex flex-row space-x-8">
                <MicrophoneButton enabled={isMicEnabled} setEnabled={setIsMicEnabled} />
                <HangupButton onClick={handleEndCall} />
            </div>
        </div>
    </>
    ) : (
        <UnauthenticatedPage />
    );
};

const BackgroundWhenDialing = ({ active }: { active: boolean }) => {
    return (
        <div className="absolute flex justify-center items-start overflow-hidden w-full h-full top-0 left-0" style={{
            visibility: active ? 'visible' : 'hidden',
            zIndex: 99999,
            height: '100%',
            width: '100%',
            transformOrigin: 'center center 0px',
            background: 'radial-gradient(1000px at 50% calc(75px + 50vh), rgb(6, 135, 241) 0%, rgba(23, 114, 180, 0.267) 0%, rgb(24, 24, 27) 100%)'
        }}>
            <svg id="line-circle" width="256px" height="256px" viewBox="0 0 500 50%" className="top-0 absolute overflow-visible origin-center pt-[25vh]"></svg>
        </div>
    );
};

const BackgroundWhenInCall = ({ active }: { active: boolean }) => {
    return (
        <div
            className="absolute flex justify-center items-start overflow-hidden w-full h-full top-0 left-0"
            style={{
                visibility: active ? 'visible' : 'hidden',
                zIndex: 99999,
                top: 0,
                height: '100%',
                width: '100%',
                transformOrigin: 'center center 0px',
                background: 'radial-gradient(1012.8px at 50% calc(75px + 100vh), rgb(6, 135, 241) 0%, rgba(23, 114, 180, 0.267) 30%, rgb(24, 24, 27) 100%)'
            }}
        >
            <svg
                id="line-circle"
                width="256px"
                height="256px"
                viewBox="0 0 500 100%"
                className="top-0 absolute overflow-visible origin-center pt-[25vh]"
            />
        </div>
    );
};

const MicrophoneButton = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (enabled: boolean) => void }) => {
    return (
        <div className="flex flex-col items-center">
            <button
                className="mb-1 w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:text-white border border-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                type="button"
                onClick={() => setEnabled(!enabled)}
            >
                {
                    enabled ? (
                        <svg
                            width="38"
                            height="38"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            color="var(--icon-primary)"
                        >
                            <path
                                d="M12 19v2M12 19c-3.5 0-6-2.5-7-4M12 19c3.5 0 6-2.5 7-4M15.5 7.5v3.5c0 1.933-1.567 3.5-3.5 3.5S8.5 12.933 8.5 11V7.5C8.5 5.567 10.067 4 12 4s3.5 1.567 3.5 3.5Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        <svg
                            width="38"
                            height="38"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color="var(--icon-inverted)"
                        >
                            <path
                                d="M12 21v-2M12 19c-3.5 0-6-2.5-7-4M12 19c2.5 0 4.25-1 5.5-2M9 5.5C9.5 5 10.5 4.5 12 4.5c2.5 0 3.5 2 3.5 3.5v3M8 8.5v3c0 2.5 2 3.5 3.5 3.5.833 0 1.5-.333 2-.833M8 8.5l7 7M8 8.5L3 3.5l18 18-3.5-3.5M8 8.5l7 7"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                strokeLinecap="round"
                            />
                        </svg>
                    )
                }
            </button>
            <span className="text-sm mt-1">{enabled ? "Mute" : "Unmute"}</span>
        </div>
    );
};

const HangupButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <div className="flex flex-col items-center">
            <button
                className="mb-1 w-14 h-14 rounded-full flex items-center justify-center bg-black text-white hover:text-black hover:bg-gray-600 hover:border-gray-600 border border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                type="button"
                onClick={onClick}
            >
                <svg width="38" height="38" viewBox="0 0 29 28" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_4103_8518)">
                        <g clipPath="url(#clip1_4103_8518)">
                            <path d="M26.6224 17.0963C28.2852 15.4335 28.4408 12.4995 26.2875 10.98C19.4604 6.16245 10.2769 6.16245 3.44984 10.98C1.29654 12.4995 1.45207 15.4335 3.11485 17.0963C4.48182 18.4633 6.58361 18.7718 8.28573 17.8552L9.35227 17.2809C10.4198 16.7061 11.0856 15.5915 11.0856 14.379C11.0856 13.9392 11.3544 13.6426 11.6448 13.5743C13.7626 13.0755 15.9747 13.0755 18.0925 13.5743C18.3828 13.6426 18.6517 13.9392 18.6517 14.379C18.6517 15.5915 19.3175 16.7061 20.385 17.2809L21.4516 17.8552C23.1537 18.7718 25.2555 18.4633 26.6224 17.0963Z" fill="#CE365C"></path>
                        </g>
                    </g>
                    <defs>
                        <clipPath id="clip0_4103_8518">
                            <rect width="28" height="28" fill="white" transform="translate(0.25)"></rect>
                        </clipPath>
                        <clipPath id="clip1_4103_8518">
                            <rect width="28" height="28" fill="white" transform="translate(34.668 14) rotate(135)"></rect>
                        </clipPath>
                    </defs>
                </svg>
            </button>
            <span className="text-sm mt-1">End Call</span>
        </div>
    );
};
