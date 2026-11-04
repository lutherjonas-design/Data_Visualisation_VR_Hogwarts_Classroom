import pandas as pd
from pathlib import Path
from bib_visualize_data import convert_data_to_csv,gen_Clusters

# Contains the output json file
def convert_all_files():
    elements_in_directory = list(Path(Path(__file__).resolve().parent).iterdir())
    for item in elements_in_directory:
        if item.is_dir():
            for element in list(item.iterdir()):
                if element.suffix ==".json" and element.name[:10]=="User_Data_":
                    # sintifically guessed from  Max ^^
                    bounds = [{"t":3,"b":-3},{"t":4.5,"b":-4.5}]
                    convert_data_to_csv(element,item,[{"t":3,"b":-3},{"t":4.5,"b":-4.5}])
    convert_data_to_csv(Path(Path(__file__).resolve().parent)/"User_Data_12_7_27.json",Path(Path(__file__).resolve().parent),[{"t":3,"b":-3},{"t":4.5,"b":-4.5}])

def main():
    data_file = Path(Path(__file__).resolve().parent)/"User_Data_12_7_27.csv"
    # bounds = borders(data)
    # sintifically guessed from Max ^^
    bounds = [{"t":3,"b":-3},{"t":4.5,"b":-4.5}]
    if bounds == None:
        return None
    gen_Clusters(data_file)

main()