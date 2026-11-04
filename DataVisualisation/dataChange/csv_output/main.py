from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

from data_reader import load_user_data_folder, load_interactables_folder
from heatmap import prepare_heatmap_data,draw_heat
from cluster import prepare_cluster_data,draw_interactables

from preproc import mapping

def print_matches(path_data, inter_data):
    all_ids = set(path_data.keys()) | set(inter_data.keys())    
    print("\nSessions:")
    for session_id in sorted(all_ids):
        has_user = session_id in path_data
        has_inter = session_id in inter_data
        if has_user:
            print(
                f"{session_id}: "
                f"Interactables={'✓' if has_inter else '✗'}"
            )
        else:
            raise ValueError
def print_stats(path_data, inter_data):
    print(f"stats > path: {len(path_data)}, int: {len(inter_data)}")

def debug_point(canvas,IMAGE_DATA):
    from PIL import Image, ImageDraw
    draw = ImageDraw.Draw(canvas)
    from numpy import asarray as ay
    points = mapping(ay([(-1.9,-4)]), {'min_y':-4.5,'max_y':4.5,'min_x':-3,'max_x':3}, IMAGE_DATA["w"], IMAGE_DATA["h"])
    for x,y in points:
        draw.ellipse(
            (x - 10, y - 10, x + 10, y + 10),
                fill="blue",
                outline="white",
                width=2
            )
        
    canvas = canvas.rotate(90, expand=True)

def create_canvas(IMAGE_DATA):
    return Image.new(
        "RGBA",
        (
            IMAGE_DATA["w"],
            IMAGE_DATA["h"] + IMAGE_DATA["stats"]
        ),
        (255, 255, 255, 255)
    )

def draw(draw_data, IMAGE_DATA):
    #file things, folder exist, create new images
    base_path = Path(__file__).parent
    vis_path = base_path / "Visualisation"
    vis_path.mkdir(exist_ok=True)

    for file in vis_path.iterdir():
        if file.is_file():
            file.unlink()
    # Background Image
    background = Image.open(base_path / "background.png")
    background = background.resize((IMAGE_DATA["w"], IMAGE_DATA["h"]))
    background = background.transpose(Image.Transpose.ROTATE_180)

    print(end="drawing: ")
    for session_id, data in draw_data.items():
        print(
            f"{session_id}"
            ,  end=", "
        )
        canvas = create_canvas(IMAGE_DATA)

        canvas.paste(background, (0, 0))

        heat_img = draw_heat(data["heat"],IMAGE_DATA)
        canvas.paste(heat_img, (0, 0), heat_img)

        draw_interactables(canvas, data["inte"])

        draw = ImageDraw.Draw(canvas)

        minutes = data["heat"]["samples"] * 0.1 / 60

        try:
            font = ImageFont.truetype("arial.ttf", 40)
        except:
            font = ImageFont.load_default()

        text_img = Image.new(
                "RGBA",
                (250, 150),
                (0, 0, 0, 0)
            )

        text_draw = ImageDraw.Draw(text_img)

        text_draw.text(
            (20, 20),
            f"{minutes:.1f} min",
            fill="white",
            font=font,
            stroke_width=3,
            stroke_fill="black"
        )

        text_img = text_img.rotate(
                -90, expand=True
            )
        canvas.paste(
            text_img, (1030,20),text_img
        )
        canvas = canvas.rotate(90, expand=True)
        canvas.save(
            vis_path / f"{session_id}.png"
        )
    print()

def main():
    IMAGE_WIDTH = 1200
    IMAGE_HEIGHT = 1800
    HEATMAP_SCALE = .25
    HEAT_TRESHOLD = 0
    HEAT_ALPHA = .8
    HEAT_POWER = .5
    STAT_BLOCK = 0
    SIGMA = 10
    CORD_BORDER = {
        'min_x': -3,
        'max_x': 3,
        'min_y': -4.5,
        'max_y': 4.5
    }
    MIN_SAMPLES = 2.5*600 # minutes to datapoints

    IMAGE_DATA = {"w":IMAGE_WIDTH,"h":IMAGE_HEIGHT,"heat_scale":HEATMAP_SCALE
                  , "stats":STAT_BLOCK, "sigma":SIGMA
                  , "heat_threshold":HEAT_TRESHOLD, "heat_alpha":HEAT_ALPHA
                  , "heat_power":HEAT_POWER}

    chest_loc = [(-1.9,4),(1.9,4)]
    user_data_path = Path(__file__).parent

    path_data = load_user_data_folder(user_data_path/"User_Data")
    inter_data = load_interactables_folder(user_data_path/"Interactables",*chest_loc)

    print_stats(path_data,inter_data)

    prepd_heat_data = prepare_heatmap_data(path_data, CORD_BORDER, MIN_SAMPLES, int(IMAGE_WIDTH*HEATMAP_SCALE), int(IMAGE_HEIGHT*HEATMAP_SCALE))
    prepd_inte_data = prepare_cluster_data(inter_data, CORD_BORDER, IMAGE_WIDTH, IMAGE_HEIGHT)
    draw_data = {}
    all_ids = set(prepd_heat_data.keys())  | set(prepd_inte_data.keys())
    for id in all_ids:
        draw_data[id] = {
                "heat":prepd_heat_data[id],
                "inte": prepd_inte_data[id] if id in prepd_inte_data else None
            }
    draw(draw_data, IMAGE_DATA)

main()