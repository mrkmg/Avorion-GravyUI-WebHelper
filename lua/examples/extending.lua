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
]]
function GravyUINode.tworows(node)
    return node:rows(2)
end

local node = Node(exampleSize, exampleSize):offset(x/2 - exampleSize/2, y/2 - exampleSize/2)
local row = {node:tworows()}
Display(row[1], "green")
Display(row[2], "red")

--[[ 
    Nodes also contain references to
    their parents, and any existing
    children.

    This can can allow for some cool,
    complex patterns when latered
    together.
]]
function GravyUINode.orbit(node, distanceRatio, count, shift)
    local nodes = {};
    local angleEach = 2 * math.pi / count
    for i=1,count do
        local angle = angleEach * (i - 1)
        if shift then angle = angle + shift end
        local xs = distanceRatio * node.parentNode.rect.width * math.sin(angle)
        local ys = distanceRatio * node.parentNode.rect.height * math.cos(angle)
        table.insert(nodes, node:offset(xs, ys))
    end
    return unpack(nodes)
end

local orbitTestRoot = Node(exampleSize, exampleSize):offset(x/2 - exampleSize/2, y/2 - exampleSize/2)

local orbitNodes = {orbitTestRoot:pad(exampleSize*.4):orbit(1, 9)}
for _,orbitNode in ipairs(orbitNodes) do
    Display(orbitNode, "blue")
end

local orbitNodes = {orbitTestRoot:pad(exampleSize*.4):orbit(1.5, 14)}
for _,orbitNode in ipairs(orbitNodes) do
    Display(orbitNode, "yellow")
end

local orbitNodes = {orbitTestRoot:pad(exampleSize*.4):orbit(2, 20)}
for _,orbitNode in ipairs(orbitNodes) do
    Display(orbitNode, "magenta")
end