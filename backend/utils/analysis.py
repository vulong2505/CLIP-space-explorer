import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.decomposition import PCA
from typing import List, Tuple, Union
from dataclasses import dataclass
from utils.data_loader import CLIPPair

def get_local_neighborhood(
    clip_pairs: List[CLIPPair],
    selected_idx: int,
    n_neighbors: int = 50,
    embedding_type: str = 'image'
) -> Tuple[np.ndarray, List[int], np.ndarray]:
    """
    Find nearest neighbors in original CLIP space and project to 2D using PCA.

    Args:
        clip_pairs: List of CLIPPair objects
        selected_idx: Index of the selected point
        n_neighbors: Number of neighbors to find (including the selected point)
        embedding_type: Which embedding to use ('image', 'text', or 'average')

    Returns:
        projected_points: ndarray of shape (n_neighbors, 2) containing PCA projections
        neighbor_indices: List of indices of nearest neighbors
        explained_variance_ratio: Variance explained by each principal component
    """
    # Extract embeddings based on type
    if embedding_type == 'image':
        embeddings = np.vstack([pair.clip_image_embedding for pair in clip_pairs])
    elif embedding_type == 'text':
        embeddings = np.vstack([pair.clip_text_embedding for pair in clip_pairs])
    elif embedding_type == 'average':
        embeddings = np.vstack([
            (pair.clip_image_embedding + pair.clip_text_embedding) / 2
            for pair in clip_pairs
        ])
    else:
        raise ValueError(f"Unknown embedding type: {embedding_type}")

    # Normalize embeddings (in case they aren't already)
    embeddings = embeddings / np.linalg.norm(embeddings, axis=1)[:, np.newaxis]

    # Find nearest neighbors
    n_neighbors = min(n_neighbors, len(clip_pairs))  # Ensure we don't ask for too many neighbors
    nbrs = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine')
    nbrs.fit(embeddings)

    # Get indices of nearest neighbors
    distances, indices = nbrs.kneighbors(embeddings[selected_idx].reshape(1, -1))
    neighbor_indices = indices[0]  # Flatten from 2D array

    # Get embeddings of neighborhood
    neighborhood_embeddings = embeddings[neighbor_indices]

    # Project to 2D using PCA
    pca = PCA(n_components=2)
    projected_points = pca.fit_transform(neighborhood_embeddings)

    return projected_points, neighbor_indices, pca.explained_variance_ratio_

def get_neighborhood_info(
    clip_pairs: List[CLIPPair],
    neighbor_indices: List[int]
) -> List[dict]:
    """
    Create a list of dictionaries containing information about each neighbor
    for visualization or analysis.

    Args:
        clip_pairs: List of CLIPPair objects
        neighbor_indices: List of indices of nearest neighbors

    Returns:
        List of dictionaries containing neighbor information
    """
    return [{
        'index': idx,
        'caption': clip_pairs[idx].caption,
        'image': clip_pairs[idx].image,
        'similarity_score': clip_pairs[idx].similarity_score
    } for idx in neighbor_indices]

# Example usage:
def analyze_local_neighborhood(
    clip_pairs: List[CLIPPair],
    selected_idx: int,
    n_neighbors: int = 50,
    embedding_type: str = 'image'
) -> dict:
    """
    Perform complete local neighborhood analysis for a selected point.

    Args:
        clip_pairs: List of CLIPPair objects
        selected_idx: Index of the selected point
        n_neighbors: Number of neighbors to find
        embedding_type: Which embedding to use ('image', 'text', or 'average')

    Returns:
        Dictionary containing analysis results
    """
    # Get local projections and neighbor indices
    projected_points, neighbor_indices, explained_variance = get_local_neighborhood(
        clip_pairs, selected_idx, n_neighbors, embedding_type
    )

    # Get neighbor information
    neighbors_info = get_neighborhood_info(clip_pairs, neighbor_indices)

    # Process the results so all data is JSON serializable
    neighbors_info_serialized = [
        {
            'index': int(info['index']),  # Convert index to Python int
            'caption': info['caption'],
            'image': info['image'],
            'similarity_score': float(info['similarity_score'])  # Convert score to Python float
        }
        for info in neighbors_info
    ]

    selected_point_serialized = {
        'index': int(neighbors_info[0]['index']),  # Convert index to Python int
        'caption': neighbors_info[0]['caption'],
        'image': neighbors_info[0]['image'],
        'similarity_score': float(neighbors_info[0]['similarity_score'])  # Convert score to Python float
    }

    results = {
        'projected_points': projected_points.tolist(),  # Convert NumPy array to list
        'neighbor_indices': [int(idx) for idx in neighbor_indices],  # Convert indices to Python int
        'neighbors_info': neighbors_info_serialized,  # Serialize neighbors info
        'explained_variance': explained_variance.tolist(),  # Convert NumPy array to list
        'selected_point': selected_point_serialized  # Serialize selected point
    }

    return results