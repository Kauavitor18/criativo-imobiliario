import { containRect, loadImage } from './original-engine.mjs';

// A marca é desenhada a partir do arquivo original depois da geração de IA.
export async function applyBrandLogo(imageSource, logoSource) {
  if (!logoSource) throw new Error('A logo do cliente não está disponível.');
  const [image, logo] = await Promise.all([loadImage(imageSource), loadImage(logoSource)]);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx || !canvas.width || !canvas.height) throw new Error('Não foi possível aplicar a logo do cliente.');
  ctx.drawImage(image, 0, 0);
  const box = { x: canvas.width * .68, y: canvas.height * .035, w: canvas.width * .27, h: canvas.height * .11 };
  const fit = containRect(logo.naturalWidth, logo.naturalHeight, box);
  ctx.drawImage(logo, fit.x, fit.y, fit.w, fit.h);
  return canvas.toDataURL('image/png');
}
