import { useRef, useState, useEffect } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { LocalNeighborhood } from '../types/data';
import PreviewWindow from './PreviewWindow';
import Axes from './Axes'
import * as THREE from 'three';

interface LocalViewProps {
  neighborhood: LocalNeighborhood;
  onPointSelect: (index: number) => void;
}

interface PointsProp {
  points: number[][];
  selectedIndex: number;
  neighborIndices: number[];
  onPointSelect: (index: number) => void;
  onHover: (index: number | null) => void;
}

function Points({ points, selectedIndex, neighborIndices, onPointSelect, onHover }: PointsProp) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Create geometry
  const positions = new Float32Array(points.length * 3);
  const colors = new Float32Array(points.length * 3);

  points.forEach((point, i) => {
    // Convert 2D points to 3D (using z=0)
    positions[i * 3] = point[0];     // x
    positions[i * 3 + 1] = point[1]; // y
    positions[i * 3 + 2] = 0;        // z

    // Color: red for selected point, blue for neighbors
    const isSelected = i === 0; // First point is always the selected point
    const color = isSelected ? new THREE.Color(0x22c55e) : new THREE.Color(0x0000ff);
    
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  });

  // Update the selected point view on left component
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.index !== undefined) {
        onPointSelect(neighborIndices[event.index]);
    }
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (event.index !== undefined) {
        setHovered(event.index);
        onHover(event.index);
        document.body.style.cursor = 'pointer';
    }
  }

  const handlePointerOut = () => {
    setHovered(null);
    onHover(null);
    document.body.style.cursor = 'auto'
  }

  return (
    <points
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={points.length}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        alphaTest={0.9}
        depthWrite={false}
        // precision="highp"
      />
    </points>
  );
}

export default function LocalView({ neighborhood, onPointSelect }: LocalViewProps) {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0});

    const handlePointerMove = (event: MouseEvent) => {
        setMousePosition({
            x: event.clientX,
            y: event.clientY
        });
    };

    useEffect(() => {
        window.addEventListener('mousemove', handlePointerMove);
        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
        };
    }, []);

    return (
    <div className="w-full h-full">
        <Canvas 
            camera={{ 
                position: [0, 0, 2],
                fov: 50,
            }}
            // To make the hitbox smaller
            raycaster={{
                params: {
                    Points: { threshold: 0.05 },
                    Line: { threshold: 0.1 },
                    Mesh: {},
                    LOD: {},
                    Sprite: {}
                }
            }}
        >
        <ambientLight intensity={0.5} />
        <OrbitControls enableRotate={false} />
        <group position={[-1, -0.8, 0]}>
        <Axes 
          lengthX={2} 
          lengthY={1.5}
          labels={['PC-1', 'PC-2']} 
          is2D={true} 
          textOffset={0.15}
          fontSize={0.08}
        />
        </group>
        <Points 
            points={neighborhood.projected_points}
            selectedIndex={neighborhood.selected_point.index}
            neighborIndices={neighborhood.neighbor_indices}
            onPointSelect={onPointSelect}
            onHover={setHoveredPoint}
        />
        </Canvas>
        {hoveredPoint !== null && (
            <PreviewWindow 
                caption={neighborhood.neighbors_info[hoveredPoint].caption}
                image={neighborhood.neighbors_info[hoveredPoint].image}
                position={mousePosition}
                visible={true}
            />
        )}
    </div>
    );
}