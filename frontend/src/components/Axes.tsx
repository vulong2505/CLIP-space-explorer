import { Text } from '@react-three/drei';

interface AxesProps {
    lengthX?: number;
    lengthY?: number;
    lengthZ?: number;
    labels?: string[];
    is2D?: boolean;
    textOffset?: number;
    fontSize?: number;
  }
  
export default function Axes({ 
    lengthX = 10, 
    lengthY = 10, 
    lengthZ = 10, 
    labels = ['UMAP-1', 'UMAP-2', 'UMAP-3'], 
    is2D = false,
    textOffset = 0.5,
    fontSize = 0.5 
    }: AxesProps) {

    const axisColor = '#000000'; // black axes line

    return (
        <group>
        {/* X axis */}
        <line>
            <bufferGeometry>
            <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, 0, lengthX, 0, 0])}
                itemSize={3}
            />
            </bufferGeometry>
            <lineBasicMaterial color={axisColor} />
        </line>
        <Text
            position={[lengthX + textOffset, 0, 0]}
            fontSize={fontSize}
            color={axisColor}
        >
            {labels[0]}
        </Text>

        {/* Y axis */}
        <line>
            <bufferGeometry>
            <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, 0, 0, lengthY, 0])}
                itemSize={3}
            />
            </bufferGeometry>
            <lineBasicMaterial color={axisColor} />
        </line>
        <Text
            position={[0, lengthY + textOffset, 0]}
            fontSize={fontSize}
            color={axisColor}
        >
            {labels[1]}
        </Text>

        {/* Z axis (only for 3D) */}
        {!is2D && (
            <>
            <line>
                <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([0, 0, 0, 0, 0, lengthZ])}
                    itemSize={3}
                />
                </bufferGeometry>
                <lineBasicMaterial color={axisColor} />
            </line>
            <Text
                position={[0, 0, lengthZ + textOffset]}
                fontSize={fontSize}
                color={axisColor}
            >
                {labels[2]}
            </Text>
            </>
        )}
        </group>
    );
}
  