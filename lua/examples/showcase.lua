require 'lib'
local Node = include("gravyui/node")
-- get resolution of canvas area
local x, y = getResolution()
local reverse = y > x
local examplesGrid, ex, nodeAt, display
local numExamples = 7

--[[
    This script demos all the methods
    currently available in GravyUI.
]]

function main()
    if reverse then
        -- grid is 5 rows, 3 columns
        examplesGrid = {Node(x, y):pad(20):grid(numExamples, 3, 20, 20)}
    else
        -- grid is 3 rows, 5 columns
        examplesGrid = {Node(x, y):pad(20):grid(3, numExamples, 20, 20)}
    end    

    -- Examples of cols
    DrawRects("green", nodeAt(1, 1):cols(4, 10))
    DrawRects("green", nodeAt(1, 2):cols({50, 1/4, 3/4}, 10))
    DrawRects("green", nodeAt(1, 3):cols({50, 1}))

    -- Examples of rows
    DrawRects("red", nodeAt(2, 1):rows(4, 10))
    DrawRects("red", nodeAt(2, 2):rows({30, 1/4, 3/4}, 10))
    DrawRects("red", nodeAt(2, 3):rows({50, 1}))

    -- Examples of grid
    DrawGridRects("blue", nodeAt(3, 1):grid(7, 3, 5, 10))
    DrawGridRects("blue", nodeAt(3, 2):grid({1/3, 2/3}, {20, 1/5, 1/5, 1/5, 1/5, 1/5, 20}, 10, 5))
    DrawGridRects("blue", nodeAt(3, 3):grid({1/4, 2/4, 1/4}, {1/4, 2/4, 1/4}, 10, 5))

    -- Examples of offset
    DrawRect(nodeAt(4, 1):offset(5, 5), "orange")
    DrawRect(nodeAt(4, 2):offset(-5, -5), "orange")
    DrawRect(nodeAt(4, 3):offset(0, 5), "orange")

    -- Examples of scale
    DrawRect(nodeAt(5, 1):scale(.75), "navy")
    DrawRect(nodeAt(5, 2):scale(1.2), "navy")
    DrawRect(nodeAt(5, 3):scale(.9, 1.1), "navy")

    -- Examples of pad
    DrawRect(nodeAt(6, 1):pad(20), "purple")
    DrawRect(nodeAt(6, 2):pad(1/5, 1/10), "purple")
    DrawRect(nodeAt(6, 3):pad(5, 10, 15, 20), "purple")

    -- Examples of radial and resize
    DrawRect(nodeAt(7, 1):resize(20, 20):radial(math.pi/3, 20), "yellow")
    DrawRect(nodeAt(7, 2):resize(5, 20):radial(4*math.pi/3, 40), "yellow")
    DrawRect(nodeAt(7, 3):resize(30, 10):radial(degToPad(130), 20), "yellow")
end

function degToPad(degrees)
    return degrees/180 * math.pi
end

function nodeAt(x, y)
    if reverse then
        return examplesGrid[x][y]
    else
        return examplesGrid[y][x]
    end 
end
