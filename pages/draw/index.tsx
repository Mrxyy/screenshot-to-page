// import dynamic from 'next/dynamic';

import Draw from '@/draw/main';

// const Draw = dynamic(import('@/draw/main'), {
//     ssr: false,
// });

export default function DrawComponent() {
    return <Draw />;
}
