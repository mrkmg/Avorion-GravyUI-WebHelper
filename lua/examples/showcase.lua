require 'lib'
local Node = include("gravyui/node")

--[[
    This script demos all the methods
    currently available in GravyUI.
]]

-- get resolution of canvas area
local x, y = getResolution()
local reverse = y > x
local examplesGrid, ex, exp, display

function main()
    if reverse then
        -- grid is 5 rows, 3 columns
        examplesGrid = {Node(x, y):pad(20):grid(5, 3)}
    else
        -- grid is 3 rows, 5 columns
        examplesGrid = {Node(x, y):pad(20):grid(3, 5)}
    end
    

    -- Examples of cols
    displayNodes(ex(1, 1), {exp(1, 1):cols(4, 10)}, "green")
    displayNodes(ex(1, 2), {exp(1, 2):cols({50, 1/4, 3/4}, 10)}, "green")
    displayNodes(ex(1, 3), {exp(1, 3):cols({100, 1})}, "green")

    -- Examples of rows
    displayNodes(ex(2, 1), {exp(2, 1):rows(4, 10)}, "red")
    displayNodes(ex(2, 2), {exp(2, 2):rows({50, 1/4, 3/4}, 10)}, "red")
    displayNodes(ex(2, 3), {exp(2, 3):rows({100, 1})}, "red")

    -- Examples of grid
    displayNodesLoop(ex(3, 1), {exp(3, 1):grid(6, 3, 5, 10)}, "blue")
    displayNodesLoop(ex(3, 2), {exp(3, 2):grid({1/3, 2/3}, {100, 1/5, 1/5, 1/5, 1/5, 1/5, 20}, 10, 5)}, "blue")
    displayNodesLoop(ex(3, 3), {exp(3, 3):grid({1/4, 2/4, 1/4}, {1/4, 2/4, 1/4}, 10, 5)}, "blue")

    -- Examples of offset
    Display(ex(4, 1), "white")
    Display(exp(4, 1):offset(5, 5), "orange")
    Display(ex(4, 2), "white")
    Display(exp(4, 2):offset(-5, -5), "orange")
    Display(ex(4, 3), "white")
    Display(exp(4, 3):offset(0, 5), "orange")

    -- Examples of pad
    Display(ex(5, 1), "white")
    Display(exp(5, 1):pad(20), "purple")
    Display(ex(5, 2), "white")
    Display(exp(5, 2):pad(1/5, 1/10), "purple")
    Display(ex(5, 3), "white")
    Display(exp(5, 3):pad(5, 10, 15, 20), "purple")

end

-- Helper functions to display nodes
function displayNodesLoop(root, nodes, color)
    Display(root, "white")
    for _, a in ipairs(nodes) do
        displayNodes(nil, a, color)
    end
end

function displayNodes(root, nodes, color)
    if root ~= nil then
        Display(root, "white")
    end
    for _, a in ipairs(nodes) do
        Display(a, color)
    end
end

if reverse then
    function ex(x, y) return examplesGrid[x][y]:pad(5) end
    function exp(x, y) return examplesGrid[x][y]:pad(10) end
else
    function ex(x, y) return examplesGrid[y][x]:pad(5) end
    function exp(x, y) return examplesGrid[y][x]:pad(10) end
end

main()