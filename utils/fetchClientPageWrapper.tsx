import { FunctionComponent, useEffect, useState } from 'react';

export default function fetchClientPageWrapper<T, P>(
    component: FunctionComponent<P>,
    fetchPackage: () => Promise<T>,
    effectCallFn: (data: T) => any
) {
    const Component = component;
    return function fetchClientPageWrapper(props: P & JSX.IntrinsicAttributes) {
        const [flag, setFlag] = useState(false);
        useEffect(() => {
            if (window) {
                fetchPackage().then(async data => {
                    await effectCallFn(data);
                    setFlag(true);
                });
            }
        }, []);
        return flag ? <Component {...props} /> : null;
    };
}
