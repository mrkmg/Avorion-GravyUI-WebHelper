require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()

--[[
    GravyUI never mutates existing nodes,
    so feel free to reuse a node multiple
    times.
]]

function main()
    windmill(300, 300, .2)
    -- windmill(200, 300, .3)
    -- windmill(300, 200, .6)
    -- windmill(300, 300, .8)
end

function windmill(width, height, ratio)
    local wRatioSide = width/2 - width*ratio/2
    local hRatioSide = height/2 - height*(1-ratio)/2
    local wRatioTb = width/2 - width*(1-ratio)/2
    local hRatioTb = height/2 - height*ratio/2

    local window = Node(width, height):offset(x/2 - width/2, y/2 - height/2)
    local sideNode = window:scale(ratio, 1-ratio)
    local tbNode = window:scale(1-ratio, ratio)

    local left = sideNode:offset(-wRatioSide, -hRatioSide)
    local top = tbNode:offset(wRatioTb, -hRatioTb)
    local right = sideNode:offset(wRatioSide, hRatioSide)
    local bottom = tbNode:offset(-wRatioTb, hRatioTb)
    local middle = window:pad(ratio)

    DrawRect(window)
    DrawRect(left, "red")
    DrawRect(top, "green")
    DrawRect(right, "blue")
    DrawRect(bottom, "yellow")
    DrawRect(middle, "purple")
end