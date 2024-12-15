export interface CLIPPair {
    caption: string;
    image: string;                              // base64 encoded image data
    clip_text_embedding: number[];              // 512D text embedding
    clip_image_embedding: number[];             // 512D image embedding
    umap_text_embedding: number[] | null;       // 3D UMAP text embedding
    umap_image_embedding: number[] | null;      // 3D UMAP image embedding
    umap_average_embedding: number[] | null;    
    similarity_score: number;                   // Similarity score between the image and text embedding for the same sample
}

export interface LocalNeighborhood {
    projected_points: number[][];               // 2D PCA coordinates of neighbors
    neighbor_indices: number[];                 // Indices of nearest neighbors
    neighbors_info: {
        index: number;
        caption: string;
        image: string;                          // base64 encoded image data
        similarity_score: number;
    }[];                                        // List of dictionarity with keys: index, caption, image, similarity_score
    explained_variance: number[];               // Variance explained by PCA components
    selected_point: {
        index: number;
        caption: string;
        image: string;
        similarity_score: number;
    };
}

export interface CameraState {
    position: [number, number, number];
    rotation: [number, number, number];
    zoom?: number;
  }