import React from 'react';
import App from './App';
import { Toaster } from 'react-hot-toast';
import ContextWrapper from './contexts';

export default function Draw(props: any) {
    return (
        <>
            <ContextWrapper>
                <App {...props} />
            </ContextWrapper>
            <Toaster toastOptions={{ className: 'dark:bg-zinc-950 dark:text-white' }} />
        </>
    );
}
