# CLIP Latent Space Explorer <img src="readme_data\look_into_clip.svg" width="60" alt="CLIP Latent Space Explorer Icon">

Interactive 3D visualization tool that explores how the Contrastive Language-Image Pretraining ([CLIP](https://arxiv.org/pdf/2103.00020) [[code]](https://github.com/openai/CLIP)) AI model understands relationships between images and text. 

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Git LFS](#git-lfs)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Create a New Set of Points for Visualization](#create-a-new-set-of-points-for-visualization)

## Overview

<div align="center">
  <img src="readme_data\website_global_view.png" alt="Global View of CLIP embeddings">
  <p><em>Figure 1: Global View. The CLIP embeddings are projected to 3D using UMAP and visualized on the right component. A description of the visualization is available on the left component.</em></p>
</div>

<div align="center">
    <img src="readme_data\website_local_view.png" alt="Local View of a point's nearest neighbor">
  <p><em>Figure 2: Local View. Clicking on a point in the Global View will compute that point's nearest neighbors and project it to 2D using PCA. The right component shows the PCA visualization. A description of the visualization is available on the left component. </em></p>
</div>


The tool visualizes CLIP's latent space representation by:
- Preprocessed a subset of MS-COCO to get CLIP embeddings from that subset.
- Projected 512D CLIP embeddings to 3D using UMAP
- Plots 3D points of image and text embeddings as interactive points.
- Clicking on a point will compute its nearest neighbor, and project them to 2D using PCA.
- A preview window of the image-text pair of a point on hover.

## Features

- **Global View**: Freely explore the global structure of UMAP embeddings for a 5K subset of MS-COCO.
- **Local View**: Clicking on a point will compute its nearest neighbors, and visualize the PCA embeddings.
- **Interactive Navigation**: Move the camera in the right component to see the global structure at different angles and position. Refer to helper tooltip for instructions.
- **Preview Window**: On hover, a preview window display that point's associated image-text pair. Useful for investigating how CLIP clusters semantic concepts in global structure.

## Setup Instructions

### Prerequisites
- Python 3.9.13+
- Node.js 22.12.0+ and yarn 1.22.22+
- Strongly recommended to have at least 16GB RAM (**recommended due to CLIP embeddings size**)
- All other RAM resource intensive programs closed, e.g., the 47 chrome tabs for your other work 😅.

### Git LFS

1. The available json file is large so `git lfs` is used to store it in GitHub. If you don't have `git lfs` on your computer, install it using the following:

```bash
git lfs install
```

2. After turning on `git lfs`, clone the repo as usual.

```bash
git clone https://github.com/vulong2505/CLIP-space-explorer.git
```

3. If you already cloned the repo before turning on `git lfs`. Then install it and run the below line:

```bash
git lfs pull
```

4. In the case that you can't download the json file via `git clone`, you can download it externally. Download from the json from [my external Drive folder](https://drive.google.com/drive/folders/1aZ25O4jkmUvUDBx678DpgFS-Vi20wMC2?usp=sharing) and move the json file to `backend/data/pairs_5K_UMAPn30.json`.

### Backend Setup

1. Navigate to the backend directory to install dependencies:
```bash
# Starting from the root directory, go into backend/
cd backend
```

2. Create and activate virtual environment:
```bash
# Create and activate virtual environment
py -m venv venv
# On Windows:
venv\Scripts\activate
# On Unix or MacOS:
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. You can skip this step if you already have Node.js and yarn installed. Otherwise, download [Node.js](https://nodejs.org/en) and then install yarn globally:
```bash
npm install --global yarn
```

2. Navigate to the frontend directory to install dependencies:
```bash
cd frontend
```

1. Install Node.js dependencies:
```bash
yarn
```

## Running the Application

1. Start the backend server:
```bash
# (If you're already in the virtual env, ignore this step)
# venv\Scripts\activate # for Windows
# source venv/bin/activate  # for Unix or MacOS

# Starting from root directory, go into the backend directory
cd backend
# Start backend server
py app.py
```

Wait for the **"Finished loading CLIP pairs. Server is up and running."** message.

2. In a new terminal, start the frontend website:
```bash
# Starting from the root directory, go into the frontend directory
cd frontend
# Start the frontend site in dev mode
yarn dev
```

3. In the terminal for the frontend, open the URL shown in the terminal (it might be http://localhost:5173 if the default vite port is open). Refer to the image below to find the link after running `yarn dev`:

<img src="readme_data\example_yarn_url.png" alt="Example successful yarn run.">

## Create a new set of points for visualization

1. In the `notebook/` directory, you can use the Jupyter Notebook to preprocess MS-COCO to create a new dataset of CLIP embedding points for the visualization. I highly recommend using Google Colab's high RAM GPUs (if you don't have your own) to run this notebook. 

2. Change hyperparameters in notebook to create a new dataset:
```python
# For example, this preprocesses a dataset of 5K samples to get its UMAP embeddings (n_neighbors=30). Running the entire notebook will save this dataset as a .json.
NUM_SAMPLES = 5000              
UMAP_N_NEIGHBORS = 30           
FILENAME = "pairs_5K_UMAPn30"   
```

3. Change file path in backend server `backend/app.py` to the new json. For example:
```python
filename = 'data\\pairs_5K_UMAPn30.json'
```