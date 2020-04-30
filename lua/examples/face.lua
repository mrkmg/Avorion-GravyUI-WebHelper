require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()
local w, h = 250, 200

--[[
    A fun little example of outside
    the box thinking, uaing many of
    the features of GravyUI
]]
function main()
    local face = Node(w, h):offset(x/2 - w/2, y/2 - h/2)
    local eyes, nose, mouth = face:pad(20, 40):rows({1/6, 2/3, 1/6}, 10)
    
    DrawRect(face, "#FFFF88")
    drawEyes(eyes)
    drawNose(nose)
    drawMouth(mouth)
end

function drawEyes(eyes)
    local distanceBetween = eyes.rect.width * .45
    local leftEye = eyes:resize(30, 20):offset(-distanceBetween/2, 0)
    local rightEye = leftEye:offset(distanceBetween, 0)
    DrawRect(leftEye, "white")
    DrawRect(leftEye:resize(7, 7):offset(6, 3), "blue")
    DrawRect(rightEye, "white")
    DrawRect(rightEye:resize(7, 7):offset(6, 3), "blue")

end

function drawNose(nose)
    nose = nose:pad(.42, 10)
    DrawRect(nose, "orange")
end

function drawMouth(mouth)
    local topLip, teeth, bottomLip = mouth:scale(.75, 1):rows({1/4,1/2,1/4})
    teeth = {teeth:grid(2, 24)}

    DrawRect(topLip, "red")
    for r=1,#teeth do
        for c=1,#teeth[r] do
            DrawRect(teeth[r][c])
        end
    end
    DrawRect(bottomLip, "red")

end