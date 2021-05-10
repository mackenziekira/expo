import { ConfigPlugin, createRunOncePlugin } from '@expo/config-plugins';

const pkg = require('expo-tracking-transparency/package.json');

export const DEFAULT_NSUserTrackingUsageDescription =
  'Allow this app to collect app-related data that can be used for tracking you or your device.';

const withTrackingTransparency: ConfigPlugin<{
  /**
   * Sets the iOS `NSUserTrackingUsageDescription` permission message in `Info.plist`. Omitting a
   * description will result in using the default permission message; passing in `false` will omit
   * the `NSUserTrackingUsageDescription` permission from your `Info.plist` entirely.
   * @default 'Allow this app to collect app-related data that can be used for tracking you or your
   * device.'
   */
  userTrackingPermission?: string | false;
} | void> = (config, props) => {
  config = withUserTrackingPermission(config, props);
  return config;
};

export const withUserTrackingPermission: ConfigPlugin<{
  userTrackingPermission?: string | false;
} | void> = (config, { userTrackingPermission } = {}) => {
  if (userTrackingPermission === false) {
    // TODO: Upgrade to optional chaining once Node 14+ is required
    if (config && config.ios && config.ios.infoPlist) {
      delete config.ios.infoPlist.NSUserTrackingUsageDescription;
    }
    return config;
  }
  if (!config.ios) config.ios = {};
  if (!config.ios.infoPlist) config.ios.infoPlist = {};
  config.ios.infoPlist.NSUserTrackingUsageDescription =
    userTrackingPermission ||
    config.ios.infoPlist.NSUserTrackingUsageDescription ||
    DEFAULT_NSUserTrackingUsageDescription;

  return config;
};

export default createRunOncePlugin(withTrackingTransparency, pkg.name, pkg.version);
