function Rect(v1, v2)
    return {
        topLeft = v1,
        bottomRight = v2,
        width = v2.x - v1.x,
        height = v2.y - v1.y,
        center = vec2(v1.x + (v2.x - v1.x)/2, v1.y + (v2.y - v1.y)/2)
    }
end

local Vec2 = {x = 0, y = 0}
Vec2.__index = Vec2
function Vec2:new(o, x, y)
    o = o or {}
    setmetatable(o, self)
    o.x = x
    o.y = y
    return o
end
function Vec2:__add(b)
    return vec2(self.x + b.x, self.y + b.y)
end

function Vec2:__sub(b)
    return vec2(self.x - b.x, self.y - b.y)
end

function vec2(x, y)
    return Vec2:new(nil, x, y)
end

function include(p)
    return require(p)
end

function round(num, idp)
    local mult = 10^(idp or 0)
    if num >= 0 then return math.floor(num * mult + 0.5) / mult
    else return math.ceil(num * mult - 0.5) / mult end
end

function unpack(t, i)
    i = i or 1
    if t[i] ~= nil then
      return t[i], unpack(t, i + 1)
    end
  end

  

--[[
    A helper function for displaying
    a list of nodes.
]]

function DrawRects(color, ...)
    for _, node in ipairs({...}) do
        DrawRect(node, color)
    end
end

function DrawGridRects(color, ...)
    for _, nodes in ipairs({...}) do
        DrawRects(color, unpack(nodes))
    end
end