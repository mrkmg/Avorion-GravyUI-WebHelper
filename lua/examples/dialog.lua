require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()

--[[
    A very functional and practical
    example of how to use GravyUI.

    This simple title, body, and
    buttons layout can be scaled and 
    transformed for a variety of
    dialog uses.
]]
function main() 
    local width, height = 300, 300
    local window = Node(width, height):offset(x/2-width/2, y/2-height/2)
    local title, body, buttons = window:pad(5):rows({40, 1, 40}, 5)
    buttons = {buttons:pad(2/5, 0, 0, 0):cols({2/5, 3/5}, 10)}

    DrawRect(window, "white")
    DrawText(title, "Title", 40)
    DrawText(body, "This is where the body would go.")
    DrawRect(buttons[1], "#A00")
    DrawText(buttons[1], "Cancel", "white")
    DrawRect(buttons[2], "#070")
    DrawText(buttons[2], "Continue", "white")

    -- Display("Title", title, "red")
    -- Display("Body", body, "green")
    -- Display("Cancel", buttons[1], "orange")
    -- Display("Continue", buttons[2], "orange")
end