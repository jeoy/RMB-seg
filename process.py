import json

file1 = open('result.txt','r')
lines = file1.readlines()
for line in lines:
    line = line.strip()
    data = json.loads(line)
    for i in range(len(data)):
        if (data[i]['count'] > 1):
            for j in range(data[i]['count']):
                f = open('%s###%d.5pt'%(data[i]['fileName'][:-4],j),'wb')
                f.write('5'+'\n')
                print data[i]['mark_pt']
                f.write( str(data[i]['mark_pt'][j*5]).strip('[').strip(']')+'\n')
                f.write( str(data[i]['mark_pt'][j*5+1]).strip('[').strip(']')+'\n')
                f.write( str(data[i]['mark_pt'][j*5+2]).strip('[').strip(']')+'\n')
                f.write( str(data[i]['mark_pt'][j*5+3]).strip('[').strip(']')+'\n')
                f.write( str(data[i]['mark_pt'][j*5+4]).strip('[').strip(']')+'\n')
                f.close()
        elif(data[i]['count'] == 1):
            f = open('%s.5pt'%data[i]['fileName'][:-4],'wb')
            f.write('5'+'\n')
            f.write( str(data[i]['mark_pt'][0]).strip('[').strip(']')+'\n')
            f.write( str(data[i]['mark_pt'][1]).strip('[').strip(']')+'\n')
            f.write( str(data[i]['mark_pt'][2]).strip('[').strip(']')+'\n')
            f.write( str(data[i]['mark_pt'][3]).strip('[').strip(']')+'\n')
            f.write( str(data[i]['mark_pt'][4]).strip('[').strip(']')+'\n')
            f.close()
        else:
            continue

           
