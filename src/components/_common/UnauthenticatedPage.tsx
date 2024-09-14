import React from 'react';
import Link from 'next/link';

const UnauthenticatedPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <p className="text-xl mb-4">
                    {"You have to "}<Link href="/login" className="text-blue-500 hover:underline">login</Link>{" to access this feature."}
                </p>
            </div>
        </div>
    );
};

export default UnauthenticatedPage;
