import { isPermissionGranted, requestPermission, sendNotification as tauriSendNotification, Options } from '@tauri-apps/api/notification';

export async function sendNotification(options: Options) {
  let permissionGranted = await isPermissionGranted();

  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }

  if (permissionGranted) {
    tauriSendNotification(options);
  }
}
