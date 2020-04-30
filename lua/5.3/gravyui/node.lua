package.path = package.path .. ";data/scripts/lib/?.lua"

--== Library ==--

GravyUINode = {
    ---- @type Rect
    rect = nil,
    parentNode = nil,
    childNodes = {}
}
GravyUINode.__index = GravyUINode

local function new(width, height)
    if height ~= nil then
        width = Rect(vec2(0, 0), vec2(width, height))
    end
    return setmetatable({rect = width, children = {}}, GravyUINode)
end

function GravyUINode:child(rect)
    local child = new(rect)
    child.parentNode = self
    table.insert(self.childNodes, child)
    return child
end

include("gravyui/plugins/resizing")
include("gravyui/plugins/translating")
include("gravyui/plugins/splitting")

return setmetatable({new = new}, {__call = function(_, ...) return new(...) end})