from pathlib import Path
import pandas as pd

def load_user_data_folder(folder):
    data = {}
    for file in Path(folder).glob('User_Data_*.csv'):
        session_id = file.stem[10:]
        df = pd.read_csv(file,usecols=["loc_x", "loc_y", "loc_z"])
        data[session_id] = df

    return data


LEFT_OBJECTS = {"HC_Pyramid"}
RIGHT_OBJECTS = {"HC_Cuboid", "HC_Cube"}

def load_interactables_folder(folder, left_pos, right_pos):
    import random
    import math
    data = {}
    i=0
    for file in Path(folder).glob("Interactables*.json"):
        
        session_id = file.stem[14:]
        points = []
        with open(file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    time_str, obj_name, state = [
                        x.strip() for x in line.split(";")
                    ]
                except ValueError:
                    print(f"Could not parse line in {file.name}: {line}")
                    continue
                obj_kind = obj_name.split("(")[0].strip()
                state = state.lower() == "true"

                i+=1
                rng = random.Random(i)
                angle = rng.uniform(0, 2 * math.pi)
                radius = rng.uniform(0, 0.3)
                offset = (radius * math.cos(angle), radius * math.sin(angle))
                if obj_kind in LEFT_OBJECTS:
                    x, y = left_pos if state else right_pos
                    points.append((x + offset[0], y + offset[1], obj_name, state))
                elif obj_kind in RIGHT_OBJECTS:
                    x, y = right_pos if state else left_pos
                    points.append((x + offset[0], y + offset[1], obj_name, state))

        data[session_id] = points

    return data
