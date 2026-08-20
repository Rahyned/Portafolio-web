// Carga un sprite de proyecto como SVG desde public/sprites/.
// El nombre del archivo coincide con el id del proyecto (ej: sprite-riodent.svg).
export default function SpriteImage({ src, className = "", style }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      className={className}
      style={{ imageRendering: "pixelated", flexShrink: 0, ...style }}
      draggable={false}
    />
  );
}
