from sklearn.cluster import DBSCAN
from scipy.spatial import ConvexHull
import numpy as np
from preproc import mapping

from PIL import ImageDraw, ImageFont, Image
from matplotlib import colormaps


def draw_interactables(canvas, inte_data):
    if inte_data is None:
        return

    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()

    clusters = inte_data["clusters"]
    if not clusters:
        return

    max_count = max(
        cluster["count"]
        for cluster in clusters
    )
    cmap = colormaps["turbo"]

    for cluster in clusters:
        value = cluster["count"] / max_count
        r, g, b, _ = cmap(value)
        color = (
            int(r * 255),
            int(g * 255),
            int(b * 255)
        )

        hull = cluster["hull"]
        if hull is not None and len(hull) >= 3:
            hull_points = [
                tuple(map(float, point))
                for point in hull
            ]
            draw.polygon(
                hull_points,
                fill=(*color, 80),
                outline=(0, 0, 0, 255)
            )
        cx, cy = cluster["center"]
        r = 20
        draw.ellipse(
            (
                cx - r,
                cy - r,
                cx + r,
                cy + r
            ),
            fill=(*color, 255),
            outline=(0, 0, 0, 255),
            width=3
        )
        ratio = 0
        if cluster["count"] > 0:
            ratio = cluster["true"] / cluster["count"]
        text = (
            f"{cluster['count']}\n"
            f"{ratio:.0%}"
        )
        text_img = Image.new(
            "RGBA",
            (250, 150),
            (0, 0, 0, 0)
        )
        text_draw = ImageDraw.Draw(text_img)

        # Black outline
        for dx in (-3, -2, -1, 0, 1, 2, 3):
            for dy in (-3, -2, -1, 0, 1, 2, 3):

                if dx == 0 and dy == 0:
                    continue

                text_draw.text(
                    (30 + dx, 30 + dy),
                    text,
                    font=font,
                    fill="black"
                )

        # Colored foreground text
        text_draw.text(
            (30, 30),
            text,
            font=font,
            fill=color
        )

        # rotate 180°
        text_img = text_img.rotate(
            -90,
            expand=True
        )

        canvas.paste(
            text_img,
            (
                int(cx + 30),
                int(cy - 40)
            ),
            text_img
        )

from sklearn.cluster import DBSCAN
from scipy.spatial import ConvexHull
import numpy as np


def cluster_interactions(mapped_interactions, eps, min_samples):

    points = np.array([
        [px, py]
        for px, py, _, _ in mapped_interactions
    ])

    if len(points) == 0:
        return {
            "clusters": [],
            "interactions": mapped_interactions
        }

    clustering = DBSCAN(
        eps=eps,
        min_samples=min_samples
    ).fit(points)

    labels = clustering.labels_

    clusters = []

    for label in set(labels):

        if label == -1:
            continue

        idx = np.where(labels == label)[0]

        cluster_points = points[idx]

        center = cluster_points.mean(axis=0)

        objects = {}
        true_count = 0
        false_count = 0

        for i in idx:

            _, _, obj_name, state = mapped_interactions[i]

            objects[obj_name] = (
                objects.get(obj_name, 0) + 1
            )

            if state:
                true_count += 1
            else:
                false_count += 1

        hull_points = None

        if len(cluster_points) >= 3:
            hull = ConvexHull(cluster_points)
            hull_points = cluster_points[hull.vertices]

        clusters.append({
            "label": int(label),

            "center": center,

            "hull": hull_points,

            "points": cluster_points,

            "count": len(cluster_points),

            "true": true_count,
            "false": false_count,

            "objects": objects
        })

    return {
        "clusters": clusters,
        "interactions": mapped_interactions
    }


def prepare_cluster_data(
    inter_data,
    BORDER,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    eps=60,
    min_samples=2
):
    prepared = {}

    all_interactions = []

    for session_id, interaction in inter_data.items():

        points = np.array([
            [x, y]
            for x, y, obj_name, state in interaction
        ])

        if len(points) == 0:
            continue

        mapped_points = mapping(
            points,
            BORDER,
            width=IMAGE_WIDTH,
            height=IMAGE_HEIGHT
        )

        mapped_interactions = []

        for (x, y, obj_name, state), (px, py) in zip(
            interaction,
            mapped_points
        ):
            mapped_interactions.append(
                (px, py, obj_name, state)
            )

        all_interactions.extend(
            mapped_interactions
        )

        prepared[session_id] = cluster_interactions(
            mapped_interactions,
            eps,
            min_samples
        )

    # Combined cluster set
    prepared["all"] = cluster_interactions(
        all_interactions,
        eps,
        min_samples
    )

    return prepared