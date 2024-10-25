'use client';

import { useEffect, useState } from 'react';
import { redirectToAuth } from 'supertokens-auth-react';
import SuperTokens from 'supertokens-auth-react/ui';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';

export default function Auth() {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (
            SuperTokens.canHandleRoute([ThirdPartyPreBuiltUI]) === false
        ) {
            redirectToAuth({ redirectBack: false });
        } else {
            setLoaded(true);
        }
    }, []);

    if (loaded) {
        return SuperTokens.getRoutingComponent([ThirdPartyPreBuiltUI]);
    }

    return null;
}