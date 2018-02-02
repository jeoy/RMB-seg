import json

file1 = open('result.json', 'r')

data = json.load(file1)

def arr2str(arr):
    return str(arr).strip('[').strip(']') + '\n'

# length === 2
def arr2str2(arr):
    return str(arr[0]) + ', ' + str(arr[1]) + '\n'

#  length === n
def arr2str3(arr):
    result = ''
    for i in range(len(arr) - 1):
        result += str(arr[i]) + ', ' + str(arr[i + 1]);
    result += '\n'
    return result


for i in range(len(data)):
    data_count = data[i]['count']
    if (data_count > 1):
        for j in range(data_count):
            f = open('%s###%d.5pt'%(data[i]['fileName'][:-4], j), 'wb')
            print data[i]['mark_pt'][j*5]
            steamin = '5' + '\n'
            for index in range(5):
                steamin += arr2str3(data[i]['mark_pt'][j * 5 + index])
            f.write(steamin)
            f.close()
    elif(data_count == 1):
        f = open('%s.5pt'%data[i]['fileName'][:-4], 'wb')
        steamin = '5' + '\n'
        for index in range(5):
            steamin += arr2str3(data[i]['mark_pt'][index])
        f.write(steamin)
        f.close()
    else:
        continue
