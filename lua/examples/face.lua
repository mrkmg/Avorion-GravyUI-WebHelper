require 'lib'
local Node = include("gravyui/node")
local x, y = getResolution()
local w, h = 250, 200

--[[
    A fun little example of outside
    the box thinking, uaing many of
    the features of GravyUI
]]
function main(frame)
    sprint("Frame", frame)
    local face = Node(w, h):offset(x/2 - w/2, y/2 - h/2)
    local eyes, nose, mouth = face:pad(20, 40):rows({1/6, 2/3, 1/6}, 10)
    
    local l = (frame % 180) / 90
    if l > 1 then l = 2 - l end;
    l = l - .5

    DrawRect(face, "#FFFF88")
    drawEyes(eyes, l)
    drawNose(nose)
    drawMouth(mouth, frame % 90 > 45)
    return true
end

function drawEyes(eyes, look)
    local distanceBetween = eyes.rect.width * .45
    local leftEye = eyes:resize(30, 20):offset(-distanceBetween/2, 0)
    local rightEye = leftEye:offset(distanceBetween, 0)
    DrawRect(leftEye, "white")
    DrawRect(leftEye:resize(7, 7):offset(look, 3), "blue")
    DrawRect(rightEye, "white")
    DrawRect(rightEye:resize(7, 7):offset(look, 3), "blue")

end

function drawNose(nose)
    nose = nose:pad(.42, 10)
    DrawRect(nose, "orange")
end

function drawMouth(mouth, open)
    if (open) then
        local topLip, teeth, bottomLip = mouth:scale(.75, 1):rows({1/4,1/2,1/4})
        DrawRect(topLip, "red")
        DrawRect(bottomLip, "red")
        teeth = {teeth:grid(2, 24)}
        for r=1,#teeth do
            for c=1,#teeth[r] do
                DrawRect(teeth[r][c], "white")
            end
        end
    else
        local topLip, bottomLip = mouth:scale(.75, .8):rows(2);
        DrawRect(topLip, "red")
        DrawRect(bottomLip, "red")
    end
    

end