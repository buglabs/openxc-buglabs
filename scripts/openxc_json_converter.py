import fileinput
import argparse
import os

parser = argparse.ArgumentParser()
parser.add_argument("input_filename")
args = parser.parse_args()

def univ_file_read(name,mode):
    return open(name,'rU')

fout = open("%s_VALIDATED.json" % os.path.splitext(args.input_filename)[0],"wb")
data = fileinput.input(args.input_filename,openhook=univ_file_read)
for idx,val in enumerate(data):
  if val[-1:] == '\n':
      val = val[:-1]
  if idx==0:
    val = '['+val
  else:
    val = ','+val
  fout.write(val)

fout.write("]")
fout.close()  
