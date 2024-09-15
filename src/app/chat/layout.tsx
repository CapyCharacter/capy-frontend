import Script from "next/script";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return <>
        <Script src="/scripts/webad/volume-meter.js" />
        <Script src="/scripts/webad/audioDetectionConfig.js" />
        <Script src="/scripts/webad/audioDetection.js" />
        <Script src="/scripts/webad/audioStream.js" />
        <Script src="/scripts/webad/customConfig.js" />
        {children}
    </>;
}
