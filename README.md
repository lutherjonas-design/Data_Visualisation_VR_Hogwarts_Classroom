# Data_Visualisation_VR_Hogwarts_Classroom

### Context & Status
**Monorepo Prototype (Academic Research & Data Evaluation)**  
This project was built for my final Master's paper. Due to tight timeline constraints to finish my degree, it was structured as a monorepo containing various development stages. The project is currently paused as the primary university user is no longer available, and my focus has shifted toward setting up a dedicated home server setup.

### Tech Stack
* **Backend:** Python (FastAPI)
* **Frontend:** React (TypeScript / JavaScript)
* **Data Processing:** NumPy, Pandas

---

## Repository Roadmap & Architecture

To simplify code review, here is a guide to the core components of this monorepo:

### 1. Web Application
* `/backend` – FastAPI application containing the API, an initial processing pipeline, and a local storage solution.
* `/dev_frontend_dev` – React frontend development environment. Includes a mock-backend mode for isolated testing. *Note: Provided as-is; environment replication may require resolving minor package dependency changes.*
* `/old_frontend` – Intended directory for static build files served directly by the backend.

### 2. Data Processing Pipeline
The data-processing scripts were intentionally kept decoupled from the web backend to remain flexible during changing research requirements.

* `DataVisualisation/Clustering.py` & `walk_map.py` — Early exploratory scripts used to test data visualization approaches before final requirements were locked in.
* `DataVisualisation/dataChange/convert.py` — A parser that flattens the raw source data (which used alternating lines without unique identifiers) into structured, header-ready CSV files.
* `DataVisualisation/dataChange/csv_output/main.py` — The primary analytics script utilizing Pandas and NumPy to generate heatmaps and clusters based on the parsed CSV data.

---

## Key Takeaways & Lessons Learned

* **Decoupled Development Under Time Constraints:** Keeping the parsing and analysis scripts standalone rather than integrating them into the web backend allowed me to iterate on datasets rapidly without being blocked by application overhead.
* **Future Integration Path:** To fully productionize the system, these standalone processing scripts would need to be refactored into modular services inside the FastAPI core and fully covered by integration tests.
* **Frontend Foundations:** Building the UI provided great hands-on experience with React, specifically around state management, implementing reusable custom hooks, and handling multi-language support alongside light/dark themes.
