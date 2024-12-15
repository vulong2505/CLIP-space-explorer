import json
import base64
import io
import torch
import numpy as np
from dataclasses import dataclass

@dataclass
class CLIPPair:
    caption: str
    image: str  # In the backend, this will be encoded to base64. Don't use Image.Image
    clip_text_embedding: torch.Tensor
    clip_image_embedding: torch.Tensor
    umap_text_embedding: np.ndarray
    umap_image_embedding: np.ndarray
    umap_average_embedding: np.ndarray
    similarity_score: torch.Tensor

def load_clip_pairs(filename):

  # Load file
  with open(filename, 'r') as f:
    clip_pairs_dict = json.load(f)

  # Convert json format back to CLIPPair
  clip_pairs = []
  for pair in clip_pairs_dict:
    clip_pairs.append(CLIPPair(
        caption = pair['caption'],
        image = pair['image'],  # Keep as base64
        clip_text_embedding=torch.tensor(pair['clip_text_embedding'], dtype=torch.float16),
        clip_image_embedding=torch.tensor(pair['clip_image_embedding'], dtype=torch.float16),
        umap_text_embedding = np.array(pair['umap_text_embedding'], dtype=np.float32) if pair['umap_text_embedding'] is not None else None,
        umap_image_embedding = np.array(pair['umap_image_embedding'], dtype=np.float32) if pair['umap_image_embedding'] is not None else None,
        umap_average_embedding = np.array(pair['umap_average_embedding'], dtype=np.float32) if pair['umap_average_embedding'] is not None else None,
        similarity_score=torch.tensor(pair['similarity_score'], dtype=torch.float16)
    ))

  return clip_pairs
