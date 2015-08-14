import fileinput
import argparse
import json
import os

parser = argparse.ArgumentParser()
parser.add_argument("input_filename")
parser.add_argument('-s', action='append', dest='target_signals',
    default=[])
args = parser.parse_args()

#print os.path.splitext(args.input_filename)[0]
fout = open("%s_STRIPPED.json" % os.path.splitext(args.input_filename)[0],"wb")
with open(args.input_filename) as data_file:
    data = json.load(data_file)
    fout.write('[')
    i = 0
    for idx,val in enumerate(data):
        if ('name' in val) and (val['name'] in args.target_signals):
            if i==0:
                fout.write(json.dumps(val))
                i+=1
            else:
                fout.write(','+json.dumps(val))
        
    fout.write(']')