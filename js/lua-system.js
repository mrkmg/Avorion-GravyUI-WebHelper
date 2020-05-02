define([
    "require",
    "js/render-system"
], function (require) {
    const renderSystem = require("js/render-system");

    const {lauxlib, lua, lualib, to_luastring} = fengari;

    class LuaSystem {
        L = null;
        globalFontColor = "black";
        lastPrintOffset = 0;
        currentFrame = 1;
        continueLoop = true;
        startTime = null;

        run(script) {
            this.init();
            this.registerFunctions();
            try {
                this.loadScript(script);
                this.parseGlobals();
            } catch (e) {
                console.error(e);
                throw e;
            }

            requestAnimationFrame(() => this.runMain())
        }

        stop() {
            this.continueLoop = false;
        }

        init() {
            this.L = lauxlib.luaL_newstate();
            lualib.luaL_openlibs(this.L);
        }

        registerFunctions() {
            lua.lua_register(this.L, "getResolution", () => this.getResolution());
            lua.lua_register(this.L, "sprint", () => this.sprint());
            lua.lua_register(this.L, "DrawText", () => this.DrawText());
            lua.lua_register(this.L, "DrawTextL", () => this.DrawTextL());
            lua.lua_register(this.L, "DrawRect", () => this.DrawRect());
        }

        loadScript(script) {
            const luaScript = to_luastring(script);
            lauxlib.luaL_loadstring(this.L, luaScript);
            lua.lua_call(this.L, 0, -1);
        }

        parseGlobals() {
            lua.lua_getglobal(this.L, "FONTCOLOR")
            if (!lua.lua_isnil(this.L, -1)) {
                this.globalFontColor = lua.lua_tojsstring(this.L, -1)
                lua.lua_pop(this.L, 1)
            }
        }

        runMain() {
            if (!this.continueLoop) {
                this.cleanup();
                return;
            }
            lua.lua_getglobal(this.L, "main")
            if (!lua.lua_isnil(this.L, -1)) {
                lua.lua_pushnumber(this.L, this.currentFrame++)
                this.lastPrintOffset = 0;
                renderSystem.clear();
                try {
                    lua.lua_call(this.L, 1, 1)
                    if (!lua.lua_isnil(this.L, -1)) {
                        const t = lua.lua_toboolean(this.L, -1);
                        if(t) {
                            lua.lua_pop(this.L, 1)
                            requestAnimationFrame(() => this.runMain())
                            return;
                        }
                    }
                } catch(e) {
                    const res = renderSystem.getResolution()
                    renderSystem.drawText(10, 10, res.x - 20, 30, e.toString(), "red", 20, "left")
                }
                this.cleanup();
            }
        }

        cleanup() {
            lua.lua_close(this.L)
        }

        /////

        getResolution() {
            const res = renderSystem.getResolution();
            lua.lua_pushnumber(this.L, res.x);
            lua.lua_pushnumber(this.L, res.y);
            return 2
        }

        sprint() {
            const s = [];
            while (lua.lua_gettop(this.L) > 0) {
                s.unshift(lua.lua_tojsstring(this.L, -1))
                lua.lua_pop(this.L, 1)
            }
            
            const offset = 20 * (this.lastPrintOffset + 1)
            renderSystem.drawText(5, offset, renderSystem.getResolution().x, offset + 20,s.join(", "), "white", 30, "left")
        
            this.lastPrintOffset++;
            return 0;
        }

         DrawRect() {
            let color = null;
            if (lua.lua_gettop(this.L) == 2) {
                color = lua.lua_tojsstring(this.L, -1)
                lua.lua_pop(this.L, 1)
            }
            const pos = this.processDisplayTable(this.L)

            renderSystem.drawRect(pos.x1, pos.y1, pos.x2, pos.y2, color, "black")
            return 0;
        }
    
         DrawTextL() {
            return this.DrawText(true);
        }
    
         DrawText(left) {
            let color = null;
            let size = null;
            while (lua.lua_gettop(this.L) >= 3) {
                if (lua.lua_isnumber(this.L, -1) && size === null) {
                    size = lua.lua_tonumber(this.L, -1)
                    lua.lua_pop(this.L, 1)
                } else if (lua.lua_isstring(this.L, -1) && color === null) {
                    color = lua.lua_tojsstring(this.L, -1)
                    lua.lua_pop(this.L, 1)
                } else {
                    throw new Error("Unexpected Argument");
                }
            }
            if (color === null) color = this.globalFontColor;
            if (size === null) size = 20;
            const text = lua.lua_tojsstring(this.L, -1)
            lua.lua_pop(this.L, 1)
            const pos = this.processDisplayTable(this.L)
            lua.lua_pop(this.L, 1)
            
            renderSystem.drawText(pos.x1, pos.y1, pos.x2, pos.y2, text, color, size, left ? "left" : "middle");
            return 0;
        }

        ////

        processDisplayTable() {
            lua.lua_pushliteral(this.L, "rect")
            lua.lua_gettable(this.L, -2)
    
            lua.lua_pushliteral(this.L, "topLeft")
            lua.lua_gettable(this.L, -2)
    
            lua.lua_pushliteral(this.L, "x")
            lua.lua_gettable(this.L, -2)
            const x1 = lua.lua_tonumber(this.L, -1)
            lua.lua_pop(this.L, 1)
    
            lua.lua_pushliteral(this.L, "y")
            lua.lua_gettable(this.L, -2)
            const y1 = lua.lua_tonumber(this.L, -1)
            lua.lua_pop(this.L, 2)
    
            lua.lua_pushliteral(this.L, "bottomRight")
            lua.lua_gettable(this.L, -2)
    
            lua.lua_pushliteral(this.L, "x")
            lua.lua_gettable(this.L, -2)
            const x2 = lua.lua_tonumber(this.L, -1)
            lua.lua_pop(this.L, 1)
    
            lua.lua_pushliteral(this.L, "y")
            lua.lua_gettable(this.L, -2)
            const y2 = lua.lua_tonumber(this.L, -1)
            lua.lua_pop(this.L, 3)
    
            return {x1: x1, y1: y1, x2: x2, y2: y2}
        }
    }

    return LuaSystem
});