from PIL import Image, ImageDraw
from pathlib import Path
import json
arbitrary_teleportation_border = 40
picture_width = 4096
background_color = (0,0,0)
grid_color = (127,127,127)
lines_x = 5
lines_y = 9
path_stroke = 3

# a Block to modify the script values, so I somewhat have lower amounts of Variables I have to add to my calls
def set_grid_lines(x,y):
    global lines_x,lines_y
    lines_x,lines_y=x,y

def set_grid_color(color):
    global grid_color
    grid_color = color

def set_picture_width(width):
    global picture_width
    picture_width = width

def set_color_border(number):
    global arbitrary_teleportation_border
    arbitrary_teleportation_border = round(number)

def set_background_color(color):
    global background_color
    background_color = color
# From here the Magic Happens ;D

# translate a given Value from one Intervall to its representation in a second Intervall, the result will be rounded by choice (for Pixel Positions)
def translate(value, leftMin, leftMax, rightMin, rightMax):
    # Figure out how 'wide' each range is
    leftSpan = leftMax - leftMin
    rightSpan = rightMax - rightMin
    # Convert the left range into a 0-1 range (float)
    valueScaled = float(value - leftMin) / float(leftSpan)
    # Convert the 0-1 range into a value in the right range.
    return round(rightMin + (valueScaled * rightSpan))

# chooses the colors for the given line segment. If it is between the arbitrary....number, then it will have a colorramp and else it will be shown in Blue
def color_path(p1,p2):
    arbitrary_border = arbitrary_teleportation_border
    distance=((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)**0.5
    if distance>arbitrary_border:
        return (0,0,255)
    t=distance/arbitrary_border
    return (round(255*t),round(255*(1-t)),0)

# draws a grid onto the picture, the amount of lines are set by lines_x/y
def draw_grid(draw,width,height):
    spacer_x=width/(lines_x+1)
    spacer_y=height/lines_y
    for i in range(1,(lines_x+1)):
        draw.line((round(spacer_x*i),0,round(spacer_x*i),height), fill=grid_color)
    for i in range(1,(lines_y+1)):
        draw.line((0,round(spacer_y*i),width,round(spacer_y*i)), fill=grid_color)

#draws the line
def draw_path(data,bounds,number_of_data_points,draw,width,height):
    last_position = [0,0]
    for i in range(0,number_of_data_points,2):
        line = json.loads(data[i])
        if i==0:
            last_position = (translate(line["x"],bounds[0]["t"],bounds[0]["b"],0,width),translate(line["z"],bounds[1]["t"],bounds[1]["b"],0,height-1))
        xy = (translate(line["x"],bounds[0]["t"],bounds[0]["b"],0,width),translate(line["z"],bounds[1]["t"],bounds[1]["b"],0,height-1))
        draw.line((*xy,*last_position), fill=color_path(xy,last_position),width=path_stroke)
        last_position = (translate(line["x"],bounds[0]["t"],bounds[0]["b"],0,width),translate(line["z"],bounds[1]["t"],bounds[1]["b"],0,height-1))

# draw the data Points for better visualization
def draw_data_points(data,bounds,number_of_data_points,draw,width,height):
    for i in range(0,number_of_data_points,2):
        line = json.loads(data[i])
        xy = (translate(line["x"],bounds[0]["t"],bounds[0]["b"],0,width),translate(line["z"],bounds[1]["t"],bounds[1]["b"],0,height))
        draw.point(xy,(255,255,255))

#calls the rest, basically main
def generate_walk_map(data,bounds,name='data_visualization',debug=False):
    number_of_data_points = len(data)
    width = picture_width
    span_x = bounds[0]["t"] - bounds[0]["b"]
    span_y = bounds[1]["t"] - bounds[1]["b"]
    height = round((width*span_y)/span_x)

    img = Image.new(mode="RGB",size=(width,height),color=background_color)
    draw = ImageDraw.Draw(img)

    draw_grid(draw,width,height)
    draw_path(data,bounds,number_of_data_points,draw,width,height)
    draw_data_points(data,bounds,number_of_data_points,draw,width,height)
    if debug:
        img.transpose(Image.Transpose.FLIP_TOP_BOTTOM).show()
    else:
        img.transpose(Image.Transpose.FLIP_TOP_BOTTOM).save(Path(Path(__file__).resolve().parent)/'data'/name)