require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()
local width, height = 300, 300

--[[
    GravyUI never mutates existing nodes,
    so feel free to reuse a node multiple
    times.
]]

local window = Node(width, height):offset(x/2 - width/2, y/2 - height/2)
local left = window:pad(0, 0, 2/3, 1/3)
local top = window:pad(1/3, 0, 0, 2/3)
local right = window:pad(2/3, 1/3, 0, 0)
local bottom = window:pad(0, 2/3, 1/3, 0)
local middle = window:pad(1/3)

Display(window)
Display(left, "red")
Display(top, "green")
Display(right, "blue")
Display(bottom, "yellow")
Display(middle, "purple")