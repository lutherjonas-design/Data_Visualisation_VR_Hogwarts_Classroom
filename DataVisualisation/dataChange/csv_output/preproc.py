def print_coordinate_ranges(user_data):
    all_x = []
    all_z = []

    for session_id, df in user_data.items():
        all_x.extend(df["loc_x"])
        all_z.extend(df["loc_z"])

    print("\nCoordinate ranges:")
    print(f"X: {min(all_x):.3f} -> {max(all_x):.3f}")
    print(f"Z: {min(all_z):.3f} -> {max(all_z):.3f}")

import numpy as np
def mapping(points, borders, width, height):
    x = points[:, 0]
    z = points[:, 1]

    px = (x - borders["min_x"]) / (
        borders["max_x"] - borders["min_x"]
    ) * width

    py = (z - borders["min_y"]) / (
        borders["max_y"] - borders["min_y"]
    ) * height

    return np.column_stack((px, py))