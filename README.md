# Integrated Data & Web Application Core (VReiraum & Analytics)

### ⚠️ **Project Status: Monorepo Prototype (Academic Thesis & Data Evaluation)**  
This project was completed as part of my last Paper for my Master and is a Monorepo containig different stages and parts, because of timeline constraints of wanting to finish my Degree and finding a controller. For now it is paused, since the person that would use it is not available at the university and I went on to set up a home server

### 🛠️ **Tech Stack**
* **Backend:** Python, FastAPI
* **Frontend:** React
* **Data Processing:** NumPy

---

## Repository Guide & Architecture

To help with code review, here is the roadmap to the most important components:

### 1. The Web Ecosystem
*   `/backend` – FastApi application, containing the API, a started processing pipeline and a started storage solution.
*   `/dev_frontend_dev` – Development environment for the React frontend. It includes an option to use a simulated backend. Reproducing this environment may require resolving package and lockfile differences; it is provided as-is.
*   `/old_frontend` – Intended location for static build files served by the backend.

### 2. Data Processing Pipeline

The data-processing scripts were kept separate from the web backend to support changing requirements and analysis during the thesis project.

- `DataVisualisation/Clustering.py` and `DataVisualisation/walk_map.py` — Early exploratory scripts used to investigate data visualization approaches before the final research requirements were established.
- `DataVisualisation/dataChange/convert.py` — Converts the original data format into CSV files with headers. The source format used alternating lines for different data fields without identifiers, so conversion was needed before analysis.
- `DataVisualisation/dataChange/csv_output/main.py` — Main processing script for generating heatmaps and clusters using Pandas and NumPy. It reflects the available data format and the project’s requirements at the time.

---

## Architectural Notes

- **Development under time constraints:** The parsing and analysis scripts were run locally and separately from the web backend. This made it possible to iterate on datasets without first integrating the analysis pipeline into the application.
- **Potential integration:** The processing scripts are currently standalone. Integrating them into the FastAPI backend would require adapting them into service modules and testing them through the application.
