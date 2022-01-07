import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'AENew',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      SplashScreen: 'screen',
      FadeSplashScreen: 'false',
      ScrollEnabled: 'false',
      Orientation: 'portrait',
      BackupWebStorage: 'none',
      DisallowOverscroll: 'true',
      webviewbounce: 'false',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreenDelay: '1500',
      AutoHideSplashScreen: 'false',
      CordovaWebViewEngine: 'CDVWKWebViewEngine',
      CameraUsesGeolocation: 'false',
      ShowSplashScreenSpinner: 'false',
      UIWebViewBounce: 'false',
      'android-minSdkVersion': '19',
      AllowInlineMediaPlayback: 'true'
    }
  }
};

export default config;
