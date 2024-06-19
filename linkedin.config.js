// linkedin.config.js
export const linkedinConfig = {
    clientId: '771sd4soagrddz',
    clientSecret: 'WPL_AP1.lWDheLL9nbxIjwgB.Seve0w==',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/linkedin/auth`,
    scope: 'openid profile email w_member_social',
};