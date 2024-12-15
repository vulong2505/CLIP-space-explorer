import { useState, useEffect } from 'react'
import { CLIPPair, LocalNeighborhood, CameraState } from './types/data'
import GlobalView from './components/GlobalView';
import LocalView from './components/LocalView';
import { GlobalCameraControlsTooltip, LocalCameraControlsTooltip } from './components/CameraControlsToolTip';
import { LoadingBox, LoadingPCA } from './components/LoadingSpinner';
import { fetchClipPairs, fetchNeighborhood } from './utils/api';
import './App.css'

function App() {
  // Core state retrieved w/ hooks
  const [clipPairs, setClipPairs] = useState<CLIPPair[]>([]);   // Initialize clipPairs as empty list [] with type list of CLIPPair, and also a set function to update ClipPairs
  const [viewMode, setViewMode] = useState<'global' | 'local'>('global');
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [localView, setLocalView] = useState<LocalNeighborhood | null>(null);
  const [firstClick, setfirstClick] = useState(false);
  const [kValue, setKValue] = useState<number>(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPCA, setIsLoadingPCA] = useState(false);
  const [globalCameraState, setGlobalCameraState] = useState<CameraState>({
    position: [8.242334535846314, 9.403782570182194, 17.822741811686306], // [x, y, z]
    rotation: [0, 0, 0]    // [tilt up/down, turn left/right, tilt sideways] in radians
  });

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchClipPairs();
        setClipPairs(data);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePointSelect = async (index: number) => {
    setSelectedPoint(index);
    if (viewMode == 'global') {
      try {
        // Set firstClick as already happened, so we get rid of the first helper sentence.
        setfirstClick(true);

        // Set up loading state for PCA
        setIsLoadingPCA(true);

        // Switch to local view
        setViewMode('local')

        // Fetch neighborhood data
        const neighborhoodData = await fetchNeighborhood(index, kValue);
        setLocalView(neighborhoodData);
      } catch (err) {
        console.error('Failed to fetch neighborhood: ', err);
      } finally {
        setIsLoadingPCA(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <LoadingBox />
      </div>
    );
  }

  if (error) {
    return <div className="h-screen w-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  // Render
  return (
    <div className="h-screen w-screen flex flex-col bg-white border font-mono">
      <header className="h-[60px] min-h-[60px] bg-white border-b-2 border-black flex justify-between items-center px-4">
        <h1 className="text-xl font-bold text-black">
          {viewMode === 'global' ? 'CLIP Latent Space Explorer — Global UMAP View' : 'CLIP Latent Space Explorer — Local PCA View'}
        </h1>
        {viewMode === 'local' && (
          <button 
            onClick={() => setViewMode('global')}
            className="px-6 py-2.5 border-[1px] border-black bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Back to Global View
          </button>
        )}
      </header>
      <main className="flex-1 flex">
        <div className="w-1/3 border-r-2 border-black p-4 text-justify">
        
          {firstClick === false && (
            <p className="mb-4 font-bold">Click on any point! Check the tooltip for help.</p>
          )} 

          {/* Description */}
          {viewMode === 'global' ? (
            <div>
              <p>
                Explore how CLIP understands semantic concepts by analyzing text-image pairs, visualized through projected embeddings and their proximity in the CLIP latent space.
              </p>
              <p className="mt-4">
                A subset of 5K image-text pairs from MS-COCO is visualized on the right. 
                Each image-text sample were passed through CLIP ViT-B/32's encoder—the image was passed through the image encoder and text passed through the text encoder, resulting in 512D embeddings for each.
              </p>
              <p className="mt-4">
                The visualization uses UMAP to project the 512D embeddings to 3D. 
                Notice how image and text embeddings form distinct clusters, reflecting their natural positions in seperate image and text embedding planes in the original 512D space.
              </p>
            </div>
          ) : (
            <p>Given the selected point (a 512D CLIP embedding), kNN was performed and PCA is used to project the neighbors to 2D for the visualization on the right.</p>
          )}

          {/* The legend */}
          {viewMode === 'global' ? (
            <div className="mt-3">
              <h3 className="font-bold mb-2">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 border border-black"></div>
                  <span>Image Embeddings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 border border-black"></div>
                  <span>Caption Embeddings</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 mb-3">
              <h3 className="font-bold mb-2">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 border border-black"></div>
                  <span>Initially Selected Point</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 border border-black"></div>
                  <span>Neighboring Embeddings</span>
                </div>
              </div>
            </div>
          )
          }

          {selectedPoint !== null && viewMode === 'local' && clipPairs[selectedPoint] && (
            <div>
              <h2 className="font-bold mb-2">Selected Point</h2>
              <img 
                src={`data:image/jpeg;base64,${clipPairs[selectedPoint].image}`} 
                alt="CLIP Pair Image" 
                className="w-full h-auto max-h-[60vh] object-contain"
              />
              <p>{clipPairs[selectedPoint].caption}</p>
            </div>
          )}
          </div>
          <div className="w-2/3 p-4">
              {viewMode == 'global' ? (
                <>
                <div className="absolute top-20 left-30 z-10">
                <GlobalCameraControlsTooltip />
                </div>
                <div className="w-full h-full">
                <GlobalView
                  clipPairs={clipPairs}
                  onPointSelect={handlePointSelect}
                  initialCameraState={globalCameraState}
                  onCameraChange={setGlobalCameraState}
                />
                </div>
                </>
              ) : (
            isLoadingPCA? (
              <div className="h-full w-full flex items-center justify-center">
                <LoadingPCA />
              </div>
            ) : (
              localView && (
                <>
                <div className="absolute top-20 left-30 z-10">
                <LocalCameraControlsTooltip />
                </div>
                <div className="w-full h-full">
                <LocalView 
                  neighborhood={localView}
                  onPointSelect={handlePointSelect}
                />
                </div>
                </>
              )        
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default App
