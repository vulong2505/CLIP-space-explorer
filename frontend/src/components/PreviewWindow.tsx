interface PreviewWindowProps {
    caption: string;
    image: string;
    position: { x: number; y: number };
    visible: boolean;
  }
  
  export default function PreviewWindow({ caption, image, position, visible }: PreviewWindowProps) {
    if (!visible) return null;
  
    return (
      <div
        className="absolute bg-white border border-black p-2 rounded-none"
        style={{
          left: position.x + 10, // offset from cursor
          top: position.y + 10,
          width: '200px',
          pointerEvents: 'none', // prevent tooltip from interfering with hover
        }}
      >
        <img 
          src={`data:image/jpeg;base64,${image}`}
          alt={caption}
          className="w-full h-32 object-contain mb-2"
        />
        <p className="text-sm">{caption}</p>
      </div>
    );
  }