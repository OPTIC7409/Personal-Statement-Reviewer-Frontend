import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdParty from 'supertokens-web-js/recipe/thirdparty'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'

SuperTokens.init({
    appInfo: {
        apiDomain: "http://localhost:3002",
        apiBasePath: "/api/auth",
        appName: "...",
    },
    recipeList: [
        Session.init(),
        EmailPassword.init(),
        ThirdParty.init()
    ],
});