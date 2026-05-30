import { StorageService } from './StorageService';

export const FULL_VERSION_SKU = 'full_version';
export const FULL_VERSION_PRICE = '$0.99';

// Placeholder implementation — wire up expo-in-app-purchases or
// react-native-purchases (RevenueCat) when configuring App Store Connect.
class PurchaseService {
  async isPurchased(): Promise<boolean> {
    return StorageService.getIsPaid();
  }

  async purchaseFullVersion(): Promise<boolean> {
    // TODO: replace with real IAP flow
    // import * as InAppPurchases from 'expo-in-app-purchases';
    // await InAppPurchases.connectAsync();
    // await InAppPurchases.purchaseItemAsync(FULL_VERSION_SKU);
    await StorageService.setIsPaid(true);
    return true;
  }

  async restorePurchases(): Promise<boolean> {
    // TODO: implement restore flow
    const isPaid = await StorageService.getIsPaid();
    return isPaid;
  }
}

export const purchaseService = new PurchaseService();
