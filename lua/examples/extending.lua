require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()

GravyUINode.tworows = function(node)
    return node:rows(2)
end

local node = Node(100, 100):offset(x/2 - 50, y/2 - 50)
local row = {node:tworows()}
Display(row[1], "green")
Display(row[2], "red")