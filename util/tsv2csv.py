#!/usr/bin/env python

import sys, os, csv

def tsv2csv(filename):
  infile = open(filename, 'r')
  csv.register_dialect('tsv', delimiter='\t', quoting=csv.QUOTE_NONE)
  reader = csv.reader(infile, 'tsv')
  writer = csv.writer(sys.stdout)
  writer.writerows(reader)
    

def main():
  argv = sys.argv[1:]
  
  if len(argv) != 1:
    print """
    Converts input file from tab separated to comma seperated.
    
    Usage: %s infile
    Example: %s equipment.dat > equipment.csv
    """ % (sys.argv[0], sys.argv[0])
    sys.exit(1)

  try:
    infile = argv.pop(0)
  except:
    print "error: bad input"
    sys.exit(1)
  
  print tsv2csv(infile)

if __name__ == '__main__':
  main()