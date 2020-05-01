require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()
local exampleSize = 100

--[[
    GravyUI can be extended easily.

    Simply add a function to the GravyUI
    namespace and it will be available
    on every node. The first parameter
    is always the node being manipulated.

    In the following example we create
    a simple helper to make two rows,
    and a more complex example to create
    a radial menu around those.
]]

function main() 
    local node = Node(exampleSize, exampleSize):offset(x/2 - exampleSize/2, y/2 - exampleSize/2)

    local row = {node:tworows()}
    
    DrawRect(row[1], "white")
    DrawRect(row[2], "red")

    DrawRects("blue", node:resize(20, 20):orbit(1, 10))
    DrawRects("green", node:resize(10, 10):orbit(1.5, 15))
    DrawRects("yellow", node:resize(5, 5):orbit(2, 20))
    
end


--[[
    A simple extension.
]]
function GravyUINode.tworows(node)
    return node:rows(2)
end


--[[ 
    A more complex extension.

    Nodes also contain references to
    their parents, and any existing
    children.

    This can can allow for some cool,
    complex patterns when layered
    together.
]]
function GravyUINode:orbit(distanceRatio, count, shift)
    local nodes = {};
    local angleEach = 2 * math.pi / count
    for i=1,count do
        local angle = angleEach * (i - 1)
        if shift then angle = angle + shift end
        local xs = distanceRatio * self.parentNode.rect.width
        local ys = distanceRatio * self.parentNode.rect.height
        table.insert(nodes, self:radial(angle, xs, ys))
    end
    return unpack(nodes)
end