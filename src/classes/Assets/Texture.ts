export class Texture {
  private _context: WebGL2RenderingContext;
  private _texture: WebGLTexture | null = null;

  constructor(context: WebGL2RenderingContext) {
    this._context = context;
  }

  get context() {
    return this._context;
  }

  get textureWebGL() {
    return this._texture;
  }

  loadTextureToVRAM(elem: HTMLImageElement) {
    try {
      this._texture = this.createGLTexture(elem);
    } catch (err) {
      console.error(`Cannot create texture from "${elem.src}: "`, err);
    }
  }

  removeTextureFromVRAM() {
    if (!this._texture) return;

    this._context.deleteTexture(this._texture);
    this._texture = null;
  }

  private createGLTexture(elem: HTMLImageElement): WebGLTexture {
    const texture = this.context.createTexture();
    if (!texture) throw new Error("Failed to create WebGL texture slot.");

    this.context.bindTexture(this.context.TEXTURE_2D, texture);

    // Upload pixel data to GPU VRAM
    this.context.texImage2D(
      this.context.TEXTURE_2D,
      0,
      this.context.RGBA,
      this.context.RGBA,
      this.context.UNSIGNED_BYTE,
      elem,
    );

    // Default configuration (No mipmaps needed, handles any non-power-of-two image sizes)
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_WRAP_S,
      this.context.CLAMP_TO_EDGE,
    );
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_WRAP_T,
      this.context.CLAMP_TO_EDGE,
    );
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_MIN_FILTER,
      this.context.LINEAR,
    );
    this.context.texParameteri(
      this.context.TEXTURE_2D,
      this.context.TEXTURE_MAG_FILTER,
      this.context.LINEAR,
    );

    // Unbind to prevent accidental state changes elsewhere
    this.context.bindTexture(this.context.TEXTURE_2D, null);

    return texture;
  }
}
