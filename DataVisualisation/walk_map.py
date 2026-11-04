from pathlib import Path
from bib_visualize_data import generate_walk_map

def convert_user_data():
    elements_in_directory = list(Path(Path(__file__).resolve().parent).iterdir())
    for item in elements_in_directory:
        if item.is_dir():
            for element in list(item.iterdir()):
                if element.suffix ==".json" and element.name[:10]=="User_Data_":
                    name = element.parent.name + element.stem[9:]+".jpg"
                    with open(element) as f:
                        data = f.readlines()
                    if data == None:
                        return None
                    # sintifically guessed from  Max ^^
                    bounds = [{"t":3,"b":-3},{"t":4.5,"b":-4.5}]
                    if bounds == None:
                        return None
                    generate_walk_map(data,bounds,name=name)

def main():
    data_file = Path(Path(__file__).resolve().parent)/"User_Data_12_7_27.json"
    with open(data_file) as f:
        data = f.readlines()
    if data == None:
        return None
    # bounds = borders(data)
    # sintifically guessed from Max ^^
    bounds = [{"t":3,"b":-3},{"t":4.5,"b":-4.5}]
    if bounds == None:
        return None
    generate_walk_map(data,bounds,debug=True)

#convert_user_data()
main()