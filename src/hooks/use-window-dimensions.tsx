import { useEffect, useState } from 'react';

export function useWindowDimensions() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<{
        innerWidth: number;
        innerHeight: number;
    }>({
        innerWidth: 0,
        innerHeight: 0
    });

    /* eslint-disable consistent-return */
    useEffect((): any => {
        // only execute all the code below in client side
        if (typeof window !== 'undefined') {
            // Handler to call on window resize
            const handleResize = () => {
                // Set window width/height to state
                setWindowSize({
                    innerWidth: window.innerWidth,
                    innerHeight: window.innerHeight
                });
            };

            // Add event listener
            window.addEventListener('resize', handleResize);

            // Call handler right away so state gets updated with initial window size
            handleResize();

            // Remove event listener on cleanup
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}
