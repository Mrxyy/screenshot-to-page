import { useRef, useEffect } from 'react';

interface Props {
    code: string;
}

function CodePreview({ code }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [code]);

    return (
        <div
            ref={scrollRef}
            className="w-[90%] px-2 bg-black text-green-400 max-h-[400px] flex 
      overflow-x-auto font-mono text-[10px] my-4 m-auto overflow-hidden"
        >
            {code}
        </div>
    );
}

export default CodePreview;
