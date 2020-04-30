require 'lib'

-- Set the default font color
FONTCOLOR="white"

local Node = include("gravyui/node")
local x, y = getResolution()
local width, height = 400, 420
local pageSize = 10

--[[
    This is an example of how consice, yet flexible the
    GravyUI layout system can be.
]]

function main()
    local root = Node(width, height):offset(x/2 - width/2, y/2 - height/2)
    local top, middle, bottom = root:pad(10):rows({60, 1, 35}, 10)
    top = {top:grid(2, 2, 5, 5)}
    local chainTable, chainNextPrev = middle:rows({1, 25}, 10)
    chainTable = {chainTable:grid(pageSize, {3/5, 2/25, 2/25, 2/25, 2/25, 2/25}, 5, 2)}
    chainNextPrev = {chainNextPrev:cols(2, 1/4)}
    bottom = {bottom:pad(0, 12, 0, 0):cols({1/4, 3/8, 3/8}, 10)}


    --[[ 
        The following is the actual code in avorion 
        which creates a window in the Galaxy Map view.

        Each node created above contains a "rect"
        which can be passed into the createElement
        methods.

        At the time of writing, all the window elements
        in Avorion are capable of taking a rect for
        their position and size.
    ]]
    if (false) then -- do not execute, its just for example
        local res = getResolution()
        local windowRect = root:offset(res.x - root.rect.width - 5, res.y / 2 - root.rect.height / 2).rect
        mainWindow = GalaxyMap():createWindow(windowRect)
        mainWindow:createValueComboBox(top[1][1].rect, "loadGo")
        mainWindow:createTextBox(top[1][2].rect, "renderMainWindow")
        mainWindow:createButton(top[2][1].rect, "Delete Book", "deleteGo")
        mainWindow:createButton(top[2][2].rect, "Write Book", "writeGo")
        mainWindow:createButton(chainNextPrev[1].rect, "Previous Page", "writePageBack")
        mainWindow:createButton(chainNextPrev[2].rect, "Next Page", "writePageNext")
        mainWindow:createCheckBox(bottom[1].rect, "Sync", "syncChanged")
        mainWindow:createButton(bottom[2].rect, "Load Orders", "loadFromSelected")
        mainWindow:createButton(bottom[3].rect, "Replace Orders", "applyOrders")
        
        for i = 1,pageSize do
            mainWindow:createLabel(chainTable[i][1].rect, "", 14)
            mainWindow:createCheckBox(chainTable[i][2].rect, "", "chainRelativeJumpChanged")
            mainWindow:createButton(chainTable[i][3].rect, "", "chainMoveUpGo")
            mainWindow:createButton(chainTable[i][4].rect, "", "chainMoveDownGo")
            mainWindow:createButton(chainTable[i][5].rect, "", "chainEditShow")
            mainWindow:createButton(chainTable[i][6].rect, "", "chainDeleteGo")
        end
    end


    --[[
        The following displays the rects on the
        canvas to the right.
    ]]

    local inputColor = "rgba(0, 0, 0, .4)"
    local buttonColor = "rgba(255, 255, 255, .4)"
    local fontColor = "white"
    DrawRect(root, "#2266AA")
    DrawRect(top[1][1], inputColor)
    DrawText(top[1][1], "Saved Book Name")
    DrawRect(top[1][2], inputColor)
    DrawText(top[1][2], "New Book Name")
    DrawRect(top[2][1], buttonColor)
    DrawText(top[2][1], "Delete Book")
    DrawRect(top[2][2], buttonColor)
    DrawText(top[2][2], "Write Book")

    for i=1,pageSize do
        local orderName = "[" .. i .. "] Order";
        for ii=1,i-1 do
            orderName = orderName .. " Test"
        end
        DrawTextL(chainTable[i][1], orderName)
        DrawRect(chainTable[i][2], inputColor)
        DrawText(chainTable[i][2], "✔")
        DrawRect(chainTable[i][3], buttonColor)
        DrawText(chainTable[i][3], "▲")
        DrawRect(chainTable[i][4], buttonColor)
        DrawText(chainTable[i][4], "▼")
        DrawRect(chainTable[i][5], buttonColor)
        DrawText(chainTable[i][5], "✏")
        DrawRect(chainTable[i][6], buttonColor)
        DrawText(chainTable[i][6], "🗑")
    end

    DrawRect(chainNextPrev[1], buttonColor)
    DrawText(chainNextPrev[1], "Previous Page")
    DrawRect(chainNextPrev[2], buttonColor)
    DrawText(chainNextPrev[2], "Next Page")

    DrawText(bottom[1], "Sync")
    DrawRect(bottom[2], buttonColor)
    DrawText(bottom[2], "Load Orders")
    DrawRect(bottom[3], buttonColor)
    DrawText(bottom[3], "Replace Orders")
end
