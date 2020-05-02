require 'lib'
local Node = include("gravyui/node")

--[[
    In Progress re-work of the trading UI
]]

for i=1,6 do _G["i"..i] = i/40 end

function main() 
    local rows = 15
    local w, h = 800, 600
    local x, y = getResolution()

    -- Create all the nodes
    local window = Node(w, h):offset(x/2 - w/2, y/2 - h/2)
    local table, _, footer = window:pad(10):rows({1, 20, 20})
    local colSizes = {i1, i3, i3, i3, i6, i3, i1, i3, i3, i3, i6, i3, i1}
    local tableGrid = {table:grid(rows + 1, colSizes, 7, 10)}

    -- Draw the nodes
    DrawRect(window, bgColor)
    DrawHeader(tableGrid[1])
    for i=2,rows+1 do
        DrawRow(tableGrid[i])
    end
    DrawFooter(footer:makePaging())
end

--[[
    An extension to make a pager.

    This splits the node into the columns,
    then the splits the middle into a 
    more columns for page buttons.
]]
function GravyUINode:makePaging()
    local pagesWidth = self.rect.width - 150
    local pagesCols = math.floor(pagesWidth / self.rect.height/3)
    local pagesMargin = (pagesWidth - pagesCols*self.rect.height)/(pagesCols - 1) / 2
    local prev, pages, next = self:cols({50, 1, 50}, 25 + pagesMargin*2)
    pages = {pages:cols(pagesCols, pagesMargin)}
    return prev, pages, next
end

--[[
    Draw Functions
]]

FONTCOLOR="white"
bgColor = "#333333"
rowBgColor = "#222222"
btnBgColor = "#555555"

function DrawHeader(tblRow)
    fillRow(tblRow, {
        nil, "Cr", "Coord", "Stock", "From", "Profit", 
        nil, "Cr", "Coord", "Wants", "To", "You", nil
    })
end

function DrawRow(tblRow)
    DrawRect(tblRow[1].parentNode, rowBgColor)
    fillRow(tblRow, {
        "✨", "$999,999m", "(-999,-999)", "999,999", "Building Name", "999,999m",
        nil, "$999,999", "(-999,-999)", "999,999", "Building Name", "999,999",
        nil
    })
    DrawRect(tblRow[7], btnBgColor)
    DrawText(tblRow[7], "P")
    DrawRect(tblRow[13], btnBgColor)
    DrawText(tblRow[13], "P")
end

function DrawFooter(prev, pages, next)
    DrawRect(prev, btnBgColor)
    DrawText(prev, "<")
    DrawRect(next, btnBgColor)
    DrawText(next, ">")

    for i,node in ipairs(pages) do
        DrawRect(node, btnBgColor)
        DrawText(node, i)
    end
end

function fillRow(row, labels)
    for i,node in ipairs(row) do
        if labels[i] ~= nil then
            DrawTextL(node, labels[i])
        end
    end
end