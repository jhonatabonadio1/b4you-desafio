import * as OneSignal from '@onesignal/node-onesignal'

const configuration = OneSignal.createConfiguration({
  userAuthKey: process.env.ONESIGNAL_AUTH_KEY,
  restApiKey: process.env.ONESIGNAL_API_KEY,
})

export const osClient = new OneSignal.DefaultApi(configuration)
