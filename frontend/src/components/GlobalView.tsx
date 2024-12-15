import { useRef, useState, useEffect } from 'react';
import { Canvas, ThreeEvent, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CLIPPair } from '../types/data';
import { CameraState } from '../types/data'
import PreviewWindow from './PreviewWindow'
import Axes from './Axes'
import * as THREE from 'three';

// Props for UMAP coordinates
interface GlobalViewProps {
    clipPairs: CLIPPair[];
    onPointSelect: (index: number) => void; // onPointSelect takes in an index, which we'll use to perform side-effects later to bring up the preview component or get the local view
    initialCameraState: CameraState;
    onCameraChange: (state: CameraState) => void;
}

interface PointsProp {
    points: number[][];
    colors: THREE.Color[];
    onPointSelect: (index: number) => void;
    onHover: (index: number | null) => void;
}

function CameraController({ onCameraChange }: { onCameraChange: (state: CameraState) => void }) {
    const { camera } = useThree();
    const frameCount = useRef(0);
    
    useFrame(() => {
      // Update on every 1 frame
      frameCount.current += 1;
      if (frameCount.current % 1 === 0) {
        // console.log('Camera Position:', [camera.position.x, camera.position.y, camera.position.z]);
        // console.log('Camera Rotation:', [camera.rotation.x, camera.rotation.y, camera.rotation.z]);

        onCameraChange({
          position: [camera.position.x, camera.position.y, camera.position.z],
          rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z]
        });
      }
    });
  
    return null;
}
      

function Points({ points, colors, onPointSelect, onHover }: PointsProp) {
    /**
     * The Points component.
     * 
     * @params points - A list of list of coordinate locations for the embeddings
     * @params colors - A list of list of the colors corresponding to those coordinate locations
     * @params onPointSelect - Click on a point to perform side effect
     * @params onHover - Hover over a point to show the preview window component
     */

    const pointsRef = useRef<THREE.Points>(null)
    const [hovered, setHovered] = useState<number | null>(null);

    // Create geometry of positions
    const positions = new Float32Array(points.length * 3);
    const colorsArray = new Float32Array(points.length * 3);
    
    points.forEach((point, i) => {
        // Set coordinate positions of points
        positions[i * 3] = point[0];
        positions[i * 3 + 1] = point[1];
        positions[i * 3 + 2] = point[2];
        
        // Set colors
        colorsArray[i * 3] = colors[i].r;
        colorsArray[i * 3 + 1] = colors[i].g;
        colorsArray[i * 3 + 2] = colors[i].b;
    });

    const handleClick = (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        // Get index of clicked point
        if (event.index !== undefined) {
            onPointSelect(event.index);
            document.body.style.cursor = 'auto';  // Fixed a bug where after clicking, the cursor is still a poiter
        }
    };

    const handlePointerOver  = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        if (event.index !== undefined) {
            setHovered(event.index);
            onHover(event.index);
            document.body.style.cursor = 'pointer';
        }
    };

    const handlePointerOut = () => {
        setHovered(null);
        onHover(null);
        document.body.style.cursor = 'auto';
    };
    
    // Render
    return (
        <points 
            ref={pointsRef}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <bufferGeometry>
                {/* Attach bufferAttribute for the geometry */}
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={points.length}
                    array={colorsArray}
                    itemSize={3}
                />
            </bufferGeometry>
            {/* Specifies how the points are rendered */}
            <pointsMaterial
                size={0.1}
                sizeAttenuation={true}
                vertexColors={true}
                transparent={true}
                alphaTest={0.9}
                depthWrite={false}
                precision="highp"
            />
        </points>
    );
}

export default function GlobalView({ clipPairs, onPointSelect, initialCameraState, onCameraChange }: GlobalViewProps) {
    /**
     * Global view component for the visualization of all samples. The samples were projected to 3D using UMAP
     */
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Prepare points and colors for visulization given clipPairs
    const points: number[][] = [];
    const colors: THREE.Color[] = [];
    const pointToClipPairIndex: number[] = []; // Need to map the points to its correct clipPairs index, so clicking on a point returns the correct index

    clipPairs.forEach( (pair, clipPairIndex ) => {
        if (pair.umap_text_embedding) {
            points.push(pair.umap_text_embedding);
            colors.push(new THREE.Color(0x0000ff)); // Blue points for text embeddings
            pointToClipPairIndex.push(clipPairIndex); // Map point to clipPairs index
        }
        if (pair.umap_image_embedding) {
            points.push(pair.umap_image_embedding);
            colors.push(new THREE.Color(0xff0000)); // Red points for image embeddings
            pointToClipPairIndex.push(clipPairIndex); // Map point to clipPairs index
        }
    });

    const handlePointSelect = (pointIndex: number) => {
        const clipPairIndex = pointToClipPairIndex[pointIndex];
        onPointSelect(clipPairIndex); // Returns the mapped index to parent
    }

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
    
    const handleHover = (pointIndex: number | null) => {
        if (pointIndex === null) {
            setHoveredPoint(null);
        } else {
            const clipPairIndex = pointToClipPairIndex[pointIndex];
            setHoveredPoint(clipPairIndex);
        }
    };

    // Render
    return (
        <div className="w-full h-full">
            <Canvas 
                camera={initialCameraState}
                // To make the hitbox of points smaller
                raycaster = {{
                    params: {
                        Points: { threshold: 0.1 },
                        Line: { threshold: 0.1},
                        Mesh: {},
                        LOD: {},
                        Sprite: {}
                    }
                }}
            >
                <ambientLight intensity={0.5} />
                <CameraController onCameraChange={onCameraChange} />
                <OrbitControls target={[4.5, 5, 0]} />
                <group position={[-8, 1, -3]}>
                <Axes 
                    lengthX={29} 
                    lengthY={15}
                    lengthZ={12}
                    labels={['UMAP-1', 'UMAP-2', 'UMAP-3']} 
                        fontSize={0.5}
                />
                </group>
                <Points 
                    points={points} 
                    colors={colors} 
                    onPointSelect={handlePointSelect}
                    onHover={handleHover}   
                />  
            </Canvas>
            {hoveredPoint !== null && (
                <PreviewWindow
                caption={clipPairs[hoveredPoint].caption}
                image={clipPairs[hoveredPoint].image}
                position={mousePosition}
                visible={true}
                />
            )}
        </div>
    );
}