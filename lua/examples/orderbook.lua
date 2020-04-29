require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()
local width, height = 400, 420
local pageSize = 10

local root = Node(width, height):offset(x/2 - width/2, y/2 - height/2)
local paddedRoot = root:pad(10)
local top, middle, bottom = paddedRoot:rows({60, 1, 35}, 10)
top = {top:grid(2, 2, 5, 5)}
local chainTable, chainNextPrev = middle:rows({1, 25}, 10)
chainTable = {chainTable:grid(pageSize, {3/5, 2/25, 2/25, 2/25, 2/25, 2/25}, 5, 2)}
chainNextPrev = {chainNextPrev:cols(2, 1/4)}
bottom = {bottom:pad(0, 12, 0, 0):cols({1/4, 3/8, 3/8}, 10)}

Display(root)
Display(top[1][1], "red")
Display(top[1][2], "red")
Display(top[2][1], "green")
Display(top[2][2], "green")
for i=1,pageSize do
    Display(chainTable[i][1], "darkmagenta")
    Display(chainTable[i][2], "darkmagenta")
    Display(chainTable[i][3], "darkmagenta")
    Display(chainTable[i][4], "darkmagenta")
    Display(chainTable[i][5], "darkmagenta")
    Display(chainTable[i][6], "darkmagenta")
end
Display(chainNextPrev[1], "orange")
Display(chainNextPrev[2], "orange")
Display(bottom[1], "darkgrey")
Display(bottom[2], "lightgrey")
Display(bottom[3], "lightgrey")