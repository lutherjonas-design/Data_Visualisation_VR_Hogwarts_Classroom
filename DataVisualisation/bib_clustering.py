import pandas
from pathlib import Path
from PIL import Image, ImageDraw
from bib_walk_map import translate
from json import loads as jsloads
from random import randint
from scipy.spatial import ConvexHull
from sys import stdout

background_color = (0,0,0)
picture_width = 4096
min_neighbours = 2
epsilon = 50
distant_to_neighbours = epsilon
bounds = [6,9]
grid_color = (127,127,127)
lines_x = 5
lines_y = 9

cluster_count = 0
circle_size = 10
bar_width = 50

def progress_counter(left,all,text='left'):
    ending = '\n' if left == 0 else '\r'
    output = str(left)
    output = output + ('-' * (len(str(all))-len(output)))
    print(f'    {text}: {left}', end=ending)

def progress_bar(steps,pos=0,update='update',pre_text=""):
    global bar_width
    intervall = steps//bar_width
    if update == 'start':
        if pre_text != "":
            print(pre_text)
        stdout.write("[%s]"%(" "*bar_width))
        stdout.flush()
        stdout.write("\b"*(bar_width+1))
    elif update == 'update':
        if pos%intervall == 0:
            stdout.write("-")
            stdout.flush()
    elif update == 'end':
        stdout.write("]\n")

def set_picture_width(width):
    global picture_width
    picture_width = width

def set_background_color(color):
    global background_color
    background_color = color

def convert_data_to_csv(file_path,save_path,bounds):
    with open(file_path) as f:
        data = f.readlines()
    if data == None:
        return False
    width = picture_width
    span_x = bounds[0]["t"] - bounds[0]["b"]
    span_y = bounds[1]["t"] - bounds[1]["b"]
    height = round((width*span_y)/span_x)

    file = open(save_path/(file_path.stem+".csv"), 'w')
    if file == None:
        return False
    file.write("x,y,label\n")
    for i in range(0,len(data),2):
        line = jsloads(data[i])
        xy = [str(translate(line["x"],bounds[0]["t"],bounds[0]["b"],0,width)),str(translate(line["z"],bounds[1]["t"],bounds[1]["b"],0,height)),"0"]
        file.write(",".join(xy)+"\n")
    f.close()
    return True

def modified_DBSCAN(set_data):
    global cluster_count
    size = len(set_data.index)
    cluster_count = 1
    posible_points = set_data.loc[set_data.label == 0].index.tolist()[:1]
    progress_counter(size,size,'points to cluster')
    while posible_points:
        if not posible_points:
            return        
        Points_in_Cluster = [posible_points[0]]
        has_neighbours = False
        while Points_in_Cluster:
            index = Points_in_Cluster.pop(0)
            p = set_data.loc[index,['x','y']].values.tolist()
            candidates = set_data.loc[((((set_data.x - p[0])**2) + ((set_data.y -p[1])**2))<epsilon**2) & (set_data.label==0)].index.tolist()
            neighbours = len(candidates)
            if neighbours > min_neighbours:
                for i in candidates:
                    if not i in Points_in_Cluster: Points_in_Cluster.append(i)
                set_data.at[index,'label'] = cluster_count
                has_neighbours = True
        if not has_neighbours:
            set_data.at[index,'label'] = -1
        else:
            cluster_count +=1
        posible_points = set_data.loc[set_data.label == 0].index.tolist()
        progress_counter(len(posible_points),size,'points to cluster')
        posible_points = posible_points[:1]
    progress_counter(size,size,'points to cluster')
    for cluster_label in range(1,cluster_count+1):
        progress_counter(cluster_label,cluster_count,'check for invalid clusters')
        cluster = set_data.loc[set_data.label==cluster_label,['x','y']].values.tolist()
        should_be_points = False
        if len(cluster)<=2:
            should_be_points = True
        elif not should_be_points:
            different_x = False
            different_y = False
            for i in range(len(cluster)-1):
                if cluster[i][1]!=cluster[i+1][1]: different_y = True
                if cluster[i][0]!=cluster[i+1][0]: different_x = True
            if not(different_x and different_y): should_be_points = True
        if should_be_points:
            for point in cluster:
                set_data.loc[(set_data.label==cluster_label) & (set_data.x==point[0]) & (set_data.y==point[1]),'label'] = -1
    cluster_labels = set(set_data.loc[set_data.label!=-1,'label'].values.tolist())
    counter = 1
    for label in cluster_labels:
        if counter != i:
            set_data.loc[set_data.label==label,'label'] = counter
        counter +=1
    cluster_labels = set(set_data.loc[set_data.label!=-1,'label'].values.tolist())
    cluster_count = counter-1

def DBSCAN(set_data):
    # 0 means not grouped in any Cluster, -1 means Noise, and everything else is a Cluster
    global cluster_count
    size = len(set_data.index)
    progress_bar(size,update='start',pre_text="starting BDSCAN")
    for i in range(len(set_data.index)):
        row = set_data.loc[i,['x','y','label']].values.tolist()
        progress_bar(size,update='update',pos=i)
        if row[2]!=0:
            continue
        # get all the Points that are inside the epsilon radius
        neighbours = list(set_data.loc[(((set_data.x - row[0])**2) + ((set_data.y -row[1])**2))<epsilon**2].index)
        if i in neighbours: neighbours.remove(i)
        if len(neighbours) < min_neighbours:
            set_data.at[i,'label'] = -1
            continue
        cluster_count += 1
        set_data.at[i,'label'] = cluster_count
        while 0<len(neighbours):
            index = neighbours.pop(0)
            label = set_data.at[index,'label']
            if label == -1:
                set_data.at[index,'label'] = cluster_count
            elif label !=0:
                continue
            set_data.at[index,'label'] = cluster_count
            pot_points = list(set_data.loc[(((set_data.x - row[0])**2) + ((set_data.y -row[1])**2))<epsilon**2].index)
            if min_neighbours <= len(pot_points):
                for j in pot_points:
                    if j not in neighbours: neighbours.append(j)
    progress_bar(size,update='end')        

def draw_grid(draw,width,height):
    spacer_x=width/(lines_x+1)
    spacer_y=height/lines_y
    for i in range(1,(lines_x+1)):
        draw.line((round(spacer_x*i),0,round(spacer_x*i),height), fill=grid_color)
    for i in range(1,(lines_y+1)):
        draw.line((0,round(spacer_y*i),width,round(spacer_y*i)), fill=grid_color)

def d(p1,p2):
    return ((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)**.5

def generate_polygons(points):
    if len(points)<=3:
        return range(len(points))
    triangle_list = {}
    # generate a distance map that can be used with indizes
    distance_list={}
    used = []
    for p1 in range(len(points)):
        used.append(p1)
        for p2 in range(len(points)):
            if p2 in used:
                continue
            dist = d(points[p1],points[p2])
            distance_list.update({tuple(sorted([p1,p2])):dist})
    # generate Triangles
    for p1 in range(len(points)):
        neighbours = []
        min_dist = [float("inf"),float("inf")]
        min_point = [None,None]
        # find neighbours
        for p2 in range(len(points)):
            if p1==p2:
                continue
            dist = distance_list.get(tuple(sorted([p1,p2])),float("inf"))
            if dist <= min_dist[0]:
                min_dist[1] = min_dist[0]
                min_dist[0] = dist
                min_point[1] = min_point[0]
                min_point[0] = p2
            elif dist <= min_dist[1]:
                    min_dist[1] = dist
                    min_point[1] = p2
            if distant_to_neighbours <= dist:
                neighbours.append(p2)
        if len(neighbours)==2:
            neighbours.append(min_point[1])
        elif len(neighbours)==1:
                neighbours.append(min_point[0])
                neighbours.append(min_point[1])
        if None in neighbours:
            print(neighbours)
            print(points)
        # triangles
        min_dist = [float("inf"),float("inf")]
        min_point = [None,None]
        at_least_a_triangle = False
        for n1 in neighbours:
            for n2 in neighbours:
                if n1 == n2:
                    continue
                dist = distance_list.get(tuple(sorted([p1,p2])),float("inf"))
                if dist <= min_dist[0]:
                    min_dist[1] = min_dist[0]
                    min_dist[0] = dist
                    min_point[1] = min_point[0]
                    min_point[0] = n2
                elif dist <= min_dist[1]:
                    min_dist[1] = dist
                    min_point[1] = n2
                if dist <= distant_to_neighbours:
                    at_least_a_triangle = True
                    triangle = tuple(sorted([p1,n1,n2]))
                    triangle_list.update({triangle:triangle})
        if not at_least_a_triangle:
            triangle = tuple(sorted([p1,min_point[0],min_point[1]]))
            triangle_list.update({triangle:triangle})
    triangles = triangle_list.values()
    return triangles

def draw_clusters(draw,pandas_data):
    global cluster_count
    for cluster_label in range(1,cluster_count):
        progress_counter(cluster_label,cluster_count,'    Clusters left to draw')
        # color
        cluster_color_str =  pandas_data.loc[pandas_data.label==cluster_label,'color'].values.tolist()[0]
        cluster_color = tuple(map(lambda x: int(x),cluster_color_str.split(",")))
        # get the clusters
        cluster = pandas_data.loc[pandas_data.label==cluster_label,['x','y']].values.tolist()
        cluster_length = len(cluster)
        if 3==cluster_length:
            hull = (ConvexHull(cluster))
            hull_indices = hull.vertices
            hull_points = list(map(lambda x:(cluster[x][0],cluster[x][1]),hull_indices))
            draw.polygon(hull_points,cluster_color)
            continue
        triangles = generate_polygons(cluster)
        for triangle in triangles:
            hull_points = list(map(lambda x:(cluster[x][0],cluster[x][1]),triangle))
            draw.polygon(hull_points,cluster_color)

def visualize_data(set_data,pandas_data,name='test'):
    debug = True
    width = picture_width
    span_x,span_y = bounds
    height = round((width*span_y)/span_x)

    # add a colour column and give every cluster its one color
    set_data['color'] = '255,255,255'
    pandas_data['color'] = '255,255,255'
    cluster_labels = set(set_data.loc[set_data.label!=-1,'label'].values.tolist())
    for i in cluster_labels:
        cluster_color = ','.join((str(randint(100,255)),str(randint(100,255)),str(randint(100,255))))
        set_data.loc[set_data.label==i,'color'] = cluster_color

    img = Image.new(mode="RGB",size=(width,height),color=background_color)
    draw = ImageDraw.Draw(img)

    draw_grid(draw,width,height)
    draw_clusters(draw,set_data)

    print('data:')
    print('    clustercount:%i'%cluster_count)
    # print('    ')
    if debug:
        img.transpose(Image.Transpose.FLIP_TOP_BOTTOM).show()
    else:
        img.transpose(Image.Transpose.FLIP_TOP_BOTTOM).save(Path(Path(__file__).resolve().parent)/'data'/name)

def clustering(file_path):
    print('step 1/4: creating and modifying dataset')
    pandas_data = pandas.read_csv(file_path)
    if pandas_data.empty:
        return False
    set_data = pandas_data.drop_duplicates(subset=['x', 'y'], keep='first').reset_index()[["x","y","label"]]
    print('step 2/4: Clustering algorithm')
    modified_DBSCAN(set_data)
    #DBSCAN(set_data)
    print('step 3/4: data reformating')
    length = len(set_data.index)
    for i in range(length):
        row = set_data.loc[i,['x','y','label']].values.tolist()
        pandas_data.loc[pandas_data.x-row[0]+pandas_data.y-row[1]==0,'label'] = row[2]
        progress_counter(length-i,length)
    print('step 4/4: visualizing')
    visualize_data(set_data,pandas_data)