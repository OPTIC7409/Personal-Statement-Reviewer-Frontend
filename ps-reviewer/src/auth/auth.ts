'use server'
import SuperTokens from "supertokens-auth-react";
import ThirdParty, { Google } from "supertokens-auth-react/recipe/thirdparty";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    appInfo: {
        appName: "ps_reviewer",
        apiDomain: "http://localhost:3002",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/api/auth",
        websiteBasePath: "/auth"
    },
    recipeList: [
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [
                    Google.init(),
                ]
            }
        }),
        EmailPassword.init(),
        Session.init()
    ]
});