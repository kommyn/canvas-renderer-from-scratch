import { Asset } from "./Asset";

class AssetsSingleton {
  private _assets: Map<string, Asset> = new Map();
  private static _instance: AssetsSingleton;

  private constructor() {}

  static getInstance() {
    if (!this._instance) {
      this._instance = new AssetsSingleton();
    }

    return this._instance;
  }

  get(src: string) {
    return this._assets.get(src);
  }

  delete(src: string) {
    const asset = this.get(src);

    if (!asset) return;

    asset.unload();
    this._assets.delete(src);
  }

  private getOrCreate(src: string) {
    const existingAsset = this._assets.get(src);

    return existingAsset || new Asset(src);
  }

  async load(src: string) {
    const asset = this.getOrCreate(src);

    if (asset.isLoaded) return asset;

    const isLoaded = await asset.load();

    if (isLoaded) {
      this._assets.set(src, asset);

      return asset;
    }

    return null;
  }

  unload(asset: string | Asset) {
    if (typeof asset === "string") {
      const existingAsset = this.get(asset);

      if (!existingAsset) return false;

      return existingAsset.unload();
    }

    const result = asset.unload();

    return result;
  }
}

export const Assets = AssetsSingleton.getInstance();
