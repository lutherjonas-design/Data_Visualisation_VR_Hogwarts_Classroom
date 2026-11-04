from bib_walk_map import generate_walk_map as gen_walk
from bib_clustering import clustering
from bib_clustering import convert_data_to_csv as to_csv
from pathlib import Path
from json import loads as jsloads

def convert_data_to_csv(file_path,save_path,bounds):
    to_csv(file_path,save_path,bounds)

def generate_walk_map(data,bounds,name='data_visualization',debug=False):
    gen_walk(data,bounds,name,debug)

def gen_Clusters(file_path):
    clustering(file_path)

def borders(data):
    # try to open the file, the content will be inside of the data variable
    if data:
        # get the min and max Value, of the traveled Path, only look at every
        # second line, because one line is position and the other is for the line of light
        line = jsloads(data[0])
        span_x = {"t":line["x"],"b":line["x"]}
        span_y = {"t":line["z"],"b":line["z"]}
        for i in range(2,len(data),2):
            line = jsloads(data[i])
            if(span_x["t"]>line["x"]):
                span_x["t"] = line["x"]
            elif(span_x["b"]<line["x"]):
                span_x["b"] = line["x"]
            if(span_y["t"]>line["z"]):
                span_y["t"] = line["z"]
            elif(span_y["b"]<line["z"]):
                span_y["b"] = line["z"]
        return span_x,span_y
    return None