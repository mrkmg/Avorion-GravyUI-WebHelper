require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()
local width, height = 300, 300

local window = Node(width, height):offset(x/2-width/2, y/2-height/2)
local title, body, buttons = window:pad(5):rows({40, 1, 40}, 5)
buttons = {buttons:pad(2/5, 0, 0, 0):cols(2, 10)}

Display(window)
Display(title, "red")
Display(body, "green")
Display(buttons[1], "orange")
Display(buttons[2], "orange")