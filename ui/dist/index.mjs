import { jsx as W, jsxs as Y } from "react/jsx-runtime";
import J from "react";
import { createRoot as je } from "react-dom/client";
var Ae = { exports: {} };
(function(D, F) {
  (function(N, z) {
    D.exports = z();
  })(self, () => (() => {
    var N = { 4567: function(B, s, a) {
      var c = this && this.__decorate || function(r, o, l, f) {
        var m, h = arguments.length, p = h < 3 ? o : f === null ? f = Object.getOwnPropertyDescriptor(o, l) : f;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") p = Reflect.decorate(r, o, l, f);
        else for (var w = r.length - 1; w >= 0; w--) (m = r[w]) && (p = (h < 3 ? m(p) : h > 3 ? m(o, l, p) : m(o, l)) || p);
        return h > 3 && p && Object.defineProperty(o, l, p), p;
      }, _ = this && this.__param || function(r, o) {
        return function(l, f) {
          o(l, f, r);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.AccessibilityManager = void 0;
      const n = a(9042), d = a(6114), v = a(9924), g = a(844), u = a(5596), e = a(4725), i = a(3656);
      let t = s.AccessibilityManager = class extends g.Disposable {
        constructor(r, o) {
          super(), this._terminal = r, this._renderService = o, this._liveRegionLineCount = 0, this._charsToConsume = [], this._charsToAnnounce = "", this._accessibilityContainer = document.createElement("div"), this._accessibilityContainer.classList.add("xterm-accessibility"), this._rowContainer = document.createElement("div"), this._rowContainer.setAttribute("role", "list"), this._rowContainer.classList.add("xterm-accessibility-tree"), this._rowElements = [];
          for (let l = 0; l < this._terminal.rows; l++) this._rowElements[l] = this._createAccessibilityTreeNode(), this._rowContainer.appendChild(this._rowElements[l]);
          if (this._topBoundaryFocusListener = (l) => this._handleBoundaryFocus(l, 0), this._bottomBoundaryFocusListener = (l) => this._handleBoundaryFocus(l, 1), this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener), this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._refreshRowsDimensions(), this._accessibilityContainer.appendChild(this._rowContainer), this._liveRegion = document.createElement("div"), this._liveRegion.classList.add("live-region"), this._liveRegion.setAttribute("aria-live", "assertive"), this._accessibilityContainer.appendChild(this._liveRegion), this._liveRegionDebouncer = this.register(new v.TimeBasedDebouncer(this._renderRows.bind(this))), !this._terminal.element) throw new Error("Cannot enable accessibility before Terminal.open");
          this._terminal.element.insertAdjacentElement("afterbegin", this._accessibilityContainer), this.register(this._terminal.onResize((l) => this._handleResize(l.rows))), this.register(this._terminal.onRender((l) => this._refreshRows(l.start, l.end))), this.register(this._terminal.onScroll(() => this._refreshRows())), this.register(this._terminal.onA11yChar((l) => this._handleChar(l))), this.register(this._terminal.onLineFeed(() => this._handleChar(`
`))), this.register(this._terminal.onA11yTab((l) => this._handleTab(l))), this.register(this._terminal.onKey((l) => this._handleKey(l.key))), this.register(this._terminal.onBlur(() => this._clearLiveRegion())), this.register(this._renderService.onDimensionsChange(() => this._refreshRowsDimensions())), this._screenDprMonitor = new u.ScreenDprMonitor(window), this.register(this._screenDprMonitor), this._screenDprMonitor.setListener(() => this._refreshRowsDimensions()), this.register((0, i.addDisposableDomListener)(window, "resize", () => this._refreshRowsDimensions())), this._refreshRows(), this.register((0, g.toDisposable)(() => {
            this._accessibilityContainer.remove(), this._rowElements.length = 0;
          }));
        }
        _handleTab(r) {
          for (let o = 0; o < r; o++) this._handleChar(" ");
        }
        _handleChar(r) {
          this._liveRegionLineCount < 21 && (this._charsToConsume.length > 0 ? this._charsToConsume.shift() !== r && (this._charsToAnnounce += r) : this._charsToAnnounce += r, r === `
` && (this._liveRegionLineCount++, this._liveRegionLineCount === 21 && (this._liveRegion.textContent += n.tooMuchOutput)), d.isMac && this._liveRegion.textContent && this._liveRegion.textContent.length > 0 && !this._liveRegion.parentNode && setTimeout(() => {
            this._accessibilityContainer.appendChild(this._liveRegion);
          }, 0));
        }
        _clearLiveRegion() {
          this._liveRegion.textContent = "", this._liveRegionLineCount = 0, d.isMac && this._liveRegion.remove();
        }
        _handleKey(r) {
          this._clearLiveRegion(), new RegExp("\\p{Control}", "u").test(r) || this._charsToConsume.push(r);
        }
        _refreshRows(r, o) {
          this._liveRegionDebouncer.refresh(r, o, this._terminal.rows);
        }
        _renderRows(r, o) {
          const l = this._terminal.buffer, f = l.lines.length.toString();
          for (let m = r; m <= o; m++) {
            const h = l.translateBufferLineToString(l.ydisp + m, !0), p = (l.ydisp + m + 1).toString(), w = this._rowElements[m];
            w && (h.length === 0 ? w.innerText = " " : w.textContent = h, w.setAttribute("aria-posinset", p), w.setAttribute("aria-setsize", f));
          }
          this._announceCharacters();
        }
        _announceCharacters() {
          this._charsToAnnounce.length !== 0 && (this._liveRegion.textContent += this._charsToAnnounce, this._charsToAnnounce = "");
        }
        _handleBoundaryFocus(r, o) {
          const l = r.target, f = this._rowElements[o === 0 ? 1 : this._rowElements.length - 2];
          if (l.getAttribute("aria-posinset") === (o === 0 ? "1" : `${this._terminal.buffer.lines.length}`) || r.relatedTarget !== f) return;
          let m, h;
          if (o === 0 ? (m = l, h = this._rowElements.pop(), this._rowContainer.removeChild(h)) : (m = this._rowElements.shift(), h = l, this._rowContainer.removeChild(m)), m.removeEventListener("focus", this._topBoundaryFocusListener), h.removeEventListener("focus", this._bottomBoundaryFocusListener), o === 0) {
            const p = this._createAccessibilityTreeNode();
            this._rowElements.unshift(p), this._rowContainer.insertAdjacentElement("afterbegin", p);
          } else {
            const p = this._createAccessibilityTreeNode();
            this._rowElements.push(p), this._rowContainer.appendChild(p);
          }
          this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener), this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._terminal.scrollLines(o === 0 ? -1 : 1), this._rowElements[o === 0 ? 1 : this._rowElements.length - 2].focus(), r.preventDefault(), r.stopImmediatePropagation();
        }
        _handleResize(r) {
          this._rowElements[this._rowElements.length - 1].removeEventListener("focus", this._bottomBoundaryFocusListener);
          for (let o = this._rowContainer.children.length; o < this._terminal.rows; o++) this._rowElements[o] = this._createAccessibilityTreeNode(), this._rowContainer.appendChild(this._rowElements[o]);
          for (; this._rowElements.length > r; ) this._rowContainer.removeChild(this._rowElements.pop());
          this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._refreshRowsDimensions();
        }
        _createAccessibilityTreeNode() {
          const r = document.createElement("div");
          return r.setAttribute("role", "listitem"), r.tabIndex = -1, this._refreshRowDimensions(r), r;
        }
        _refreshRowsDimensions() {
          if (this._renderService.dimensions.css.cell.height) {
            this._accessibilityContainer.style.width = `${this._renderService.dimensions.css.canvas.width}px`, this._rowElements.length !== this._terminal.rows && this._handleResize(this._terminal.rows);
            for (let r = 0; r < this._terminal.rows; r++) this._refreshRowDimensions(this._rowElements[r]);
          }
        }
        _refreshRowDimensions(r) {
          r.style.height = `${this._renderService.dimensions.css.cell.height}px`;
        }
      };
      s.AccessibilityManager = t = c([_(1, e.IRenderService)], t);
    }, 3614: (B, s) => {
      function a(d) {
        return d.replace(/\r?\n/g, "\r");
      }
      function c(d, v) {
        return v ? "\x1B[200~" + d + "\x1B[201~" : d;
      }
      function _(d, v, g, u) {
        d = c(d = a(d), g.decPrivateModes.bracketedPasteMode && u.rawOptions.ignoreBracketedPasteMode !== !0), g.triggerDataEvent(d, !0), v.value = "";
      }
      function n(d, v, g) {
        const u = g.getBoundingClientRect(), e = d.clientX - u.left - 10, i = d.clientY - u.top - 10;
        v.style.width = "20px", v.style.height = "20px", v.style.left = `${e}px`, v.style.top = `${i}px`, v.style.zIndex = "1000", v.focus();
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.rightClickHandler = s.moveTextAreaUnderMouseCursor = s.paste = s.handlePasteEvent = s.copyHandler = s.bracketTextForPaste = s.prepareTextForTerminal = void 0, s.prepareTextForTerminal = a, s.bracketTextForPaste = c, s.copyHandler = function(d, v) {
        d.clipboardData && d.clipboardData.setData("text/plain", v.selectionText), d.preventDefault();
      }, s.handlePasteEvent = function(d, v, g, u) {
        d.stopPropagation(), d.clipboardData && _(d.clipboardData.getData("text/plain"), v, g, u);
      }, s.paste = _, s.moveTextAreaUnderMouseCursor = n, s.rightClickHandler = function(d, v, g, u, e) {
        n(d, v, g), e && u.rightClickSelect(d), v.value = u.selectionText, v.select();
      };
    }, 7239: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ColorContrastCache = void 0;
      const c = a(1505);
      s.ColorContrastCache = class {
        constructor() {
          this._color = new c.TwoKeyMap(), this._css = new c.TwoKeyMap();
        }
        setCss(_, n, d) {
          this._css.set(_, n, d);
        }
        getCss(_, n) {
          return this._css.get(_, n);
        }
        setColor(_, n, d) {
          this._color.set(_, n, d);
        }
        getColor(_, n) {
          return this._color.get(_, n);
        }
        clear() {
          this._color.clear(), this._css.clear();
        }
      };
    }, 3656: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.addDisposableDomListener = void 0, s.addDisposableDomListener = function(a, c, _, n) {
        a.addEventListener(c, _, n);
        let d = !1;
        return { dispose: () => {
          d || (d = !0, a.removeEventListener(c, _, n));
        } };
      };
    }, 6465: function(B, s, a) {
      var c = this && this.__decorate || function(e, i, t, r) {
        var o, l = arguments.length, f = l < 3 ? i : r === null ? r = Object.getOwnPropertyDescriptor(i, t) : r;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, r);
        else for (var m = e.length - 1; m >= 0; m--) (o = e[m]) && (f = (l < 3 ? o(f) : l > 3 ? o(i, t, f) : o(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, r) {
          i(t, r, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Linkifier2 = void 0;
      const n = a(3656), d = a(8460), v = a(844), g = a(2585);
      let u = s.Linkifier2 = class extends v.Disposable {
        get currentLink() {
          return this._currentLink;
        }
        constructor(e) {
          super(), this._bufferService = e, this._linkProviders = [], this._linkCacheDisposables = [], this._isMouseOut = !0, this._wasResized = !1, this._activeLine = -1, this._onShowLinkUnderline = this.register(new d.EventEmitter()), this.onShowLinkUnderline = this._onShowLinkUnderline.event, this._onHideLinkUnderline = this.register(new d.EventEmitter()), this.onHideLinkUnderline = this._onHideLinkUnderline.event, this.register((0, v.getDisposeArrayDisposable)(this._linkCacheDisposables)), this.register((0, v.toDisposable)(() => {
            this._lastMouseEvent = void 0;
          })), this.register(this._bufferService.onResize(() => {
            this._clearCurrentLink(), this._wasResized = !0;
          }));
        }
        registerLinkProvider(e) {
          return this._linkProviders.push(e), { dispose: () => {
            const i = this._linkProviders.indexOf(e);
            i !== -1 && this._linkProviders.splice(i, 1);
          } };
        }
        attachToDom(e, i, t) {
          this._element = e, this._mouseService = i, this._renderService = t, this.register((0, n.addDisposableDomListener)(this._element, "mouseleave", () => {
            this._isMouseOut = !0, this._clearCurrentLink();
          })), this.register((0, n.addDisposableDomListener)(this._element, "mousemove", this._handleMouseMove.bind(this))), this.register((0, n.addDisposableDomListener)(this._element, "mousedown", this._handleMouseDown.bind(this))), this.register((0, n.addDisposableDomListener)(this._element, "mouseup", this._handleMouseUp.bind(this)));
        }
        _handleMouseMove(e) {
          if (this._lastMouseEvent = e, !this._element || !this._mouseService) return;
          const i = this._positionFromMouseEvent(e, this._element, this._mouseService);
          if (!i) return;
          this._isMouseOut = !1;
          const t = e.composedPath();
          for (let r = 0; r < t.length; r++) {
            const o = t[r];
            if (o.classList.contains("xterm")) break;
            if (o.classList.contains("xterm-hover")) return;
          }
          this._lastBufferCell && i.x === this._lastBufferCell.x && i.y === this._lastBufferCell.y || (this._handleHover(i), this._lastBufferCell = i);
        }
        _handleHover(e) {
          if (this._activeLine !== e.y || this._wasResized) return this._clearCurrentLink(), this._askForLink(e, !1), void (this._wasResized = !1);
          this._currentLink && this._linkAtPosition(this._currentLink.link, e) || (this._clearCurrentLink(), this._askForLink(e, !0));
        }
        _askForLink(e, i) {
          var t, r;
          this._activeProviderReplies && i || ((t = this._activeProviderReplies) === null || t === void 0 || t.forEach((l) => {
            l == null || l.forEach((f) => {
              f.link.dispose && f.link.dispose();
            });
          }), this._activeProviderReplies = /* @__PURE__ */ new Map(), this._activeLine = e.y);
          let o = !1;
          for (const [l, f] of this._linkProviders.entries()) i ? !((r = this._activeProviderReplies) === null || r === void 0) && r.get(l) && (o = this._checkLinkProviderResult(l, e, o)) : f.provideLinks(e.y, (m) => {
            var h, p;
            if (this._isMouseOut) return;
            const w = m == null ? void 0 : m.map((C) => ({ link: C }));
            (h = this._activeProviderReplies) === null || h === void 0 || h.set(l, w), o = this._checkLinkProviderResult(l, e, o), ((p = this._activeProviderReplies) === null || p === void 0 ? void 0 : p.size) === this._linkProviders.length && this._removeIntersectingLinks(e.y, this._activeProviderReplies);
          });
        }
        _removeIntersectingLinks(e, i) {
          const t = /* @__PURE__ */ new Set();
          for (let r = 0; r < i.size; r++) {
            const o = i.get(r);
            if (o) for (let l = 0; l < o.length; l++) {
              const f = o[l], m = f.link.range.start.y < e ? 0 : f.link.range.start.x, h = f.link.range.end.y > e ? this._bufferService.cols : f.link.range.end.x;
              for (let p = m; p <= h; p++) {
                if (t.has(p)) {
                  o.splice(l--, 1);
                  break;
                }
                t.add(p);
              }
            }
          }
        }
        _checkLinkProviderResult(e, i, t) {
          var r;
          if (!this._activeProviderReplies) return t;
          const o = this._activeProviderReplies.get(e);
          let l = !1;
          for (let f = 0; f < e; f++) this._activeProviderReplies.has(f) && !this._activeProviderReplies.get(f) || (l = !0);
          if (!l && o) {
            const f = o.find((m) => this._linkAtPosition(m.link, i));
            f && (t = !0, this._handleNewLink(f));
          }
          if (this._activeProviderReplies.size === this._linkProviders.length && !t) for (let f = 0; f < this._activeProviderReplies.size; f++) {
            const m = (r = this._activeProviderReplies.get(f)) === null || r === void 0 ? void 0 : r.find((h) => this._linkAtPosition(h.link, i));
            if (m) {
              t = !0, this._handleNewLink(m);
              break;
            }
          }
          return t;
        }
        _handleMouseDown() {
          this._mouseDownLink = this._currentLink;
        }
        _handleMouseUp(e) {
          if (!this._element || !this._mouseService || !this._currentLink) return;
          const i = this._positionFromMouseEvent(e, this._element, this._mouseService);
          i && this._mouseDownLink === this._currentLink && this._linkAtPosition(this._currentLink.link, i) && this._currentLink.link.activate(e, this._currentLink.link.text);
        }
        _clearCurrentLink(e, i) {
          this._element && this._currentLink && this._lastMouseEvent && (!e || !i || this._currentLink.link.range.start.y >= e && this._currentLink.link.range.end.y <= i) && (this._linkLeave(this._element, this._currentLink.link, this._lastMouseEvent), this._currentLink = void 0, (0, v.disposeArray)(this._linkCacheDisposables));
        }
        _handleNewLink(e) {
          if (!this._element || !this._lastMouseEvent || !this._mouseService) return;
          const i = this._positionFromMouseEvent(this._lastMouseEvent, this._element, this._mouseService);
          i && this._linkAtPosition(e.link, i) && (this._currentLink = e, this._currentLink.state = { decorations: { underline: e.link.decorations === void 0 || e.link.decorations.underline, pointerCursor: e.link.decorations === void 0 || e.link.decorations.pointerCursor }, isHovered: !0 }, this._linkHover(this._element, e.link, this._lastMouseEvent), e.link.decorations = {}, Object.defineProperties(e.link.decorations, { pointerCursor: { get: () => {
            var t, r;
            return (r = (t = this._currentLink) === null || t === void 0 ? void 0 : t.state) === null || r === void 0 ? void 0 : r.decorations.pointerCursor;
          }, set: (t) => {
            var r, o;
            !((r = this._currentLink) === null || r === void 0) && r.state && this._currentLink.state.decorations.pointerCursor !== t && (this._currentLink.state.decorations.pointerCursor = t, this._currentLink.state.isHovered && ((o = this._element) === null || o === void 0 || o.classList.toggle("xterm-cursor-pointer", t)));
          } }, underline: { get: () => {
            var t, r;
            return (r = (t = this._currentLink) === null || t === void 0 ? void 0 : t.state) === null || r === void 0 ? void 0 : r.decorations.underline;
          }, set: (t) => {
            var r, o, l;
            !((r = this._currentLink) === null || r === void 0) && r.state && ((l = (o = this._currentLink) === null || o === void 0 ? void 0 : o.state) === null || l === void 0 ? void 0 : l.decorations.underline) !== t && (this._currentLink.state.decorations.underline = t, this._currentLink.state.isHovered && this._fireUnderlineEvent(e.link, t));
          } } }), this._renderService && this._linkCacheDisposables.push(this._renderService.onRenderedViewportChange((t) => {
            if (!this._currentLink) return;
            const r = t.start === 0 ? 0 : t.start + 1 + this._bufferService.buffer.ydisp, o = this._bufferService.buffer.ydisp + 1 + t.end;
            if (this._currentLink.link.range.start.y >= r && this._currentLink.link.range.end.y <= o && (this._clearCurrentLink(r, o), this._lastMouseEvent && this._element)) {
              const l = this._positionFromMouseEvent(this._lastMouseEvent, this._element, this._mouseService);
              l && this._askForLink(l, !1);
            }
          })));
        }
        _linkHover(e, i, t) {
          var r;
          !((r = this._currentLink) === null || r === void 0) && r.state && (this._currentLink.state.isHovered = !0, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(i, !0), this._currentLink.state.decorations.pointerCursor && e.classList.add("xterm-cursor-pointer")), i.hover && i.hover(t, i.text);
        }
        _fireUnderlineEvent(e, i) {
          const t = e.range, r = this._bufferService.buffer.ydisp, o = this._createLinkUnderlineEvent(t.start.x - 1, t.start.y - r - 1, t.end.x, t.end.y - r - 1, void 0);
          (i ? this._onShowLinkUnderline : this._onHideLinkUnderline).fire(o);
        }
        _linkLeave(e, i, t) {
          var r;
          !((r = this._currentLink) === null || r === void 0) && r.state && (this._currentLink.state.isHovered = !1, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(i, !1), this._currentLink.state.decorations.pointerCursor && e.classList.remove("xterm-cursor-pointer")), i.leave && i.leave(t, i.text);
        }
        _linkAtPosition(e, i) {
          const t = e.range.start.y * this._bufferService.cols + e.range.start.x, r = e.range.end.y * this._bufferService.cols + e.range.end.x, o = i.y * this._bufferService.cols + i.x;
          return t <= o && o <= r;
        }
        _positionFromMouseEvent(e, i, t) {
          const r = t.getCoords(e, i, this._bufferService.cols, this._bufferService.rows);
          if (r) return { x: r[0], y: r[1] + this._bufferService.buffer.ydisp };
        }
        _createLinkUnderlineEvent(e, i, t, r, o) {
          return { x1: e, y1: i, x2: t, y2: r, cols: this._bufferService.cols, fg: o };
        }
      };
      s.Linkifier2 = u = c([_(0, g.IBufferService)], u);
    }, 9042: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.tooMuchOutput = s.promptLabel = void 0, s.promptLabel = "Terminal input", s.tooMuchOutput = "Too much output to announce, navigate to rows manually to read";
    }, 3730: function(B, s, a) {
      var c = this && this.__decorate || function(u, e, i, t) {
        var r, o = arguments.length, l = o < 3 ? e : t === null ? t = Object.getOwnPropertyDescriptor(e, i) : t;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") l = Reflect.decorate(u, e, i, t);
        else for (var f = u.length - 1; f >= 0; f--) (r = u[f]) && (l = (o < 3 ? r(l) : o > 3 ? r(e, i, l) : r(e, i)) || l);
        return o > 3 && l && Object.defineProperty(e, i, l), l;
      }, _ = this && this.__param || function(u, e) {
        return function(i, t) {
          e(i, t, u);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OscLinkProvider = void 0;
      const n = a(511), d = a(2585);
      let v = s.OscLinkProvider = class {
        constructor(u, e, i) {
          this._bufferService = u, this._optionsService = e, this._oscLinkService = i;
        }
        provideLinks(u, e) {
          var i;
          const t = this._bufferService.buffer.lines.get(u - 1);
          if (!t) return void e(void 0);
          const r = [], o = this._optionsService.rawOptions.linkHandler, l = new n.CellData(), f = t.getTrimmedLength();
          let m = -1, h = -1, p = !1;
          for (let w = 0; w < f; w++) if (h !== -1 || t.hasContent(w)) {
            if (t.loadCell(w, l), l.hasExtendedAttrs() && l.extended.urlId) {
              if (h === -1) {
                h = w, m = l.extended.urlId;
                continue;
              }
              p = l.extended.urlId !== m;
            } else h !== -1 && (p = !0);
            if (p || h !== -1 && w === f - 1) {
              const C = (i = this._oscLinkService.getLinkData(m)) === null || i === void 0 ? void 0 : i.uri;
              if (C) {
                const y = { start: { x: h + 1, y: u }, end: { x: w + (p || w !== f - 1 ? 0 : 1), y: u } };
                let x = !1;
                if (!(o != null && o.allowNonHttpProtocols)) try {
                  const A = new URL(C);
                  ["http:", "https:"].includes(A.protocol) || (x = !0);
                } catch {
                  x = !0;
                }
                x || r.push({ text: C, range: y, activate: (A, O) => o ? o.activate(A, O, y) : g(0, O), hover: (A, O) => {
                  var P;
                  return (P = o == null ? void 0 : o.hover) === null || P === void 0 ? void 0 : P.call(o, A, O, y);
                }, leave: (A, O) => {
                  var P;
                  return (P = o == null ? void 0 : o.leave) === null || P === void 0 ? void 0 : P.call(o, A, O, y);
                } });
              }
              p = !1, l.hasExtendedAttrs() && l.extended.urlId ? (h = w, m = l.extended.urlId) : (h = -1, m = -1);
            }
          }
          e(r);
        }
      };
      function g(u, e) {
        if (confirm(`Do you want to navigate to ${e}?

WARNING: This link could potentially be dangerous`)) {
          const i = window.open();
          if (i) {
            try {
              i.opener = null;
            } catch {
            }
            i.location.href = e;
          } else console.warn("Opening link blocked as opener could not be cleared");
        }
      }
      s.OscLinkProvider = v = c([_(0, d.IBufferService), _(1, d.IOptionsService), _(2, d.IOscLinkService)], v);
    }, 6193: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.RenderDebouncer = void 0, s.RenderDebouncer = class {
        constructor(a, c) {
          this._parentWindow = a, this._renderCallback = c, this._refreshCallbacks = [];
        }
        dispose() {
          this._animationFrame && (this._parentWindow.cancelAnimationFrame(this._animationFrame), this._animationFrame = void 0);
        }
        addRefreshCallback(a) {
          return this._refreshCallbacks.push(a), this._animationFrame || (this._animationFrame = this._parentWindow.requestAnimationFrame(() => this._innerRefresh())), this._animationFrame;
        }
        refresh(a, c, _) {
          this._rowCount = _, a = a !== void 0 ? a : 0, c = c !== void 0 ? c : this._rowCount - 1, this._rowStart = this._rowStart !== void 0 ? Math.min(this._rowStart, a) : a, this._rowEnd = this._rowEnd !== void 0 ? Math.max(this._rowEnd, c) : c, this._animationFrame || (this._animationFrame = this._parentWindow.requestAnimationFrame(() => this._innerRefresh()));
        }
        _innerRefresh() {
          if (this._animationFrame = void 0, this._rowStart === void 0 || this._rowEnd === void 0 || this._rowCount === void 0) return void this._runRefreshCallbacks();
          const a = Math.max(this._rowStart, 0), c = Math.min(this._rowEnd, this._rowCount - 1);
          this._rowStart = void 0, this._rowEnd = void 0, this._renderCallback(a, c), this._runRefreshCallbacks();
        }
        _runRefreshCallbacks() {
          for (const a of this._refreshCallbacks) a(0);
          this._refreshCallbacks = [];
        }
      };
    }, 5596: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ScreenDprMonitor = void 0;
      const c = a(844);
      class _ extends c.Disposable {
        constructor(d) {
          super(), this._parentWindow = d, this._currentDevicePixelRatio = this._parentWindow.devicePixelRatio, this.register((0, c.toDisposable)(() => {
            this.clearListener();
          }));
        }
        setListener(d) {
          this._listener && this.clearListener(), this._listener = d, this._outerListener = () => {
            this._listener && (this._listener(this._parentWindow.devicePixelRatio, this._currentDevicePixelRatio), this._updateDpr());
          }, this._updateDpr();
        }
        _updateDpr() {
          var d;
          this._outerListener && ((d = this._resolutionMediaMatchList) === null || d === void 0 || d.removeListener(this._outerListener), this._currentDevicePixelRatio = this._parentWindow.devicePixelRatio, this._resolutionMediaMatchList = this._parentWindow.matchMedia(`screen and (resolution: ${this._parentWindow.devicePixelRatio}dppx)`), this._resolutionMediaMatchList.addListener(this._outerListener));
        }
        clearListener() {
          this._resolutionMediaMatchList && this._listener && this._outerListener && (this._resolutionMediaMatchList.removeListener(this._outerListener), this._resolutionMediaMatchList = void 0, this._listener = void 0, this._outerListener = void 0);
        }
      }
      s.ScreenDprMonitor = _;
    }, 3236: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Terminal = void 0;
      const c = a(3614), _ = a(3656), n = a(6465), d = a(9042), v = a(3730), g = a(1680), u = a(3107), e = a(5744), i = a(2950), t = a(1296), r = a(428), o = a(4269), l = a(5114), f = a(8934), m = a(3230), h = a(9312), p = a(4725), w = a(6731), C = a(8055), y = a(8969), x = a(8460), A = a(844), O = a(6114), P = a(8437), I = a(2584), b = a(7399), E = a(5941), k = a(9074), L = a(2585), H = a(5435), j = a(4567), q = typeof window < "u" ? window.document : null;
      class K extends y.CoreTerminal {
        get onFocus() {
          return this._onFocus.event;
        }
        get onBlur() {
          return this._onBlur.event;
        }
        get onA11yChar() {
          return this._onA11yCharEmitter.event;
        }
        get onA11yTab() {
          return this._onA11yTabEmitter.event;
        }
        get onWillOpen() {
          return this._onWillOpen.event;
        }
        constructor(S = {}) {
          super(S), this.browser = O, this._keyDownHandled = !1, this._keyDownSeen = !1, this._keyPressHandled = !1, this._unprocessedDeadKey = !1, this._accessibilityManager = this.register(new A.MutableDisposable()), this._onCursorMove = this.register(new x.EventEmitter()), this.onCursorMove = this._onCursorMove.event, this._onKey = this.register(new x.EventEmitter()), this.onKey = this._onKey.event, this._onRender = this.register(new x.EventEmitter()), this.onRender = this._onRender.event, this._onSelectionChange = this.register(new x.EventEmitter()), this.onSelectionChange = this._onSelectionChange.event, this._onTitleChange = this.register(new x.EventEmitter()), this.onTitleChange = this._onTitleChange.event, this._onBell = this.register(new x.EventEmitter()), this.onBell = this._onBell.event, this._onFocus = this.register(new x.EventEmitter()), this._onBlur = this.register(new x.EventEmitter()), this._onA11yCharEmitter = this.register(new x.EventEmitter()), this._onA11yTabEmitter = this.register(new x.EventEmitter()), this._onWillOpen = this.register(new x.EventEmitter()), this._setup(), this.linkifier2 = this.register(this._instantiationService.createInstance(n.Linkifier2)), this.linkifier2.registerLinkProvider(this._instantiationService.createInstance(v.OscLinkProvider)), this._decorationService = this._instantiationService.createInstance(k.DecorationService), this._instantiationService.setService(L.IDecorationService, this._decorationService), this.register(this._inputHandler.onRequestBell(() => this._onBell.fire())), this.register(this._inputHandler.onRequestRefreshRows((R, M) => this.refresh(R, M))), this.register(this._inputHandler.onRequestSendFocus(() => this._reportFocus())), this.register(this._inputHandler.onRequestReset(() => this.reset())), this.register(this._inputHandler.onRequestWindowsOptionsReport((R) => this._reportWindowsOptions(R))), this.register(this._inputHandler.onColor((R) => this._handleColorEvent(R))), this.register((0, x.forwardEvent)(this._inputHandler.onCursorMove, this._onCursorMove)), this.register((0, x.forwardEvent)(this._inputHandler.onTitleChange, this._onTitleChange)), this.register((0, x.forwardEvent)(this._inputHandler.onA11yChar, this._onA11yCharEmitter)), this.register((0, x.forwardEvent)(this._inputHandler.onA11yTab, this._onA11yTabEmitter)), this.register(this._bufferService.onResize((R) => this._afterResize(R.cols, R.rows))), this.register((0, A.toDisposable)(() => {
            var R, M;
            this._customKeyEventHandler = void 0, (M = (R = this.element) === null || R === void 0 ? void 0 : R.parentNode) === null || M === void 0 || M.removeChild(this.element);
          }));
        }
        _handleColorEvent(S) {
          if (this._themeService) for (const R of S) {
            let M, T = "";
            switch (R.index) {
              case 256:
                M = "foreground", T = "10";
                break;
              case 257:
                M = "background", T = "11";
                break;
              case 258:
                M = "cursor", T = "12";
                break;
              default:
                M = "ansi", T = "4;" + R.index;
            }
            switch (R.type) {
              case 0:
                const G = C.color.toColorRGB(M === "ansi" ? this._themeService.colors.ansi[R.index] : this._themeService.colors[M]);
                this.coreService.triggerDataEvent(`${I.C0.ESC}]${T};${(0, E.toRgbString)(G)}${I.C1_ESCAPED.ST}`);
                break;
              case 1:
                if (M === "ansi") this._themeService.modifyColors(($) => $.ansi[R.index] = C.rgba.toColor(...R.color));
                else {
                  const $ = M;
                  this._themeService.modifyColors((Z) => Z[$] = C.rgba.toColor(...R.color));
                }
                break;
              case 2:
                this._themeService.restoreColor(R.index);
            }
          }
        }
        _setup() {
          super._setup(), this._customKeyEventHandler = void 0;
        }
        get buffer() {
          return this.buffers.active;
        }
        focus() {
          this.textarea && this.textarea.focus({ preventScroll: !0 });
        }
        _handleScreenReaderModeOptionChange(S) {
          S ? !this._accessibilityManager.value && this._renderService && (this._accessibilityManager.value = this._instantiationService.createInstance(j.AccessibilityManager, this)) : this._accessibilityManager.clear();
        }
        _handleTextAreaFocus(S) {
          this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(I.C0.ESC + "[I"), this.updateCursorStyle(S), this.element.classList.add("focus"), this._showCursor(), this._onFocus.fire();
        }
        blur() {
          var S;
          return (S = this.textarea) === null || S === void 0 ? void 0 : S.blur();
        }
        _handleTextAreaBlur() {
          this.textarea.value = "", this.refresh(this.buffer.y, this.buffer.y), this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(I.C0.ESC + "[O"), this.element.classList.remove("focus"), this._onBlur.fire();
        }
        _syncTextArea() {
          if (!this.textarea || !this.buffer.isCursorInViewport || this._compositionHelper.isComposing || !this._renderService) return;
          const S = this.buffer.ybase + this.buffer.y, R = this.buffer.lines.get(S);
          if (!R) return;
          const M = Math.min(this.buffer.x, this.cols - 1), T = this._renderService.dimensions.css.cell.height, G = R.getWidth(M), $ = this._renderService.dimensions.css.cell.width * G, Z = this.buffer.y * this._renderService.dimensions.css.cell.height, ie = M * this._renderService.dimensions.css.cell.width;
          this.textarea.style.left = ie + "px", this.textarea.style.top = Z + "px", this.textarea.style.width = $ + "px", this.textarea.style.height = T + "px", this.textarea.style.lineHeight = T + "px", this.textarea.style.zIndex = "-5";
        }
        _initGlobal() {
          this._bindKeys(), this.register((0, _.addDisposableDomListener)(this.element, "copy", (R) => {
            this.hasSelection() && (0, c.copyHandler)(R, this._selectionService);
          }));
          const S = (R) => (0, c.handlePasteEvent)(R, this.textarea, this.coreService, this.optionsService);
          this.register((0, _.addDisposableDomListener)(this.textarea, "paste", S)), this.register((0, _.addDisposableDomListener)(this.element, "paste", S)), O.isFirefox ? this.register((0, _.addDisposableDomListener)(this.element, "mousedown", (R) => {
            R.button === 2 && (0, c.rightClickHandler)(R, this.textarea, this.screenElement, this._selectionService, this.options.rightClickSelectsWord);
          })) : this.register((0, _.addDisposableDomListener)(this.element, "contextmenu", (R) => {
            (0, c.rightClickHandler)(R, this.textarea, this.screenElement, this._selectionService, this.options.rightClickSelectsWord);
          })), O.isLinux && this.register((0, _.addDisposableDomListener)(this.element, "auxclick", (R) => {
            R.button === 1 && (0, c.moveTextAreaUnderMouseCursor)(R, this.textarea, this.screenElement);
          }));
        }
        _bindKeys() {
          this.register((0, _.addDisposableDomListener)(this.textarea, "keyup", (S) => this._keyUp(S), !0)), this.register((0, _.addDisposableDomListener)(this.textarea, "keydown", (S) => this._keyDown(S), !0)), this.register((0, _.addDisposableDomListener)(this.textarea, "keypress", (S) => this._keyPress(S), !0)), this.register((0, _.addDisposableDomListener)(this.textarea, "compositionstart", () => this._compositionHelper.compositionstart())), this.register((0, _.addDisposableDomListener)(this.textarea, "compositionupdate", (S) => this._compositionHelper.compositionupdate(S))), this.register((0, _.addDisposableDomListener)(this.textarea, "compositionend", () => this._compositionHelper.compositionend())), this.register((0, _.addDisposableDomListener)(this.textarea, "input", (S) => this._inputEvent(S), !0)), this.register(this.onRender(() => this._compositionHelper.updateCompositionElements()));
        }
        open(S) {
          var R;
          if (!S) throw new Error("Terminal requires a parent element.");
          S.isConnected || this._logService.debug("Terminal.open was called on an element that was not attached to the DOM"), this._document = S.ownerDocument, this.element = this._document.createElement("div"), this.element.dir = "ltr", this.element.classList.add("terminal"), this.element.classList.add("xterm"), S.appendChild(this.element);
          const M = q.createDocumentFragment();
          this._viewportElement = q.createElement("div"), this._viewportElement.classList.add("xterm-viewport"), M.appendChild(this._viewportElement), this._viewportScrollArea = q.createElement("div"), this._viewportScrollArea.classList.add("xterm-scroll-area"), this._viewportElement.appendChild(this._viewportScrollArea), this.screenElement = q.createElement("div"), this.screenElement.classList.add("xterm-screen"), this._helperContainer = q.createElement("div"), this._helperContainer.classList.add("xterm-helpers"), this.screenElement.appendChild(this._helperContainer), M.appendChild(this.screenElement), this.textarea = q.createElement("textarea"), this.textarea.classList.add("xterm-helper-textarea"), this.textarea.setAttribute("aria-label", d.promptLabel), O.isChromeOS || this.textarea.setAttribute("aria-multiline", "false"), this.textarea.setAttribute("autocorrect", "off"), this.textarea.setAttribute("autocapitalize", "off"), this.textarea.setAttribute("spellcheck", "false"), this.textarea.tabIndex = 0, this._coreBrowserService = this._instantiationService.createInstance(l.CoreBrowserService, this.textarea, (R = this._document.defaultView) !== null && R !== void 0 ? R : window), this._instantiationService.setService(p.ICoreBrowserService, this._coreBrowserService), this.register((0, _.addDisposableDomListener)(this.textarea, "focus", (T) => this._handleTextAreaFocus(T))), this.register((0, _.addDisposableDomListener)(this.textarea, "blur", () => this._handleTextAreaBlur())), this._helperContainer.appendChild(this.textarea), this._charSizeService = this._instantiationService.createInstance(r.CharSizeService, this._document, this._helperContainer), this._instantiationService.setService(p.ICharSizeService, this._charSizeService), this._themeService = this._instantiationService.createInstance(w.ThemeService), this._instantiationService.setService(p.IThemeService, this._themeService), this._characterJoinerService = this._instantiationService.createInstance(o.CharacterJoinerService), this._instantiationService.setService(p.ICharacterJoinerService, this._characterJoinerService), this._renderService = this.register(this._instantiationService.createInstance(m.RenderService, this.rows, this.screenElement)), this._instantiationService.setService(p.IRenderService, this._renderService), this.register(this._renderService.onRenderedViewportChange((T) => this._onRender.fire(T))), this.onResize((T) => this._renderService.resize(T.cols, T.rows)), this._compositionView = q.createElement("div"), this._compositionView.classList.add("composition-view"), this._compositionHelper = this._instantiationService.createInstance(i.CompositionHelper, this.textarea, this._compositionView), this._helperContainer.appendChild(this._compositionView), this.element.appendChild(M);
          try {
            this._onWillOpen.fire(this.element);
          } catch {
          }
          this._renderService.hasRenderer() || this._renderService.setRenderer(this._createRenderer()), this._mouseService = this._instantiationService.createInstance(f.MouseService), this._instantiationService.setService(p.IMouseService, this._mouseService), this.viewport = this._instantiationService.createInstance(g.Viewport, this._viewportElement, this._viewportScrollArea), this.viewport.onRequestScrollLines((T) => this.scrollLines(T.amount, T.suppressScrollEvent, 1)), this.register(this._inputHandler.onRequestSyncScrollBar(() => this.viewport.syncScrollArea())), this.register(this.viewport), this.register(this.onCursorMove(() => {
            this._renderService.handleCursorMove(), this._syncTextArea();
          })), this.register(this.onResize(() => this._renderService.handleResize(this.cols, this.rows))), this.register(this.onBlur(() => this._renderService.handleBlur())), this.register(this.onFocus(() => this._renderService.handleFocus())), this.register(this._renderService.onDimensionsChange(() => this.viewport.syncScrollArea())), this._selectionService = this.register(this._instantiationService.createInstance(h.SelectionService, this.element, this.screenElement, this.linkifier2)), this._instantiationService.setService(p.ISelectionService, this._selectionService), this.register(this._selectionService.onRequestScrollLines((T) => this.scrollLines(T.amount, T.suppressScrollEvent))), this.register(this._selectionService.onSelectionChange(() => this._onSelectionChange.fire())), this.register(this._selectionService.onRequestRedraw((T) => this._renderService.handleSelectionChanged(T.start, T.end, T.columnSelectMode))), this.register(this._selectionService.onLinuxMouseSelection((T) => {
            this.textarea.value = T, this.textarea.focus(), this.textarea.select();
          })), this.register(this._onScroll.event((T) => {
            this.viewport.syncScrollArea(), this._selectionService.refresh();
          })), this.register((0, _.addDisposableDomListener)(this._viewportElement, "scroll", () => this._selectionService.refresh())), this.linkifier2.attachToDom(this.screenElement, this._mouseService, this._renderService), this.register(this._instantiationService.createInstance(u.BufferDecorationRenderer, this.screenElement)), this.register((0, _.addDisposableDomListener)(this.element, "mousedown", (T) => this._selectionService.handleMouseDown(T))), this.coreMouseService.areMouseEventsActive ? (this._selectionService.disable(), this.element.classList.add("enable-mouse-events")) : this._selectionService.enable(), this.options.screenReaderMode && (this._accessibilityManager.value = this._instantiationService.createInstance(j.AccessibilityManager, this)), this.register(this.optionsService.onSpecificOptionChange("screenReaderMode", (T) => this._handleScreenReaderModeOptionChange(T))), this.options.overviewRulerWidth && (this._overviewRulerRenderer = this.register(this._instantiationService.createInstance(e.OverviewRulerRenderer, this._viewportElement, this.screenElement))), this.optionsService.onSpecificOptionChange("overviewRulerWidth", (T) => {
            !this._overviewRulerRenderer && T && this._viewportElement && this.screenElement && (this._overviewRulerRenderer = this.register(this._instantiationService.createInstance(e.OverviewRulerRenderer, this._viewportElement, this.screenElement)));
          }), this._charSizeService.measure(), this.refresh(0, this.rows - 1), this._initGlobal(), this.bindMouse();
        }
        _createRenderer() {
          return this._instantiationService.createInstance(t.DomRenderer, this.element, this.screenElement, this._viewportElement, this.linkifier2);
        }
        bindMouse() {
          const S = this, R = this.element;
          function M($) {
            const Z = S._mouseService.getMouseReportCoords($, S.screenElement);
            if (!Z) return !1;
            let ie, re;
            switch ($.overrideType || $.type) {
              case "mousemove":
                re = 32, $.buttons === void 0 ? (ie = 3, $.button !== void 0 && (ie = $.button < 3 ? $.button : 3)) : ie = 1 & $.buttons ? 0 : 4 & $.buttons ? 1 : 2 & $.buttons ? 2 : 3;
                break;
              case "mouseup":
                re = 0, ie = $.button < 3 ? $.button : 3;
                break;
              case "mousedown":
                re = 1, ie = $.button < 3 ? $.button : 3;
                break;
              case "wheel":
                if (S.viewport.getLinesScrolled($) === 0) return !1;
                re = $.deltaY < 0 ? 0 : 1, ie = 4;
                break;
              default:
                return !1;
            }
            return !(re === void 0 || ie === void 0 || ie > 4) && S.coreMouseService.triggerMouseEvent({ col: Z.col, row: Z.row, x: Z.x, y: Z.y, button: ie, action: re, ctrl: $.ctrlKey, alt: $.altKey, shift: $.shiftKey });
          }
          const T = { mouseup: null, wheel: null, mousedrag: null, mousemove: null }, G = { mouseup: ($) => (M($), $.buttons || (this._document.removeEventListener("mouseup", T.mouseup), T.mousedrag && this._document.removeEventListener("mousemove", T.mousedrag)), this.cancel($)), wheel: ($) => (M($), this.cancel($, !0)), mousedrag: ($) => {
            $.buttons && M($);
          }, mousemove: ($) => {
            $.buttons || M($);
          } };
          this.register(this.coreMouseService.onProtocolChange(($) => {
            $ ? (this.optionsService.rawOptions.logLevel === "debug" && this._logService.debug("Binding to mouse events:", this.coreMouseService.explainEvents($)), this.element.classList.add("enable-mouse-events"), this._selectionService.disable()) : (this._logService.debug("Unbinding from mouse events."), this.element.classList.remove("enable-mouse-events"), this._selectionService.enable()), 8 & $ ? T.mousemove || (R.addEventListener("mousemove", G.mousemove), T.mousemove = G.mousemove) : (R.removeEventListener("mousemove", T.mousemove), T.mousemove = null), 16 & $ ? T.wheel || (R.addEventListener("wheel", G.wheel, { passive: !1 }), T.wheel = G.wheel) : (R.removeEventListener("wheel", T.wheel), T.wheel = null), 2 & $ ? T.mouseup || (R.addEventListener("mouseup", G.mouseup), T.mouseup = G.mouseup) : (this._document.removeEventListener("mouseup", T.mouseup), R.removeEventListener("mouseup", T.mouseup), T.mouseup = null), 4 & $ ? T.mousedrag || (T.mousedrag = G.mousedrag) : (this._document.removeEventListener("mousemove", T.mousedrag), T.mousedrag = null);
          })), this.coreMouseService.activeProtocol = this.coreMouseService.activeProtocol, this.register((0, _.addDisposableDomListener)(R, "mousedown", ($) => {
            if ($.preventDefault(), this.focus(), this.coreMouseService.areMouseEventsActive && !this._selectionService.shouldForceSelection($)) return M($), T.mouseup && this._document.addEventListener("mouseup", T.mouseup), T.mousedrag && this._document.addEventListener("mousemove", T.mousedrag), this.cancel($);
          })), this.register((0, _.addDisposableDomListener)(R, "wheel", ($) => {
            if (!T.wheel) {
              if (!this.buffer.hasScrollback) {
                const Z = this.viewport.getLinesScrolled($);
                if (Z === 0) return;
                const ie = I.C0.ESC + (this.coreService.decPrivateModes.applicationCursorKeys ? "O" : "[") + ($.deltaY < 0 ? "A" : "B");
                let re = "";
                for (let de = 0; de < Math.abs(Z); de++) re += ie;
                return this.coreService.triggerDataEvent(re, !0), this.cancel($, !0);
              }
              return this.viewport.handleWheel($) ? this.cancel($) : void 0;
            }
          }, { passive: !1 })), this.register((0, _.addDisposableDomListener)(R, "touchstart", ($) => {
            if (!this.coreMouseService.areMouseEventsActive) return this.viewport.handleTouchStart($), this.cancel($);
          }, { passive: !0 })), this.register((0, _.addDisposableDomListener)(R, "touchmove", ($) => {
            if (!this.coreMouseService.areMouseEventsActive) return this.viewport.handleTouchMove($) ? void 0 : this.cancel($);
          }, { passive: !1 }));
        }
        refresh(S, R) {
          var M;
          (M = this._renderService) === null || M === void 0 || M.refreshRows(S, R);
        }
        updateCursorStyle(S) {
          var R;
          !((R = this._selectionService) === null || R === void 0) && R.shouldColumnSelect(S) ? this.element.classList.add("column-select") : this.element.classList.remove("column-select");
        }
        _showCursor() {
          this.coreService.isCursorInitialized || (this.coreService.isCursorInitialized = !0, this.refresh(this.buffer.y, this.buffer.y));
        }
        scrollLines(S, R, M = 0) {
          var T;
          M === 1 ? (super.scrollLines(S, R, M), this.refresh(0, this.rows - 1)) : (T = this.viewport) === null || T === void 0 || T.scrollLines(S);
        }
        paste(S) {
          (0, c.paste)(S, this.textarea, this.coreService, this.optionsService);
        }
        attachCustomKeyEventHandler(S) {
          this._customKeyEventHandler = S;
        }
        registerLinkProvider(S) {
          return this.linkifier2.registerLinkProvider(S);
        }
        registerCharacterJoiner(S) {
          if (!this._characterJoinerService) throw new Error("Terminal must be opened first");
          const R = this._characterJoinerService.register(S);
          return this.refresh(0, this.rows - 1), R;
        }
        deregisterCharacterJoiner(S) {
          if (!this._characterJoinerService) throw new Error("Terminal must be opened first");
          this._characterJoinerService.deregister(S) && this.refresh(0, this.rows - 1);
        }
        get markers() {
          return this.buffer.markers;
        }
        registerMarker(S) {
          return this.buffer.addMarker(this.buffer.ybase + this.buffer.y + S);
        }
        registerDecoration(S) {
          return this._decorationService.registerDecoration(S);
        }
        hasSelection() {
          return !!this._selectionService && this._selectionService.hasSelection;
        }
        select(S, R, M) {
          this._selectionService.setSelection(S, R, M);
        }
        getSelection() {
          return this._selectionService ? this._selectionService.selectionText : "";
        }
        getSelectionPosition() {
          if (this._selectionService && this._selectionService.hasSelection) return { start: { x: this._selectionService.selectionStart[0], y: this._selectionService.selectionStart[1] }, end: { x: this._selectionService.selectionEnd[0], y: this._selectionService.selectionEnd[1] } };
        }
        clearSelection() {
          var S;
          (S = this._selectionService) === null || S === void 0 || S.clearSelection();
        }
        selectAll() {
          var S;
          (S = this._selectionService) === null || S === void 0 || S.selectAll();
        }
        selectLines(S, R) {
          var M;
          (M = this._selectionService) === null || M === void 0 || M.selectLines(S, R);
        }
        _keyDown(S) {
          if (this._keyDownHandled = !1, this._keyDownSeen = !0, this._customKeyEventHandler && this._customKeyEventHandler(S) === !1) return !1;
          const R = this.browser.isMac && this.options.macOptionIsMeta && S.altKey;
          if (!R && !this._compositionHelper.keydown(S)) return this.options.scrollOnUserInput && this.buffer.ybase !== this.buffer.ydisp && this.scrollToBottom(), !1;
          R || S.key !== "Dead" && S.key !== "AltGraph" || (this._unprocessedDeadKey = !0);
          const M = (0, b.evaluateKeyboardEvent)(S, this.coreService.decPrivateModes.applicationCursorKeys, this.browser.isMac, this.options.macOptionIsMeta);
          if (this.updateCursorStyle(S), M.type === 3 || M.type === 2) {
            const T = this.rows - 1;
            return this.scrollLines(M.type === 2 ? -T : T), this.cancel(S, !0);
          }
          return M.type === 1 && this.selectAll(), !!this._isThirdLevelShift(this.browser, S) || (M.cancel && this.cancel(S, !0), !M.key || !!(S.key && !S.ctrlKey && !S.altKey && !S.metaKey && S.key.length === 1 && S.key.charCodeAt(0) >= 65 && S.key.charCodeAt(0) <= 90) || (this._unprocessedDeadKey ? (this._unprocessedDeadKey = !1, !0) : (M.key !== I.C0.ETX && M.key !== I.C0.CR || (this.textarea.value = ""), this._onKey.fire({ key: M.key, domEvent: S }), this._showCursor(), this.coreService.triggerDataEvent(M.key, !0), !this.optionsService.rawOptions.screenReaderMode || S.altKey || S.ctrlKey ? this.cancel(S, !0) : void (this._keyDownHandled = !0))));
        }
        _isThirdLevelShift(S, R) {
          const M = S.isMac && !this.options.macOptionIsMeta && R.altKey && !R.ctrlKey && !R.metaKey || S.isWindows && R.altKey && R.ctrlKey && !R.metaKey || S.isWindows && R.getModifierState("AltGraph");
          return R.type === "keypress" ? M : M && (!R.keyCode || R.keyCode > 47);
        }
        _keyUp(S) {
          this._keyDownSeen = !1, this._customKeyEventHandler && this._customKeyEventHandler(S) === !1 || (function(R) {
            return R.keyCode === 16 || R.keyCode === 17 || R.keyCode === 18;
          }(S) || this.focus(), this.updateCursorStyle(S), this._keyPressHandled = !1);
        }
        _keyPress(S) {
          let R;
          if (this._keyPressHandled = !1, this._keyDownHandled || this._customKeyEventHandler && this._customKeyEventHandler(S) === !1) return !1;
          if (this.cancel(S), S.charCode) R = S.charCode;
          else if (S.which === null || S.which === void 0) R = S.keyCode;
          else {
            if (S.which === 0 || S.charCode === 0) return !1;
            R = S.which;
          }
          return !(!R || (S.altKey || S.ctrlKey || S.metaKey) && !this._isThirdLevelShift(this.browser, S) || (R = String.fromCharCode(R), this._onKey.fire({ key: R, domEvent: S }), this._showCursor(), this.coreService.triggerDataEvent(R, !0), this._keyPressHandled = !0, this._unprocessedDeadKey = !1, 0));
        }
        _inputEvent(S) {
          if (S.data && S.inputType === "insertText" && (!S.composed || !this._keyDownSeen) && !this.optionsService.rawOptions.screenReaderMode) {
            if (this._keyPressHandled) return !1;
            this._unprocessedDeadKey = !1;
            const R = S.data;
            return this.coreService.triggerDataEvent(R, !0), this.cancel(S), !0;
          }
          return !1;
        }
        resize(S, R) {
          S !== this.cols || R !== this.rows ? super.resize(S, R) : this._charSizeService && !this._charSizeService.hasValidSize && this._charSizeService.measure();
        }
        _afterResize(S, R) {
          var M, T;
          (M = this._charSizeService) === null || M === void 0 || M.measure(), (T = this.viewport) === null || T === void 0 || T.syncScrollArea(!0);
        }
        clear() {
          var S;
          if (this.buffer.ybase !== 0 || this.buffer.y !== 0) {
            this.buffer.clearAllMarkers(), this.buffer.lines.set(0, this.buffer.lines.get(this.buffer.ybase + this.buffer.y)), this.buffer.lines.length = 1, this.buffer.ydisp = 0, this.buffer.ybase = 0, this.buffer.y = 0;
            for (let R = 1; R < this.rows; R++) this.buffer.lines.push(this.buffer.getBlankLine(P.DEFAULT_ATTR_DATA));
            this._onScroll.fire({ position: this.buffer.ydisp, source: 0 }), (S = this.viewport) === null || S === void 0 || S.reset(), this.refresh(0, this.rows - 1);
          }
        }
        reset() {
          var S, R;
          this.options.rows = this.rows, this.options.cols = this.cols;
          const M = this._customKeyEventHandler;
          this._setup(), super.reset(), (S = this._selectionService) === null || S === void 0 || S.reset(), this._decorationService.reset(), (R = this.viewport) === null || R === void 0 || R.reset(), this._customKeyEventHandler = M, this.refresh(0, this.rows - 1);
        }
        clearTextureAtlas() {
          var S;
          (S = this._renderService) === null || S === void 0 || S.clearTextureAtlas();
        }
        _reportFocus() {
          var S;
          !((S = this.element) === null || S === void 0) && S.classList.contains("focus") ? this.coreService.triggerDataEvent(I.C0.ESC + "[I") : this.coreService.triggerDataEvent(I.C0.ESC + "[O");
        }
        _reportWindowsOptions(S) {
          if (this._renderService) switch (S) {
            case H.WindowsOptionsReportType.GET_WIN_SIZE_PIXELS:
              const R = this._renderService.dimensions.css.canvas.width.toFixed(0), M = this._renderService.dimensions.css.canvas.height.toFixed(0);
              this.coreService.triggerDataEvent(`${I.C0.ESC}[4;${M};${R}t`);
              break;
            case H.WindowsOptionsReportType.GET_CELL_SIZE_PIXELS:
              const T = this._renderService.dimensions.css.cell.width.toFixed(0), G = this._renderService.dimensions.css.cell.height.toFixed(0);
              this.coreService.triggerDataEvent(`${I.C0.ESC}[6;${G};${T}t`);
          }
        }
        cancel(S, R) {
          if (this.options.cancelEvents || R) return S.preventDefault(), S.stopPropagation(), !1;
        }
      }
      s.Terminal = K;
    }, 9924: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.TimeBasedDebouncer = void 0, s.TimeBasedDebouncer = class {
        constructor(a, c = 1e3) {
          this._renderCallback = a, this._debounceThresholdMS = c, this._lastRefreshMs = 0, this._additionalRefreshRequested = !1;
        }
        dispose() {
          this._refreshTimeoutID && clearTimeout(this._refreshTimeoutID);
        }
        refresh(a, c, _) {
          this._rowCount = _, a = a !== void 0 ? a : 0, c = c !== void 0 ? c : this._rowCount - 1, this._rowStart = this._rowStart !== void 0 ? Math.min(this._rowStart, a) : a, this._rowEnd = this._rowEnd !== void 0 ? Math.max(this._rowEnd, c) : c;
          const n = Date.now();
          if (n - this._lastRefreshMs >= this._debounceThresholdMS) this._lastRefreshMs = n, this._innerRefresh();
          else if (!this._additionalRefreshRequested) {
            const d = n - this._lastRefreshMs, v = this._debounceThresholdMS - d;
            this._additionalRefreshRequested = !0, this._refreshTimeoutID = window.setTimeout(() => {
              this._lastRefreshMs = Date.now(), this._innerRefresh(), this._additionalRefreshRequested = !1, this._refreshTimeoutID = void 0;
            }, v);
          }
        }
        _innerRefresh() {
          if (this._rowStart === void 0 || this._rowEnd === void 0 || this._rowCount === void 0) return;
          const a = Math.max(this._rowStart, 0), c = Math.min(this._rowEnd, this._rowCount - 1);
          this._rowStart = void 0, this._rowEnd = void 0, this._renderCallback(a, c);
        }
      };
    }, 1680: function(B, s, a) {
      var c = this && this.__decorate || function(i, t, r, o) {
        var l, f = arguments.length, m = f < 3 ? t : o === null ? o = Object.getOwnPropertyDescriptor(t, r) : o;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") m = Reflect.decorate(i, t, r, o);
        else for (var h = i.length - 1; h >= 0; h--) (l = i[h]) && (m = (f < 3 ? l(m) : f > 3 ? l(t, r, m) : l(t, r)) || m);
        return f > 3 && m && Object.defineProperty(t, r, m), m;
      }, _ = this && this.__param || function(i, t) {
        return function(r, o) {
          t(r, o, i);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Viewport = void 0;
      const n = a(3656), d = a(4725), v = a(8460), g = a(844), u = a(2585);
      let e = s.Viewport = class extends g.Disposable {
        constructor(i, t, r, o, l, f, m, h) {
          super(), this._viewportElement = i, this._scrollArea = t, this._bufferService = r, this._optionsService = o, this._charSizeService = l, this._renderService = f, this._coreBrowserService = m, this.scrollBarWidth = 0, this._currentRowHeight = 0, this._currentDeviceCellHeight = 0, this._lastRecordedBufferLength = 0, this._lastRecordedViewportHeight = 0, this._lastRecordedBufferHeight = 0, this._lastTouchY = 0, this._lastScrollTop = 0, this._wheelPartialScroll = 0, this._refreshAnimationFrame = null, this._ignoreNextScrollEvent = !1, this._smoothScrollState = { startTime: 0, origin: -1, target: -1 }, this._onRequestScrollLines = this.register(new v.EventEmitter()), this.onRequestScrollLines = this._onRequestScrollLines.event, this.scrollBarWidth = this._viewportElement.offsetWidth - this._scrollArea.offsetWidth || 15, this.register((0, n.addDisposableDomListener)(this._viewportElement, "scroll", this._handleScroll.bind(this))), this._activeBuffer = this._bufferService.buffer, this.register(this._bufferService.buffers.onBufferActivate((p) => this._activeBuffer = p.activeBuffer)), this._renderDimensions = this._renderService.dimensions, this.register(this._renderService.onDimensionsChange((p) => this._renderDimensions = p)), this._handleThemeChange(h.colors), this.register(h.onChangeColors((p) => this._handleThemeChange(p))), this.register(this._optionsService.onSpecificOptionChange("scrollback", () => this.syncScrollArea())), setTimeout(() => this.syncScrollArea());
        }
        _handleThemeChange(i) {
          this._viewportElement.style.backgroundColor = i.background.css;
        }
        reset() {
          this._currentRowHeight = 0, this._currentDeviceCellHeight = 0, this._lastRecordedBufferLength = 0, this._lastRecordedViewportHeight = 0, this._lastRecordedBufferHeight = 0, this._lastTouchY = 0, this._lastScrollTop = 0, this._coreBrowserService.window.requestAnimationFrame(() => this.syncScrollArea());
        }
        _refresh(i) {
          if (i) return this._innerRefresh(), void (this._refreshAnimationFrame !== null && this._coreBrowserService.window.cancelAnimationFrame(this._refreshAnimationFrame));
          this._refreshAnimationFrame === null && (this._refreshAnimationFrame = this._coreBrowserService.window.requestAnimationFrame(() => this._innerRefresh()));
        }
        _innerRefresh() {
          if (this._charSizeService.height > 0) {
            this._currentRowHeight = this._renderService.dimensions.device.cell.height / this._coreBrowserService.dpr, this._currentDeviceCellHeight = this._renderService.dimensions.device.cell.height, this._lastRecordedViewportHeight = this._viewportElement.offsetHeight;
            const t = Math.round(this._currentRowHeight * this._lastRecordedBufferLength) + (this._lastRecordedViewportHeight - this._renderService.dimensions.css.canvas.height);
            this._lastRecordedBufferHeight !== t && (this._lastRecordedBufferHeight = t, this._scrollArea.style.height = this._lastRecordedBufferHeight + "px");
          }
          const i = this._bufferService.buffer.ydisp * this._currentRowHeight;
          this._viewportElement.scrollTop !== i && (this._ignoreNextScrollEvent = !0, this._viewportElement.scrollTop = i), this._refreshAnimationFrame = null;
        }
        syncScrollArea(i = !1) {
          if (this._lastRecordedBufferLength !== this._bufferService.buffer.lines.length) return this._lastRecordedBufferLength = this._bufferService.buffer.lines.length, void this._refresh(i);
          this._lastRecordedViewportHeight === this._renderService.dimensions.css.canvas.height && this._lastScrollTop === this._activeBuffer.ydisp * this._currentRowHeight && this._renderDimensions.device.cell.height === this._currentDeviceCellHeight || this._refresh(i);
        }
        _handleScroll(i) {
          if (this._lastScrollTop = this._viewportElement.scrollTop, !this._viewportElement.offsetParent) return;
          if (this._ignoreNextScrollEvent) return this._ignoreNextScrollEvent = !1, void this._onRequestScrollLines.fire({ amount: 0, suppressScrollEvent: !0 });
          const t = Math.round(this._lastScrollTop / this._currentRowHeight) - this._bufferService.buffer.ydisp;
          this._onRequestScrollLines.fire({ amount: t, suppressScrollEvent: !0 });
        }
        _smoothScroll() {
          if (this._isDisposed || this._smoothScrollState.origin === -1 || this._smoothScrollState.target === -1) return;
          const i = this._smoothScrollPercent();
          this._viewportElement.scrollTop = this._smoothScrollState.origin + Math.round(i * (this._smoothScrollState.target - this._smoothScrollState.origin)), i < 1 ? this._coreBrowserService.window.requestAnimationFrame(() => this._smoothScroll()) : this._clearSmoothScrollState();
        }
        _smoothScrollPercent() {
          return this._optionsService.rawOptions.smoothScrollDuration && this._smoothScrollState.startTime ? Math.max(Math.min((Date.now() - this._smoothScrollState.startTime) / this._optionsService.rawOptions.smoothScrollDuration, 1), 0) : 1;
        }
        _clearSmoothScrollState() {
          this._smoothScrollState.startTime = 0, this._smoothScrollState.origin = -1, this._smoothScrollState.target = -1;
        }
        _bubbleScroll(i, t) {
          const r = this._viewportElement.scrollTop + this._lastRecordedViewportHeight;
          return !(t < 0 && this._viewportElement.scrollTop !== 0 || t > 0 && r < this._lastRecordedBufferHeight) || (i.cancelable && i.preventDefault(), !1);
        }
        handleWheel(i) {
          const t = this._getPixelsScrolled(i);
          return t !== 0 && (this._optionsService.rawOptions.smoothScrollDuration ? (this._smoothScrollState.startTime = Date.now(), this._smoothScrollPercent() < 1 ? (this._smoothScrollState.origin = this._viewportElement.scrollTop, this._smoothScrollState.target === -1 ? this._smoothScrollState.target = this._viewportElement.scrollTop + t : this._smoothScrollState.target += t, this._smoothScrollState.target = Math.max(Math.min(this._smoothScrollState.target, this._viewportElement.scrollHeight), 0), this._smoothScroll()) : this._clearSmoothScrollState()) : this._viewportElement.scrollTop += t, this._bubbleScroll(i, t));
        }
        scrollLines(i) {
          if (i !== 0) if (this._optionsService.rawOptions.smoothScrollDuration) {
            const t = i * this._currentRowHeight;
            this._smoothScrollState.startTime = Date.now(), this._smoothScrollPercent() < 1 ? (this._smoothScrollState.origin = this._viewportElement.scrollTop, this._smoothScrollState.target = this._smoothScrollState.origin + t, this._smoothScrollState.target = Math.max(Math.min(this._smoothScrollState.target, this._viewportElement.scrollHeight), 0), this._smoothScroll()) : this._clearSmoothScrollState();
          } else this._onRequestScrollLines.fire({ amount: i, suppressScrollEvent: !1 });
        }
        _getPixelsScrolled(i) {
          if (i.deltaY === 0 || i.shiftKey) return 0;
          let t = this._applyScrollModifier(i.deltaY, i);
          return i.deltaMode === WheelEvent.DOM_DELTA_LINE ? t *= this._currentRowHeight : i.deltaMode === WheelEvent.DOM_DELTA_PAGE && (t *= this._currentRowHeight * this._bufferService.rows), t;
        }
        getBufferElements(i, t) {
          var r;
          let o, l = "";
          const f = [], m = t ?? this._bufferService.buffer.lines.length, h = this._bufferService.buffer.lines;
          for (let p = i; p < m; p++) {
            const w = h.get(p);
            if (!w) continue;
            const C = (r = h.get(p + 1)) === null || r === void 0 ? void 0 : r.isWrapped;
            if (l += w.translateToString(!C), !C || p === h.length - 1) {
              const y = document.createElement("div");
              y.textContent = l, f.push(y), l.length > 0 && (o = y), l = "";
            }
          }
          return { bufferElements: f, cursorElement: o };
        }
        getLinesScrolled(i) {
          if (i.deltaY === 0 || i.shiftKey) return 0;
          let t = this._applyScrollModifier(i.deltaY, i);
          return i.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? (t /= this._currentRowHeight + 0, this._wheelPartialScroll += t, t = Math.floor(Math.abs(this._wheelPartialScroll)) * (this._wheelPartialScroll > 0 ? 1 : -1), this._wheelPartialScroll %= 1) : i.deltaMode === WheelEvent.DOM_DELTA_PAGE && (t *= this._bufferService.rows), t;
        }
        _applyScrollModifier(i, t) {
          const r = this._optionsService.rawOptions.fastScrollModifier;
          return r === "alt" && t.altKey || r === "ctrl" && t.ctrlKey || r === "shift" && t.shiftKey ? i * this._optionsService.rawOptions.fastScrollSensitivity * this._optionsService.rawOptions.scrollSensitivity : i * this._optionsService.rawOptions.scrollSensitivity;
        }
        handleTouchStart(i) {
          this._lastTouchY = i.touches[0].pageY;
        }
        handleTouchMove(i) {
          const t = this._lastTouchY - i.touches[0].pageY;
          return this._lastTouchY = i.touches[0].pageY, t !== 0 && (this._viewportElement.scrollTop += t, this._bubbleScroll(i, t));
        }
      };
      s.Viewport = e = c([_(2, u.IBufferService), _(3, u.IOptionsService), _(4, d.ICharSizeService), _(5, d.IRenderService), _(6, d.ICoreBrowserService), _(7, d.IThemeService)], e);
    }, 3107: function(B, s, a) {
      var c = this && this.__decorate || function(e, i, t, r) {
        var o, l = arguments.length, f = l < 3 ? i : r === null ? r = Object.getOwnPropertyDescriptor(i, t) : r;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, r);
        else for (var m = e.length - 1; m >= 0; m--) (o = e[m]) && (f = (l < 3 ? o(f) : l > 3 ? o(i, t, f) : o(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, r) {
          i(t, r, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferDecorationRenderer = void 0;
      const n = a(3656), d = a(4725), v = a(844), g = a(2585);
      let u = s.BufferDecorationRenderer = class extends v.Disposable {
        constructor(e, i, t, r) {
          super(), this._screenElement = e, this._bufferService = i, this._decorationService = t, this._renderService = r, this._decorationElements = /* @__PURE__ */ new Map(), this._altBufferIsActive = !1, this._dimensionsChanged = !1, this._container = document.createElement("div"), this._container.classList.add("xterm-decoration-container"), this._screenElement.appendChild(this._container), this.register(this._renderService.onRenderedViewportChange(() => this._doRefreshDecorations())), this.register(this._renderService.onDimensionsChange(() => {
            this._dimensionsChanged = !0, this._queueRefresh();
          })), this.register((0, n.addDisposableDomListener)(window, "resize", () => this._queueRefresh())), this.register(this._bufferService.buffers.onBufferActivate(() => {
            this._altBufferIsActive = this._bufferService.buffer === this._bufferService.buffers.alt;
          })), this.register(this._decorationService.onDecorationRegistered(() => this._queueRefresh())), this.register(this._decorationService.onDecorationRemoved((o) => this._removeDecoration(o))), this.register((0, v.toDisposable)(() => {
            this._container.remove(), this._decorationElements.clear();
          }));
        }
        _queueRefresh() {
          this._animationFrame === void 0 && (this._animationFrame = this._renderService.addRefreshCallback(() => {
            this._doRefreshDecorations(), this._animationFrame = void 0;
          }));
        }
        _doRefreshDecorations() {
          for (const e of this._decorationService.decorations) this._renderDecoration(e);
          this._dimensionsChanged = !1;
        }
        _renderDecoration(e) {
          this._refreshStyle(e), this._dimensionsChanged && this._refreshXPosition(e);
        }
        _createElement(e) {
          var i, t;
          const r = document.createElement("div");
          r.classList.add("xterm-decoration"), r.classList.toggle("xterm-decoration-top-layer", ((i = e == null ? void 0 : e.options) === null || i === void 0 ? void 0 : i.layer) === "top"), r.style.width = `${Math.round((e.options.width || 1) * this._renderService.dimensions.css.cell.width)}px`, r.style.height = (e.options.height || 1) * this._renderService.dimensions.css.cell.height + "px", r.style.top = (e.marker.line - this._bufferService.buffers.active.ydisp) * this._renderService.dimensions.css.cell.height + "px", r.style.lineHeight = `${this._renderService.dimensions.css.cell.height}px`;
          const o = (t = e.options.x) !== null && t !== void 0 ? t : 0;
          return o && o > this._bufferService.cols && (r.style.display = "none"), this._refreshXPosition(e, r), r;
        }
        _refreshStyle(e) {
          const i = e.marker.line - this._bufferService.buffers.active.ydisp;
          if (i < 0 || i >= this._bufferService.rows) e.element && (e.element.style.display = "none", e.onRenderEmitter.fire(e.element));
          else {
            let t = this._decorationElements.get(e);
            t || (t = this._createElement(e), e.element = t, this._decorationElements.set(e, t), this._container.appendChild(t), e.onDispose(() => {
              this._decorationElements.delete(e), t.remove();
            })), t.style.top = i * this._renderService.dimensions.css.cell.height + "px", t.style.display = this._altBufferIsActive ? "none" : "block", e.onRenderEmitter.fire(t);
          }
        }
        _refreshXPosition(e, i = e.element) {
          var t;
          if (!i) return;
          const r = (t = e.options.x) !== null && t !== void 0 ? t : 0;
          (e.options.anchor || "left") === "right" ? i.style.right = r ? r * this._renderService.dimensions.css.cell.width + "px" : "" : i.style.left = r ? r * this._renderService.dimensions.css.cell.width + "px" : "";
        }
        _removeDecoration(e) {
          var i;
          (i = this._decorationElements.get(e)) === null || i === void 0 || i.remove(), this._decorationElements.delete(e), e.dispose();
        }
      };
      s.BufferDecorationRenderer = u = c([_(1, g.IBufferService), _(2, g.IDecorationService), _(3, d.IRenderService)], u);
    }, 5871: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ColorZoneStore = void 0, s.ColorZoneStore = class {
        constructor() {
          this._zones = [], this._zonePool = [], this._zonePoolIndex = 0, this._linePadding = { full: 0, left: 0, center: 0, right: 0 };
        }
        get zones() {
          return this._zonePool.length = Math.min(this._zonePool.length, this._zones.length), this._zones;
        }
        clear() {
          this._zones.length = 0, this._zonePoolIndex = 0;
        }
        addDecoration(a) {
          if (a.options.overviewRulerOptions) {
            for (const c of this._zones) if (c.color === a.options.overviewRulerOptions.color && c.position === a.options.overviewRulerOptions.position) {
              if (this._lineIntersectsZone(c, a.marker.line)) return;
              if (this._lineAdjacentToZone(c, a.marker.line, a.options.overviewRulerOptions.position)) return void this._addLineToZone(c, a.marker.line);
            }
            if (this._zonePoolIndex < this._zonePool.length) return this._zonePool[this._zonePoolIndex].color = a.options.overviewRulerOptions.color, this._zonePool[this._zonePoolIndex].position = a.options.overviewRulerOptions.position, this._zonePool[this._zonePoolIndex].startBufferLine = a.marker.line, this._zonePool[this._zonePoolIndex].endBufferLine = a.marker.line, void this._zones.push(this._zonePool[this._zonePoolIndex++]);
            this._zones.push({ color: a.options.overviewRulerOptions.color, position: a.options.overviewRulerOptions.position, startBufferLine: a.marker.line, endBufferLine: a.marker.line }), this._zonePool.push(this._zones[this._zones.length - 1]), this._zonePoolIndex++;
          }
        }
        setPadding(a) {
          this._linePadding = a;
        }
        _lineIntersectsZone(a, c) {
          return c >= a.startBufferLine && c <= a.endBufferLine;
        }
        _lineAdjacentToZone(a, c, _) {
          return c >= a.startBufferLine - this._linePadding[_ || "full"] && c <= a.endBufferLine + this._linePadding[_ || "full"];
        }
        _addLineToZone(a, c) {
          a.startBufferLine = Math.min(a.startBufferLine, c), a.endBufferLine = Math.max(a.endBufferLine, c);
        }
      };
    }, 5744: function(B, s, a) {
      var c = this && this.__decorate || function(o, l, f, m) {
        var h, p = arguments.length, w = p < 3 ? l : m === null ? m = Object.getOwnPropertyDescriptor(l, f) : m;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") w = Reflect.decorate(o, l, f, m);
        else for (var C = o.length - 1; C >= 0; C--) (h = o[C]) && (w = (p < 3 ? h(w) : p > 3 ? h(l, f, w) : h(l, f)) || w);
        return p > 3 && w && Object.defineProperty(l, f, w), w;
      }, _ = this && this.__param || function(o, l) {
        return function(f, m) {
          l(f, m, o);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OverviewRulerRenderer = void 0;
      const n = a(5871), d = a(3656), v = a(4725), g = a(844), u = a(2585), e = { full: 0, left: 0, center: 0, right: 0 }, i = { full: 0, left: 0, center: 0, right: 0 }, t = { full: 0, left: 0, center: 0, right: 0 };
      let r = s.OverviewRulerRenderer = class extends g.Disposable {
        get _width() {
          return this._optionsService.options.overviewRulerWidth || 0;
        }
        constructor(o, l, f, m, h, p, w) {
          var C;
          super(), this._viewportElement = o, this._screenElement = l, this._bufferService = f, this._decorationService = m, this._renderService = h, this._optionsService = p, this._coreBrowseService = w, this._colorZoneStore = new n.ColorZoneStore(), this._shouldUpdateDimensions = !0, this._shouldUpdateAnchor = !0, this._lastKnownBufferLength = 0, this._canvas = document.createElement("canvas"), this._canvas.classList.add("xterm-decoration-overview-ruler"), this._refreshCanvasDimensions(), (C = this._viewportElement.parentElement) === null || C === void 0 || C.insertBefore(this._canvas, this._viewportElement);
          const y = this._canvas.getContext("2d");
          if (!y) throw new Error("Ctx cannot be null");
          this._ctx = y, this._registerDecorationListeners(), this._registerBufferChangeListeners(), this._registerDimensionChangeListeners(), this.register((0, g.toDisposable)(() => {
            var x;
            (x = this._canvas) === null || x === void 0 || x.remove();
          }));
        }
        _registerDecorationListeners() {
          this.register(this._decorationService.onDecorationRegistered(() => this._queueRefresh(void 0, !0))), this.register(this._decorationService.onDecorationRemoved(() => this._queueRefresh(void 0, !0)));
        }
        _registerBufferChangeListeners() {
          this.register(this._renderService.onRenderedViewportChange(() => this._queueRefresh())), this.register(this._bufferService.buffers.onBufferActivate(() => {
            this._canvas.style.display = this._bufferService.buffer === this._bufferService.buffers.alt ? "none" : "block";
          })), this.register(this._bufferService.onScroll(() => {
            this._lastKnownBufferLength !== this._bufferService.buffers.normal.lines.length && (this._refreshDrawHeightConstants(), this._refreshColorZonePadding());
          }));
        }
        _registerDimensionChangeListeners() {
          this.register(this._renderService.onRender(() => {
            this._containerHeight && this._containerHeight === this._screenElement.clientHeight || (this._queueRefresh(!0), this._containerHeight = this._screenElement.clientHeight);
          })), this.register(this._optionsService.onSpecificOptionChange("overviewRulerWidth", () => this._queueRefresh(!0))), this.register((0, d.addDisposableDomListener)(this._coreBrowseService.window, "resize", () => this._queueRefresh(!0))), this._queueRefresh(!0);
        }
        _refreshDrawConstants() {
          const o = Math.floor(this._canvas.width / 3), l = Math.ceil(this._canvas.width / 3);
          i.full = this._canvas.width, i.left = o, i.center = l, i.right = o, this._refreshDrawHeightConstants(), t.full = 0, t.left = 0, t.center = i.left, t.right = i.left + i.center;
        }
        _refreshDrawHeightConstants() {
          e.full = Math.round(2 * this._coreBrowseService.dpr);
          const o = this._canvas.height / this._bufferService.buffer.lines.length, l = Math.round(Math.max(Math.min(o, 12), 6) * this._coreBrowseService.dpr);
          e.left = l, e.center = l, e.right = l;
        }
        _refreshColorZonePadding() {
          this._colorZoneStore.setPadding({ full: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * e.full), left: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * e.left), center: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * e.center), right: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * e.right) }), this._lastKnownBufferLength = this._bufferService.buffers.normal.lines.length;
        }
        _refreshCanvasDimensions() {
          this._canvas.style.width = `${this._width}px`, this._canvas.width = Math.round(this._width * this._coreBrowseService.dpr), this._canvas.style.height = `${this._screenElement.clientHeight}px`, this._canvas.height = Math.round(this._screenElement.clientHeight * this._coreBrowseService.dpr), this._refreshDrawConstants(), this._refreshColorZonePadding();
        }
        _refreshDecorations() {
          this._shouldUpdateDimensions && this._refreshCanvasDimensions(), this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height), this._colorZoneStore.clear();
          for (const l of this._decorationService.decorations) this._colorZoneStore.addDecoration(l);
          this._ctx.lineWidth = 1;
          const o = this._colorZoneStore.zones;
          for (const l of o) l.position !== "full" && this._renderColorZone(l);
          for (const l of o) l.position === "full" && this._renderColorZone(l);
          this._shouldUpdateDimensions = !1, this._shouldUpdateAnchor = !1;
        }
        _renderColorZone(o) {
          this._ctx.fillStyle = o.color, this._ctx.fillRect(t[o.position || "full"], Math.round((this._canvas.height - 1) * (o.startBufferLine / this._bufferService.buffers.active.lines.length) - e[o.position || "full"] / 2), i[o.position || "full"], Math.round((this._canvas.height - 1) * ((o.endBufferLine - o.startBufferLine) / this._bufferService.buffers.active.lines.length) + e[o.position || "full"]));
        }
        _queueRefresh(o, l) {
          this._shouldUpdateDimensions = o || this._shouldUpdateDimensions, this._shouldUpdateAnchor = l || this._shouldUpdateAnchor, this._animationFrame === void 0 && (this._animationFrame = this._coreBrowseService.window.requestAnimationFrame(() => {
            this._refreshDecorations(), this._animationFrame = void 0;
          }));
        }
      };
      s.OverviewRulerRenderer = r = c([_(2, u.IBufferService), _(3, u.IDecorationService), _(4, v.IRenderService), _(5, u.IOptionsService), _(6, v.ICoreBrowserService)], r);
    }, 2950: function(B, s, a) {
      var c = this && this.__decorate || function(u, e, i, t) {
        var r, o = arguments.length, l = o < 3 ? e : t === null ? t = Object.getOwnPropertyDescriptor(e, i) : t;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") l = Reflect.decorate(u, e, i, t);
        else for (var f = u.length - 1; f >= 0; f--) (r = u[f]) && (l = (o < 3 ? r(l) : o > 3 ? r(e, i, l) : r(e, i)) || l);
        return o > 3 && l && Object.defineProperty(e, i, l), l;
      }, _ = this && this.__param || function(u, e) {
        return function(i, t) {
          e(i, t, u);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CompositionHelper = void 0;
      const n = a(4725), d = a(2585), v = a(2584);
      let g = s.CompositionHelper = class {
        get isComposing() {
          return this._isComposing;
        }
        constructor(u, e, i, t, r, o) {
          this._textarea = u, this._compositionView = e, this._bufferService = i, this._optionsService = t, this._coreService = r, this._renderService = o, this._isComposing = !1, this._isSendingComposition = !1, this._compositionPosition = { start: 0, end: 0 }, this._dataAlreadySent = "";
        }
        compositionstart() {
          this._isComposing = !0, this._compositionPosition.start = this._textarea.value.length, this._compositionView.textContent = "", this._dataAlreadySent = "", this._compositionView.classList.add("active");
        }
        compositionupdate(u) {
          this._compositionView.textContent = u.data, this.updateCompositionElements(), setTimeout(() => {
            this._compositionPosition.end = this._textarea.value.length;
          }, 0);
        }
        compositionend() {
          this._finalizeComposition(!0);
        }
        keydown(u) {
          if (this._isComposing || this._isSendingComposition) {
            if (u.keyCode === 229 || u.keyCode === 16 || u.keyCode === 17 || u.keyCode === 18) return !1;
            this._finalizeComposition(!1);
          }
          return u.keyCode !== 229 || (this._handleAnyTextareaChanges(), !1);
        }
        _finalizeComposition(u) {
          if (this._compositionView.classList.remove("active"), this._isComposing = !1, u) {
            const e = { start: this._compositionPosition.start, end: this._compositionPosition.end };
            this._isSendingComposition = !0, setTimeout(() => {
              if (this._isSendingComposition) {
                let i;
                this._isSendingComposition = !1, e.start += this._dataAlreadySent.length, i = this._isComposing ? this._textarea.value.substring(e.start, e.end) : this._textarea.value.substring(e.start), i.length > 0 && this._coreService.triggerDataEvent(i, !0);
              }
            }, 0);
          } else {
            this._isSendingComposition = !1;
            const e = this._textarea.value.substring(this._compositionPosition.start, this._compositionPosition.end);
            this._coreService.triggerDataEvent(e, !0);
          }
        }
        _handleAnyTextareaChanges() {
          const u = this._textarea.value;
          setTimeout(() => {
            if (!this._isComposing) {
              const e = this._textarea.value, i = e.replace(u, "");
              this._dataAlreadySent = i, e.length > u.length ? this._coreService.triggerDataEvent(i, !0) : e.length < u.length ? this._coreService.triggerDataEvent(`${v.C0.DEL}`, !0) : e.length === u.length && e !== u && this._coreService.triggerDataEvent(e, !0);
            }
          }, 0);
        }
        updateCompositionElements(u) {
          if (this._isComposing) {
            if (this._bufferService.buffer.isCursorInViewport) {
              const e = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1), i = this._renderService.dimensions.css.cell.height, t = this._bufferService.buffer.y * this._renderService.dimensions.css.cell.height, r = e * this._renderService.dimensions.css.cell.width;
              this._compositionView.style.left = r + "px", this._compositionView.style.top = t + "px", this._compositionView.style.height = i + "px", this._compositionView.style.lineHeight = i + "px", this._compositionView.style.fontFamily = this._optionsService.rawOptions.fontFamily, this._compositionView.style.fontSize = this._optionsService.rawOptions.fontSize + "px";
              const o = this._compositionView.getBoundingClientRect();
              this._textarea.style.left = r + "px", this._textarea.style.top = t + "px", this._textarea.style.width = Math.max(o.width, 1) + "px", this._textarea.style.height = Math.max(o.height, 1) + "px", this._textarea.style.lineHeight = o.height + "px";
            }
            u || setTimeout(() => this.updateCompositionElements(!0), 0);
          }
        }
      };
      s.CompositionHelper = g = c([_(2, d.IBufferService), _(3, d.IOptionsService), _(4, d.ICoreService), _(5, n.IRenderService)], g);
    }, 9806: (B, s) => {
      function a(c, _, n) {
        const d = n.getBoundingClientRect(), v = c.getComputedStyle(n), g = parseInt(v.getPropertyValue("padding-left")), u = parseInt(v.getPropertyValue("padding-top"));
        return [_.clientX - d.left - g, _.clientY - d.top - u];
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.getCoords = s.getCoordsRelativeToElement = void 0, s.getCoordsRelativeToElement = a, s.getCoords = function(c, _, n, d, v, g, u, e, i) {
        if (!g) return;
        const t = a(c, _, n);
        return t ? (t[0] = Math.ceil((t[0] + (i ? u / 2 : 0)) / u), t[1] = Math.ceil(t[1] / e), t[0] = Math.min(Math.max(t[0], 1), d + (i ? 1 : 0)), t[1] = Math.min(Math.max(t[1], 1), v), t) : void 0;
      };
    }, 9504: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.moveToCellSequence = void 0;
      const c = a(2584);
      function _(e, i, t, r) {
        const o = e - n(e, t), l = i - n(i, t), f = Math.abs(o - l) - function(m, h, p) {
          let w = 0;
          const C = m - n(m, p), y = h - n(h, p);
          for (let x = 0; x < Math.abs(C - y); x++) {
            const A = d(m, h) === "A" ? -1 : 1, O = p.buffer.lines.get(C + A * x);
            O != null && O.isWrapped && w++;
          }
          return w;
        }(e, i, t);
        return u(f, g(d(e, i), r));
      }
      function n(e, i) {
        let t = 0, r = i.buffer.lines.get(e), o = r == null ? void 0 : r.isWrapped;
        for (; o && e >= 0 && e < i.rows; ) t++, r = i.buffer.lines.get(--e), o = r == null ? void 0 : r.isWrapped;
        return t;
      }
      function d(e, i) {
        return e > i ? "A" : "B";
      }
      function v(e, i, t, r, o, l) {
        let f = e, m = i, h = "";
        for (; f !== t || m !== r; ) f += o ? 1 : -1, o && f > l.cols - 1 ? (h += l.buffer.translateBufferLineToString(m, !1, e, f), f = 0, e = 0, m++) : !o && f < 0 && (h += l.buffer.translateBufferLineToString(m, !1, 0, e + 1), f = l.cols - 1, e = f, m--);
        return h + l.buffer.translateBufferLineToString(m, !1, e, f);
      }
      function g(e, i) {
        const t = i ? "O" : "[";
        return c.C0.ESC + t + e;
      }
      function u(e, i) {
        e = Math.floor(e);
        let t = "";
        for (let r = 0; r < e; r++) t += i;
        return t;
      }
      s.moveToCellSequence = function(e, i, t, r) {
        const o = t.buffer.x, l = t.buffer.y;
        if (!t.buffer.hasScrollback) return function(h, p, w, C, y, x) {
          return _(p, C, y, x).length === 0 ? "" : u(v(h, p, h, p - n(p, y), !1, y).length, g("D", x));
        }(o, l, 0, i, t, r) + _(l, i, t, r) + function(h, p, w, C, y, x) {
          let A;
          A = _(p, C, y, x).length > 0 ? C - n(C, y) : p;
          const O = C, P = function(I, b, E, k, L, H) {
            let j;
            return j = _(E, k, L, H).length > 0 ? k - n(k, L) : b, I < E && j <= k || I >= E && j < k ? "C" : "D";
          }(h, p, w, C, y, x);
          return u(v(h, A, w, O, P === "C", y).length, g(P, x));
        }(o, l, e, i, t, r);
        let f;
        if (l === i) return f = o > e ? "D" : "C", u(Math.abs(o - e), g(f, r));
        f = l > i ? "D" : "C";
        const m = Math.abs(l - i);
        return u(function(h, p) {
          return p.cols - h;
        }(l > i ? e : o, t) + (m - 1) * t.cols + 1 + ((l > i ? o : e) - 1), g(f, r));
      };
    }, 1296: function(B, s, a) {
      var c = this && this.__decorate || function(y, x, A, O) {
        var P, I = arguments.length, b = I < 3 ? x : O === null ? O = Object.getOwnPropertyDescriptor(x, A) : O;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") b = Reflect.decorate(y, x, A, O);
        else for (var E = y.length - 1; E >= 0; E--) (P = y[E]) && (b = (I < 3 ? P(b) : I > 3 ? P(x, A, b) : P(x, A)) || b);
        return I > 3 && b && Object.defineProperty(x, A, b), b;
      }, _ = this && this.__param || function(y, x) {
        return function(A, O) {
          x(A, O, y);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DomRenderer = void 0;
      const n = a(3787), d = a(2550), v = a(2223), g = a(6171), u = a(4725), e = a(8055), i = a(8460), t = a(844), r = a(2585), o = "xterm-dom-renderer-owner-", l = "xterm-rows", f = "xterm-fg-", m = "xterm-bg-", h = "xterm-focus", p = "xterm-selection";
      let w = 1, C = s.DomRenderer = class extends t.Disposable {
        constructor(y, x, A, O, P, I, b, E, k, L) {
          super(), this._element = y, this._screenElement = x, this._viewportElement = A, this._linkifier2 = O, this._charSizeService = I, this._optionsService = b, this._bufferService = E, this._coreBrowserService = k, this._themeService = L, this._terminalClass = w++, this._rowElements = [], this.onRequestRedraw = this.register(new i.EventEmitter()).event, this._rowContainer = document.createElement("div"), this._rowContainer.classList.add(l), this._rowContainer.style.lineHeight = "normal", this._rowContainer.setAttribute("aria-hidden", "true"), this._refreshRowElements(this._bufferService.cols, this._bufferService.rows), this._selectionContainer = document.createElement("div"), this._selectionContainer.classList.add(p), this._selectionContainer.setAttribute("aria-hidden", "true"), this.dimensions = (0, g.createRenderDimensions)(), this._updateDimensions(), this.register(this._optionsService.onOptionChange(() => this._handleOptionsChanged())), this.register(this._themeService.onChangeColors((H) => this._injectCss(H))), this._injectCss(this._themeService.colors), this._rowFactory = P.createInstance(n.DomRendererRowFactory, document), this._element.classList.add(o + this._terminalClass), this._screenElement.appendChild(this._rowContainer), this._screenElement.appendChild(this._selectionContainer), this.register(this._linkifier2.onShowLinkUnderline((H) => this._handleLinkHover(H))), this.register(this._linkifier2.onHideLinkUnderline((H) => this._handleLinkLeave(H))), this.register((0, t.toDisposable)(() => {
            this._element.classList.remove(o + this._terminalClass), this._rowContainer.remove(), this._selectionContainer.remove(), this._widthCache.dispose(), this._themeStyleElement.remove(), this._dimensionsStyleElement.remove();
          })), this._widthCache = new d.WidthCache(document), this._widthCache.setFont(this._optionsService.rawOptions.fontFamily, this._optionsService.rawOptions.fontSize, this._optionsService.rawOptions.fontWeight, this._optionsService.rawOptions.fontWeightBold), this._setDefaultSpacing();
        }
        _updateDimensions() {
          const y = this._coreBrowserService.dpr;
          this.dimensions.device.char.width = this._charSizeService.width * y, this.dimensions.device.char.height = Math.ceil(this._charSizeService.height * y), this.dimensions.device.cell.width = this.dimensions.device.char.width + Math.round(this._optionsService.rawOptions.letterSpacing), this.dimensions.device.cell.height = Math.floor(this.dimensions.device.char.height * this._optionsService.rawOptions.lineHeight), this.dimensions.device.char.left = 0, this.dimensions.device.char.top = 0, this.dimensions.device.canvas.width = this.dimensions.device.cell.width * this._bufferService.cols, this.dimensions.device.canvas.height = this.dimensions.device.cell.height * this._bufferService.rows, this.dimensions.css.canvas.width = Math.round(this.dimensions.device.canvas.width / y), this.dimensions.css.canvas.height = Math.round(this.dimensions.device.canvas.height / y), this.dimensions.css.cell.width = this.dimensions.css.canvas.width / this._bufferService.cols, this.dimensions.css.cell.height = this.dimensions.css.canvas.height / this._bufferService.rows;
          for (const A of this._rowElements) A.style.width = `${this.dimensions.css.canvas.width}px`, A.style.height = `${this.dimensions.css.cell.height}px`, A.style.lineHeight = `${this.dimensions.css.cell.height}px`, A.style.overflow = "hidden";
          this._dimensionsStyleElement || (this._dimensionsStyleElement = document.createElement("style"), this._screenElement.appendChild(this._dimensionsStyleElement));
          const x = `${this._terminalSelector} .${l} span { display: inline-block; height: 100%; vertical-align: top;}`;
          this._dimensionsStyleElement.textContent = x, this._selectionContainer.style.height = this._viewportElement.style.height, this._screenElement.style.width = `${this.dimensions.css.canvas.width}px`, this._screenElement.style.height = `${this.dimensions.css.canvas.height}px`;
        }
        _injectCss(y) {
          this._themeStyleElement || (this._themeStyleElement = document.createElement("style"), this._screenElement.appendChild(this._themeStyleElement));
          let x = `${this._terminalSelector} .${l} { color: ${y.foreground.css}; font-family: ${this._optionsService.rawOptions.fontFamily}; font-size: ${this._optionsService.rawOptions.fontSize}px; font-kerning: none; white-space: pre}`;
          x += `${this._terminalSelector} .${l} .xterm-dim { color: ${e.color.multiplyOpacity(y.foreground, 0.5).css};}`, x += `${this._terminalSelector} span:not(.xterm-bold) { font-weight: ${this._optionsService.rawOptions.fontWeight};}${this._terminalSelector} span.xterm-bold { font-weight: ${this._optionsService.rawOptions.fontWeightBold};}${this._terminalSelector} span.xterm-italic { font-style: italic;}`, x += "@keyframes blink_box_shadow_" + this._terminalClass + " { 50% {  border-bottom-style: hidden; }}", x += "@keyframes blink_block_" + this._terminalClass + ` { 0% {  background-color: ${y.cursor.css};  color: ${y.cursorAccent.css}; } 50% {  background-color: inherit;  color: ${y.cursor.css}; }}`, x += `${this._terminalSelector} .${l}.${h} .xterm-cursor.xterm-cursor-blink:not(.xterm-cursor-block) { animation: blink_box_shadow_` + this._terminalClass + ` 1s step-end infinite;}${this._terminalSelector} .${l}.${h} .xterm-cursor.xterm-cursor-blink.xterm-cursor-block { animation: blink_block_` + this._terminalClass + ` 1s step-end infinite;}${this._terminalSelector} .${l} .xterm-cursor.xterm-cursor-block { background-color: ${y.cursor.css}; color: ${y.cursorAccent.css};}${this._terminalSelector} .${l} .xterm-cursor.xterm-cursor-outline { outline: 1px solid ${y.cursor.css}; outline-offset: -1px;}${this._terminalSelector} .${l} .xterm-cursor.xterm-cursor-bar { box-shadow: ${this._optionsService.rawOptions.cursorWidth}px 0 0 ${y.cursor.css} inset;}${this._terminalSelector} .${l} .xterm-cursor.xterm-cursor-underline { border-bottom: 1px ${y.cursor.css}; border-bottom-style: solid; height: calc(100% - 1px);}`, x += `${this._terminalSelector} .${p} { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;}${this._terminalSelector}.focus .${p} div { position: absolute; background-color: ${y.selectionBackgroundOpaque.css};}${this._terminalSelector} .${p} div { position: absolute; background-color: ${y.selectionInactiveBackgroundOpaque.css};}`;
          for (const [A, O] of y.ansi.entries()) x += `${this._terminalSelector} .${f}${A} { color: ${O.css}; }${this._terminalSelector} .${f}${A}.xterm-dim { color: ${e.color.multiplyOpacity(O, 0.5).css}; }${this._terminalSelector} .${m}${A} { background-color: ${O.css}; }`;
          x += `${this._terminalSelector} .${f}${v.INVERTED_DEFAULT_COLOR} { color: ${e.color.opaque(y.background).css}; }${this._terminalSelector} .${f}${v.INVERTED_DEFAULT_COLOR}.xterm-dim { color: ${e.color.multiplyOpacity(e.color.opaque(y.background), 0.5).css}; }${this._terminalSelector} .${m}${v.INVERTED_DEFAULT_COLOR} { background-color: ${y.foreground.css}; }`, this._themeStyleElement.textContent = x;
        }
        _setDefaultSpacing() {
          const y = this.dimensions.css.cell.width - this._widthCache.get("W", !1, !1);
          this._rowContainer.style.letterSpacing = `${y}px`, this._rowFactory.defaultSpacing = y;
        }
        handleDevicePixelRatioChange() {
          this._updateDimensions(), this._widthCache.clear(), this._setDefaultSpacing();
        }
        _refreshRowElements(y, x) {
          for (let A = this._rowElements.length; A <= x; A++) {
            const O = document.createElement("div");
            this._rowContainer.appendChild(O), this._rowElements.push(O);
          }
          for (; this._rowElements.length > x; ) this._rowContainer.removeChild(this._rowElements.pop());
        }
        handleResize(y, x) {
          this._refreshRowElements(y, x), this._updateDimensions();
        }
        handleCharSizeChanged() {
          this._updateDimensions(), this._widthCache.clear(), this._setDefaultSpacing();
        }
        handleBlur() {
          this._rowContainer.classList.remove(h);
        }
        handleFocus() {
          this._rowContainer.classList.add(h), this.renderRows(this._bufferService.buffer.y, this._bufferService.buffer.y);
        }
        handleSelectionChanged(y, x, A) {
          if (this._selectionContainer.replaceChildren(), this._rowFactory.handleSelectionChanged(y, x, A), this.renderRows(0, this._bufferService.rows - 1), !y || !x) return;
          const O = y[1] - this._bufferService.buffer.ydisp, P = x[1] - this._bufferService.buffer.ydisp, I = Math.max(O, 0), b = Math.min(P, this._bufferService.rows - 1);
          if (I >= this._bufferService.rows || b < 0) return;
          const E = document.createDocumentFragment();
          if (A) {
            const k = y[0] > x[0];
            E.appendChild(this._createSelectionElement(I, k ? x[0] : y[0], k ? y[0] : x[0], b - I + 1));
          } else {
            const k = O === I ? y[0] : 0, L = I === P ? x[0] : this._bufferService.cols;
            E.appendChild(this._createSelectionElement(I, k, L));
            const H = b - I - 1;
            if (E.appendChild(this._createSelectionElement(I + 1, 0, this._bufferService.cols, H)), I !== b) {
              const j = P === b ? x[0] : this._bufferService.cols;
              E.appendChild(this._createSelectionElement(b, 0, j));
            }
          }
          this._selectionContainer.appendChild(E);
        }
        _createSelectionElement(y, x, A, O = 1) {
          const P = document.createElement("div");
          return P.style.height = O * this.dimensions.css.cell.height + "px", P.style.top = y * this.dimensions.css.cell.height + "px", P.style.left = x * this.dimensions.css.cell.width + "px", P.style.width = this.dimensions.css.cell.width * (A - x) + "px", P;
        }
        handleCursorMove() {
        }
        _handleOptionsChanged() {
          this._updateDimensions(), this._injectCss(this._themeService.colors), this._widthCache.setFont(this._optionsService.rawOptions.fontFamily, this._optionsService.rawOptions.fontSize, this._optionsService.rawOptions.fontWeight, this._optionsService.rawOptions.fontWeightBold), this._setDefaultSpacing();
        }
        clear() {
          for (const y of this._rowElements) y.replaceChildren();
        }
        renderRows(y, x) {
          const A = this._bufferService.buffer, O = A.ybase + A.y, P = Math.min(A.x, this._bufferService.cols - 1), I = this._optionsService.rawOptions.cursorBlink, b = this._optionsService.rawOptions.cursorStyle, E = this._optionsService.rawOptions.cursorInactiveStyle;
          for (let k = y; k <= x; k++) {
            const L = k + A.ydisp, H = this._rowElements[k], j = A.lines.get(L);
            if (!H || !j) break;
            H.replaceChildren(...this._rowFactory.createRow(j, L, L === O, b, E, P, I, this.dimensions.css.cell.width, this._widthCache, -1, -1));
          }
        }
        get _terminalSelector() {
          return `.${o}${this._terminalClass}`;
        }
        _handleLinkHover(y) {
          this._setCellUnderline(y.x1, y.x2, y.y1, y.y2, y.cols, !0);
        }
        _handleLinkLeave(y) {
          this._setCellUnderline(y.x1, y.x2, y.y1, y.y2, y.cols, !1);
        }
        _setCellUnderline(y, x, A, O, P, I) {
          A < 0 && (y = 0), O < 0 && (x = 0);
          const b = this._bufferService.rows - 1;
          A = Math.max(Math.min(A, b), 0), O = Math.max(Math.min(O, b), 0), P = Math.min(P, this._bufferService.cols);
          const E = this._bufferService.buffer, k = E.ybase + E.y, L = Math.min(E.x, P - 1), H = this._optionsService.rawOptions.cursorBlink, j = this._optionsService.rawOptions.cursorStyle, q = this._optionsService.rawOptions.cursorInactiveStyle;
          for (let K = A; K <= O; ++K) {
            const Q = K + E.ydisp, S = this._rowElements[K], R = E.lines.get(Q);
            if (!S || !R) break;
            S.replaceChildren(...this._rowFactory.createRow(R, Q, Q === k, j, q, L, H, this.dimensions.css.cell.width, this._widthCache, I ? K === A ? y : 0 : -1, I ? (K === O ? x : P) - 1 : -1));
          }
        }
      };
      s.DomRenderer = C = c([_(4, r.IInstantiationService), _(5, u.ICharSizeService), _(6, r.IOptionsService), _(7, r.IBufferService), _(8, u.ICoreBrowserService), _(9, u.IThemeService)], C);
    }, 3787: function(B, s, a) {
      var c = this && this.__decorate || function(f, m, h, p) {
        var w, C = arguments.length, y = C < 3 ? m : p === null ? p = Object.getOwnPropertyDescriptor(m, h) : p;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") y = Reflect.decorate(f, m, h, p);
        else for (var x = f.length - 1; x >= 0; x--) (w = f[x]) && (y = (C < 3 ? w(y) : C > 3 ? w(m, h, y) : w(m, h)) || y);
        return C > 3 && y && Object.defineProperty(m, h, y), y;
      }, _ = this && this.__param || function(f, m) {
        return function(h, p) {
          m(h, p, f);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DomRendererRowFactory = void 0;
      const n = a(2223), d = a(643), v = a(511), g = a(2585), u = a(8055), e = a(4725), i = a(4269), t = a(6171), r = a(3734);
      let o = s.DomRendererRowFactory = class {
        constructor(f, m, h, p, w, C, y) {
          this._document = f, this._characterJoinerService = m, this._optionsService = h, this._coreBrowserService = p, this._coreService = w, this._decorationService = C, this._themeService = y, this._workCell = new v.CellData(), this._columnSelectMode = !1, this.defaultSpacing = 0;
        }
        handleSelectionChanged(f, m, h) {
          this._selectionStart = f, this._selectionEnd = m, this._columnSelectMode = h;
        }
        createRow(f, m, h, p, w, C, y, x, A, O, P) {
          const I = [], b = this._characterJoinerService.getJoinedCharacters(m), E = this._themeService.colors;
          let k, L = f.getNoBgTrimmedLength();
          h && L < C + 1 && (L = C + 1);
          let H = 0, j = "", q = 0, K = 0, Q = 0, S = !1, R = 0, M = !1, T = 0;
          const G = [], $ = O !== -1 && P !== -1;
          for (let Z = 0; Z < L; Z++) {
            f.loadCell(Z, this._workCell);
            let ie = this._workCell.getWidth();
            if (ie === 0) continue;
            let re = !1, de = Z, X = this._workCell;
            if (b.length > 0 && Z === b[0][0]) {
              re = !0;
              const ee = b.shift();
              X = new i.JoinedCellData(this._workCell, f.translateToString(!0, ee[0], ee[1]), ee[1] - ee[0]), de = ee[1] - 1, ie = X.getWidth();
            }
            const _e = this._isCellInSelection(Z, m), ye = h && Z === C, we = $ && Z >= O && Z <= P;
            let Ee = !1;
            this._decorationService.forEachDecorationAtCell(Z, m, void 0, (ee) => {
              Ee = !0;
            });
            let me = X.getChars() || d.WHITESPACE_CELL_CHAR;
            if (me === " " && (X.isUnderline() || X.isOverline()) && (me = " "), T = ie * x - A.get(me, X.isBold(), X.isItalic()), k) {
              if (H && (_e && M || !_e && !M && X.bg === q) && (_e && M && E.selectionForeground || X.fg === K) && X.extended.ext === Q && we === S && T === R && !ye && !re && !Ee) {
                j += me, H++;
                continue;
              }
              H && (k.textContent = j), k = this._document.createElement("span"), H = 0, j = "";
            } else k = this._document.createElement("span");
            if (q = X.bg, K = X.fg, Q = X.extended.ext, S = we, R = T, M = _e, re && C >= Z && C <= de && (C = Z), !this._coreService.isCursorHidden && ye) {
              if (G.push("xterm-cursor"), this._coreBrowserService.isFocused) y && G.push("xterm-cursor-blink"), G.push(p === "bar" ? "xterm-cursor-bar" : p === "underline" ? "xterm-cursor-underline" : "xterm-cursor-block");
              else if (w) switch (w) {
                case "outline":
                  G.push("xterm-cursor-outline");
                  break;
                case "block":
                  G.push("xterm-cursor-block");
                  break;
                case "bar":
                  G.push("xterm-cursor-bar");
                  break;
                case "underline":
                  G.push("xterm-cursor-underline");
              }
            }
            if (X.isBold() && G.push("xterm-bold"), X.isItalic() && G.push("xterm-italic"), X.isDim() && G.push("xterm-dim"), j = X.isInvisible() ? d.WHITESPACE_CELL_CHAR : X.getChars() || d.WHITESPACE_CELL_CHAR, X.isUnderline() && (G.push(`xterm-underline-${X.extended.underlineStyle}`), j === " " && (j = " "), !X.isUnderlineColorDefault())) if (X.isUnderlineColorRGB()) k.style.textDecorationColor = `rgb(${r.AttributeData.toColorRGB(X.getUnderlineColor()).join(",")})`;
            else {
              let ee = X.getUnderlineColor();
              this._optionsService.rawOptions.drawBoldTextInBrightColors && X.isBold() && ee < 8 && (ee += 8), k.style.textDecorationColor = E.ansi[ee].css;
            }
            X.isOverline() && (G.push("xterm-overline"), j === " " && (j = " ")), X.isStrikethrough() && G.push("xterm-strikethrough"), we && (k.style.textDecoration = "underline");
            let se = X.getFgColor(), fe = X.getFgColorMode(), oe = X.getBgColor(), ve = X.getBgColorMode();
            const xe = !!X.isInverse();
            if (xe) {
              const ee = se;
              se = oe, oe = ee;
              const Ue = fe;
              fe = ve, ve = Ue;
            }
            let ae, ke, he, pe = !1;
            switch (this._decorationService.forEachDecorationAtCell(Z, m, void 0, (ee) => {
              ee.options.layer !== "top" && pe || (ee.backgroundColorRGB && (ve = 50331648, oe = ee.backgroundColorRGB.rgba >> 8 & 16777215, ae = ee.backgroundColorRGB), ee.foregroundColorRGB && (fe = 50331648, se = ee.foregroundColorRGB.rgba >> 8 & 16777215, ke = ee.foregroundColorRGB), pe = ee.options.layer === "top");
            }), !pe && _e && (ae = this._coreBrowserService.isFocused ? E.selectionBackgroundOpaque : E.selectionInactiveBackgroundOpaque, oe = ae.rgba >> 8 & 16777215, ve = 50331648, pe = !0, E.selectionForeground && (fe = 50331648, se = E.selectionForeground.rgba >> 8 & 16777215, ke = E.selectionForeground)), pe && G.push("xterm-decoration-top"), ve) {
              case 16777216:
              case 33554432:
                he = E.ansi[oe], G.push(`xterm-bg-${oe}`);
                break;
              case 50331648:
                he = u.rgba.toColor(oe >> 16, oe >> 8 & 255, 255 & oe), this._addStyle(k, `background-color:#${l((oe >>> 0).toString(16), "0", 6)}`);
                break;
              default:
                xe ? (he = E.foreground, G.push(`xterm-bg-${n.INVERTED_DEFAULT_COLOR}`)) : he = E.background;
            }
            switch (ae || X.isDim() && (ae = u.color.multiplyOpacity(he, 0.5)), fe) {
              case 16777216:
              case 33554432:
                X.isBold() && se < 8 && this._optionsService.rawOptions.drawBoldTextInBrightColors && (se += 8), this._applyMinimumContrast(k, he, E.ansi[se], X, ae, void 0) || G.push(`xterm-fg-${se}`);
                break;
              case 50331648:
                const ee = u.rgba.toColor(se >> 16 & 255, se >> 8 & 255, 255 & se);
                this._applyMinimumContrast(k, he, ee, X, ae, ke) || this._addStyle(k, `color:#${l(se.toString(16), "0", 6)}`);
                break;
              default:
                this._applyMinimumContrast(k, he, E.foreground, X, ae, void 0) || xe && G.push(`xterm-fg-${n.INVERTED_DEFAULT_COLOR}`);
            }
            G.length && (k.className = G.join(" "), G.length = 0), ye || re || Ee ? k.textContent = j : H++, T !== this.defaultSpacing && (k.style.letterSpacing = `${T}px`), I.push(k), Z = de;
          }
          return k && H && (k.textContent = j), I;
        }
        _applyMinimumContrast(f, m, h, p, w, C) {
          if (this._optionsService.rawOptions.minimumContrastRatio === 1 || (0, t.excludeFromContrastRatioDemands)(p.getCode())) return !1;
          const y = this._getContrastCache(p);
          let x;
          if (w || C || (x = y.getColor(m.rgba, h.rgba)), x === void 0) {
            const A = this._optionsService.rawOptions.minimumContrastRatio / (p.isDim() ? 2 : 1);
            x = u.color.ensureContrastRatio(w || m, C || h, A), y.setColor((w || m).rgba, (C || h).rgba, x ?? null);
          }
          return !!x && (this._addStyle(f, `color:${x.css}`), !0);
        }
        _getContrastCache(f) {
          return f.isDim() ? this._themeService.colors.halfContrastCache : this._themeService.colors.contrastCache;
        }
        _addStyle(f, m) {
          f.setAttribute("style", `${f.getAttribute("style") || ""}${m};`);
        }
        _isCellInSelection(f, m) {
          const h = this._selectionStart, p = this._selectionEnd;
          return !(!h || !p) && (this._columnSelectMode ? h[0] <= p[0] ? f >= h[0] && m >= h[1] && f < p[0] && m <= p[1] : f < h[0] && m >= h[1] && f >= p[0] && m <= p[1] : m > h[1] && m < p[1] || h[1] === p[1] && m === h[1] && f >= h[0] && f < p[0] || h[1] < p[1] && m === p[1] && f < p[0] || h[1] < p[1] && m === h[1] && f >= h[0]);
        }
      };
      function l(f, m, h) {
        for (; f.length < h; ) f = m + f;
        return f;
      }
      s.DomRendererRowFactory = o = c([_(1, e.ICharacterJoinerService), _(2, g.IOptionsService), _(3, e.ICoreBrowserService), _(4, g.ICoreService), _(5, g.IDecorationService), _(6, e.IThemeService)], o);
    }, 2550: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.WidthCache = void 0, s.WidthCache = class {
        constructor(a) {
          this._flat = new Float32Array(256), this._font = "", this._fontSize = 0, this._weight = "normal", this._weightBold = "bold", this._measureElements = [], this._container = a.createElement("div"), this._container.style.position = "absolute", this._container.style.top = "-50000px", this._container.style.width = "50000px", this._container.style.whiteSpace = "pre", this._container.style.fontKerning = "none";
          const c = a.createElement("span"), _ = a.createElement("span");
          _.style.fontWeight = "bold";
          const n = a.createElement("span");
          n.style.fontStyle = "italic";
          const d = a.createElement("span");
          d.style.fontWeight = "bold", d.style.fontStyle = "italic", this._measureElements = [c, _, n, d], this._container.appendChild(c), this._container.appendChild(_), this._container.appendChild(n), this._container.appendChild(d), a.body.appendChild(this._container), this.clear();
        }
        dispose() {
          this._container.remove(), this._measureElements.length = 0, this._holey = void 0;
        }
        clear() {
          this._flat.fill(-9999), this._holey = /* @__PURE__ */ new Map();
        }
        setFont(a, c, _, n) {
          a === this._font && c === this._fontSize && _ === this._weight && n === this._weightBold || (this._font = a, this._fontSize = c, this._weight = _, this._weightBold = n, this._container.style.fontFamily = this._font, this._container.style.fontSize = `${this._fontSize}px`, this._measureElements[0].style.fontWeight = `${_}`, this._measureElements[1].style.fontWeight = `${n}`, this._measureElements[2].style.fontWeight = `${_}`, this._measureElements[3].style.fontWeight = `${n}`, this.clear());
        }
        get(a, c, _) {
          let n = 0;
          if (!c && !_ && a.length === 1 && (n = a.charCodeAt(0)) < 256) return this._flat[n] !== -9999 ? this._flat[n] : this._flat[n] = this._measure(a, 0);
          let d = a;
          c && (d += "B"), _ && (d += "I");
          let v = this._holey.get(d);
          if (v === void 0) {
            let g = 0;
            c && (g |= 1), _ && (g |= 2), v = this._measure(a, g), this._holey.set(d, v);
          }
          return v;
        }
        _measure(a, c) {
          const _ = this._measureElements[c];
          return _.textContent = a.repeat(32), _.offsetWidth / 32;
        }
      };
    }, 2223: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.TEXT_BASELINE = s.DIM_OPACITY = s.INVERTED_DEFAULT_COLOR = void 0;
      const c = a(6114);
      s.INVERTED_DEFAULT_COLOR = 257, s.DIM_OPACITY = 0.5, s.TEXT_BASELINE = c.isFirefox || c.isLegacyEdge ? "bottom" : "ideographic";
    }, 6171: (B, s) => {
      function a(c) {
        return 57508 <= c && c <= 57558;
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.createRenderDimensions = s.excludeFromContrastRatioDemands = s.isRestrictedPowerlineGlyph = s.isPowerlineGlyph = s.throwIfFalsy = void 0, s.throwIfFalsy = function(c) {
        if (!c) throw new Error("value must not be falsy");
        return c;
      }, s.isPowerlineGlyph = a, s.isRestrictedPowerlineGlyph = function(c) {
        return 57520 <= c && c <= 57527;
      }, s.excludeFromContrastRatioDemands = function(c) {
        return a(c) || function(_) {
          return 9472 <= _ && _ <= 9631;
        }(c);
      }, s.createRenderDimensions = function() {
        return { css: { canvas: { width: 0, height: 0 }, cell: { width: 0, height: 0 } }, device: { canvas: { width: 0, height: 0 }, cell: { width: 0, height: 0 }, char: { width: 0, height: 0, left: 0, top: 0 } } };
      };
    }, 456: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.SelectionModel = void 0, s.SelectionModel = class {
        constructor(a) {
          this._bufferService = a, this.isSelectAllActive = !1, this.selectionStartLength = 0;
        }
        clearSelection() {
          this.selectionStart = void 0, this.selectionEnd = void 0, this.isSelectAllActive = !1, this.selectionStartLength = 0;
        }
        get finalSelectionStart() {
          return this.isSelectAllActive ? [0, 0] : this.selectionEnd && this.selectionStart && this.areSelectionValuesReversed() ? this.selectionEnd : this.selectionStart;
        }
        get finalSelectionEnd() {
          if (this.isSelectAllActive) return [this._bufferService.cols, this._bufferService.buffer.ybase + this._bufferService.rows - 1];
          if (this.selectionStart) {
            if (!this.selectionEnd || this.areSelectionValuesReversed()) {
              const a = this.selectionStart[0] + this.selectionStartLength;
              return a > this._bufferService.cols ? a % this._bufferService.cols == 0 ? [this._bufferService.cols, this.selectionStart[1] + Math.floor(a / this._bufferService.cols) - 1] : [a % this._bufferService.cols, this.selectionStart[1] + Math.floor(a / this._bufferService.cols)] : [a, this.selectionStart[1]];
            }
            if (this.selectionStartLength && this.selectionEnd[1] === this.selectionStart[1]) {
              const a = this.selectionStart[0] + this.selectionStartLength;
              return a > this._bufferService.cols ? [a % this._bufferService.cols, this.selectionStart[1] + Math.floor(a / this._bufferService.cols)] : [Math.max(a, this.selectionEnd[0]), this.selectionEnd[1]];
            }
            return this.selectionEnd;
          }
        }
        areSelectionValuesReversed() {
          const a = this.selectionStart, c = this.selectionEnd;
          return !(!a || !c) && (a[1] > c[1] || a[1] === c[1] && a[0] > c[0]);
        }
        handleTrim(a) {
          return this.selectionStart && (this.selectionStart[1] -= a), this.selectionEnd && (this.selectionEnd[1] -= a), this.selectionEnd && this.selectionEnd[1] < 0 ? (this.clearSelection(), !0) : (this.selectionStart && this.selectionStart[1] < 0 && (this.selectionStart[1] = 0), !1);
        }
      };
    }, 428: function(B, s, a) {
      var c = this && this.__decorate || function(e, i, t, r) {
        var o, l = arguments.length, f = l < 3 ? i : r === null ? r = Object.getOwnPropertyDescriptor(i, t) : r;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, r);
        else for (var m = e.length - 1; m >= 0; m--) (o = e[m]) && (f = (l < 3 ? o(f) : l > 3 ? o(i, t, f) : o(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, r) {
          i(t, r, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CharSizeService = void 0;
      const n = a(2585), d = a(8460), v = a(844);
      let g = s.CharSizeService = class extends v.Disposable {
        get hasValidSize() {
          return this.width > 0 && this.height > 0;
        }
        constructor(e, i, t) {
          super(), this._optionsService = t, this.width = 0, this.height = 0, this._onCharSizeChange = this.register(new d.EventEmitter()), this.onCharSizeChange = this._onCharSizeChange.event, this._measureStrategy = new u(e, i, this._optionsService), this.register(this._optionsService.onMultipleOptionChange(["fontFamily", "fontSize"], () => this.measure()));
        }
        measure() {
          const e = this._measureStrategy.measure();
          e.width === this.width && e.height === this.height || (this.width = e.width, this.height = e.height, this._onCharSizeChange.fire());
        }
      };
      s.CharSizeService = g = c([_(2, n.IOptionsService)], g);
      class u {
        constructor(i, t, r) {
          this._document = i, this._parentElement = t, this._optionsService = r, this._result = { width: 0, height: 0 }, this._measureElement = this._document.createElement("span"), this._measureElement.classList.add("xterm-char-measure-element"), this._measureElement.textContent = "W".repeat(32), this._measureElement.setAttribute("aria-hidden", "true"), this._measureElement.style.whiteSpace = "pre", this._measureElement.style.fontKerning = "none", this._parentElement.appendChild(this._measureElement);
        }
        measure() {
          this._measureElement.style.fontFamily = this._optionsService.rawOptions.fontFamily, this._measureElement.style.fontSize = `${this._optionsService.rawOptions.fontSize}px`;
          const i = { height: Number(this._measureElement.offsetHeight), width: Number(this._measureElement.offsetWidth) };
          return i.width !== 0 && i.height !== 0 && (this._result.width = i.width / 32, this._result.height = Math.ceil(i.height)), this._result;
        }
      }
    }, 4269: function(B, s, a) {
      var c = this && this.__decorate || function(i, t, r, o) {
        var l, f = arguments.length, m = f < 3 ? t : o === null ? o = Object.getOwnPropertyDescriptor(t, r) : o;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") m = Reflect.decorate(i, t, r, o);
        else for (var h = i.length - 1; h >= 0; h--) (l = i[h]) && (m = (f < 3 ? l(m) : f > 3 ? l(t, r, m) : l(t, r)) || m);
        return f > 3 && m && Object.defineProperty(t, r, m), m;
      }, _ = this && this.__param || function(i, t) {
        return function(r, o) {
          t(r, o, i);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CharacterJoinerService = s.JoinedCellData = void 0;
      const n = a(3734), d = a(643), v = a(511), g = a(2585);
      class u extends n.AttributeData {
        constructor(t, r, o) {
          super(), this.content = 0, this.combinedData = "", this.fg = t.fg, this.bg = t.bg, this.combinedData = r, this._width = o;
        }
        isCombined() {
          return 2097152;
        }
        getWidth() {
          return this._width;
        }
        getChars() {
          return this.combinedData;
        }
        getCode() {
          return 2097151;
        }
        setFromCharData(t) {
          throw new Error("not implemented");
        }
        getAsCharData() {
          return [this.fg, this.getChars(), this.getWidth(), this.getCode()];
        }
      }
      s.JoinedCellData = u;
      let e = s.CharacterJoinerService = class Be {
        constructor(t) {
          this._bufferService = t, this._characterJoiners = [], this._nextCharacterJoinerId = 0, this._workCell = new v.CellData();
        }
        register(t) {
          const r = { id: this._nextCharacterJoinerId++, handler: t };
          return this._characterJoiners.push(r), r.id;
        }
        deregister(t) {
          for (let r = 0; r < this._characterJoiners.length; r++) if (this._characterJoiners[r].id === t) return this._characterJoiners.splice(r, 1), !0;
          return !1;
        }
        getJoinedCharacters(t) {
          if (this._characterJoiners.length === 0) return [];
          const r = this._bufferService.buffer.lines.get(t);
          if (!r || r.length === 0) return [];
          const o = [], l = r.translateToString(!0);
          let f = 0, m = 0, h = 0, p = r.getFg(0), w = r.getBg(0);
          for (let C = 0; C < r.getTrimmedLength(); C++) if (r.loadCell(C, this._workCell), this._workCell.getWidth() !== 0) {
            if (this._workCell.fg !== p || this._workCell.bg !== w) {
              if (C - f > 1) {
                const y = this._getJoinedRanges(l, h, m, r, f);
                for (let x = 0; x < y.length; x++) o.push(y[x]);
              }
              f = C, h = m, p = this._workCell.fg, w = this._workCell.bg;
            }
            m += this._workCell.getChars().length || d.WHITESPACE_CELL_CHAR.length;
          }
          if (this._bufferService.cols - f > 1) {
            const C = this._getJoinedRanges(l, h, m, r, f);
            for (let y = 0; y < C.length; y++) o.push(C[y]);
          }
          return o;
        }
        _getJoinedRanges(t, r, o, l, f) {
          const m = t.substring(r, o);
          let h = [];
          try {
            h = this._characterJoiners[0].handler(m);
          } catch (p) {
            console.error(p);
          }
          for (let p = 1; p < this._characterJoiners.length; p++) try {
            const w = this._characterJoiners[p].handler(m);
            for (let C = 0; C < w.length; C++) Be._mergeRanges(h, w[C]);
          } catch (w) {
            console.error(w);
          }
          return this._stringRangesToCellRanges(h, l, f), h;
        }
        _stringRangesToCellRanges(t, r, o) {
          let l = 0, f = !1, m = 0, h = t[l];
          if (h) {
            for (let p = o; p < this._bufferService.cols; p++) {
              const w = r.getWidth(p), C = r.getString(p).length || d.WHITESPACE_CELL_CHAR.length;
              if (w !== 0) {
                if (!f && h[0] <= m && (h[0] = p, f = !0), h[1] <= m) {
                  if (h[1] = p, h = t[++l], !h) break;
                  h[0] <= m ? (h[0] = p, f = !0) : f = !1;
                }
                m += C;
              }
            }
            h && (h[1] = this._bufferService.cols);
          }
        }
        static _mergeRanges(t, r) {
          let o = !1;
          for (let l = 0; l < t.length; l++) {
            const f = t[l];
            if (o) {
              if (r[1] <= f[0]) return t[l - 1][1] = r[1], t;
              if (r[1] <= f[1]) return t[l - 1][1] = Math.max(r[1], f[1]), t.splice(l, 1), t;
              t.splice(l, 1), l--;
            } else {
              if (r[1] <= f[0]) return t.splice(l, 0, r), t;
              if (r[1] <= f[1]) return f[0] = Math.min(r[0], f[0]), t;
              r[0] < f[1] && (f[0] = Math.min(r[0], f[0]), o = !0);
            }
          }
          return o ? t[t.length - 1][1] = r[1] : t.push(r), t;
        }
      };
      s.CharacterJoinerService = e = c([_(0, g.IBufferService)], e);
    }, 5114: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CoreBrowserService = void 0, s.CoreBrowserService = class {
        constructor(a, c) {
          this._textarea = a, this.window = c, this._isFocused = !1, this._cachedIsFocused = void 0, this._textarea.addEventListener("focus", () => this._isFocused = !0), this._textarea.addEventListener("blur", () => this._isFocused = !1);
        }
        get dpr() {
          return this.window.devicePixelRatio;
        }
        get isFocused() {
          return this._cachedIsFocused === void 0 && (this._cachedIsFocused = this._isFocused && this._textarea.ownerDocument.hasFocus(), queueMicrotask(() => this._cachedIsFocused = void 0)), this._cachedIsFocused;
        }
      };
    }, 8934: function(B, s, a) {
      var c = this && this.__decorate || function(g, u, e, i) {
        var t, r = arguments.length, o = r < 3 ? u : i === null ? i = Object.getOwnPropertyDescriptor(u, e) : i;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") o = Reflect.decorate(g, u, e, i);
        else for (var l = g.length - 1; l >= 0; l--) (t = g[l]) && (o = (r < 3 ? t(o) : r > 3 ? t(u, e, o) : t(u, e)) || o);
        return r > 3 && o && Object.defineProperty(u, e, o), o;
      }, _ = this && this.__param || function(g, u) {
        return function(e, i) {
          u(e, i, g);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.MouseService = void 0;
      const n = a(4725), d = a(9806);
      let v = s.MouseService = class {
        constructor(g, u) {
          this._renderService = g, this._charSizeService = u;
        }
        getCoords(g, u, e, i, t) {
          return (0, d.getCoords)(window, g, u, e, i, this._charSizeService.hasValidSize, this._renderService.dimensions.css.cell.width, this._renderService.dimensions.css.cell.height, t);
        }
        getMouseReportCoords(g, u) {
          const e = (0, d.getCoordsRelativeToElement)(window, g, u);
          if (this._charSizeService.hasValidSize) return e[0] = Math.min(Math.max(e[0], 0), this._renderService.dimensions.css.canvas.width - 1), e[1] = Math.min(Math.max(e[1], 0), this._renderService.dimensions.css.canvas.height - 1), { col: Math.floor(e[0] / this._renderService.dimensions.css.cell.width), row: Math.floor(e[1] / this._renderService.dimensions.css.cell.height), x: Math.floor(e[0]), y: Math.floor(e[1]) };
        }
      };
      s.MouseService = v = c([_(0, n.IRenderService), _(1, n.ICharSizeService)], v);
    }, 3230: function(B, s, a) {
      var c = this && this.__decorate || function(o, l, f, m) {
        var h, p = arguments.length, w = p < 3 ? l : m === null ? m = Object.getOwnPropertyDescriptor(l, f) : m;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") w = Reflect.decorate(o, l, f, m);
        else for (var C = o.length - 1; C >= 0; C--) (h = o[C]) && (w = (p < 3 ? h(w) : p > 3 ? h(l, f, w) : h(l, f)) || w);
        return p > 3 && w && Object.defineProperty(l, f, w), w;
      }, _ = this && this.__param || function(o, l) {
        return function(f, m) {
          l(f, m, o);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.RenderService = void 0;
      const n = a(3656), d = a(6193), v = a(5596), g = a(4725), u = a(8460), e = a(844), i = a(7226), t = a(2585);
      let r = s.RenderService = class extends e.Disposable {
        get dimensions() {
          return this._renderer.value.dimensions;
        }
        constructor(o, l, f, m, h, p, w, C) {
          if (super(), this._rowCount = o, this._charSizeService = m, this._renderer = this.register(new e.MutableDisposable()), this._pausedResizeTask = new i.DebouncedIdleTask(), this._isPaused = !1, this._needsFullRefresh = !1, this._isNextRenderRedrawOnly = !0, this._needsSelectionRefresh = !1, this._canvasWidth = 0, this._canvasHeight = 0, this._selectionState = { start: void 0, end: void 0, columnSelectMode: !1 }, this._onDimensionsChange = this.register(new u.EventEmitter()), this.onDimensionsChange = this._onDimensionsChange.event, this._onRenderedViewportChange = this.register(new u.EventEmitter()), this.onRenderedViewportChange = this._onRenderedViewportChange.event, this._onRender = this.register(new u.EventEmitter()), this.onRender = this._onRender.event, this._onRefreshRequest = this.register(new u.EventEmitter()), this.onRefreshRequest = this._onRefreshRequest.event, this._renderDebouncer = new d.RenderDebouncer(w.window, (y, x) => this._renderRows(y, x)), this.register(this._renderDebouncer), this._screenDprMonitor = new v.ScreenDprMonitor(w.window), this._screenDprMonitor.setListener(() => this.handleDevicePixelRatioChange()), this.register(this._screenDprMonitor), this.register(p.onResize(() => this._fullRefresh())), this.register(p.buffers.onBufferActivate(() => {
            var y;
            return (y = this._renderer.value) === null || y === void 0 ? void 0 : y.clear();
          })), this.register(f.onOptionChange(() => this._handleOptionsChanged())), this.register(this._charSizeService.onCharSizeChange(() => this.handleCharSizeChanged())), this.register(h.onDecorationRegistered(() => this._fullRefresh())), this.register(h.onDecorationRemoved(() => this._fullRefresh())), this.register(f.onMultipleOptionChange(["customGlyphs", "drawBoldTextInBrightColors", "letterSpacing", "lineHeight", "fontFamily", "fontSize", "fontWeight", "fontWeightBold", "minimumContrastRatio"], () => {
            this.clear(), this.handleResize(p.cols, p.rows), this._fullRefresh();
          })), this.register(f.onMultipleOptionChange(["cursorBlink", "cursorStyle"], () => this.refreshRows(p.buffer.y, p.buffer.y, !0))), this.register((0, n.addDisposableDomListener)(w.window, "resize", () => this.handleDevicePixelRatioChange())), this.register(C.onChangeColors(() => this._fullRefresh())), "IntersectionObserver" in w.window) {
            const y = new w.window.IntersectionObserver((x) => this._handleIntersectionChange(x[x.length - 1]), { threshold: 0 });
            y.observe(l), this.register({ dispose: () => y.disconnect() });
          }
        }
        _handleIntersectionChange(o) {
          this._isPaused = o.isIntersecting === void 0 ? o.intersectionRatio === 0 : !o.isIntersecting, this._isPaused || this._charSizeService.hasValidSize || this._charSizeService.measure(), !this._isPaused && this._needsFullRefresh && (this._pausedResizeTask.flush(), this.refreshRows(0, this._rowCount - 1), this._needsFullRefresh = !1);
        }
        refreshRows(o, l, f = !1) {
          this._isPaused ? this._needsFullRefresh = !0 : (f || (this._isNextRenderRedrawOnly = !1), this._renderDebouncer.refresh(o, l, this._rowCount));
        }
        _renderRows(o, l) {
          this._renderer.value && (o = Math.min(o, this._rowCount - 1), l = Math.min(l, this._rowCount - 1), this._renderer.value.renderRows(o, l), this._needsSelectionRefresh && (this._renderer.value.handleSelectionChanged(this._selectionState.start, this._selectionState.end, this._selectionState.columnSelectMode), this._needsSelectionRefresh = !1), this._isNextRenderRedrawOnly || this._onRenderedViewportChange.fire({ start: o, end: l }), this._onRender.fire({ start: o, end: l }), this._isNextRenderRedrawOnly = !0);
        }
        resize(o, l) {
          this._rowCount = l, this._fireOnCanvasResize();
        }
        _handleOptionsChanged() {
          this._renderer.value && (this.refreshRows(0, this._rowCount - 1), this._fireOnCanvasResize());
        }
        _fireOnCanvasResize() {
          this._renderer.value && (this._renderer.value.dimensions.css.canvas.width === this._canvasWidth && this._renderer.value.dimensions.css.canvas.height === this._canvasHeight || this._onDimensionsChange.fire(this._renderer.value.dimensions));
        }
        hasRenderer() {
          return !!this._renderer.value;
        }
        setRenderer(o) {
          this._renderer.value = o, this._renderer.value.onRequestRedraw((l) => this.refreshRows(l.start, l.end, !0)), this._needsSelectionRefresh = !0, this._fullRefresh();
        }
        addRefreshCallback(o) {
          return this._renderDebouncer.addRefreshCallback(o);
        }
        _fullRefresh() {
          this._isPaused ? this._needsFullRefresh = !0 : this.refreshRows(0, this._rowCount - 1);
        }
        clearTextureAtlas() {
          var o, l;
          this._renderer.value && ((l = (o = this._renderer.value).clearTextureAtlas) === null || l === void 0 || l.call(o), this._fullRefresh());
        }
        handleDevicePixelRatioChange() {
          this._charSizeService.measure(), this._renderer.value && (this._renderer.value.handleDevicePixelRatioChange(), this.refreshRows(0, this._rowCount - 1));
        }
        handleResize(o, l) {
          this._renderer.value && (this._isPaused ? this._pausedResizeTask.set(() => this._renderer.value.handleResize(o, l)) : this._renderer.value.handleResize(o, l), this._fullRefresh());
        }
        handleCharSizeChanged() {
          var o;
          (o = this._renderer.value) === null || o === void 0 || o.handleCharSizeChanged();
        }
        handleBlur() {
          var o;
          (o = this._renderer.value) === null || o === void 0 || o.handleBlur();
        }
        handleFocus() {
          var o;
          (o = this._renderer.value) === null || o === void 0 || o.handleFocus();
        }
        handleSelectionChanged(o, l, f) {
          var m;
          this._selectionState.start = o, this._selectionState.end = l, this._selectionState.columnSelectMode = f, (m = this._renderer.value) === null || m === void 0 || m.handleSelectionChanged(o, l, f);
        }
        handleCursorMove() {
          var o;
          (o = this._renderer.value) === null || o === void 0 || o.handleCursorMove();
        }
        clear() {
          var o;
          (o = this._renderer.value) === null || o === void 0 || o.clear();
        }
      };
      s.RenderService = r = c([_(2, t.IOptionsService), _(3, g.ICharSizeService), _(4, t.IDecorationService), _(5, t.IBufferService), _(6, g.ICoreBrowserService), _(7, g.IThemeService)], r);
    }, 9312: function(B, s, a) {
      var c = this && this.__decorate || function(h, p, w, C) {
        var y, x = arguments.length, A = x < 3 ? p : C === null ? C = Object.getOwnPropertyDescriptor(p, w) : C;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") A = Reflect.decorate(h, p, w, C);
        else for (var O = h.length - 1; O >= 0; O--) (y = h[O]) && (A = (x < 3 ? y(A) : x > 3 ? y(p, w, A) : y(p, w)) || A);
        return x > 3 && A && Object.defineProperty(p, w, A), A;
      }, _ = this && this.__param || function(h, p) {
        return function(w, C) {
          p(w, C, h);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.SelectionService = void 0;
      const n = a(9806), d = a(9504), v = a(456), g = a(4725), u = a(8460), e = a(844), i = a(6114), t = a(4841), r = a(511), o = a(2585), l = " ", f = new RegExp(l, "g");
      let m = s.SelectionService = class extends e.Disposable {
        constructor(h, p, w, C, y, x, A, O, P) {
          super(), this._element = h, this._screenElement = p, this._linkifier = w, this._bufferService = C, this._coreService = y, this._mouseService = x, this._optionsService = A, this._renderService = O, this._coreBrowserService = P, this._dragScrollAmount = 0, this._enabled = !0, this._workCell = new r.CellData(), this._mouseDownTimeStamp = 0, this._oldHasSelection = !1, this._oldSelectionStart = void 0, this._oldSelectionEnd = void 0, this._onLinuxMouseSelection = this.register(new u.EventEmitter()), this.onLinuxMouseSelection = this._onLinuxMouseSelection.event, this._onRedrawRequest = this.register(new u.EventEmitter()), this.onRequestRedraw = this._onRedrawRequest.event, this._onSelectionChange = this.register(new u.EventEmitter()), this.onSelectionChange = this._onSelectionChange.event, this._onRequestScrollLines = this.register(new u.EventEmitter()), this.onRequestScrollLines = this._onRequestScrollLines.event, this._mouseMoveListener = (I) => this._handleMouseMove(I), this._mouseUpListener = (I) => this._handleMouseUp(I), this._coreService.onUserInput(() => {
            this.hasSelection && this.clearSelection();
          }), this._trimListener = this._bufferService.buffer.lines.onTrim((I) => this._handleTrim(I)), this.register(this._bufferService.buffers.onBufferActivate((I) => this._handleBufferActivate(I))), this.enable(), this._model = new v.SelectionModel(this._bufferService), this._activeSelectionMode = 0, this.register((0, e.toDisposable)(() => {
            this._removeMouseDownListeners();
          }));
        }
        reset() {
          this.clearSelection();
        }
        disable() {
          this.clearSelection(), this._enabled = !1;
        }
        enable() {
          this._enabled = !0;
        }
        get selectionStart() {
          return this._model.finalSelectionStart;
        }
        get selectionEnd() {
          return this._model.finalSelectionEnd;
        }
        get hasSelection() {
          const h = this._model.finalSelectionStart, p = this._model.finalSelectionEnd;
          return !(!h || !p || h[0] === p[0] && h[1] === p[1]);
        }
        get selectionText() {
          const h = this._model.finalSelectionStart, p = this._model.finalSelectionEnd;
          if (!h || !p) return "";
          const w = this._bufferService.buffer, C = [];
          if (this._activeSelectionMode === 3) {
            if (h[0] === p[0]) return "";
            const y = h[0] < p[0] ? h[0] : p[0], x = h[0] < p[0] ? p[0] : h[0];
            for (let A = h[1]; A <= p[1]; A++) {
              const O = w.translateBufferLineToString(A, !0, y, x);
              C.push(O);
            }
          } else {
            const y = h[1] === p[1] ? p[0] : void 0;
            C.push(w.translateBufferLineToString(h[1], !0, h[0], y));
            for (let x = h[1] + 1; x <= p[1] - 1; x++) {
              const A = w.lines.get(x), O = w.translateBufferLineToString(x, !0);
              A != null && A.isWrapped ? C[C.length - 1] += O : C.push(O);
            }
            if (h[1] !== p[1]) {
              const x = w.lines.get(p[1]), A = w.translateBufferLineToString(p[1], !0, 0, p[0]);
              x && x.isWrapped ? C[C.length - 1] += A : C.push(A);
            }
          }
          return C.map((y) => y.replace(f, " ")).join(i.isWindows ? `\r
` : `
`);
        }
        clearSelection() {
          this._model.clearSelection(), this._removeMouseDownListeners(), this.refresh(), this._onSelectionChange.fire();
        }
        refresh(h) {
          this._refreshAnimationFrame || (this._refreshAnimationFrame = this._coreBrowserService.window.requestAnimationFrame(() => this._refresh())), i.isLinux && h && this.selectionText.length && this._onLinuxMouseSelection.fire(this.selectionText);
        }
        _refresh() {
          this._refreshAnimationFrame = void 0, this._onRedrawRequest.fire({ start: this._model.finalSelectionStart, end: this._model.finalSelectionEnd, columnSelectMode: this._activeSelectionMode === 3 });
        }
        _isClickInSelection(h) {
          const p = this._getMouseBufferCoords(h), w = this._model.finalSelectionStart, C = this._model.finalSelectionEnd;
          return !!(w && C && p) && this._areCoordsInSelection(p, w, C);
        }
        isCellInSelection(h, p) {
          const w = this._model.finalSelectionStart, C = this._model.finalSelectionEnd;
          return !(!w || !C) && this._areCoordsInSelection([h, p], w, C);
        }
        _areCoordsInSelection(h, p, w) {
          return h[1] > p[1] && h[1] < w[1] || p[1] === w[1] && h[1] === p[1] && h[0] >= p[0] && h[0] < w[0] || p[1] < w[1] && h[1] === w[1] && h[0] < w[0] || p[1] < w[1] && h[1] === p[1] && h[0] >= p[0];
        }
        _selectWordAtCursor(h, p) {
          var w, C;
          const y = (C = (w = this._linkifier.currentLink) === null || w === void 0 ? void 0 : w.link) === null || C === void 0 ? void 0 : C.range;
          if (y) return this._model.selectionStart = [y.start.x - 1, y.start.y - 1], this._model.selectionStartLength = (0, t.getRangeLength)(y, this._bufferService.cols), this._model.selectionEnd = void 0, !0;
          const x = this._getMouseBufferCoords(h);
          return !!x && (this._selectWordAt(x, p), this._model.selectionEnd = void 0, !0);
        }
        selectAll() {
          this._model.isSelectAllActive = !0, this.refresh(), this._onSelectionChange.fire();
        }
        selectLines(h, p) {
          this._model.clearSelection(), h = Math.max(h, 0), p = Math.min(p, this._bufferService.buffer.lines.length - 1), this._model.selectionStart = [0, h], this._model.selectionEnd = [this._bufferService.cols, p], this.refresh(), this._onSelectionChange.fire();
        }
        _handleTrim(h) {
          this._model.handleTrim(h) && this.refresh();
        }
        _getMouseBufferCoords(h) {
          const p = this._mouseService.getCoords(h, this._screenElement, this._bufferService.cols, this._bufferService.rows, !0);
          if (p) return p[0]--, p[1]--, p[1] += this._bufferService.buffer.ydisp, p;
        }
        _getMouseEventScrollAmount(h) {
          let p = (0, n.getCoordsRelativeToElement)(this._coreBrowserService.window, h, this._screenElement)[1];
          const w = this._renderService.dimensions.css.canvas.height;
          return p >= 0 && p <= w ? 0 : (p > w && (p -= w), p = Math.min(Math.max(p, -50), 50), p /= 50, p / Math.abs(p) + Math.round(14 * p));
        }
        shouldForceSelection(h) {
          return i.isMac ? h.altKey && this._optionsService.rawOptions.macOptionClickForcesSelection : h.shiftKey;
        }
        handleMouseDown(h) {
          if (this._mouseDownTimeStamp = h.timeStamp, (h.button !== 2 || !this.hasSelection) && h.button === 0) {
            if (!this._enabled) {
              if (!this.shouldForceSelection(h)) return;
              h.stopPropagation();
            }
            h.preventDefault(), this._dragScrollAmount = 0, this._enabled && h.shiftKey ? this._handleIncrementalClick(h) : h.detail === 1 ? this._handleSingleClick(h) : h.detail === 2 ? this._handleDoubleClick(h) : h.detail === 3 && this._handleTripleClick(h), this._addMouseDownListeners(), this.refresh(!0);
          }
        }
        _addMouseDownListeners() {
          this._screenElement.ownerDocument && (this._screenElement.ownerDocument.addEventListener("mousemove", this._mouseMoveListener), this._screenElement.ownerDocument.addEventListener("mouseup", this._mouseUpListener)), this._dragScrollIntervalTimer = this._coreBrowserService.window.setInterval(() => this._dragScroll(), 50);
        }
        _removeMouseDownListeners() {
          this._screenElement.ownerDocument && (this._screenElement.ownerDocument.removeEventListener("mousemove", this._mouseMoveListener), this._screenElement.ownerDocument.removeEventListener("mouseup", this._mouseUpListener)), this._coreBrowserService.window.clearInterval(this._dragScrollIntervalTimer), this._dragScrollIntervalTimer = void 0;
        }
        _handleIncrementalClick(h) {
          this._model.selectionStart && (this._model.selectionEnd = this._getMouseBufferCoords(h));
        }
        _handleSingleClick(h) {
          if (this._model.selectionStartLength = 0, this._model.isSelectAllActive = !1, this._activeSelectionMode = this.shouldColumnSelect(h) ? 3 : 0, this._model.selectionStart = this._getMouseBufferCoords(h), !this._model.selectionStart) return;
          this._model.selectionEnd = void 0;
          const p = this._bufferService.buffer.lines.get(this._model.selectionStart[1]);
          p && p.length !== this._model.selectionStart[0] && p.hasWidth(this._model.selectionStart[0]) === 0 && this._model.selectionStart[0]++;
        }
        _handleDoubleClick(h) {
          this._selectWordAtCursor(h, !0) && (this._activeSelectionMode = 1);
        }
        _handleTripleClick(h) {
          const p = this._getMouseBufferCoords(h);
          p && (this._activeSelectionMode = 2, this._selectLineAt(p[1]));
        }
        shouldColumnSelect(h) {
          return h.altKey && !(i.isMac && this._optionsService.rawOptions.macOptionClickForcesSelection);
        }
        _handleMouseMove(h) {
          if (h.stopImmediatePropagation(), !this._model.selectionStart) return;
          const p = this._model.selectionEnd ? [this._model.selectionEnd[0], this._model.selectionEnd[1]] : null;
          if (this._model.selectionEnd = this._getMouseBufferCoords(h), !this._model.selectionEnd) return void this.refresh(!0);
          this._activeSelectionMode === 2 ? this._model.selectionEnd[1] < this._model.selectionStart[1] ? this._model.selectionEnd[0] = 0 : this._model.selectionEnd[0] = this._bufferService.cols : this._activeSelectionMode === 1 && this._selectToWordAt(this._model.selectionEnd), this._dragScrollAmount = this._getMouseEventScrollAmount(h), this._activeSelectionMode !== 3 && (this._dragScrollAmount > 0 ? this._model.selectionEnd[0] = this._bufferService.cols : this._dragScrollAmount < 0 && (this._model.selectionEnd[0] = 0));
          const w = this._bufferService.buffer;
          if (this._model.selectionEnd[1] < w.lines.length) {
            const C = w.lines.get(this._model.selectionEnd[1]);
            C && C.hasWidth(this._model.selectionEnd[0]) === 0 && this._model.selectionEnd[0]++;
          }
          p && p[0] === this._model.selectionEnd[0] && p[1] === this._model.selectionEnd[1] || this.refresh(!0);
        }
        _dragScroll() {
          if (this._model.selectionEnd && this._model.selectionStart && this._dragScrollAmount) {
            this._onRequestScrollLines.fire({ amount: this._dragScrollAmount, suppressScrollEvent: !1 });
            const h = this._bufferService.buffer;
            this._dragScrollAmount > 0 ? (this._activeSelectionMode !== 3 && (this._model.selectionEnd[0] = this._bufferService.cols), this._model.selectionEnd[1] = Math.min(h.ydisp + this._bufferService.rows, h.lines.length - 1)) : (this._activeSelectionMode !== 3 && (this._model.selectionEnd[0] = 0), this._model.selectionEnd[1] = h.ydisp), this.refresh();
          }
        }
        _handleMouseUp(h) {
          const p = h.timeStamp - this._mouseDownTimeStamp;
          if (this._removeMouseDownListeners(), this.selectionText.length <= 1 && p < 500 && h.altKey && this._optionsService.rawOptions.altClickMovesCursor) {
            if (this._bufferService.buffer.ybase === this._bufferService.buffer.ydisp) {
              const w = this._mouseService.getCoords(h, this._element, this._bufferService.cols, this._bufferService.rows, !1);
              if (w && w[0] !== void 0 && w[1] !== void 0) {
                const C = (0, d.moveToCellSequence)(w[0] - 1, w[1] - 1, this._bufferService, this._coreService.decPrivateModes.applicationCursorKeys);
                this._coreService.triggerDataEvent(C, !0);
              }
            }
          } else this._fireEventIfSelectionChanged();
        }
        _fireEventIfSelectionChanged() {
          const h = this._model.finalSelectionStart, p = this._model.finalSelectionEnd, w = !(!h || !p || h[0] === p[0] && h[1] === p[1]);
          w ? h && p && (this._oldSelectionStart && this._oldSelectionEnd && h[0] === this._oldSelectionStart[0] && h[1] === this._oldSelectionStart[1] && p[0] === this._oldSelectionEnd[0] && p[1] === this._oldSelectionEnd[1] || this._fireOnSelectionChange(h, p, w)) : this._oldHasSelection && this._fireOnSelectionChange(h, p, w);
        }
        _fireOnSelectionChange(h, p, w) {
          this._oldSelectionStart = h, this._oldSelectionEnd = p, this._oldHasSelection = w, this._onSelectionChange.fire();
        }
        _handleBufferActivate(h) {
          this.clearSelection(), this._trimListener.dispose(), this._trimListener = h.activeBuffer.lines.onTrim((p) => this._handleTrim(p));
        }
        _convertViewportColToCharacterIndex(h, p) {
          let w = p;
          for (let C = 0; p >= C; C++) {
            const y = h.loadCell(C, this._workCell).getChars().length;
            this._workCell.getWidth() === 0 ? w-- : y > 1 && p !== C && (w += y - 1);
          }
          return w;
        }
        setSelection(h, p, w) {
          this._model.clearSelection(), this._removeMouseDownListeners(), this._model.selectionStart = [h, p], this._model.selectionStartLength = w, this.refresh(), this._fireEventIfSelectionChanged();
        }
        rightClickSelect(h) {
          this._isClickInSelection(h) || (this._selectWordAtCursor(h, !1) && this.refresh(!0), this._fireEventIfSelectionChanged());
        }
        _getWordAt(h, p, w = !0, C = !0) {
          if (h[0] >= this._bufferService.cols) return;
          const y = this._bufferService.buffer, x = y.lines.get(h[1]);
          if (!x) return;
          const A = y.translateBufferLineToString(h[1], !1);
          let O = this._convertViewportColToCharacterIndex(x, h[0]), P = O;
          const I = h[0] - O;
          let b = 0, E = 0, k = 0, L = 0;
          if (A.charAt(O) === " ") {
            for (; O > 0 && A.charAt(O - 1) === " "; ) O--;
            for (; P < A.length && A.charAt(P + 1) === " "; ) P++;
          } else {
            let q = h[0], K = h[0];
            x.getWidth(q) === 0 && (b++, q--), x.getWidth(K) === 2 && (E++, K++);
            const Q = x.getString(K).length;
            for (Q > 1 && (L += Q - 1, P += Q - 1); q > 0 && O > 0 && !this._isCharWordSeparator(x.loadCell(q - 1, this._workCell)); ) {
              x.loadCell(q - 1, this._workCell);
              const S = this._workCell.getChars().length;
              this._workCell.getWidth() === 0 ? (b++, q--) : S > 1 && (k += S - 1, O -= S - 1), O--, q--;
            }
            for (; K < x.length && P + 1 < A.length && !this._isCharWordSeparator(x.loadCell(K + 1, this._workCell)); ) {
              x.loadCell(K + 1, this._workCell);
              const S = this._workCell.getChars().length;
              this._workCell.getWidth() === 2 ? (E++, K++) : S > 1 && (L += S - 1, P += S - 1), P++, K++;
            }
          }
          P++;
          let H = O + I - b + k, j = Math.min(this._bufferService.cols, P - O + b + E - k - L);
          if (p || A.slice(O, P).trim() !== "") {
            if (w && H === 0 && x.getCodePoint(0) !== 32) {
              const q = y.lines.get(h[1] - 1);
              if (q && x.isWrapped && q.getCodePoint(this._bufferService.cols - 1) !== 32) {
                const K = this._getWordAt([this._bufferService.cols - 1, h[1] - 1], !1, !0, !1);
                if (K) {
                  const Q = this._bufferService.cols - K.start;
                  H -= Q, j += Q;
                }
              }
            }
            if (C && H + j === this._bufferService.cols && x.getCodePoint(this._bufferService.cols - 1) !== 32) {
              const q = y.lines.get(h[1] + 1);
              if (q != null && q.isWrapped && q.getCodePoint(0) !== 32) {
                const K = this._getWordAt([0, h[1] + 1], !1, !1, !0);
                K && (j += K.length);
              }
            }
            return { start: H, length: j };
          }
        }
        _selectWordAt(h, p) {
          const w = this._getWordAt(h, p);
          if (w) {
            for (; w.start < 0; ) w.start += this._bufferService.cols, h[1]--;
            this._model.selectionStart = [w.start, h[1]], this._model.selectionStartLength = w.length;
          }
        }
        _selectToWordAt(h) {
          const p = this._getWordAt(h, !0);
          if (p) {
            let w = h[1];
            for (; p.start < 0; ) p.start += this._bufferService.cols, w--;
            if (!this._model.areSelectionValuesReversed()) for (; p.start + p.length > this._bufferService.cols; ) p.length -= this._bufferService.cols, w++;
            this._model.selectionEnd = [this._model.areSelectionValuesReversed() ? p.start : p.start + p.length, w];
          }
        }
        _isCharWordSeparator(h) {
          return h.getWidth() !== 0 && this._optionsService.rawOptions.wordSeparator.indexOf(h.getChars()) >= 0;
        }
        _selectLineAt(h) {
          const p = this._bufferService.buffer.getWrappedRangeForLine(h), w = { start: { x: 0, y: p.first }, end: { x: this._bufferService.cols - 1, y: p.last } };
          this._model.selectionStart = [0, p.first], this._model.selectionEnd = void 0, this._model.selectionStartLength = (0, t.getRangeLength)(w, this._bufferService.cols);
        }
      };
      s.SelectionService = m = c([_(3, o.IBufferService), _(4, o.ICoreService), _(5, g.IMouseService), _(6, o.IOptionsService), _(7, g.IRenderService), _(8, g.ICoreBrowserService)], m);
    }, 4725: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.IThemeService = s.ICharacterJoinerService = s.ISelectionService = s.IRenderService = s.IMouseService = s.ICoreBrowserService = s.ICharSizeService = void 0;
      const c = a(8343);
      s.ICharSizeService = (0, c.createDecorator)("CharSizeService"), s.ICoreBrowserService = (0, c.createDecorator)("CoreBrowserService"), s.IMouseService = (0, c.createDecorator)("MouseService"), s.IRenderService = (0, c.createDecorator)("RenderService"), s.ISelectionService = (0, c.createDecorator)("SelectionService"), s.ICharacterJoinerService = (0, c.createDecorator)("CharacterJoinerService"), s.IThemeService = (0, c.createDecorator)("ThemeService");
    }, 6731: function(B, s, a) {
      var c = this && this.__decorate || function(m, h, p, w) {
        var C, y = arguments.length, x = y < 3 ? h : w === null ? w = Object.getOwnPropertyDescriptor(h, p) : w;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") x = Reflect.decorate(m, h, p, w);
        else for (var A = m.length - 1; A >= 0; A--) (C = m[A]) && (x = (y < 3 ? C(x) : y > 3 ? C(h, p, x) : C(h, p)) || x);
        return y > 3 && x && Object.defineProperty(h, p, x), x;
      }, _ = this && this.__param || function(m, h) {
        return function(p, w) {
          h(p, w, m);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ThemeService = s.DEFAULT_ANSI_COLORS = void 0;
      const n = a(7239), d = a(8055), v = a(8460), g = a(844), u = a(2585), e = d.css.toColor("#ffffff"), i = d.css.toColor("#000000"), t = d.css.toColor("#ffffff"), r = d.css.toColor("#000000"), o = { css: "rgba(255, 255, 255, 0.3)", rgba: 4294967117 };
      s.DEFAULT_ANSI_COLORS = Object.freeze((() => {
        const m = [d.css.toColor("#2e3436"), d.css.toColor("#cc0000"), d.css.toColor("#4e9a06"), d.css.toColor("#c4a000"), d.css.toColor("#3465a4"), d.css.toColor("#75507b"), d.css.toColor("#06989a"), d.css.toColor("#d3d7cf"), d.css.toColor("#555753"), d.css.toColor("#ef2929"), d.css.toColor("#8ae234"), d.css.toColor("#fce94f"), d.css.toColor("#729fcf"), d.css.toColor("#ad7fa8"), d.css.toColor("#34e2e2"), d.css.toColor("#eeeeec")], h = [0, 95, 135, 175, 215, 255];
        for (let p = 0; p < 216; p++) {
          const w = h[p / 36 % 6 | 0], C = h[p / 6 % 6 | 0], y = h[p % 6];
          m.push({ css: d.channels.toCss(w, C, y), rgba: d.channels.toRgba(w, C, y) });
        }
        for (let p = 0; p < 24; p++) {
          const w = 8 + 10 * p;
          m.push({ css: d.channels.toCss(w, w, w), rgba: d.channels.toRgba(w, w, w) });
        }
        return m;
      })());
      let l = s.ThemeService = class extends g.Disposable {
        get colors() {
          return this._colors;
        }
        constructor(m) {
          super(), this._optionsService = m, this._contrastCache = new n.ColorContrastCache(), this._halfContrastCache = new n.ColorContrastCache(), this._onChangeColors = this.register(new v.EventEmitter()), this.onChangeColors = this._onChangeColors.event, this._colors = { foreground: e, background: i, cursor: t, cursorAccent: r, selectionForeground: void 0, selectionBackgroundTransparent: o, selectionBackgroundOpaque: d.color.blend(i, o), selectionInactiveBackgroundTransparent: o, selectionInactiveBackgroundOpaque: d.color.blend(i, o), ansi: s.DEFAULT_ANSI_COLORS.slice(), contrastCache: this._contrastCache, halfContrastCache: this._halfContrastCache }, this._updateRestoreColors(), this._setTheme(this._optionsService.rawOptions.theme), this.register(this._optionsService.onSpecificOptionChange("minimumContrastRatio", () => this._contrastCache.clear())), this.register(this._optionsService.onSpecificOptionChange("theme", () => this._setTheme(this._optionsService.rawOptions.theme)));
        }
        _setTheme(m = {}) {
          const h = this._colors;
          if (h.foreground = f(m.foreground, e), h.background = f(m.background, i), h.cursor = f(m.cursor, t), h.cursorAccent = f(m.cursorAccent, r), h.selectionBackgroundTransparent = f(m.selectionBackground, o), h.selectionBackgroundOpaque = d.color.blend(h.background, h.selectionBackgroundTransparent), h.selectionInactiveBackgroundTransparent = f(m.selectionInactiveBackground, h.selectionBackgroundTransparent), h.selectionInactiveBackgroundOpaque = d.color.blend(h.background, h.selectionInactiveBackgroundTransparent), h.selectionForeground = m.selectionForeground ? f(m.selectionForeground, d.NULL_COLOR) : void 0, h.selectionForeground === d.NULL_COLOR && (h.selectionForeground = void 0), d.color.isOpaque(h.selectionBackgroundTransparent) && (h.selectionBackgroundTransparent = d.color.opacity(h.selectionBackgroundTransparent, 0.3)), d.color.isOpaque(h.selectionInactiveBackgroundTransparent) && (h.selectionInactiveBackgroundTransparent = d.color.opacity(h.selectionInactiveBackgroundTransparent, 0.3)), h.ansi = s.DEFAULT_ANSI_COLORS.slice(), h.ansi[0] = f(m.black, s.DEFAULT_ANSI_COLORS[0]), h.ansi[1] = f(m.red, s.DEFAULT_ANSI_COLORS[1]), h.ansi[2] = f(m.green, s.DEFAULT_ANSI_COLORS[2]), h.ansi[3] = f(m.yellow, s.DEFAULT_ANSI_COLORS[3]), h.ansi[4] = f(m.blue, s.DEFAULT_ANSI_COLORS[4]), h.ansi[5] = f(m.magenta, s.DEFAULT_ANSI_COLORS[5]), h.ansi[6] = f(m.cyan, s.DEFAULT_ANSI_COLORS[6]), h.ansi[7] = f(m.white, s.DEFAULT_ANSI_COLORS[7]), h.ansi[8] = f(m.brightBlack, s.DEFAULT_ANSI_COLORS[8]), h.ansi[9] = f(m.brightRed, s.DEFAULT_ANSI_COLORS[9]), h.ansi[10] = f(m.brightGreen, s.DEFAULT_ANSI_COLORS[10]), h.ansi[11] = f(m.brightYellow, s.DEFAULT_ANSI_COLORS[11]), h.ansi[12] = f(m.brightBlue, s.DEFAULT_ANSI_COLORS[12]), h.ansi[13] = f(m.brightMagenta, s.DEFAULT_ANSI_COLORS[13]), h.ansi[14] = f(m.brightCyan, s.DEFAULT_ANSI_COLORS[14]), h.ansi[15] = f(m.brightWhite, s.DEFAULT_ANSI_COLORS[15]), m.extendedAnsi) {
            const p = Math.min(h.ansi.length - 16, m.extendedAnsi.length);
            for (let w = 0; w < p; w++) h.ansi[w + 16] = f(m.extendedAnsi[w], s.DEFAULT_ANSI_COLORS[w + 16]);
          }
          this._contrastCache.clear(), this._halfContrastCache.clear(), this._updateRestoreColors(), this._onChangeColors.fire(this.colors);
        }
        restoreColor(m) {
          this._restoreColor(m), this._onChangeColors.fire(this.colors);
        }
        _restoreColor(m) {
          if (m !== void 0) switch (m) {
            case 256:
              this._colors.foreground = this._restoreColors.foreground;
              break;
            case 257:
              this._colors.background = this._restoreColors.background;
              break;
            case 258:
              this._colors.cursor = this._restoreColors.cursor;
              break;
            default:
              this._colors.ansi[m] = this._restoreColors.ansi[m];
          }
          else for (let h = 0; h < this._restoreColors.ansi.length; ++h) this._colors.ansi[h] = this._restoreColors.ansi[h];
        }
        modifyColors(m) {
          m(this._colors), this._onChangeColors.fire(this.colors);
        }
        _updateRestoreColors() {
          this._restoreColors = { foreground: this._colors.foreground, background: this._colors.background, cursor: this._colors.cursor, ansi: this._colors.ansi.slice() };
        }
      };
      function f(m, h) {
        if (m !== void 0) try {
          return d.css.toColor(m);
        } catch {
        }
        return h;
      }
      s.ThemeService = l = c([_(0, u.IOptionsService)], l);
    }, 6349: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CircularList = void 0;
      const c = a(8460), _ = a(844);
      class n extends _.Disposable {
        constructor(v) {
          super(), this._maxLength = v, this.onDeleteEmitter = this.register(new c.EventEmitter()), this.onDelete = this.onDeleteEmitter.event, this.onInsertEmitter = this.register(new c.EventEmitter()), this.onInsert = this.onInsertEmitter.event, this.onTrimEmitter = this.register(new c.EventEmitter()), this.onTrim = this.onTrimEmitter.event, this._array = new Array(this._maxLength), this._startIndex = 0, this._length = 0;
        }
        get maxLength() {
          return this._maxLength;
        }
        set maxLength(v) {
          if (this._maxLength === v) return;
          const g = new Array(v);
          for (let u = 0; u < Math.min(v, this.length); u++) g[u] = this._array[this._getCyclicIndex(u)];
          this._array = g, this._maxLength = v, this._startIndex = 0;
        }
        get length() {
          return this._length;
        }
        set length(v) {
          if (v > this._length) for (let g = this._length; g < v; g++) this._array[g] = void 0;
          this._length = v;
        }
        get(v) {
          return this._array[this._getCyclicIndex(v)];
        }
        set(v, g) {
          this._array[this._getCyclicIndex(v)] = g;
        }
        push(v) {
          this._array[this._getCyclicIndex(this._length)] = v, this._length === this._maxLength ? (this._startIndex = ++this._startIndex % this._maxLength, this.onTrimEmitter.fire(1)) : this._length++;
        }
        recycle() {
          if (this._length !== this._maxLength) throw new Error("Can only recycle when the buffer is full");
          return this._startIndex = ++this._startIndex % this._maxLength, this.onTrimEmitter.fire(1), this._array[this._getCyclicIndex(this._length - 1)];
        }
        get isFull() {
          return this._length === this._maxLength;
        }
        pop() {
          return this._array[this._getCyclicIndex(this._length-- - 1)];
        }
        splice(v, g, ...u) {
          if (g) {
            for (let e = v; e < this._length - g; e++) this._array[this._getCyclicIndex(e)] = this._array[this._getCyclicIndex(e + g)];
            this._length -= g, this.onDeleteEmitter.fire({ index: v, amount: g });
          }
          for (let e = this._length - 1; e >= v; e--) this._array[this._getCyclicIndex(e + u.length)] = this._array[this._getCyclicIndex(e)];
          for (let e = 0; e < u.length; e++) this._array[this._getCyclicIndex(v + e)] = u[e];
          if (u.length && this.onInsertEmitter.fire({ index: v, amount: u.length }), this._length + u.length > this._maxLength) {
            const e = this._length + u.length - this._maxLength;
            this._startIndex += e, this._length = this._maxLength, this.onTrimEmitter.fire(e);
          } else this._length += u.length;
        }
        trimStart(v) {
          v > this._length && (v = this._length), this._startIndex += v, this._length -= v, this.onTrimEmitter.fire(v);
        }
        shiftElements(v, g, u) {
          if (!(g <= 0)) {
            if (v < 0 || v >= this._length) throw new Error("start argument out of range");
            if (v + u < 0) throw new Error("Cannot shift elements in list beyond index 0");
            if (u > 0) {
              for (let i = g - 1; i >= 0; i--) this.set(v + i + u, this.get(v + i));
              const e = v + g + u - this._length;
              if (e > 0) for (this._length += e; this._length > this._maxLength; ) this._length--, this._startIndex++, this.onTrimEmitter.fire(1);
            } else for (let e = 0; e < g; e++) this.set(v + e + u, this.get(v + e));
          }
        }
        _getCyclicIndex(v) {
          return (this._startIndex + v) % this._maxLength;
        }
      }
      s.CircularList = n;
    }, 1439: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.clone = void 0, s.clone = function a(c, _ = 5) {
        if (typeof c != "object") return c;
        const n = Array.isArray(c) ? [] : {};
        for (const d in c) n[d] = _ <= 1 ? c[d] : c[d] && a(c[d], _ - 1);
        return n;
      };
    }, 8055: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.contrastRatio = s.toPaddedHex = s.rgba = s.rgb = s.css = s.color = s.channels = s.NULL_COLOR = void 0;
      const c = a(6114);
      let _ = 0, n = 0, d = 0, v = 0;
      var g, u, e, i, t;
      function r(l) {
        const f = l.toString(16);
        return f.length < 2 ? "0" + f : f;
      }
      function o(l, f) {
        return l < f ? (f + 0.05) / (l + 0.05) : (l + 0.05) / (f + 0.05);
      }
      s.NULL_COLOR = { css: "#00000000", rgba: 0 }, function(l) {
        l.toCss = function(f, m, h, p) {
          return p !== void 0 ? `#${r(f)}${r(m)}${r(h)}${r(p)}` : `#${r(f)}${r(m)}${r(h)}`;
        }, l.toRgba = function(f, m, h, p = 255) {
          return (f << 24 | m << 16 | h << 8 | p) >>> 0;
        };
      }(g || (s.channels = g = {})), function(l) {
        function f(m, h) {
          return v = Math.round(255 * h), [_, n, d] = t.toChannels(m.rgba), { css: g.toCss(_, n, d, v), rgba: g.toRgba(_, n, d, v) };
        }
        l.blend = function(m, h) {
          if (v = (255 & h.rgba) / 255, v === 1) return { css: h.css, rgba: h.rgba };
          const p = h.rgba >> 24 & 255, w = h.rgba >> 16 & 255, C = h.rgba >> 8 & 255, y = m.rgba >> 24 & 255, x = m.rgba >> 16 & 255, A = m.rgba >> 8 & 255;
          return _ = y + Math.round((p - y) * v), n = x + Math.round((w - x) * v), d = A + Math.round((C - A) * v), { css: g.toCss(_, n, d), rgba: g.toRgba(_, n, d) };
        }, l.isOpaque = function(m) {
          return (255 & m.rgba) == 255;
        }, l.ensureContrastRatio = function(m, h, p) {
          const w = t.ensureContrastRatio(m.rgba, h.rgba, p);
          if (w) return t.toColor(w >> 24 & 255, w >> 16 & 255, w >> 8 & 255);
        }, l.opaque = function(m) {
          const h = (255 | m.rgba) >>> 0;
          return [_, n, d] = t.toChannels(h), { css: g.toCss(_, n, d), rgba: h };
        }, l.opacity = f, l.multiplyOpacity = function(m, h) {
          return v = 255 & m.rgba, f(m, v * h / 255);
        }, l.toColorRGB = function(m) {
          return [m.rgba >> 24 & 255, m.rgba >> 16 & 255, m.rgba >> 8 & 255];
        };
      }(u || (s.color = u = {})), function(l) {
        let f, m;
        if (!c.isNode) {
          const h = document.createElement("canvas");
          h.width = 1, h.height = 1;
          const p = h.getContext("2d", { willReadFrequently: !0 });
          p && (f = p, f.globalCompositeOperation = "copy", m = f.createLinearGradient(0, 0, 1, 1));
        }
        l.toColor = function(h) {
          if (h.match(/#[\da-f]{3,8}/i)) switch (h.length) {
            case 4:
              return _ = parseInt(h.slice(1, 2).repeat(2), 16), n = parseInt(h.slice(2, 3).repeat(2), 16), d = parseInt(h.slice(3, 4).repeat(2), 16), t.toColor(_, n, d);
            case 5:
              return _ = parseInt(h.slice(1, 2).repeat(2), 16), n = parseInt(h.slice(2, 3).repeat(2), 16), d = parseInt(h.slice(3, 4).repeat(2), 16), v = parseInt(h.slice(4, 5).repeat(2), 16), t.toColor(_, n, d, v);
            case 7:
              return { css: h, rgba: (parseInt(h.slice(1), 16) << 8 | 255) >>> 0 };
            case 9:
              return { css: h, rgba: parseInt(h.slice(1), 16) >>> 0 };
          }
          const p = h.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0|1|\d?\.(\d+))\s*)?\)/);
          if (p) return _ = parseInt(p[1]), n = parseInt(p[2]), d = parseInt(p[3]), v = Math.round(255 * (p[5] === void 0 ? 1 : parseFloat(p[5]))), t.toColor(_, n, d, v);
          if (!f || !m) throw new Error("css.toColor: Unsupported css format");
          if (f.fillStyle = m, f.fillStyle = h, typeof f.fillStyle != "string") throw new Error("css.toColor: Unsupported css format");
          if (f.fillRect(0, 0, 1, 1), [_, n, d, v] = f.getImageData(0, 0, 1, 1).data, v !== 255) throw new Error("css.toColor: Unsupported css format");
          return { rgba: g.toRgba(_, n, d, v), css: h };
        };
      }(e || (s.css = e = {})), function(l) {
        function f(m, h, p) {
          const w = m / 255, C = h / 255, y = p / 255;
          return 0.2126 * (w <= 0.03928 ? w / 12.92 : Math.pow((w + 0.055) / 1.055, 2.4)) + 0.7152 * (C <= 0.03928 ? C / 12.92 : Math.pow((C + 0.055) / 1.055, 2.4)) + 0.0722 * (y <= 0.03928 ? y / 12.92 : Math.pow((y + 0.055) / 1.055, 2.4));
        }
        l.relativeLuminance = function(m) {
          return f(m >> 16 & 255, m >> 8 & 255, 255 & m);
        }, l.relativeLuminance2 = f;
      }(i || (s.rgb = i = {})), function(l) {
        function f(h, p, w) {
          const C = h >> 24 & 255, y = h >> 16 & 255, x = h >> 8 & 255;
          let A = p >> 24 & 255, O = p >> 16 & 255, P = p >> 8 & 255, I = o(i.relativeLuminance2(A, O, P), i.relativeLuminance2(C, y, x));
          for (; I < w && (A > 0 || O > 0 || P > 0); ) A -= Math.max(0, Math.ceil(0.1 * A)), O -= Math.max(0, Math.ceil(0.1 * O)), P -= Math.max(0, Math.ceil(0.1 * P)), I = o(i.relativeLuminance2(A, O, P), i.relativeLuminance2(C, y, x));
          return (A << 24 | O << 16 | P << 8 | 255) >>> 0;
        }
        function m(h, p, w) {
          const C = h >> 24 & 255, y = h >> 16 & 255, x = h >> 8 & 255;
          let A = p >> 24 & 255, O = p >> 16 & 255, P = p >> 8 & 255, I = o(i.relativeLuminance2(A, O, P), i.relativeLuminance2(C, y, x));
          for (; I < w && (A < 255 || O < 255 || P < 255); ) A = Math.min(255, A + Math.ceil(0.1 * (255 - A))), O = Math.min(255, O + Math.ceil(0.1 * (255 - O))), P = Math.min(255, P + Math.ceil(0.1 * (255 - P))), I = o(i.relativeLuminance2(A, O, P), i.relativeLuminance2(C, y, x));
          return (A << 24 | O << 16 | P << 8 | 255) >>> 0;
        }
        l.ensureContrastRatio = function(h, p, w) {
          const C = i.relativeLuminance(h >> 8), y = i.relativeLuminance(p >> 8);
          if (o(C, y) < w) {
            if (y < C) {
              const O = f(h, p, w), P = o(C, i.relativeLuminance(O >> 8));
              if (P < w) {
                const I = m(h, p, w);
                return P > o(C, i.relativeLuminance(I >> 8)) ? O : I;
              }
              return O;
            }
            const x = m(h, p, w), A = o(C, i.relativeLuminance(x >> 8));
            if (A < w) {
              const O = f(h, p, w);
              return A > o(C, i.relativeLuminance(O >> 8)) ? x : O;
            }
            return x;
          }
        }, l.reduceLuminance = f, l.increaseLuminance = m, l.toChannels = function(h) {
          return [h >> 24 & 255, h >> 16 & 255, h >> 8 & 255, 255 & h];
        }, l.toColor = function(h, p, w, C) {
          return { css: g.toCss(h, p, w, C), rgba: g.toRgba(h, p, w, C) };
        };
      }(t || (s.rgba = t = {})), s.toPaddedHex = r, s.contrastRatio = o;
    }, 8969: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CoreTerminal = void 0;
      const c = a(844), _ = a(2585), n = a(4348), d = a(7866), v = a(744), g = a(7302), u = a(6975), e = a(8460), i = a(1753), t = a(1480), r = a(7994), o = a(9282), l = a(5435), f = a(5981), m = a(2660);
      let h = !1;
      class p extends c.Disposable {
        get onScroll() {
          return this._onScrollApi || (this._onScrollApi = this.register(new e.EventEmitter()), this._onScroll.event((C) => {
            var y;
            (y = this._onScrollApi) === null || y === void 0 || y.fire(C.position);
          })), this._onScrollApi.event;
        }
        get cols() {
          return this._bufferService.cols;
        }
        get rows() {
          return this._bufferService.rows;
        }
        get buffers() {
          return this._bufferService.buffers;
        }
        get options() {
          return this.optionsService.options;
        }
        set options(C) {
          for (const y in C) this.optionsService.options[y] = C[y];
        }
        constructor(C) {
          super(), this._windowsWrappingHeuristics = this.register(new c.MutableDisposable()), this._onBinary = this.register(new e.EventEmitter()), this.onBinary = this._onBinary.event, this._onData = this.register(new e.EventEmitter()), this.onData = this._onData.event, this._onLineFeed = this.register(new e.EventEmitter()), this.onLineFeed = this._onLineFeed.event, this._onResize = this.register(new e.EventEmitter()), this.onResize = this._onResize.event, this._onWriteParsed = this.register(new e.EventEmitter()), this.onWriteParsed = this._onWriteParsed.event, this._onScroll = this.register(new e.EventEmitter()), this._instantiationService = new n.InstantiationService(), this.optionsService = this.register(new g.OptionsService(C)), this._instantiationService.setService(_.IOptionsService, this.optionsService), this._bufferService = this.register(this._instantiationService.createInstance(v.BufferService)), this._instantiationService.setService(_.IBufferService, this._bufferService), this._logService = this.register(this._instantiationService.createInstance(d.LogService)), this._instantiationService.setService(_.ILogService, this._logService), this.coreService = this.register(this._instantiationService.createInstance(u.CoreService)), this._instantiationService.setService(_.ICoreService, this.coreService), this.coreMouseService = this.register(this._instantiationService.createInstance(i.CoreMouseService)), this._instantiationService.setService(_.ICoreMouseService, this.coreMouseService), this.unicodeService = this.register(this._instantiationService.createInstance(t.UnicodeService)), this._instantiationService.setService(_.IUnicodeService, this.unicodeService), this._charsetService = this._instantiationService.createInstance(r.CharsetService), this._instantiationService.setService(_.ICharsetService, this._charsetService), this._oscLinkService = this._instantiationService.createInstance(m.OscLinkService), this._instantiationService.setService(_.IOscLinkService, this._oscLinkService), this._inputHandler = this.register(new l.InputHandler(this._bufferService, this._charsetService, this.coreService, this._logService, this.optionsService, this._oscLinkService, this.coreMouseService, this.unicodeService)), this.register((0, e.forwardEvent)(this._inputHandler.onLineFeed, this._onLineFeed)), this.register(this._inputHandler), this.register((0, e.forwardEvent)(this._bufferService.onResize, this._onResize)), this.register((0, e.forwardEvent)(this.coreService.onData, this._onData)), this.register((0, e.forwardEvent)(this.coreService.onBinary, this._onBinary)), this.register(this.coreService.onRequestScrollToBottom(() => this.scrollToBottom())), this.register(this.coreService.onUserInput(() => this._writeBuffer.handleUserInput())), this.register(this.optionsService.onMultipleOptionChange(["windowsMode", "windowsPty"], () => this._handleWindowsPtyOptionChange())), this.register(this._bufferService.onScroll((y) => {
            this._onScroll.fire({ position: this._bufferService.buffer.ydisp, source: 0 }), this._inputHandler.markRangeDirty(this._bufferService.buffer.scrollTop, this._bufferService.buffer.scrollBottom);
          })), this.register(this._inputHandler.onScroll((y) => {
            this._onScroll.fire({ position: this._bufferService.buffer.ydisp, source: 0 }), this._inputHandler.markRangeDirty(this._bufferService.buffer.scrollTop, this._bufferService.buffer.scrollBottom);
          })), this._writeBuffer = this.register(new f.WriteBuffer((y, x) => this._inputHandler.parse(y, x))), this.register((0, e.forwardEvent)(this._writeBuffer.onWriteParsed, this._onWriteParsed));
        }
        write(C, y) {
          this._writeBuffer.write(C, y);
        }
        writeSync(C, y) {
          this._logService.logLevel <= _.LogLevelEnum.WARN && !h && (this._logService.warn("writeSync is unreliable and will be removed soon."), h = !0), this._writeBuffer.writeSync(C, y);
        }
        resize(C, y) {
          isNaN(C) || isNaN(y) || (C = Math.max(C, v.MINIMUM_COLS), y = Math.max(y, v.MINIMUM_ROWS), this._bufferService.resize(C, y));
        }
        scroll(C, y = !1) {
          this._bufferService.scroll(C, y);
        }
        scrollLines(C, y, x) {
          this._bufferService.scrollLines(C, y, x);
        }
        scrollPages(C) {
          this.scrollLines(C * (this.rows - 1));
        }
        scrollToTop() {
          this.scrollLines(-this._bufferService.buffer.ydisp);
        }
        scrollToBottom() {
          this.scrollLines(this._bufferService.buffer.ybase - this._bufferService.buffer.ydisp);
        }
        scrollToLine(C) {
          const y = C - this._bufferService.buffer.ydisp;
          y !== 0 && this.scrollLines(y);
        }
        registerEscHandler(C, y) {
          return this._inputHandler.registerEscHandler(C, y);
        }
        registerDcsHandler(C, y) {
          return this._inputHandler.registerDcsHandler(C, y);
        }
        registerCsiHandler(C, y) {
          return this._inputHandler.registerCsiHandler(C, y);
        }
        registerOscHandler(C, y) {
          return this._inputHandler.registerOscHandler(C, y);
        }
        _setup() {
          this._handleWindowsPtyOptionChange();
        }
        reset() {
          this._inputHandler.reset(), this._bufferService.reset(), this._charsetService.reset(), this.coreService.reset(), this.coreMouseService.reset();
        }
        _handleWindowsPtyOptionChange() {
          let C = !1;
          const y = this.optionsService.rawOptions.windowsPty;
          y && y.buildNumber !== void 0 && y.buildNumber !== void 0 ? C = y.backend === "conpty" && y.buildNumber < 21376 : this.optionsService.rawOptions.windowsMode && (C = !0), C ? this._enableWindowsWrappingHeuristics() : this._windowsWrappingHeuristics.clear();
        }
        _enableWindowsWrappingHeuristics() {
          if (!this._windowsWrappingHeuristics.value) {
            const C = [];
            C.push(this.onLineFeed(o.updateWindowsModeWrappedState.bind(null, this._bufferService))), C.push(this.registerCsiHandler({ final: "H" }, () => ((0, o.updateWindowsModeWrappedState)(this._bufferService), !1))), this._windowsWrappingHeuristics.value = (0, c.toDisposable)(() => {
              for (const y of C) y.dispose();
            });
          }
        }
      }
      s.CoreTerminal = p;
    }, 8460: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.forwardEvent = s.EventEmitter = void 0, s.EventEmitter = class {
        constructor() {
          this._listeners = [], this._disposed = !1;
        }
        get event() {
          return this._event || (this._event = (a) => (this._listeners.push(a), { dispose: () => {
            if (!this._disposed) {
              for (let c = 0; c < this._listeners.length; c++) if (this._listeners[c] === a) return void this._listeners.splice(c, 1);
            }
          } })), this._event;
        }
        fire(a, c) {
          const _ = [];
          for (let n = 0; n < this._listeners.length; n++) _.push(this._listeners[n]);
          for (let n = 0; n < _.length; n++) _[n].call(void 0, a, c);
        }
        dispose() {
          this.clearListeners(), this._disposed = !0;
        }
        clearListeners() {
          this._listeners && (this._listeners.length = 0);
        }
      }, s.forwardEvent = function(a, c) {
        return a((_) => c.fire(_));
      };
    }, 5435: function(B, s, a) {
      var c = this && this.__decorate || function(I, b, E, k) {
        var L, H = arguments.length, j = H < 3 ? b : k === null ? k = Object.getOwnPropertyDescriptor(b, E) : k;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") j = Reflect.decorate(I, b, E, k);
        else for (var q = I.length - 1; q >= 0; q--) (L = I[q]) && (j = (H < 3 ? L(j) : H > 3 ? L(b, E, j) : L(b, E)) || j);
        return H > 3 && j && Object.defineProperty(b, E, j), j;
      }, _ = this && this.__param || function(I, b) {
        return function(E, k) {
          b(E, k, I);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.InputHandler = s.WindowsOptionsReportType = void 0;
      const n = a(2584), d = a(7116), v = a(2015), g = a(844), u = a(482), e = a(8437), i = a(8460), t = a(643), r = a(511), o = a(3734), l = a(2585), f = a(6242), m = a(6351), h = a(5941), p = { "(": 0, ")": 1, "*": 2, "+": 3, "-": 1, ".": 2 }, w = 131072;
      function C(I, b) {
        if (I > 24) return b.setWinLines || !1;
        switch (I) {
          case 1:
            return !!b.restoreWin;
          case 2:
            return !!b.minimizeWin;
          case 3:
            return !!b.setWinPosition;
          case 4:
            return !!b.setWinSizePixels;
          case 5:
            return !!b.raiseWin;
          case 6:
            return !!b.lowerWin;
          case 7:
            return !!b.refreshWin;
          case 8:
            return !!b.setWinSizeChars;
          case 9:
            return !!b.maximizeWin;
          case 10:
            return !!b.fullscreenWin;
          case 11:
            return !!b.getWinState;
          case 13:
            return !!b.getWinPosition;
          case 14:
            return !!b.getWinSizePixels;
          case 15:
            return !!b.getScreenSizePixels;
          case 16:
            return !!b.getCellSizePixels;
          case 18:
            return !!b.getWinSizeChars;
          case 19:
            return !!b.getScreenSizeChars;
          case 20:
            return !!b.getIconTitle;
          case 21:
            return !!b.getWinTitle;
          case 22:
            return !!b.pushTitle;
          case 23:
            return !!b.popTitle;
          case 24:
            return !!b.setWinLines;
        }
        return !1;
      }
      var y;
      (function(I) {
        I[I.GET_WIN_SIZE_PIXELS = 0] = "GET_WIN_SIZE_PIXELS", I[I.GET_CELL_SIZE_PIXELS = 1] = "GET_CELL_SIZE_PIXELS";
      })(y || (s.WindowsOptionsReportType = y = {}));
      let x = 0;
      class A extends g.Disposable {
        getAttrData() {
          return this._curAttrData;
        }
        constructor(b, E, k, L, H, j, q, K, Q = new v.EscapeSequenceParser()) {
          super(), this._bufferService = b, this._charsetService = E, this._coreService = k, this._logService = L, this._optionsService = H, this._oscLinkService = j, this._coreMouseService = q, this._unicodeService = K, this._parser = Q, this._parseBuffer = new Uint32Array(4096), this._stringDecoder = new u.StringToUtf32(), this._utf8Decoder = new u.Utf8ToUtf32(), this._workCell = new r.CellData(), this._windowTitle = "", this._iconName = "", this._windowTitleStack = [], this._iconNameStack = [], this._curAttrData = e.DEFAULT_ATTR_DATA.clone(), this._eraseAttrDataInternal = e.DEFAULT_ATTR_DATA.clone(), this._onRequestBell = this.register(new i.EventEmitter()), this.onRequestBell = this._onRequestBell.event, this._onRequestRefreshRows = this.register(new i.EventEmitter()), this.onRequestRefreshRows = this._onRequestRefreshRows.event, this._onRequestReset = this.register(new i.EventEmitter()), this.onRequestReset = this._onRequestReset.event, this._onRequestSendFocus = this.register(new i.EventEmitter()), this.onRequestSendFocus = this._onRequestSendFocus.event, this._onRequestSyncScrollBar = this.register(new i.EventEmitter()), this.onRequestSyncScrollBar = this._onRequestSyncScrollBar.event, this._onRequestWindowsOptionsReport = this.register(new i.EventEmitter()), this.onRequestWindowsOptionsReport = this._onRequestWindowsOptionsReport.event, this._onA11yChar = this.register(new i.EventEmitter()), this.onA11yChar = this._onA11yChar.event, this._onA11yTab = this.register(new i.EventEmitter()), this.onA11yTab = this._onA11yTab.event, this._onCursorMove = this.register(new i.EventEmitter()), this.onCursorMove = this._onCursorMove.event, this._onLineFeed = this.register(new i.EventEmitter()), this.onLineFeed = this._onLineFeed.event, this._onScroll = this.register(new i.EventEmitter()), this.onScroll = this._onScroll.event, this._onTitleChange = this.register(new i.EventEmitter()), this.onTitleChange = this._onTitleChange.event, this._onColor = this.register(new i.EventEmitter()), this.onColor = this._onColor.event, this._parseStack = { paused: !1, cursorStartX: 0, cursorStartY: 0, decodedLength: 0, position: 0 }, this._specialColors = [256, 257, 258], this.register(this._parser), this._dirtyRowTracker = new O(this._bufferService), this._activeBuffer = this._bufferService.buffer, this.register(this._bufferService.buffers.onBufferActivate((S) => this._activeBuffer = S.activeBuffer)), this._parser.setCsiHandlerFallback((S, R) => {
            this._logService.debug("Unknown CSI code: ", { identifier: this._parser.identToString(S), params: R.toArray() });
          }), this._parser.setEscHandlerFallback((S) => {
            this._logService.debug("Unknown ESC code: ", { identifier: this._parser.identToString(S) });
          }), this._parser.setExecuteHandlerFallback((S) => {
            this._logService.debug("Unknown EXECUTE code: ", { code: S });
          }), this._parser.setOscHandlerFallback((S, R, M) => {
            this._logService.debug("Unknown OSC code: ", { identifier: S, action: R, data: M });
          }), this._parser.setDcsHandlerFallback((S, R, M) => {
            R === "HOOK" && (M = M.toArray()), this._logService.debug("Unknown DCS code: ", { identifier: this._parser.identToString(S), action: R, payload: M });
          }), this._parser.setPrintHandler((S, R, M) => this.print(S, R, M)), this._parser.registerCsiHandler({ final: "@" }, (S) => this.insertChars(S)), this._parser.registerCsiHandler({ intermediates: " ", final: "@" }, (S) => this.scrollLeft(S)), this._parser.registerCsiHandler({ final: "A" }, (S) => this.cursorUp(S)), this._parser.registerCsiHandler({ intermediates: " ", final: "A" }, (S) => this.scrollRight(S)), this._parser.registerCsiHandler({ final: "B" }, (S) => this.cursorDown(S)), this._parser.registerCsiHandler({ final: "C" }, (S) => this.cursorForward(S)), this._parser.registerCsiHandler({ final: "D" }, (S) => this.cursorBackward(S)), this._parser.registerCsiHandler({ final: "E" }, (S) => this.cursorNextLine(S)), this._parser.registerCsiHandler({ final: "F" }, (S) => this.cursorPrecedingLine(S)), this._parser.registerCsiHandler({ final: "G" }, (S) => this.cursorCharAbsolute(S)), this._parser.registerCsiHandler({ final: "H" }, (S) => this.cursorPosition(S)), this._parser.registerCsiHandler({ final: "I" }, (S) => this.cursorForwardTab(S)), this._parser.registerCsiHandler({ final: "J" }, (S) => this.eraseInDisplay(S, !1)), this._parser.registerCsiHandler({ prefix: "?", final: "J" }, (S) => this.eraseInDisplay(S, !0)), this._parser.registerCsiHandler({ final: "K" }, (S) => this.eraseInLine(S, !1)), this._parser.registerCsiHandler({ prefix: "?", final: "K" }, (S) => this.eraseInLine(S, !0)), this._parser.registerCsiHandler({ final: "L" }, (S) => this.insertLines(S)), this._parser.registerCsiHandler({ final: "M" }, (S) => this.deleteLines(S)), this._parser.registerCsiHandler({ final: "P" }, (S) => this.deleteChars(S)), this._parser.registerCsiHandler({ final: "S" }, (S) => this.scrollUp(S)), this._parser.registerCsiHandler({ final: "T" }, (S) => this.scrollDown(S)), this._parser.registerCsiHandler({ final: "X" }, (S) => this.eraseChars(S)), this._parser.registerCsiHandler({ final: "Z" }, (S) => this.cursorBackwardTab(S)), this._parser.registerCsiHandler({ final: "`" }, (S) => this.charPosAbsolute(S)), this._parser.registerCsiHandler({ final: "a" }, (S) => this.hPositionRelative(S)), this._parser.registerCsiHandler({ final: "b" }, (S) => this.repeatPrecedingCharacter(S)), this._parser.registerCsiHandler({ final: "c" }, (S) => this.sendDeviceAttributesPrimary(S)), this._parser.registerCsiHandler({ prefix: ">", final: "c" }, (S) => this.sendDeviceAttributesSecondary(S)), this._parser.registerCsiHandler({ final: "d" }, (S) => this.linePosAbsolute(S)), this._parser.registerCsiHandler({ final: "e" }, (S) => this.vPositionRelative(S)), this._parser.registerCsiHandler({ final: "f" }, (S) => this.hVPosition(S)), this._parser.registerCsiHandler({ final: "g" }, (S) => this.tabClear(S)), this._parser.registerCsiHandler({ final: "h" }, (S) => this.setMode(S)), this._parser.registerCsiHandler({ prefix: "?", final: "h" }, (S) => this.setModePrivate(S)), this._parser.registerCsiHandler({ final: "l" }, (S) => this.resetMode(S)), this._parser.registerCsiHandler({ prefix: "?", final: "l" }, (S) => this.resetModePrivate(S)), this._parser.registerCsiHandler({ final: "m" }, (S) => this.charAttributes(S)), this._parser.registerCsiHandler({ final: "n" }, (S) => this.deviceStatus(S)), this._parser.registerCsiHandler({ prefix: "?", final: "n" }, (S) => this.deviceStatusPrivate(S)), this._parser.registerCsiHandler({ intermediates: "!", final: "p" }, (S) => this.softReset(S)), this._parser.registerCsiHandler({ intermediates: " ", final: "q" }, (S) => this.setCursorStyle(S)), this._parser.registerCsiHandler({ final: "r" }, (S) => this.setScrollRegion(S)), this._parser.registerCsiHandler({ final: "s" }, (S) => this.saveCursor(S)), this._parser.registerCsiHandler({ final: "t" }, (S) => this.windowOptions(S)), this._parser.registerCsiHandler({ final: "u" }, (S) => this.restoreCursor(S)), this._parser.registerCsiHandler({ intermediates: "'", final: "}" }, (S) => this.insertColumns(S)), this._parser.registerCsiHandler({ intermediates: "'", final: "~" }, (S) => this.deleteColumns(S)), this._parser.registerCsiHandler({ intermediates: '"', final: "q" }, (S) => this.selectProtected(S)), this._parser.registerCsiHandler({ intermediates: "$", final: "p" }, (S) => this.requestMode(S, !0)), this._parser.registerCsiHandler({ prefix: "?", intermediates: "$", final: "p" }, (S) => this.requestMode(S, !1)), this._parser.setExecuteHandler(n.C0.BEL, () => this.bell()), this._parser.setExecuteHandler(n.C0.LF, () => this.lineFeed()), this._parser.setExecuteHandler(n.C0.VT, () => this.lineFeed()), this._parser.setExecuteHandler(n.C0.FF, () => this.lineFeed()), this._parser.setExecuteHandler(n.C0.CR, () => this.carriageReturn()), this._parser.setExecuteHandler(n.C0.BS, () => this.backspace()), this._parser.setExecuteHandler(n.C0.HT, () => this.tab()), this._parser.setExecuteHandler(n.C0.SO, () => this.shiftOut()), this._parser.setExecuteHandler(n.C0.SI, () => this.shiftIn()), this._parser.setExecuteHandler(n.C1.IND, () => this.index()), this._parser.setExecuteHandler(n.C1.NEL, () => this.nextLine()), this._parser.setExecuteHandler(n.C1.HTS, () => this.tabSet()), this._parser.registerOscHandler(0, new f.OscHandler((S) => (this.setTitle(S), this.setIconName(S), !0))), this._parser.registerOscHandler(1, new f.OscHandler((S) => this.setIconName(S))), this._parser.registerOscHandler(2, new f.OscHandler((S) => this.setTitle(S))), this._parser.registerOscHandler(4, new f.OscHandler((S) => this.setOrReportIndexedColor(S))), this._parser.registerOscHandler(8, new f.OscHandler((S) => this.setHyperlink(S))), this._parser.registerOscHandler(10, new f.OscHandler((S) => this.setOrReportFgColor(S))), this._parser.registerOscHandler(11, new f.OscHandler((S) => this.setOrReportBgColor(S))), this._parser.registerOscHandler(12, new f.OscHandler((S) => this.setOrReportCursorColor(S))), this._parser.registerOscHandler(104, new f.OscHandler((S) => this.restoreIndexedColor(S))), this._parser.registerOscHandler(110, new f.OscHandler((S) => this.restoreFgColor(S))), this._parser.registerOscHandler(111, new f.OscHandler((S) => this.restoreBgColor(S))), this._parser.registerOscHandler(112, new f.OscHandler((S) => this.restoreCursorColor(S))), this._parser.registerEscHandler({ final: "7" }, () => this.saveCursor()), this._parser.registerEscHandler({ final: "8" }, () => this.restoreCursor()), this._parser.registerEscHandler({ final: "D" }, () => this.index()), this._parser.registerEscHandler({ final: "E" }, () => this.nextLine()), this._parser.registerEscHandler({ final: "H" }, () => this.tabSet()), this._parser.registerEscHandler({ final: "M" }, () => this.reverseIndex()), this._parser.registerEscHandler({ final: "=" }, () => this.keypadApplicationMode()), this._parser.registerEscHandler({ final: ">" }, () => this.keypadNumericMode()), this._parser.registerEscHandler({ final: "c" }, () => this.fullReset()), this._parser.registerEscHandler({ final: "n" }, () => this.setgLevel(2)), this._parser.registerEscHandler({ final: "o" }, () => this.setgLevel(3)), this._parser.registerEscHandler({ final: "|" }, () => this.setgLevel(3)), this._parser.registerEscHandler({ final: "}" }, () => this.setgLevel(2)), this._parser.registerEscHandler({ final: "~" }, () => this.setgLevel(1)), this._parser.registerEscHandler({ intermediates: "%", final: "@" }, () => this.selectDefaultCharset()), this._parser.registerEscHandler({ intermediates: "%", final: "G" }, () => this.selectDefaultCharset());
          for (const S in d.CHARSETS) this._parser.registerEscHandler({ intermediates: "(", final: S }, () => this.selectCharset("(" + S)), this._parser.registerEscHandler({ intermediates: ")", final: S }, () => this.selectCharset(")" + S)), this._parser.registerEscHandler({ intermediates: "*", final: S }, () => this.selectCharset("*" + S)), this._parser.registerEscHandler({ intermediates: "+", final: S }, () => this.selectCharset("+" + S)), this._parser.registerEscHandler({ intermediates: "-", final: S }, () => this.selectCharset("-" + S)), this._parser.registerEscHandler({ intermediates: ".", final: S }, () => this.selectCharset("." + S)), this._parser.registerEscHandler({ intermediates: "/", final: S }, () => this.selectCharset("/" + S));
          this._parser.registerEscHandler({ intermediates: "#", final: "8" }, () => this.screenAlignmentPattern()), this._parser.setErrorHandler((S) => (this._logService.error("Parsing error: ", S), S)), this._parser.registerDcsHandler({ intermediates: "$", final: "q" }, new m.DcsHandler((S, R) => this.requestStatusString(S, R)));
        }
        _preserveStack(b, E, k, L) {
          this._parseStack.paused = !0, this._parseStack.cursorStartX = b, this._parseStack.cursorStartY = E, this._parseStack.decodedLength = k, this._parseStack.position = L;
        }
        _logSlowResolvingAsync(b) {
          this._logService.logLevel <= l.LogLevelEnum.WARN && Promise.race([b, new Promise((E, k) => setTimeout(() => k("#SLOW_TIMEOUT"), 5e3))]).catch((E) => {
            if (E !== "#SLOW_TIMEOUT") throw E;
            console.warn("async parser handler taking longer than 5000 ms");
          });
        }
        _getCurrentLinkId() {
          return this._curAttrData.extended.urlId;
        }
        parse(b, E) {
          let k, L = this._activeBuffer.x, H = this._activeBuffer.y, j = 0;
          const q = this._parseStack.paused;
          if (q) {
            if (k = this._parser.parse(this._parseBuffer, this._parseStack.decodedLength, E)) return this._logSlowResolvingAsync(k), k;
            L = this._parseStack.cursorStartX, H = this._parseStack.cursorStartY, this._parseStack.paused = !1, b.length > w && (j = this._parseStack.position + w);
          }
          if (this._logService.logLevel <= l.LogLevelEnum.DEBUG && this._logService.debug("parsing data" + (typeof b == "string" ? ` "${b}"` : ` "${Array.prototype.map.call(b, (K) => String.fromCharCode(K)).join("")}"`), typeof b == "string" ? b.split("").map((K) => K.charCodeAt(0)) : b), this._parseBuffer.length < b.length && this._parseBuffer.length < w && (this._parseBuffer = new Uint32Array(Math.min(b.length, w))), q || this._dirtyRowTracker.clearRange(), b.length > w) for (let K = j; K < b.length; K += w) {
            const Q = K + w < b.length ? K + w : b.length, S = typeof b == "string" ? this._stringDecoder.decode(b.substring(K, Q), this._parseBuffer) : this._utf8Decoder.decode(b.subarray(K, Q), this._parseBuffer);
            if (k = this._parser.parse(this._parseBuffer, S)) return this._preserveStack(L, H, S, K), this._logSlowResolvingAsync(k), k;
          }
          else if (!q) {
            const K = typeof b == "string" ? this._stringDecoder.decode(b, this._parseBuffer) : this._utf8Decoder.decode(b, this._parseBuffer);
            if (k = this._parser.parse(this._parseBuffer, K)) return this._preserveStack(L, H, K, 0), this._logSlowResolvingAsync(k), k;
          }
          this._activeBuffer.x === L && this._activeBuffer.y === H || this._onCursorMove.fire(), this._onRequestRefreshRows.fire(this._dirtyRowTracker.start, this._dirtyRowTracker.end);
        }
        print(b, E, k) {
          let L, H;
          const j = this._charsetService.charset, q = this._optionsService.rawOptions.screenReaderMode, K = this._bufferService.cols, Q = this._coreService.decPrivateModes.wraparound, S = this._coreService.modes.insertMode, R = this._curAttrData;
          let M = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._activeBuffer.x && k - E > 0 && M.getWidth(this._activeBuffer.x - 1) === 2 && M.setCellFromCodePoint(this._activeBuffer.x - 1, 0, 1, R.fg, R.bg, R.extended);
          for (let T = E; T < k; ++T) {
            if (L = b[T], H = this._unicodeService.wcwidth(L), L < 127 && j) {
              const G = j[String.fromCharCode(L)];
              G && (L = G.charCodeAt(0));
            }
            if (q && this._onA11yChar.fire((0, u.stringFromCodePoint)(L)), this._getCurrentLinkId() && this._oscLinkService.addLineToLink(this._getCurrentLinkId(), this._activeBuffer.ybase + this._activeBuffer.y), H || !this._activeBuffer.x) {
              if (this._activeBuffer.x + H - 1 >= K) {
                if (Q) {
                  for (; this._activeBuffer.x < K; ) M.setCellFromCodePoint(this._activeBuffer.x++, 0, 1, R.fg, R.bg, R.extended);
                  this._activeBuffer.x = 0, this._activeBuffer.y++, this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--, this._bufferService.scroll(this._eraseAttrData(), !0)) : (this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1), this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = !0), M = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
                } else if (this._activeBuffer.x = K - 1, H === 2) continue;
              }
              if (S && (M.insertCells(this._activeBuffer.x, H, this._activeBuffer.getNullCell(R), R), M.getWidth(K - 1) === 2 && M.setCellFromCodePoint(K - 1, t.NULL_CELL_CODE, t.NULL_CELL_WIDTH, R.fg, R.bg, R.extended)), M.setCellFromCodePoint(this._activeBuffer.x++, L, H, R.fg, R.bg, R.extended), H > 0) for (; --H; ) M.setCellFromCodePoint(this._activeBuffer.x++, 0, 0, R.fg, R.bg, R.extended);
            } else M.getWidth(this._activeBuffer.x - 1) ? M.addCodepointToCell(this._activeBuffer.x - 1, L) : M.addCodepointToCell(this._activeBuffer.x - 2, L);
          }
          k - E > 0 && (M.loadCell(this._activeBuffer.x - 1, this._workCell), this._workCell.getWidth() === 2 || this._workCell.getCode() > 65535 ? this._parser.precedingCodepoint = 0 : this._workCell.isCombined() ? this._parser.precedingCodepoint = this._workCell.getChars().charCodeAt(0) : this._parser.precedingCodepoint = this._workCell.content), this._activeBuffer.x < K && k - E > 0 && M.getWidth(this._activeBuffer.x) === 0 && !M.hasContent(this._activeBuffer.x) && M.setCellFromCodePoint(this._activeBuffer.x, 0, 1, R.fg, R.bg, R.extended), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
        }
        registerCsiHandler(b, E) {
          return b.final !== "t" || b.prefix || b.intermediates ? this._parser.registerCsiHandler(b, E) : this._parser.registerCsiHandler(b, (k) => !C(k.params[0], this._optionsService.rawOptions.windowOptions) || E(k));
        }
        registerDcsHandler(b, E) {
          return this._parser.registerDcsHandler(b, new m.DcsHandler(E));
        }
        registerEscHandler(b, E) {
          return this._parser.registerEscHandler(b, E);
        }
        registerOscHandler(b, E) {
          return this._parser.registerOscHandler(b, new f.OscHandler(E));
        }
        bell() {
          return this._onRequestBell.fire(), !0;
        }
        lineFeed() {
          return this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._optionsService.rawOptions.convertEol && (this._activeBuffer.x = 0), this._activeBuffer.y++, this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--, this._bufferService.scroll(this._eraseAttrData())) : this._activeBuffer.y >= this._bufferService.rows ? this._activeBuffer.y = this._bufferService.rows - 1 : this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = !1, this._activeBuffer.x >= this._bufferService.cols && this._activeBuffer.x--, this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._onLineFeed.fire(), !0;
        }
        carriageReturn() {
          return this._activeBuffer.x = 0, !0;
        }
        backspace() {
          var b;
          if (!this._coreService.decPrivateModes.reverseWraparound) return this._restrictCursor(), this._activeBuffer.x > 0 && this._activeBuffer.x--, !0;
          if (this._restrictCursor(this._bufferService.cols), this._activeBuffer.x > 0) this._activeBuffer.x--;
          else if (this._activeBuffer.x === 0 && this._activeBuffer.y > this._activeBuffer.scrollTop && this._activeBuffer.y <= this._activeBuffer.scrollBottom && (!((b = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y)) === null || b === void 0) && b.isWrapped)) {
            this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = !1, this._activeBuffer.y--, this._activeBuffer.x = this._bufferService.cols - 1;
            const E = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
            E.hasWidth(this._activeBuffer.x) && !E.hasContent(this._activeBuffer.x) && this._activeBuffer.x--;
          }
          return this._restrictCursor(), !0;
        }
        tab() {
          if (this._activeBuffer.x >= this._bufferService.cols) return !0;
          const b = this._activeBuffer.x;
          return this._activeBuffer.x = this._activeBuffer.nextStop(), this._optionsService.rawOptions.screenReaderMode && this._onA11yTab.fire(this._activeBuffer.x - b), !0;
        }
        shiftOut() {
          return this._charsetService.setgLevel(1), !0;
        }
        shiftIn() {
          return this._charsetService.setgLevel(0), !0;
        }
        _restrictCursor(b = this._bufferService.cols - 1) {
          this._activeBuffer.x = Math.min(b, Math.max(0, this._activeBuffer.x)), this._activeBuffer.y = this._coreService.decPrivateModes.origin ? Math.min(this._activeBuffer.scrollBottom, Math.max(this._activeBuffer.scrollTop, this._activeBuffer.y)) : Math.min(this._bufferService.rows - 1, Math.max(0, this._activeBuffer.y)), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
        }
        _setCursor(b, E) {
          this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._coreService.decPrivateModes.origin ? (this._activeBuffer.x = b, this._activeBuffer.y = this._activeBuffer.scrollTop + E) : (this._activeBuffer.x = b, this._activeBuffer.y = E), this._restrictCursor(), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
        }
        _moveCursor(b, E) {
          this._restrictCursor(), this._setCursor(this._activeBuffer.x + b, this._activeBuffer.y + E);
        }
        cursorUp(b) {
          const E = this._activeBuffer.y - this._activeBuffer.scrollTop;
          return E >= 0 ? this._moveCursor(0, -Math.min(E, b.params[0] || 1)) : this._moveCursor(0, -(b.params[0] || 1)), !0;
        }
        cursorDown(b) {
          const E = this._activeBuffer.scrollBottom - this._activeBuffer.y;
          return E >= 0 ? this._moveCursor(0, Math.min(E, b.params[0] || 1)) : this._moveCursor(0, b.params[0] || 1), !0;
        }
        cursorForward(b) {
          return this._moveCursor(b.params[0] || 1, 0), !0;
        }
        cursorBackward(b) {
          return this._moveCursor(-(b.params[0] || 1), 0), !0;
        }
        cursorNextLine(b) {
          return this.cursorDown(b), this._activeBuffer.x = 0, !0;
        }
        cursorPrecedingLine(b) {
          return this.cursorUp(b), this._activeBuffer.x = 0, !0;
        }
        cursorCharAbsolute(b) {
          return this._setCursor((b.params[0] || 1) - 1, this._activeBuffer.y), !0;
        }
        cursorPosition(b) {
          return this._setCursor(b.length >= 2 ? (b.params[1] || 1) - 1 : 0, (b.params[0] || 1) - 1), !0;
        }
        charPosAbsolute(b) {
          return this._setCursor((b.params[0] || 1) - 1, this._activeBuffer.y), !0;
        }
        hPositionRelative(b) {
          return this._moveCursor(b.params[0] || 1, 0), !0;
        }
        linePosAbsolute(b) {
          return this._setCursor(this._activeBuffer.x, (b.params[0] || 1) - 1), !0;
        }
        vPositionRelative(b) {
          return this._moveCursor(0, b.params[0] || 1), !0;
        }
        hVPosition(b) {
          return this.cursorPosition(b), !0;
        }
        tabClear(b) {
          const E = b.params[0];
          return E === 0 ? delete this._activeBuffer.tabs[this._activeBuffer.x] : E === 3 && (this._activeBuffer.tabs = {}), !0;
        }
        cursorForwardTab(b) {
          if (this._activeBuffer.x >= this._bufferService.cols) return !0;
          let E = b.params[0] || 1;
          for (; E--; ) this._activeBuffer.x = this._activeBuffer.nextStop();
          return !0;
        }
        cursorBackwardTab(b) {
          if (this._activeBuffer.x >= this._bufferService.cols) return !0;
          let E = b.params[0] || 1;
          for (; E--; ) this._activeBuffer.x = this._activeBuffer.prevStop();
          return !0;
        }
        selectProtected(b) {
          const E = b.params[0];
          return E === 1 && (this._curAttrData.bg |= 536870912), E !== 2 && E !== 0 || (this._curAttrData.bg &= -536870913), !0;
        }
        _eraseInBufferLine(b, E, k, L = !1, H = !1) {
          const j = this._activeBuffer.lines.get(this._activeBuffer.ybase + b);
          j.replaceCells(E, k, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData(), H), L && (j.isWrapped = !1);
        }
        _resetBufferLine(b, E = !1) {
          const k = this._activeBuffer.lines.get(this._activeBuffer.ybase + b);
          k && (k.fill(this._activeBuffer.getNullCell(this._eraseAttrData()), E), this._bufferService.buffer.clearMarkers(this._activeBuffer.ybase + b), k.isWrapped = !1);
        }
        eraseInDisplay(b, E = !1) {
          let k;
          switch (this._restrictCursor(this._bufferService.cols), b.params[0]) {
            case 0:
              for (k = this._activeBuffer.y, this._dirtyRowTracker.markDirty(k), this._eraseInBufferLine(k++, this._activeBuffer.x, this._bufferService.cols, this._activeBuffer.x === 0, E); k < this._bufferService.rows; k++) this._resetBufferLine(k, E);
              this._dirtyRowTracker.markDirty(k);
              break;
            case 1:
              for (k = this._activeBuffer.y, this._dirtyRowTracker.markDirty(k), this._eraseInBufferLine(k, 0, this._activeBuffer.x + 1, !0, E), this._activeBuffer.x + 1 >= this._bufferService.cols && (this._activeBuffer.lines.get(k + 1).isWrapped = !1); k--; ) this._resetBufferLine(k, E);
              this._dirtyRowTracker.markDirty(0);
              break;
            case 2:
              for (k = this._bufferService.rows, this._dirtyRowTracker.markDirty(k - 1); k--; ) this._resetBufferLine(k, E);
              this._dirtyRowTracker.markDirty(0);
              break;
            case 3:
              const L = this._activeBuffer.lines.length - this._bufferService.rows;
              L > 0 && (this._activeBuffer.lines.trimStart(L), this._activeBuffer.ybase = Math.max(this._activeBuffer.ybase - L, 0), this._activeBuffer.ydisp = Math.max(this._activeBuffer.ydisp - L, 0), this._onScroll.fire(0));
          }
          return !0;
        }
        eraseInLine(b, E = !1) {
          switch (this._restrictCursor(this._bufferService.cols), b.params[0]) {
            case 0:
              this._eraseInBufferLine(this._activeBuffer.y, this._activeBuffer.x, this._bufferService.cols, this._activeBuffer.x === 0, E);
              break;
            case 1:
              this._eraseInBufferLine(this._activeBuffer.y, 0, this._activeBuffer.x + 1, !1, E);
              break;
            case 2:
              this._eraseInBufferLine(this._activeBuffer.y, 0, this._bufferService.cols, !0, E);
          }
          return this._dirtyRowTracker.markDirty(this._activeBuffer.y), !0;
        }
        insertLines(b) {
          this._restrictCursor();
          let E = b.params[0] || 1;
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const k = this._activeBuffer.ybase + this._activeBuffer.y, L = this._bufferService.rows - 1 - this._activeBuffer.scrollBottom, H = this._bufferService.rows - 1 + this._activeBuffer.ybase - L + 1;
          for (; E--; ) this._activeBuffer.lines.splice(H - 1, 1), this._activeBuffer.lines.splice(k, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom), this._activeBuffer.x = 0, !0;
        }
        deleteLines(b) {
          this._restrictCursor();
          let E = b.params[0] || 1;
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const k = this._activeBuffer.ybase + this._activeBuffer.y;
          let L;
          for (L = this._bufferService.rows - 1 - this._activeBuffer.scrollBottom, L = this._bufferService.rows - 1 + this._activeBuffer.ybase - L; E--; ) this._activeBuffer.lines.splice(k, 1), this._activeBuffer.lines.splice(L, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom), this._activeBuffer.x = 0, !0;
        }
        insertChars(b) {
          this._restrictCursor();
          const E = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          return E && (E.insertCells(this._activeBuffer.x, b.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), !0;
        }
        deleteChars(b) {
          this._restrictCursor();
          const E = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          return E && (E.deleteCells(this._activeBuffer.x, b.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), !0;
        }
        scrollUp(b) {
          let E = b.params[0] || 1;
          for (; E--; ) this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 1), this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        scrollDown(b) {
          let E = b.params[0] || 1;
          for (; E--; ) this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 1), this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 0, this._activeBuffer.getBlankLine(e.DEFAULT_ATTR_DATA));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        scrollLeft(b) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const E = b.params[0] || 1;
          for (let k = this._activeBuffer.scrollTop; k <= this._activeBuffer.scrollBottom; ++k) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + k);
            L.deleteCells(0, E, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        scrollRight(b) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const E = b.params[0] || 1;
          for (let k = this._activeBuffer.scrollTop; k <= this._activeBuffer.scrollBottom; ++k) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + k);
            L.insertCells(0, E, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        insertColumns(b) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const E = b.params[0] || 1;
          for (let k = this._activeBuffer.scrollTop; k <= this._activeBuffer.scrollBottom; ++k) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + k);
            L.insertCells(this._activeBuffer.x, E, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        deleteColumns(b) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const E = b.params[0] || 1;
          for (let k = this._activeBuffer.scrollTop; k <= this._activeBuffer.scrollBottom; ++k) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + k);
            L.deleteCells(this._activeBuffer.x, E, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        eraseChars(b) {
          this._restrictCursor();
          const E = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          return E && (E.replaceCells(this._activeBuffer.x, this._activeBuffer.x + (b.params[0] || 1), this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), !0;
        }
        repeatPrecedingCharacter(b) {
          if (!this._parser.precedingCodepoint) return !0;
          const E = b.params[0] || 1, k = new Uint32Array(E);
          for (let L = 0; L < E; ++L) k[L] = this._parser.precedingCodepoint;
          return this.print(k, 0, k.length), !0;
        }
        sendDeviceAttributesPrimary(b) {
          return b.params[0] > 0 || (this._is("xterm") || this._is("rxvt-unicode") || this._is("screen") ? this._coreService.triggerDataEvent(n.C0.ESC + "[?1;2c") : this._is("linux") && this._coreService.triggerDataEvent(n.C0.ESC + "[?6c")), !0;
        }
        sendDeviceAttributesSecondary(b) {
          return b.params[0] > 0 || (this._is("xterm") ? this._coreService.triggerDataEvent(n.C0.ESC + "[>0;276;0c") : this._is("rxvt-unicode") ? this._coreService.triggerDataEvent(n.C0.ESC + "[>85;95;0c") : this._is("linux") ? this._coreService.triggerDataEvent(b.params[0] + "c") : this._is("screen") && this._coreService.triggerDataEvent(n.C0.ESC + "[>83;40003;0c")), !0;
        }
        _is(b) {
          return (this._optionsService.rawOptions.termName + "").indexOf(b) === 0;
        }
        setMode(b) {
          for (let E = 0; E < b.length; E++) switch (b.params[E]) {
            case 4:
              this._coreService.modes.insertMode = !0;
              break;
            case 20:
              this._optionsService.options.convertEol = !0;
          }
          return !0;
        }
        setModePrivate(b) {
          for (let E = 0; E < b.length; E++) switch (b.params[E]) {
            case 1:
              this._coreService.decPrivateModes.applicationCursorKeys = !0;
              break;
            case 2:
              this._charsetService.setgCharset(0, d.DEFAULT_CHARSET), this._charsetService.setgCharset(1, d.DEFAULT_CHARSET), this._charsetService.setgCharset(2, d.DEFAULT_CHARSET), this._charsetService.setgCharset(3, d.DEFAULT_CHARSET);
              break;
            case 3:
              this._optionsService.rawOptions.windowOptions.setWinLines && (this._bufferService.resize(132, this._bufferService.rows), this._onRequestReset.fire());
              break;
            case 6:
              this._coreService.decPrivateModes.origin = !0, this._setCursor(0, 0);
              break;
            case 7:
              this._coreService.decPrivateModes.wraparound = !0;
              break;
            case 12:
              this._optionsService.options.cursorBlink = !0;
              break;
            case 45:
              this._coreService.decPrivateModes.reverseWraparound = !0;
              break;
            case 66:
              this._logService.debug("Serial port requested application keypad."), this._coreService.decPrivateModes.applicationKeypad = !0, this._onRequestSyncScrollBar.fire();
              break;
            case 9:
              this._coreMouseService.activeProtocol = "X10";
              break;
            case 1e3:
              this._coreMouseService.activeProtocol = "VT200";
              break;
            case 1002:
              this._coreMouseService.activeProtocol = "DRAG";
              break;
            case 1003:
              this._coreMouseService.activeProtocol = "ANY";
              break;
            case 1004:
              this._coreService.decPrivateModes.sendFocus = !0, this._onRequestSendFocus.fire();
              break;
            case 1005:
              this._logService.debug("DECSET 1005 not supported (see #2507)");
              break;
            case 1006:
              this._coreMouseService.activeEncoding = "SGR";
              break;
            case 1015:
              this._logService.debug("DECSET 1015 not supported (see #2507)");
              break;
            case 1016:
              this._coreMouseService.activeEncoding = "SGR_PIXELS";
              break;
            case 25:
              this._coreService.isCursorHidden = !1;
              break;
            case 1048:
              this.saveCursor();
              break;
            case 1049:
              this.saveCursor();
            case 47:
            case 1047:
              this._bufferService.buffers.activateAltBuffer(this._eraseAttrData()), this._coreService.isCursorInitialized = !0, this._onRequestRefreshRows.fire(0, this._bufferService.rows - 1), this._onRequestSyncScrollBar.fire();
              break;
            case 2004:
              this._coreService.decPrivateModes.bracketedPasteMode = !0;
          }
          return !0;
        }
        resetMode(b) {
          for (let E = 0; E < b.length; E++) switch (b.params[E]) {
            case 4:
              this._coreService.modes.insertMode = !1;
              break;
            case 20:
              this._optionsService.options.convertEol = !1;
          }
          return !0;
        }
        resetModePrivate(b) {
          for (let E = 0; E < b.length; E++) switch (b.params[E]) {
            case 1:
              this._coreService.decPrivateModes.applicationCursorKeys = !1;
              break;
            case 3:
              this._optionsService.rawOptions.windowOptions.setWinLines && (this._bufferService.resize(80, this._bufferService.rows), this._onRequestReset.fire());
              break;
            case 6:
              this._coreService.decPrivateModes.origin = !1, this._setCursor(0, 0);
              break;
            case 7:
              this._coreService.decPrivateModes.wraparound = !1;
              break;
            case 12:
              this._optionsService.options.cursorBlink = !1;
              break;
            case 45:
              this._coreService.decPrivateModes.reverseWraparound = !1;
              break;
            case 66:
              this._logService.debug("Switching back to normal keypad."), this._coreService.decPrivateModes.applicationKeypad = !1, this._onRequestSyncScrollBar.fire();
              break;
            case 9:
            case 1e3:
            case 1002:
            case 1003:
              this._coreMouseService.activeProtocol = "NONE";
              break;
            case 1004:
              this._coreService.decPrivateModes.sendFocus = !1;
              break;
            case 1005:
              this._logService.debug("DECRST 1005 not supported (see #2507)");
              break;
            case 1006:
            case 1016:
              this._coreMouseService.activeEncoding = "DEFAULT";
              break;
            case 1015:
              this._logService.debug("DECRST 1015 not supported (see #2507)");
              break;
            case 25:
              this._coreService.isCursorHidden = !0;
              break;
            case 1048:
              this.restoreCursor();
              break;
            case 1049:
            case 47:
            case 1047:
              this._bufferService.buffers.activateNormalBuffer(), b.params[E] === 1049 && this.restoreCursor(), this._coreService.isCursorInitialized = !0, this._onRequestRefreshRows.fire(0, this._bufferService.rows - 1), this._onRequestSyncScrollBar.fire();
              break;
            case 2004:
              this._coreService.decPrivateModes.bracketedPasteMode = !1;
          }
          return !0;
        }
        requestMode(b, E) {
          const k = this._coreService.decPrivateModes, { activeProtocol: L, activeEncoding: H } = this._coreMouseService, j = this._coreService, { buffers: q, cols: K } = this._bufferService, { active: Q, alt: S } = q, R = this._optionsService.rawOptions, M = (Z) => Z ? 1 : 2, T = b.params[0];
          return G = T, $ = E ? T === 2 ? 4 : T === 4 ? M(j.modes.insertMode) : T === 12 ? 3 : T === 20 ? M(R.convertEol) : 0 : T === 1 ? M(k.applicationCursorKeys) : T === 3 ? R.windowOptions.setWinLines ? K === 80 ? 2 : K === 132 ? 1 : 0 : 0 : T === 6 ? M(k.origin) : T === 7 ? M(k.wraparound) : T === 8 ? 3 : T === 9 ? M(L === "X10") : T === 12 ? M(R.cursorBlink) : T === 25 ? M(!j.isCursorHidden) : T === 45 ? M(k.reverseWraparound) : T === 66 ? M(k.applicationKeypad) : T === 67 ? 4 : T === 1e3 ? M(L === "VT200") : T === 1002 ? M(L === "DRAG") : T === 1003 ? M(L === "ANY") : T === 1004 ? M(k.sendFocus) : T === 1005 ? 4 : T === 1006 ? M(H === "SGR") : T === 1015 ? 4 : T === 1016 ? M(H === "SGR_PIXELS") : T === 1048 ? 1 : T === 47 || T === 1047 || T === 1049 ? M(Q === S) : T === 2004 ? M(k.bracketedPasteMode) : 0, j.triggerDataEvent(`${n.C0.ESC}[${E ? "" : "?"}${G};${$}$y`), !0;
          var G, $;
        }
        _updateAttrColor(b, E, k, L, H) {
          return E === 2 ? (b |= 50331648, b &= -16777216, b |= o.AttributeData.fromColorRGB([k, L, H])) : E === 5 && (b &= -50331904, b |= 33554432 | 255 & k), b;
        }
        _extractColor(b, E, k) {
          const L = [0, 0, -1, 0, 0, 0];
          let H = 0, j = 0;
          do {
            if (L[j + H] = b.params[E + j], b.hasSubParams(E + j)) {
              const q = b.getSubParams(E + j);
              let K = 0;
              do
                L[1] === 5 && (H = 1), L[j + K + 1 + H] = q[K];
              while (++K < q.length && K + j + 1 + H < L.length);
              break;
            }
            if (L[1] === 5 && j + H >= 2 || L[1] === 2 && j + H >= 5) break;
            L[1] && (H = 1);
          } while (++j + E < b.length && j + H < L.length);
          for (let q = 2; q < L.length; ++q) L[q] === -1 && (L[q] = 0);
          switch (L[0]) {
            case 38:
              k.fg = this._updateAttrColor(k.fg, L[1], L[3], L[4], L[5]);
              break;
            case 48:
              k.bg = this._updateAttrColor(k.bg, L[1], L[3], L[4], L[5]);
              break;
            case 58:
              k.extended = k.extended.clone(), k.extended.underlineColor = this._updateAttrColor(k.extended.underlineColor, L[1], L[3], L[4], L[5]);
          }
          return j;
        }
        _processUnderline(b, E) {
          E.extended = E.extended.clone(), (!~b || b > 5) && (b = 1), E.extended.underlineStyle = b, E.fg |= 268435456, b === 0 && (E.fg &= -268435457), E.updateExtended();
        }
        _processSGR0(b) {
          b.fg = e.DEFAULT_ATTR_DATA.fg, b.bg = e.DEFAULT_ATTR_DATA.bg, b.extended = b.extended.clone(), b.extended.underlineStyle = 0, b.extended.underlineColor &= -67108864, b.updateExtended();
        }
        charAttributes(b) {
          if (b.length === 1 && b.params[0] === 0) return this._processSGR0(this._curAttrData), !0;
          const E = b.length;
          let k;
          const L = this._curAttrData;
          for (let H = 0; H < E; H++) k = b.params[H], k >= 30 && k <= 37 ? (L.fg &= -50331904, L.fg |= 16777216 | k - 30) : k >= 40 && k <= 47 ? (L.bg &= -50331904, L.bg |= 16777216 | k - 40) : k >= 90 && k <= 97 ? (L.fg &= -50331904, L.fg |= 16777224 | k - 90) : k >= 100 && k <= 107 ? (L.bg &= -50331904, L.bg |= 16777224 | k - 100) : k === 0 ? this._processSGR0(L) : k === 1 ? L.fg |= 134217728 : k === 3 ? L.bg |= 67108864 : k === 4 ? (L.fg |= 268435456, this._processUnderline(b.hasSubParams(H) ? b.getSubParams(H)[0] : 1, L)) : k === 5 ? L.fg |= 536870912 : k === 7 ? L.fg |= 67108864 : k === 8 ? L.fg |= 1073741824 : k === 9 ? L.fg |= 2147483648 : k === 2 ? L.bg |= 134217728 : k === 21 ? this._processUnderline(2, L) : k === 22 ? (L.fg &= -134217729, L.bg &= -134217729) : k === 23 ? L.bg &= -67108865 : k === 24 ? (L.fg &= -268435457, this._processUnderline(0, L)) : k === 25 ? L.fg &= -536870913 : k === 27 ? L.fg &= -67108865 : k === 28 ? L.fg &= -1073741825 : k === 29 ? L.fg &= 2147483647 : k === 39 ? (L.fg &= -67108864, L.fg |= 16777215 & e.DEFAULT_ATTR_DATA.fg) : k === 49 ? (L.bg &= -67108864, L.bg |= 16777215 & e.DEFAULT_ATTR_DATA.bg) : k === 38 || k === 48 || k === 58 ? H += this._extractColor(b, H, L) : k === 53 ? L.bg |= 1073741824 : k === 55 ? L.bg &= -1073741825 : k === 59 ? (L.extended = L.extended.clone(), L.extended.underlineColor = -1, L.updateExtended()) : k === 100 ? (L.fg &= -67108864, L.fg |= 16777215 & e.DEFAULT_ATTR_DATA.fg, L.bg &= -67108864, L.bg |= 16777215 & e.DEFAULT_ATTR_DATA.bg) : this._logService.debug("Unknown SGR attribute: %d.", k);
          return !0;
        }
        deviceStatus(b) {
          switch (b.params[0]) {
            case 5:
              this._coreService.triggerDataEvent(`${n.C0.ESC}[0n`);
              break;
            case 6:
              const E = this._activeBuffer.y + 1, k = this._activeBuffer.x + 1;
              this._coreService.triggerDataEvent(`${n.C0.ESC}[${E};${k}R`);
          }
          return !0;
        }
        deviceStatusPrivate(b) {
          if (b.params[0] === 6) {
            const E = this._activeBuffer.y + 1, k = this._activeBuffer.x + 1;
            this._coreService.triggerDataEvent(`${n.C0.ESC}[?${E};${k}R`);
          }
          return !0;
        }
        softReset(b) {
          return this._coreService.isCursorHidden = !1, this._onRequestSyncScrollBar.fire(), this._activeBuffer.scrollTop = 0, this._activeBuffer.scrollBottom = this._bufferService.rows - 1, this._curAttrData = e.DEFAULT_ATTR_DATA.clone(), this._coreService.reset(), this._charsetService.reset(), this._activeBuffer.savedX = 0, this._activeBuffer.savedY = this._activeBuffer.ybase, this._activeBuffer.savedCurAttrData.fg = this._curAttrData.fg, this._activeBuffer.savedCurAttrData.bg = this._curAttrData.bg, this._activeBuffer.savedCharset = this._charsetService.charset, this._coreService.decPrivateModes.origin = !1, !0;
        }
        setCursorStyle(b) {
          const E = b.params[0] || 1;
          switch (E) {
            case 1:
            case 2:
              this._optionsService.options.cursorStyle = "block";
              break;
            case 3:
            case 4:
              this._optionsService.options.cursorStyle = "underline";
              break;
            case 5:
            case 6:
              this._optionsService.options.cursorStyle = "bar";
          }
          const k = E % 2 == 1;
          return this._optionsService.options.cursorBlink = k, !0;
        }
        setScrollRegion(b) {
          const E = b.params[0] || 1;
          let k;
          return (b.length < 2 || (k = b.params[1]) > this._bufferService.rows || k === 0) && (k = this._bufferService.rows), k > E && (this._activeBuffer.scrollTop = E - 1, this._activeBuffer.scrollBottom = k - 1, this._setCursor(0, 0)), !0;
        }
        windowOptions(b) {
          if (!C(b.params[0], this._optionsService.rawOptions.windowOptions)) return !0;
          const E = b.length > 1 ? b.params[1] : 0;
          switch (b.params[0]) {
            case 14:
              E !== 2 && this._onRequestWindowsOptionsReport.fire(y.GET_WIN_SIZE_PIXELS);
              break;
            case 16:
              this._onRequestWindowsOptionsReport.fire(y.GET_CELL_SIZE_PIXELS);
              break;
            case 18:
              this._bufferService && this._coreService.triggerDataEvent(`${n.C0.ESC}[8;${this._bufferService.rows};${this._bufferService.cols}t`);
              break;
            case 22:
              E !== 0 && E !== 2 || (this._windowTitleStack.push(this._windowTitle), this._windowTitleStack.length > 10 && this._windowTitleStack.shift()), E !== 0 && E !== 1 || (this._iconNameStack.push(this._iconName), this._iconNameStack.length > 10 && this._iconNameStack.shift());
              break;
            case 23:
              E !== 0 && E !== 2 || this._windowTitleStack.length && this.setTitle(this._windowTitleStack.pop()), E !== 0 && E !== 1 || this._iconNameStack.length && this.setIconName(this._iconNameStack.pop());
          }
          return !0;
        }
        saveCursor(b) {
          return this._activeBuffer.savedX = this._activeBuffer.x, this._activeBuffer.savedY = this._activeBuffer.ybase + this._activeBuffer.y, this._activeBuffer.savedCurAttrData.fg = this._curAttrData.fg, this._activeBuffer.savedCurAttrData.bg = this._curAttrData.bg, this._activeBuffer.savedCharset = this._charsetService.charset, !0;
        }
        restoreCursor(b) {
          return this._activeBuffer.x = this._activeBuffer.savedX || 0, this._activeBuffer.y = Math.max(this._activeBuffer.savedY - this._activeBuffer.ybase, 0), this._curAttrData.fg = this._activeBuffer.savedCurAttrData.fg, this._curAttrData.bg = this._activeBuffer.savedCurAttrData.bg, this._charsetService.charset = this._savedCharset, this._activeBuffer.savedCharset && (this._charsetService.charset = this._activeBuffer.savedCharset), this._restrictCursor(), !0;
        }
        setTitle(b) {
          return this._windowTitle = b, this._onTitleChange.fire(b), !0;
        }
        setIconName(b) {
          return this._iconName = b, !0;
        }
        setOrReportIndexedColor(b) {
          const E = [], k = b.split(";");
          for (; k.length > 1; ) {
            const L = k.shift(), H = k.shift();
            if (/^\d+$/.exec(L)) {
              const j = parseInt(L);
              if (P(j)) if (H === "?") E.push({ type: 0, index: j });
              else {
                const q = (0, h.parseColor)(H);
                q && E.push({ type: 1, index: j, color: q });
              }
            }
          }
          return E.length && this._onColor.fire(E), !0;
        }
        setHyperlink(b) {
          const E = b.split(";");
          return !(E.length < 2) && (E[1] ? this._createHyperlink(E[0], E[1]) : !E[0] && this._finishHyperlink());
        }
        _createHyperlink(b, E) {
          this._getCurrentLinkId() && this._finishHyperlink();
          const k = b.split(":");
          let L;
          const H = k.findIndex((j) => j.startsWith("id="));
          return H !== -1 && (L = k[H].slice(3) || void 0), this._curAttrData.extended = this._curAttrData.extended.clone(), this._curAttrData.extended.urlId = this._oscLinkService.registerLink({ id: L, uri: E }), this._curAttrData.updateExtended(), !0;
        }
        _finishHyperlink() {
          return this._curAttrData.extended = this._curAttrData.extended.clone(), this._curAttrData.extended.urlId = 0, this._curAttrData.updateExtended(), !0;
        }
        _setOrReportSpecialColor(b, E) {
          const k = b.split(";");
          for (let L = 0; L < k.length && !(E >= this._specialColors.length); ++L, ++E) if (k[L] === "?") this._onColor.fire([{ type: 0, index: this._specialColors[E] }]);
          else {
            const H = (0, h.parseColor)(k[L]);
            H && this._onColor.fire([{ type: 1, index: this._specialColors[E], color: H }]);
          }
          return !0;
        }
        setOrReportFgColor(b) {
          return this._setOrReportSpecialColor(b, 0);
        }
        setOrReportBgColor(b) {
          return this._setOrReportSpecialColor(b, 1);
        }
        setOrReportCursorColor(b) {
          return this._setOrReportSpecialColor(b, 2);
        }
        restoreIndexedColor(b) {
          if (!b) return this._onColor.fire([{ type: 2 }]), !0;
          const E = [], k = b.split(";");
          for (let L = 0; L < k.length; ++L) if (/^\d+$/.exec(k[L])) {
            const H = parseInt(k[L]);
            P(H) && E.push({ type: 2, index: H });
          }
          return E.length && this._onColor.fire(E), !0;
        }
        restoreFgColor(b) {
          return this._onColor.fire([{ type: 2, index: 256 }]), !0;
        }
        restoreBgColor(b) {
          return this._onColor.fire([{ type: 2, index: 257 }]), !0;
        }
        restoreCursorColor(b) {
          return this._onColor.fire([{ type: 2, index: 258 }]), !0;
        }
        nextLine() {
          return this._activeBuffer.x = 0, this.index(), !0;
        }
        keypadApplicationMode() {
          return this._logService.debug("Serial port requested application keypad."), this._coreService.decPrivateModes.applicationKeypad = !0, this._onRequestSyncScrollBar.fire(), !0;
        }
        keypadNumericMode() {
          return this._logService.debug("Switching back to normal keypad."), this._coreService.decPrivateModes.applicationKeypad = !1, this._onRequestSyncScrollBar.fire(), !0;
        }
        selectDefaultCharset() {
          return this._charsetService.setgLevel(0), this._charsetService.setgCharset(0, d.DEFAULT_CHARSET), !0;
        }
        selectCharset(b) {
          return b.length !== 2 ? (this.selectDefaultCharset(), !0) : (b[0] === "/" || this._charsetService.setgCharset(p[b[0]], d.CHARSETS[b[1]] || d.DEFAULT_CHARSET), !0);
        }
        index() {
          return this._restrictCursor(), this._activeBuffer.y++, this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--, this._bufferService.scroll(this._eraseAttrData())) : this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1), this._restrictCursor(), !0;
        }
        tabSet() {
          return this._activeBuffer.tabs[this._activeBuffer.x] = !0, !0;
        }
        reverseIndex() {
          if (this._restrictCursor(), this._activeBuffer.y === this._activeBuffer.scrollTop) {
            const b = this._activeBuffer.scrollBottom - this._activeBuffer.scrollTop;
            this._activeBuffer.lines.shiftElements(this._activeBuffer.ybase + this._activeBuffer.y, b, 1), this._activeBuffer.lines.set(this._activeBuffer.ybase + this._activeBuffer.y, this._activeBuffer.getBlankLine(this._eraseAttrData())), this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom);
          } else this._activeBuffer.y--, this._restrictCursor();
          return !0;
        }
        fullReset() {
          return this._parser.reset(), this._onRequestReset.fire(), !0;
        }
        reset() {
          this._curAttrData = e.DEFAULT_ATTR_DATA.clone(), this._eraseAttrDataInternal = e.DEFAULT_ATTR_DATA.clone();
        }
        _eraseAttrData() {
          return this._eraseAttrDataInternal.bg &= -67108864, this._eraseAttrDataInternal.bg |= 67108863 & this._curAttrData.bg, this._eraseAttrDataInternal;
        }
        setgLevel(b) {
          return this._charsetService.setgLevel(b), !0;
        }
        screenAlignmentPattern() {
          const b = new r.CellData();
          b.content = 4194373, b.fg = this._curAttrData.fg, b.bg = this._curAttrData.bg, this._setCursor(0, 0);
          for (let E = 0; E < this._bufferService.rows; ++E) {
            const k = this._activeBuffer.ybase + this._activeBuffer.y + E, L = this._activeBuffer.lines.get(k);
            L && (L.fill(b), L.isWrapped = !1);
          }
          return this._dirtyRowTracker.markAllDirty(), this._setCursor(0, 0), !0;
        }
        requestStatusString(b, E) {
          const k = this._bufferService.buffer, L = this._optionsService.rawOptions;
          return ((H) => (this._coreService.triggerDataEvent(`${n.C0.ESC}${H}${n.C0.ESC}\\`), !0))(b === '"q' ? `P1$r${this._curAttrData.isProtected() ? 1 : 0}"q` : b === '"p' ? 'P1$r61;1"p' : b === "r" ? `P1$r${k.scrollTop + 1};${k.scrollBottom + 1}r` : b === "m" ? "P1$r0m" : b === " q" ? `P1$r${{ block: 2, underline: 4, bar: 6 }[L.cursorStyle] - (L.cursorBlink ? 1 : 0)} q` : "P0$r");
        }
        markRangeDirty(b, E) {
          this._dirtyRowTracker.markRangeDirty(b, E);
        }
      }
      s.InputHandler = A;
      let O = class {
        constructor(I) {
          this._bufferService = I, this.clearRange();
        }
        clearRange() {
          this.start = this._bufferService.buffer.y, this.end = this._bufferService.buffer.y;
        }
        markDirty(I) {
          I < this.start ? this.start = I : I > this.end && (this.end = I);
        }
        markRangeDirty(I, b) {
          I > b && (x = I, I = b, b = x), I < this.start && (this.start = I), b > this.end && (this.end = b);
        }
        markAllDirty() {
          this.markRangeDirty(0, this._bufferService.rows - 1);
        }
      };
      function P(I) {
        return 0 <= I && I < 256;
      }
      O = c([_(0, l.IBufferService)], O);
    }, 844: (B, s) => {
      function a(c) {
        for (const _ of c) _.dispose();
        c.length = 0;
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.getDisposeArrayDisposable = s.disposeArray = s.toDisposable = s.MutableDisposable = s.Disposable = void 0, s.Disposable = class {
        constructor() {
          this._disposables = [], this._isDisposed = !1;
        }
        dispose() {
          this._isDisposed = !0;
          for (const c of this._disposables) c.dispose();
          this._disposables.length = 0;
        }
        register(c) {
          return this._disposables.push(c), c;
        }
        unregister(c) {
          const _ = this._disposables.indexOf(c);
          _ !== -1 && this._disposables.splice(_, 1);
        }
      }, s.MutableDisposable = class {
        constructor() {
          this._isDisposed = !1;
        }
        get value() {
          return this._isDisposed ? void 0 : this._value;
        }
        set value(c) {
          var _;
          this._isDisposed || c === this._value || ((_ = this._value) === null || _ === void 0 || _.dispose(), this._value = c);
        }
        clear() {
          this.value = void 0;
        }
        dispose() {
          var c;
          this._isDisposed = !0, (c = this._value) === null || c === void 0 || c.dispose(), this._value = void 0;
        }
      }, s.toDisposable = function(c) {
        return { dispose: c };
      }, s.disposeArray = a, s.getDisposeArrayDisposable = function(c) {
        return { dispose: () => a(c) };
      };
    }, 1505: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.FourKeyMap = s.TwoKeyMap = void 0;
      class a {
        constructor() {
          this._data = {};
        }
        set(_, n, d) {
          this._data[_] || (this._data[_] = {}), this._data[_][n] = d;
        }
        get(_, n) {
          return this._data[_] ? this._data[_][n] : void 0;
        }
        clear() {
          this._data = {};
        }
      }
      s.TwoKeyMap = a, s.FourKeyMap = class {
        constructor() {
          this._data = new a();
        }
        set(c, _, n, d, v) {
          this._data.get(c, _) || this._data.set(c, _, new a()), this._data.get(c, _).set(n, d, v);
        }
        get(c, _, n, d) {
          var v;
          return (v = this._data.get(c, _)) === null || v === void 0 ? void 0 : v.get(n, d);
        }
        clear() {
          this._data.clear();
        }
      };
    }, 6114: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.isChromeOS = s.isLinux = s.isWindows = s.isIphone = s.isIpad = s.isMac = s.getSafariVersion = s.isSafari = s.isLegacyEdge = s.isFirefox = s.isNode = void 0, s.isNode = typeof navigator > "u";
      const a = s.isNode ? "node" : navigator.userAgent, c = s.isNode ? "node" : navigator.platform;
      s.isFirefox = a.includes("Firefox"), s.isLegacyEdge = a.includes("Edge"), s.isSafari = /^((?!chrome|android).)*safari/i.test(a), s.getSafariVersion = function() {
        if (!s.isSafari) return 0;
        const _ = a.match(/Version\/(\d+)/);
        return _ === null || _.length < 2 ? 0 : parseInt(_[1]);
      }, s.isMac = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].includes(c), s.isIpad = c === "iPad", s.isIphone = c === "iPhone", s.isWindows = ["Windows", "Win16", "Win32", "WinCE"].includes(c), s.isLinux = c.indexOf("Linux") >= 0, s.isChromeOS = /\bCrOS\b/.test(a);
    }, 6106: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.SortedList = void 0;
      let a = 0;
      s.SortedList = class {
        constructor(c) {
          this._getKey = c, this._array = [];
        }
        clear() {
          this._array.length = 0;
        }
        insert(c) {
          this._array.length !== 0 ? (a = this._search(this._getKey(c)), this._array.splice(a, 0, c)) : this._array.push(c);
        }
        delete(c) {
          if (this._array.length === 0) return !1;
          const _ = this._getKey(c);
          if (_ === void 0 || (a = this._search(_), a === -1) || this._getKey(this._array[a]) !== _) return !1;
          do
            if (this._array[a] === c) return this._array.splice(a, 1), !0;
          while (++a < this._array.length && this._getKey(this._array[a]) === _);
          return !1;
        }
        *getKeyIterator(c) {
          if (this._array.length !== 0 && (a = this._search(c), !(a < 0 || a >= this._array.length) && this._getKey(this._array[a]) === c)) do
            yield this._array[a];
          while (++a < this._array.length && this._getKey(this._array[a]) === c);
        }
        forEachByKey(c, _) {
          if (this._array.length !== 0 && (a = this._search(c), !(a < 0 || a >= this._array.length) && this._getKey(this._array[a]) === c)) do
            _(this._array[a]);
          while (++a < this._array.length && this._getKey(this._array[a]) === c);
        }
        values() {
          return [...this._array].values();
        }
        _search(c) {
          let _ = 0, n = this._array.length - 1;
          for (; n >= _; ) {
            let d = _ + n >> 1;
            const v = this._getKey(this._array[d]);
            if (v > c) n = d - 1;
            else {
              if (!(v < c)) {
                for (; d > 0 && this._getKey(this._array[d - 1]) === c; ) d--;
                return d;
              }
              _ = d + 1;
            }
          }
          return _;
        }
      };
    }, 7226: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DebouncedIdleTask = s.IdleTaskQueue = s.PriorityTaskQueue = void 0;
      const c = a(6114);
      class _ {
        constructor() {
          this._tasks = [], this._i = 0;
        }
        enqueue(v) {
          this._tasks.push(v), this._start();
        }
        flush() {
          for (; this._i < this._tasks.length; ) this._tasks[this._i]() || this._i++;
          this.clear();
        }
        clear() {
          this._idleCallback && (this._cancelCallback(this._idleCallback), this._idleCallback = void 0), this._i = 0, this._tasks.length = 0;
        }
        _start() {
          this._idleCallback || (this._idleCallback = this._requestCallback(this._process.bind(this)));
        }
        _process(v) {
          this._idleCallback = void 0;
          let g = 0, u = 0, e = v.timeRemaining(), i = 0;
          for (; this._i < this._tasks.length; ) {
            if (g = Date.now(), this._tasks[this._i]() || this._i++, g = Math.max(1, Date.now() - g), u = Math.max(g, u), i = v.timeRemaining(), 1.5 * u > i) return e - g < -20 && console.warn(`task queue exceeded allotted deadline by ${Math.abs(Math.round(e - g))}ms`), void this._start();
            e = i;
          }
          this.clear();
        }
      }
      class n extends _ {
        _requestCallback(v) {
          return setTimeout(() => v(this._createDeadline(16)));
        }
        _cancelCallback(v) {
          clearTimeout(v);
        }
        _createDeadline(v) {
          const g = Date.now() + v;
          return { timeRemaining: () => Math.max(0, g - Date.now()) };
        }
      }
      s.PriorityTaskQueue = n, s.IdleTaskQueue = !c.isNode && "requestIdleCallback" in window ? class extends _ {
        _requestCallback(d) {
          return requestIdleCallback(d);
        }
        _cancelCallback(d) {
          cancelIdleCallback(d);
        }
      } : n, s.DebouncedIdleTask = class {
        constructor() {
          this._queue = new s.IdleTaskQueue();
        }
        set(d) {
          this._queue.clear(), this._queue.enqueue(d);
        }
        flush() {
          this._queue.flush();
        }
      };
    }, 9282: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.updateWindowsModeWrappedState = void 0;
      const c = a(643);
      s.updateWindowsModeWrappedState = function(_) {
        const n = _.buffer.lines.get(_.buffer.ybase + _.buffer.y - 1), d = n == null ? void 0 : n.get(_.cols - 1), v = _.buffer.lines.get(_.buffer.ybase + _.buffer.y);
        v && d && (v.isWrapped = d[c.CHAR_DATA_CODE_INDEX] !== c.NULL_CELL_CODE && d[c.CHAR_DATA_CODE_INDEX] !== c.WHITESPACE_CELL_CODE);
      };
    }, 3734: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ExtendedAttrs = s.AttributeData = void 0;
      class a {
        constructor() {
          this.fg = 0, this.bg = 0, this.extended = new c();
        }
        static toColorRGB(n) {
          return [n >>> 16 & 255, n >>> 8 & 255, 255 & n];
        }
        static fromColorRGB(n) {
          return (255 & n[0]) << 16 | (255 & n[1]) << 8 | 255 & n[2];
        }
        clone() {
          const n = new a();
          return n.fg = this.fg, n.bg = this.bg, n.extended = this.extended.clone(), n;
        }
        isInverse() {
          return 67108864 & this.fg;
        }
        isBold() {
          return 134217728 & this.fg;
        }
        isUnderline() {
          return this.hasExtendedAttrs() && this.extended.underlineStyle !== 0 ? 1 : 268435456 & this.fg;
        }
        isBlink() {
          return 536870912 & this.fg;
        }
        isInvisible() {
          return 1073741824 & this.fg;
        }
        isItalic() {
          return 67108864 & this.bg;
        }
        isDim() {
          return 134217728 & this.bg;
        }
        isStrikethrough() {
          return 2147483648 & this.fg;
        }
        isProtected() {
          return 536870912 & this.bg;
        }
        isOverline() {
          return 1073741824 & this.bg;
        }
        getFgColorMode() {
          return 50331648 & this.fg;
        }
        getBgColorMode() {
          return 50331648 & this.bg;
        }
        isFgRGB() {
          return (50331648 & this.fg) == 50331648;
        }
        isBgRGB() {
          return (50331648 & this.bg) == 50331648;
        }
        isFgPalette() {
          return (50331648 & this.fg) == 16777216 || (50331648 & this.fg) == 33554432;
        }
        isBgPalette() {
          return (50331648 & this.bg) == 16777216 || (50331648 & this.bg) == 33554432;
        }
        isFgDefault() {
          return (50331648 & this.fg) == 0;
        }
        isBgDefault() {
          return (50331648 & this.bg) == 0;
        }
        isAttributeDefault() {
          return this.fg === 0 && this.bg === 0;
        }
        getFgColor() {
          switch (50331648 & this.fg) {
            case 16777216:
            case 33554432:
              return 255 & this.fg;
            case 50331648:
              return 16777215 & this.fg;
            default:
              return -1;
          }
        }
        getBgColor() {
          switch (50331648 & this.bg) {
            case 16777216:
            case 33554432:
              return 255 & this.bg;
            case 50331648:
              return 16777215 & this.bg;
            default:
              return -1;
          }
        }
        hasExtendedAttrs() {
          return 268435456 & this.bg;
        }
        updateExtended() {
          this.extended.isEmpty() ? this.bg &= -268435457 : this.bg |= 268435456;
        }
        getUnderlineColor() {
          if (268435456 & this.bg && ~this.extended.underlineColor) switch (50331648 & this.extended.underlineColor) {
            case 16777216:
            case 33554432:
              return 255 & this.extended.underlineColor;
            case 50331648:
              return 16777215 & this.extended.underlineColor;
            default:
              return this.getFgColor();
          }
          return this.getFgColor();
        }
        getUnderlineColorMode() {
          return 268435456 & this.bg && ~this.extended.underlineColor ? 50331648 & this.extended.underlineColor : this.getFgColorMode();
        }
        isUnderlineColorRGB() {
          return 268435456 & this.bg && ~this.extended.underlineColor ? (50331648 & this.extended.underlineColor) == 50331648 : this.isFgRGB();
        }
        isUnderlineColorPalette() {
          return 268435456 & this.bg && ~this.extended.underlineColor ? (50331648 & this.extended.underlineColor) == 16777216 || (50331648 & this.extended.underlineColor) == 33554432 : this.isFgPalette();
        }
        isUnderlineColorDefault() {
          return 268435456 & this.bg && ~this.extended.underlineColor ? (50331648 & this.extended.underlineColor) == 0 : this.isFgDefault();
        }
        getUnderlineStyle() {
          return 268435456 & this.fg ? 268435456 & this.bg ? this.extended.underlineStyle : 1 : 0;
        }
      }
      s.AttributeData = a;
      class c {
        get ext() {
          return this._urlId ? -469762049 & this._ext | this.underlineStyle << 26 : this._ext;
        }
        set ext(n) {
          this._ext = n;
        }
        get underlineStyle() {
          return this._urlId ? 5 : (469762048 & this._ext) >> 26;
        }
        set underlineStyle(n) {
          this._ext &= -469762049, this._ext |= n << 26 & 469762048;
        }
        get underlineColor() {
          return 67108863 & this._ext;
        }
        set underlineColor(n) {
          this._ext &= -67108864, this._ext |= 67108863 & n;
        }
        get urlId() {
          return this._urlId;
        }
        set urlId(n) {
          this._urlId = n;
        }
        constructor(n = 0, d = 0) {
          this._ext = 0, this._urlId = 0, this._ext = n, this._urlId = d;
        }
        clone() {
          return new c(this._ext, this._urlId);
        }
        isEmpty() {
          return this.underlineStyle === 0 && this._urlId === 0;
        }
      }
      s.ExtendedAttrs = c;
    }, 9092: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Buffer = s.MAX_BUFFER_SIZE = void 0;
      const c = a(6349), _ = a(7226), n = a(3734), d = a(8437), v = a(4634), g = a(511), u = a(643), e = a(4863), i = a(7116);
      s.MAX_BUFFER_SIZE = 4294967295, s.Buffer = class {
        constructor(t, r, o) {
          this._hasScrollback = t, this._optionsService = r, this._bufferService = o, this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.tabs = {}, this.savedY = 0, this.savedX = 0, this.savedCurAttrData = d.DEFAULT_ATTR_DATA.clone(), this.savedCharset = i.DEFAULT_CHARSET, this.markers = [], this._nullCell = g.CellData.fromCharData([0, u.NULL_CELL_CHAR, u.NULL_CELL_WIDTH, u.NULL_CELL_CODE]), this._whitespaceCell = g.CellData.fromCharData([0, u.WHITESPACE_CELL_CHAR, u.WHITESPACE_CELL_WIDTH, u.WHITESPACE_CELL_CODE]), this._isClearing = !1, this._memoryCleanupQueue = new _.IdleTaskQueue(), this._memoryCleanupPosition = 0, this._cols = this._bufferService.cols, this._rows = this._bufferService.rows, this.lines = new c.CircularList(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops();
        }
        getNullCell(t) {
          return t ? (this._nullCell.fg = t.fg, this._nullCell.bg = t.bg, this._nullCell.extended = t.extended) : (this._nullCell.fg = 0, this._nullCell.bg = 0, this._nullCell.extended = new n.ExtendedAttrs()), this._nullCell;
        }
        getWhitespaceCell(t) {
          return t ? (this._whitespaceCell.fg = t.fg, this._whitespaceCell.bg = t.bg, this._whitespaceCell.extended = t.extended) : (this._whitespaceCell.fg = 0, this._whitespaceCell.bg = 0, this._whitespaceCell.extended = new n.ExtendedAttrs()), this._whitespaceCell;
        }
        getBlankLine(t, r) {
          return new d.BufferLine(this._bufferService.cols, this.getNullCell(t), r);
        }
        get hasScrollback() {
          return this._hasScrollback && this.lines.maxLength > this._rows;
        }
        get isCursorInViewport() {
          const t = this.ybase + this.y - this.ydisp;
          return t >= 0 && t < this._rows;
        }
        _getCorrectBufferLength(t) {
          if (!this._hasScrollback) return t;
          const r = t + this._optionsService.rawOptions.scrollback;
          return r > s.MAX_BUFFER_SIZE ? s.MAX_BUFFER_SIZE : r;
        }
        fillViewportRows(t) {
          if (this.lines.length === 0) {
            t === void 0 && (t = d.DEFAULT_ATTR_DATA);
            let r = this._rows;
            for (; r--; ) this.lines.push(this.getBlankLine(t));
          }
        }
        clear() {
          this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.lines = new c.CircularList(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops();
        }
        resize(t, r) {
          const o = this.getNullCell(d.DEFAULT_ATTR_DATA);
          let l = 0;
          const f = this._getCorrectBufferLength(r);
          if (f > this.lines.maxLength && (this.lines.maxLength = f), this.lines.length > 0) {
            if (this._cols < t) for (let h = 0; h < this.lines.length; h++) l += +this.lines.get(h).resize(t, o);
            let m = 0;
            if (this._rows < r) for (let h = this._rows; h < r; h++) this.lines.length < r + this.ybase && (this._optionsService.rawOptions.windowsMode || this._optionsService.rawOptions.windowsPty.backend !== void 0 || this._optionsService.rawOptions.windowsPty.buildNumber !== void 0 ? this.lines.push(new d.BufferLine(t, o)) : this.ybase > 0 && this.lines.length <= this.ybase + this.y + m + 1 ? (this.ybase--, m++, this.ydisp > 0 && this.ydisp--) : this.lines.push(new d.BufferLine(t, o)));
            else for (let h = this._rows; h > r; h--) this.lines.length > r + this.ybase && (this.lines.length > this.ybase + this.y + 1 ? this.lines.pop() : (this.ybase++, this.ydisp++));
            if (f < this.lines.maxLength) {
              const h = this.lines.length - f;
              h > 0 && (this.lines.trimStart(h), this.ybase = Math.max(this.ybase - h, 0), this.ydisp = Math.max(this.ydisp - h, 0), this.savedY = Math.max(this.savedY - h, 0)), this.lines.maxLength = f;
            }
            this.x = Math.min(this.x, t - 1), this.y = Math.min(this.y, r - 1), m && (this.y += m), this.savedX = Math.min(this.savedX, t - 1), this.scrollTop = 0;
          }
          if (this.scrollBottom = r - 1, this._isReflowEnabled && (this._reflow(t, r), this._cols > t)) for (let m = 0; m < this.lines.length; m++) l += +this.lines.get(m).resize(t, o);
          this._cols = t, this._rows = r, this._memoryCleanupQueue.clear(), l > 0.1 * this.lines.length && (this._memoryCleanupPosition = 0, this._memoryCleanupQueue.enqueue(() => this._batchedMemoryCleanup()));
        }
        _batchedMemoryCleanup() {
          let t = !0;
          this._memoryCleanupPosition >= this.lines.length && (this._memoryCleanupPosition = 0, t = !1);
          let r = 0;
          for (; this._memoryCleanupPosition < this.lines.length; ) if (r += this.lines.get(this._memoryCleanupPosition++).cleanupMemory(), r > 100) return !0;
          return t;
        }
        get _isReflowEnabled() {
          const t = this._optionsService.rawOptions.windowsPty;
          return t && t.buildNumber ? this._hasScrollback && t.backend === "conpty" && t.buildNumber >= 21376 : this._hasScrollback && !this._optionsService.rawOptions.windowsMode;
        }
        _reflow(t, r) {
          this._cols !== t && (t > this._cols ? this._reflowLarger(t, r) : this._reflowSmaller(t, r));
        }
        _reflowLarger(t, r) {
          const o = (0, v.reflowLargerGetLinesToRemove)(this.lines, this._cols, t, this.ybase + this.y, this.getNullCell(d.DEFAULT_ATTR_DATA));
          if (o.length > 0) {
            const l = (0, v.reflowLargerCreateNewLayout)(this.lines, o);
            (0, v.reflowLargerApplyNewLayout)(this.lines, l.layout), this._reflowLargerAdjustViewport(t, r, l.countRemoved);
          }
        }
        _reflowLargerAdjustViewport(t, r, o) {
          const l = this.getNullCell(d.DEFAULT_ATTR_DATA);
          let f = o;
          for (; f-- > 0; ) this.ybase === 0 ? (this.y > 0 && this.y--, this.lines.length < r && this.lines.push(new d.BufferLine(t, l))) : (this.ydisp === this.ybase && this.ydisp--, this.ybase--);
          this.savedY = Math.max(this.savedY - o, 0);
        }
        _reflowSmaller(t, r) {
          const o = this.getNullCell(d.DEFAULT_ATTR_DATA), l = [];
          let f = 0;
          for (let m = this.lines.length - 1; m >= 0; m--) {
            let h = this.lines.get(m);
            if (!h || !h.isWrapped && h.getTrimmedLength() <= t) continue;
            const p = [h];
            for (; h.isWrapped && m > 0; ) h = this.lines.get(--m), p.unshift(h);
            const w = this.ybase + this.y;
            if (w >= m && w < m + p.length) continue;
            const C = p[p.length - 1].getTrimmedLength(), y = (0, v.reflowSmallerGetNewLineLengths)(p, this._cols, t), x = y.length - p.length;
            let A;
            A = this.ybase === 0 && this.y !== this.lines.length - 1 ? Math.max(0, this.y - this.lines.maxLength + x) : Math.max(0, this.lines.length - this.lines.maxLength + x);
            const O = [];
            for (let L = 0; L < x; L++) {
              const H = this.getBlankLine(d.DEFAULT_ATTR_DATA, !0);
              O.push(H);
            }
            O.length > 0 && (l.push({ start: m + p.length + f, newLines: O }), f += O.length), p.push(...O);
            let P = y.length - 1, I = y[P];
            I === 0 && (P--, I = y[P]);
            let b = p.length - x - 1, E = C;
            for (; b >= 0; ) {
              const L = Math.min(E, I);
              if (p[P] === void 0) break;
              if (p[P].copyCellsFrom(p[b], E - L, I - L, L, !0), I -= L, I === 0 && (P--, I = y[P]), E -= L, E === 0) {
                b--;
                const H = Math.max(b, 0);
                E = (0, v.getWrappedLineTrimmedLength)(p, H, this._cols);
              }
            }
            for (let L = 0; L < p.length; L++) y[L] < t && p[L].setCell(y[L], o);
            let k = x - A;
            for (; k-- > 0; ) this.ybase === 0 ? this.y < r - 1 ? (this.y++, this.lines.pop()) : (this.ybase++, this.ydisp++) : this.ybase < Math.min(this.lines.maxLength, this.lines.length + f) - r && (this.ybase === this.ydisp && this.ydisp++, this.ybase++);
            this.savedY = Math.min(this.savedY + x, this.ybase + r - 1);
          }
          if (l.length > 0) {
            const m = [], h = [];
            for (let P = 0; P < this.lines.length; P++) h.push(this.lines.get(P));
            const p = this.lines.length;
            let w = p - 1, C = 0, y = l[C];
            this.lines.length = Math.min(this.lines.maxLength, this.lines.length + f);
            let x = 0;
            for (let P = Math.min(this.lines.maxLength - 1, p + f - 1); P >= 0; P--) if (y && y.start > w + x) {
              for (let I = y.newLines.length - 1; I >= 0; I--) this.lines.set(P--, y.newLines[I]);
              P++, m.push({ index: w + 1, amount: y.newLines.length }), x += y.newLines.length, y = l[++C];
            } else this.lines.set(P, h[w--]);
            let A = 0;
            for (let P = m.length - 1; P >= 0; P--) m[P].index += A, this.lines.onInsertEmitter.fire(m[P]), A += m[P].amount;
            const O = Math.max(0, p + f - this.lines.maxLength);
            O > 0 && this.lines.onTrimEmitter.fire(O);
          }
        }
        translateBufferLineToString(t, r, o = 0, l) {
          const f = this.lines.get(t);
          return f ? f.translateToString(r, o, l) : "";
        }
        getWrappedRangeForLine(t) {
          let r = t, o = t;
          for (; r > 0 && this.lines.get(r).isWrapped; ) r--;
          for (; o + 1 < this.lines.length && this.lines.get(o + 1).isWrapped; ) o++;
          return { first: r, last: o };
        }
        setupTabStops(t) {
          for (t != null ? this.tabs[t] || (t = this.prevStop(t)) : (this.tabs = {}, t = 0); t < this._cols; t += this._optionsService.rawOptions.tabStopWidth) this.tabs[t] = !0;
        }
        prevStop(t) {
          for (t == null && (t = this.x); !this.tabs[--t] && t > 0; ) ;
          return t >= this._cols ? this._cols - 1 : t < 0 ? 0 : t;
        }
        nextStop(t) {
          for (t == null && (t = this.x); !this.tabs[++t] && t < this._cols; ) ;
          return t >= this._cols ? this._cols - 1 : t < 0 ? 0 : t;
        }
        clearMarkers(t) {
          this._isClearing = !0;
          for (let r = 0; r < this.markers.length; r++) this.markers[r].line === t && (this.markers[r].dispose(), this.markers.splice(r--, 1));
          this._isClearing = !1;
        }
        clearAllMarkers() {
          this._isClearing = !0;
          for (let t = 0; t < this.markers.length; t++) this.markers[t].dispose(), this.markers.splice(t--, 1);
          this._isClearing = !1;
        }
        addMarker(t) {
          const r = new e.Marker(t);
          return this.markers.push(r), r.register(this.lines.onTrim((o) => {
            r.line -= o, r.line < 0 && r.dispose();
          })), r.register(this.lines.onInsert((o) => {
            r.line >= o.index && (r.line += o.amount);
          })), r.register(this.lines.onDelete((o) => {
            r.line >= o.index && r.line < o.index + o.amount && r.dispose(), r.line > o.index && (r.line -= o.amount);
          })), r.register(r.onDispose(() => this._removeMarker(r))), r;
        }
        _removeMarker(t) {
          this._isClearing || this.markers.splice(this.markers.indexOf(t), 1);
        }
      };
    }, 8437: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferLine = s.DEFAULT_ATTR_DATA = void 0;
      const c = a(3734), _ = a(511), n = a(643), d = a(482);
      s.DEFAULT_ATTR_DATA = Object.freeze(new c.AttributeData());
      let v = 0;
      class g {
        constructor(e, i, t = !1) {
          this.isWrapped = t, this._combined = {}, this._extendedAttrs = {}, this._data = new Uint32Array(3 * e);
          const r = i || _.CellData.fromCharData([0, n.NULL_CELL_CHAR, n.NULL_CELL_WIDTH, n.NULL_CELL_CODE]);
          for (let o = 0; o < e; ++o) this.setCell(o, r);
          this.length = e;
        }
        get(e) {
          const i = this._data[3 * e + 0], t = 2097151 & i;
          return [this._data[3 * e + 1], 2097152 & i ? this._combined[e] : t ? (0, d.stringFromCodePoint)(t) : "", i >> 22, 2097152 & i ? this._combined[e].charCodeAt(this._combined[e].length - 1) : t];
        }
        set(e, i) {
          this._data[3 * e + 1] = i[n.CHAR_DATA_ATTR_INDEX], i[n.CHAR_DATA_CHAR_INDEX].length > 1 ? (this._combined[e] = i[1], this._data[3 * e + 0] = 2097152 | e | i[n.CHAR_DATA_WIDTH_INDEX] << 22) : this._data[3 * e + 0] = i[n.CHAR_DATA_CHAR_INDEX].charCodeAt(0) | i[n.CHAR_DATA_WIDTH_INDEX] << 22;
        }
        getWidth(e) {
          return this._data[3 * e + 0] >> 22;
        }
        hasWidth(e) {
          return 12582912 & this._data[3 * e + 0];
        }
        getFg(e) {
          return this._data[3 * e + 1];
        }
        getBg(e) {
          return this._data[3 * e + 2];
        }
        hasContent(e) {
          return 4194303 & this._data[3 * e + 0];
        }
        getCodePoint(e) {
          const i = this._data[3 * e + 0];
          return 2097152 & i ? this._combined[e].charCodeAt(this._combined[e].length - 1) : 2097151 & i;
        }
        isCombined(e) {
          return 2097152 & this._data[3 * e + 0];
        }
        getString(e) {
          const i = this._data[3 * e + 0];
          return 2097152 & i ? this._combined[e] : 2097151 & i ? (0, d.stringFromCodePoint)(2097151 & i) : "";
        }
        isProtected(e) {
          return 536870912 & this._data[3 * e + 2];
        }
        loadCell(e, i) {
          return v = 3 * e, i.content = this._data[v + 0], i.fg = this._data[v + 1], i.bg = this._data[v + 2], 2097152 & i.content && (i.combinedData = this._combined[e]), 268435456 & i.bg && (i.extended = this._extendedAttrs[e]), i;
        }
        setCell(e, i) {
          2097152 & i.content && (this._combined[e] = i.combinedData), 268435456 & i.bg && (this._extendedAttrs[e] = i.extended), this._data[3 * e + 0] = i.content, this._data[3 * e + 1] = i.fg, this._data[3 * e + 2] = i.bg;
        }
        setCellFromCodePoint(e, i, t, r, o, l) {
          268435456 & o && (this._extendedAttrs[e] = l), this._data[3 * e + 0] = i | t << 22, this._data[3 * e + 1] = r, this._data[3 * e + 2] = o;
        }
        addCodepointToCell(e, i) {
          let t = this._data[3 * e + 0];
          2097152 & t ? this._combined[e] += (0, d.stringFromCodePoint)(i) : (2097151 & t ? (this._combined[e] = (0, d.stringFromCodePoint)(2097151 & t) + (0, d.stringFromCodePoint)(i), t &= -2097152, t |= 2097152) : t = i | 4194304, this._data[3 * e + 0] = t);
        }
        insertCells(e, i, t, r) {
          if ((e %= this.length) && this.getWidth(e - 1) === 2 && this.setCellFromCodePoint(e - 1, 0, 1, (r == null ? void 0 : r.fg) || 0, (r == null ? void 0 : r.bg) || 0, (r == null ? void 0 : r.extended) || new c.ExtendedAttrs()), i < this.length - e) {
            const o = new _.CellData();
            for (let l = this.length - e - i - 1; l >= 0; --l) this.setCell(e + i + l, this.loadCell(e + l, o));
            for (let l = 0; l < i; ++l) this.setCell(e + l, t);
          } else for (let o = e; o < this.length; ++o) this.setCell(o, t);
          this.getWidth(this.length - 1) === 2 && this.setCellFromCodePoint(this.length - 1, 0, 1, (r == null ? void 0 : r.fg) || 0, (r == null ? void 0 : r.bg) || 0, (r == null ? void 0 : r.extended) || new c.ExtendedAttrs());
        }
        deleteCells(e, i, t, r) {
          if (e %= this.length, i < this.length - e) {
            const o = new _.CellData();
            for (let l = 0; l < this.length - e - i; ++l) this.setCell(e + l, this.loadCell(e + i + l, o));
            for (let l = this.length - i; l < this.length; ++l) this.setCell(l, t);
          } else for (let o = e; o < this.length; ++o) this.setCell(o, t);
          e && this.getWidth(e - 1) === 2 && this.setCellFromCodePoint(e - 1, 0, 1, (r == null ? void 0 : r.fg) || 0, (r == null ? void 0 : r.bg) || 0, (r == null ? void 0 : r.extended) || new c.ExtendedAttrs()), this.getWidth(e) !== 0 || this.hasContent(e) || this.setCellFromCodePoint(e, 0, 1, (r == null ? void 0 : r.fg) || 0, (r == null ? void 0 : r.bg) || 0, (r == null ? void 0 : r.extended) || new c.ExtendedAttrs());
        }
        replaceCells(e, i, t, r, o = !1) {
          if (o) for (e && this.getWidth(e - 1) === 2 && !this.isProtected(e - 1) && this.setCellFromCodePoint(e - 1, 0, 1, (r == null ? void 0 : r.fg) || 0, (r == null ? void 0 : r.bg) || 0, (r == null ? void 0 : r.extended) || new c.ExtendedAttrs()), i < this.length && this.getWidth(i - 1) === 2 && !this.isProtected(i) && this.setCellFromCodePoint(i, 0, 1, (r == null ? void 0 : r.fg) || 0, (r == null ? void 0 : r.bg) || 0, (r == null ? void 0 : r.extended) || new c.ExtendedAttrs()); e < i && e < this.length; ) this.isProtected(e) || this.setCell(e, t), e++;
          else for (e && this.getWidth(e - 1) === 2 && this.setCellFromCodePoint(e - 1, 0, 1, (r == null ? void 0 : r.fg) || 0, (r == null ? void 0 : r.bg) || 0, (r == null ? void 0 : r.extended) || new c.ExtendedAttrs()), i < this.length && this.getWidth(i - 1) === 2 && this.setCellFromCodePoint(i, 0, 1, (r == null ? void 0 : r.fg) || 0, (r == null ? void 0 : r.bg) || 0, (r == null ? void 0 : r.extended) || new c.ExtendedAttrs()); e < i && e < this.length; ) this.setCell(e++, t);
        }
        resize(e, i) {
          if (e === this.length) return 4 * this._data.length * 2 < this._data.buffer.byteLength;
          const t = 3 * e;
          if (e > this.length) {
            if (this._data.buffer.byteLength >= 4 * t) this._data = new Uint32Array(this._data.buffer, 0, t);
            else {
              const r = new Uint32Array(t);
              r.set(this._data), this._data = r;
            }
            for (let r = this.length; r < e; ++r) this.setCell(r, i);
          } else {
            this._data = this._data.subarray(0, t);
            const r = Object.keys(this._combined);
            for (let l = 0; l < r.length; l++) {
              const f = parseInt(r[l], 10);
              f >= e && delete this._combined[f];
            }
            const o = Object.keys(this._extendedAttrs);
            for (let l = 0; l < o.length; l++) {
              const f = parseInt(o[l], 10);
              f >= e && delete this._extendedAttrs[f];
            }
          }
          return this.length = e, 4 * t * 2 < this._data.buffer.byteLength;
        }
        cleanupMemory() {
          if (4 * this._data.length * 2 < this._data.buffer.byteLength) {
            const e = new Uint32Array(this._data.length);
            return e.set(this._data), this._data = e, 1;
          }
          return 0;
        }
        fill(e, i = !1) {
          if (i) for (let t = 0; t < this.length; ++t) this.isProtected(t) || this.setCell(t, e);
          else {
            this._combined = {}, this._extendedAttrs = {};
            for (let t = 0; t < this.length; ++t) this.setCell(t, e);
          }
        }
        copyFrom(e) {
          this.length !== e.length ? this._data = new Uint32Array(e._data) : this._data.set(e._data), this.length = e.length, this._combined = {};
          for (const i in e._combined) this._combined[i] = e._combined[i];
          this._extendedAttrs = {};
          for (const i in e._extendedAttrs) this._extendedAttrs[i] = e._extendedAttrs[i];
          this.isWrapped = e.isWrapped;
        }
        clone() {
          const e = new g(0);
          e._data = new Uint32Array(this._data), e.length = this.length;
          for (const i in this._combined) e._combined[i] = this._combined[i];
          for (const i in this._extendedAttrs) e._extendedAttrs[i] = this._extendedAttrs[i];
          return e.isWrapped = this.isWrapped, e;
        }
        getTrimmedLength() {
          for (let e = this.length - 1; e >= 0; --e) if (4194303 & this._data[3 * e + 0]) return e + (this._data[3 * e + 0] >> 22);
          return 0;
        }
        getNoBgTrimmedLength() {
          for (let e = this.length - 1; e >= 0; --e) if (4194303 & this._data[3 * e + 0] || 50331648 & this._data[3 * e + 2]) return e + (this._data[3 * e + 0] >> 22);
          return 0;
        }
        copyCellsFrom(e, i, t, r, o) {
          const l = e._data;
          if (o) for (let m = r - 1; m >= 0; m--) {
            for (let h = 0; h < 3; h++) this._data[3 * (t + m) + h] = l[3 * (i + m) + h];
            268435456 & l[3 * (i + m) + 2] && (this._extendedAttrs[t + m] = e._extendedAttrs[i + m]);
          }
          else for (let m = 0; m < r; m++) {
            for (let h = 0; h < 3; h++) this._data[3 * (t + m) + h] = l[3 * (i + m) + h];
            268435456 & l[3 * (i + m) + 2] && (this._extendedAttrs[t + m] = e._extendedAttrs[i + m]);
          }
          const f = Object.keys(e._combined);
          for (let m = 0; m < f.length; m++) {
            const h = parseInt(f[m], 10);
            h >= i && (this._combined[h - i + t] = e._combined[h]);
          }
        }
        translateToString(e = !1, i = 0, t = this.length) {
          e && (t = Math.min(t, this.getTrimmedLength()));
          let r = "";
          for (; i < t; ) {
            const o = this._data[3 * i + 0], l = 2097151 & o;
            r += 2097152 & o ? this._combined[i] : l ? (0, d.stringFromCodePoint)(l) : n.WHITESPACE_CELL_CHAR, i += o >> 22 || 1;
          }
          return r;
        }
      }
      s.BufferLine = g;
    }, 4841: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.getRangeLength = void 0, s.getRangeLength = function(a, c) {
        if (a.start.y > a.end.y) throw new Error(`Buffer range end (${a.end.x}, ${a.end.y}) cannot be before start (${a.start.x}, ${a.start.y})`);
        return c * (a.end.y - a.start.y) + (a.end.x - a.start.x + 1);
      };
    }, 4634: (B, s) => {
      function a(c, _, n) {
        if (_ === c.length - 1) return c[_].getTrimmedLength();
        const d = !c[_].hasContent(n - 1) && c[_].getWidth(n - 1) === 1, v = c[_ + 1].getWidth(0) === 2;
        return d && v ? n - 1 : n;
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.getWrappedLineTrimmedLength = s.reflowSmallerGetNewLineLengths = s.reflowLargerApplyNewLayout = s.reflowLargerCreateNewLayout = s.reflowLargerGetLinesToRemove = void 0, s.reflowLargerGetLinesToRemove = function(c, _, n, d, v) {
        const g = [];
        for (let u = 0; u < c.length - 1; u++) {
          let e = u, i = c.get(++e);
          if (!i.isWrapped) continue;
          const t = [c.get(u)];
          for (; e < c.length && i.isWrapped; ) t.push(i), i = c.get(++e);
          if (d >= u && d < e) {
            u += t.length - 1;
            continue;
          }
          let r = 0, o = a(t, r, _), l = 1, f = 0;
          for (; l < t.length; ) {
            const h = a(t, l, _), p = h - f, w = n - o, C = Math.min(p, w);
            t[r].copyCellsFrom(t[l], f, o, C, !1), o += C, o === n && (r++, o = 0), f += C, f === h && (l++, f = 0), o === 0 && r !== 0 && t[r - 1].getWidth(n - 1) === 2 && (t[r].copyCellsFrom(t[r - 1], n - 1, o++, 1, !1), t[r - 1].setCell(n - 1, v));
          }
          t[r].replaceCells(o, n, v);
          let m = 0;
          for (let h = t.length - 1; h > 0 && (h > r || t[h].getTrimmedLength() === 0); h--) m++;
          m > 0 && (g.push(u + t.length - m), g.push(m)), u += t.length - 1;
        }
        return g;
      }, s.reflowLargerCreateNewLayout = function(c, _) {
        const n = [];
        let d = 0, v = _[d], g = 0;
        for (let u = 0; u < c.length; u++) if (v === u) {
          const e = _[++d];
          c.onDeleteEmitter.fire({ index: u - g, amount: e }), u += e - 1, g += e, v = _[++d];
        } else n.push(u);
        return { layout: n, countRemoved: g };
      }, s.reflowLargerApplyNewLayout = function(c, _) {
        const n = [];
        for (let d = 0; d < _.length; d++) n.push(c.get(_[d]));
        for (let d = 0; d < n.length; d++) c.set(d, n[d]);
        c.length = _.length;
      }, s.reflowSmallerGetNewLineLengths = function(c, _, n) {
        const d = [], v = c.map((i, t) => a(c, t, _)).reduce((i, t) => i + t);
        let g = 0, u = 0, e = 0;
        for (; e < v; ) {
          if (v - e < n) {
            d.push(v - e);
            break;
          }
          g += n;
          const i = a(c, u, _);
          g > i && (g -= i, u++);
          const t = c[u].getWidth(g - 1) === 2;
          t && g--;
          const r = t ? n - 1 : n;
          d.push(r), e += r;
        }
        return d;
      }, s.getWrappedLineTrimmedLength = a;
    }, 5295: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferSet = void 0;
      const c = a(8460), _ = a(844), n = a(9092);
      class d extends _.Disposable {
        constructor(g, u) {
          super(), this._optionsService = g, this._bufferService = u, this._onBufferActivate = this.register(new c.EventEmitter()), this.onBufferActivate = this._onBufferActivate.event, this.reset(), this.register(this._optionsService.onSpecificOptionChange("scrollback", () => this.resize(this._bufferService.cols, this._bufferService.rows))), this.register(this._optionsService.onSpecificOptionChange("tabStopWidth", () => this.setupTabStops()));
        }
        reset() {
          this._normal = new n.Buffer(!0, this._optionsService, this._bufferService), this._normal.fillViewportRows(), this._alt = new n.Buffer(!1, this._optionsService, this._bufferService), this._activeBuffer = this._normal, this._onBufferActivate.fire({ activeBuffer: this._normal, inactiveBuffer: this._alt }), this.setupTabStops();
        }
        get alt() {
          return this._alt;
        }
        get active() {
          return this._activeBuffer;
        }
        get normal() {
          return this._normal;
        }
        activateNormalBuffer() {
          this._activeBuffer !== this._normal && (this._normal.x = this._alt.x, this._normal.y = this._alt.y, this._alt.clearAllMarkers(), this._alt.clear(), this._activeBuffer = this._normal, this._onBufferActivate.fire({ activeBuffer: this._normal, inactiveBuffer: this._alt }));
        }
        activateAltBuffer(g) {
          this._activeBuffer !== this._alt && (this._alt.fillViewportRows(g), this._alt.x = this._normal.x, this._alt.y = this._normal.y, this._activeBuffer = this._alt, this._onBufferActivate.fire({ activeBuffer: this._alt, inactiveBuffer: this._normal }));
        }
        resize(g, u) {
          this._normal.resize(g, u), this._alt.resize(g, u), this.setupTabStops(g);
        }
        setupTabStops(g) {
          this._normal.setupTabStops(g), this._alt.setupTabStops(g);
        }
      }
      s.BufferSet = d;
    }, 511: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CellData = void 0;
      const c = a(482), _ = a(643), n = a(3734);
      class d extends n.AttributeData {
        constructor() {
          super(...arguments), this.content = 0, this.fg = 0, this.bg = 0, this.extended = new n.ExtendedAttrs(), this.combinedData = "";
        }
        static fromCharData(g) {
          const u = new d();
          return u.setFromCharData(g), u;
        }
        isCombined() {
          return 2097152 & this.content;
        }
        getWidth() {
          return this.content >> 22;
        }
        getChars() {
          return 2097152 & this.content ? this.combinedData : 2097151 & this.content ? (0, c.stringFromCodePoint)(2097151 & this.content) : "";
        }
        getCode() {
          return this.isCombined() ? this.combinedData.charCodeAt(this.combinedData.length - 1) : 2097151 & this.content;
        }
        setFromCharData(g) {
          this.fg = g[_.CHAR_DATA_ATTR_INDEX], this.bg = 0;
          let u = !1;
          if (g[_.CHAR_DATA_CHAR_INDEX].length > 2) u = !0;
          else if (g[_.CHAR_DATA_CHAR_INDEX].length === 2) {
            const e = g[_.CHAR_DATA_CHAR_INDEX].charCodeAt(0);
            if (55296 <= e && e <= 56319) {
              const i = g[_.CHAR_DATA_CHAR_INDEX].charCodeAt(1);
              56320 <= i && i <= 57343 ? this.content = 1024 * (e - 55296) + i - 56320 + 65536 | g[_.CHAR_DATA_WIDTH_INDEX] << 22 : u = !0;
            } else u = !0;
          } else this.content = g[_.CHAR_DATA_CHAR_INDEX].charCodeAt(0) | g[_.CHAR_DATA_WIDTH_INDEX] << 22;
          u && (this.combinedData = g[_.CHAR_DATA_CHAR_INDEX], this.content = 2097152 | g[_.CHAR_DATA_WIDTH_INDEX] << 22);
        }
        getAsCharData() {
          return [this.fg, this.getChars(), this.getWidth(), this.getCode()];
        }
      }
      s.CellData = d;
    }, 643: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.WHITESPACE_CELL_CODE = s.WHITESPACE_CELL_WIDTH = s.WHITESPACE_CELL_CHAR = s.NULL_CELL_CODE = s.NULL_CELL_WIDTH = s.NULL_CELL_CHAR = s.CHAR_DATA_CODE_INDEX = s.CHAR_DATA_WIDTH_INDEX = s.CHAR_DATA_CHAR_INDEX = s.CHAR_DATA_ATTR_INDEX = s.DEFAULT_EXT = s.DEFAULT_ATTR = s.DEFAULT_COLOR = void 0, s.DEFAULT_COLOR = 0, s.DEFAULT_ATTR = 256 | s.DEFAULT_COLOR << 9, s.DEFAULT_EXT = 0, s.CHAR_DATA_ATTR_INDEX = 0, s.CHAR_DATA_CHAR_INDEX = 1, s.CHAR_DATA_WIDTH_INDEX = 2, s.CHAR_DATA_CODE_INDEX = 3, s.NULL_CELL_CHAR = "", s.NULL_CELL_WIDTH = 1, s.NULL_CELL_CODE = 0, s.WHITESPACE_CELL_CHAR = " ", s.WHITESPACE_CELL_WIDTH = 1, s.WHITESPACE_CELL_CODE = 32;
    }, 4863: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Marker = void 0;
      const c = a(8460), _ = a(844);
      class n {
        get id() {
          return this._id;
        }
        constructor(v) {
          this.line = v, this.isDisposed = !1, this._disposables = [], this._id = n._nextId++, this._onDispose = this.register(new c.EventEmitter()), this.onDispose = this._onDispose.event;
        }
        dispose() {
          this.isDisposed || (this.isDisposed = !0, this.line = -1, this._onDispose.fire(), (0, _.disposeArray)(this._disposables), this._disposables.length = 0);
        }
        register(v) {
          return this._disposables.push(v), v;
        }
      }
      s.Marker = n, n._nextId = 1;
    }, 7116: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DEFAULT_CHARSET = s.CHARSETS = void 0, s.CHARSETS = {}, s.DEFAULT_CHARSET = s.CHARSETS.B, s.CHARSETS[0] = { "`": "◆", a: "▒", b: "␉", c: "␌", d: "␍", e: "␊", f: "°", g: "±", h: "␤", i: "␋", j: "┘", k: "┐", l: "┌", m: "└", n: "┼", o: "⎺", p: "⎻", q: "─", r: "⎼", s: "⎽", t: "├", u: "┤", v: "┴", w: "┬", x: "│", y: "≤", z: "≥", "{": "π", "|": "≠", "}": "£", "~": "·" }, s.CHARSETS.A = { "#": "£" }, s.CHARSETS.B = void 0, s.CHARSETS[4] = { "#": "£", "@": "¾", "[": "ij", "\\": "½", "]": "|", "{": "¨", "|": "f", "}": "¼", "~": "´" }, s.CHARSETS.C = s.CHARSETS[5] = { "[": "Ä", "\\": "Ö", "]": "Å", "^": "Ü", "`": "é", "{": "ä", "|": "ö", "}": "å", "~": "ü" }, s.CHARSETS.R = { "#": "£", "@": "à", "[": "°", "\\": "ç", "]": "§", "{": "é", "|": "ù", "}": "è", "~": "¨" }, s.CHARSETS.Q = { "@": "à", "[": "â", "\\": "ç", "]": "ê", "^": "î", "`": "ô", "{": "é", "|": "ù", "}": "è", "~": "û" }, s.CHARSETS.K = { "@": "§", "[": "Ä", "\\": "Ö", "]": "Ü", "{": "ä", "|": "ö", "}": "ü", "~": "ß" }, s.CHARSETS.Y = { "#": "£", "@": "§", "[": "°", "\\": "ç", "]": "é", "`": "ù", "{": "à", "|": "ò", "}": "è", "~": "ì" }, s.CHARSETS.E = s.CHARSETS[6] = { "@": "Ä", "[": "Æ", "\\": "Ø", "]": "Å", "^": "Ü", "`": "ä", "{": "æ", "|": "ø", "}": "å", "~": "ü" }, s.CHARSETS.Z = { "#": "£", "@": "§", "[": "¡", "\\": "Ñ", "]": "¿", "{": "°", "|": "ñ", "}": "ç" }, s.CHARSETS.H = s.CHARSETS[7] = { "@": "É", "[": "Ä", "\\": "Ö", "]": "Å", "^": "Ü", "`": "é", "{": "ä", "|": "ö", "}": "å", "~": "ü" }, s.CHARSETS["="] = { "#": "ù", "@": "à", "[": "é", "\\": "ç", "]": "ê", "^": "î", _: "è", "`": "ô", "{": "ä", "|": "ö", "}": "ü", "~": "û" };
    }, 2584: (B, s) => {
      var a, c, _;
      Object.defineProperty(s, "__esModule", { value: !0 }), s.C1_ESCAPED = s.C1 = s.C0 = void 0, function(n) {
        n.NUL = "\0", n.SOH = "", n.STX = "", n.ETX = "", n.EOT = "", n.ENQ = "", n.ACK = "", n.BEL = "\x07", n.BS = "\b", n.HT = "	", n.LF = `
`, n.VT = "\v", n.FF = "\f", n.CR = "\r", n.SO = "", n.SI = "", n.DLE = "", n.DC1 = "", n.DC2 = "", n.DC3 = "", n.DC4 = "", n.NAK = "", n.SYN = "", n.ETB = "", n.CAN = "", n.EM = "", n.SUB = "", n.ESC = "\x1B", n.FS = "", n.GS = "", n.RS = "", n.US = "", n.SP = " ", n.DEL = "";
      }(a || (s.C0 = a = {})), function(n) {
        n.PAD = "", n.HOP = "", n.BPH = "", n.NBH = "", n.IND = "", n.NEL = "", n.SSA = "", n.ESA = "", n.HTS = "", n.HTJ = "", n.VTS = "", n.PLD = "", n.PLU = "", n.RI = "", n.SS2 = "", n.SS3 = "", n.DCS = "", n.PU1 = "", n.PU2 = "", n.STS = "", n.CCH = "", n.MW = "", n.SPA = "", n.EPA = "", n.SOS = "", n.SGCI = "", n.SCI = "", n.CSI = "", n.ST = "", n.OSC = "", n.PM = "", n.APC = "";
      }(c || (s.C1 = c = {})), function(n) {
        n.ST = `${a.ESC}\\`;
      }(_ || (s.C1_ESCAPED = _ = {}));
    }, 7399: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.evaluateKeyboardEvent = void 0;
      const c = a(2584), _ = { 48: ["0", ")"], 49: ["1", "!"], 50: ["2", "@"], 51: ["3", "#"], 52: ["4", "$"], 53: ["5", "%"], 54: ["6", "^"], 55: ["7", "&"], 56: ["8", "*"], 57: ["9", "("], 186: [";", ":"], 187: ["=", "+"], 188: [",", "<"], 189: ["-", "_"], 190: [".", ">"], 191: ["/", "?"], 192: ["`", "~"], 219: ["[", "{"], 220: ["\\", "|"], 221: ["]", "}"], 222: ["'", '"'] };
      s.evaluateKeyboardEvent = function(n, d, v, g) {
        const u = { type: 0, cancel: !1, key: void 0 }, e = (n.shiftKey ? 1 : 0) | (n.altKey ? 2 : 0) | (n.ctrlKey ? 4 : 0) | (n.metaKey ? 8 : 0);
        switch (n.keyCode) {
          case 0:
            n.key === "UIKeyInputUpArrow" ? u.key = d ? c.C0.ESC + "OA" : c.C0.ESC + "[A" : n.key === "UIKeyInputLeftArrow" ? u.key = d ? c.C0.ESC + "OD" : c.C0.ESC + "[D" : n.key === "UIKeyInputRightArrow" ? u.key = d ? c.C0.ESC + "OC" : c.C0.ESC + "[C" : n.key === "UIKeyInputDownArrow" && (u.key = d ? c.C0.ESC + "OB" : c.C0.ESC + "[B");
            break;
          case 8:
            if (n.altKey) {
              u.key = c.C0.ESC + c.C0.DEL;
              break;
            }
            u.key = c.C0.DEL;
            break;
          case 9:
            if (n.shiftKey) {
              u.key = c.C0.ESC + "[Z";
              break;
            }
            u.key = c.C0.HT, u.cancel = !0;
            break;
          case 13:
            u.key = n.altKey ? c.C0.ESC + c.C0.CR : c.C0.CR, u.cancel = !0;
            break;
          case 27:
            u.key = c.C0.ESC, n.altKey && (u.key = c.C0.ESC + c.C0.ESC), u.cancel = !0;
            break;
          case 37:
            if (n.metaKey) break;
            e ? (u.key = c.C0.ESC + "[1;" + (e + 1) + "D", u.key === c.C0.ESC + "[1;3D" && (u.key = c.C0.ESC + (v ? "b" : "[1;5D"))) : u.key = d ? c.C0.ESC + "OD" : c.C0.ESC + "[D";
            break;
          case 39:
            if (n.metaKey) break;
            e ? (u.key = c.C0.ESC + "[1;" + (e + 1) + "C", u.key === c.C0.ESC + "[1;3C" && (u.key = c.C0.ESC + (v ? "f" : "[1;5C"))) : u.key = d ? c.C0.ESC + "OC" : c.C0.ESC + "[C";
            break;
          case 38:
            if (n.metaKey) break;
            e ? (u.key = c.C0.ESC + "[1;" + (e + 1) + "A", v || u.key !== c.C0.ESC + "[1;3A" || (u.key = c.C0.ESC + "[1;5A")) : u.key = d ? c.C0.ESC + "OA" : c.C0.ESC + "[A";
            break;
          case 40:
            if (n.metaKey) break;
            e ? (u.key = c.C0.ESC + "[1;" + (e + 1) + "B", v || u.key !== c.C0.ESC + "[1;3B" || (u.key = c.C0.ESC + "[1;5B")) : u.key = d ? c.C0.ESC + "OB" : c.C0.ESC + "[B";
            break;
          case 45:
            n.shiftKey || n.ctrlKey || (u.key = c.C0.ESC + "[2~");
            break;
          case 46:
            u.key = e ? c.C0.ESC + "[3;" + (e + 1) + "~" : c.C0.ESC + "[3~";
            break;
          case 36:
            u.key = e ? c.C0.ESC + "[1;" + (e + 1) + "H" : d ? c.C0.ESC + "OH" : c.C0.ESC + "[H";
            break;
          case 35:
            u.key = e ? c.C0.ESC + "[1;" + (e + 1) + "F" : d ? c.C0.ESC + "OF" : c.C0.ESC + "[F";
            break;
          case 33:
            n.shiftKey ? u.type = 2 : n.ctrlKey ? u.key = c.C0.ESC + "[5;" + (e + 1) + "~" : u.key = c.C0.ESC + "[5~";
            break;
          case 34:
            n.shiftKey ? u.type = 3 : n.ctrlKey ? u.key = c.C0.ESC + "[6;" + (e + 1) + "~" : u.key = c.C0.ESC + "[6~";
            break;
          case 112:
            u.key = e ? c.C0.ESC + "[1;" + (e + 1) + "P" : c.C0.ESC + "OP";
            break;
          case 113:
            u.key = e ? c.C0.ESC + "[1;" + (e + 1) + "Q" : c.C0.ESC + "OQ";
            break;
          case 114:
            u.key = e ? c.C0.ESC + "[1;" + (e + 1) + "R" : c.C0.ESC + "OR";
            break;
          case 115:
            u.key = e ? c.C0.ESC + "[1;" + (e + 1) + "S" : c.C0.ESC + "OS";
            break;
          case 116:
            u.key = e ? c.C0.ESC + "[15;" + (e + 1) + "~" : c.C0.ESC + "[15~";
            break;
          case 117:
            u.key = e ? c.C0.ESC + "[17;" + (e + 1) + "~" : c.C0.ESC + "[17~";
            break;
          case 118:
            u.key = e ? c.C0.ESC + "[18;" + (e + 1) + "~" : c.C0.ESC + "[18~";
            break;
          case 119:
            u.key = e ? c.C0.ESC + "[19;" + (e + 1) + "~" : c.C0.ESC + "[19~";
            break;
          case 120:
            u.key = e ? c.C0.ESC + "[20;" + (e + 1) + "~" : c.C0.ESC + "[20~";
            break;
          case 121:
            u.key = e ? c.C0.ESC + "[21;" + (e + 1) + "~" : c.C0.ESC + "[21~";
            break;
          case 122:
            u.key = e ? c.C0.ESC + "[23;" + (e + 1) + "~" : c.C0.ESC + "[23~";
            break;
          case 123:
            u.key = e ? c.C0.ESC + "[24;" + (e + 1) + "~" : c.C0.ESC + "[24~";
            break;
          default:
            if (!n.ctrlKey || n.shiftKey || n.altKey || n.metaKey) if (v && !g || !n.altKey || n.metaKey) !v || n.altKey || n.ctrlKey || n.shiftKey || !n.metaKey ? n.key && !n.ctrlKey && !n.altKey && !n.metaKey && n.keyCode >= 48 && n.key.length === 1 ? u.key = n.key : n.key && n.ctrlKey && (n.key === "_" && (u.key = c.C0.US), n.key === "@" && (u.key = c.C0.NUL)) : n.keyCode === 65 && (u.type = 1);
            else {
              const i = _[n.keyCode], t = i == null ? void 0 : i[n.shiftKey ? 1 : 0];
              if (t) u.key = c.C0.ESC + t;
              else if (n.keyCode >= 65 && n.keyCode <= 90) {
                const r = n.ctrlKey ? n.keyCode - 64 : n.keyCode + 32;
                let o = String.fromCharCode(r);
                n.shiftKey && (o = o.toUpperCase()), u.key = c.C0.ESC + o;
              } else if (n.keyCode === 32) u.key = c.C0.ESC + (n.ctrlKey ? c.C0.NUL : " ");
              else if (n.key === "Dead" && n.code.startsWith("Key")) {
                let r = n.code.slice(3, 4);
                n.shiftKey || (r = r.toLowerCase()), u.key = c.C0.ESC + r, u.cancel = !0;
              }
            }
            else n.keyCode >= 65 && n.keyCode <= 90 ? u.key = String.fromCharCode(n.keyCode - 64) : n.keyCode === 32 ? u.key = c.C0.NUL : n.keyCode >= 51 && n.keyCode <= 55 ? u.key = String.fromCharCode(n.keyCode - 51 + 27) : n.keyCode === 56 ? u.key = c.C0.DEL : n.keyCode === 219 ? u.key = c.C0.ESC : n.keyCode === 220 ? u.key = c.C0.FS : n.keyCode === 221 && (u.key = c.C0.GS);
        }
        return u;
      };
    }, 482: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Utf8ToUtf32 = s.StringToUtf32 = s.utf32ToString = s.stringFromCodePoint = void 0, s.stringFromCodePoint = function(a) {
        return a > 65535 ? (a -= 65536, String.fromCharCode(55296 + (a >> 10)) + String.fromCharCode(a % 1024 + 56320)) : String.fromCharCode(a);
      }, s.utf32ToString = function(a, c = 0, _ = a.length) {
        let n = "";
        for (let d = c; d < _; ++d) {
          let v = a[d];
          v > 65535 ? (v -= 65536, n += String.fromCharCode(55296 + (v >> 10)) + String.fromCharCode(v % 1024 + 56320)) : n += String.fromCharCode(v);
        }
        return n;
      }, s.StringToUtf32 = class {
        constructor() {
          this._interim = 0;
        }
        clear() {
          this._interim = 0;
        }
        decode(a, c) {
          const _ = a.length;
          if (!_) return 0;
          let n = 0, d = 0;
          if (this._interim) {
            const v = a.charCodeAt(d++);
            56320 <= v && v <= 57343 ? c[n++] = 1024 * (this._interim - 55296) + v - 56320 + 65536 : (c[n++] = this._interim, c[n++] = v), this._interim = 0;
          }
          for (let v = d; v < _; ++v) {
            const g = a.charCodeAt(v);
            if (55296 <= g && g <= 56319) {
              if (++v >= _) return this._interim = g, n;
              const u = a.charCodeAt(v);
              56320 <= u && u <= 57343 ? c[n++] = 1024 * (g - 55296) + u - 56320 + 65536 : (c[n++] = g, c[n++] = u);
            } else g !== 65279 && (c[n++] = g);
          }
          return n;
        }
      }, s.Utf8ToUtf32 = class {
        constructor() {
          this.interim = new Uint8Array(3);
        }
        clear() {
          this.interim.fill(0);
        }
        decode(a, c) {
          const _ = a.length;
          if (!_) return 0;
          let n, d, v, g, u = 0, e = 0, i = 0;
          if (this.interim[0]) {
            let o = !1, l = this.interim[0];
            l &= (224 & l) == 192 ? 31 : (240 & l) == 224 ? 15 : 7;
            let f, m = 0;
            for (; (f = 63 & this.interim[++m]) && m < 4; ) l <<= 6, l |= f;
            const h = (224 & this.interim[0]) == 192 ? 2 : (240 & this.interim[0]) == 224 ? 3 : 4, p = h - m;
            for (; i < p; ) {
              if (i >= _) return 0;
              if (f = a[i++], (192 & f) != 128) {
                i--, o = !0;
                break;
              }
              this.interim[m++] = f, l <<= 6, l |= 63 & f;
            }
            o || (h === 2 ? l < 128 ? i-- : c[u++] = l : h === 3 ? l < 2048 || l >= 55296 && l <= 57343 || l === 65279 || (c[u++] = l) : l < 65536 || l > 1114111 || (c[u++] = l)), this.interim.fill(0);
          }
          const t = _ - 4;
          let r = i;
          for (; r < _; ) {
            for (; !(!(r < t) || 128 & (n = a[r]) || 128 & (d = a[r + 1]) || 128 & (v = a[r + 2]) || 128 & (g = a[r + 3])); ) c[u++] = n, c[u++] = d, c[u++] = v, c[u++] = g, r += 4;
            if (n = a[r++], n < 128) c[u++] = n;
            else if ((224 & n) == 192) {
              if (r >= _) return this.interim[0] = n, u;
              if (d = a[r++], (192 & d) != 128) {
                r--;
                continue;
              }
              if (e = (31 & n) << 6 | 63 & d, e < 128) {
                r--;
                continue;
              }
              c[u++] = e;
            } else if ((240 & n) == 224) {
              if (r >= _) return this.interim[0] = n, u;
              if (d = a[r++], (192 & d) != 128) {
                r--;
                continue;
              }
              if (r >= _) return this.interim[0] = n, this.interim[1] = d, u;
              if (v = a[r++], (192 & v) != 128) {
                r--;
                continue;
              }
              if (e = (15 & n) << 12 | (63 & d) << 6 | 63 & v, e < 2048 || e >= 55296 && e <= 57343 || e === 65279) continue;
              c[u++] = e;
            } else if ((248 & n) == 240) {
              if (r >= _) return this.interim[0] = n, u;
              if (d = a[r++], (192 & d) != 128) {
                r--;
                continue;
              }
              if (r >= _) return this.interim[0] = n, this.interim[1] = d, u;
              if (v = a[r++], (192 & v) != 128) {
                r--;
                continue;
              }
              if (r >= _) return this.interim[0] = n, this.interim[1] = d, this.interim[2] = v, u;
              if (g = a[r++], (192 & g) != 128) {
                r--;
                continue;
              }
              if (e = (7 & n) << 18 | (63 & d) << 12 | (63 & v) << 6 | 63 & g, e < 65536 || e > 1114111) continue;
              c[u++] = e;
            }
          }
          return u;
        }
      };
    }, 225: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.UnicodeV6 = void 0;
      const a = [[768, 879], [1155, 1158], [1160, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1536, 1539], [1552, 1557], [1611, 1630], [1648, 1648], [1750, 1764], [1767, 1768], [1770, 1773], [1807, 1807], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2305, 2306], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2388], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2672, 2673], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2883], [2893, 2893], [2902, 2902], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3393, 3395], [3405, 3405], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3984, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4146], [4150, 4151], [4153, 4153], [4184, 4185], [4448, 4607], [4959, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7616, 7626], [7678, 7679], [8203, 8207], [8234, 8238], [8288, 8291], [8298, 8303], [8400, 8431], [12330, 12335], [12441, 12442], [43014, 43014], [43019, 43019], [43045, 43046], [64286, 64286], [65024, 65039], [65056, 65059], [65279, 65279], [65529, 65531]], c = [[68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [119143, 119145], [119155, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917505, 917505], [917536, 917631], [917760, 917999]];
      let _;
      s.UnicodeV6 = class {
        constructor() {
          if (this.version = "6", !_) {
            _ = new Uint8Array(65536), _.fill(1), _[0] = 0, _.fill(0, 1, 32), _.fill(0, 127, 160), _.fill(2, 4352, 4448), _[9001] = 2, _[9002] = 2, _.fill(2, 11904, 42192), _[12351] = 1, _.fill(2, 44032, 55204), _.fill(2, 63744, 64256), _.fill(2, 65040, 65050), _.fill(2, 65072, 65136), _.fill(2, 65280, 65377), _.fill(2, 65504, 65511);
            for (let n = 0; n < a.length; ++n) _.fill(0, a[n][0], a[n][1] + 1);
          }
        }
        wcwidth(n) {
          return n < 32 ? 0 : n < 127 ? 1 : n < 65536 ? _[n] : function(d, v) {
            let g, u = 0, e = v.length - 1;
            if (d < v[0][0] || d > v[e][1]) return !1;
            for (; e >= u; ) if (g = u + e >> 1, d > v[g][1]) u = g + 1;
            else {
              if (!(d < v[g][0])) return !0;
              e = g - 1;
            }
            return !1;
          }(n, c) ? 0 : n >= 131072 && n <= 196605 || n >= 196608 && n <= 262141 ? 2 : 1;
        }
      };
    }, 5981: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.WriteBuffer = void 0;
      const c = a(8460), _ = a(844);
      class n extends _.Disposable {
        constructor(v) {
          super(), this._action = v, this._writeBuffer = [], this._callbacks = [], this._pendingData = 0, this._bufferOffset = 0, this._isSyncWriting = !1, this._syncCalls = 0, this._didUserInput = !1, this._onWriteParsed = this.register(new c.EventEmitter()), this.onWriteParsed = this._onWriteParsed.event;
        }
        handleUserInput() {
          this._didUserInput = !0;
        }
        writeSync(v, g) {
          if (g !== void 0 && this._syncCalls > g) return void (this._syncCalls = 0);
          if (this._pendingData += v.length, this._writeBuffer.push(v), this._callbacks.push(void 0), this._syncCalls++, this._isSyncWriting) return;
          let u;
          for (this._isSyncWriting = !0; u = this._writeBuffer.shift(); ) {
            this._action(u);
            const e = this._callbacks.shift();
            e && e();
          }
          this._pendingData = 0, this._bufferOffset = 2147483647, this._isSyncWriting = !1, this._syncCalls = 0;
        }
        write(v, g) {
          if (this._pendingData > 5e7) throw new Error("write data discarded, use flow control to avoid losing data");
          if (!this._writeBuffer.length) {
            if (this._bufferOffset = 0, this._didUserInput) return this._didUserInput = !1, this._pendingData += v.length, this._writeBuffer.push(v), this._callbacks.push(g), void this._innerWrite();
            setTimeout(() => this._innerWrite());
          }
          this._pendingData += v.length, this._writeBuffer.push(v), this._callbacks.push(g);
        }
        _innerWrite(v = 0, g = !0) {
          const u = v || Date.now();
          for (; this._writeBuffer.length > this._bufferOffset; ) {
            const e = this._writeBuffer[this._bufferOffset], i = this._action(e, g);
            if (i) {
              const r = (o) => Date.now() - u >= 12 ? setTimeout(() => this._innerWrite(0, o)) : this._innerWrite(u, o);
              return void i.catch((o) => (queueMicrotask(() => {
                throw o;
              }), Promise.resolve(!1))).then(r);
            }
            const t = this._callbacks[this._bufferOffset];
            if (t && t(), this._bufferOffset++, this._pendingData -= e.length, Date.now() - u >= 12) break;
          }
          this._writeBuffer.length > this._bufferOffset ? (this._bufferOffset > 50 && (this._writeBuffer = this._writeBuffer.slice(this._bufferOffset), this._callbacks = this._callbacks.slice(this._bufferOffset), this._bufferOffset = 0), setTimeout(() => this._innerWrite())) : (this._writeBuffer.length = 0, this._callbacks.length = 0, this._pendingData = 0, this._bufferOffset = 0), this._onWriteParsed.fire();
        }
      }
      s.WriteBuffer = n;
    }, 5941: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.toRgbString = s.parseColor = void 0;
      const a = /^([\da-f])\/([\da-f])\/([\da-f])$|^([\da-f]{2})\/([\da-f]{2})\/([\da-f]{2})$|^([\da-f]{3})\/([\da-f]{3})\/([\da-f]{3})$|^([\da-f]{4})\/([\da-f]{4})\/([\da-f]{4})$/, c = /^[\da-f]+$/;
      function _(n, d) {
        const v = n.toString(16), g = v.length < 2 ? "0" + v : v;
        switch (d) {
          case 4:
            return v[0];
          case 8:
            return g;
          case 12:
            return (g + g).slice(0, 3);
          default:
            return g + g;
        }
      }
      s.parseColor = function(n) {
        if (!n) return;
        let d = n.toLowerCase();
        if (d.indexOf("rgb:") === 0) {
          d = d.slice(4);
          const v = a.exec(d);
          if (v) {
            const g = v[1] ? 15 : v[4] ? 255 : v[7] ? 4095 : 65535;
            return [Math.round(parseInt(v[1] || v[4] || v[7] || v[10], 16) / g * 255), Math.round(parseInt(v[2] || v[5] || v[8] || v[11], 16) / g * 255), Math.round(parseInt(v[3] || v[6] || v[9] || v[12], 16) / g * 255)];
          }
        } else if (d.indexOf("#") === 0 && (d = d.slice(1), c.exec(d) && [3, 6, 9, 12].includes(d.length))) {
          const v = d.length / 3, g = [0, 0, 0];
          for (let u = 0; u < 3; ++u) {
            const e = parseInt(d.slice(v * u, v * u + v), 16);
            g[u] = v === 1 ? e << 4 : v === 2 ? e : v === 3 ? e >> 4 : e >> 8;
          }
          return g;
        }
      }, s.toRgbString = function(n, d = 16) {
        const [v, g, u] = n;
        return `rgb:${_(v, d)}/${_(g, d)}/${_(u, d)}`;
      };
    }, 5770: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.PAYLOAD_LIMIT = void 0, s.PAYLOAD_LIMIT = 1e7;
    }, 6351: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DcsHandler = s.DcsParser = void 0;
      const c = a(482), _ = a(8742), n = a(5770), d = [];
      s.DcsParser = class {
        constructor() {
          this._handlers = /* @__PURE__ */ Object.create(null), this._active = d, this._ident = 0, this._handlerFb = () => {
          }, this._stack = { paused: !1, loopPosition: 0, fallThrough: !1 };
        }
        dispose() {
          this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
          }, this._active = d;
        }
        registerHandler(g, u) {
          this._handlers[g] === void 0 && (this._handlers[g] = []);
          const e = this._handlers[g];
          return e.push(u), { dispose: () => {
            const i = e.indexOf(u);
            i !== -1 && e.splice(i, 1);
          } };
        }
        clearHandler(g) {
          this._handlers[g] && delete this._handlers[g];
        }
        setHandlerFallback(g) {
          this._handlerFb = g;
        }
        reset() {
          if (this._active.length) for (let g = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; g >= 0; --g) this._active[g].unhook(!1);
          this._stack.paused = !1, this._active = d, this._ident = 0;
        }
        hook(g, u) {
          if (this.reset(), this._ident = g, this._active = this._handlers[g] || d, this._active.length) for (let e = this._active.length - 1; e >= 0; e--) this._active[e].hook(u);
          else this._handlerFb(this._ident, "HOOK", u);
        }
        put(g, u, e) {
          if (this._active.length) for (let i = this._active.length - 1; i >= 0; i--) this._active[i].put(g, u, e);
          else this._handlerFb(this._ident, "PUT", (0, c.utf32ToString)(g, u, e));
        }
        unhook(g, u = !0) {
          if (this._active.length) {
            let e = !1, i = this._active.length - 1, t = !1;
            if (this._stack.paused && (i = this._stack.loopPosition - 1, e = u, t = this._stack.fallThrough, this._stack.paused = !1), !t && e === !1) {
              for (; i >= 0 && (e = this._active[i].unhook(g), e !== !0); i--) if (e instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = i, this._stack.fallThrough = !1, e;
              i--;
            }
            for (; i >= 0; i--) if (e = this._active[i].unhook(!1), e instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = i, this._stack.fallThrough = !0, e;
          } else this._handlerFb(this._ident, "UNHOOK", g);
          this._active = d, this._ident = 0;
        }
      };
      const v = new _.Params();
      v.addParam(0), s.DcsHandler = class {
        constructor(g) {
          this._handler = g, this._data = "", this._params = v, this._hitLimit = !1;
        }
        hook(g) {
          this._params = g.length > 1 || g.params[0] ? g.clone() : v, this._data = "", this._hitLimit = !1;
        }
        put(g, u, e) {
          this._hitLimit || (this._data += (0, c.utf32ToString)(g, u, e), this._data.length > n.PAYLOAD_LIMIT && (this._data = "", this._hitLimit = !0));
        }
        unhook(g) {
          let u = !1;
          if (this._hitLimit) u = !1;
          else if (g && (u = this._handler(this._data, this._params), u instanceof Promise)) return u.then((e) => (this._params = v, this._data = "", this._hitLimit = !1, e));
          return this._params = v, this._data = "", this._hitLimit = !1, u;
        }
      };
    }, 2015: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.EscapeSequenceParser = s.VT500_TRANSITION_TABLE = s.TransitionTable = void 0;
      const c = a(844), _ = a(8742), n = a(6242), d = a(6351);
      class v {
        constructor(i) {
          this.table = new Uint8Array(i);
        }
        setDefault(i, t) {
          this.table.fill(i << 4 | t);
        }
        add(i, t, r, o) {
          this.table[t << 8 | i] = r << 4 | o;
        }
        addMany(i, t, r, o) {
          for (let l = 0; l < i.length; l++) this.table[t << 8 | i[l]] = r << 4 | o;
        }
      }
      s.TransitionTable = v;
      const g = 160;
      s.VT500_TRANSITION_TABLE = function() {
        const e = new v(4095), i = Array.apply(null, Array(256)).map((m, h) => h), t = (m, h) => i.slice(m, h), r = t(32, 127), o = t(0, 24);
        o.push(25), o.push.apply(o, t(28, 32));
        const l = t(0, 14);
        let f;
        for (f in e.setDefault(1, 0), e.addMany(r, 0, 2, 0), l) e.addMany([24, 26, 153, 154], f, 3, 0), e.addMany(t(128, 144), f, 3, 0), e.addMany(t(144, 152), f, 3, 0), e.add(156, f, 0, 0), e.add(27, f, 11, 1), e.add(157, f, 4, 8), e.addMany([152, 158, 159], f, 0, 7), e.add(155, f, 11, 3), e.add(144, f, 11, 9);
        return e.addMany(o, 0, 3, 0), e.addMany(o, 1, 3, 1), e.add(127, 1, 0, 1), e.addMany(o, 8, 0, 8), e.addMany(o, 3, 3, 3), e.add(127, 3, 0, 3), e.addMany(o, 4, 3, 4), e.add(127, 4, 0, 4), e.addMany(o, 6, 3, 6), e.addMany(o, 5, 3, 5), e.add(127, 5, 0, 5), e.addMany(o, 2, 3, 2), e.add(127, 2, 0, 2), e.add(93, 1, 4, 8), e.addMany(r, 8, 5, 8), e.add(127, 8, 5, 8), e.addMany([156, 27, 24, 26, 7], 8, 6, 0), e.addMany(t(28, 32), 8, 0, 8), e.addMany([88, 94, 95], 1, 0, 7), e.addMany(r, 7, 0, 7), e.addMany(o, 7, 0, 7), e.add(156, 7, 0, 0), e.add(127, 7, 0, 7), e.add(91, 1, 11, 3), e.addMany(t(64, 127), 3, 7, 0), e.addMany(t(48, 60), 3, 8, 4), e.addMany([60, 61, 62, 63], 3, 9, 4), e.addMany(t(48, 60), 4, 8, 4), e.addMany(t(64, 127), 4, 7, 0), e.addMany([60, 61, 62, 63], 4, 0, 6), e.addMany(t(32, 64), 6, 0, 6), e.add(127, 6, 0, 6), e.addMany(t(64, 127), 6, 0, 0), e.addMany(t(32, 48), 3, 9, 5), e.addMany(t(32, 48), 5, 9, 5), e.addMany(t(48, 64), 5, 0, 6), e.addMany(t(64, 127), 5, 7, 0), e.addMany(t(32, 48), 4, 9, 5), e.addMany(t(32, 48), 1, 9, 2), e.addMany(t(32, 48), 2, 9, 2), e.addMany(t(48, 127), 2, 10, 0), e.addMany(t(48, 80), 1, 10, 0), e.addMany(t(81, 88), 1, 10, 0), e.addMany([89, 90, 92], 1, 10, 0), e.addMany(t(96, 127), 1, 10, 0), e.add(80, 1, 11, 9), e.addMany(o, 9, 0, 9), e.add(127, 9, 0, 9), e.addMany(t(28, 32), 9, 0, 9), e.addMany(t(32, 48), 9, 9, 12), e.addMany(t(48, 60), 9, 8, 10), e.addMany([60, 61, 62, 63], 9, 9, 10), e.addMany(o, 11, 0, 11), e.addMany(t(32, 128), 11, 0, 11), e.addMany(t(28, 32), 11, 0, 11), e.addMany(o, 10, 0, 10), e.add(127, 10, 0, 10), e.addMany(t(28, 32), 10, 0, 10), e.addMany(t(48, 60), 10, 8, 10), e.addMany([60, 61, 62, 63], 10, 0, 11), e.addMany(t(32, 48), 10, 9, 12), e.addMany(o, 12, 0, 12), e.add(127, 12, 0, 12), e.addMany(t(28, 32), 12, 0, 12), e.addMany(t(32, 48), 12, 9, 12), e.addMany(t(48, 64), 12, 0, 11), e.addMany(t(64, 127), 12, 12, 13), e.addMany(t(64, 127), 10, 12, 13), e.addMany(t(64, 127), 9, 12, 13), e.addMany(o, 13, 13, 13), e.addMany(r, 13, 13, 13), e.add(127, 13, 0, 13), e.addMany([27, 156, 24, 26], 13, 14, 0), e.add(g, 0, 2, 0), e.add(g, 8, 5, 8), e.add(g, 6, 0, 6), e.add(g, 11, 0, 11), e.add(g, 13, 13, 13), e;
      }();
      class u extends c.Disposable {
        constructor(i = s.VT500_TRANSITION_TABLE) {
          super(), this._transitions = i, this._parseStack = { state: 0, handlers: [], handlerPos: 0, transition: 0, chunkPos: 0 }, this.initialState = 0, this.currentState = this.initialState, this._params = new _.Params(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0, this._printHandlerFb = (t, r, o) => {
          }, this._executeHandlerFb = (t) => {
          }, this._csiHandlerFb = (t, r) => {
          }, this._escHandlerFb = (t) => {
          }, this._errorHandlerFb = (t) => t, this._printHandler = this._printHandlerFb, this._executeHandlers = /* @__PURE__ */ Object.create(null), this._csiHandlers = /* @__PURE__ */ Object.create(null), this._escHandlers = /* @__PURE__ */ Object.create(null), this.register((0, c.toDisposable)(() => {
            this._csiHandlers = /* @__PURE__ */ Object.create(null), this._executeHandlers = /* @__PURE__ */ Object.create(null), this._escHandlers = /* @__PURE__ */ Object.create(null);
          })), this._oscParser = this.register(new n.OscParser()), this._dcsParser = this.register(new d.DcsParser()), this._errorHandler = this._errorHandlerFb, this.registerEscHandler({ final: "\\" }, () => !0);
        }
        _identifier(i, t = [64, 126]) {
          let r = 0;
          if (i.prefix) {
            if (i.prefix.length > 1) throw new Error("only one byte as prefix supported");
            if (r = i.prefix.charCodeAt(0), r && 60 > r || r > 63) throw new Error("prefix must be in range 0x3c .. 0x3f");
          }
          if (i.intermediates) {
            if (i.intermediates.length > 2) throw new Error("only two bytes as intermediates are supported");
            for (let l = 0; l < i.intermediates.length; ++l) {
              const f = i.intermediates.charCodeAt(l);
              if (32 > f || f > 47) throw new Error("intermediate must be in range 0x20 .. 0x2f");
              r <<= 8, r |= f;
            }
          }
          if (i.final.length !== 1) throw new Error("final must be a single byte");
          const o = i.final.charCodeAt(0);
          if (t[0] > o || o > t[1]) throw new Error(`final must be in range ${t[0]} .. ${t[1]}`);
          return r <<= 8, r |= o, r;
        }
        identToString(i) {
          const t = [];
          for (; i; ) t.push(String.fromCharCode(255 & i)), i >>= 8;
          return t.reverse().join("");
        }
        setPrintHandler(i) {
          this._printHandler = i;
        }
        clearPrintHandler() {
          this._printHandler = this._printHandlerFb;
        }
        registerEscHandler(i, t) {
          const r = this._identifier(i, [48, 126]);
          this._escHandlers[r] === void 0 && (this._escHandlers[r] = []);
          const o = this._escHandlers[r];
          return o.push(t), { dispose: () => {
            const l = o.indexOf(t);
            l !== -1 && o.splice(l, 1);
          } };
        }
        clearEscHandler(i) {
          this._escHandlers[this._identifier(i, [48, 126])] && delete this._escHandlers[this._identifier(i, [48, 126])];
        }
        setEscHandlerFallback(i) {
          this._escHandlerFb = i;
        }
        setExecuteHandler(i, t) {
          this._executeHandlers[i.charCodeAt(0)] = t;
        }
        clearExecuteHandler(i) {
          this._executeHandlers[i.charCodeAt(0)] && delete this._executeHandlers[i.charCodeAt(0)];
        }
        setExecuteHandlerFallback(i) {
          this._executeHandlerFb = i;
        }
        registerCsiHandler(i, t) {
          const r = this._identifier(i);
          this._csiHandlers[r] === void 0 && (this._csiHandlers[r] = []);
          const o = this._csiHandlers[r];
          return o.push(t), { dispose: () => {
            const l = o.indexOf(t);
            l !== -1 && o.splice(l, 1);
          } };
        }
        clearCsiHandler(i) {
          this._csiHandlers[this._identifier(i)] && delete this._csiHandlers[this._identifier(i)];
        }
        setCsiHandlerFallback(i) {
          this._csiHandlerFb = i;
        }
        registerDcsHandler(i, t) {
          return this._dcsParser.registerHandler(this._identifier(i), t);
        }
        clearDcsHandler(i) {
          this._dcsParser.clearHandler(this._identifier(i));
        }
        setDcsHandlerFallback(i) {
          this._dcsParser.setHandlerFallback(i);
        }
        registerOscHandler(i, t) {
          return this._oscParser.registerHandler(i, t);
        }
        clearOscHandler(i) {
          this._oscParser.clearHandler(i);
        }
        setOscHandlerFallback(i) {
          this._oscParser.setHandlerFallback(i);
        }
        setErrorHandler(i) {
          this._errorHandler = i;
        }
        clearErrorHandler() {
          this._errorHandler = this._errorHandlerFb;
        }
        reset() {
          this.currentState = this.initialState, this._oscParser.reset(), this._dcsParser.reset(), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0, this._parseStack.state !== 0 && (this._parseStack.state = 2, this._parseStack.handlers = []);
        }
        _preserveStack(i, t, r, o, l) {
          this._parseStack.state = i, this._parseStack.handlers = t, this._parseStack.handlerPos = r, this._parseStack.transition = o, this._parseStack.chunkPos = l;
        }
        parse(i, t, r) {
          let o, l = 0, f = 0, m = 0;
          if (this._parseStack.state) if (this._parseStack.state === 2) this._parseStack.state = 0, m = this._parseStack.chunkPos + 1;
          else {
            if (r === void 0 || this._parseStack.state === 1) throw this._parseStack.state = 1, new Error("improper continuation due to previous async handler, giving up parsing");
            const h = this._parseStack.handlers;
            let p = this._parseStack.handlerPos - 1;
            switch (this._parseStack.state) {
              case 3:
                if (r === !1 && p > -1) {
                  for (; p >= 0 && (o = h[p](this._params), o !== !0); p--) if (o instanceof Promise) return this._parseStack.handlerPos = p, o;
                }
                this._parseStack.handlers = [];
                break;
              case 4:
                if (r === !1 && p > -1) {
                  for (; p >= 0 && (o = h[p](), o !== !0); p--) if (o instanceof Promise) return this._parseStack.handlerPos = p, o;
                }
                this._parseStack.handlers = [];
                break;
              case 6:
                if (l = i[this._parseStack.chunkPos], o = this._dcsParser.unhook(l !== 24 && l !== 26, r), o) return o;
                l === 27 && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0;
                break;
              case 5:
                if (l = i[this._parseStack.chunkPos], o = this._oscParser.end(l !== 24 && l !== 26, r), o) return o;
                l === 27 && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0;
            }
            this._parseStack.state = 0, m = this._parseStack.chunkPos + 1, this.precedingCodepoint = 0, this.currentState = 15 & this._parseStack.transition;
          }
          for (let h = m; h < t; ++h) {
            switch (l = i[h], f = this._transitions.table[this.currentState << 8 | (l < 160 ? l : g)], f >> 4) {
              case 2:
                for (let x = h + 1; ; ++x) {
                  if (x >= t || (l = i[x]) < 32 || l > 126 && l < g) {
                    this._printHandler(i, h, x), h = x - 1;
                    break;
                  }
                  if (++x >= t || (l = i[x]) < 32 || l > 126 && l < g) {
                    this._printHandler(i, h, x), h = x - 1;
                    break;
                  }
                  if (++x >= t || (l = i[x]) < 32 || l > 126 && l < g) {
                    this._printHandler(i, h, x), h = x - 1;
                    break;
                  }
                  if (++x >= t || (l = i[x]) < 32 || l > 126 && l < g) {
                    this._printHandler(i, h, x), h = x - 1;
                    break;
                  }
                }
                break;
              case 3:
                this._executeHandlers[l] ? this._executeHandlers[l]() : this._executeHandlerFb(l), this.precedingCodepoint = 0;
                break;
              case 0:
                break;
              case 1:
                if (this._errorHandler({ position: h, code: l, currentState: this.currentState, collect: this._collect, params: this._params, abort: !1 }).abort) return;
                break;
              case 7:
                const p = this._csiHandlers[this._collect << 8 | l];
                let w = p ? p.length - 1 : -1;
                for (; w >= 0 && (o = p[w](this._params), o !== !0); w--) if (o instanceof Promise) return this._preserveStack(3, p, w, f, h), o;
                w < 0 && this._csiHandlerFb(this._collect << 8 | l, this._params), this.precedingCodepoint = 0;
                break;
              case 8:
                do
                  switch (l) {
                    case 59:
                      this._params.addParam(0);
                      break;
                    case 58:
                      this._params.addSubParam(-1);
                      break;
                    default:
                      this._params.addDigit(l - 48);
                  }
                while (++h < t && (l = i[h]) > 47 && l < 60);
                h--;
                break;
              case 9:
                this._collect <<= 8, this._collect |= l;
                break;
              case 10:
                const C = this._escHandlers[this._collect << 8 | l];
                let y = C ? C.length - 1 : -1;
                for (; y >= 0 && (o = C[y](), o !== !0); y--) if (o instanceof Promise) return this._preserveStack(4, C, y, f, h), o;
                y < 0 && this._escHandlerFb(this._collect << 8 | l), this.precedingCodepoint = 0;
                break;
              case 11:
                this._params.reset(), this._params.addParam(0), this._collect = 0;
                break;
              case 12:
                this._dcsParser.hook(this._collect << 8 | l, this._params);
                break;
              case 13:
                for (let x = h + 1; ; ++x) if (x >= t || (l = i[x]) === 24 || l === 26 || l === 27 || l > 127 && l < g) {
                  this._dcsParser.put(i, h, x), h = x - 1;
                  break;
                }
                break;
              case 14:
                if (o = this._dcsParser.unhook(l !== 24 && l !== 26), o) return this._preserveStack(6, [], 0, f, h), o;
                l === 27 && (f |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0;
                break;
              case 4:
                this._oscParser.start();
                break;
              case 5:
                for (let x = h + 1; ; x++) if (x >= t || (l = i[x]) < 32 || l > 127 && l < g) {
                  this._oscParser.put(i, h, x), h = x - 1;
                  break;
                }
                break;
              case 6:
                if (o = this._oscParser.end(l !== 24 && l !== 26), o) return this._preserveStack(5, [], 0, f, h), o;
                l === 27 && (f |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0;
            }
            this.currentState = 15 & f;
          }
        }
      }
      s.EscapeSequenceParser = u;
    }, 6242: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OscHandler = s.OscParser = void 0;
      const c = a(5770), _ = a(482), n = [];
      s.OscParser = class {
        constructor() {
          this._state = 0, this._active = n, this._id = -1, this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
          }, this._stack = { paused: !1, loopPosition: 0, fallThrough: !1 };
        }
        registerHandler(d, v) {
          this._handlers[d] === void 0 && (this._handlers[d] = []);
          const g = this._handlers[d];
          return g.push(v), { dispose: () => {
            const u = g.indexOf(v);
            u !== -1 && g.splice(u, 1);
          } };
        }
        clearHandler(d) {
          this._handlers[d] && delete this._handlers[d];
        }
        setHandlerFallback(d) {
          this._handlerFb = d;
        }
        dispose() {
          this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
          }, this._active = n;
        }
        reset() {
          if (this._state === 2) for (let d = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; d >= 0; --d) this._active[d].end(!1);
          this._stack.paused = !1, this._active = n, this._id = -1, this._state = 0;
        }
        _start() {
          if (this._active = this._handlers[this._id] || n, this._active.length) for (let d = this._active.length - 1; d >= 0; d--) this._active[d].start();
          else this._handlerFb(this._id, "START");
        }
        _put(d, v, g) {
          if (this._active.length) for (let u = this._active.length - 1; u >= 0; u--) this._active[u].put(d, v, g);
          else this._handlerFb(this._id, "PUT", (0, _.utf32ToString)(d, v, g));
        }
        start() {
          this.reset(), this._state = 1;
        }
        put(d, v, g) {
          if (this._state !== 3) {
            if (this._state === 1) for (; v < g; ) {
              const u = d[v++];
              if (u === 59) {
                this._state = 2, this._start();
                break;
              }
              if (u < 48 || 57 < u) return void (this._state = 3);
              this._id === -1 && (this._id = 0), this._id = 10 * this._id + u - 48;
            }
            this._state === 2 && g - v > 0 && this._put(d, v, g);
          }
        }
        end(d, v = !0) {
          if (this._state !== 0) {
            if (this._state !== 3) if (this._state === 1 && this._start(), this._active.length) {
              let g = !1, u = this._active.length - 1, e = !1;
              if (this._stack.paused && (u = this._stack.loopPosition - 1, g = v, e = this._stack.fallThrough, this._stack.paused = !1), !e && g === !1) {
                for (; u >= 0 && (g = this._active[u].end(d), g !== !0); u--) if (g instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = u, this._stack.fallThrough = !1, g;
                u--;
              }
              for (; u >= 0; u--) if (g = this._active[u].end(!1), g instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = u, this._stack.fallThrough = !0, g;
            } else this._handlerFb(this._id, "END", d);
            this._active = n, this._id = -1, this._state = 0;
          }
        }
      }, s.OscHandler = class {
        constructor(d) {
          this._handler = d, this._data = "", this._hitLimit = !1;
        }
        start() {
          this._data = "", this._hitLimit = !1;
        }
        put(d, v, g) {
          this._hitLimit || (this._data += (0, _.utf32ToString)(d, v, g), this._data.length > c.PAYLOAD_LIMIT && (this._data = "", this._hitLimit = !0));
        }
        end(d) {
          let v = !1;
          if (this._hitLimit) v = !1;
          else if (d && (v = this._handler(this._data), v instanceof Promise)) return v.then((g) => (this._data = "", this._hitLimit = !1, g));
          return this._data = "", this._hitLimit = !1, v;
        }
      };
    }, 8742: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Params = void 0;
      const a = 2147483647;
      class c {
        static fromArray(n) {
          const d = new c();
          if (!n.length) return d;
          for (let v = Array.isArray(n[0]) ? 1 : 0; v < n.length; ++v) {
            const g = n[v];
            if (Array.isArray(g)) for (let u = 0; u < g.length; ++u) d.addSubParam(g[u]);
            else d.addParam(g);
          }
          return d;
        }
        constructor(n = 32, d = 32) {
          if (this.maxLength = n, this.maxSubParamsLength = d, d > 256) throw new Error("maxSubParamsLength must not be greater than 256");
          this.params = new Int32Array(n), this.length = 0, this._subParams = new Int32Array(d), this._subParamsLength = 0, this._subParamsIdx = new Uint16Array(n), this._rejectDigits = !1, this._rejectSubDigits = !1, this._digitIsSub = !1;
        }
        clone() {
          const n = new c(this.maxLength, this.maxSubParamsLength);
          return n.params.set(this.params), n.length = this.length, n._subParams.set(this._subParams), n._subParamsLength = this._subParamsLength, n._subParamsIdx.set(this._subParamsIdx), n._rejectDigits = this._rejectDigits, n._rejectSubDigits = this._rejectSubDigits, n._digitIsSub = this._digitIsSub, n;
        }
        toArray() {
          const n = [];
          for (let d = 0; d < this.length; ++d) {
            n.push(this.params[d]);
            const v = this._subParamsIdx[d] >> 8, g = 255 & this._subParamsIdx[d];
            g - v > 0 && n.push(Array.prototype.slice.call(this._subParams, v, g));
          }
          return n;
        }
        reset() {
          this.length = 0, this._subParamsLength = 0, this._rejectDigits = !1, this._rejectSubDigits = !1, this._digitIsSub = !1;
        }
        addParam(n) {
          if (this._digitIsSub = !1, this.length >= this.maxLength) this._rejectDigits = !0;
          else {
            if (n < -1) throw new Error("values lesser than -1 are not allowed");
            this._subParamsIdx[this.length] = this._subParamsLength << 8 | this._subParamsLength, this.params[this.length++] = n > a ? a : n;
          }
        }
        addSubParam(n) {
          if (this._digitIsSub = !0, this.length) if (this._rejectDigits || this._subParamsLength >= this.maxSubParamsLength) this._rejectSubDigits = !0;
          else {
            if (n < -1) throw new Error("values lesser than -1 are not allowed");
            this._subParams[this._subParamsLength++] = n > a ? a : n, this._subParamsIdx[this.length - 1]++;
          }
        }
        hasSubParams(n) {
          return (255 & this._subParamsIdx[n]) - (this._subParamsIdx[n] >> 8) > 0;
        }
        getSubParams(n) {
          const d = this._subParamsIdx[n] >> 8, v = 255 & this._subParamsIdx[n];
          return v - d > 0 ? this._subParams.subarray(d, v) : null;
        }
        getSubParamsAll() {
          const n = {};
          for (let d = 0; d < this.length; ++d) {
            const v = this._subParamsIdx[d] >> 8, g = 255 & this._subParamsIdx[d];
            g - v > 0 && (n[d] = this._subParams.slice(v, g));
          }
          return n;
        }
        addDigit(n) {
          let d;
          if (this._rejectDigits || !(d = this._digitIsSub ? this._subParamsLength : this.length) || this._digitIsSub && this._rejectSubDigits) return;
          const v = this._digitIsSub ? this._subParams : this.params, g = v[d - 1];
          v[d - 1] = ~g ? Math.min(10 * g + n, a) : n;
        }
      }
      s.Params = c;
    }, 5741: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.AddonManager = void 0, s.AddonManager = class {
        constructor() {
          this._addons = [];
        }
        dispose() {
          for (let a = this._addons.length - 1; a >= 0; a--) this._addons[a].instance.dispose();
        }
        loadAddon(a, c) {
          const _ = { instance: c, dispose: c.dispose, isDisposed: !1 };
          this._addons.push(_), c.dispose = () => this._wrappedAddonDispose(_), c.activate(a);
        }
        _wrappedAddonDispose(a) {
          if (a.isDisposed) return;
          let c = -1;
          for (let _ = 0; _ < this._addons.length; _++) if (this._addons[_] === a) {
            c = _;
            break;
          }
          if (c === -1) throw new Error("Could not dispose an addon that has not been loaded");
          a.isDisposed = !0, a.dispose.apply(a.instance), this._addons.splice(c, 1);
        }
      };
    }, 8771: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferApiView = void 0;
      const c = a(3785), _ = a(511);
      s.BufferApiView = class {
        constructor(n, d) {
          this._buffer = n, this.type = d;
        }
        init(n) {
          return this._buffer = n, this;
        }
        get cursorY() {
          return this._buffer.y;
        }
        get cursorX() {
          return this._buffer.x;
        }
        get viewportY() {
          return this._buffer.ydisp;
        }
        get baseY() {
          return this._buffer.ybase;
        }
        get length() {
          return this._buffer.lines.length;
        }
        getLine(n) {
          const d = this._buffer.lines.get(n);
          if (d) return new c.BufferLineApiView(d);
        }
        getNullCell() {
          return new _.CellData();
        }
      };
    }, 3785: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferLineApiView = void 0;
      const c = a(511);
      s.BufferLineApiView = class {
        constructor(_) {
          this._line = _;
        }
        get isWrapped() {
          return this._line.isWrapped;
        }
        get length() {
          return this._line.length;
        }
        getCell(_, n) {
          if (!(_ < 0 || _ >= this._line.length)) return n ? (this._line.loadCell(_, n), n) : this._line.loadCell(_, new c.CellData());
        }
        translateToString(_, n, d) {
          return this._line.translateToString(_, n, d);
        }
      };
    }, 8285: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferNamespaceApi = void 0;
      const c = a(8771), _ = a(8460), n = a(844);
      class d extends n.Disposable {
        constructor(g) {
          super(), this._core = g, this._onBufferChange = this.register(new _.EventEmitter()), this.onBufferChange = this._onBufferChange.event, this._normal = new c.BufferApiView(this._core.buffers.normal, "normal"), this._alternate = new c.BufferApiView(this._core.buffers.alt, "alternate"), this._core.buffers.onBufferActivate(() => this._onBufferChange.fire(this.active));
        }
        get active() {
          if (this._core.buffers.active === this._core.buffers.normal) return this.normal;
          if (this._core.buffers.active === this._core.buffers.alt) return this.alternate;
          throw new Error("Active buffer is neither normal nor alternate");
        }
        get normal() {
          return this._normal.init(this._core.buffers.normal);
        }
        get alternate() {
          return this._alternate.init(this._core.buffers.alt);
        }
      }
      s.BufferNamespaceApi = d;
    }, 7975: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ParserApi = void 0, s.ParserApi = class {
        constructor(a) {
          this._core = a;
        }
        registerCsiHandler(a, c) {
          return this._core.registerCsiHandler(a, (_) => c(_.toArray()));
        }
        addCsiHandler(a, c) {
          return this.registerCsiHandler(a, c);
        }
        registerDcsHandler(a, c) {
          return this._core.registerDcsHandler(a, (_, n) => c(_, n.toArray()));
        }
        addDcsHandler(a, c) {
          return this.registerDcsHandler(a, c);
        }
        registerEscHandler(a, c) {
          return this._core.registerEscHandler(a, c);
        }
        addEscHandler(a, c) {
          return this.registerEscHandler(a, c);
        }
        registerOscHandler(a, c) {
          return this._core.registerOscHandler(a, c);
        }
        addOscHandler(a, c) {
          return this.registerOscHandler(a, c);
        }
      };
    }, 7090: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.UnicodeApi = void 0, s.UnicodeApi = class {
        constructor(a) {
          this._core = a;
        }
        register(a) {
          this._core.unicodeService.register(a);
        }
        get versions() {
          return this._core.unicodeService.versions;
        }
        get activeVersion() {
          return this._core.unicodeService.activeVersion;
        }
        set activeVersion(a) {
          this._core.unicodeService.activeVersion = a;
        }
      };
    }, 744: function(B, s, a) {
      var c = this && this.__decorate || function(e, i, t, r) {
        var o, l = arguments.length, f = l < 3 ? i : r === null ? r = Object.getOwnPropertyDescriptor(i, t) : r;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, r);
        else for (var m = e.length - 1; m >= 0; m--) (o = e[m]) && (f = (l < 3 ? o(f) : l > 3 ? o(i, t, f) : o(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, r) {
          i(t, r, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferService = s.MINIMUM_ROWS = s.MINIMUM_COLS = void 0;
      const n = a(8460), d = a(844), v = a(5295), g = a(2585);
      s.MINIMUM_COLS = 2, s.MINIMUM_ROWS = 1;
      let u = s.BufferService = class extends d.Disposable {
        get buffer() {
          return this.buffers.active;
        }
        constructor(e) {
          super(), this.isUserScrolling = !1, this._onResize = this.register(new n.EventEmitter()), this.onResize = this._onResize.event, this._onScroll = this.register(new n.EventEmitter()), this.onScroll = this._onScroll.event, this.cols = Math.max(e.rawOptions.cols || 0, s.MINIMUM_COLS), this.rows = Math.max(e.rawOptions.rows || 0, s.MINIMUM_ROWS), this.buffers = this.register(new v.BufferSet(e, this));
        }
        resize(e, i) {
          this.cols = e, this.rows = i, this.buffers.resize(e, i), this._onResize.fire({ cols: e, rows: i });
        }
        reset() {
          this.buffers.reset(), this.isUserScrolling = !1;
        }
        scroll(e, i = !1) {
          const t = this.buffer;
          let r;
          r = this._cachedBlankLine, r && r.length === this.cols && r.getFg(0) === e.fg && r.getBg(0) === e.bg || (r = t.getBlankLine(e, i), this._cachedBlankLine = r), r.isWrapped = i;
          const o = t.ybase + t.scrollTop, l = t.ybase + t.scrollBottom;
          if (t.scrollTop === 0) {
            const f = t.lines.isFull;
            l === t.lines.length - 1 ? f ? t.lines.recycle().copyFrom(r) : t.lines.push(r.clone()) : t.lines.splice(l + 1, 0, r.clone()), f ? this.isUserScrolling && (t.ydisp = Math.max(t.ydisp - 1, 0)) : (t.ybase++, this.isUserScrolling || t.ydisp++);
          } else {
            const f = l - o + 1;
            t.lines.shiftElements(o + 1, f - 1, -1), t.lines.set(l, r.clone());
          }
          this.isUserScrolling || (t.ydisp = t.ybase), this._onScroll.fire(t.ydisp);
        }
        scrollLines(e, i, t) {
          const r = this.buffer;
          if (e < 0) {
            if (r.ydisp === 0) return;
            this.isUserScrolling = !0;
          } else e + r.ydisp >= r.ybase && (this.isUserScrolling = !1);
          const o = r.ydisp;
          r.ydisp = Math.max(Math.min(r.ydisp + e, r.ybase), 0), o !== r.ydisp && (i || this._onScroll.fire(r.ydisp));
        }
      };
      s.BufferService = u = c([_(0, g.IOptionsService)], u);
    }, 7994: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CharsetService = void 0, s.CharsetService = class {
        constructor() {
          this.glevel = 0, this._charsets = [];
        }
        reset() {
          this.charset = void 0, this._charsets = [], this.glevel = 0;
        }
        setgLevel(a) {
          this.glevel = a, this.charset = this._charsets[a];
        }
        setgCharset(a, c) {
          this._charsets[a] = c, this.glevel === a && (this.charset = c);
        }
      };
    }, 1753: function(B, s, a) {
      var c = this && this.__decorate || function(r, o, l, f) {
        var m, h = arguments.length, p = h < 3 ? o : f === null ? f = Object.getOwnPropertyDescriptor(o, l) : f;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") p = Reflect.decorate(r, o, l, f);
        else for (var w = r.length - 1; w >= 0; w--) (m = r[w]) && (p = (h < 3 ? m(p) : h > 3 ? m(o, l, p) : m(o, l)) || p);
        return h > 3 && p && Object.defineProperty(o, l, p), p;
      }, _ = this && this.__param || function(r, o) {
        return function(l, f) {
          o(l, f, r);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CoreMouseService = void 0;
      const n = a(2585), d = a(8460), v = a(844), g = { NONE: { events: 0, restrict: () => !1 }, X10: { events: 1, restrict: (r) => r.button !== 4 && r.action === 1 && (r.ctrl = !1, r.alt = !1, r.shift = !1, !0) }, VT200: { events: 19, restrict: (r) => r.action !== 32 }, DRAG: { events: 23, restrict: (r) => r.action !== 32 || r.button !== 3 }, ANY: { events: 31, restrict: (r) => !0 } };
      function u(r, o) {
        let l = (r.ctrl ? 16 : 0) | (r.shift ? 4 : 0) | (r.alt ? 8 : 0);
        return r.button === 4 ? (l |= 64, l |= r.action) : (l |= 3 & r.button, 4 & r.button && (l |= 64), 8 & r.button && (l |= 128), r.action === 32 ? l |= 32 : r.action !== 0 || o || (l |= 3)), l;
      }
      const e = String.fromCharCode, i = { DEFAULT: (r) => {
        const o = [u(r, !1) + 32, r.col + 32, r.row + 32];
        return o[0] > 255 || o[1] > 255 || o[2] > 255 ? "" : `\x1B[M${e(o[0])}${e(o[1])}${e(o[2])}`;
      }, SGR: (r) => {
        const o = r.action === 0 && r.button !== 4 ? "m" : "M";
        return `\x1B[<${u(r, !0)};${r.col};${r.row}${o}`;
      }, SGR_PIXELS: (r) => {
        const o = r.action === 0 && r.button !== 4 ? "m" : "M";
        return `\x1B[<${u(r, !0)};${r.x};${r.y}${o}`;
      } };
      let t = s.CoreMouseService = class extends v.Disposable {
        constructor(r, o) {
          super(), this._bufferService = r, this._coreService = o, this._protocols = {}, this._encodings = {}, this._activeProtocol = "", this._activeEncoding = "", this._lastEvent = null, this._onProtocolChange = this.register(new d.EventEmitter()), this.onProtocolChange = this._onProtocolChange.event;
          for (const l of Object.keys(g)) this.addProtocol(l, g[l]);
          for (const l of Object.keys(i)) this.addEncoding(l, i[l]);
          this.reset();
        }
        addProtocol(r, o) {
          this._protocols[r] = o;
        }
        addEncoding(r, o) {
          this._encodings[r] = o;
        }
        get activeProtocol() {
          return this._activeProtocol;
        }
        get areMouseEventsActive() {
          return this._protocols[this._activeProtocol].events !== 0;
        }
        set activeProtocol(r) {
          if (!this._protocols[r]) throw new Error(`unknown protocol "${r}"`);
          this._activeProtocol = r, this._onProtocolChange.fire(this._protocols[r].events);
        }
        get activeEncoding() {
          return this._activeEncoding;
        }
        set activeEncoding(r) {
          if (!this._encodings[r]) throw new Error(`unknown encoding "${r}"`);
          this._activeEncoding = r;
        }
        reset() {
          this.activeProtocol = "NONE", this.activeEncoding = "DEFAULT", this._lastEvent = null;
        }
        triggerMouseEvent(r) {
          if (r.col < 0 || r.col >= this._bufferService.cols || r.row < 0 || r.row >= this._bufferService.rows || r.button === 4 && r.action === 32 || r.button === 3 && r.action !== 32 || r.button !== 4 && (r.action === 2 || r.action === 3) || (r.col++, r.row++, r.action === 32 && this._lastEvent && this._equalEvents(this._lastEvent, r, this._activeEncoding === "SGR_PIXELS")) || !this._protocols[this._activeProtocol].restrict(r)) return !1;
          const o = this._encodings[this._activeEncoding](r);
          return o && (this._activeEncoding === "DEFAULT" ? this._coreService.triggerBinaryEvent(o) : this._coreService.triggerDataEvent(o, !0)), this._lastEvent = r, !0;
        }
        explainEvents(r) {
          return { down: !!(1 & r), up: !!(2 & r), drag: !!(4 & r), move: !!(8 & r), wheel: !!(16 & r) };
        }
        _equalEvents(r, o, l) {
          if (l) {
            if (r.x !== o.x || r.y !== o.y) return !1;
          } else if (r.col !== o.col || r.row !== o.row) return !1;
          return r.button === o.button && r.action === o.action && r.ctrl === o.ctrl && r.alt === o.alt && r.shift === o.shift;
        }
      };
      s.CoreMouseService = t = c([_(0, n.IBufferService), _(1, n.ICoreService)], t);
    }, 6975: function(B, s, a) {
      var c = this && this.__decorate || function(t, r, o, l) {
        var f, m = arguments.length, h = m < 3 ? r : l === null ? l = Object.getOwnPropertyDescriptor(r, o) : l;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") h = Reflect.decorate(t, r, o, l);
        else for (var p = t.length - 1; p >= 0; p--) (f = t[p]) && (h = (m < 3 ? f(h) : m > 3 ? f(r, o, h) : f(r, o)) || h);
        return m > 3 && h && Object.defineProperty(r, o, h), h;
      }, _ = this && this.__param || function(t, r) {
        return function(o, l) {
          r(o, l, t);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CoreService = void 0;
      const n = a(1439), d = a(8460), v = a(844), g = a(2585), u = Object.freeze({ insertMode: !1 }), e = Object.freeze({ applicationCursorKeys: !1, applicationKeypad: !1, bracketedPasteMode: !1, origin: !1, reverseWraparound: !1, sendFocus: !1, wraparound: !0 });
      let i = s.CoreService = class extends v.Disposable {
        constructor(t, r, o) {
          super(), this._bufferService = t, this._logService = r, this._optionsService = o, this.isCursorInitialized = !1, this.isCursorHidden = !1, this._onData = this.register(new d.EventEmitter()), this.onData = this._onData.event, this._onUserInput = this.register(new d.EventEmitter()), this.onUserInput = this._onUserInput.event, this._onBinary = this.register(new d.EventEmitter()), this.onBinary = this._onBinary.event, this._onRequestScrollToBottom = this.register(new d.EventEmitter()), this.onRequestScrollToBottom = this._onRequestScrollToBottom.event, this.modes = (0, n.clone)(u), this.decPrivateModes = (0, n.clone)(e);
        }
        reset() {
          this.modes = (0, n.clone)(u), this.decPrivateModes = (0, n.clone)(e);
        }
        triggerDataEvent(t, r = !1) {
          if (this._optionsService.rawOptions.disableStdin) return;
          const o = this._bufferService.buffer;
          r && this._optionsService.rawOptions.scrollOnUserInput && o.ybase !== o.ydisp && this._onRequestScrollToBottom.fire(), r && this._onUserInput.fire(), this._logService.debug(`sending data "${t}"`, () => t.split("").map((l) => l.charCodeAt(0))), this._onData.fire(t);
        }
        triggerBinaryEvent(t) {
          this._optionsService.rawOptions.disableStdin || (this._logService.debug(`sending binary "${t}"`, () => t.split("").map((r) => r.charCodeAt(0))), this._onBinary.fire(t));
        }
      };
      s.CoreService = i = c([_(0, g.IBufferService), _(1, g.ILogService), _(2, g.IOptionsService)], i);
    }, 9074: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DecorationService = void 0;
      const c = a(8055), _ = a(8460), n = a(844), d = a(6106);
      let v = 0, g = 0;
      class u extends n.Disposable {
        get decorations() {
          return this._decorations.values();
        }
        constructor() {
          super(), this._decorations = new d.SortedList((t) => t == null ? void 0 : t.marker.line), this._onDecorationRegistered = this.register(new _.EventEmitter()), this.onDecorationRegistered = this._onDecorationRegistered.event, this._onDecorationRemoved = this.register(new _.EventEmitter()), this.onDecorationRemoved = this._onDecorationRemoved.event, this.register((0, n.toDisposable)(() => this.reset()));
        }
        registerDecoration(t) {
          if (t.marker.isDisposed) return;
          const r = new e(t);
          if (r) {
            const o = r.marker.onDispose(() => r.dispose());
            r.onDispose(() => {
              r && (this._decorations.delete(r) && this._onDecorationRemoved.fire(r), o.dispose());
            }), this._decorations.insert(r), this._onDecorationRegistered.fire(r);
          }
          return r;
        }
        reset() {
          for (const t of this._decorations.values()) t.dispose();
          this._decorations.clear();
        }
        *getDecorationsAtCell(t, r, o) {
          var l, f, m;
          let h = 0, p = 0;
          for (const w of this._decorations.getKeyIterator(r)) h = (l = w.options.x) !== null && l !== void 0 ? l : 0, p = h + ((f = w.options.width) !== null && f !== void 0 ? f : 1), t >= h && t < p && (!o || ((m = w.options.layer) !== null && m !== void 0 ? m : "bottom") === o) && (yield w);
        }
        forEachDecorationAtCell(t, r, o, l) {
          this._decorations.forEachByKey(r, (f) => {
            var m, h, p;
            v = (m = f.options.x) !== null && m !== void 0 ? m : 0, g = v + ((h = f.options.width) !== null && h !== void 0 ? h : 1), t >= v && t < g && (!o || ((p = f.options.layer) !== null && p !== void 0 ? p : "bottom") === o) && l(f);
          });
        }
      }
      s.DecorationService = u;
      class e extends n.Disposable {
        get isDisposed() {
          return this._isDisposed;
        }
        get backgroundColorRGB() {
          return this._cachedBg === null && (this.options.backgroundColor ? this._cachedBg = c.css.toColor(this.options.backgroundColor) : this._cachedBg = void 0), this._cachedBg;
        }
        get foregroundColorRGB() {
          return this._cachedFg === null && (this.options.foregroundColor ? this._cachedFg = c.css.toColor(this.options.foregroundColor) : this._cachedFg = void 0), this._cachedFg;
        }
        constructor(t) {
          super(), this.options = t, this.onRenderEmitter = this.register(new _.EventEmitter()), this.onRender = this.onRenderEmitter.event, this._onDispose = this.register(new _.EventEmitter()), this.onDispose = this._onDispose.event, this._cachedBg = null, this._cachedFg = null, this.marker = t.marker, this.options.overviewRulerOptions && !this.options.overviewRulerOptions.position && (this.options.overviewRulerOptions.position = "full");
        }
        dispose() {
          this._onDispose.fire(), super.dispose();
        }
      }
    }, 4348: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.InstantiationService = s.ServiceCollection = void 0;
      const c = a(2585), _ = a(8343);
      class n {
        constructor(...v) {
          this._entries = /* @__PURE__ */ new Map();
          for (const [g, u] of v) this.set(g, u);
        }
        set(v, g) {
          const u = this._entries.get(v);
          return this._entries.set(v, g), u;
        }
        forEach(v) {
          for (const [g, u] of this._entries.entries()) v(g, u);
        }
        has(v) {
          return this._entries.has(v);
        }
        get(v) {
          return this._entries.get(v);
        }
      }
      s.ServiceCollection = n, s.InstantiationService = class {
        constructor() {
          this._services = new n(), this._services.set(c.IInstantiationService, this);
        }
        setService(d, v) {
          this._services.set(d, v);
        }
        getService(d) {
          return this._services.get(d);
        }
        createInstance(d, ...v) {
          const g = (0, _.getServiceDependencies)(d).sort((i, t) => i.index - t.index), u = [];
          for (const i of g) {
            const t = this._services.get(i.id);
            if (!t) throw new Error(`[createInstance] ${d.name} depends on UNKNOWN service ${i.id}.`);
            u.push(t);
          }
          const e = g.length > 0 ? g[0].index : v.length;
          if (v.length !== e) throw new Error(`[createInstance] First service dependency of ${d.name} at position ${e + 1} conflicts with ${v.length} static arguments`);
          return new d(...v, ...u);
        }
      };
    }, 7866: function(B, s, a) {
      var c = this && this.__decorate || function(e, i, t, r) {
        var o, l = arguments.length, f = l < 3 ? i : r === null ? r = Object.getOwnPropertyDescriptor(i, t) : r;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, r);
        else for (var m = e.length - 1; m >= 0; m--) (o = e[m]) && (f = (l < 3 ? o(f) : l > 3 ? o(i, t, f) : o(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, r) {
          i(t, r, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.traceCall = s.setTraceLogger = s.LogService = void 0;
      const n = a(844), d = a(2585), v = { trace: d.LogLevelEnum.TRACE, debug: d.LogLevelEnum.DEBUG, info: d.LogLevelEnum.INFO, warn: d.LogLevelEnum.WARN, error: d.LogLevelEnum.ERROR, off: d.LogLevelEnum.OFF };
      let g, u = s.LogService = class extends n.Disposable {
        get logLevel() {
          return this._logLevel;
        }
        constructor(e) {
          super(), this._optionsService = e, this._logLevel = d.LogLevelEnum.OFF, this._updateLogLevel(), this.register(this._optionsService.onSpecificOptionChange("logLevel", () => this._updateLogLevel())), g = this;
        }
        _updateLogLevel() {
          this._logLevel = v[this._optionsService.rawOptions.logLevel];
        }
        _evalLazyOptionalParams(e) {
          for (let i = 0; i < e.length; i++) typeof e[i] == "function" && (e[i] = e[i]());
        }
        _log(e, i, t) {
          this._evalLazyOptionalParams(t), e.call(console, (this._optionsService.options.logger ? "" : "xterm.js: ") + i, ...t);
        }
        trace(e, ...i) {
          var t, r;
          this._logLevel <= d.LogLevelEnum.TRACE && this._log((r = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.trace.bind(this._optionsService.options.logger)) !== null && r !== void 0 ? r : console.log, e, i);
        }
        debug(e, ...i) {
          var t, r;
          this._logLevel <= d.LogLevelEnum.DEBUG && this._log((r = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.debug.bind(this._optionsService.options.logger)) !== null && r !== void 0 ? r : console.log, e, i);
        }
        info(e, ...i) {
          var t, r;
          this._logLevel <= d.LogLevelEnum.INFO && this._log((r = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.info.bind(this._optionsService.options.logger)) !== null && r !== void 0 ? r : console.info, e, i);
        }
        warn(e, ...i) {
          var t, r;
          this._logLevel <= d.LogLevelEnum.WARN && this._log((r = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.warn.bind(this._optionsService.options.logger)) !== null && r !== void 0 ? r : console.warn, e, i);
        }
        error(e, ...i) {
          var t, r;
          this._logLevel <= d.LogLevelEnum.ERROR && this._log((r = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.error.bind(this._optionsService.options.logger)) !== null && r !== void 0 ? r : console.error, e, i);
        }
      };
      s.LogService = u = c([_(0, d.IOptionsService)], u), s.setTraceLogger = function(e) {
        g = e;
      }, s.traceCall = function(e, i, t) {
        if (typeof t.value != "function") throw new Error("not supported");
        const r = t.value;
        t.value = function(...o) {
          if (g.logLevel !== d.LogLevelEnum.TRACE) return r.apply(this, o);
          g.trace(`GlyphRenderer#${r.name}(${o.map((f) => JSON.stringify(f)).join(", ")})`);
          const l = r.apply(this, o);
          return g.trace(`GlyphRenderer#${r.name} return`, l), l;
        };
      };
    }, 7302: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OptionsService = s.DEFAULT_OPTIONS = void 0;
      const c = a(8460), _ = a(844), n = a(6114);
      s.DEFAULT_OPTIONS = { cols: 80, rows: 24, cursorBlink: !1, cursorStyle: "block", cursorWidth: 1, cursorInactiveStyle: "outline", customGlyphs: !0, drawBoldTextInBrightColors: !0, fastScrollModifier: "alt", fastScrollSensitivity: 5, fontFamily: "courier-new, courier, monospace", fontSize: 15, fontWeight: "normal", fontWeightBold: "bold", ignoreBracketedPasteMode: !1, lineHeight: 1, letterSpacing: 0, linkHandler: null, logLevel: "info", logger: null, scrollback: 1e3, scrollOnUserInput: !0, scrollSensitivity: 1, screenReaderMode: !1, smoothScrollDuration: 0, macOptionIsMeta: !1, macOptionClickForcesSelection: !1, minimumContrastRatio: 1, disableStdin: !1, allowProposedApi: !1, allowTransparency: !1, tabStopWidth: 8, theme: {}, rightClickSelectsWord: n.isMac, windowOptions: {}, windowsMode: !1, windowsPty: {}, wordSeparator: " ()[]{}',\"`", altClickMovesCursor: !0, convertEol: !1, termName: "xterm", cancelEvents: !1, overviewRulerWidth: 0 };
      const d = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
      class v extends _.Disposable {
        constructor(u) {
          super(), this._onOptionChange = this.register(new c.EventEmitter()), this.onOptionChange = this._onOptionChange.event;
          const e = Object.assign({}, s.DEFAULT_OPTIONS);
          for (const i in u) if (i in e) try {
            const t = u[i];
            e[i] = this._sanitizeAndValidateOption(i, t);
          } catch (t) {
            console.error(t);
          }
          this.rawOptions = e, this.options = Object.assign({}, e), this._setupOptions();
        }
        onSpecificOptionChange(u, e) {
          return this.onOptionChange((i) => {
            i === u && e(this.rawOptions[u]);
          });
        }
        onMultipleOptionChange(u, e) {
          return this.onOptionChange((i) => {
            u.indexOf(i) !== -1 && e();
          });
        }
        _setupOptions() {
          const u = (i) => {
            if (!(i in s.DEFAULT_OPTIONS)) throw new Error(`No option with key "${i}"`);
            return this.rawOptions[i];
          }, e = (i, t) => {
            if (!(i in s.DEFAULT_OPTIONS)) throw new Error(`No option with key "${i}"`);
            t = this._sanitizeAndValidateOption(i, t), this.rawOptions[i] !== t && (this.rawOptions[i] = t, this._onOptionChange.fire(i));
          };
          for (const i in this.rawOptions) {
            const t = { get: u.bind(this, i), set: e.bind(this, i) };
            Object.defineProperty(this.options, i, t);
          }
        }
        _sanitizeAndValidateOption(u, e) {
          switch (u) {
            case "cursorStyle":
              if (e || (e = s.DEFAULT_OPTIONS[u]), !/* @__PURE__ */ function(i) {
                return i === "block" || i === "underline" || i === "bar";
              }(e)) throw new Error(`"${e}" is not a valid value for ${u}`);
              break;
            case "wordSeparator":
              e || (e = s.DEFAULT_OPTIONS[u]);
              break;
            case "fontWeight":
            case "fontWeightBold":
              if (typeof e == "number" && 1 <= e && e <= 1e3) break;
              e = d.includes(e) ? e : s.DEFAULT_OPTIONS[u];
              break;
            case "cursorWidth":
              e = Math.floor(e);
            case "lineHeight":
            case "tabStopWidth":
              if (e < 1) throw new Error(`${u} cannot be less than 1, value: ${e}`);
              break;
            case "minimumContrastRatio":
              e = Math.max(1, Math.min(21, Math.round(10 * e) / 10));
              break;
            case "scrollback":
              if ((e = Math.min(e, 4294967295)) < 0) throw new Error(`${u} cannot be less than 0, value: ${e}`);
              break;
            case "fastScrollSensitivity":
            case "scrollSensitivity":
              if (e <= 0) throw new Error(`${u} cannot be less than or equal to 0, value: ${e}`);
              break;
            case "rows":
            case "cols":
              if (!e && e !== 0) throw new Error(`${u} must be numeric, value: ${e}`);
              break;
            case "windowsPty":
              e = e ?? {};
          }
          return e;
        }
      }
      s.OptionsService = v;
    }, 2660: function(B, s, a) {
      var c = this && this.__decorate || function(v, g, u, e) {
        var i, t = arguments.length, r = t < 3 ? g : e === null ? e = Object.getOwnPropertyDescriptor(g, u) : e;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(v, g, u, e);
        else for (var o = v.length - 1; o >= 0; o--) (i = v[o]) && (r = (t < 3 ? i(r) : t > 3 ? i(g, u, r) : i(g, u)) || r);
        return t > 3 && r && Object.defineProperty(g, u, r), r;
      }, _ = this && this.__param || function(v, g) {
        return function(u, e) {
          g(u, e, v);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OscLinkService = void 0;
      const n = a(2585);
      let d = s.OscLinkService = class {
        constructor(v) {
          this._bufferService = v, this._nextId = 1, this._entriesWithId = /* @__PURE__ */ new Map(), this._dataByLinkId = /* @__PURE__ */ new Map();
        }
        registerLink(v) {
          const g = this._bufferService.buffer;
          if (v.id === void 0) {
            const o = g.addMarker(g.ybase + g.y), l = { data: v, id: this._nextId++, lines: [o] };
            return o.onDispose(() => this._removeMarkerFromLink(l, o)), this._dataByLinkId.set(l.id, l), l.id;
          }
          const u = v, e = this._getEntryIdKey(u), i = this._entriesWithId.get(e);
          if (i) return this.addLineToLink(i.id, g.ybase + g.y), i.id;
          const t = g.addMarker(g.ybase + g.y), r = { id: this._nextId++, key: this._getEntryIdKey(u), data: u, lines: [t] };
          return t.onDispose(() => this._removeMarkerFromLink(r, t)), this._entriesWithId.set(r.key, r), this._dataByLinkId.set(r.id, r), r.id;
        }
        addLineToLink(v, g) {
          const u = this._dataByLinkId.get(v);
          if (u && u.lines.every((e) => e.line !== g)) {
            const e = this._bufferService.buffer.addMarker(g);
            u.lines.push(e), e.onDispose(() => this._removeMarkerFromLink(u, e));
          }
        }
        getLinkData(v) {
          var g;
          return (g = this._dataByLinkId.get(v)) === null || g === void 0 ? void 0 : g.data;
        }
        _getEntryIdKey(v) {
          return `${v.id};;${v.uri}`;
        }
        _removeMarkerFromLink(v, g) {
          const u = v.lines.indexOf(g);
          u !== -1 && (v.lines.splice(u, 1), v.lines.length === 0 && (v.data.id !== void 0 && this._entriesWithId.delete(v.key), this._dataByLinkId.delete(v.id)));
        }
      };
      s.OscLinkService = d = c([_(0, n.IBufferService)], d);
    }, 8343: (B, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.createDecorator = s.getServiceDependencies = s.serviceRegistry = void 0;
      const a = "di$target", c = "di$dependencies";
      s.serviceRegistry = /* @__PURE__ */ new Map(), s.getServiceDependencies = function(_) {
        return _[c] || [];
      }, s.createDecorator = function(_) {
        if (s.serviceRegistry.has(_)) return s.serviceRegistry.get(_);
        const n = function(d, v, g) {
          if (arguments.length !== 3) throw new Error("@IServiceName-decorator can only be used to decorate a parameter");
          (function(u, e, i) {
            e[a] === e ? e[c].push({ id: u, index: i }) : (e[c] = [{ id: u, index: i }], e[a] = e);
          })(n, d, g);
        };
        return n.toString = () => _, s.serviceRegistry.set(_, n), n;
      };
    }, 2585: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.IDecorationService = s.IUnicodeService = s.IOscLinkService = s.IOptionsService = s.ILogService = s.LogLevelEnum = s.IInstantiationService = s.ICharsetService = s.ICoreService = s.ICoreMouseService = s.IBufferService = void 0;
      const c = a(8343);
      var _;
      s.IBufferService = (0, c.createDecorator)("BufferService"), s.ICoreMouseService = (0, c.createDecorator)("CoreMouseService"), s.ICoreService = (0, c.createDecorator)("CoreService"), s.ICharsetService = (0, c.createDecorator)("CharsetService"), s.IInstantiationService = (0, c.createDecorator)("InstantiationService"), function(n) {
        n[n.TRACE = 0] = "TRACE", n[n.DEBUG = 1] = "DEBUG", n[n.INFO = 2] = "INFO", n[n.WARN = 3] = "WARN", n[n.ERROR = 4] = "ERROR", n[n.OFF = 5] = "OFF";
      }(_ || (s.LogLevelEnum = _ = {})), s.ILogService = (0, c.createDecorator)("LogService"), s.IOptionsService = (0, c.createDecorator)("OptionsService"), s.IOscLinkService = (0, c.createDecorator)("OscLinkService"), s.IUnicodeService = (0, c.createDecorator)("UnicodeService"), s.IDecorationService = (0, c.createDecorator)("DecorationService");
    }, 1480: (B, s, a) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.UnicodeService = void 0;
      const c = a(8460), _ = a(225);
      s.UnicodeService = class {
        constructor() {
          this._providers = /* @__PURE__ */ Object.create(null), this._active = "", this._onChange = new c.EventEmitter(), this.onChange = this._onChange.event;
          const n = new _.UnicodeV6();
          this.register(n), this._active = n.version, this._activeProvider = n;
        }
        dispose() {
          this._onChange.dispose();
        }
        get versions() {
          return Object.keys(this._providers);
        }
        get activeVersion() {
          return this._active;
        }
        set activeVersion(n) {
          if (!this._providers[n]) throw new Error(`unknown Unicode version "${n}"`);
          this._active = n, this._activeProvider = this._providers[n], this._onChange.fire(n);
        }
        register(n) {
          this._providers[n.version] = n;
        }
        wcwidth(n) {
          return this._activeProvider.wcwidth(n);
        }
        getStringCellWidth(n) {
          let d = 0;
          const v = n.length;
          for (let g = 0; g < v; ++g) {
            let u = n.charCodeAt(g);
            if (55296 <= u && u <= 56319) {
              if (++g >= v) return d + this.wcwidth(u);
              const e = n.charCodeAt(g);
              56320 <= e && e <= 57343 ? u = 1024 * (u - 55296) + e - 56320 + 65536 : d += this.wcwidth(e);
            }
            d += this.wcwidth(u);
          }
          return d;
        }
      };
    } }, z = {};
    function U(B) {
      var s = z[B];
      if (s !== void 0) return s.exports;
      var a = z[B] = { exports: {} };
      return N[B].call(a.exports, a, a.exports, U), a.exports;
    }
    var V = {};
    return (() => {
      var B = V;
      Object.defineProperty(B, "__esModule", { value: !0 }), B.Terminal = void 0;
      const s = U(9042), a = U(3236), c = U(844), _ = U(5741), n = U(8285), d = U(7975), v = U(7090), g = ["cols", "rows"];
      class u extends c.Disposable {
        constructor(i) {
          super(), this._core = this.register(new a.Terminal(i)), this._addonManager = this.register(new _.AddonManager()), this._publicOptions = Object.assign({}, this._core.options);
          const t = (o) => this._core.options[o], r = (o, l) => {
            this._checkReadonlyOptions(o), this._core.options[o] = l;
          };
          for (const o in this._core.options) {
            const l = { get: t.bind(this, o), set: r.bind(this, o) };
            Object.defineProperty(this._publicOptions, o, l);
          }
        }
        _checkReadonlyOptions(i) {
          if (g.includes(i)) throw new Error(`Option "${i}" can only be set in the constructor`);
        }
        _checkProposedApi() {
          if (!this._core.optionsService.rawOptions.allowProposedApi) throw new Error("You must set the allowProposedApi option to true to use proposed API");
        }
        get onBell() {
          return this._core.onBell;
        }
        get onBinary() {
          return this._core.onBinary;
        }
        get onCursorMove() {
          return this._core.onCursorMove;
        }
        get onData() {
          return this._core.onData;
        }
        get onKey() {
          return this._core.onKey;
        }
        get onLineFeed() {
          return this._core.onLineFeed;
        }
        get onRender() {
          return this._core.onRender;
        }
        get onResize() {
          return this._core.onResize;
        }
        get onScroll() {
          return this._core.onScroll;
        }
        get onSelectionChange() {
          return this._core.onSelectionChange;
        }
        get onTitleChange() {
          return this._core.onTitleChange;
        }
        get onWriteParsed() {
          return this._core.onWriteParsed;
        }
        get element() {
          return this._core.element;
        }
        get parser() {
          return this._parser || (this._parser = new d.ParserApi(this._core)), this._parser;
        }
        get unicode() {
          return this._checkProposedApi(), new v.UnicodeApi(this._core);
        }
        get textarea() {
          return this._core.textarea;
        }
        get rows() {
          return this._core.rows;
        }
        get cols() {
          return this._core.cols;
        }
        get buffer() {
          return this._buffer || (this._buffer = this.register(new n.BufferNamespaceApi(this._core))), this._buffer;
        }
        get markers() {
          return this._checkProposedApi(), this._core.markers;
        }
        get modes() {
          const i = this._core.coreService.decPrivateModes;
          let t = "none";
          switch (this._core.coreMouseService.activeProtocol) {
            case "X10":
              t = "x10";
              break;
            case "VT200":
              t = "vt200";
              break;
            case "DRAG":
              t = "drag";
              break;
            case "ANY":
              t = "any";
          }
          return { applicationCursorKeysMode: i.applicationCursorKeys, applicationKeypadMode: i.applicationKeypad, bracketedPasteMode: i.bracketedPasteMode, insertMode: this._core.coreService.modes.insertMode, mouseTrackingMode: t, originMode: i.origin, reverseWraparoundMode: i.reverseWraparound, sendFocusMode: i.sendFocus, wraparoundMode: i.wraparound };
        }
        get options() {
          return this._publicOptions;
        }
        set options(i) {
          for (const t in i) this._publicOptions[t] = i[t];
        }
        blur() {
          this._core.blur();
        }
        focus() {
          this._core.focus();
        }
        resize(i, t) {
          this._verifyIntegers(i, t), this._core.resize(i, t);
        }
        open(i) {
          this._core.open(i);
        }
        attachCustomKeyEventHandler(i) {
          this._core.attachCustomKeyEventHandler(i);
        }
        registerLinkProvider(i) {
          return this._core.registerLinkProvider(i);
        }
        registerCharacterJoiner(i) {
          return this._checkProposedApi(), this._core.registerCharacterJoiner(i);
        }
        deregisterCharacterJoiner(i) {
          this._checkProposedApi(), this._core.deregisterCharacterJoiner(i);
        }
        registerMarker(i = 0) {
          return this._verifyIntegers(i), this._core.registerMarker(i);
        }
        registerDecoration(i) {
          var t, r, o;
          return this._checkProposedApi(), this._verifyPositiveIntegers((t = i.x) !== null && t !== void 0 ? t : 0, (r = i.width) !== null && r !== void 0 ? r : 0, (o = i.height) !== null && o !== void 0 ? o : 0), this._core.registerDecoration(i);
        }
        hasSelection() {
          return this._core.hasSelection();
        }
        select(i, t, r) {
          this._verifyIntegers(i, t, r), this._core.select(i, t, r);
        }
        getSelection() {
          return this._core.getSelection();
        }
        getSelectionPosition() {
          return this._core.getSelectionPosition();
        }
        clearSelection() {
          this._core.clearSelection();
        }
        selectAll() {
          this._core.selectAll();
        }
        selectLines(i, t) {
          this._verifyIntegers(i, t), this._core.selectLines(i, t);
        }
        dispose() {
          super.dispose();
        }
        scrollLines(i) {
          this._verifyIntegers(i), this._core.scrollLines(i);
        }
        scrollPages(i) {
          this._verifyIntegers(i), this._core.scrollPages(i);
        }
        scrollToTop() {
          this._core.scrollToTop();
        }
        scrollToBottom() {
          this._core.scrollToBottom();
        }
        scrollToLine(i) {
          this._verifyIntegers(i), this._core.scrollToLine(i);
        }
        clear() {
          this._core.clear();
        }
        write(i, t) {
          this._core.write(i, t);
        }
        writeln(i, t) {
          this._core.write(i), this._core.write(`\r
`, t);
        }
        paste(i) {
          this._core.paste(i);
        }
        refresh(i, t) {
          this._verifyIntegers(i, t), this._core.refresh(i, t);
        }
        reset() {
          this._core.reset();
        }
        clearTextureAtlas() {
          this._core.clearTextureAtlas();
        }
        loadAddon(i) {
          this._addonManager.loadAddon(this, i);
        }
        static get strings() {
          return s;
        }
        _verifyIntegers(...i) {
          for (const t of i) if (t === 1 / 0 || isNaN(t) || t % 1 != 0) throw new Error("This API only accepts integers");
        }
        _verifyPositiveIntegers(...i) {
          for (const t of i) if (t && (t === 1 / 0 || isNaN(t) || t % 1 != 0 || t < 0)) throw new Error("This API only accepts positive integers");
        }
      }
      B.Terminal = u;
    })(), V;
  })());
})(Ae);
var ze = Ae.exports, Te = { exports: {} };
(function(D, F) {
  (function(N, z) {
    D.exports = z();
  })(self, () => (() => {
    var N = {};
    return (() => {
      var z = N;
      Object.defineProperty(z, "__esModule", { value: !0 }), z.FitAddon = void 0, z.FitAddon = class {
        activate(U) {
          this._terminal = U;
        }
        dispose() {
        }
        fit() {
          const U = this.proposeDimensions();
          if (!U || !this._terminal || isNaN(U.cols) || isNaN(U.rows)) return;
          const V = this._terminal._core;
          this._terminal.rows === U.rows && this._terminal.cols === U.cols || (V._renderService.clear(), this._terminal.resize(U.cols, U.rows));
        }
        proposeDimensions() {
          if (!this._terminal || !this._terminal.element || !this._terminal.element.parentElement) return;
          const U = this._terminal._core, V = U._renderService.dimensions;
          if (V.css.cell.width === 0 || V.css.cell.height === 0) return;
          const B = this._terminal.options.scrollback === 0 ? 0 : U.viewport.scrollBarWidth, s = window.getComputedStyle(this._terminal.element.parentElement), a = parseInt(s.getPropertyValue("height")), c = Math.max(0, parseInt(s.getPropertyValue("width"))), _ = window.getComputedStyle(this._terminal.element), n = a - (parseInt(_.getPropertyValue("padding-top")) + parseInt(_.getPropertyValue("padding-bottom"))), d = c - (parseInt(_.getPropertyValue("padding-right")) + parseInt(_.getPropertyValue("padding-left"))) - B;
          return { cols: Math.max(2, Math.floor(d / V.css.cell.width)), rows: Math.max(1, Math.floor(n / V.css.cell.height)) };
        }
      };
    })(), N;
  })());
})(Te);
var $e = Te.exports;
const Ke = `/**
 * Copyright (c) 2014 The xterm.js authors. All rights reserved.
 * Copyright (c) 2012-2013, Christopher Jeffrey (MIT License)
 * https://github.com/chjj/term.js
 * @license MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Originally forked from (with the author's permission):
 *   Fabrice Bellard's javascript vt100 for jslinux:
 *   http://bellard.org/jslinux/
 *   Copyright (c) 2011 Fabrice Bellard
 *   The original design remains. The terminal itself
 *   has been extended to include xterm CSI codes, among
 *   other features.
 */.xterm{cursor:text;position:relative;user-select:none;-ms-user-select:none;-webkit-user-select:none}.xterm.focus,.xterm:focus{outline:none}.xterm .xterm-helpers{position:absolute;top:0;z-index:5}.xterm .xterm-helper-textarea{padding:0;border:0;margin:0;position:absolute;opacity:0;left:-9999em;top:0;width:0;height:0;z-index:-5;white-space:nowrap;overflow:hidden;resize:none}.xterm .composition-view{background:#000;color:#fff;display:none;position:absolute;white-space:nowrap;z-index:1}.xterm .composition-view.active{display:block}.xterm .xterm-viewport{background-color:#000;overflow-y:scroll;cursor:default;position:absolute;right:0;left:0;top:0;bottom:0}.xterm .xterm-screen{position:relative}.xterm .xterm-screen canvas{position:absolute;left:0;top:0}.xterm .xterm-scroll-area{visibility:hidden}.xterm-char-measure-element{display:inline-block;visibility:hidden;position:absolute;top:0;left:-9999em;line-height:normal}.xterm.enable-mouse-events{cursor:default}.xterm.xterm-cursor-pointer,.xterm .xterm-cursor-pointer{cursor:pointer}.xterm.column-select.focus{cursor:crosshair}.xterm .xterm-accessibility,.xterm .xterm-message{position:absolute;left:0;top:0;bottom:0;right:0;z-index:10;color:transparent;pointer-events:none}.xterm .live-region{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.xterm-dim{opacity:1!important}.xterm-underline-1{text-decoration:underline}.xterm-underline-2{text-decoration:double underline}.xterm-underline-3{text-decoration:wavy underline}.xterm-underline-4{text-decoration:dotted underline}.xterm-underline-5{text-decoration:dashed underline}.xterm-overline{text-decoration:overline}.xterm-overline.xterm-underline-1{text-decoration:overline underline}.xterm-overline.xterm-underline-2{text-decoration:overline double underline}.xterm-overline.xterm-underline-3{text-decoration:overline wavy underline}.xterm-overline.xterm-underline-4{text-decoration:overline dotted underline}.xterm-overline.xterm-underline-5{text-decoration:overline dashed underline}.xterm-strikethrough{text-decoration:line-through}.xterm-screen .xterm-decoration-container .xterm-decoration{z-index:6;position:absolute}.xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer{z-index:7}.xterm-decoration-overview-ruler{z-index:8;position:absolute;top:0;right:0;pointer-events:none}.xterm-decoration-top{z-index:2;position:relative}`, qe = '.hv-app-host{position:relative;height:100%}.hv-root{position:relative;display:flex;height:100%;min-height:480px;background:var(--bg, #0b0e14);color:var(--text, #d7dae0);font-family:var(--font-body, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif)}.hv-sidebar{width:260px;flex:0 0 260px;border-right:1px solid var(--border, #1b2130);padding:16px;overflow-y:auto;background:var(--card, #0e1219)}.hv-brand{font-size:16px;font-weight:700;letter-spacing:.02em;margin-bottom:16px;color:var(--text-strong, #e8ecf4)}.hv-section-title{display:flex;align-items:center;gap:4px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted, #6b7488);margin:18px 0 8px;cursor:pointer;-webkit-user-select:none;user-select:none}.hv-section-title:hover{color:var(--text, #d7dae0)}.hv-chevron{flex:none;transform:rotate(90deg);transition:transform .12s ease;opacity:.7}.hv-section-title.hv-collapsed .hv-chevron{transform:rotate(0)}.hv-prov-list{display:flex;flex-direction:column;gap:4px}.hv-prov{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--text, #b6bdcc);border:1px solid transparent;transition:background .12s ease}.hv-prov-ico{width:15px;height:15px;flex:0 0 15px;color:var(--muted-strong, #9aa3b5)}.hv-prov.hv-active .hv-prov-ico{color:var(--text-strong, #fff)}.hv-prov:hover{background:var(--bg-hover, #161b26)}.hv-prov.hv-active{background:var(--bg-accent, #212a3b);color:var(--text-strong, #fff);border-color:var(--border-strong, #35405a)}.hv-na{color:var(--muted-strong, #6b7488);font-size:11px}.hv-disc{display:flex;flex-direction:column;gap:4px}.hv-disc-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--text, #c3cad9);background:var(--bg-elevated, #141926);border:1px solid var(--border, #1d2333);transition:background .12s ease}.hv-disc-item:hover{background:var(--bg-hover, #1c2436)}.hv-disc-dot{width:8px;height:8px;border-radius:50%;background:var(--ok, #34d399);flex:0 0 8px}.hv-disc-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hv-disc-prov{display:inline-flex;align-items:center;gap:4px;font-size:10px;color:var(--muted, #6b7488);text-transform:uppercase;letter-spacing:.04em}.hv-disc-ico{width:11px;height:11px;flex:0 0 11px;color:var(--muted-strong, #9aa3b5)}.hv-main{flex:1;display:flex;flex-direction:column;min-width:0;min-height:0}.hv-form{display:flex;gap:10px;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid var(--border, #1b2130);background:var(--card, #0e1219)}.hv-form-row{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.hv-inp{background:var(--bg-elevated, #141926);border:1px solid var(--border, #232c40);color:var(--text-strong, #e8ecf4);border-radius:6px;padding:8px 10px;font-size:13px;font-family:inherit;outline:none;flex:1}.hv-inp::placeholder{color:var(--muted, #6b7488)}.hv-inp:focus{border-color:var(--accent, #3b82f6)}.hv-inp.hv-wide{flex:1;min-width:260px}.hv-btn{background:var(--accent, #2563eb);color:var(--accent-fg, #fff);border:none;border-radius:6px;padding:8px 16px;font-size:13px;font-family:inherit;font-weight:600;cursor:pointer;white-space:nowrap}.hv-btn:hover:not(:disabled){background:var(--accent-hover, #2563eb)}.hv-btn:disabled{opacity:.5;cursor:default}.hv-panes{flex:1;min-height:0;display:flex;overflow:hidden;background:var(--bg, #0f1117)}.hv-pane{display:flex;flex:1;flex-direction:column;min-width:0;min-height:0;background:var(--card, #0f1117);overflow:hidden}.hv-pane-top{display:flex;align-items:center;gap:10px;padding:6px 10px;background:var(--bg-elevated, #141a26);border-bottom:1px solid var(--border, #1d2435);font-size:12px;color:var(--muted, #9aa3b5)}.hv-pane-title{display:inline-flex;align-items:center;gap:6px;min-width:0;font-family:var(--mono, Menlo, Consolas, monospace);color:var(--text-strong, #e8ecf4)}.hv-pane-ico{width:14px;height:14px;flex:0 0 14px;color:var(--muted-strong, #9aa3b5)}.hv-pane-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hv-pane-prov{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted, #6b7488);flex:0 0 auto}.hv-pane-cmd{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--mono, Menlo, Consolas, monospace);color:var(--muted, #6b7488)}.hv-pane-actions{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto}.hv-btn-sm{background:transparent;border:1px solid var(--border-strong, #2a3450);color:var(--muted, #9aa3b5);border-radius:4px;font-size:11px;font-family:inherit;padding:2px 8px;cursor:pointer}.hv-btn-sm:hover{color:var(--text-strong, #fff);border-color:var(--accent, #3b82f6)}.hv-danger:hover{color:var(--danger, #f87171);border-color:var(--danger, #f87171)}.hv-x{background:transparent;border:none;color:var(--muted, #9aa3b5);border-radius:4px;font-size:12px;line-height:1;font-family:inherit;padding:3px 5px;cursor:pointer}.hv-x:hover{color:var(--text-strong, #fff);background:var(--bg-hover, #1c2436)}.hv-term{flex:1;min-height:0;padding:4px 6px;background:var(--bg, #0f1117)}.hv-term .xterm{height:100%}.hv-ended{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:24px;text-align:center;color:var(--muted, #6b7488);font-size:13px}.hv-ended-title{color:var(--text-strong, #e8ecf4);font-size:14px;font-weight:600}.hv-ended-note{max-width:620px}.hv-mono{font-family:var(--mono, Menlo, Consolas, monospace);color:var(--text, #c3cad9)}.hv-ended-actions{display:flex;gap:8px;margin-top:4px}.hv-btn-ghost{background:transparent;border:1px solid var(--border-strong, #2a3450);color:var(--text, #c3cad9)}.hv-btn-ghost:hover:not(:disabled){background:var(--bg-hover, #1c2436)}.hv-welcome{flex:1;display:flex;align-items:center;justify-content:center;color:var(--muted, #6b7488);font-size:13px;padding:40px;text-align:center}.hv-empty{color:var(--muted, #6b7488);font-size:13px;padding:8px}.hv-empty.sm{font-size:12px;padding:4px 0}.hv-pset{display:flex;flex-direction:column;gap:2px}.hv-sess{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--text, #c3cad9);border:1px solid transparent;border-left:2px solid transparent;transition:background .12s ease}.hv-sess:hover{background:var(--bg-hover, #1c2436)}.hv-sess.hv-active{background:var(--bg-accent, #212a3b);color:var(--text-strong, #fff);border-left-color:var(--accent, #3b82f6)}.hv-sess-ico{width:13px;height:13px;flex:0 0 13px;color:var(--muted-strong, #9aa3b5)}.hv-sess.hv-active .hv-sess-ico{color:var(--accent, #3b82f6)}.hv-sess-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hv-sess-prov{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted, #6b7488)}.hv-sess-ended{opacity:.6}.hv-sess-ended .hv-sess-ico{color:var(--danger, #f87171)}.hv-count{margin-left:6px;padding:0 5px;border-radius:8px;background:var(--bg-elevated, #141926);color:var(--muted-strong, #6b7488);font-size:10px;letter-spacing:0}.hv-prov-na{opacity:.55}.hv-disc-open{border-color:var(--accent, #3b82f6)}.hv-disc-open .hv-disc-dot{background:var(--accent, #3b82f6)}.hv-warn{flex-basis:100%;color:var(--warn, #b58900);font-size:12px;padding:2px 0}.hv-link{background:none;border:none;padding:0;font:inherit;color:var(--accent, #3b82f6);text-decoration:underline;cursor:pointer}.hv-hint-icon{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:none;background:transparent;color:var(--muted, #6b7488);cursor:default;border-radius:50%;transition:color .15s,background .15s}.hv-hint-icon:hover,.hv-hint-icon:focus-visible{color:var(--fg, #c9d1e0);background:var(--hover-bg, rgba(255,255,255,.07));outline:none}.hv-toasts{position:fixed;right:16px;bottom:16px;z-index:1000;display:flex;flex-direction:column;gap:8px;max-width:min(420px,calc(100vw - 32px));pointer-events:none}.hv-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:8px;border:1px solid var(--border, rgba(255,255,255,.12));background:var(--panel, #161b22);color:var(--fg, #c9d1e0);font-size:12px;line-height:1.4;box-shadow:0 6px 24px #00000059}.hv-toast-error{border-color:var(--danger, #f87171);border-left-width:3px}.hv-toast-msg{flex:1 1 auto;min-width:0;overflow-wrap:anywhere}.hv-toast-close{flex:0 0 auto;padding:0;border:none;background:transparent;color:var(--muted, #6b7488);cursor:pointer;font-size:13px;line-height:1}.hv-toast-close:hover,.hv-toast-close:focus-visible{color:var(--fg, #c9d1e0);outline:none}', ue = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, Ve = (D) => /* @__PURE__ */ W("svg", { ...ue, ...D, children: /* @__PURE__ */ W("path", { d: "M6 6.5h12L6 17.5h12" }) }), Ge = (D) => /* @__PURE__ */ Y("svg", { ...ue, ...D, children: [
  /* @__PURE__ */ W("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
  /* @__PURE__ */ W("line", { x1: "4", y1: "12.5", x2: "20", y2: "12.5" }),
  /* @__PURE__ */ W("path", { d: "M7 8.2 L9.4 10.2 L7 12.2" }),
  /* @__PURE__ */ W("line", { x1: "13", y1: "15.8", x2: "17", y2: "15.8", opacity: "0.55" })
] }), Xe = (D) => /* @__PURE__ */ Y("svg", { ...ue, ...D, children: [
  /* @__PURE__ */ W("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
  /* @__PURE__ */ W("line", { x1: "12.5", y1: "4", x2: "12.5", y2: "20" }),
  /* @__PURE__ */ W("path", { d: "M6.6 8.2 L9 10.2 L6.6 12.2" }),
  /* @__PURE__ */ W("circle", { cx: "16", cy: "9.2", r: "1", fill: "currentColor", stroke: "none" })
] }), Je = (D) => /* @__PURE__ */ Y("svg", { ...ue, ...D, children: [
  /* @__PURE__ */ W("circle", { cx: "12", cy: "12", r: "4.2" }),
  /* @__PURE__ */ W("circle", { cx: "12", cy: "12", r: "1.2", fill: "currentColor", stroke: "none" }),
  /* @__PURE__ */ W("circle", { cx: "7.8", cy: "12", r: "0.9", fill: "currentColor", stroke: "none" }),
  /* @__PURE__ */ W("circle", { cx: "16.2", cy: "12", r: "0.9", fill: "currentColor", stroke: "none" })
] }), Ye = (D) => /* @__PURE__ */ Y("svg", { ...ue, ...D, children: [
  /* @__PURE__ */ W("path", { d: "M6 15.5 L7.4 8.4 L10.4 11.4 L12 7.2 L13.6 11.4 L16.6 8.4 L18 15.5 Z" }),
  /* @__PURE__ */ W("line", { x1: "6", y1: "18", x2: "18", y2: "18" })
] }), Me = (D) => /* @__PURE__ */ Y("svg", { ...ue, ...D, children: [
  /* @__PURE__ */ W("path", { d: "M12 4.5 L14 8 H10 Z" }),
  /* @__PURE__ */ W("path", { d: "M10 8 h4 v8.5 h-4 Z" }),
  /* @__PURE__ */ W("line", { x1: "10", y1: "11.2", x2: "14", y2: "11.2", opacity: "0.5" })
] }), Ze = {
  zellij: Ve,
  screen: Ge,
  tmux: Xe,
  herdr: Je,
  aoe: Ye,
  custom: Me
};
function Se({ id: D, ...F }) {
  const N = Ze[D] || Me;
  return /* @__PURE__ */ W(N, { ...F });
}
const Qe = "kiro-herdr-views", et = "/apps/" + Qe + "/api", ne = (D) => et + D;
async function Le(D, F) {
  let N = "";
  try {
    const z = await D.json();
    N = z && (z.error || z.reason) || "";
  } catch {
  }
  return new Error(N || F + " -> " + D.status);
}
async function Oe(D) {
  const F = await fetch(D, { credentials: "same-origin" });
  if (!F.ok) throw await Le(F, "GET " + D);
  return F.json();
}
async function ge(D, F) {
  const N = await fetch(D, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(F || {})
  });
  if (!N.ok) throw await Le(N, "POST " + D);
  return N.json();
}
async function Ie(D) {
  const F = await fetch(D, { method: "DELETE", credentials: "same-origin" });
  if (!F.ok) throw await Le(F, "DELETE " + D);
  return F.json();
}
function Pe(D) {
  return ne("/sessions/" + encodeURIComponent(D)) + "?kill=1";
}
const He = "kiro-herdr-views:panes", Fe = "kiro-herdr-views:active";
function Ce() {
  try {
    return typeof window < "u" && window.localStorage || null;
  } catch {
    return null;
  }
}
function tt(D = Ce()) {
  try {
    const F = D && D.getItem(He), N = F ? JSON.parse(F) : [];
    return Array.isArray(N) ? N.filter((z) => z && z.ref && z.cmd && z.providerId !== "custom") : [];
  } catch {
    return [];
  }
}
function it(D, F = Ce()) {
  try {
    F && F.setItem(He, JSON.stringify(D));
  } catch {
  }
}
function rt(D = Ce()) {
  try {
    return D && D.getItem(Fe) || "";
  } catch {
    return "";
  }
}
function st(D, F = Ce()) {
  try {
    F && F.setItem(Fe, D || "");
  } catch {
  }
}
function nt(D, F) {
  return !F || !F.ref || D.some((N) => N.ref === F.ref) ? D : [...D, F];
}
function ot(D, F) {
  return D.filter((N) => N.ref !== F);
}
function at(D, F) {
  return F && D.some((N) => N.ref === F) ? F : D.length ? D[D.length - 1].ref : "";
}
function ht(D, F, N) {
  const z = F instanceof Set ? F : new Set(F || []), U = D.filter((V) => z.has(V.ref) || N[V.ref]);
  return U.length === D.length ? D : U;
}
function lt(D, F) {
  const N = (D || []).filter((U) => !F || U.id === F), z = [];
  for (const U of N)
    for (const V of U.sessions || []) z.push({ providerId: U.id, ...V });
  return z;
}
function ct(D) {
  const {
    wsUrl: F,
    // () => string, resolved lazily so tests inject static URLs
    sseUrl: N,
    makeWs: z = (f) => new WebSocket(f),
    makeEs: U = (f) => new EventSource(f),
    postInput: V,
    // REST fallback for input while WebSocket is unavailable
    postResize: B,
    onChunk: s,
    // (data) => void — replayed and live chunks alike
    onOpen: a,
    // () => void — the grid is re-sent once the socket opens
    onExit: c
    // () => void — invoked at most once
  } = D;
  let _ = "rest", n = null, d = null, v = !1, g = !1;
  function u() {
    g || (g = !0, c && c());
  }
  function e(f) {
    f && (f.type === "chunk" && s && s(f.data), f.type === "error" && i(), f.type === "exit" && u());
  }
  function i() {
    if (v || _ === "sse") return;
    _ = "sse";
    const f = U(N());
    d = f, f.onmessage = (m) => {
      try {
        const h = JSON.parse(m.data);
        h.type === "chunk" && s && s(h.data), h.type === "exit" && u();
      } catch {
      }
    }, f.onerror = () => {
    };
  }
  function t() {
    let f = null;
    try {
      f = z(F());
    } catch {
      f = null;
    }
    if (!f) {
      i();
      return;
    }
    n = f, _ = "ws", f.onopen = () => {
      a && a();
    }, f.onmessage = (m) => {
      try {
        e(JSON.parse(m.data));
      } catch {
      }
    }, f.onerror = () => {
      i();
    }, f.onclose = () => {
      i();
    };
  }
  function r(f) {
    if (n && n.readyState === 1)
      try {
        n.send(JSON.stringify({ type: "input", data: f }));
      } catch {
      }
    else V && V(f);
  }
  function o(f, m) {
    if (n && n.readyState === 1)
      try {
        n.send(JSON.stringify({ type: "resize", cols: f, rows: m }));
      } catch {
      }
    else B && B({ cols: f, rows: m });
  }
  function l() {
    if (!v) {
      if (v = !0, n)
        try {
          n.close();
        } catch {
        }
      if (d)
        try {
          d.close();
        } catch {
        }
    }
  }
  return { connect: t, input: r, resize: o, dispose: l, mode: () => _ };
}
function dt(D, F) {
  return D + "x" + F;
}
function ut(D) {
  return !!(D && D.clientWidth && D.clientHeight);
}
async function _t(D, { api: F = { post: ge }, onSession: N, onError: z, refresh: U } = {}) {
  const V = D.providerId || D.provider;
  try {
    const B = await F.post(ne("/sessions"), { provider: V, ref: D.ref });
    N && N(B.session);
  } catch (B) {
    z && z("Could not open " + V + ":" + D.name + " — " + String(B)), U && U();
  }
}
async function ft(D, { api: F = { post: ge }, onSession: N, onClose: z, onError: U } = {}) {
  if (!!!(D.providerId && D.providerId !== "custom")) {
    U && U("Custom command sessions are no longer supported. Choose a configured tool instead.");
    return;
  }
  try {
    const B = await F.post(ne("/sessions"), { provider: D.providerId, name: D.name });
    z && z(D.ref), N && N(B.session);
  } catch (B) {
    try {
      const s = await F.post(ne("/sessions"), { provider: D.providerId, ref: D.key || D.name });
      z && z(D.ref), N && N(s.session);
      return;
    } catch {
    }
    U && U("Could not restart " + D.name + " — " + String(B));
  }
}
async function vt(D, { api: F = { del: Ie }, confirm: N, notify: z, refresh: U } = {}) {
  if (!N(
    "Kill the " + D.providerId + ' session "' + D.name + `"?

This terminates it on the host and cannot be undone.`
  )) return;
  const B = D.providerId + ":" + (D.ref || D.name);
  try {
    const s = await F.del(Pe(B));
    z(
      s.killed ? "Killed " + D.providerId + ":" + D.name : "Could not kill " + D.providerId + ":" + D.name + ". " + (s.reason || ""),
      s.killed ? "info" : "error"
    );
  } catch (s) {
    z("Kill failed — " + String(s), "error");
  }
  U && U();
}
async function pt(D, { api: F = { del: Ie }, confirm: N, notify: z, onClose: U, refresh: V } = {}) {
  if (N(
    "Kill the " + D.providerId + ' session "' + D.name + `"?

This terminates it on the host and cannot be undone. To leave it running, use ✕ instead.`
  )) {
    try {
      const s = await F.del(Pe(D.ref));
      s.killed ? z("Killed " + D.providerId + ":" + D.name) : z("Closed the view. " + (s.reason || "The host session could not be killed."), "error");
    } catch (s) {
      z("Kill failed — " + String(s), "error");
    }
    U && U(D.ref), V && V();
  }
}
function gt(D) {
  const F = /* @__PURE__ */ new Set();
  let N = 0;
  const z = /* @__PURE__ */ new Set(), U = St;
  function V(_, n, d) {
    const v = d || "";
    v && z.add(v);
    const g = { id: ++N, text: String(_), severity: n === "error" ? "error" : "info", dedupeKey: v };
    F.forEach((u) => {
      try {
        u({ op: "add", toast: g });
      } catch {
      }
    });
  }
  function B(_) {
    _ && (z.delete(_), F.forEach((n) => {
      try {
        n({ op: "clear", dedupeKey: _ });
      } catch {
      }
    }));
  }
  function s(_, n, d) {
    !!d && z.has(d) || U(n === "error" ? "error" : "info", _), n === "error" && V(_, "error", d);
  }
  function a(_) {
    return F.add(_), () => {
      F.delete(_);
    };
  }
  function c() {
    return z.size;
  }
  return { pushToast: V, clearToast: B, notify: s, subscribe: a, keyCount: c };
}
function mt(D, F) {
  if (F.op === "clear") return D.filter((U) => U.dedupeKey !== F.dedupeKey);
  const N = F.toast;
  return [...N.dedupeKey ? D.filter((U) => U.dedupeKey !== N.dedupeKey) : D, N];
}
function St(D, F) {
  try {
    typeof window < "u" && window.parent && typeof window.parent.postMessage == "function" && window.parent !== window && window.parent.postMessage({ source: "kiro-herdr-views", type: "notify", text: F, severity: D }, "*");
  } catch {
  }
  console.log("[herdr-views]", F);
}
const Ne = gt();
function bt(D) {
  return D && (D.taken ? D.suggested : D.name) || "";
}
let De = !1;
function We() {
  if (De) return;
  De = !0;
  const D = document.createElement("style");
  D.textContent = Ke + `
` + qe, document.head.appendChild(D);
}
const be = (D) => Array.isArray(D) ? D.join(" ") : String(D || ""), { clearToast: ce, notify: le } = Ne;
function Ct() {
  const [D, F] = J.useState([]);
  J.useEffect(() => Ne.subscribe((U) => F((V) => mt(V, U))), []);
  const N = (z) => {
    const U = D.find((V) => V.id === z);
    U && U.dedupeKey && ce(U.dedupeKey), F((V) => V.filter((B) => B.id !== z));
  };
  return D.length === 0 ? null : /* @__PURE__ */ W("div", { className: "hv-toasts", role: "region", "aria-label": "Notifications", children: D.map((z) => /* @__PURE__ */ Y("div", { className: "hv-toast hv-toast-" + z.severity, role: "alert", children: [
    /* @__PURE__ */ W("span", { className: "hv-toast-msg", children: z.text }),
    /* @__PURE__ */ W("button", { type: "button", className: "hv-toast-close", "aria-label": "Dismiss", title: "Dismiss", onClick: () => N(z.id), children: "✕" })
  ] }, z.id)) });
}
function te(D, F) {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(D).trim() || F;
  } catch {
    return F;
  }
}
function yt(D, F) {
  const N = te(D, "").split(",").map((z) => z.trim()).filter(Boolean);
  return N.length ? N.join(", ") : F;
}
function Re() {
  const D = te("--bg", "#0b0e14"), F = te("--text-strong", "#eee8d5");
  return {
    background: D,
    foreground: te("--text", "#d7dae0"),
    cursor: te("--accent", "#3b82f6"),
    cursorAccent: D,
    selectionBackground: te("--accent-subtle", "rgba(59,130,246,0.3)"),
    black: te("--bg-accent", "#073642"),
    red: te("--danger", "#dc322f"),
    green: te("--ok", "#859900"),
    yellow: te("--warn", "#b58900"),
    blue: te("--info", "#268bd2"),
    magenta: te("--term-magenta", "#c678dd"),
    cyan: te("--term-cyan", "#56b6c2"),
    white: F,
    brightBlack: te("--muted-strong", "#586e75"),
    brightRed: te("--danger", "#dc322f"),
    brightGreen: te("--ok", "#859900"),
    brightYellow: te("--warn", "#b58900"),
    brightBlue: te("--info", "#268bd2"),
    brightMagenta: te("--term-magenta", "#c678dd"),
    brightCyan: te("--term-cyan", "#56b6c2"),
    brightWhite: F
  };
}
function wt({ session: D, ended: F, killable: N, onExit: z, onClose: U, onKill: V, onRestart: B }) {
  const s = J.useRef(null), a = J.useRef(z);
  return J.useEffect(() => {
    a.current = z;
  }, [z]), J.useEffect(() => {
    if (F) return;
    let c = !1;
    const _ = new ze.Terminal({
      convertEol: !0,
      fontSize: 13,
      fontFamily: yt("--mono", 'Menlo, Consolas, "DejaVu Sans Mono", monospace'),
      cursorBlink: !0,
      theme: Re()
    }), n = new $e.FitAddon();
    _.loadAddon(n), _.open(s.current);
    let d = null;
    try {
      d = new MutationObserver(() => {
        try {
          _.options.theme = Re();
        } catch {
        }
      }), d.observe(document.documentElement, { attributes: !0, attributeFilter: ["data-theme", "data-color-theme", "style"] }), d.observe(document.head, { childList: !0 });
    } catch {
    }
    const v = () => {
      if (!c) {
        if (c = !0, g.dispose(), d)
          try {
            d.disconnect();
          } catch {
          }
        if (r)
          try {
            r.disconnect();
          } catch {
          }
        window.removeEventListener("resize", t);
        try {
          _.dispose();
        } catch {
        }
      }
    }, g = ct({
      wsUrl: () => (window.location.protocol === "https:" ? "wss" : "ws") + "://" + window.location.host + ne("/ws?ref=" + encodeURIComponent(D.ref)),
      sseUrl: () => ne("/sse?ref=" + encodeURIComponent(D.ref)),
      postInput: (l) => {
        ge(ne("/input"), { ref: D.ref, data: l }).catch(() => {
        });
      },
      postResize: (l) => {
        ge(ne("/resize"), { ref: D.ref, cols: l.cols, rows: l.rows }).catch(() => {
        });
      },
      onChunk: (l) => _.write(l),
      // On open, re-send the grid: the replayed buffer puts a fresh xterm back
      // where the session was, and the resize makes the mux repaint its screen
      // so a full-screen TUI is not left half-drawn.
      onOpen: () => i(),
      onExit: () => {
        a.current && a.current(D.ref), v();
      }
    }), u = () => {
      try {
        g.resize(_.cols, _.rows);
      } catch {
      }
    };
    let e = "";
    const i = () => {
      const l = s.current;
      if (!ut(l)) return;
      try {
        n.fit();
      } catch {
        return;
      }
      const f = dt(_.cols, _.rows);
      f !== e && (e = f, u());
    }, t = () => i();
    window.addEventListener("resize", t);
    let r = null;
    try {
      r = new ResizeObserver(() => i()), r.observe(s.current);
    } catch {
    }
    _.onData((l) => g.input(l)), g.connect(), i();
    const o = requestAnimationFrame(() => i());
    return () => {
      cancelAnimationFrame(o), v();
    };
  }, [D.ref, F]), /* @__PURE__ */ Y("div", { className: "hv-pane", children: [
    /* @__PURE__ */ Y("div", { className: "hv-pane-top", children: [
      /* @__PURE__ */ Y("span", { className: "hv-pane-title", title: D.providerId + " · " + D.name, children: [
        /* @__PURE__ */ W(Se, { id: D.providerId, className: "hv-pane-ico" }),
        /* @__PURE__ */ W("span", { className: "hv-pane-name", children: D.name }),
        /* @__PURE__ */ W("span", { className: "hv-pane-prov", children: D.providerId })
      ] }),
      /* @__PURE__ */ W("span", { className: "hv-pane-cmd", title: be(D.cmd), children: be(D.cmd) }),
      /* @__PURE__ */ Y("span", { className: "hv-pane-actions", children: [
        N && !F && /* @__PURE__ */ W(
          "button",
          {
            className: "hv-btn-sm hv-danger",
            onClick: V,
            title: "Force-stop this " + D.providerId + " session on the host — cannot be undone",
            children: "Kill"
          }
        ),
        /* @__PURE__ */ W(
          "button",
          {
            className: "hv-x",
            onClick: U,
            "aria-label": "Detach from session",
            title: "Detach — close this view, session keeps running on the host",
            children: "✕"
          }
        )
      ] })
    ] }),
    F ? /* @__PURE__ */ Y("div", { className: "hv-ended", children: [
      /* @__PURE__ */ W("div", { className: "hv-ended-title", children: "This session has ended" }),
      /* @__PURE__ */ Y("div", { className: "hv-ended-note", children: [
        /* @__PURE__ */ W("span", { className: "hv-mono", children: be(D.cmd) }),
        " is no longer running on the host."
      ] }),
      /* @__PURE__ */ Y("div", { className: "hv-ended-actions", children: [
        /* @__PURE__ */ W("button", { className: "hv-btn", onClick: B, children: "Restart session" }),
        /* @__PURE__ */ W("button", { className: "hv-btn hv-btn-ghost", onClick: U, children: "Close view" })
      ] })
    ] }) : /* @__PURE__ */ W("div", { className: "hv-term", ref: s })
  ] });
}
function Et({ providers: D, onCreated: F }) {
  const [N, z] = J.useState(""), [U, V] = J.useState(""), [B, s] = J.useState(""), [a, c] = J.useState(!1), [_, n] = J.useState(!1), d = J.useRef(0), v = J.useRef(!0);
  J.useEffect(() => () => {
    v.current = !1;
  }, []);
  const g = (D || []).filter((o) => o.available), u = U.trim(), e = u || B;
  J.useEffect(() => {
    if (!N) {
      d.current += 1, s(""), c(!1), ce("create-command");
      return;
    }
    const o = (U || "").trim(), l = ++d.current;
    let f = !1;
    const m = setTimeout(() => {
      const h = ne("/providers/" + encodeURIComponent(N) + "/create-command") + (o ? "?name=" + encodeURIComponent(o) : "");
      Oe(h).then((p) => {
        f || l !== d.current || !v.current || (s(bt(p)), c(!!(p && p.taken)), ce("create-command"));
      }).catch((p) => {
        f || l !== d.current || !v.current || (le("Could not load a session name: " + String(p), "error", "create-command"), s(""));
      });
    }, o ? 300 : 0);
    return () => {
      f = !0, clearTimeout(m);
    };
  }, [N, U]);
  const i = (o) => {
    z(o), V(""), s(""), c(!1), ce("create-command"), ce("create-session");
  }, t = async (o) => {
    o.preventDefault(), n(!0), ce("create-session");
    try {
      if (!N) throw new Error("Select a configured tool");
      const l = { provider: N };
      u && (l.name = u);
      const f = await ge(ne("/sessions"), l);
      F && F(f.session), le("Attached: " + (f.session && f.session.name || "")), V(""), c(!1);
    } catch (l) {
      le(String(l && l.message ? l.message : l), "error", "create-session");
    } finally {
      n(!1);
    }
  }, r = N ? "Attach / New Session creates the " + N + " session" + (e ? ' "' + e + '"' : "") + " if it does not exist, then opens it." : "Select a configured tool to create or attach to a managed session.";
  return /* @__PURE__ */ Y("form", { className: "hv-form", onSubmit: t, children: [
    /* @__PURE__ */ Y("div", { className: "hv-form-row", children: [
      /* @__PURE__ */ Y("select", { className: "hv-inp", value: N, onChange: (o) => i(o.target.value), children: [
        /* @__PURE__ */ W("option", { value: "", disabled: !0, children: "Select a tool" }),
        g.map((o) => /* @__PURE__ */ W("option", { value: o.id, children: o.label }, o.id))
      ] }),
      /* @__PURE__ */ W(
        "input",
        {
          className: "hv-inp",
          placeholder: B ? "auto: " + B : "session name (optional)",
          value: U,
          onChange: (o) => V(o.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ W("div", { className: "hv-form-row", children: /* @__PURE__ */ W("button", { type: "button", className: "hv-hint-icon", title: r, "aria-label": r, tabIndex: 0, children: /* @__PURE__ */ Y("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
      /* @__PURE__ */ W("circle", { cx: "8", cy: "8", r: "6.5" }),
      /* @__PURE__ */ W("line", { x1: "8", y1: "7", x2: "8", y2: "11" }),
      /* @__PURE__ */ W("circle", { cx: "8", cy: "5", r: "0.6", fill: "currentColor", stroke: "none" })
    ] }) }) }),
    a && /* @__PURE__ */ Y("div", { className: "hv-warn", children: [
      "A ",
      N,
      ' session called "',
      u,
      '" already exists.',
      " ",
      /* @__PURE__ */ Y("button", { type: "button", className: "hv-link", onClick: () => V(B), children: [
        'Use "',
        B,
        '"'
      ] })
    ] }),
    /* @__PURE__ */ W("button", { className: "hv-btn", type: "submit", disabled: _ || !N, children: _ ? "Attaching…" : "Attach / New Session" })
  ] });
}
function xt() {
  const [D, F] = J.useState([]), [N, z] = J.useState(tt), [U, V] = J.useState(rt), [B, s] = J.useState({}), [a, c] = J.useState(""), [_, n] = J.useState([]), [d, v] = J.useState(function() {
    try {
      return JSON.parse(localStorage.getItem("hv-collapsed-sections") || "{}");
    } catch {
      return {};
    }
  }), g = function(C) {
    v(function(y) {
      const x = Object.assign({}, y, { [C]: !y[C] });
      try {
        localStorage.setItem("hv-collapsed-sections", JSON.stringify(x));
      } catch {
      }
      return x;
    });
  }, u = J.useRef(B);
  J.useEffect(() => {
    u.current = B;
  }, [B]);
  const e = J.useCallback((C, y) => {
    s((x) => {
      if (y && x[C] || !y && !x[C]) return x;
      const A = { ...x };
      return y ? A[C] = !0 : delete A[C], A;
    });
  }, []), i = J.useCallback(async () => {
    try {
      const C = await Oe(ne("/providers"));
      F(C.providers || []), ce("providers");
      const y = new Set([...C.sessions || [], ...C.known || []].map((x) => x.ref));
      z((x) => ht(x, y, u.current));
    } catch (C) {
      le("Could not load sessions — " + String(C), "error", "providers");
    }
  }, []);
  J.useEffect(() => {
    i();
    const C = setInterval(() => {
      document.hidden || i();
    }, 8e3), y = () => {
      document.hidden || i();
    };
    return document.addEventListener("visibilitychange", y), () => {
      clearInterval(C), document.removeEventListener("visibilitychange", y);
    };
  }, [i]), J.useEffect(() => {
    it(N);
  }, [N]), J.useEffect(() => {
    st(U);
  }, [U]), J.useEffect(() => {
    V(at(N, U));
  }, [N, U]), J.useEffect(() => {
    n(lt(D, a));
  }, [D, a]);
  const t = J.useCallback((C) => {
    !C || !C.ref || (z((y) => nt(y, C)), e(C.ref, !1), V(C.ref));
  }, [e]), r = J.useCallback((C) => {
    z((y) => ot(y, C)), e(C, !1);
  }, [e]), o = (C) => _t(C, {
    onSession: t,
    onError: (y) => le(y, "error"),
    refresh: i
  }), l = (C) => ft(C, {
    onSession: t,
    onClose: r,
    onError: (y) => le(y, "error")
  }), f = (C) => vt(C, {
    confirm: (y) => window.confirm(y),
    notify: le,
    refresh: i
  }), m = (C) => pt(C, {
    confirm: (y) => window.confirm(y),
    notify: le,
    onClose: r,
    refresh: i
  }), h = (C) => {
    const y = (D || []).find((x) => x.id === C);
    return !!(y && y.killable);
  }, p = new Set(N.map((C) => C.ref)), w = N.find((C) => C.ref === U) || null;
  return /* @__PURE__ */ Y("div", { className: "hv-root", children: [
    /* @__PURE__ */ W(Ct, {}),
    /* @__PURE__ */ Y("div", { className: "hv-sidebar", children: [
      /* @__PURE__ */ W("div", { className: "hv-brand", children: "Herdr Views" }),
      /* @__PURE__ */ Y("div", { className: "hv-section-title" + (d.providers ? " hv-collapsed" : ""), onClick: function() {
        g("providers");
      }, children: [
        /* @__PURE__ */ W("svg", { className: "hv-chevron", viewBox: "0 0 24 24", width: "14", height: "14", children: /* @__PURE__ */ W("path", { d: "M9 6l6 6-6 6", stroke: "currentColor", strokeWidth: "1.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        "Providers"
      ] }),
      d.providers ? null : /* @__PURE__ */ Y("div", { className: "hv-prov-list", children: [
        /* @__PURE__ */ Y("div", { className: "hv-prov" + (a === "" ? " hv-active" : ""), onClick: () => c(""), children: [
          /* @__PURE__ */ Y("svg", { className: "hv-prov-ico", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ W("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
            /* @__PURE__ */ W("line", { x1: "9", y1: "8", x2: "9", y2: "16" }),
            /* @__PURE__ */ W("line", { x1: "15", y1: "8", x2: "15", y2: "16" }),
            /* @__PURE__ */ W("line", { x1: "12", y1: "10.5", x2: "12", y2: "13.5" })
          ] }),
          /* @__PURE__ */ W("span", { children: "All" })
        ] }),
        D.map((C) => /* @__PURE__ */ Y(
          "div",
          {
            className: "hv-prov" + (a === C.id ? " hv-active" : "") + (C.available ? "" : " hv-prov-na"),
            onClick: () => c(C.id),
            title: C.available ? "Show only " + C.label + " sessions" : C.label + " is not installed",
            children: [
              /* @__PURE__ */ W(Se, { id: C.id, className: "hv-prov-ico" }),
              /* @__PURE__ */ W("span", { children: C.id }),
              C.available ? "" : /* @__PURE__ */ W("span", { className: "hv-na", children: "n/a" })
            ]
          },
          C.id
        ))
      ] }),
      /* @__PURE__ */ Y("div", { className: "hv-section-title" + (d.open ? " hv-collapsed" : ""), onClick: function() {
        g("open");
      }, children: [
        /* @__PURE__ */ W("svg", { className: "hv-chevron", viewBox: "0 0 24 24", width: "14", height: "14", children: /* @__PURE__ */ W("path", { d: "M9 6l6 6-6 6", stroke: "currentColor", strokeWidth: "1.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        "Open Sessions",
        N.length > 0 && /* @__PURE__ */ W("span", { className: "hv-count", children: N.length })
      ] }),
      d.open ? null : /* @__PURE__ */ W("div", { className: "hv-pset", children: N.length === 0 ? /* @__PURE__ */ W("div", { className: "hv-empty sm", children: "Nothing open — pick a session below." }) : N.map((C) => /* @__PURE__ */ Y(
        "div",
        {
          className: "hv-sess" + (C.ref === U ? " hv-active" : "") + (B[C.ref] ? " hv-sess-ended" : ""),
          onClick: () => V(C.ref),
          title: be(C.cmd),
          children: [
            /* @__PURE__ */ W(Se, { id: C.providerId, className: "hv-sess-ico" }),
            /* @__PURE__ */ W("span", { className: "hv-sess-name", children: C.name }),
            /* @__PURE__ */ W("span", { className: "hv-sess-prov", children: C.providerId }),
            /* @__PURE__ */ W(
              "button",
              {
                className: "hv-x",
                "aria-label": "Detach from session",
                title: "Detach — close this view, session keeps running on the host",
                onClick: (y) => {
                  y.stopPropagation(), r(C.ref);
                },
                children: "✕"
              }
            )
          ]
        },
        C.ref
      )) }),
      /* @__PURE__ */ Y("div", { className: "hv-section-title" + (d.discovered ? " hv-collapsed" : ""), onClick: function() {
        g("discovered");
      }, children: [
        /* @__PURE__ */ W("svg", { className: "hv-chevron", viewBox: "0 0 24 24", width: "14", height: "14", children: /* @__PURE__ */ W("path", { d: "M9 6l6 6-6 6", stroke: "currentColor", strokeWidth: "1.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        "Discovered Sessions",
        a && /* @__PURE__ */ W("span", { className: "hv-count", children: _.length })
      ] }),
      d.discovered ? null : /* @__PURE__ */ W("div", { className: "hv-disc", children: _.length === 0 ? /* @__PURE__ */ W("div", { className: "hv-empty sm", children: "No sessions discovered" }) : _.map((C) => {
        const y = (C.providerId || C.provider) + ":" + (C.ref || C.name), x = p.has(y);
        return /* @__PURE__ */ Y(
          "div",
          {
            className: "hv-disc-item" + (x ? " hv-disc-open" : ""),
            onClick: () => o(C),
            title: x ? "Already open — click to focus" : "Open " + C.name,
            children: [
              /* @__PURE__ */ W("span", { className: "hv-disc-dot" }),
              /* @__PURE__ */ W("span", { className: "hv-disc-name", children: C.name }),
              /* @__PURE__ */ Y("span", { className: "hv-disc-prov", children: [
                /* @__PURE__ */ W(Se, { id: C.providerId, className: "hv-disc-ico" }),
                C.providerId
              ] }),
              h(C.providerId) && /* @__PURE__ */ W(
                "button",
                {
                  className: "hv-kill",
                  onClick: (A) => {
                    A.stopPropagation(), f(C);
                  },
                  title: "Force-stop this " + C.providerId + " session on the host — cannot be undone",
                  children: "Kill"
                }
              )
            ]
          },
          y
        );
      }) })
    ] }),
    /* @__PURE__ */ Y("div", { className: "hv-main", children: [
      /* @__PURE__ */ W(Et, { providers: D, onCreated: t }),
      /* @__PURE__ */ W("div", { className: "hv-panes", children: w ? /* @__PURE__ */ W(
        wt,
        {
          session: w,
          ended: !!B[w.ref],
          killable: h(w.providerId),
          onExit: (C) => {
            e(C, !0), i();
          },
          onClose: () => r(w.ref),
          onKill: () => m(w),
          onRestart: () => l(w)
        },
        w.ref
      ) : /* @__PURE__ */ W("div", { className: "hv-welcome", children: "Nothing open yet. Create a session above, or pick one from Discovered Sessions on the left. Sessions are real tmux/screen/zellij processes — closing a view leaves them running on the host." }) })
    ] })
  ] });
}
function Rt(D) {
  We();
  const F = je(D);
  return F.render(/* @__PURE__ */ W(xt, {})), () => F.unmount();
}
We();
export {
  xt as default,
  Rt as mount
};
