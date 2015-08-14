import fileinput
import argparse
import json
import os

parser = argparse.ArgumentParser()
parser.add_argument("input_filename")
args = parser.parse_args()

a = {}
t = {}

fout = open("%s_NORMALIZED.json" % os.path.splitext(args.input_filename)[0],"wb")
with open(args.input_filename) as data_file:
    data = json.load(data_file)
    for idx,val in enumerate(data):
        if idx==0:
            fout.write('[')
        if val['name'] not in t:
            t[val['name']] = val['timestamp']
            if idx==0:
                fout.write(json.dumps(val))
            else:
                fout.write(','+json.dumps(val))
        if val['name'] not in a:
            a[val['name']] = val['timestamp']
        else:
            if val['timestamp'] - a[val['name']] > 1:
                fout.write(','+json.dumps(val))
                a[val['name']] = val['timestamp']
    
    fout.write(']')


