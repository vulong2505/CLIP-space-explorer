import json
import numpy as np
import io
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.data_loader import load_clip_pairs
from utils.analysis import analyze_local_neighborhood

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # origins * means allowing every port for frontend... just in case it doesn't work on another computer

# Load data when server starts
filename = 'data\\pairs_5K_UMAPn30.json'
print("Booting up server...")
print(f"Loading CLIP Pairs at {filename}")
clip_pairs = load_clip_pairs(filename)
print("Finished loading CLIP pairs. Server is up and running.")

@app.route('/api/clip-pairs')
def get_clip_pairs():
    ''' Convert CLIP Pairs into JSON serializable format '''

    serialized_pairs = []
    for pair in clip_pairs:
        serialized_pair = {
            'caption': pair.caption,
            'image': pair.image,  # base64 encoded
            'umap_text_embedding': pair.umap_text_embedding.tolist() if pair.umap_text_embedding is not None else None,
            'umap_image_embedding': pair.umap_image_embedding.tolist() if pair.umap_image_embedding is not None else None,
            'similarity_score': float(pair.similarity_score)
        }
        serialized_pairs.append(serialized_pair)
    
    return jsonify(serialized_pairs)

@app.route('/api/neighborhood', methods=['POST'])
def get_neighborhood():
    ''' Perform kNN and then PCA to project the neighbors into 2D. '''

    data = request.json
    selected_idx = data['selectedIdx']
    k = data['k']
    
    # Analyze local neighborhood of selected sample
    results = analyze_local_neighborhood(
        clip_pairs=clip_pairs,
        selected_idx=selected_idx,
        n_neighbors=k,
        embedding_type='image'  # TODO: Make this configurable later so it accurately reflects the global view
    )

    # Conver results for JSON serialization
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=False, port=5000)