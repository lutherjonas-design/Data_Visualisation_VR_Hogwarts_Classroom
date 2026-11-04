from scipy.ndimage import gaussian_filter
from PIL import Image
from matplotlib import colormaps
import numpy as np

def draw_heat(data, IMAGE_DATA):
    blurred = gaussian_filter(
        data["density"],
        sigma=IMAGE_DATA["sigma"]
    )

    max_val = blurred.max()
    if max_val > 0:
        blurred = blurred / max_val

    # Remove very weak values
    blurred[blurred < IMAGE_DATA["heat_threshold"]] = 0

    # Boost low densities
    blurred = np.power(
        blurred,
        IMAGE_DATA["heat_power"]
    )

    # Alpha map
    alpha = (
        blurred * 255 * IMAGE_DATA["heat_alpha"]
    ).astype(np.uint8)

    # Apply colormap
    cmap = colormaps["turbo"]
    rgba = cmap(blurred)

    # Convert float -> uint8
    rgba = (rgba * 255).astype(np.uint8)

    # Replace alpha channel
    rgba[..., 3] = alpha

    heat_img = Image.fromarray(
        rgba,
        mode="RGBA"
    )

    heat_img = heat_img.resize(
        (IMAGE_DATA["w"], IMAGE_DATA["h"]),
        Image.Resampling.BILINEAR
    )

    return heat_img
    
import numpy as np
from preproc import mapping

def prepare_heatmap_data(
    data,
    borders,
    min_samples,
    heatmap_width,
    heatmap_height
):
    prepared_data = {}
    all_density = np.zeros(
        (heatmap_height, heatmap_width),
        dtype=np.float32
    )
    total_samples = 0
    print(end="skipping: ")
    for session_id, df in data.items():
        if len(df) < min_samples:
            print(
                f"Skipping {session_id} ({len(df)/600:.2f}min)"
                ,  end=", "
            )
            continue

        points = df[["loc_x", "loc_z"]].to_numpy()

        mapped_points = mapping(
            points,
            borders,
            width=heatmap_width,
            height=heatmap_height
        )

        density = np.zeros(
            (heatmap_height, heatmap_width),
            dtype=np.float32
        )

        for x, y in mapped_points.astype(int):
            x = np.clip(x, 0, heatmap_width - 1)
            y = np.clip(y, 0, heatmap_height - 1)
            density[y, x] += 1

        all_density += density
        total_samples += len(points)

        prepared_data[session_id] = {
            "density": density,
            "samples": len(points),
            "max_density": density.max()
        }
    print()

    if total_samples == 0:
        return prepared_data

    prepared_data["all"] = {
        "density": all_density,
        "samples": total_samples,
        "max_density": all_density.max()
    }

    return prepared_data