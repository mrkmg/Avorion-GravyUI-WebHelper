require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()

--[[
    A fun little example of outside
    the box thinking.
]]

local w, h = 200, 200
local face = Node(w, h):offset(x/2 - w/2, y/2 - h/2)
local eyes, nose, mouth = face:pad(20, 40):rows({1/6, 2/3, 1/6}, 10)
eyes = {eyes:pad(1/8, 0):cols(2, 1/2)}
nose = nose:pad(2/5, 10)
mouthRows = {mouth:rows({1/4,1/2,1/4})}
teeth = {mouthRows[2]:grid(2, 10)}

Display(face, "yellow")
Display(eyes[1], "white")
Display(eyes[1]:pad(7), "blue")
Display(eyes[2], "white")
Display(eyes[2]:pad(7), "blue")
Display(nose, "orange")
Display(mouthRows[1], "red")
for r=1,#teeth do
    for c=1,#teeth[r] do
        Display(teeth[r][c])
    end
end
Display(mouthRows[3], "red")