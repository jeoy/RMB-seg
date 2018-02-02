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
                f.write( str(data[i]['mark_pt'][j*5])+'\n')
                f.write( str(data[i]['mark_pt'][j*5+1])+'\n')
                f.write( str(data[i]['mark_pt'][j*5+2])+'\n')
                f.write( str(data[i]['mark_pt'][j*5+3])+'\n')
                f.write( str(data[i]['mark_pt'][j*5+4])+'\n')
                f.close()
        elif(data[i]['count'] == 1):
            f = open('%s.5pt'%data[i]['fileName'][:-4],'wb')
            f.write('5'+'\n')
            f.write( str(data[i]['mark_pt'][0])+'\n')
            f.write( str(data[i]['mark_pt'][1])+'\n')
            f.write( str(data[i]['mark_pt'][2])+'\n')
            f.write( str(data[i]['mark_pt'][3])+'\n')
            f.write( str(data[i]['mark_pt'][4])+'\n')
            f.close()
        else:
            continue

           
