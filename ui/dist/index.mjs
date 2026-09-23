import { jsxs as ie, jsx as G } from "react/jsx-runtime";
import V from "react";
import { createRoot as De } from "react-dom/client";
var ye = { exports: {} };
(function(z, Y) {
  (function(K, Q) {
    z.exports = Q();
  })(self, () => (() => {
    var K = { 4567: function(B, r, o) {
      var c = this && this.__decorate || function(s, a, l, f) {
        var m, h = arguments.length, p = h < 3 ? a : f === null ? f = Object.getOwnPropertyDescriptor(a, l) : f;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") p = Reflect.decorate(s, a, l, f);
        else for (var b = s.length - 1; b >= 0; b--) (m = s[b]) && (p = (h < 3 ? m(p) : h > 3 ? m(a, l, p) : m(a, l)) || p);
        return h > 3 && p && Object.defineProperty(a, l, p), p;
      }, _ = this && this.__param || function(s, a) {
        return function(l, f) {
          a(l, f, s);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.AccessibilityManager = void 0;
      const n = o(9042), u = o(6114), v = o(9924), g = o(844), d = o(5596), e = o(4725), i = o(3656);
      let t = r.AccessibilityManager = class extends g.Disposable {
        constructor(s, a) {
          super(), this._terminal = s, this._renderService = a, this._liveRegionLineCount = 0, this._charsToConsume = [], this._charsToAnnounce = "", this._accessibilityContainer = document.createElement("div"), this._accessibilityContainer.classList.add("xterm-accessibility"), this._rowContainer = document.createElement("div"), this._rowContainer.setAttribute("role", "list"), this._rowContainer.classList.add("xterm-accessibility-tree"), this._rowElements = [];
          for (let l = 0; l < this._terminal.rows; l++) this._rowElements[l] = this._createAccessibilityTreeNode(), this._rowContainer.appendChild(this._rowElements[l]);
          if (this._topBoundaryFocusListener = (l) => this._handleBoundaryFocus(l, 0), this._bottomBoundaryFocusListener = (l) => this._handleBoundaryFocus(l, 1), this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener), this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._refreshRowsDimensions(), this._accessibilityContainer.appendChild(this._rowContainer), this._liveRegion = document.createElement("div"), this._liveRegion.classList.add("live-region"), this._liveRegion.setAttribute("aria-live", "assertive"), this._accessibilityContainer.appendChild(this._liveRegion), this._liveRegionDebouncer = this.register(new v.TimeBasedDebouncer(this._renderRows.bind(this))), !this._terminal.element) throw new Error("Cannot enable accessibility before Terminal.open");
          this._terminal.element.insertAdjacentElement("afterbegin", this._accessibilityContainer), this.register(this._terminal.onResize((l) => this._handleResize(l.rows))), this.register(this._terminal.onRender((l) => this._refreshRows(l.start, l.end))), this.register(this._terminal.onScroll(() => this._refreshRows())), this.register(this._terminal.onA11yChar((l) => this._handleChar(l))), this.register(this._terminal.onLineFeed(() => this._handleChar(`
`))), this.register(this._terminal.onA11yTab((l) => this._handleTab(l))), this.register(this._terminal.onKey((l) => this._handleKey(l.key))), this.register(this._terminal.onBlur(() => this._clearLiveRegion())), this.register(this._renderService.onDimensionsChange(() => this._refreshRowsDimensions())), this._screenDprMonitor = new d.ScreenDprMonitor(window), this.register(this._screenDprMonitor), this._screenDprMonitor.setListener(() => this._refreshRowsDimensions()), this.register((0, i.addDisposableDomListener)(window, "resize", () => this._refreshRowsDimensions())), this._refreshRows(), this.register((0, g.toDisposable)(() => {
            this._accessibilityContainer.remove(), this._rowElements.length = 0;
          }));
        }
        _handleTab(s) {
          for (let a = 0; a < s; a++) this._handleChar(" ");
        }
        _handleChar(s) {
          this._liveRegionLineCount < 21 && (this._charsToConsume.length > 0 ? this._charsToConsume.shift() !== s && (this._charsToAnnounce += s) : this._charsToAnnounce += s, s === `
` && (this._liveRegionLineCount++, this._liveRegionLineCount === 21 && (this._liveRegion.textContent += n.tooMuchOutput)), u.isMac && this._liveRegion.textContent && this._liveRegion.textContent.length > 0 && !this._liveRegion.parentNode && setTimeout(() => {
            this._accessibilityContainer.appendChild(this._liveRegion);
          }, 0));
        }
        _clearLiveRegion() {
          this._liveRegion.textContent = "", this._liveRegionLineCount = 0, u.isMac && this._liveRegion.remove();
        }
        _handleKey(s) {
          this._clearLiveRegion(), new RegExp("\\p{Control}", "u").test(s) || this._charsToConsume.push(s);
        }
        _refreshRows(s, a) {
          this._liveRegionDebouncer.refresh(s, a, this._terminal.rows);
        }
        _renderRows(s, a) {
          const l = this._terminal.buffer, f = l.lines.length.toString();
          for (let m = s; m <= a; m++) {
            const h = l.translateBufferLineToString(l.ydisp + m, !0), p = (l.ydisp + m + 1).toString(), b = this._rowElements[m];
            b && (h.length === 0 ? b.innerText = " " : b.textContent = h, b.setAttribute("aria-posinset", p), b.setAttribute("aria-setsize", f));
          }
          this._announceCharacters();
        }
        _announceCharacters() {
          this._charsToAnnounce.length !== 0 && (this._liveRegion.textContent += this._charsToAnnounce, this._charsToAnnounce = "");
        }
        _handleBoundaryFocus(s, a) {
          const l = s.target, f = this._rowElements[a === 0 ? 1 : this._rowElements.length - 2];
          if (l.getAttribute("aria-posinset") === (a === 0 ? "1" : `${this._terminal.buffer.lines.length}`) || s.relatedTarget !== f) return;
          let m, h;
          if (a === 0 ? (m = l, h = this._rowElements.pop(), this._rowContainer.removeChild(h)) : (m = this._rowElements.shift(), h = l, this._rowContainer.removeChild(m)), m.removeEventListener("focus", this._topBoundaryFocusListener), h.removeEventListener("focus", this._bottomBoundaryFocusListener), a === 0) {
            const p = this._createAccessibilityTreeNode();
            this._rowElements.unshift(p), this._rowContainer.insertAdjacentElement("afterbegin", p);
          } else {
            const p = this._createAccessibilityTreeNode();
            this._rowElements.push(p), this._rowContainer.appendChild(p);
          }
          this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener), this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._terminal.scrollLines(a === 0 ? -1 : 1), this._rowElements[a === 0 ? 1 : this._rowElements.length - 2].focus(), s.preventDefault(), s.stopImmediatePropagation();
        }
        _handleResize(s) {
          this._rowElements[this._rowElements.length - 1].removeEventListener("focus", this._bottomBoundaryFocusListener);
          for (let a = this._rowContainer.children.length; a < this._terminal.rows; a++) this._rowElements[a] = this._createAccessibilityTreeNode(), this._rowContainer.appendChild(this._rowElements[a]);
          for (; this._rowElements.length > s; ) this._rowContainer.removeChild(this._rowElements.pop());
          this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._refreshRowsDimensions();
        }
        _createAccessibilityTreeNode() {
          const s = document.createElement("div");
          return s.setAttribute("role", "listitem"), s.tabIndex = -1, this._refreshRowDimensions(s), s;
        }
        _refreshRowsDimensions() {
          if (this._renderService.dimensions.css.cell.height) {
            this._accessibilityContainer.style.width = `${this._renderService.dimensions.css.canvas.width}px`, this._rowElements.length !== this._terminal.rows && this._handleResize(this._terminal.rows);
            for (let s = 0; s < this._terminal.rows; s++) this._refreshRowDimensions(this._rowElements[s]);
          }
        }
        _refreshRowDimensions(s) {
          s.style.height = `${this._renderService.dimensions.css.cell.height}px`;
        }
      };
      r.AccessibilityManager = t = c([_(1, e.IRenderService)], t);
    }, 3614: (B, r) => {
      function o(u) {
        return u.replace(/\r?\n/g, "\r");
      }
      function c(u, v) {
        return v ? "\x1B[200~" + u + "\x1B[201~" : u;
      }
      function _(u, v, g, d) {
        u = c(u = o(u), g.decPrivateModes.bracketedPasteMode && d.rawOptions.ignoreBracketedPasteMode !== !0), g.triggerDataEvent(u, !0), v.value = "";
      }
      function n(u, v, g) {
        const d = g.getBoundingClientRect(), e = u.clientX - d.left - 10, i = u.clientY - d.top - 10;
        v.style.width = "20px", v.style.height = "20px", v.style.left = `${e}px`, v.style.top = `${i}px`, v.style.zIndex = "1000", v.focus();
      }
      Object.defineProperty(r, "__esModule", { value: !0 }), r.rightClickHandler = r.moveTextAreaUnderMouseCursor = r.paste = r.handlePasteEvent = r.copyHandler = r.bracketTextForPaste = r.prepareTextForTerminal = void 0, r.prepareTextForTerminal = o, r.bracketTextForPaste = c, r.copyHandler = function(u, v) {
        u.clipboardData && u.clipboardData.setData("text/plain", v.selectionText), u.preventDefault();
      }, r.handlePasteEvent = function(u, v, g, d) {
        u.stopPropagation(), u.clipboardData && _(u.clipboardData.getData("text/plain"), v, g, d);
      }, r.paste = _, r.moveTextAreaUnderMouseCursor = n, r.rightClickHandler = function(u, v, g, d, e) {
        n(u, v, g), e && d.rightClickSelect(u), v.value = d.selectionText, v.select();
      };
    }, 7239: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.ColorContrastCache = void 0;
      const c = o(1505);
      r.ColorContrastCache = class {
        constructor() {
          this._color = new c.TwoKeyMap(), this._css = new c.TwoKeyMap();
        }
        setCss(_, n, u) {
          this._css.set(_, n, u);
        }
        getCss(_, n) {
          return this._css.get(_, n);
        }
        setColor(_, n, u) {
          this._color.set(_, n, u);
        }
        getColor(_, n) {
          return this._color.get(_, n);
        }
        clear() {
          this._color.clear(), this._css.clear();
        }
      };
    }, 3656: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.addDisposableDomListener = void 0, r.addDisposableDomListener = function(o, c, _, n) {
        o.addEventListener(c, _, n);
        let u = !1;
        return { dispose: () => {
          u || (u = !0, o.removeEventListener(c, _, n));
        } };
      };
    }, 6465: function(B, r, o) {
      var c = this && this.__decorate || function(e, i, t, s) {
        var a, l = arguments.length, f = l < 3 ? i : s === null ? s = Object.getOwnPropertyDescriptor(i, t) : s;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, s);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (f = (l < 3 ? a(f) : l > 3 ? a(i, t, f) : a(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, s) {
          i(t, s, e);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.Linkifier2 = void 0;
      const n = o(3656), u = o(8460), v = o(844), g = o(2585);
      let d = r.Linkifier2 = class extends v.Disposable {
        get currentLink() {
          return this._currentLink;
        }
        constructor(e) {
          super(), this._bufferService = e, this._linkProviders = [], this._linkCacheDisposables = [], this._isMouseOut = !0, this._wasResized = !1, this._activeLine = -1, this._onShowLinkUnderline = this.register(new u.EventEmitter()), this.onShowLinkUnderline = this._onShowLinkUnderline.event, this._onHideLinkUnderline = this.register(new u.EventEmitter()), this.onHideLinkUnderline = this._onHideLinkUnderline.event, this.register((0, v.getDisposeArrayDisposable)(this._linkCacheDisposables)), this.register((0, v.toDisposable)(() => {
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
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            if (a.classList.contains("xterm")) break;
            if (a.classList.contains("xterm-hover")) return;
          }
          this._lastBufferCell && i.x === this._lastBufferCell.x && i.y === this._lastBufferCell.y || (this._handleHover(i), this._lastBufferCell = i);
        }
        _handleHover(e) {
          if (this._activeLine !== e.y || this._wasResized) return this._clearCurrentLink(), this._askForLink(e, !1), void (this._wasResized = !1);
          this._currentLink && this._linkAtPosition(this._currentLink.link, e) || (this._clearCurrentLink(), this._askForLink(e, !0));
        }
        _askForLink(e, i) {
          var t, s;
          this._activeProviderReplies && i || ((t = this._activeProviderReplies) === null || t === void 0 || t.forEach((l) => {
            l == null || l.forEach((f) => {
              f.link.dispose && f.link.dispose();
            });
          }), this._activeProviderReplies = /* @__PURE__ */ new Map(), this._activeLine = e.y);
          let a = !1;
          for (const [l, f] of this._linkProviders.entries()) i ? !((s = this._activeProviderReplies) === null || s === void 0) && s.get(l) && (a = this._checkLinkProviderResult(l, e, a)) : f.provideLinks(e.y, (m) => {
            var h, p;
            if (this._isMouseOut) return;
            const b = m == null ? void 0 : m.map((x) => ({ link: x }));
            (h = this._activeProviderReplies) === null || h === void 0 || h.set(l, b), a = this._checkLinkProviderResult(l, e, a), ((p = this._activeProviderReplies) === null || p === void 0 ? void 0 : p.size) === this._linkProviders.length && this._removeIntersectingLinks(e.y, this._activeProviderReplies);
          });
        }
        _removeIntersectingLinks(e, i) {
          const t = /* @__PURE__ */ new Set();
          for (let s = 0; s < i.size; s++) {
            const a = i.get(s);
            if (a) for (let l = 0; l < a.length; l++) {
              const f = a[l], m = f.link.range.start.y < e ? 0 : f.link.range.start.x, h = f.link.range.end.y > e ? this._bufferService.cols : f.link.range.end.x;
              for (let p = m; p <= h; p++) {
                if (t.has(p)) {
                  a.splice(l--, 1);
                  break;
                }
                t.add(p);
              }
            }
          }
        }
        _checkLinkProviderResult(e, i, t) {
          var s;
          if (!this._activeProviderReplies) return t;
          const a = this._activeProviderReplies.get(e);
          let l = !1;
          for (let f = 0; f < e; f++) this._activeProviderReplies.has(f) && !this._activeProviderReplies.get(f) || (l = !0);
          if (!l && a) {
            const f = a.find((m) => this._linkAtPosition(m.link, i));
            f && (t = !0, this._handleNewLink(f));
          }
          if (this._activeProviderReplies.size === this._linkProviders.length && !t) for (let f = 0; f < this._activeProviderReplies.size; f++) {
            const m = (s = this._activeProviderReplies.get(f)) === null || s === void 0 ? void 0 : s.find((h) => this._linkAtPosition(h.link, i));
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
            var t, s;
            return (s = (t = this._currentLink) === null || t === void 0 ? void 0 : t.state) === null || s === void 0 ? void 0 : s.decorations.pointerCursor;
          }, set: (t) => {
            var s, a;
            !((s = this._currentLink) === null || s === void 0) && s.state && this._currentLink.state.decorations.pointerCursor !== t && (this._currentLink.state.decorations.pointerCursor = t, this._currentLink.state.isHovered && ((a = this._element) === null || a === void 0 || a.classList.toggle("xterm-cursor-pointer", t)));
          } }, underline: { get: () => {
            var t, s;
            return (s = (t = this._currentLink) === null || t === void 0 ? void 0 : t.state) === null || s === void 0 ? void 0 : s.decorations.underline;
          }, set: (t) => {
            var s, a, l;
            !((s = this._currentLink) === null || s === void 0) && s.state && ((l = (a = this._currentLink) === null || a === void 0 ? void 0 : a.state) === null || l === void 0 ? void 0 : l.decorations.underline) !== t && (this._currentLink.state.decorations.underline = t, this._currentLink.state.isHovered && this._fireUnderlineEvent(e.link, t));
          } } }), this._renderService && this._linkCacheDisposables.push(this._renderService.onRenderedViewportChange((t) => {
            if (!this._currentLink) return;
            const s = t.start === 0 ? 0 : t.start + 1 + this._bufferService.buffer.ydisp, a = this._bufferService.buffer.ydisp + 1 + t.end;
            if (this._currentLink.link.range.start.y >= s && this._currentLink.link.range.end.y <= a && (this._clearCurrentLink(s, a), this._lastMouseEvent && this._element)) {
              const l = this._positionFromMouseEvent(this._lastMouseEvent, this._element, this._mouseService);
              l && this._askForLink(l, !1);
            }
          })));
        }
        _linkHover(e, i, t) {
          var s;
          !((s = this._currentLink) === null || s === void 0) && s.state && (this._currentLink.state.isHovered = !0, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(i, !0), this._currentLink.state.decorations.pointerCursor && e.classList.add("xterm-cursor-pointer")), i.hover && i.hover(t, i.text);
        }
        _fireUnderlineEvent(e, i) {
          const t = e.range, s = this._bufferService.buffer.ydisp, a = this._createLinkUnderlineEvent(t.start.x - 1, t.start.y - s - 1, t.end.x, t.end.y - s - 1, void 0);
          (i ? this._onShowLinkUnderline : this._onHideLinkUnderline).fire(a);
        }
        _linkLeave(e, i, t) {
          var s;
          !((s = this._currentLink) === null || s === void 0) && s.state && (this._currentLink.state.isHovered = !1, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(i, !1), this._currentLink.state.decorations.pointerCursor && e.classList.remove("xterm-cursor-pointer")), i.leave && i.leave(t, i.text);
        }
        _linkAtPosition(e, i) {
          const t = e.range.start.y * this._bufferService.cols + e.range.start.x, s = e.range.end.y * this._bufferService.cols + e.range.end.x, a = i.y * this._bufferService.cols + i.x;
          return t <= a && a <= s;
        }
        _positionFromMouseEvent(e, i, t) {
          const s = t.getCoords(e, i, this._bufferService.cols, this._bufferService.rows);
          if (s) return { x: s[0], y: s[1] + this._bufferService.buffer.ydisp };
        }
        _createLinkUnderlineEvent(e, i, t, s, a) {
          return { x1: e, y1: i, x2: t, y2: s, cols: this._bufferService.cols, fg: a };
        }
      };
      r.Linkifier2 = d = c([_(0, g.IBufferService)], d);
    }, 9042: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.tooMuchOutput = r.promptLabel = void 0, r.promptLabel = "Terminal input", r.tooMuchOutput = "Too much output to announce, navigate to rows manually to read";
    }, 3730: function(B, r, o) {
      var c = this && this.__decorate || function(d, e, i, t) {
        var s, a = arguments.length, l = a < 3 ? e : t === null ? t = Object.getOwnPropertyDescriptor(e, i) : t;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") l = Reflect.decorate(d, e, i, t);
        else for (var f = d.length - 1; f >= 0; f--) (s = d[f]) && (l = (a < 3 ? s(l) : a > 3 ? s(e, i, l) : s(e, i)) || l);
        return a > 3 && l && Object.defineProperty(e, i, l), l;
      }, _ = this && this.__param || function(d, e) {
        return function(i, t) {
          e(i, t, d);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.OscLinkProvider = void 0;
      const n = o(511), u = o(2585);
      let v = r.OscLinkProvider = class {
        constructor(d, e, i) {
          this._bufferService = d, this._optionsService = e, this._oscLinkService = i;
        }
        provideLinks(d, e) {
          var i;
          const t = this._bufferService.buffer.lines.get(d - 1);
          if (!t) return void e(void 0);
          const s = [], a = this._optionsService.rawOptions.linkHandler, l = new n.CellData(), f = t.getTrimmedLength();
          let m = -1, h = -1, p = !1;
          for (let b = 0; b < f; b++) if (h !== -1 || t.hasContent(b)) {
            if (t.loadCell(b, l), l.hasExtendedAttrs() && l.extended.urlId) {
              if (h === -1) {
                h = b, m = l.extended.urlId;
                continue;
              }
              p = l.extended.urlId !== m;
            } else h !== -1 && (p = !0);
            if (p || h !== -1 && b === f - 1) {
              const x = (i = this._oscLinkService.getLinkData(m)) === null || i === void 0 ? void 0 : i.uri;
              if (x) {
                const y = { start: { x: h + 1, y: d }, end: { x: b + (p || b !== f - 1 ? 0 : 1), y: d } };
                let k = !1;
                if (!(a != null && a.allowNonHttpProtocols)) try {
                  const D = new URL(x);
                  ["http:", "https:"].includes(D.protocol) || (k = !0);
                } catch {
                  k = !0;
                }
                k || s.push({ text: x, range: y, activate: (D, M) => a ? a.activate(D, M, y) : g(0, M), hover: (D, M) => {
                  var P;
                  return (P = a == null ? void 0 : a.hover) === null || P === void 0 ? void 0 : P.call(a, D, M, y);
                }, leave: (D, M) => {
                  var P;
                  return (P = a == null ? void 0 : a.leave) === null || P === void 0 ? void 0 : P.call(a, D, M, y);
                } });
              }
              p = !1, l.hasExtendedAttrs() && l.extended.urlId ? (h = b, m = l.extended.urlId) : (h = -1, m = -1);
            }
          }
          e(s);
        }
      };
      function g(d, e) {
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
      r.OscLinkProvider = v = c([_(0, u.IBufferService), _(1, u.IOptionsService), _(2, u.IOscLinkService)], v);
    }, 6193: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.RenderDebouncer = void 0, r.RenderDebouncer = class {
        constructor(o, c) {
          this._parentWindow = o, this._renderCallback = c, this._refreshCallbacks = [];
        }
        dispose() {
          this._animationFrame && (this._parentWindow.cancelAnimationFrame(this._animationFrame), this._animationFrame = void 0);
        }
        addRefreshCallback(o) {
          return this._refreshCallbacks.push(o), this._animationFrame || (this._animationFrame = this._parentWindow.requestAnimationFrame(() => this._innerRefresh())), this._animationFrame;
        }
        refresh(o, c, _) {
          this._rowCount = _, o = o !== void 0 ? o : 0, c = c !== void 0 ? c : this._rowCount - 1, this._rowStart = this._rowStart !== void 0 ? Math.min(this._rowStart, o) : o, this._rowEnd = this._rowEnd !== void 0 ? Math.max(this._rowEnd, c) : c, this._animationFrame || (this._animationFrame = this._parentWindow.requestAnimationFrame(() => this._innerRefresh()));
        }
        _innerRefresh() {
          if (this._animationFrame = void 0, this._rowStart === void 0 || this._rowEnd === void 0 || this._rowCount === void 0) return void this._runRefreshCallbacks();
          const o = Math.max(this._rowStart, 0), c = Math.min(this._rowEnd, this._rowCount - 1);
          this._rowStart = void 0, this._rowEnd = void 0, this._renderCallback(o, c), this._runRefreshCallbacks();
        }
        _runRefreshCallbacks() {
          for (const o of this._refreshCallbacks) o(0);
          this._refreshCallbacks = [];
        }
      };
    }, 5596: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.ScreenDprMonitor = void 0;
      const c = o(844);
      class _ extends c.Disposable {
        constructor(u) {
          super(), this._parentWindow = u, this._currentDevicePixelRatio = this._parentWindow.devicePixelRatio, this.register((0, c.toDisposable)(() => {
            this.clearListener();
          }));
        }
        setListener(u) {
          this._listener && this.clearListener(), this._listener = u, this._outerListener = () => {
            this._listener && (this._listener(this._parentWindow.devicePixelRatio, this._currentDevicePixelRatio), this._updateDpr());
          }, this._updateDpr();
        }
        _updateDpr() {
          var u;
          this._outerListener && ((u = this._resolutionMediaMatchList) === null || u === void 0 || u.removeListener(this._outerListener), this._currentDevicePixelRatio = this._parentWindow.devicePixelRatio, this._resolutionMediaMatchList = this._parentWindow.matchMedia(`screen and (resolution: ${this._parentWindow.devicePixelRatio}dppx)`), this._resolutionMediaMatchList.addListener(this._outerListener));
        }
        clearListener() {
          this._resolutionMediaMatchList && this._listener && this._outerListener && (this._resolutionMediaMatchList.removeListener(this._outerListener), this._resolutionMediaMatchList = void 0, this._listener = void 0, this._outerListener = void 0);
        }
      }
      r.ScreenDprMonitor = _;
    }, 3236: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.Terminal = void 0;
      const c = o(3614), _ = o(3656), n = o(6465), u = o(9042), v = o(3730), g = o(1680), d = o(3107), e = o(5744), i = o(2950), t = o(1296), s = o(428), a = o(4269), l = o(5114), f = o(8934), m = o(3230), h = o(9312), p = o(4725), b = o(6731), x = o(8055), y = o(8969), k = o(8460), D = o(844), M = o(6114), P = o(8437), O = o(2584), C = o(7399), w = o(5941), E = o(9074), L = o(2585), I = o(5435), H = o(4567), W = typeof window < "u" ? window.document : null;
      class N extends y.CoreTerminal {
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
          super(S), this.browser = M, this._keyDownHandled = !1, this._keyDownSeen = !1, this._keyPressHandled = !1, this._unprocessedDeadKey = !1, this._accessibilityManager = this.register(new D.MutableDisposable()), this._onCursorMove = this.register(new k.EventEmitter()), this.onCursorMove = this._onCursorMove.event, this._onKey = this.register(new k.EventEmitter()), this.onKey = this._onKey.event, this._onRender = this.register(new k.EventEmitter()), this.onRender = this._onRender.event, this._onSelectionChange = this.register(new k.EventEmitter()), this.onSelectionChange = this._onSelectionChange.event, this._onTitleChange = this.register(new k.EventEmitter()), this.onTitleChange = this._onTitleChange.event, this._onBell = this.register(new k.EventEmitter()), this.onBell = this._onBell.event, this._onFocus = this.register(new k.EventEmitter()), this._onBlur = this.register(new k.EventEmitter()), this._onA11yCharEmitter = this.register(new k.EventEmitter()), this._onA11yTabEmitter = this.register(new k.EventEmitter()), this._onWillOpen = this.register(new k.EventEmitter()), this._setup(), this.linkifier2 = this.register(this._instantiationService.createInstance(n.Linkifier2)), this.linkifier2.registerLinkProvider(this._instantiationService.createInstance(v.OscLinkProvider)), this._decorationService = this._instantiationService.createInstance(E.DecorationService), this._instantiationService.setService(L.IDecorationService, this._decorationService), this.register(this._inputHandler.onRequestBell(() => this._onBell.fire())), this.register(this._inputHandler.onRequestRefreshRows((R, T) => this.refresh(R, T))), this.register(this._inputHandler.onRequestSendFocus(() => this._reportFocus())), this.register(this._inputHandler.onRequestReset(() => this.reset())), this.register(this._inputHandler.onRequestWindowsOptionsReport((R) => this._reportWindowsOptions(R))), this.register(this._inputHandler.onColor((R) => this._handleColorEvent(R))), this.register((0, k.forwardEvent)(this._inputHandler.onCursorMove, this._onCursorMove)), this.register((0, k.forwardEvent)(this._inputHandler.onTitleChange, this._onTitleChange)), this.register((0, k.forwardEvent)(this._inputHandler.onA11yChar, this._onA11yCharEmitter)), this.register((0, k.forwardEvent)(this._inputHandler.onA11yTab, this._onA11yTabEmitter)), this.register(this._bufferService.onResize((R) => this._afterResize(R.cols, R.rows))), this.register((0, D.toDisposable)(() => {
            var R, T;
            this._customKeyEventHandler = void 0, (T = (R = this.element) === null || R === void 0 ? void 0 : R.parentNode) === null || T === void 0 || T.removeChild(this.element);
          }));
        }
        _handleColorEvent(S) {
          if (this._themeService) for (const R of S) {
            let T, A = "";
            switch (R.index) {
              case 256:
                T = "foreground", A = "10";
                break;
              case 257:
                T = "background", A = "11";
                break;
              case 258:
                T = "cursor", A = "12";
                break;
              default:
                T = "ansi", A = "4;" + R.index;
            }
            switch (R.type) {
              case 0:
                const j = x.color.toColorRGB(T === "ansi" ? this._themeService.colors.ansi[R.index] : this._themeService.colors[T]);
                this.coreService.triggerDataEvent(`${O.C0.ESC}]${A};${(0, w.toRgbString)(j)}${O.C1_ESCAPED.ST}`);
                break;
              case 1:
                if (T === "ansi") this._themeService.modifyColors((F) => F.ansi[R.index] = x.rgba.toColor(...R.color));
                else {
                  const F = T;
                  this._themeService.modifyColors((q) => q[F] = x.rgba.toColor(...R.color));
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
          S ? !this._accessibilityManager.value && this._renderService && (this._accessibilityManager.value = this._instantiationService.createInstance(H.AccessibilityManager, this)) : this._accessibilityManager.clear();
        }
        _handleTextAreaFocus(S) {
          this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(O.C0.ESC + "[I"), this.updateCursorStyle(S), this.element.classList.add("focus"), this._showCursor(), this._onFocus.fire();
        }
        blur() {
          var S;
          return (S = this.textarea) === null || S === void 0 ? void 0 : S.blur();
        }
        _handleTextAreaBlur() {
          this.textarea.value = "", this.refresh(this.buffer.y, this.buffer.y), this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(O.C0.ESC + "[O"), this.element.classList.remove("focus"), this._onBlur.fire();
        }
        _syncTextArea() {
          if (!this.textarea || !this.buffer.isCursorInViewport || this._compositionHelper.isComposing || !this._renderService) return;
          const S = this.buffer.ybase + this.buffer.y, R = this.buffer.lines.get(S);
          if (!R) return;
          const T = Math.min(this.buffer.x, this.cols - 1), A = this._renderService.dimensions.css.cell.height, j = R.getWidth(T), F = this._renderService.dimensions.css.cell.width * j, q = this.buffer.y * this._renderService.dimensions.css.cell.height, ee = T * this._renderService.dimensions.css.cell.width;
          this.textarea.style.left = ee + "px", this.textarea.style.top = q + "px", this.textarea.style.width = F + "px", this.textarea.style.height = A + "px", this.textarea.style.lineHeight = A + "px", this.textarea.style.zIndex = "-5";
        }
        _initGlobal() {
          this._bindKeys(), this.register((0, _.addDisposableDomListener)(this.element, "copy", (R) => {
            this.hasSelection() && (0, c.copyHandler)(R, this._selectionService);
          }));
          const S = (R) => (0, c.handlePasteEvent)(R, this.textarea, this.coreService, this.optionsService);
          this.register((0, _.addDisposableDomListener)(this.textarea, "paste", S)), this.register((0, _.addDisposableDomListener)(this.element, "paste", S)), M.isFirefox ? this.register((0, _.addDisposableDomListener)(this.element, "mousedown", (R) => {
            R.button === 2 && (0, c.rightClickHandler)(R, this.textarea, this.screenElement, this._selectionService, this.options.rightClickSelectsWord);
          })) : this.register((0, _.addDisposableDomListener)(this.element, "contextmenu", (R) => {
            (0, c.rightClickHandler)(R, this.textarea, this.screenElement, this._selectionService, this.options.rightClickSelectsWord);
          })), M.isLinux && this.register((0, _.addDisposableDomListener)(this.element, "auxclick", (R) => {
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
          const T = W.createDocumentFragment();
          this._viewportElement = W.createElement("div"), this._viewportElement.classList.add("xterm-viewport"), T.appendChild(this._viewportElement), this._viewportScrollArea = W.createElement("div"), this._viewportScrollArea.classList.add("xterm-scroll-area"), this._viewportElement.appendChild(this._viewportScrollArea), this.screenElement = W.createElement("div"), this.screenElement.classList.add("xterm-screen"), this._helperContainer = W.createElement("div"), this._helperContainer.classList.add("xterm-helpers"), this.screenElement.appendChild(this._helperContainer), T.appendChild(this.screenElement), this.textarea = W.createElement("textarea"), this.textarea.classList.add("xterm-helper-textarea"), this.textarea.setAttribute("aria-label", u.promptLabel), M.isChromeOS || this.textarea.setAttribute("aria-multiline", "false"), this.textarea.setAttribute("autocorrect", "off"), this.textarea.setAttribute("autocapitalize", "off"), this.textarea.setAttribute("spellcheck", "false"), this.textarea.tabIndex = 0, this._coreBrowserService = this._instantiationService.createInstance(l.CoreBrowserService, this.textarea, (R = this._document.defaultView) !== null && R !== void 0 ? R : window), this._instantiationService.setService(p.ICoreBrowserService, this._coreBrowserService), this.register((0, _.addDisposableDomListener)(this.textarea, "focus", (A) => this._handleTextAreaFocus(A))), this.register((0, _.addDisposableDomListener)(this.textarea, "blur", () => this._handleTextAreaBlur())), this._helperContainer.appendChild(this.textarea), this._charSizeService = this._instantiationService.createInstance(s.CharSizeService, this._document, this._helperContainer), this._instantiationService.setService(p.ICharSizeService, this._charSizeService), this._themeService = this._instantiationService.createInstance(b.ThemeService), this._instantiationService.setService(p.IThemeService, this._themeService), this._characterJoinerService = this._instantiationService.createInstance(a.CharacterJoinerService), this._instantiationService.setService(p.ICharacterJoinerService, this._characterJoinerService), this._renderService = this.register(this._instantiationService.createInstance(m.RenderService, this.rows, this.screenElement)), this._instantiationService.setService(p.IRenderService, this._renderService), this.register(this._renderService.onRenderedViewportChange((A) => this._onRender.fire(A))), this.onResize((A) => this._renderService.resize(A.cols, A.rows)), this._compositionView = W.createElement("div"), this._compositionView.classList.add("composition-view"), this._compositionHelper = this._instantiationService.createInstance(i.CompositionHelper, this.textarea, this._compositionView), this._helperContainer.appendChild(this._compositionView), this.element.appendChild(T);
          try {
            this._onWillOpen.fire(this.element);
          } catch {
          }
          this._renderService.hasRenderer() || this._renderService.setRenderer(this._createRenderer()), this._mouseService = this._instantiationService.createInstance(f.MouseService), this._instantiationService.setService(p.IMouseService, this._mouseService), this.viewport = this._instantiationService.createInstance(g.Viewport, this._viewportElement, this._viewportScrollArea), this.viewport.onRequestScrollLines((A) => this.scrollLines(A.amount, A.suppressScrollEvent, 1)), this.register(this._inputHandler.onRequestSyncScrollBar(() => this.viewport.syncScrollArea())), this.register(this.viewport), this.register(this.onCursorMove(() => {
            this._renderService.handleCursorMove(), this._syncTextArea();
          })), this.register(this.onResize(() => this._renderService.handleResize(this.cols, this.rows))), this.register(this.onBlur(() => this._renderService.handleBlur())), this.register(this.onFocus(() => this._renderService.handleFocus())), this.register(this._renderService.onDimensionsChange(() => this.viewport.syncScrollArea())), this._selectionService = this.register(this._instantiationService.createInstance(h.SelectionService, this.element, this.screenElement, this.linkifier2)), this._instantiationService.setService(p.ISelectionService, this._selectionService), this.register(this._selectionService.onRequestScrollLines((A) => this.scrollLines(A.amount, A.suppressScrollEvent))), this.register(this._selectionService.onSelectionChange(() => this._onSelectionChange.fire())), this.register(this._selectionService.onRequestRedraw((A) => this._renderService.handleSelectionChanged(A.start, A.end, A.columnSelectMode))), this.register(this._selectionService.onLinuxMouseSelection((A) => {
            this.textarea.value = A, this.textarea.focus(), this.textarea.select();
          })), this.register(this._onScroll.event((A) => {
            this.viewport.syncScrollArea(), this._selectionService.refresh();
          })), this.register((0, _.addDisposableDomListener)(this._viewportElement, "scroll", () => this._selectionService.refresh())), this.linkifier2.attachToDom(this.screenElement, this._mouseService, this._renderService), this.register(this._instantiationService.createInstance(d.BufferDecorationRenderer, this.screenElement)), this.register((0, _.addDisposableDomListener)(this.element, "mousedown", (A) => this._selectionService.handleMouseDown(A))), this.coreMouseService.areMouseEventsActive ? (this._selectionService.disable(), this.element.classList.add("enable-mouse-events")) : this._selectionService.enable(), this.options.screenReaderMode && (this._accessibilityManager.value = this._instantiationService.createInstance(H.AccessibilityManager, this)), this.register(this.optionsService.onSpecificOptionChange("screenReaderMode", (A) => this._handleScreenReaderModeOptionChange(A))), this.options.overviewRulerWidth && (this._overviewRulerRenderer = this.register(this._instantiationService.createInstance(e.OverviewRulerRenderer, this._viewportElement, this.screenElement))), this.optionsService.onSpecificOptionChange("overviewRulerWidth", (A) => {
            !this._overviewRulerRenderer && A && this._viewportElement && this.screenElement && (this._overviewRulerRenderer = this.register(this._instantiationService.createInstance(e.OverviewRulerRenderer, this._viewportElement, this.screenElement)));
          }), this._charSizeService.measure(), this.refresh(0, this.rows - 1), this._initGlobal(), this.bindMouse();
        }
        _createRenderer() {
          return this._instantiationService.createInstance(t.DomRenderer, this.element, this.screenElement, this._viewportElement, this.linkifier2);
        }
        bindMouse() {
          const S = this, R = this.element;
          function T(F) {
            const q = S._mouseService.getMouseReportCoords(F, S.screenElement);
            if (!q) return !1;
            let ee, te;
            switch (F.overrideType || F.type) {
              case "mousemove":
                te = 32, F.buttons === void 0 ? (ee = 3, F.button !== void 0 && (ee = F.button < 3 ? F.button : 3)) : ee = 1 & F.buttons ? 0 : 4 & F.buttons ? 1 : 2 & F.buttons ? 2 : 3;
                break;
              case "mouseup":
                te = 0, ee = F.button < 3 ? F.button : 3;
                break;
              case "mousedown":
                te = 1, ee = F.button < 3 ? F.button : 3;
                break;
              case "wheel":
                if (S.viewport.getLinesScrolled(F) === 0) return !1;
                te = F.deltaY < 0 ? 0 : 1, ee = 4;
                break;
              default:
                return !1;
            }
            return !(te === void 0 || ee === void 0 || ee > 4) && S.coreMouseService.triggerMouseEvent({ col: q.col, row: q.row, x: q.x, y: q.y, button: ee, action: te, ctrl: F.ctrlKey, alt: F.altKey, shift: F.shiftKey });
          }
          const A = { mouseup: null, wheel: null, mousedrag: null, mousemove: null }, j = { mouseup: (F) => (T(F), F.buttons || (this._document.removeEventListener("mouseup", A.mouseup), A.mousedrag && this._document.removeEventListener("mousemove", A.mousedrag)), this.cancel(F)), wheel: (F) => (T(F), this.cancel(F, !0)), mousedrag: (F) => {
            F.buttons && T(F);
          }, mousemove: (F) => {
            F.buttons || T(F);
          } };
          this.register(this.coreMouseService.onProtocolChange((F) => {
            F ? (this.optionsService.rawOptions.logLevel === "debug" && this._logService.debug("Binding to mouse events:", this.coreMouseService.explainEvents(F)), this.element.classList.add("enable-mouse-events"), this._selectionService.disable()) : (this._logService.debug("Unbinding from mouse events."), this.element.classList.remove("enable-mouse-events"), this._selectionService.enable()), 8 & F ? A.mousemove || (R.addEventListener("mousemove", j.mousemove), A.mousemove = j.mousemove) : (R.removeEventListener("mousemove", A.mousemove), A.mousemove = null), 16 & F ? A.wheel || (R.addEventListener("wheel", j.wheel, { passive: !1 }), A.wheel = j.wheel) : (R.removeEventListener("wheel", A.wheel), A.wheel = null), 2 & F ? A.mouseup || (R.addEventListener("mouseup", j.mouseup), A.mouseup = j.mouseup) : (this._document.removeEventListener("mouseup", A.mouseup), R.removeEventListener("mouseup", A.mouseup), A.mouseup = null), 4 & F ? A.mousedrag || (A.mousedrag = j.mousedrag) : (this._document.removeEventListener("mousemove", A.mousedrag), A.mousedrag = null);
          })), this.coreMouseService.activeProtocol = this.coreMouseService.activeProtocol, this.register((0, _.addDisposableDomListener)(R, "mousedown", (F) => {
            if (F.preventDefault(), this.focus(), this.coreMouseService.areMouseEventsActive && !this._selectionService.shouldForceSelection(F)) return T(F), A.mouseup && this._document.addEventListener("mouseup", A.mouseup), A.mousedrag && this._document.addEventListener("mousemove", A.mousedrag), this.cancel(F);
          })), this.register((0, _.addDisposableDomListener)(R, "wheel", (F) => {
            if (!A.wheel) {
              if (!this.buffer.hasScrollback) {
                const q = this.viewport.getLinesScrolled(F);
                if (q === 0) return;
                const ee = O.C0.ESC + (this.coreService.decPrivateModes.applicationCursorKeys ? "O" : "[") + (F.deltaY < 0 ? "A" : "B");
                let te = "";
                for (let he = 0; he < Math.abs(q); he++) te += ee;
                return this.coreService.triggerDataEvent(te, !0), this.cancel(F, !0);
              }
              return this.viewport.handleWheel(F) ? this.cancel(F) : void 0;
            }
          }, { passive: !1 })), this.register((0, _.addDisposableDomListener)(R, "touchstart", (F) => {
            if (!this.coreMouseService.areMouseEventsActive) return this.viewport.handleTouchStart(F), this.cancel(F);
          }, { passive: !0 })), this.register((0, _.addDisposableDomListener)(R, "touchmove", (F) => {
            if (!this.coreMouseService.areMouseEventsActive) return this.viewport.handleTouchMove(F) ? void 0 : this.cancel(F);
          }, { passive: !1 }));
        }
        refresh(S, R) {
          var T;
          (T = this._renderService) === null || T === void 0 || T.refreshRows(S, R);
        }
        updateCursorStyle(S) {
          var R;
          !((R = this._selectionService) === null || R === void 0) && R.shouldColumnSelect(S) ? this.element.classList.add("column-select") : this.element.classList.remove("column-select");
        }
        _showCursor() {
          this.coreService.isCursorInitialized || (this.coreService.isCursorInitialized = !0, this.refresh(this.buffer.y, this.buffer.y));
        }
        scrollLines(S, R, T = 0) {
          var A;
          T === 1 ? (super.scrollLines(S, R, T), this.refresh(0, this.rows - 1)) : (A = this.viewport) === null || A === void 0 || A.scrollLines(S);
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
        select(S, R, T) {
          this._selectionService.setSelection(S, R, T);
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
          var T;
          (T = this._selectionService) === null || T === void 0 || T.selectLines(S, R);
        }
        _keyDown(S) {
          if (this._keyDownHandled = !1, this._keyDownSeen = !0, this._customKeyEventHandler && this._customKeyEventHandler(S) === !1) return !1;
          const R = this.browser.isMac && this.options.macOptionIsMeta && S.altKey;
          if (!R && !this._compositionHelper.keydown(S)) return this.options.scrollOnUserInput && this.buffer.ybase !== this.buffer.ydisp && this.scrollToBottom(), !1;
          R || S.key !== "Dead" && S.key !== "AltGraph" || (this._unprocessedDeadKey = !0);
          const T = (0, C.evaluateKeyboardEvent)(S, this.coreService.decPrivateModes.applicationCursorKeys, this.browser.isMac, this.options.macOptionIsMeta);
          if (this.updateCursorStyle(S), T.type === 3 || T.type === 2) {
            const A = this.rows - 1;
            return this.scrollLines(T.type === 2 ? -A : A), this.cancel(S, !0);
          }
          return T.type === 1 && this.selectAll(), !!this._isThirdLevelShift(this.browser, S) || (T.cancel && this.cancel(S, !0), !T.key || !!(S.key && !S.ctrlKey && !S.altKey && !S.metaKey && S.key.length === 1 && S.key.charCodeAt(0) >= 65 && S.key.charCodeAt(0) <= 90) || (this._unprocessedDeadKey ? (this._unprocessedDeadKey = !1, !0) : (T.key !== O.C0.ETX && T.key !== O.C0.CR || (this.textarea.value = ""), this._onKey.fire({ key: T.key, domEvent: S }), this._showCursor(), this.coreService.triggerDataEvent(T.key, !0), !this.optionsService.rawOptions.screenReaderMode || S.altKey || S.ctrlKey ? this.cancel(S, !0) : void (this._keyDownHandled = !0))));
        }
        _isThirdLevelShift(S, R) {
          const T = S.isMac && !this.options.macOptionIsMeta && R.altKey && !R.ctrlKey && !R.metaKey || S.isWindows && R.altKey && R.ctrlKey && !R.metaKey || S.isWindows && R.getModifierState("AltGraph");
          return R.type === "keypress" ? T : T && (!R.keyCode || R.keyCode > 47);
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
          var T, A;
          (T = this._charSizeService) === null || T === void 0 || T.measure(), (A = this.viewport) === null || A === void 0 || A.syncScrollArea(!0);
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
          const T = this._customKeyEventHandler;
          this._setup(), super.reset(), (S = this._selectionService) === null || S === void 0 || S.reset(), this._decorationService.reset(), (R = this.viewport) === null || R === void 0 || R.reset(), this._customKeyEventHandler = T, this.refresh(0, this.rows - 1);
        }
        clearTextureAtlas() {
          var S;
          (S = this._renderService) === null || S === void 0 || S.clearTextureAtlas();
        }
        _reportFocus() {
          var S;
          !((S = this.element) === null || S === void 0) && S.classList.contains("focus") ? this.coreService.triggerDataEvent(O.C0.ESC + "[I") : this.coreService.triggerDataEvent(O.C0.ESC + "[O");
        }
        _reportWindowsOptions(S) {
          if (this._renderService) switch (S) {
            case I.WindowsOptionsReportType.GET_WIN_SIZE_PIXELS:
              const R = this._renderService.dimensions.css.canvas.width.toFixed(0), T = this._renderService.dimensions.css.canvas.height.toFixed(0);
              this.coreService.triggerDataEvent(`${O.C0.ESC}[4;${T};${R}t`);
              break;
            case I.WindowsOptionsReportType.GET_CELL_SIZE_PIXELS:
              const A = this._renderService.dimensions.css.cell.width.toFixed(0), j = this._renderService.dimensions.css.cell.height.toFixed(0);
              this.coreService.triggerDataEvent(`${O.C0.ESC}[6;${j};${A}t`);
          }
        }
        cancel(S, R) {
          if (this.options.cancelEvents || R) return S.preventDefault(), S.stopPropagation(), !1;
        }
      }
      r.Terminal = N;
    }, 9924: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.TimeBasedDebouncer = void 0, r.TimeBasedDebouncer = class {
        constructor(o, c = 1e3) {
          this._renderCallback = o, this._debounceThresholdMS = c, this._lastRefreshMs = 0, this._additionalRefreshRequested = !1;
        }
        dispose() {
          this._refreshTimeoutID && clearTimeout(this._refreshTimeoutID);
        }
        refresh(o, c, _) {
          this._rowCount = _, o = o !== void 0 ? o : 0, c = c !== void 0 ? c : this._rowCount - 1, this._rowStart = this._rowStart !== void 0 ? Math.min(this._rowStart, o) : o, this._rowEnd = this._rowEnd !== void 0 ? Math.max(this._rowEnd, c) : c;
          const n = Date.now();
          if (n - this._lastRefreshMs >= this._debounceThresholdMS) this._lastRefreshMs = n, this._innerRefresh();
          else if (!this._additionalRefreshRequested) {
            const u = n - this._lastRefreshMs, v = this._debounceThresholdMS - u;
            this._additionalRefreshRequested = !0, this._refreshTimeoutID = window.setTimeout(() => {
              this._lastRefreshMs = Date.now(), this._innerRefresh(), this._additionalRefreshRequested = !1, this._refreshTimeoutID = void 0;
            }, v);
          }
        }
        _innerRefresh() {
          if (this._rowStart === void 0 || this._rowEnd === void 0 || this._rowCount === void 0) return;
          const o = Math.max(this._rowStart, 0), c = Math.min(this._rowEnd, this._rowCount - 1);
          this._rowStart = void 0, this._rowEnd = void 0, this._renderCallback(o, c);
        }
      };
    }, 1680: function(B, r, o) {
      var c = this && this.__decorate || function(i, t, s, a) {
        var l, f = arguments.length, m = f < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, s) : a;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") m = Reflect.decorate(i, t, s, a);
        else for (var h = i.length - 1; h >= 0; h--) (l = i[h]) && (m = (f < 3 ? l(m) : f > 3 ? l(t, s, m) : l(t, s)) || m);
        return f > 3 && m && Object.defineProperty(t, s, m), m;
      }, _ = this && this.__param || function(i, t) {
        return function(s, a) {
          t(s, a, i);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.Viewport = void 0;
      const n = o(3656), u = o(4725), v = o(8460), g = o(844), d = o(2585);
      let e = r.Viewport = class extends g.Disposable {
        constructor(i, t, s, a, l, f, m, h) {
          super(), this._viewportElement = i, this._scrollArea = t, this._bufferService = s, this._optionsService = a, this._charSizeService = l, this._renderService = f, this._coreBrowserService = m, this.scrollBarWidth = 0, this._currentRowHeight = 0, this._currentDeviceCellHeight = 0, this._lastRecordedBufferLength = 0, this._lastRecordedViewportHeight = 0, this._lastRecordedBufferHeight = 0, this._lastTouchY = 0, this._lastScrollTop = 0, this._wheelPartialScroll = 0, this._refreshAnimationFrame = null, this._ignoreNextScrollEvent = !1, this._smoothScrollState = { startTime: 0, origin: -1, target: -1 }, this._onRequestScrollLines = this.register(new v.EventEmitter()), this.onRequestScrollLines = this._onRequestScrollLines.event, this.scrollBarWidth = this._viewportElement.offsetWidth - this._scrollArea.offsetWidth || 15, this.register((0, n.addDisposableDomListener)(this._viewportElement, "scroll", this._handleScroll.bind(this))), this._activeBuffer = this._bufferService.buffer, this.register(this._bufferService.buffers.onBufferActivate((p) => this._activeBuffer = p.activeBuffer)), this._renderDimensions = this._renderService.dimensions, this.register(this._renderService.onDimensionsChange((p) => this._renderDimensions = p)), this._handleThemeChange(h.colors), this.register(h.onChangeColors((p) => this._handleThemeChange(p))), this.register(this._optionsService.onSpecificOptionChange("scrollback", () => this.syncScrollArea())), setTimeout(() => this.syncScrollArea());
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
          const s = this._viewportElement.scrollTop + this._lastRecordedViewportHeight;
          return !(t < 0 && this._viewportElement.scrollTop !== 0 || t > 0 && s < this._lastRecordedBufferHeight) || (i.cancelable && i.preventDefault(), !1);
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
          var s;
          let a, l = "";
          const f = [], m = t ?? this._bufferService.buffer.lines.length, h = this._bufferService.buffer.lines;
          for (let p = i; p < m; p++) {
            const b = h.get(p);
            if (!b) continue;
            const x = (s = h.get(p + 1)) === null || s === void 0 ? void 0 : s.isWrapped;
            if (l += b.translateToString(!x), !x || p === h.length - 1) {
              const y = document.createElement("div");
              y.textContent = l, f.push(y), l.length > 0 && (a = y), l = "";
            }
          }
          return { bufferElements: f, cursorElement: a };
        }
        getLinesScrolled(i) {
          if (i.deltaY === 0 || i.shiftKey) return 0;
          let t = this._applyScrollModifier(i.deltaY, i);
          return i.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? (t /= this._currentRowHeight + 0, this._wheelPartialScroll += t, t = Math.floor(Math.abs(this._wheelPartialScroll)) * (this._wheelPartialScroll > 0 ? 1 : -1), this._wheelPartialScroll %= 1) : i.deltaMode === WheelEvent.DOM_DELTA_PAGE && (t *= this._bufferService.rows), t;
        }
        _applyScrollModifier(i, t) {
          const s = this._optionsService.rawOptions.fastScrollModifier;
          return s === "alt" && t.altKey || s === "ctrl" && t.ctrlKey || s === "shift" && t.shiftKey ? i * this._optionsService.rawOptions.fastScrollSensitivity * this._optionsService.rawOptions.scrollSensitivity : i * this._optionsService.rawOptions.scrollSensitivity;
        }
        handleTouchStart(i) {
          this._lastTouchY = i.touches[0].pageY;
        }
        handleTouchMove(i) {
          const t = this._lastTouchY - i.touches[0].pageY;
          return this._lastTouchY = i.touches[0].pageY, t !== 0 && (this._viewportElement.scrollTop += t, this._bubbleScroll(i, t));
        }
      };
      r.Viewport = e = c([_(2, d.IBufferService), _(3, d.IOptionsService), _(4, u.ICharSizeService), _(5, u.IRenderService), _(6, u.ICoreBrowserService), _(7, u.IThemeService)], e);
    }, 3107: function(B, r, o) {
      var c = this && this.__decorate || function(e, i, t, s) {
        var a, l = arguments.length, f = l < 3 ? i : s === null ? s = Object.getOwnPropertyDescriptor(i, t) : s;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, s);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (f = (l < 3 ? a(f) : l > 3 ? a(i, t, f) : a(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, s) {
          i(t, s, e);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.BufferDecorationRenderer = void 0;
      const n = o(3656), u = o(4725), v = o(844), g = o(2585);
      let d = r.BufferDecorationRenderer = class extends v.Disposable {
        constructor(e, i, t, s) {
          super(), this._screenElement = e, this._bufferService = i, this._decorationService = t, this._renderService = s, this._decorationElements = /* @__PURE__ */ new Map(), this._altBufferIsActive = !1, this._dimensionsChanged = !1, this._container = document.createElement("div"), this._container.classList.add("xterm-decoration-container"), this._screenElement.appendChild(this._container), this.register(this._renderService.onRenderedViewportChange(() => this._doRefreshDecorations())), this.register(this._renderService.onDimensionsChange(() => {
            this._dimensionsChanged = !0, this._queueRefresh();
          })), this.register((0, n.addDisposableDomListener)(window, "resize", () => this._queueRefresh())), this.register(this._bufferService.buffers.onBufferActivate(() => {
            this._altBufferIsActive = this._bufferService.buffer === this._bufferService.buffers.alt;
          })), this.register(this._decorationService.onDecorationRegistered(() => this._queueRefresh())), this.register(this._decorationService.onDecorationRemoved((a) => this._removeDecoration(a))), this.register((0, v.toDisposable)(() => {
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
          const s = document.createElement("div");
          s.classList.add("xterm-decoration"), s.classList.toggle("xterm-decoration-top-layer", ((i = e == null ? void 0 : e.options) === null || i === void 0 ? void 0 : i.layer) === "top"), s.style.width = `${Math.round((e.options.width || 1) * this._renderService.dimensions.css.cell.width)}px`, s.style.height = (e.options.height || 1) * this._renderService.dimensions.css.cell.height + "px", s.style.top = (e.marker.line - this._bufferService.buffers.active.ydisp) * this._renderService.dimensions.css.cell.height + "px", s.style.lineHeight = `${this._renderService.dimensions.css.cell.height}px`;
          const a = (t = e.options.x) !== null && t !== void 0 ? t : 0;
          return a && a > this._bufferService.cols && (s.style.display = "none"), this._refreshXPosition(e, s), s;
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
          const s = (t = e.options.x) !== null && t !== void 0 ? t : 0;
          (e.options.anchor || "left") === "right" ? i.style.right = s ? s * this._renderService.dimensions.css.cell.width + "px" : "" : i.style.left = s ? s * this._renderService.dimensions.css.cell.width + "px" : "";
        }
        _removeDecoration(e) {
          var i;
          (i = this._decorationElements.get(e)) === null || i === void 0 || i.remove(), this._decorationElements.delete(e), e.dispose();
        }
      };
      r.BufferDecorationRenderer = d = c([_(1, g.IBufferService), _(2, g.IDecorationService), _(3, u.IRenderService)], d);
    }, 5871: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.ColorZoneStore = void 0, r.ColorZoneStore = class {
        constructor() {
          this._zones = [], this._zonePool = [], this._zonePoolIndex = 0, this._linePadding = { full: 0, left: 0, center: 0, right: 0 };
        }
        get zones() {
          return this._zonePool.length = Math.min(this._zonePool.length, this._zones.length), this._zones;
        }
        clear() {
          this._zones.length = 0, this._zonePoolIndex = 0;
        }
        addDecoration(o) {
          if (o.options.overviewRulerOptions) {
            for (const c of this._zones) if (c.color === o.options.overviewRulerOptions.color && c.position === o.options.overviewRulerOptions.position) {
              if (this._lineIntersectsZone(c, o.marker.line)) return;
              if (this._lineAdjacentToZone(c, o.marker.line, o.options.overviewRulerOptions.position)) return void this._addLineToZone(c, o.marker.line);
            }
            if (this._zonePoolIndex < this._zonePool.length) return this._zonePool[this._zonePoolIndex].color = o.options.overviewRulerOptions.color, this._zonePool[this._zonePoolIndex].position = o.options.overviewRulerOptions.position, this._zonePool[this._zonePoolIndex].startBufferLine = o.marker.line, this._zonePool[this._zonePoolIndex].endBufferLine = o.marker.line, void this._zones.push(this._zonePool[this._zonePoolIndex++]);
            this._zones.push({ color: o.options.overviewRulerOptions.color, position: o.options.overviewRulerOptions.position, startBufferLine: o.marker.line, endBufferLine: o.marker.line }), this._zonePool.push(this._zones[this._zones.length - 1]), this._zonePoolIndex++;
          }
        }
        setPadding(o) {
          this._linePadding = o;
        }
        _lineIntersectsZone(o, c) {
          return c >= o.startBufferLine && c <= o.endBufferLine;
        }
        _lineAdjacentToZone(o, c, _) {
          return c >= o.startBufferLine - this._linePadding[_ || "full"] && c <= o.endBufferLine + this._linePadding[_ || "full"];
        }
        _addLineToZone(o, c) {
          o.startBufferLine = Math.min(o.startBufferLine, c), o.endBufferLine = Math.max(o.endBufferLine, c);
        }
      };
    }, 5744: function(B, r, o) {
      var c = this && this.__decorate || function(a, l, f, m) {
        var h, p = arguments.length, b = p < 3 ? l : m === null ? m = Object.getOwnPropertyDescriptor(l, f) : m;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") b = Reflect.decorate(a, l, f, m);
        else for (var x = a.length - 1; x >= 0; x--) (h = a[x]) && (b = (p < 3 ? h(b) : p > 3 ? h(l, f, b) : h(l, f)) || b);
        return p > 3 && b && Object.defineProperty(l, f, b), b;
      }, _ = this && this.__param || function(a, l) {
        return function(f, m) {
          l(f, m, a);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.OverviewRulerRenderer = void 0;
      const n = o(5871), u = o(3656), v = o(4725), g = o(844), d = o(2585), e = { full: 0, left: 0, center: 0, right: 0 }, i = { full: 0, left: 0, center: 0, right: 0 }, t = { full: 0, left: 0, center: 0, right: 0 };
      let s = r.OverviewRulerRenderer = class extends g.Disposable {
        get _width() {
          return this._optionsService.options.overviewRulerWidth || 0;
        }
        constructor(a, l, f, m, h, p, b) {
          var x;
          super(), this._viewportElement = a, this._screenElement = l, this._bufferService = f, this._decorationService = m, this._renderService = h, this._optionsService = p, this._coreBrowseService = b, this._colorZoneStore = new n.ColorZoneStore(), this._shouldUpdateDimensions = !0, this._shouldUpdateAnchor = !0, this._lastKnownBufferLength = 0, this._canvas = document.createElement("canvas"), this._canvas.classList.add("xterm-decoration-overview-ruler"), this._refreshCanvasDimensions(), (x = this._viewportElement.parentElement) === null || x === void 0 || x.insertBefore(this._canvas, this._viewportElement);
          const y = this._canvas.getContext("2d");
          if (!y) throw new Error("Ctx cannot be null");
          this._ctx = y, this._registerDecorationListeners(), this._registerBufferChangeListeners(), this._registerDimensionChangeListeners(), this.register((0, g.toDisposable)(() => {
            var k;
            (k = this._canvas) === null || k === void 0 || k.remove();
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
          })), this.register(this._optionsService.onSpecificOptionChange("overviewRulerWidth", () => this._queueRefresh(!0))), this.register((0, u.addDisposableDomListener)(this._coreBrowseService.window, "resize", () => this._queueRefresh(!0))), this._queueRefresh(!0);
        }
        _refreshDrawConstants() {
          const a = Math.floor(this._canvas.width / 3), l = Math.ceil(this._canvas.width / 3);
          i.full = this._canvas.width, i.left = a, i.center = l, i.right = a, this._refreshDrawHeightConstants(), t.full = 0, t.left = 0, t.center = i.left, t.right = i.left + i.center;
        }
        _refreshDrawHeightConstants() {
          e.full = Math.round(2 * this._coreBrowseService.dpr);
          const a = this._canvas.height / this._bufferService.buffer.lines.length, l = Math.round(Math.max(Math.min(a, 12), 6) * this._coreBrowseService.dpr);
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
          const a = this._colorZoneStore.zones;
          for (const l of a) l.position !== "full" && this._renderColorZone(l);
          for (const l of a) l.position === "full" && this._renderColorZone(l);
          this._shouldUpdateDimensions = !1, this._shouldUpdateAnchor = !1;
        }
        _renderColorZone(a) {
          this._ctx.fillStyle = a.color, this._ctx.fillRect(t[a.position || "full"], Math.round((this._canvas.height - 1) * (a.startBufferLine / this._bufferService.buffers.active.lines.length) - e[a.position || "full"] / 2), i[a.position || "full"], Math.round((this._canvas.height - 1) * ((a.endBufferLine - a.startBufferLine) / this._bufferService.buffers.active.lines.length) + e[a.position || "full"]));
        }
        _queueRefresh(a, l) {
          this._shouldUpdateDimensions = a || this._shouldUpdateDimensions, this._shouldUpdateAnchor = l || this._shouldUpdateAnchor, this._animationFrame === void 0 && (this._animationFrame = this._coreBrowseService.window.requestAnimationFrame(() => {
            this._refreshDecorations(), this._animationFrame = void 0;
          }));
        }
      };
      r.OverviewRulerRenderer = s = c([_(2, d.IBufferService), _(3, d.IDecorationService), _(4, v.IRenderService), _(5, d.IOptionsService), _(6, v.ICoreBrowserService)], s);
    }, 2950: function(B, r, o) {
      var c = this && this.__decorate || function(d, e, i, t) {
        var s, a = arguments.length, l = a < 3 ? e : t === null ? t = Object.getOwnPropertyDescriptor(e, i) : t;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") l = Reflect.decorate(d, e, i, t);
        else for (var f = d.length - 1; f >= 0; f--) (s = d[f]) && (l = (a < 3 ? s(l) : a > 3 ? s(e, i, l) : s(e, i)) || l);
        return a > 3 && l && Object.defineProperty(e, i, l), l;
      }, _ = this && this.__param || function(d, e) {
        return function(i, t) {
          e(i, t, d);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CompositionHelper = void 0;
      const n = o(4725), u = o(2585), v = o(2584);
      let g = r.CompositionHelper = class {
        get isComposing() {
          return this._isComposing;
        }
        constructor(d, e, i, t, s, a) {
          this._textarea = d, this._compositionView = e, this._bufferService = i, this._optionsService = t, this._coreService = s, this._renderService = a, this._isComposing = !1, this._isSendingComposition = !1, this._compositionPosition = { start: 0, end: 0 }, this._dataAlreadySent = "";
        }
        compositionstart() {
          this._isComposing = !0, this._compositionPosition.start = this._textarea.value.length, this._compositionView.textContent = "", this._dataAlreadySent = "", this._compositionView.classList.add("active");
        }
        compositionupdate(d) {
          this._compositionView.textContent = d.data, this.updateCompositionElements(), setTimeout(() => {
            this._compositionPosition.end = this._textarea.value.length;
          }, 0);
        }
        compositionend() {
          this._finalizeComposition(!0);
        }
        keydown(d) {
          if (this._isComposing || this._isSendingComposition) {
            if (d.keyCode === 229 || d.keyCode === 16 || d.keyCode === 17 || d.keyCode === 18) return !1;
            this._finalizeComposition(!1);
          }
          return d.keyCode !== 229 || (this._handleAnyTextareaChanges(), !1);
        }
        _finalizeComposition(d) {
          if (this._compositionView.classList.remove("active"), this._isComposing = !1, d) {
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
          const d = this._textarea.value;
          setTimeout(() => {
            if (!this._isComposing) {
              const e = this._textarea.value, i = e.replace(d, "");
              this._dataAlreadySent = i, e.length > d.length ? this._coreService.triggerDataEvent(i, !0) : e.length < d.length ? this._coreService.triggerDataEvent(`${v.C0.DEL}`, !0) : e.length === d.length && e !== d && this._coreService.triggerDataEvent(e, !0);
            }
          }, 0);
        }
        updateCompositionElements(d) {
          if (this._isComposing) {
            if (this._bufferService.buffer.isCursorInViewport) {
              const e = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1), i = this._renderService.dimensions.css.cell.height, t = this._bufferService.buffer.y * this._renderService.dimensions.css.cell.height, s = e * this._renderService.dimensions.css.cell.width;
              this._compositionView.style.left = s + "px", this._compositionView.style.top = t + "px", this._compositionView.style.height = i + "px", this._compositionView.style.lineHeight = i + "px", this._compositionView.style.fontFamily = this._optionsService.rawOptions.fontFamily, this._compositionView.style.fontSize = this._optionsService.rawOptions.fontSize + "px";
              const a = this._compositionView.getBoundingClientRect();
              this._textarea.style.left = s + "px", this._textarea.style.top = t + "px", this._textarea.style.width = Math.max(a.width, 1) + "px", this._textarea.style.height = Math.max(a.height, 1) + "px", this._textarea.style.lineHeight = a.height + "px";
            }
            d || setTimeout(() => this.updateCompositionElements(!0), 0);
          }
        }
      };
      r.CompositionHelper = g = c([_(2, u.IBufferService), _(3, u.IOptionsService), _(4, u.ICoreService), _(5, n.IRenderService)], g);
    }, 9806: (B, r) => {
      function o(c, _, n) {
        const u = n.getBoundingClientRect(), v = c.getComputedStyle(n), g = parseInt(v.getPropertyValue("padding-left")), d = parseInt(v.getPropertyValue("padding-top"));
        return [_.clientX - u.left - g, _.clientY - u.top - d];
      }
      Object.defineProperty(r, "__esModule", { value: !0 }), r.getCoords = r.getCoordsRelativeToElement = void 0, r.getCoordsRelativeToElement = o, r.getCoords = function(c, _, n, u, v, g, d, e, i) {
        if (!g) return;
        const t = o(c, _, n);
        return t ? (t[0] = Math.ceil((t[0] + (i ? d / 2 : 0)) / d), t[1] = Math.ceil(t[1] / e), t[0] = Math.min(Math.max(t[0], 1), u + (i ? 1 : 0)), t[1] = Math.min(Math.max(t[1], 1), v), t) : void 0;
      };
    }, 9504: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.moveToCellSequence = void 0;
      const c = o(2584);
      function _(e, i, t, s) {
        const a = e - n(e, t), l = i - n(i, t), f = Math.abs(a - l) - function(m, h, p) {
          let b = 0;
          const x = m - n(m, p), y = h - n(h, p);
          for (let k = 0; k < Math.abs(x - y); k++) {
            const D = u(m, h) === "A" ? -1 : 1, M = p.buffer.lines.get(x + D * k);
            M != null && M.isWrapped && b++;
          }
          return b;
        }(e, i, t);
        return d(f, g(u(e, i), s));
      }
      function n(e, i) {
        let t = 0, s = i.buffer.lines.get(e), a = s == null ? void 0 : s.isWrapped;
        for (; a && e >= 0 && e < i.rows; ) t++, s = i.buffer.lines.get(--e), a = s == null ? void 0 : s.isWrapped;
        return t;
      }
      function u(e, i) {
        return e > i ? "A" : "B";
      }
      function v(e, i, t, s, a, l) {
        let f = e, m = i, h = "";
        for (; f !== t || m !== s; ) f += a ? 1 : -1, a && f > l.cols - 1 ? (h += l.buffer.translateBufferLineToString(m, !1, e, f), f = 0, e = 0, m++) : !a && f < 0 && (h += l.buffer.translateBufferLineToString(m, !1, 0, e + 1), f = l.cols - 1, e = f, m--);
        return h + l.buffer.translateBufferLineToString(m, !1, e, f);
      }
      function g(e, i) {
        const t = i ? "O" : "[";
        return c.C0.ESC + t + e;
      }
      function d(e, i) {
        e = Math.floor(e);
        let t = "";
        for (let s = 0; s < e; s++) t += i;
        return t;
      }
      r.moveToCellSequence = function(e, i, t, s) {
        const a = t.buffer.x, l = t.buffer.y;
        if (!t.buffer.hasScrollback) return function(h, p, b, x, y, k) {
          return _(p, x, y, k).length === 0 ? "" : d(v(h, p, h, p - n(p, y), !1, y).length, g("D", k));
        }(a, l, 0, i, t, s) + _(l, i, t, s) + function(h, p, b, x, y, k) {
          let D;
          D = _(p, x, y, k).length > 0 ? x - n(x, y) : p;
          const M = x, P = function(O, C, w, E, L, I) {
            let H;
            return H = _(w, E, L, I).length > 0 ? E - n(E, L) : C, O < w && H <= E || O >= w && H < E ? "C" : "D";
          }(h, p, b, x, y, k);
          return d(v(h, D, b, M, P === "C", y).length, g(P, k));
        }(a, l, e, i, t, s);
        let f;
        if (l === i) return f = a > e ? "D" : "C", d(Math.abs(a - e), g(f, s));
        f = l > i ? "D" : "C";
        const m = Math.abs(l - i);
        return d(function(h, p) {
          return p.cols - h;
        }(l > i ? e : a, t) + (m - 1) * t.cols + 1 + ((l > i ? a : e) - 1), g(f, s));
      };
    }, 1296: function(B, r, o) {
      var c = this && this.__decorate || function(y, k, D, M) {
        var P, O = arguments.length, C = O < 3 ? k : M === null ? M = Object.getOwnPropertyDescriptor(k, D) : M;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") C = Reflect.decorate(y, k, D, M);
        else for (var w = y.length - 1; w >= 0; w--) (P = y[w]) && (C = (O < 3 ? P(C) : O > 3 ? P(k, D, C) : P(k, D)) || C);
        return O > 3 && C && Object.defineProperty(k, D, C), C;
      }, _ = this && this.__param || function(y, k) {
        return function(D, M) {
          k(D, M, y);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.DomRenderer = void 0;
      const n = o(3787), u = o(2550), v = o(2223), g = o(6171), d = o(4725), e = o(8055), i = o(8460), t = o(844), s = o(2585), a = "xterm-dom-renderer-owner-", l = "xterm-rows", f = "xterm-fg-", m = "xterm-bg-", h = "xterm-focus", p = "xterm-selection";
      let b = 1, x = r.DomRenderer = class extends t.Disposable {
        constructor(y, k, D, M, P, O, C, w, E, L) {
          super(), this._element = y, this._screenElement = k, this._viewportElement = D, this._linkifier2 = M, this._charSizeService = O, this._optionsService = C, this._bufferService = w, this._coreBrowserService = E, this._themeService = L, this._terminalClass = b++, this._rowElements = [], this.onRequestRedraw = this.register(new i.EventEmitter()).event, this._rowContainer = document.createElement("div"), this._rowContainer.classList.add(l), this._rowContainer.style.lineHeight = "normal", this._rowContainer.setAttribute("aria-hidden", "true"), this._refreshRowElements(this._bufferService.cols, this._bufferService.rows), this._selectionContainer = document.createElement("div"), this._selectionContainer.classList.add(p), this._selectionContainer.setAttribute("aria-hidden", "true"), this.dimensions = (0, g.createRenderDimensions)(), this._updateDimensions(), this.register(this._optionsService.onOptionChange(() => this._handleOptionsChanged())), this.register(this._themeService.onChangeColors((I) => this._injectCss(I))), this._injectCss(this._themeService.colors), this._rowFactory = P.createInstance(n.DomRendererRowFactory, document), this._element.classList.add(a + this._terminalClass), this._screenElement.appendChild(this._rowContainer), this._screenElement.appendChild(this._selectionContainer), this.register(this._linkifier2.onShowLinkUnderline((I) => this._handleLinkHover(I))), this.register(this._linkifier2.onHideLinkUnderline((I) => this._handleLinkLeave(I))), this.register((0, t.toDisposable)(() => {
            this._element.classList.remove(a + this._terminalClass), this._rowContainer.remove(), this._selectionContainer.remove(), this._widthCache.dispose(), this._themeStyleElement.remove(), this._dimensionsStyleElement.remove();
          })), this._widthCache = new u.WidthCache(document), this._widthCache.setFont(this._optionsService.rawOptions.fontFamily, this._optionsService.rawOptions.fontSize, this._optionsService.rawOptions.fontWeight, this._optionsService.rawOptions.fontWeightBold), this._setDefaultSpacing();
        }
        _updateDimensions() {
          const y = this._coreBrowserService.dpr;
          this.dimensions.device.char.width = this._charSizeService.width * y, this.dimensions.device.char.height = Math.ceil(this._charSizeService.height * y), this.dimensions.device.cell.width = this.dimensions.device.char.width + Math.round(this._optionsService.rawOptions.letterSpacing), this.dimensions.device.cell.height = Math.floor(this.dimensions.device.char.height * this._optionsService.rawOptions.lineHeight), this.dimensions.device.char.left = 0, this.dimensions.device.char.top = 0, this.dimensions.device.canvas.width = this.dimensions.device.cell.width * this._bufferService.cols, this.dimensions.device.canvas.height = this.dimensions.device.cell.height * this._bufferService.rows, this.dimensions.css.canvas.width = Math.round(this.dimensions.device.canvas.width / y), this.dimensions.css.canvas.height = Math.round(this.dimensions.device.canvas.height / y), this.dimensions.css.cell.width = this.dimensions.css.canvas.width / this._bufferService.cols, this.dimensions.css.cell.height = this.dimensions.css.canvas.height / this._bufferService.rows;
          for (const D of this._rowElements) D.style.width = `${this.dimensions.css.canvas.width}px`, D.style.height = `${this.dimensions.css.cell.height}px`, D.style.lineHeight = `${this.dimensions.css.cell.height}px`, D.style.overflow = "hidden";
          this._dimensionsStyleElement || (this._dimensionsStyleElement = document.createElement("style"), this._screenElement.appendChild(this._dimensionsStyleElement));
          const k = `${this._terminalSelector} .${l} span { display: inline-block; height: 100%; vertical-align: top;}`;
          this._dimensionsStyleElement.textContent = k, this._selectionContainer.style.height = this._viewportElement.style.height, this._screenElement.style.width = `${this.dimensions.css.canvas.width}px`, this._screenElement.style.height = `${this.dimensions.css.canvas.height}px`;
        }
        _injectCss(y) {
          this._themeStyleElement || (this._themeStyleElement = document.createElement("style"), this._screenElement.appendChild(this._themeStyleElement));
          let k = `${this._terminalSelector} .${l} { color: ${y.foreground.css}; font-family: ${this._optionsService.rawOptions.fontFamily}; font-size: ${this._optionsService.rawOptions.fontSize}px; font-kerning: none; white-space: pre}`;
          k += `${this._terminalSelector} .${l} .xterm-dim { color: ${e.color.multiplyOpacity(y.foreground, 0.5).css};}`, k += `${this._terminalSelector} span:not(.xterm-bold) { font-weight: ${this._optionsService.rawOptions.fontWeight};}${this._terminalSelector} span.xterm-bold { font-weight: ${this._optionsService.rawOptions.fontWeightBold};}${this._terminalSelector} span.xterm-italic { font-style: italic;}`, k += "@keyframes blink_box_shadow_" + this._terminalClass + " { 50% {  border-bottom-style: hidden; }}", k += "@keyframes blink_block_" + this._terminalClass + ` { 0% {  background-color: ${y.cursor.css};  color: ${y.cursorAccent.css}; } 50% {  background-color: inherit;  color: ${y.cursor.css}; }}`, k += `${this._terminalSelector} .${l}.${h} .xterm-cursor.xterm-cursor-blink:not(.xterm-cursor-block) { animation: blink_box_shadow_` + this._terminalClass + ` 1s step-end infinite;}${this._terminalSelector} .${l}.${h} .xterm-cursor.xterm-cursor-blink.xterm-cursor-block { animation: blink_block_` + this._terminalClass + ` 1s step-end infinite;}${this._terminalSelector} .${l} .xterm-cursor.xterm-cursor-block { background-color: ${y.cursor.css}; color: ${y.cursorAccent.css};}${this._terminalSelector} .${l} .xterm-cursor.xterm-cursor-outline { outline: 1px solid ${y.cursor.css}; outline-offset: -1px;}${this._terminalSelector} .${l} .xterm-cursor.xterm-cursor-bar { box-shadow: ${this._optionsService.rawOptions.cursorWidth}px 0 0 ${y.cursor.css} inset;}${this._terminalSelector} .${l} .xterm-cursor.xterm-cursor-underline { border-bottom: 1px ${y.cursor.css}; border-bottom-style: solid; height: calc(100% - 1px);}`, k += `${this._terminalSelector} .${p} { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;}${this._terminalSelector}.focus .${p} div { position: absolute; background-color: ${y.selectionBackgroundOpaque.css};}${this._terminalSelector} .${p} div { position: absolute; background-color: ${y.selectionInactiveBackgroundOpaque.css};}`;
          for (const [D, M] of y.ansi.entries()) k += `${this._terminalSelector} .${f}${D} { color: ${M.css}; }${this._terminalSelector} .${f}${D}.xterm-dim { color: ${e.color.multiplyOpacity(M, 0.5).css}; }${this._terminalSelector} .${m}${D} { background-color: ${M.css}; }`;
          k += `${this._terminalSelector} .${f}${v.INVERTED_DEFAULT_COLOR} { color: ${e.color.opaque(y.background).css}; }${this._terminalSelector} .${f}${v.INVERTED_DEFAULT_COLOR}.xterm-dim { color: ${e.color.multiplyOpacity(e.color.opaque(y.background), 0.5).css}; }${this._terminalSelector} .${m}${v.INVERTED_DEFAULT_COLOR} { background-color: ${y.foreground.css}; }`, this._themeStyleElement.textContent = k;
        }
        _setDefaultSpacing() {
          const y = this.dimensions.css.cell.width - this._widthCache.get("W", !1, !1);
          this._rowContainer.style.letterSpacing = `${y}px`, this._rowFactory.defaultSpacing = y;
        }
        handleDevicePixelRatioChange() {
          this._updateDimensions(), this._widthCache.clear(), this._setDefaultSpacing();
        }
        _refreshRowElements(y, k) {
          for (let D = this._rowElements.length; D <= k; D++) {
            const M = document.createElement("div");
            this._rowContainer.appendChild(M), this._rowElements.push(M);
          }
          for (; this._rowElements.length > k; ) this._rowContainer.removeChild(this._rowElements.pop());
        }
        handleResize(y, k) {
          this._refreshRowElements(y, k), this._updateDimensions();
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
        handleSelectionChanged(y, k, D) {
          if (this._selectionContainer.replaceChildren(), this._rowFactory.handleSelectionChanged(y, k, D), this.renderRows(0, this._bufferService.rows - 1), !y || !k) return;
          const M = y[1] - this._bufferService.buffer.ydisp, P = k[1] - this._bufferService.buffer.ydisp, O = Math.max(M, 0), C = Math.min(P, this._bufferService.rows - 1);
          if (O >= this._bufferService.rows || C < 0) return;
          const w = document.createDocumentFragment();
          if (D) {
            const E = y[0] > k[0];
            w.appendChild(this._createSelectionElement(O, E ? k[0] : y[0], E ? y[0] : k[0], C - O + 1));
          } else {
            const E = M === O ? y[0] : 0, L = O === P ? k[0] : this._bufferService.cols;
            w.appendChild(this._createSelectionElement(O, E, L));
            const I = C - O - 1;
            if (w.appendChild(this._createSelectionElement(O + 1, 0, this._bufferService.cols, I)), O !== C) {
              const H = P === C ? k[0] : this._bufferService.cols;
              w.appendChild(this._createSelectionElement(C, 0, H));
            }
          }
          this._selectionContainer.appendChild(w);
        }
        _createSelectionElement(y, k, D, M = 1) {
          const P = document.createElement("div");
          return P.style.height = M * this.dimensions.css.cell.height + "px", P.style.top = y * this.dimensions.css.cell.height + "px", P.style.left = k * this.dimensions.css.cell.width + "px", P.style.width = this.dimensions.css.cell.width * (D - k) + "px", P;
        }
        handleCursorMove() {
        }
        _handleOptionsChanged() {
          this._updateDimensions(), this._injectCss(this._themeService.colors), this._widthCache.setFont(this._optionsService.rawOptions.fontFamily, this._optionsService.rawOptions.fontSize, this._optionsService.rawOptions.fontWeight, this._optionsService.rawOptions.fontWeightBold), this._setDefaultSpacing();
        }
        clear() {
          for (const y of this._rowElements) y.replaceChildren();
        }
        renderRows(y, k) {
          const D = this._bufferService.buffer, M = D.ybase + D.y, P = Math.min(D.x, this._bufferService.cols - 1), O = this._optionsService.rawOptions.cursorBlink, C = this._optionsService.rawOptions.cursorStyle, w = this._optionsService.rawOptions.cursorInactiveStyle;
          for (let E = y; E <= k; E++) {
            const L = E + D.ydisp, I = this._rowElements[E], H = D.lines.get(L);
            if (!I || !H) break;
            I.replaceChildren(...this._rowFactory.createRow(H, L, L === M, C, w, P, O, this.dimensions.css.cell.width, this._widthCache, -1, -1));
          }
        }
        get _terminalSelector() {
          return `.${a}${this._terminalClass}`;
        }
        _handleLinkHover(y) {
          this._setCellUnderline(y.x1, y.x2, y.y1, y.y2, y.cols, !0);
        }
        _handleLinkLeave(y) {
          this._setCellUnderline(y.x1, y.x2, y.y1, y.y2, y.cols, !1);
        }
        _setCellUnderline(y, k, D, M, P, O) {
          D < 0 && (y = 0), M < 0 && (k = 0);
          const C = this._bufferService.rows - 1;
          D = Math.max(Math.min(D, C), 0), M = Math.max(Math.min(M, C), 0), P = Math.min(P, this._bufferService.cols);
          const w = this._bufferService.buffer, E = w.ybase + w.y, L = Math.min(w.x, P - 1), I = this._optionsService.rawOptions.cursorBlink, H = this._optionsService.rawOptions.cursorStyle, W = this._optionsService.rawOptions.cursorInactiveStyle;
          for (let N = D; N <= M; ++N) {
            const X = N + w.ydisp, S = this._rowElements[N], R = w.lines.get(X);
            if (!S || !R) break;
            S.replaceChildren(...this._rowFactory.createRow(R, X, X === E, H, W, L, I, this.dimensions.css.cell.width, this._widthCache, O ? N === D ? y : 0 : -1, O ? (N === M ? k : P) - 1 : -1));
          }
        }
      };
      r.DomRenderer = x = c([_(4, s.IInstantiationService), _(5, d.ICharSizeService), _(6, s.IOptionsService), _(7, s.IBufferService), _(8, d.ICoreBrowserService), _(9, d.IThemeService)], x);
    }, 3787: function(B, r, o) {
      var c = this && this.__decorate || function(f, m, h, p) {
        var b, x = arguments.length, y = x < 3 ? m : p === null ? p = Object.getOwnPropertyDescriptor(m, h) : p;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") y = Reflect.decorate(f, m, h, p);
        else for (var k = f.length - 1; k >= 0; k--) (b = f[k]) && (y = (x < 3 ? b(y) : x > 3 ? b(m, h, y) : b(m, h)) || y);
        return x > 3 && y && Object.defineProperty(m, h, y), y;
      }, _ = this && this.__param || function(f, m) {
        return function(h, p) {
          m(h, p, f);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.DomRendererRowFactory = void 0;
      const n = o(2223), u = o(643), v = o(511), g = o(2585), d = o(8055), e = o(4725), i = o(4269), t = o(6171), s = o(3734);
      let a = r.DomRendererRowFactory = class {
        constructor(f, m, h, p, b, x, y) {
          this._document = f, this._characterJoinerService = m, this._optionsService = h, this._coreBrowserService = p, this._coreService = b, this._decorationService = x, this._themeService = y, this._workCell = new v.CellData(), this._columnSelectMode = !1, this.defaultSpacing = 0;
        }
        handleSelectionChanged(f, m, h) {
          this._selectionStart = f, this._selectionEnd = m, this._columnSelectMode = h;
        }
        createRow(f, m, h, p, b, x, y, k, D, M, P) {
          const O = [], C = this._characterJoinerService.getJoinedCharacters(m), w = this._themeService.colors;
          let E, L = f.getNoBgTrimmedLength();
          h && L < x + 1 && (L = x + 1);
          let I = 0, H = "", W = 0, N = 0, X = 0, S = !1, R = 0, T = !1, A = 0;
          const j = [], F = M !== -1 && P !== -1;
          for (let q = 0; q < L; q++) {
            f.loadCell(q, this._workCell);
            let ee = this._workCell.getWidth();
            if (ee === 0) continue;
            let te = !1, he = q, $ = this._workCell;
            if (C.length > 0 && q === C[0][0]) {
              te = !0;
              const J = C.shift();
              $ = new i.JoinedCellData(this._workCell, f.translateToString(!0, J[0], J[1]), J[1] - J[0]), he = J[1] - 1, ee = $.getWidth();
            }
            const le = this._isCellInSelection(q, m), ve = h && q === x, pe = F && q >= M && q <= P;
            let ge = !1;
            this._decorationService.forEachDecorationAtCell(q, m, void 0, (J) => {
              ge = !0;
            });
            let _e = $.getChars() || u.WHITESPACE_CELL_CHAR;
            if (_e === " " && ($.isUnderline() || $.isOverline()) && (_e = " "), A = ee * k - D.get(_e, $.isBold(), $.isItalic()), E) {
              if (I && (le && T || !le && !T && $.bg === W) && (le && T && w.selectionForeground || $.fg === N) && $.extended.ext === X && pe === S && A === R && !ve && !te && !ge) {
                H += _e, I++;
                continue;
              }
              I && (E.textContent = H), E = this._document.createElement("span"), I = 0, H = "";
            } else E = this._document.createElement("span");
            if (W = $.bg, N = $.fg, X = $.extended.ext, S = pe, R = A, T = le, te && x >= q && x <= he && (x = q), !this._coreService.isCursorHidden && ve) {
              if (j.push("xterm-cursor"), this._coreBrowserService.isFocused) y && j.push("xterm-cursor-blink"), j.push(p === "bar" ? "xterm-cursor-bar" : p === "underline" ? "xterm-cursor-underline" : "xterm-cursor-block");
              else if (b) switch (b) {
                case "outline":
                  j.push("xterm-cursor-outline");
                  break;
                case "block":
                  j.push("xterm-cursor-block");
                  break;
                case "bar":
                  j.push("xterm-cursor-bar");
                  break;
                case "underline":
                  j.push("xterm-cursor-underline");
              }
            }
            if ($.isBold() && j.push("xterm-bold"), $.isItalic() && j.push("xterm-italic"), $.isDim() && j.push("xterm-dim"), H = $.isInvisible() ? u.WHITESPACE_CELL_CHAR : $.getChars() || u.WHITESPACE_CELL_CHAR, $.isUnderline() && (j.push(`xterm-underline-${$.extended.underlineStyle}`), H === " " && (H = " "), !$.isUnderlineColorDefault())) if ($.isUnderlineColorRGB()) E.style.textDecorationColor = `rgb(${s.AttributeData.toColorRGB($.getUnderlineColor()).join(",")})`;
            else {
              let J = $.getUnderlineColor();
              this._optionsService.rawOptions.drawBoldTextInBrightColors && $.isBold() && J < 8 && (J += 8), E.style.textDecorationColor = w.ansi[J].css;
            }
            $.isOverline() && (j.push("xterm-overline"), H === " " && (H = " ")), $.isStrikethrough() && j.push("xterm-strikethrough"), pe && (E.style.textDecoration = "underline");
            let se = $.getFgColor(), ce = $.getFgColorMode(), re = $.getBgColor(), de = $.getBgColorMode();
            const me = !!$.isInverse();
            if (me) {
              const J = se;
              se = re, re = J;
              const Re = ce;
              ce = de, de = Re;
            }
            let ne, Se, oe, ue = !1;
            switch (this._decorationService.forEachDecorationAtCell(q, m, void 0, (J) => {
              J.options.layer !== "top" && ue || (J.backgroundColorRGB && (de = 50331648, re = J.backgroundColorRGB.rgba >> 8 & 16777215, ne = J.backgroundColorRGB), J.foregroundColorRGB && (ce = 50331648, se = J.foregroundColorRGB.rgba >> 8 & 16777215, Se = J.foregroundColorRGB), ue = J.options.layer === "top");
            }), !ue && le && (ne = this._coreBrowserService.isFocused ? w.selectionBackgroundOpaque : w.selectionInactiveBackgroundOpaque, re = ne.rgba >> 8 & 16777215, de = 50331648, ue = !0, w.selectionForeground && (ce = 50331648, se = w.selectionForeground.rgba >> 8 & 16777215, Se = w.selectionForeground)), ue && j.push("xterm-decoration-top"), de) {
              case 16777216:
              case 33554432:
                oe = w.ansi[re], j.push(`xterm-bg-${re}`);
                break;
              case 50331648:
                oe = d.rgba.toColor(re >> 16, re >> 8 & 255, 255 & re), this._addStyle(E, `background-color:#${l((re >>> 0).toString(16), "0", 6)}`);
                break;
              default:
                me ? (oe = w.foreground, j.push(`xterm-bg-${n.INVERTED_DEFAULT_COLOR}`)) : oe = w.background;
            }
            switch (ne || $.isDim() && (ne = d.color.multiplyOpacity(oe, 0.5)), ce) {
              case 16777216:
              case 33554432:
                $.isBold() && se < 8 && this._optionsService.rawOptions.drawBoldTextInBrightColors && (se += 8), this._applyMinimumContrast(E, oe, w.ansi[se], $, ne, void 0) || j.push(`xterm-fg-${se}`);
                break;
              case 50331648:
                const J = d.rgba.toColor(se >> 16 & 255, se >> 8 & 255, 255 & se);
                this._applyMinimumContrast(E, oe, J, $, ne, Se) || this._addStyle(E, `color:#${l(se.toString(16), "0", 6)}`);
                break;
              default:
                this._applyMinimumContrast(E, oe, w.foreground, $, ne, void 0) || me && j.push(`xterm-fg-${n.INVERTED_DEFAULT_COLOR}`);
            }
            j.length && (E.className = j.join(" "), j.length = 0), ve || te || ge ? E.textContent = H : I++, A !== this.defaultSpacing && (E.style.letterSpacing = `${A}px`), O.push(E), q = he;
          }
          return E && I && (E.textContent = H), O;
        }
        _applyMinimumContrast(f, m, h, p, b, x) {
          if (this._optionsService.rawOptions.minimumContrastRatio === 1 || (0, t.excludeFromContrastRatioDemands)(p.getCode())) return !1;
          const y = this._getContrastCache(p);
          let k;
          if (b || x || (k = y.getColor(m.rgba, h.rgba)), k === void 0) {
            const D = this._optionsService.rawOptions.minimumContrastRatio / (p.isDim() ? 2 : 1);
            k = d.color.ensureContrastRatio(b || m, x || h, D), y.setColor((b || m).rgba, (x || h).rgba, k ?? null);
          }
          return !!k && (this._addStyle(f, `color:${k.css}`), !0);
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
      r.DomRendererRowFactory = a = c([_(1, e.ICharacterJoinerService), _(2, g.IOptionsService), _(3, e.ICoreBrowserService), _(4, g.ICoreService), _(5, g.IDecorationService), _(6, e.IThemeService)], a);
    }, 2550: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.WidthCache = void 0, r.WidthCache = class {
        constructor(o) {
          this._flat = new Float32Array(256), this._font = "", this._fontSize = 0, this._weight = "normal", this._weightBold = "bold", this._measureElements = [], this._container = o.createElement("div"), this._container.style.position = "absolute", this._container.style.top = "-50000px", this._container.style.width = "50000px", this._container.style.whiteSpace = "pre", this._container.style.fontKerning = "none";
          const c = o.createElement("span"), _ = o.createElement("span");
          _.style.fontWeight = "bold";
          const n = o.createElement("span");
          n.style.fontStyle = "italic";
          const u = o.createElement("span");
          u.style.fontWeight = "bold", u.style.fontStyle = "italic", this._measureElements = [c, _, n, u], this._container.appendChild(c), this._container.appendChild(_), this._container.appendChild(n), this._container.appendChild(u), o.body.appendChild(this._container), this.clear();
        }
        dispose() {
          this._container.remove(), this._measureElements.length = 0, this._holey = void 0;
        }
        clear() {
          this._flat.fill(-9999), this._holey = /* @__PURE__ */ new Map();
        }
        setFont(o, c, _, n) {
          o === this._font && c === this._fontSize && _ === this._weight && n === this._weightBold || (this._font = o, this._fontSize = c, this._weight = _, this._weightBold = n, this._container.style.fontFamily = this._font, this._container.style.fontSize = `${this._fontSize}px`, this._measureElements[0].style.fontWeight = `${_}`, this._measureElements[1].style.fontWeight = `${n}`, this._measureElements[2].style.fontWeight = `${_}`, this._measureElements[3].style.fontWeight = `${n}`, this.clear());
        }
        get(o, c, _) {
          let n = 0;
          if (!c && !_ && o.length === 1 && (n = o.charCodeAt(0)) < 256) return this._flat[n] !== -9999 ? this._flat[n] : this._flat[n] = this._measure(o, 0);
          let u = o;
          c && (u += "B"), _ && (u += "I");
          let v = this._holey.get(u);
          if (v === void 0) {
            let g = 0;
            c && (g |= 1), _ && (g |= 2), v = this._measure(o, g), this._holey.set(u, v);
          }
          return v;
        }
        _measure(o, c) {
          const _ = this._measureElements[c];
          return _.textContent = o.repeat(32), _.offsetWidth / 32;
        }
      };
    }, 2223: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.TEXT_BASELINE = r.DIM_OPACITY = r.INVERTED_DEFAULT_COLOR = void 0;
      const c = o(6114);
      r.INVERTED_DEFAULT_COLOR = 257, r.DIM_OPACITY = 0.5, r.TEXT_BASELINE = c.isFirefox || c.isLegacyEdge ? "bottom" : "ideographic";
    }, 6171: (B, r) => {
      function o(c) {
        return 57508 <= c && c <= 57558;
      }
      Object.defineProperty(r, "__esModule", { value: !0 }), r.createRenderDimensions = r.excludeFromContrastRatioDemands = r.isRestrictedPowerlineGlyph = r.isPowerlineGlyph = r.throwIfFalsy = void 0, r.throwIfFalsy = function(c) {
        if (!c) throw new Error("value must not be falsy");
        return c;
      }, r.isPowerlineGlyph = o, r.isRestrictedPowerlineGlyph = function(c) {
        return 57520 <= c && c <= 57527;
      }, r.excludeFromContrastRatioDemands = function(c) {
        return o(c) || function(_) {
          return 9472 <= _ && _ <= 9631;
        }(c);
      }, r.createRenderDimensions = function() {
        return { css: { canvas: { width: 0, height: 0 }, cell: { width: 0, height: 0 } }, device: { canvas: { width: 0, height: 0 }, cell: { width: 0, height: 0 }, char: { width: 0, height: 0, left: 0, top: 0 } } };
      };
    }, 456: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.SelectionModel = void 0, r.SelectionModel = class {
        constructor(o) {
          this._bufferService = o, this.isSelectAllActive = !1, this.selectionStartLength = 0;
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
              const o = this.selectionStart[0] + this.selectionStartLength;
              return o > this._bufferService.cols ? o % this._bufferService.cols == 0 ? [this._bufferService.cols, this.selectionStart[1] + Math.floor(o / this._bufferService.cols) - 1] : [o % this._bufferService.cols, this.selectionStart[1] + Math.floor(o / this._bufferService.cols)] : [o, this.selectionStart[1]];
            }
            if (this.selectionStartLength && this.selectionEnd[1] === this.selectionStart[1]) {
              const o = this.selectionStart[0] + this.selectionStartLength;
              return o > this._bufferService.cols ? [o % this._bufferService.cols, this.selectionStart[1] + Math.floor(o / this._bufferService.cols)] : [Math.max(o, this.selectionEnd[0]), this.selectionEnd[1]];
            }
            return this.selectionEnd;
          }
        }
        areSelectionValuesReversed() {
          const o = this.selectionStart, c = this.selectionEnd;
          return !(!o || !c) && (o[1] > c[1] || o[1] === c[1] && o[0] > c[0]);
        }
        handleTrim(o) {
          return this.selectionStart && (this.selectionStart[1] -= o), this.selectionEnd && (this.selectionEnd[1] -= o), this.selectionEnd && this.selectionEnd[1] < 0 ? (this.clearSelection(), !0) : (this.selectionStart && this.selectionStart[1] < 0 && (this.selectionStart[1] = 0), !1);
        }
      };
    }, 428: function(B, r, o) {
      var c = this && this.__decorate || function(e, i, t, s) {
        var a, l = arguments.length, f = l < 3 ? i : s === null ? s = Object.getOwnPropertyDescriptor(i, t) : s;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, s);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (f = (l < 3 ? a(f) : l > 3 ? a(i, t, f) : a(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, s) {
          i(t, s, e);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CharSizeService = void 0;
      const n = o(2585), u = o(8460), v = o(844);
      let g = r.CharSizeService = class extends v.Disposable {
        get hasValidSize() {
          return this.width > 0 && this.height > 0;
        }
        constructor(e, i, t) {
          super(), this._optionsService = t, this.width = 0, this.height = 0, this._onCharSizeChange = this.register(new u.EventEmitter()), this.onCharSizeChange = this._onCharSizeChange.event, this._measureStrategy = new d(e, i, this._optionsService), this.register(this._optionsService.onMultipleOptionChange(["fontFamily", "fontSize"], () => this.measure()));
        }
        measure() {
          const e = this._measureStrategy.measure();
          e.width === this.width && e.height === this.height || (this.width = e.width, this.height = e.height, this._onCharSizeChange.fire());
        }
      };
      r.CharSizeService = g = c([_(2, n.IOptionsService)], g);
      class d {
        constructor(i, t, s) {
          this._document = i, this._parentElement = t, this._optionsService = s, this._result = { width: 0, height: 0 }, this._measureElement = this._document.createElement("span"), this._measureElement.classList.add("xterm-char-measure-element"), this._measureElement.textContent = "W".repeat(32), this._measureElement.setAttribute("aria-hidden", "true"), this._measureElement.style.whiteSpace = "pre", this._measureElement.style.fontKerning = "none", this._parentElement.appendChild(this._measureElement);
        }
        measure() {
          this._measureElement.style.fontFamily = this._optionsService.rawOptions.fontFamily, this._measureElement.style.fontSize = `${this._optionsService.rawOptions.fontSize}px`;
          const i = { height: Number(this._measureElement.offsetHeight), width: Number(this._measureElement.offsetWidth) };
          return i.width !== 0 && i.height !== 0 && (this._result.width = i.width / 32, this._result.height = Math.ceil(i.height)), this._result;
        }
      }
    }, 4269: function(B, r, o) {
      var c = this && this.__decorate || function(i, t, s, a) {
        var l, f = arguments.length, m = f < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, s) : a;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") m = Reflect.decorate(i, t, s, a);
        else for (var h = i.length - 1; h >= 0; h--) (l = i[h]) && (m = (f < 3 ? l(m) : f > 3 ? l(t, s, m) : l(t, s)) || m);
        return f > 3 && m && Object.defineProperty(t, s, m), m;
      }, _ = this && this.__param || function(i, t) {
        return function(s, a) {
          t(s, a, i);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CharacterJoinerService = r.JoinedCellData = void 0;
      const n = o(3734), u = o(643), v = o(511), g = o(2585);
      class d extends n.AttributeData {
        constructor(t, s, a) {
          super(), this.content = 0, this.combinedData = "", this.fg = t.fg, this.bg = t.bg, this.combinedData = s, this._width = a;
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
      r.JoinedCellData = d;
      let e = r.CharacterJoinerService = class we {
        constructor(t) {
          this._bufferService = t, this._characterJoiners = [], this._nextCharacterJoinerId = 0, this._workCell = new v.CellData();
        }
        register(t) {
          const s = { id: this._nextCharacterJoinerId++, handler: t };
          return this._characterJoiners.push(s), s.id;
        }
        deregister(t) {
          for (let s = 0; s < this._characterJoiners.length; s++) if (this._characterJoiners[s].id === t) return this._characterJoiners.splice(s, 1), !0;
          return !1;
        }
        getJoinedCharacters(t) {
          if (this._characterJoiners.length === 0) return [];
          const s = this._bufferService.buffer.lines.get(t);
          if (!s || s.length === 0) return [];
          const a = [], l = s.translateToString(!0);
          let f = 0, m = 0, h = 0, p = s.getFg(0), b = s.getBg(0);
          for (let x = 0; x < s.getTrimmedLength(); x++) if (s.loadCell(x, this._workCell), this._workCell.getWidth() !== 0) {
            if (this._workCell.fg !== p || this._workCell.bg !== b) {
              if (x - f > 1) {
                const y = this._getJoinedRanges(l, h, m, s, f);
                for (let k = 0; k < y.length; k++) a.push(y[k]);
              }
              f = x, h = m, p = this._workCell.fg, b = this._workCell.bg;
            }
            m += this._workCell.getChars().length || u.WHITESPACE_CELL_CHAR.length;
          }
          if (this._bufferService.cols - f > 1) {
            const x = this._getJoinedRanges(l, h, m, s, f);
            for (let y = 0; y < x.length; y++) a.push(x[y]);
          }
          return a;
        }
        _getJoinedRanges(t, s, a, l, f) {
          const m = t.substring(s, a);
          let h = [];
          try {
            h = this._characterJoiners[0].handler(m);
          } catch (p) {
            console.error(p);
          }
          for (let p = 1; p < this._characterJoiners.length; p++) try {
            const b = this._characterJoiners[p].handler(m);
            for (let x = 0; x < b.length; x++) we._mergeRanges(h, b[x]);
          } catch (b) {
            console.error(b);
          }
          return this._stringRangesToCellRanges(h, l, f), h;
        }
        _stringRangesToCellRanges(t, s, a) {
          let l = 0, f = !1, m = 0, h = t[l];
          if (h) {
            for (let p = a; p < this._bufferService.cols; p++) {
              const b = s.getWidth(p), x = s.getString(p).length || u.WHITESPACE_CELL_CHAR.length;
              if (b !== 0) {
                if (!f && h[0] <= m && (h[0] = p, f = !0), h[1] <= m) {
                  if (h[1] = p, h = t[++l], !h) break;
                  h[0] <= m ? (h[0] = p, f = !0) : f = !1;
                }
                m += x;
              }
            }
            h && (h[1] = this._bufferService.cols);
          }
        }
        static _mergeRanges(t, s) {
          let a = !1;
          for (let l = 0; l < t.length; l++) {
            const f = t[l];
            if (a) {
              if (s[1] <= f[0]) return t[l - 1][1] = s[1], t;
              if (s[1] <= f[1]) return t[l - 1][1] = Math.max(s[1], f[1]), t.splice(l, 1), t;
              t.splice(l, 1), l--;
            } else {
              if (s[1] <= f[0]) return t.splice(l, 0, s), t;
              if (s[1] <= f[1]) return f[0] = Math.min(s[0], f[0]), t;
              s[0] < f[1] && (f[0] = Math.min(s[0], f[0]), a = !0);
            }
          }
          return a ? t[t.length - 1][1] = s[1] : t.push(s), t;
        }
      };
      r.CharacterJoinerService = e = c([_(0, g.IBufferService)], e);
    }, 5114: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CoreBrowserService = void 0, r.CoreBrowserService = class {
        constructor(o, c) {
          this._textarea = o, this.window = c, this._isFocused = !1, this._cachedIsFocused = void 0, this._textarea.addEventListener("focus", () => this._isFocused = !0), this._textarea.addEventListener("blur", () => this._isFocused = !1);
        }
        get dpr() {
          return this.window.devicePixelRatio;
        }
        get isFocused() {
          return this._cachedIsFocused === void 0 && (this._cachedIsFocused = this._isFocused && this._textarea.ownerDocument.hasFocus(), queueMicrotask(() => this._cachedIsFocused = void 0)), this._cachedIsFocused;
        }
      };
    }, 8934: function(B, r, o) {
      var c = this && this.__decorate || function(g, d, e, i) {
        var t, s = arguments.length, a = s < 3 ? d : i === null ? i = Object.getOwnPropertyDescriptor(d, e) : i;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(g, d, e, i);
        else for (var l = g.length - 1; l >= 0; l--) (t = g[l]) && (a = (s < 3 ? t(a) : s > 3 ? t(d, e, a) : t(d, e)) || a);
        return s > 3 && a && Object.defineProperty(d, e, a), a;
      }, _ = this && this.__param || function(g, d) {
        return function(e, i) {
          d(e, i, g);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.MouseService = void 0;
      const n = o(4725), u = o(9806);
      let v = r.MouseService = class {
        constructor(g, d) {
          this._renderService = g, this._charSizeService = d;
        }
        getCoords(g, d, e, i, t) {
          return (0, u.getCoords)(window, g, d, e, i, this._charSizeService.hasValidSize, this._renderService.dimensions.css.cell.width, this._renderService.dimensions.css.cell.height, t);
        }
        getMouseReportCoords(g, d) {
          const e = (0, u.getCoordsRelativeToElement)(window, g, d);
          if (this._charSizeService.hasValidSize) return e[0] = Math.min(Math.max(e[0], 0), this._renderService.dimensions.css.canvas.width - 1), e[1] = Math.min(Math.max(e[1], 0), this._renderService.dimensions.css.canvas.height - 1), { col: Math.floor(e[0] / this._renderService.dimensions.css.cell.width), row: Math.floor(e[1] / this._renderService.dimensions.css.cell.height), x: Math.floor(e[0]), y: Math.floor(e[1]) };
        }
      };
      r.MouseService = v = c([_(0, n.IRenderService), _(1, n.ICharSizeService)], v);
    }, 3230: function(B, r, o) {
      var c = this && this.__decorate || function(a, l, f, m) {
        var h, p = arguments.length, b = p < 3 ? l : m === null ? m = Object.getOwnPropertyDescriptor(l, f) : m;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") b = Reflect.decorate(a, l, f, m);
        else for (var x = a.length - 1; x >= 0; x--) (h = a[x]) && (b = (p < 3 ? h(b) : p > 3 ? h(l, f, b) : h(l, f)) || b);
        return p > 3 && b && Object.defineProperty(l, f, b), b;
      }, _ = this && this.__param || function(a, l) {
        return function(f, m) {
          l(f, m, a);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.RenderService = void 0;
      const n = o(3656), u = o(6193), v = o(5596), g = o(4725), d = o(8460), e = o(844), i = o(7226), t = o(2585);
      let s = r.RenderService = class extends e.Disposable {
        get dimensions() {
          return this._renderer.value.dimensions;
        }
        constructor(a, l, f, m, h, p, b, x) {
          if (super(), this._rowCount = a, this._charSizeService = m, this._renderer = this.register(new e.MutableDisposable()), this._pausedResizeTask = new i.DebouncedIdleTask(), this._isPaused = !1, this._needsFullRefresh = !1, this._isNextRenderRedrawOnly = !0, this._needsSelectionRefresh = !1, this._canvasWidth = 0, this._canvasHeight = 0, this._selectionState = { start: void 0, end: void 0, columnSelectMode: !1 }, this._onDimensionsChange = this.register(new d.EventEmitter()), this.onDimensionsChange = this._onDimensionsChange.event, this._onRenderedViewportChange = this.register(new d.EventEmitter()), this.onRenderedViewportChange = this._onRenderedViewportChange.event, this._onRender = this.register(new d.EventEmitter()), this.onRender = this._onRender.event, this._onRefreshRequest = this.register(new d.EventEmitter()), this.onRefreshRequest = this._onRefreshRequest.event, this._renderDebouncer = new u.RenderDebouncer(b.window, (y, k) => this._renderRows(y, k)), this.register(this._renderDebouncer), this._screenDprMonitor = new v.ScreenDprMonitor(b.window), this._screenDprMonitor.setListener(() => this.handleDevicePixelRatioChange()), this.register(this._screenDprMonitor), this.register(p.onResize(() => this._fullRefresh())), this.register(p.buffers.onBufferActivate(() => {
            var y;
            return (y = this._renderer.value) === null || y === void 0 ? void 0 : y.clear();
          })), this.register(f.onOptionChange(() => this._handleOptionsChanged())), this.register(this._charSizeService.onCharSizeChange(() => this.handleCharSizeChanged())), this.register(h.onDecorationRegistered(() => this._fullRefresh())), this.register(h.onDecorationRemoved(() => this._fullRefresh())), this.register(f.onMultipleOptionChange(["customGlyphs", "drawBoldTextInBrightColors", "letterSpacing", "lineHeight", "fontFamily", "fontSize", "fontWeight", "fontWeightBold", "minimumContrastRatio"], () => {
            this.clear(), this.handleResize(p.cols, p.rows), this._fullRefresh();
          })), this.register(f.onMultipleOptionChange(["cursorBlink", "cursorStyle"], () => this.refreshRows(p.buffer.y, p.buffer.y, !0))), this.register((0, n.addDisposableDomListener)(b.window, "resize", () => this.handleDevicePixelRatioChange())), this.register(x.onChangeColors(() => this._fullRefresh())), "IntersectionObserver" in b.window) {
            const y = new b.window.IntersectionObserver((k) => this._handleIntersectionChange(k[k.length - 1]), { threshold: 0 });
            y.observe(l), this.register({ dispose: () => y.disconnect() });
          }
        }
        _handleIntersectionChange(a) {
          this._isPaused = a.isIntersecting === void 0 ? a.intersectionRatio === 0 : !a.isIntersecting, this._isPaused || this._charSizeService.hasValidSize || this._charSizeService.measure(), !this._isPaused && this._needsFullRefresh && (this._pausedResizeTask.flush(), this.refreshRows(0, this._rowCount - 1), this._needsFullRefresh = !1);
        }
        refreshRows(a, l, f = !1) {
          this._isPaused ? this._needsFullRefresh = !0 : (f || (this._isNextRenderRedrawOnly = !1), this._renderDebouncer.refresh(a, l, this._rowCount));
        }
        _renderRows(a, l) {
          this._renderer.value && (a = Math.min(a, this._rowCount - 1), l = Math.min(l, this._rowCount - 1), this._renderer.value.renderRows(a, l), this._needsSelectionRefresh && (this._renderer.value.handleSelectionChanged(this._selectionState.start, this._selectionState.end, this._selectionState.columnSelectMode), this._needsSelectionRefresh = !1), this._isNextRenderRedrawOnly || this._onRenderedViewportChange.fire({ start: a, end: l }), this._onRender.fire({ start: a, end: l }), this._isNextRenderRedrawOnly = !0);
        }
        resize(a, l) {
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
        setRenderer(a) {
          this._renderer.value = a, this._renderer.value.onRequestRedraw((l) => this.refreshRows(l.start, l.end, !0)), this._needsSelectionRefresh = !0, this._fullRefresh();
        }
        addRefreshCallback(a) {
          return this._renderDebouncer.addRefreshCallback(a);
        }
        _fullRefresh() {
          this._isPaused ? this._needsFullRefresh = !0 : this.refreshRows(0, this._rowCount - 1);
        }
        clearTextureAtlas() {
          var a, l;
          this._renderer.value && ((l = (a = this._renderer.value).clearTextureAtlas) === null || l === void 0 || l.call(a), this._fullRefresh());
        }
        handleDevicePixelRatioChange() {
          this._charSizeService.measure(), this._renderer.value && (this._renderer.value.handleDevicePixelRatioChange(), this.refreshRows(0, this._rowCount - 1));
        }
        handleResize(a, l) {
          this._renderer.value && (this._isPaused ? this._pausedResizeTask.set(() => this._renderer.value.handleResize(a, l)) : this._renderer.value.handleResize(a, l), this._fullRefresh());
        }
        handleCharSizeChanged() {
          var a;
          (a = this._renderer.value) === null || a === void 0 || a.handleCharSizeChanged();
        }
        handleBlur() {
          var a;
          (a = this._renderer.value) === null || a === void 0 || a.handleBlur();
        }
        handleFocus() {
          var a;
          (a = this._renderer.value) === null || a === void 0 || a.handleFocus();
        }
        handleSelectionChanged(a, l, f) {
          var m;
          this._selectionState.start = a, this._selectionState.end = l, this._selectionState.columnSelectMode = f, (m = this._renderer.value) === null || m === void 0 || m.handleSelectionChanged(a, l, f);
        }
        handleCursorMove() {
          var a;
          (a = this._renderer.value) === null || a === void 0 || a.handleCursorMove();
        }
        clear() {
          var a;
          (a = this._renderer.value) === null || a === void 0 || a.clear();
        }
      };
      r.RenderService = s = c([_(2, t.IOptionsService), _(3, g.ICharSizeService), _(4, t.IDecorationService), _(5, t.IBufferService), _(6, g.ICoreBrowserService), _(7, g.IThemeService)], s);
    }, 9312: function(B, r, o) {
      var c = this && this.__decorate || function(h, p, b, x) {
        var y, k = arguments.length, D = k < 3 ? p : x === null ? x = Object.getOwnPropertyDescriptor(p, b) : x;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") D = Reflect.decorate(h, p, b, x);
        else for (var M = h.length - 1; M >= 0; M--) (y = h[M]) && (D = (k < 3 ? y(D) : k > 3 ? y(p, b, D) : y(p, b)) || D);
        return k > 3 && D && Object.defineProperty(p, b, D), D;
      }, _ = this && this.__param || function(h, p) {
        return function(b, x) {
          p(b, x, h);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.SelectionService = void 0;
      const n = o(9806), u = o(9504), v = o(456), g = o(4725), d = o(8460), e = o(844), i = o(6114), t = o(4841), s = o(511), a = o(2585), l = " ", f = new RegExp(l, "g");
      let m = r.SelectionService = class extends e.Disposable {
        constructor(h, p, b, x, y, k, D, M, P) {
          super(), this._element = h, this._screenElement = p, this._linkifier = b, this._bufferService = x, this._coreService = y, this._mouseService = k, this._optionsService = D, this._renderService = M, this._coreBrowserService = P, this._dragScrollAmount = 0, this._enabled = !0, this._workCell = new s.CellData(), this._mouseDownTimeStamp = 0, this._oldHasSelection = !1, this._oldSelectionStart = void 0, this._oldSelectionEnd = void 0, this._onLinuxMouseSelection = this.register(new d.EventEmitter()), this.onLinuxMouseSelection = this._onLinuxMouseSelection.event, this._onRedrawRequest = this.register(new d.EventEmitter()), this.onRequestRedraw = this._onRedrawRequest.event, this._onSelectionChange = this.register(new d.EventEmitter()), this.onSelectionChange = this._onSelectionChange.event, this._onRequestScrollLines = this.register(new d.EventEmitter()), this.onRequestScrollLines = this._onRequestScrollLines.event, this._mouseMoveListener = (O) => this._handleMouseMove(O), this._mouseUpListener = (O) => this._handleMouseUp(O), this._coreService.onUserInput(() => {
            this.hasSelection && this.clearSelection();
          }), this._trimListener = this._bufferService.buffer.lines.onTrim((O) => this._handleTrim(O)), this.register(this._bufferService.buffers.onBufferActivate((O) => this._handleBufferActivate(O))), this.enable(), this._model = new v.SelectionModel(this._bufferService), this._activeSelectionMode = 0, this.register((0, e.toDisposable)(() => {
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
          const b = this._bufferService.buffer, x = [];
          if (this._activeSelectionMode === 3) {
            if (h[0] === p[0]) return "";
            const y = h[0] < p[0] ? h[0] : p[0], k = h[0] < p[0] ? p[0] : h[0];
            for (let D = h[1]; D <= p[1]; D++) {
              const M = b.translateBufferLineToString(D, !0, y, k);
              x.push(M);
            }
          } else {
            const y = h[1] === p[1] ? p[0] : void 0;
            x.push(b.translateBufferLineToString(h[1], !0, h[0], y));
            for (let k = h[1] + 1; k <= p[1] - 1; k++) {
              const D = b.lines.get(k), M = b.translateBufferLineToString(k, !0);
              D != null && D.isWrapped ? x[x.length - 1] += M : x.push(M);
            }
            if (h[1] !== p[1]) {
              const k = b.lines.get(p[1]), D = b.translateBufferLineToString(p[1], !0, 0, p[0]);
              k && k.isWrapped ? x[x.length - 1] += D : x.push(D);
            }
          }
          return x.map((y) => y.replace(f, " ")).join(i.isWindows ? `\r
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
          const p = this._getMouseBufferCoords(h), b = this._model.finalSelectionStart, x = this._model.finalSelectionEnd;
          return !!(b && x && p) && this._areCoordsInSelection(p, b, x);
        }
        isCellInSelection(h, p) {
          const b = this._model.finalSelectionStart, x = this._model.finalSelectionEnd;
          return !(!b || !x) && this._areCoordsInSelection([h, p], b, x);
        }
        _areCoordsInSelection(h, p, b) {
          return h[1] > p[1] && h[1] < b[1] || p[1] === b[1] && h[1] === p[1] && h[0] >= p[0] && h[0] < b[0] || p[1] < b[1] && h[1] === b[1] && h[0] < b[0] || p[1] < b[1] && h[1] === p[1] && h[0] >= p[0];
        }
        _selectWordAtCursor(h, p) {
          var b, x;
          const y = (x = (b = this._linkifier.currentLink) === null || b === void 0 ? void 0 : b.link) === null || x === void 0 ? void 0 : x.range;
          if (y) return this._model.selectionStart = [y.start.x - 1, y.start.y - 1], this._model.selectionStartLength = (0, t.getRangeLength)(y, this._bufferService.cols), this._model.selectionEnd = void 0, !0;
          const k = this._getMouseBufferCoords(h);
          return !!k && (this._selectWordAt(k, p), this._model.selectionEnd = void 0, !0);
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
          const b = this._renderService.dimensions.css.canvas.height;
          return p >= 0 && p <= b ? 0 : (p > b && (p -= b), p = Math.min(Math.max(p, -50), 50), p /= 50, p / Math.abs(p) + Math.round(14 * p));
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
          const b = this._bufferService.buffer;
          if (this._model.selectionEnd[1] < b.lines.length) {
            const x = b.lines.get(this._model.selectionEnd[1]);
            x && x.hasWidth(this._model.selectionEnd[0]) === 0 && this._model.selectionEnd[0]++;
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
              const b = this._mouseService.getCoords(h, this._element, this._bufferService.cols, this._bufferService.rows, !1);
              if (b && b[0] !== void 0 && b[1] !== void 0) {
                const x = (0, u.moveToCellSequence)(b[0] - 1, b[1] - 1, this._bufferService, this._coreService.decPrivateModes.applicationCursorKeys);
                this._coreService.triggerDataEvent(x, !0);
              }
            }
          } else this._fireEventIfSelectionChanged();
        }
        _fireEventIfSelectionChanged() {
          const h = this._model.finalSelectionStart, p = this._model.finalSelectionEnd, b = !(!h || !p || h[0] === p[0] && h[1] === p[1]);
          b ? h && p && (this._oldSelectionStart && this._oldSelectionEnd && h[0] === this._oldSelectionStart[0] && h[1] === this._oldSelectionStart[1] && p[0] === this._oldSelectionEnd[0] && p[1] === this._oldSelectionEnd[1] || this._fireOnSelectionChange(h, p, b)) : this._oldHasSelection && this._fireOnSelectionChange(h, p, b);
        }
        _fireOnSelectionChange(h, p, b) {
          this._oldSelectionStart = h, this._oldSelectionEnd = p, this._oldHasSelection = b, this._onSelectionChange.fire();
        }
        _handleBufferActivate(h) {
          this.clearSelection(), this._trimListener.dispose(), this._trimListener = h.activeBuffer.lines.onTrim((p) => this._handleTrim(p));
        }
        _convertViewportColToCharacterIndex(h, p) {
          let b = p;
          for (let x = 0; p >= x; x++) {
            const y = h.loadCell(x, this._workCell).getChars().length;
            this._workCell.getWidth() === 0 ? b-- : y > 1 && p !== x && (b += y - 1);
          }
          return b;
        }
        setSelection(h, p, b) {
          this._model.clearSelection(), this._removeMouseDownListeners(), this._model.selectionStart = [h, p], this._model.selectionStartLength = b, this.refresh(), this._fireEventIfSelectionChanged();
        }
        rightClickSelect(h) {
          this._isClickInSelection(h) || (this._selectWordAtCursor(h, !1) && this.refresh(!0), this._fireEventIfSelectionChanged());
        }
        _getWordAt(h, p, b = !0, x = !0) {
          if (h[0] >= this._bufferService.cols) return;
          const y = this._bufferService.buffer, k = y.lines.get(h[1]);
          if (!k) return;
          const D = y.translateBufferLineToString(h[1], !1);
          let M = this._convertViewportColToCharacterIndex(k, h[0]), P = M;
          const O = h[0] - M;
          let C = 0, w = 0, E = 0, L = 0;
          if (D.charAt(M) === " ") {
            for (; M > 0 && D.charAt(M - 1) === " "; ) M--;
            for (; P < D.length && D.charAt(P + 1) === " "; ) P++;
          } else {
            let W = h[0], N = h[0];
            k.getWidth(W) === 0 && (C++, W--), k.getWidth(N) === 2 && (w++, N++);
            const X = k.getString(N).length;
            for (X > 1 && (L += X - 1, P += X - 1); W > 0 && M > 0 && !this._isCharWordSeparator(k.loadCell(W - 1, this._workCell)); ) {
              k.loadCell(W - 1, this._workCell);
              const S = this._workCell.getChars().length;
              this._workCell.getWidth() === 0 ? (C++, W--) : S > 1 && (E += S - 1, M -= S - 1), M--, W--;
            }
            for (; N < k.length && P + 1 < D.length && !this._isCharWordSeparator(k.loadCell(N + 1, this._workCell)); ) {
              k.loadCell(N + 1, this._workCell);
              const S = this._workCell.getChars().length;
              this._workCell.getWidth() === 2 ? (w++, N++) : S > 1 && (L += S - 1, P += S - 1), P++, N++;
            }
          }
          P++;
          let I = M + O - C + E, H = Math.min(this._bufferService.cols, P - M + C + w - E - L);
          if (p || D.slice(M, P).trim() !== "") {
            if (b && I === 0 && k.getCodePoint(0) !== 32) {
              const W = y.lines.get(h[1] - 1);
              if (W && k.isWrapped && W.getCodePoint(this._bufferService.cols - 1) !== 32) {
                const N = this._getWordAt([this._bufferService.cols - 1, h[1] - 1], !1, !0, !1);
                if (N) {
                  const X = this._bufferService.cols - N.start;
                  I -= X, H += X;
                }
              }
            }
            if (x && I + H === this._bufferService.cols && k.getCodePoint(this._bufferService.cols - 1) !== 32) {
              const W = y.lines.get(h[1] + 1);
              if (W != null && W.isWrapped && W.getCodePoint(0) !== 32) {
                const N = this._getWordAt([0, h[1] + 1], !1, !1, !0);
                N && (H += N.length);
              }
            }
            return { start: I, length: H };
          }
        }
        _selectWordAt(h, p) {
          const b = this._getWordAt(h, p);
          if (b) {
            for (; b.start < 0; ) b.start += this._bufferService.cols, h[1]--;
            this._model.selectionStart = [b.start, h[1]], this._model.selectionStartLength = b.length;
          }
        }
        _selectToWordAt(h) {
          const p = this._getWordAt(h, !0);
          if (p) {
            let b = h[1];
            for (; p.start < 0; ) p.start += this._bufferService.cols, b--;
            if (!this._model.areSelectionValuesReversed()) for (; p.start + p.length > this._bufferService.cols; ) p.length -= this._bufferService.cols, b++;
            this._model.selectionEnd = [this._model.areSelectionValuesReversed() ? p.start : p.start + p.length, b];
          }
        }
        _isCharWordSeparator(h) {
          return h.getWidth() !== 0 && this._optionsService.rawOptions.wordSeparator.indexOf(h.getChars()) >= 0;
        }
        _selectLineAt(h) {
          const p = this._bufferService.buffer.getWrappedRangeForLine(h), b = { start: { x: 0, y: p.first }, end: { x: this._bufferService.cols - 1, y: p.last } };
          this._model.selectionStart = [0, p.first], this._model.selectionEnd = void 0, this._model.selectionStartLength = (0, t.getRangeLength)(b, this._bufferService.cols);
        }
      };
      r.SelectionService = m = c([_(3, a.IBufferService), _(4, a.ICoreService), _(5, g.IMouseService), _(6, a.IOptionsService), _(7, g.IRenderService), _(8, g.ICoreBrowserService)], m);
    }, 4725: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.IThemeService = r.ICharacterJoinerService = r.ISelectionService = r.IRenderService = r.IMouseService = r.ICoreBrowserService = r.ICharSizeService = void 0;
      const c = o(8343);
      r.ICharSizeService = (0, c.createDecorator)("CharSizeService"), r.ICoreBrowserService = (0, c.createDecorator)("CoreBrowserService"), r.IMouseService = (0, c.createDecorator)("MouseService"), r.IRenderService = (0, c.createDecorator)("RenderService"), r.ISelectionService = (0, c.createDecorator)("SelectionService"), r.ICharacterJoinerService = (0, c.createDecorator)("CharacterJoinerService"), r.IThemeService = (0, c.createDecorator)("ThemeService");
    }, 6731: function(B, r, o) {
      var c = this && this.__decorate || function(m, h, p, b) {
        var x, y = arguments.length, k = y < 3 ? h : b === null ? b = Object.getOwnPropertyDescriptor(h, p) : b;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") k = Reflect.decorate(m, h, p, b);
        else for (var D = m.length - 1; D >= 0; D--) (x = m[D]) && (k = (y < 3 ? x(k) : y > 3 ? x(h, p, k) : x(h, p)) || k);
        return y > 3 && k && Object.defineProperty(h, p, k), k;
      }, _ = this && this.__param || function(m, h) {
        return function(p, b) {
          h(p, b, m);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.ThemeService = r.DEFAULT_ANSI_COLORS = void 0;
      const n = o(7239), u = o(8055), v = o(8460), g = o(844), d = o(2585), e = u.css.toColor("#ffffff"), i = u.css.toColor("#000000"), t = u.css.toColor("#ffffff"), s = u.css.toColor("#000000"), a = { css: "rgba(255, 255, 255, 0.3)", rgba: 4294967117 };
      r.DEFAULT_ANSI_COLORS = Object.freeze((() => {
        const m = [u.css.toColor("#2e3436"), u.css.toColor("#cc0000"), u.css.toColor("#4e9a06"), u.css.toColor("#c4a000"), u.css.toColor("#3465a4"), u.css.toColor("#75507b"), u.css.toColor("#06989a"), u.css.toColor("#d3d7cf"), u.css.toColor("#555753"), u.css.toColor("#ef2929"), u.css.toColor("#8ae234"), u.css.toColor("#fce94f"), u.css.toColor("#729fcf"), u.css.toColor("#ad7fa8"), u.css.toColor("#34e2e2"), u.css.toColor("#eeeeec")], h = [0, 95, 135, 175, 215, 255];
        for (let p = 0; p < 216; p++) {
          const b = h[p / 36 % 6 | 0], x = h[p / 6 % 6 | 0], y = h[p % 6];
          m.push({ css: u.channels.toCss(b, x, y), rgba: u.channels.toRgba(b, x, y) });
        }
        for (let p = 0; p < 24; p++) {
          const b = 8 + 10 * p;
          m.push({ css: u.channels.toCss(b, b, b), rgba: u.channels.toRgba(b, b, b) });
        }
        return m;
      })());
      let l = r.ThemeService = class extends g.Disposable {
        get colors() {
          return this._colors;
        }
        constructor(m) {
          super(), this._optionsService = m, this._contrastCache = new n.ColorContrastCache(), this._halfContrastCache = new n.ColorContrastCache(), this._onChangeColors = this.register(new v.EventEmitter()), this.onChangeColors = this._onChangeColors.event, this._colors = { foreground: e, background: i, cursor: t, cursorAccent: s, selectionForeground: void 0, selectionBackgroundTransparent: a, selectionBackgroundOpaque: u.color.blend(i, a), selectionInactiveBackgroundTransparent: a, selectionInactiveBackgroundOpaque: u.color.blend(i, a), ansi: r.DEFAULT_ANSI_COLORS.slice(), contrastCache: this._contrastCache, halfContrastCache: this._halfContrastCache }, this._updateRestoreColors(), this._setTheme(this._optionsService.rawOptions.theme), this.register(this._optionsService.onSpecificOptionChange("minimumContrastRatio", () => this._contrastCache.clear())), this.register(this._optionsService.onSpecificOptionChange("theme", () => this._setTheme(this._optionsService.rawOptions.theme)));
        }
        _setTheme(m = {}) {
          const h = this._colors;
          if (h.foreground = f(m.foreground, e), h.background = f(m.background, i), h.cursor = f(m.cursor, t), h.cursorAccent = f(m.cursorAccent, s), h.selectionBackgroundTransparent = f(m.selectionBackground, a), h.selectionBackgroundOpaque = u.color.blend(h.background, h.selectionBackgroundTransparent), h.selectionInactiveBackgroundTransparent = f(m.selectionInactiveBackground, h.selectionBackgroundTransparent), h.selectionInactiveBackgroundOpaque = u.color.blend(h.background, h.selectionInactiveBackgroundTransparent), h.selectionForeground = m.selectionForeground ? f(m.selectionForeground, u.NULL_COLOR) : void 0, h.selectionForeground === u.NULL_COLOR && (h.selectionForeground = void 0), u.color.isOpaque(h.selectionBackgroundTransparent) && (h.selectionBackgroundTransparent = u.color.opacity(h.selectionBackgroundTransparent, 0.3)), u.color.isOpaque(h.selectionInactiveBackgroundTransparent) && (h.selectionInactiveBackgroundTransparent = u.color.opacity(h.selectionInactiveBackgroundTransparent, 0.3)), h.ansi = r.DEFAULT_ANSI_COLORS.slice(), h.ansi[0] = f(m.black, r.DEFAULT_ANSI_COLORS[0]), h.ansi[1] = f(m.red, r.DEFAULT_ANSI_COLORS[1]), h.ansi[2] = f(m.green, r.DEFAULT_ANSI_COLORS[2]), h.ansi[3] = f(m.yellow, r.DEFAULT_ANSI_COLORS[3]), h.ansi[4] = f(m.blue, r.DEFAULT_ANSI_COLORS[4]), h.ansi[5] = f(m.magenta, r.DEFAULT_ANSI_COLORS[5]), h.ansi[6] = f(m.cyan, r.DEFAULT_ANSI_COLORS[6]), h.ansi[7] = f(m.white, r.DEFAULT_ANSI_COLORS[7]), h.ansi[8] = f(m.brightBlack, r.DEFAULT_ANSI_COLORS[8]), h.ansi[9] = f(m.brightRed, r.DEFAULT_ANSI_COLORS[9]), h.ansi[10] = f(m.brightGreen, r.DEFAULT_ANSI_COLORS[10]), h.ansi[11] = f(m.brightYellow, r.DEFAULT_ANSI_COLORS[11]), h.ansi[12] = f(m.brightBlue, r.DEFAULT_ANSI_COLORS[12]), h.ansi[13] = f(m.brightMagenta, r.DEFAULT_ANSI_COLORS[13]), h.ansi[14] = f(m.brightCyan, r.DEFAULT_ANSI_COLORS[14]), h.ansi[15] = f(m.brightWhite, r.DEFAULT_ANSI_COLORS[15]), m.extendedAnsi) {
            const p = Math.min(h.ansi.length - 16, m.extendedAnsi.length);
            for (let b = 0; b < p; b++) h.ansi[b + 16] = f(m.extendedAnsi[b], r.DEFAULT_ANSI_COLORS[b + 16]);
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
          return u.css.toColor(m);
        } catch {
        }
        return h;
      }
      r.ThemeService = l = c([_(0, d.IOptionsService)], l);
    }, 6349: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CircularList = void 0;
      const c = o(8460), _ = o(844);
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
          for (let d = 0; d < Math.min(v, this.length); d++) g[d] = this._array[this._getCyclicIndex(d)];
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
        splice(v, g, ...d) {
          if (g) {
            for (let e = v; e < this._length - g; e++) this._array[this._getCyclicIndex(e)] = this._array[this._getCyclicIndex(e + g)];
            this._length -= g, this.onDeleteEmitter.fire({ index: v, amount: g });
          }
          for (let e = this._length - 1; e >= v; e--) this._array[this._getCyclicIndex(e + d.length)] = this._array[this._getCyclicIndex(e)];
          for (let e = 0; e < d.length; e++) this._array[this._getCyclicIndex(v + e)] = d[e];
          if (d.length && this.onInsertEmitter.fire({ index: v, amount: d.length }), this._length + d.length > this._maxLength) {
            const e = this._length + d.length - this._maxLength;
            this._startIndex += e, this._length = this._maxLength, this.onTrimEmitter.fire(e);
          } else this._length += d.length;
        }
        trimStart(v) {
          v > this._length && (v = this._length), this._startIndex += v, this._length -= v, this.onTrimEmitter.fire(v);
        }
        shiftElements(v, g, d) {
          if (!(g <= 0)) {
            if (v < 0 || v >= this._length) throw new Error("start argument out of range");
            if (v + d < 0) throw new Error("Cannot shift elements in list beyond index 0");
            if (d > 0) {
              for (let i = g - 1; i >= 0; i--) this.set(v + i + d, this.get(v + i));
              const e = v + g + d - this._length;
              if (e > 0) for (this._length += e; this._length > this._maxLength; ) this._length--, this._startIndex++, this.onTrimEmitter.fire(1);
            } else for (let e = 0; e < g; e++) this.set(v + e + d, this.get(v + e));
          }
        }
        _getCyclicIndex(v) {
          return (this._startIndex + v) % this._maxLength;
        }
      }
      r.CircularList = n;
    }, 1439: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.clone = void 0, r.clone = function o(c, _ = 5) {
        if (typeof c != "object") return c;
        const n = Array.isArray(c) ? [] : {};
        for (const u in c) n[u] = _ <= 1 ? c[u] : c[u] && o(c[u], _ - 1);
        return n;
      };
    }, 8055: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.contrastRatio = r.toPaddedHex = r.rgba = r.rgb = r.css = r.color = r.channels = r.NULL_COLOR = void 0;
      const c = o(6114);
      let _ = 0, n = 0, u = 0, v = 0;
      var g, d, e, i, t;
      function s(l) {
        const f = l.toString(16);
        return f.length < 2 ? "0" + f : f;
      }
      function a(l, f) {
        return l < f ? (f + 0.05) / (l + 0.05) : (l + 0.05) / (f + 0.05);
      }
      r.NULL_COLOR = { css: "#00000000", rgba: 0 }, function(l) {
        l.toCss = function(f, m, h, p) {
          return p !== void 0 ? `#${s(f)}${s(m)}${s(h)}${s(p)}` : `#${s(f)}${s(m)}${s(h)}`;
        }, l.toRgba = function(f, m, h, p = 255) {
          return (f << 24 | m << 16 | h << 8 | p) >>> 0;
        };
      }(g || (r.channels = g = {})), function(l) {
        function f(m, h) {
          return v = Math.round(255 * h), [_, n, u] = t.toChannels(m.rgba), { css: g.toCss(_, n, u, v), rgba: g.toRgba(_, n, u, v) };
        }
        l.blend = function(m, h) {
          if (v = (255 & h.rgba) / 255, v === 1) return { css: h.css, rgba: h.rgba };
          const p = h.rgba >> 24 & 255, b = h.rgba >> 16 & 255, x = h.rgba >> 8 & 255, y = m.rgba >> 24 & 255, k = m.rgba >> 16 & 255, D = m.rgba >> 8 & 255;
          return _ = y + Math.round((p - y) * v), n = k + Math.round((b - k) * v), u = D + Math.round((x - D) * v), { css: g.toCss(_, n, u), rgba: g.toRgba(_, n, u) };
        }, l.isOpaque = function(m) {
          return (255 & m.rgba) == 255;
        }, l.ensureContrastRatio = function(m, h, p) {
          const b = t.ensureContrastRatio(m.rgba, h.rgba, p);
          if (b) return t.toColor(b >> 24 & 255, b >> 16 & 255, b >> 8 & 255);
        }, l.opaque = function(m) {
          const h = (255 | m.rgba) >>> 0;
          return [_, n, u] = t.toChannels(h), { css: g.toCss(_, n, u), rgba: h };
        }, l.opacity = f, l.multiplyOpacity = function(m, h) {
          return v = 255 & m.rgba, f(m, v * h / 255);
        }, l.toColorRGB = function(m) {
          return [m.rgba >> 24 & 255, m.rgba >> 16 & 255, m.rgba >> 8 & 255];
        };
      }(d || (r.color = d = {})), function(l) {
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
              return _ = parseInt(h.slice(1, 2).repeat(2), 16), n = parseInt(h.slice(2, 3).repeat(2), 16), u = parseInt(h.slice(3, 4).repeat(2), 16), t.toColor(_, n, u);
            case 5:
              return _ = parseInt(h.slice(1, 2).repeat(2), 16), n = parseInt(h.slice(2, 3).repeat(2), 16), u = parseInt(h.slice(3, 4).repeat(2), 16), v = parseInt(h.slice(4, 5).repeat(2), 16), t.toColor(_, n, u, v);
            case 7:
              return { css: h, rgba: (parseInt(h.slice(1), 16) << 8 | 255) >>> 0 };
            case 9:
              return { css: h, rgba: parseInt(h.slice(1), 16) >>> 0 };
          }
          const p = h.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0|1|\d?\.(\d+))\s*)?\)/);
          if (p) return _ = parseInt(p[1]), n = parseInt(p[2]), u = parseInt(p[3]), v = Math.round(255 * (p[5] === void 0 ? 1 : parseFloat(p[5]))), t.toColor(_, n, u, v);
          if (!f || !m) throw new Error("css.toColor: Unsupported css format");
          if (f.fillStyle = m, f.fillStyle = h, typeof f.fillStyle != "string") throw new Error("css.toColor: Unsupported css format");
          if (f.fillRect(0, 0, 1, 1), [_, n, u, v] = f.getImageData(0, 0, 1, 1).data, v !== 255) throw new Error("css.toColor: Unsupported css format");
          return { rgba: g.toRgba(_, n, u, v), css: h };
        };
      }(e || (r.css = e = {})), function(l) {
        function f(m, h, p) {
          const b = m / 255, x = h / 255, y = p / 255;
          return 0.2126 * (b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)) + 0.7152 * (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)) + 0.0722 * (y <= 0.03928 ? y / 12.92 : Math.pow((y + 0.055) / 1.055, 2.4));
        }
        l.relativeLuminance = function(m) {
          return f(m >> 16 & 255, m >> 8 & 255, 255 & m);
        }, l.relativeLuminance2 = f;
      }(i || (r.rgb = i = {})), function(l) {
        function f(h, p, b) {
          const x = h >> 24 & 255, y = h >> 16 & 255, k = h >> 8 & 255;
          let D = p >> 24 & 255, M = p >> 16 & 255, P = p >> 8 & 255, O = a(i.relativeLuminance2(D, M, P), i.relativeLuminance2(x, y, k));
          for (; O < b && (D > 0 || M > 0 || P > 0); ) D -= Math.max(0, Math.ceil(0.1 * D)), M -= Math.max(0, Math.ceil(0.1 * M)), P -= Math.max(0, Math.ceil(0.1 * P)), O = a(i.relativeLuminance2(D, M, P), i.relativeLuminance2(x, y, k));
          return (D << 24 | M << 16 | P << 8 | 255) >>> 0;
        }
        function m(h, p, b) {
          const x = h >> 24 & 255, y = h >> 16 & 255, k = h >> 8 & 255;
          let D = p >> 24 & 255, M = p >> 16 & 255, P = p >> 8 & 255, O = a(i.relativeLuminance2(D, M, P), i.relativeLuminance2(x, y, k));
          for (; O < b && (D < 255 || M < 255 || P < 255); ) D = Math.min(255, D + Math.ceil(0.1 * (255 - D))), M = Math.min(255, M + Math.ceil(0.1 * (255 - M))), P = Math.min(255, P + Math.ceil(0.1 * (255 - P))), O = a(i.relativeLuminance2(D, M, P), i.relativeLuminance2(x, y, k));
          return (D << 24 | M << 16 | P << 8 | 255) >>> 0;
        }
        l.ensureContrastRatio = function(h, p, b) {
          const x = i.relativeLuminance(h >> 8), y = i.relativeLuminance(p >> 8);
          if (a(x, y) < b) {
            if (y < x) {
              const M = f(h, p, b), P = a(x, i.relativeLuminance(M >> 8));
              if (P < b) {
                const O = m(h, p, b);
                return P > a(x, i.relativeLuminance(O >> 8)) ? M : O;
              }
              return M;
            }
            const k = m(h, p, b), D = a(x, i.relativeLuminance(k >> 8));
            if (D < b) {
              const M = f(h, p, b);
              return D > a(x, i.relativeLuminance(M >> 8)) ? k : M;
            }
            return k;
          }
        }, l.reduceLuminance = f, l.increaseLuminance = m, l.toChannels = function(h) {
          return [h >> 24 & 255, h >> 16 & 255, h >> 8 & 255, 255 & h];
        }, l.toColor = function(h, p, b, x) {
          return { css: g.toCss(h, p, b, x), rgba: g.toRgba(h, p, b, x) };
        };
      }(t || (r.rgba = t = {})), r.toPaddedHex = s, r.contrastRatio = a;
    }, 8969: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CoreTerminal = void 0;
      const c = o(844), _ = o(2585), n = o(4348), u = o(7866), v = o(744), g = o(7302), d = o(6975), e = o(8460), i = o(1753), t = o(1480), s = o(7994), a = o(9282), l = o(5435), f = o(5981), m = o(2660);
      let h = !1;
      class p extends c.Disposable {
        get onScroll() {
          return this._onScrollApi || (this._onScrollApi = this.register(new e.EventEmitter()), this._onScroll.event((x) => {
            var y;
            (y = this._onScrollApi) === null || y === void 0 || y.fire(x.position);
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
        set options(x) {
          for (const y in x) this.optionsService.options[y] = x[y];
        }
        constructor(x) {
          super(), this._windowsWrappingHeuristics = this.register(new c.MutableDisposable()), this._onBinary = this.register(new e.EventEmitter()), this.onBinary = this._onBinary.event, this._onData = this.register(new e.EventEmitter()), this.onData = this._onData.event, this._onLineFeed = this.register(new e.EventEmitter()), this.onLineFeed = this._onLineFeed.event, this._onResize = this.register(new e.EventEmitter()), this.onResize = this._onResize.event, this._onWriteParsed = this.register(new e.EventEmitter()), this.onWriteParsed = this._onWriteParsed.event, this._onScroll = this.register(new e.EventEmitter()), this._instantiationService = new n.InstantiationService(), this.optionsService = this.register(new g.OptionsService(x)), this._instantiationService.setService(_.IOptionsService, this.optionsService), this._bufferService = this.register(this._instantiationService.createInstance(v.BufferService)), this._instantiationService.setService(_.IBufferService, this._bufferService), this._logService = this.register(this._instantiationService.createInstance(u.LogService)), this._instantiationService.setService(_.ILogService, this._logService), this.coreService = this.register(this._instantiationService.createInstance(d.CoreService)), this._instantiationService.setService(_.ICoreService, this.coreService), this.coreMouseService = this.register(this._instantiationService.createInstance(i.CoreMouseService)), this._instantiationService.setService(_.ICoreMouseService, this.coreMouseService), this.unicodeService = this.register(this._instantiationService.createInstance(t.UnicodeService)), this._instantiationService.setService(_.IUnicodeService, this.unicodeService), this._charsetService = this._instantiationService.createInstance(s.CharsetService), this._instantiationService.setService(_.ICharsetService, this._charsetService), this._oscLinkService = this._instantiationService.createInstance(m.OscLinkService), this._instantiationService.setService(_.IOscLinkService, this._oscLinkService), this._inputHandler = this.register(new l.InputHandler(this._bufferService, this._charsetService, this.coreService, this._logService, this.optionsService, this._oscLinkService, this.coreMouseService, this.unicodeService)), this.register((0, e.forwardEvent)(this._inputHandler.onLineFeed, this._onLineFeed)), this.register(this._inputHandler), this.register((0, e.forwardEvent)(this._bufferService.onResize, this._onResize)), this.register((0, e.forwardEvent)(this.coreService.onData, this._onData)), this.register((0, e.forwardEvent)(this.coreService.onBinary, this._onBinary)), this.register(this.coreService.onRequestScrollToBottom(() => this.scrollToBottom())), this.register(this.coreService.onUserInput(() => this._writeBuffer.handleUserInput())), this.register(this.optionsService.onMultipleOptionChange(["windowsMode", "windowsPty"], () => this._handleWindowsPtyOptionChange())), this.register(this._bufferService.onScroll((y) => {
            this._onScroll.fire({ position: this._bufferService.buffer.ydisp, source: 0 }), this._inputHandler.markRangeDirty(this._bufferService.buffer.scrollTop, this._bufferService.buffer.scrollBottom);
          })), this.register(this._inputHandler.onScroll((y) => {
            this._onScroll.fire({ position: this._bufferService.buffer.ydisp, source: 0 }), this._inputHandler.markRangeDirty(this._bufferService.buffer.scrollTop, this._bufferService.buffer.scrollBottom);
          })), this._writeBuffer = this.register(new f.WriteBuffer((y, k) => this._inputHandler.parse(y, k))), this.register((0, e.forwardEvent)(this._writeBuffer.onWriteParsed, this._onWriteParsed));
        }
        write(x, y) {
          this._writeBuffer.write(x, y);
        }
        writeSync(x, y) {
          this._logService.logLevel <= _.LogLevelEnum.WARN && !h && (this._logService.warn("writeSync is unreliable and will be removed soon."), h = !0), this._writeBuffer.writeSync(x, y);
        }
        resize(x, y) {
          isNaN(x) || isNaN(y) || (x = Math.max(x, v.MINIMUM_COLS), y = Math.max(y, v.MINIMUM_ROWS), this._bufferService.resize(x, y));
        }
        scroll(x, y = !1) {
          this._bufferService.scroll(x, y);
        }
        scrollLines(x, y, k) {
          this._bufferService.scrollLines(x, y, k);
        }
        scrollPages(x) {
          this.scrollLines(x * (this.rows - 1));
        }
        scrollToTop() {
          this.scrollLines(-this._bufferService.buffer.ydisp);
        }
        scrollToBottom() {
          this.scrollLines(this._bufferService.buffer.ybase - this._bufferService.buffer.ydisp);
        }
        scrollToLine(x) {
          const y = x - this._bufferService.buffer.ydisp;
          y !== 0 && this.scrollLines(y);
        }
        registerEscHandler(x, y) {
          return this._inputHandler.registerEscHandler(x, y);
        }
        registerDcsHandler(x, y) {
          return this._inputHandler.registerDcsHandler(x, y);
        }
        registerCsiHandler(x, y) {
          return this._inputHandler.registerCsiHandler(x, y);
        }
        registerOscHandler(x, y) {
          return this._inputHandler.registerOscHandler(x, y);
        }
        _setup() {
          this._handleWindowsPtyOptionChange();
        }
        reset() {
          this._inputHandler.reset(), this._bufferService.reset(), this._charsetService.reset(), this.coreService.reset(), this.coreMouseService.reset();
        }
        _handleWindowsPtyOptionChange() {
          let x = !1;
          const y = this.optionsService.rawOptions.windowsPty;
          y && y.buildNumber !== void 0 && y.buildNumber !== void 0 ? x = y.backend === "conpty" && y.buildNumber < 21376 : this.optionsService.rawOptions.windowsMode && (x = !0), x ? this._enableWindowsWrappingHeuristics() : this._windowsWrappingHeuristics.clear();
        }
        _enableWindowsWrappingHeuristics() {
          if (!this._windowsWrappingHeuristics.value) {
            const x = [];
            x.push(this.onLineFeed(a.updateWindowsModeWrappedState.bind(null, this._bufferService))), x.push(this.registerCsiHandler({ final: "H" }, () => ((0, a.updateWindowsModeWrappedState)(this._bufferService), !1))), this._windowsWrappingHeuristics.value = (0, c.toDisposable)(() => {
              for (const y of x) y.dispose();
            });
          }
        }
      }
      r.CoreTerminal = p;
    }, 8460: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.forwardEvent = r.EventEmitter = void 0, r.EventEmitter = class {
        constructor() {
          this._listeners = [], this._disposed = !1;
        }
        get event() {
          return this._event || (this._event = (o) => (this._listeners.push(o), { dispose: () => {
            if (!this._disposed) {
              for (let c = 0; c < this._listeners.length; c++) if (this._listeners[c] === o) return void this._listeners.splice(c, 1);
            }
          } })), this._event;
        }
        fire(o, c) {
          const _ = [];
          for (let n = 0; n < this._listeners.length; n++) _.push(this._listeners[n]);
          for (let n = 0; n < _.length; n++) _[n].call(void 0, o, c);
        }
        dispose() {
          this.clearListeners(), this._disposed = !0;
        }
        clearListeners() {
          this._listeners && (this._listeners.length = 0);
        }
      }, r.forwardEvent = function(o, c) {
        return o((_) => c.fire(_));
      };
    }, 5435: function(B, r, o) {
      var c = this && this.__decorate || function(O, C, w, E) {
        var L, I = arguments.length, H = I < 3 ? C : E === null ? E = Object.getOwnPropertyDescriptor(C, w) : E;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") H = Reflect.decorate(O, C, w, E);
        else for (var W = O.length - 1; W >= 0; W--) (L = O[W]) && (H = (I < 3 ? L(H) : I > 3 ? L(C, w, H) : L(C, w)) || H);
        return I > 3 && H && Object.defineProperty(C, w, H), H;
      }, _ = this && this.__param || function(O, C) {
        return function(w, E) {
          C(w, E, O);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.InputHandler = r.WindowsOptionsReportType = void 0;
      const n = o(2584), u = o(7116), v = o(2015), g = o(844), d = o(482), e = o(8437), i = o(8460), t = o(643), s = o(511), a = o(3734), l = o(2585), f = o(6242), m = o(6351), h = o(5941), p = { "(": 0, ")": 1, "*": 2, "+": 3, "-": 1, ".": 2 }, b = 131072;
      function x(O, C) {
        if (O > 24) return C.setWinLines || !1;
        switch (O) {
          case 1:
            return !!C.restoreWin;
          case 2:
            return !!C.minimizeWin;
          case 3:
            return !!C.setWinPosition;
          case 4:
            return !!C.setWinSizePixels;
          case 5:
            return !!C.raiseWin;
          case 6:
            return !!C.lowerWin;
          case 7:
            return !!C.refreshWin;
          case 8:
            return !!C.setWinSizeChars;
          case 9:
            return !!C.maximizeWin;
          case 10:
            return !!C.fullscreenWin;
          case 11:
            return !!C.getWinState;
          case 13:
            return !!C.getWinPosition;
          case 14:
            return !!C.getWinSizePixels;
          case 15:
            return !!C.getScreenSizePixels;
          case 16:
            return !!C.getCellSizePixels;
          case 18:
            return !!C.getWinSizeChars;
          case 19:
            return !!C.getScreenSizeChars;
          case 20:
            return !!C.getIconTitle;
          case 21:
            return !!C.getWinTitle;
          case 22:
            return !!C.pushTitle;
          case 23:
            return !!C.popTitle;
          case 24:
            return !!C.setWinLines;
        }
        return !1;
      }
      var y;
      (function(O) {
        O[O.GET_WIN_SIZE_PIXELS = 0] = "GET_WIN_SIZE_PIXELS", O[O.GET_CELL_SIZE_PIXELS = 1] = "GET_CELL_SIZE_PIXELS";
      })(y || (r.WindowsOptionsReportType = y = {}));
      let k = 0;
      class D extends g.Disposable {
        getAttrData() {
          return this._curAttrData;
        }
        constructor(C, w, E, L, I, H, W, N, X = new v.EscapeSequenceParser()) {
          super(), this._bufferService = C, this._charsetService = w, this._coreService = E, this._logService = L, this._optionsService = I, this._oscLinkService = H, this._coreMouseService = W, this._unicodeService = N, this._parser = X, this._parseBuffer = new Uint32Array(4096), this._stringDecoder = new d.StringToUtf32(), this._utf8Decoder = new d.Utf8ToUtf32(), this._workCell = new s.CellData(), this._windowTitle = "", this._iconName = "", this._windowTitleStack = [], this._iconNameStack = [], this._curAttrData = e.DEFAULT_ATTR_DATA.clone(), this._eraseAttrDataInternal = e.DEFAULT_ATTR_DATA.clone(), this._onRequestBell = this.register(new i.EventEmitter()), this.onRequestBell = this._onRequestBell.event, this._onRequestRefreshRows = this.register(new i.EventEmitter()), this.onRequestRefreshRows = this._onRequestRefreshRows.event, this._onRequestReset = this.register(new i.EventEmitter()), this.onRequestReset = this._onRequestReset.event, this._onRequestSendFocus = this.register(new i.EventEmitter()), this.onRequestSendFocus = this._onRequestSendFocus.event, this._onRequestSyncScrollBar = this.register(new i.EventEmitter()), this.onRequestSyncScrollBar = this._onRequestSyncScrollBar.event, this._onRequestWindowsOptionsReport = this.register(new i.EventEmitter()), this.onRequestWindowsOptionsReport = this._onRequestWindowsOptionsReport.event, this._onA11yChar = this.register(new i.EventEmitter()), this.onA11yChar = this._onA11yChar.event, this._onA11yTab = this.register(new i.EventEmitter()), this.onA11yTab = this._onA11yTab.event, this._onCursorMove = this.register(new i.EventEmitter()), this.onCursorMove = this._onCursorMove.event, this._onLineFeed = this.register(new i.EventEmitter()), this.onLineFeed = this._onLineFeed.event, this._onScroll = this.register(new i.EventEmitter()), this.onScroll = this._onScroll.event, this._onTitleChange = this.register(new i.EventEmitter()), this.onTitleChange = this._onTitleChange.event, this._onColor = this.register(new i.EventEmitter()), this.onColor = this._onColor.event, this._parseStack = { paused: !1, cursorStartX: 0, cursorStartY: 0, decodedLength: 0, position: 0 }, this._specialColors = [256, 257, 258], this.register(this._parser), this._dirtyRowTracker = new M(this._bufferService), this._activeBuffer = this._bufferService.buffer, this.register(this._bufferService.buffers.onBufferActivate((S) => this._activeBuffer = S.activeBuffer)), this._parser.setCsiHandlerFallback((S, R) => {
            this._logService.debug("Unknown CSI code: ", { identifier: this._parser.identToString(S), params: R.toArray() });
          }), this._parser.setEscHandlerFallback((S) => {
            this._logService.debug("Unknown ESC code: ", { identifier: this._parser.identToString(S) });
          }), this._parser.setExecuteHandlerFallback((S) => {
            this._logService.debug("Unknown EXECUTE code: ", { code: S });
          }), this._parser.setOscHandlerFallback((S, R, T) => {
            this._logService.debug("Unknown OSC code: ", { identifier: S, action: R, data: T });
          }), this._parser.setDcsHandlerFallback((S, R, T) => {
            R === "HOOK" && (T = T.toArray()), this._logService.debug("Unknown DCS code: ", { identifier: this._parser.identToString(S), action: R, payload: T });
          }), this._parser.setPrintHandler((S, R, T) => this.print(S, R, T)), this._parser.registerCsiHandler({ final: "@" }, (S) => this.insertChars(S)), this._parser.registerCsiHandler({ intermediates: " ", final: "@" }, (S) => this.scrollLeft(S)), this._parser.registerCsiHandler({ final: "A" }, (S) => this.cursorUp(S)), this._parser.registerCsiHandler({ intermediates: " ", final: "A" }, (S) => this.scrollRight(S)), this._parser.registerCsiHandler({ final: "B" }, (S) => this.cursorDown(S)), this._parser.registerCsiHandler({ final: "C" }, (S) => this.cursorForward(S)), this._parser.registerCsiHandler({ final: "D" }, (S) => this.cursorBackward(S)), this._parser.registerCsiHandler({ final: "E" }, (S) => this.cursorNextLine(S)), this._parser.registerCsiHandler({ final: "F" }, (S) => this.cursorPrecedingLine(S)), this._parser.registerCsiHandler({ final: "G" }, (S) => this.cursorCharAbsolute(S)), this._parser.registerCsiHandler({ final: "H" }, (S) => this.cursorPosition(S)), this._parser.registerCsiHandler({ final: "I" }, (S) => this.cursorForwardTab(S)), this._parser.registerCsiHandler({ final: "J" }, (S) => this.eraseInDisplay(S, !1)), this._parser.registerCsiHandler({ prefix: "?", final: "J" }, (S) => this.eraseInDisplay(S, !0)), this._parser.registerCsiHandler({ final: "K" }, (S) => this.eraseInLine(S, !1)), this._parser.registerCsiHandler({ prefix: "?", final: "K" }, (S) => this.eraseInLine(S, !0)), this._parser.registerCsiHandler({ final: "L" }, (S) => this.insertLines(S)), this._parser.registerCsiHandler({ final: "M" }, (S) => this.deleteLines(S)), this._parser.registerCsiHandler({ final: "P" }, (S) => this.deleteChars(S)), this._parser.registerCsiHandler({ final: "S" }, (S) => this.scrollUp(S)), this._parser.registerCsiHandler({ final: "T" }, (S) => this.scrollDown(S)), this._parser.registerCsiHandler({ final: "X" }, (S) => this.eraseChars(S)), this._parser.registerCsiHandler({ final: "Z" }, (S) => this.cursorBackwardTab(S)), this._parser.registerCsiHandler({ final: "`" }, (S) => this.charPosAbsolute(S)), this._parser.registerCsiHandler({ final: "a" }, (S) => this.hPositionRelative(S)), this._parser.registerCsiHandler({ final: "b" }, (S) => this.repeatPrecedingCharacter(S)), this._parser.registerCsiHandler({ final: "c" }, (S) => this.sendDeviceAttributesPrimary(S)), this._parser.registerCsiHandler({ prefix: ">", final: "c" }, (S) => this.sendDeviceAttributesSecondary(S)), this._parser.registerCsiHandler({ final: "d" }, (S) => this.linePosAbsolute(S)), this._parser.registerCsiHandler({ final: "e" }, (S) => this.vPositionRelative(S)), this._parser.registerCsiHandler({ final: "f" }, (S) => this.hVPosition(S)), this._parser.registerCsiHandler({ final: "g" }, (S) => this.tabClear(S)), this._parser.registerCsiHandler({ final: "h" }, (S) => this.setMode(S)), this._parser.registerCsiHandler({ prefix: "?", final: "h" }, (S) => this.setModePrivate(S)), this._parser.registerCsiHandler({ final: "l" }, (S) => this.resetMode(S)), this._parser.registerCsiHandler({ prefix: "?", final: "l" }, (S) => this.resetModePrivate(S)), this._parser.registerCsiHandler({ final: "m" }, (S) => this.charAttributes(S)), this._parser.registerCsiHandler({ final: "n" }, (S) => this.deviceStatus(S)), this._parser.registerCsiHandler({ prefix: "?", final: "n" }, (S) => this.deviceStatusPrivate(S)), this._parser.registerCsiHandler({ intermediates: "!", final: "p" }, (S) => this.softReset(S)), this._parser.registerCsiHandler({ intermediates: " ", final: "q" }, (S) => this.setCursorStyle(S)), this._parser.registerCsiHandler({ final: "r" }, (S) => this.setScrollRegion(S)), this._parser.registerCsiHandler({ final: "s" }, (S) => this.saveCursor(S)), this._parser.registerCsiHandler({ final: "t" }, (S) => this.windowOptions(S)), this._parser.registerCsiHandler({ final: "u" }, (S) => this.restoreCursor(S)), this._parser.registerCsiHandler({ intermediates: "'", final: "}" }, (S) => this.insertColumns(S)), this._parser.registerCsiHandler({ intermediates: "'", final: "~" }, (S) => this.deleteColumns(S)), this._parser.registerCsiHandler({ intermediates: '"', final: "q" }, (S) => this.selectProtected(S)), this._parser.registerCsiHandler({ intermediates: "$", final: "p" }, (S) => this.requestMode(S, !0)), this._parser.registerCsiHandler({ prefix: "?", intermediates: "$", final: "p" }, (S) => this.requestMode(S, !1)), this._parser.setExecuteHandler(n.C0.BEL, () => this.bell()), this._parser.setExecuteHandler(n.C0.LF, () => this.lineFeed()), this._parser.setExecuteHandler(n.C0.VT, () => this.lineFeed()), this._parser.setExecuteHandler(n.C0.FF, () => this.lineFeed()), this._parser.setExecuteHandler(n.C0.CR, () => this.carriageReturn()), this._parser.setExecuteHandler(n.C0.BS, () => this.backspace()), this._parser.setExecuteHandler(n.C0.HT, () => this.tab()), this._parser.setExecuteHandler(n.C0.SO, () => this.shiftOut()), this._parser.setExecuteHandler(n.C0.SI, () => this.shiftIn()), this._parser.setExecuteHandler(n.C1.IND, () => this.index()), this._parser.setExecuteHandler(n.C1.NEL, () => this.nextLine()), this._parser.setExecuteHandler(n.C1.HTS, () => this.tabSet()), this._parser.registerOscHandler(0, new f.OscHandler((S) => (this.setTitle(S), this.setIconName(S), !0))), this._parser.registerOscHandler(1, new f.OscHandler((S) => this.setIconName(S))), this._parser.registerOscHandler(2, new f.OscHandler((S) => this.setTitle(S))), this._parser.registerOscHandler(4, new f.OscHandler((S) => this.setOrReportIndexedColor(S))), this._parser.registerOscHandler(8, new f.OscHandler((S) => this.setHyperlink(S))), this._parser.registerOscHandler(10, new f.OscHandler((S) => this.setOrReportFgColor(S))), this._parser.registerOscHandler(11, new f.OscHandler((S) => this.setOrReportBgColor(S))), this._parser.registerOscHandler(12, new f.OscHandler((S) => this.setOrReportCursorColor(S))), this._parser.registerOscHandler(104, new f.OscHandler((S) => this.restoreIndexedColor(S))), this._parser.registerOscHandler(110, new f.OscHandler((S) => this.restoreFgColor(S))), this._parser.registerOscHandler(111, new f.OscHandler((S) => this.restoreBgColor(S))), this._parser.registerOscHandler(112, new f.OscHandler((S) => this.restoreCursorColor(S))), this._parser.registerEscHandler({ final: "7" }, () => this.saveCursor()), this._parser.registerEscHandler({ final: "8" }, () => this.restoreCursor()), this._parser.registerEscHandler({ final: "D" }, () => this.index()), this._parser.registerEscHandler({ final: "E" }, () => this.nextLine()), this._parser.registerEscHandler({ final: "H" }, () => this.tabSet()), this._parser.registerEscHandler({ final: "M" }, () => this.reverseIndex()), this._parser.registerEscHandler({ final: "=" }, () => this.keypadApplicationMode()), this._parser.registerEscHandler({ final: ">" }, () => this.keypadNumericMode()), this._parser.registerEscHandler({ final: "c" }, () => this.fullReset()), this._parser.registerEscHandler({ final: "n" }, () => this.setgLevel(2)), this._parser.registerEscHandler({ final: "o" }, () => this.setgLevel(3)), this._parser.registerEscHandler({ final: "|" }, () => this.setgLevel(3)), this._parser.registerEscHandler({ final: "}" }, () => this.setgLevel(2)), this._parser.registerEscHandler({ final: "~" }, () => this.setgLevel(1)), this._parser.registerEscHandler({ intermediates: "%", final: "@" }, () => this.selectDefaultCharset()), this._parser.registerEscHandler({ intermediates: "%", final: "G" }, () => this.selectDefaultCharset());
          for (const S in u.CHARSETS) this._parser.registerEscHandler({ intermediates: "(", final: S }, () => this.selectCharset("(" + S)), this._parser.registerEscHandler({ intermediates: ")", final: S }, () => this.selectCharset(")" + S)), this._parser.registerEscHandler({ intermediates: "*", final: S }, () => this.selectCharset("*" + S)), this._parser.registerEscHandler({ intermediates: "+", final: S }, () => this.selectCharset("+" + S)), this._parser.registerEscHandler({ intermediates: "-", final: S }, () => this.selectCharset("-" + S)), this._parser.registerEscHandler({ intermediates: ".", final: S }, () => this.selectCharset("." + S)), this._parser.registerEscHandler({ intermediates: "/", final: S }, () => this.selectCharset("/" + S));
          this._parser.registerEscHandler({ intermediates: "#", final: "8" }, () => this.screenAlignmentPattern()), this._parser.setErrorHandler((S) => (this._logService.error("Parsing error: ", S), S)), this._parser.registerDcsHandler({ intermediates: "$", final: "q" }, new m.DcsHandler((S, R) => this.requestStatusString(S, R)));
        }
        _preserveStack(C, w, E, L) {
          this._parseStack.paused = !0, this._parseStack.cursorStartX = C, this._parseStack.cursorStartY = w, this._parseStack.decodedLength = E, this._parseStack.position = L;
        }
        _logSlowResolvingAsync(C) {
          this._logService.logLevel <= l.LogLevelEnum.WARN && Promise.race([C, new Promise((w, E) => setTimeout(() => E("#SLOW_TIMEOUT"), 5e3))]).catch((w) => {
            if (w !== "#SLOW_TIMEOUT") throw w;
            console.warn("async parser handler taking longer than 5000 ms");
          });
        }
        _getCurrentLinkId() {
          return this._curAttrData.extended.urlId;
        }
        parse(C, w) {
          let E, L = this._activeBuffer.x, I = this._activeBuffer.y, H = 0;
          const W = this._parseStack.paused;
          if (W) {
            if (E = this._parser.parse(this._parseBuffer, this._parseStack.decodedLength, w)) return this._logSlowResolvingAsync(E), E;
            L = this._parseStack.cursorStartX, I = this._parseStack.cursorStartY, this._parseStack.paused = !1, C.length > b && (H = this._parseStack.position + b);
          }
          if (this._logService.logLevel <= l.LogLevelEnum.DEBUG && this._logService.debug("parsing data" + (typeof C == "string" ? ` "${C}"` : ` "${Array.prototype.map.call(C, (N) => String.fromCharCode(N)).join("")}"`), typeof C == "string" ? C.split("").map((N) => N.charCodeAt(0)) : C), this._parseBuffer.length < C.length && this._parseBuffer.length < b && (this._parseBuffer = new Uint32Array(Math.min(C.length, b))), W || this._dirtyRowTracker.clearRange(), C.length > b) for (let N = H; N < C.length; N += b) {
            const X = N + b < C.length ? N + b : C.length, S = typeof C == "string" ? this._stringDecoder.decode(C.substring(N, X), this._parseBuffer) : this._utf8Decoder.decode(C.subarray(N, X), this._parseBuffer);
            if (E = this._parser.parse(this._parseBuffer, S)) return this._preserveStack(L, I, S, N), this._logSlowResolvingAsync(E), E;
          }
          else if (!W) {
            const N = typeof C == "string" ? this._stringDecoder.decode(C, this._parseBuffer) : this._utf8Decoder.decode(C, this._parseBuffer);
            if (E = this._parser.parse(this._parseBuffer, N)) return this._preserveStack(L, I, N, 0), this._logSlowResolvingAsync(E), E;
          }
          this._activeBuffer.x === L && this._activeBuffer.y === I || this._onCursorMove.fire(), this._onRequestRefreshRows.fire(this._dirtyRowTracker.start, this._dirtyRowTracker.end);
        }
        print(C, w, E) {
          let L, I;
          const H = this._charsetService.charset, W = this._optionsService.rawOptions.screenReaderMode, N = this._bufferService.cols, X = this._coreService.decPrivateModes.wraparound, S = this._coreService.modes.insertMode, R = this._curAttrData;
          let T = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._activeBuffer.x && E - w > 0 && T.getWidth(this._activeBuffer.x - 1) === 2 && T.setCellFromCodePoint(this._activeBuffer.x - 1, 0, 1, R.fg, R.bg, R.extended);
          for (let A = w; A < E; ++A) {
            if (L = C[A], I = this._unicodeService.wcwidth(L), L < 127 && H) {
              const j = H[String.fromCharCode(L)];
              j && (L = j.charCodeAt(0));
            }
            if (W && this._onA11yChar.fire((0, d.stringFromCodePoint)(L)), this._getCurrentLinkId() && this._oscLinkService.addLineToLink(this._getCurrentLinkId(), this._activeBuffer.ybase + this._activeBuffer.y), I || !this._activeBuffer.x) {
              if (this._activeBuffer.x + I - 1 >= N) {
                if (X) {
                  for (; this._activeBuffer.x < N; ) T.setCellFromCodePoint(this._activeBuffer.x++, 0, 1, R.fg, R.bg, R.extended);
                  this._activeBuffer.x = 0, this._activeBuffer.y++, this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--, this._bufferService.scroll(this._eraseAttrData(), !0)) : (this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1), this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = !0), T = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
                } else if (this._activeBuffer.x = N - 1, I === 2) continue;
              }
              if (S && (T.insertCells(this._activeBuffer.x, I, this._activeBuffer.getNullCell(R), R), T.getWidth(N - 1) === 2 && T.setCellFromCodePoint(N - 1, t.NULL_CELL_CODE, t.NULL_CELL_WIDTH, R.fg, R.bg, R.extended)), T.setCellFromCodePoint(this._activeBuffer.x++, L, I, R.fg, R.bg, R.extended), I > 0) for (; --I; ) T.setCellFromCodePoint(this._activeBuffer.x++, 0, 0, R.fg, R.bg, R.extended);
            } else T.getWidth(this._activeBuffer.x - 1) ? T.addCodepointToCell(this._activeBuffer.x - 1, L) : T.addCodepointToCell(this._activeBuffer.x - 2, L);
          }
          E - w > 0 && (T.loadCell(this._activeBuffer.x - 1, this._workCell), this._workCell.getWidth() === 2 || this._workCell.getCode() > 65535 ? this._parser.precedingCodepoint = 0 : this._workCell.isCombined() ? this._parser.precedingCodepoint = this._workCell.getChars().charCodeAt(0) : this._parser.precedingCodepoint = this._workCell.content), this._activeBuffer.x < N && E - w > 0 && T.getWidth(this._activeBuffer.x) === 0 && !T.hasContent(this._activeBuffer.x) && T.setCellFromCodePoint(this._activeBuffer.x, 0, 1, R.fg, R.bg, R.extended), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
        }
        registerCsiHandler(C, w) {
          return C.final !== "t" || C.prefix || C.intermediates ? this._parser.registerCsiHandler(C, w) : this._parser.registerCsiHandler(C, (E) => !x(E.params[0], this._optionsService.rawOptions.windowOptions) || w(E));
        }
        registerDcsHandler(C, w) {
          return this._parser.registerDcsHandler(C, new m.DcsHandler(w));
        }
        registerEscHandler(C, w) {
          return this._parser.registerEscHandler(C, w);
        }
        registerOscHandler(C, w) {
          return this._parser.registerOscHandler(C, new f.OscHandler(w));
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
          var C;
          if (!this._coreService.decPrivateModes.reverseWraparound) return this._restrictCursor(), this._activeBuffer.x > 0 && this._activeBuffer.x--, !0;
          if (this._restrictCursor(this._bufferService.cols), this._activeBuffer.x > 0) this._activeBuffer.x--;
          else if (this._activeBuffer.x === 0 && this._activeBuffer.y > this._activeBuffer.scrollTop && this._activeBuffer.y <= this._activeBuffer.scrollBottom && (!((C = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y)) === null || C === void 0) && C.isWrapped)) {
            this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = !1, this._activeBuffer.y--, this._activeBuffer.x = this._bufferService.cols - 1;
            const w = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
            w.hasWidth(this._activeBuffer.x) && !w.hasContent(this._activeBuffer.x) && this._activeBuffer.x--;
          }
          return this._restrictCursor(), !0;
        }
        tab() {
          if (this._activeBuffer.x >= this._bufferService.cols) return !0;
          const C = this._activeBuffer.x;
          return this._activeBuffer.x = this._activeBuffer.nextStop(), this._optionsService.rawOptions.screenReaderMode && this._onA11yTab.fire(this._activeBuffer.x - C), !0;
        }
        shiftOut() {
          return this._charsetService.setgLevel(1), !0;
        }
        shiftIn() {
          return this._charsetService.setgLevel(0), !0;
        }
        _restrictCursor(C = this._bufferService.cols - 1) {
          this._activeBuffer.x = Math.min(C, Math.max(0, this._activeBuffer.x)), this._activeBuffer.y = this._coreService.decPrivateModes.origin ? Math.min(this._activeBuffer.scrollBottom, Math.max(this._activeBuffer.scrollTop, this._activeBuffer.y)) : Math.min(this._bufferService.rows - 1, Math.max(0, this._activeBuffer.y)), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
        }
        _setCursor(C, w) {
          this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._coreService.decPrivateModes.origin ? (this._activeBuffer.x = C, this._activeBuffer.y = this._activeBuffer.scrollTop + w) : (this._activeBuffer.x = C, this._activeBuffer.y = w), this._restrictCursor(), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
        }
        _moveCursor(C, w) {
          this._restrictCursor(), this._setCursor(this._activeBuffer.x + C, this._activeBuffer.y + w);
        }
        cursorUp(C) {
          const w = this._activeBuffer.y - this._activeBuffer.scrollTop;
          return w >= 0 ? this._moveCursor(0, -Math.min(w, C.params[0] || 1)) : this._moveCursor(0, -(C.params[0] || 1)), !0;
        }
        cursorDown(C) {
          const w = this._activeBuffer.scrollBottom - this._activeBuffer.y;
          return w >= 0 ? this._moveCursor(0, Math.min(w, C.params[0] || 1)) : this._moveCursor(0, C.params[0] || 1), !0;
        }
        cursorForward(C) {
          return this._moveCursor(C.params[0] || 1, 0), !0;
        }
        cursorBackward(C) {
          return this._moveCursor(-(C.params[0] || 1), 0), !0;
        }
        cursorNextLine(C) {
          return this.cursorDown(C), this._activeBuffer.x = 0, !0;
        }
        cursorPrecedingLine(C) {
          return this.cursorUp(C), this._activeBuffer.x = 0, !0;
        }
        cursorCharAbsolute(C) {
          return this._setCursor((C.params[0] || 1) - 1, this._activeBuffer.y), !0;
        }
        cursorPosition(C) {
          return this._setCursor(C.length >= 2 ? (C.params[1] || 1) - 1 : 0, (C.params[0] || 1) - 1), !0;
        }
        charPosAbsolute(C) {
          return this._setCursor((C.params[0] || 1) - 1, this._activeBuffer.y), !0;
        }
        hPositionRelative(C) {
          return this._moveCursor(C.params[0] || 1, 0), !0;
        }
        linePosAbsolute(C) {
          return this._setCursor(this._activeBuffer.x, (C.params[0] || 1) - 1), !0;
        }
        vPositionRelative(C) {
          return this._moveCursor(0, C.params[0] || 1), !0;
        }
        hVPosition(C) {
          return this.cursorPosition(C), !0;
        }
        tabClear(C) {
          const w = C.params[0];
          return w === 0 ? delete this._activeBuffer.tabs[this._activeBuffer.x] : w === 3 && (this._activeBuffer.tabs = {}), !0;
        }
        cursorForwardTab(C) {
          if (this._activeBuffer.x >= this._bufferService.cols) return !0;
          let w = C.params[0] || 1;
          for (; w--; ) this._activeBuffer.x = this._activeBuffer.nextStop();
          return !0;
        }
        cursorBackwardTab(C) {
          if (this._activeBuffer.x >= this._bufferService.cols) return !0;
          let w = C.params[0] || 1;
          for (; w--; ) this._activeBuffer.x = this._activeBuffer.prevStop();
          return !0;
        }
        selectProtected(C) {
          const w = C.params[0];
          return w === 1 && (this._curAttrData.bg |= 536870912), w !== 2 && w !== 0 || (this._curAttrData.bg &= -536870913), !0;
        }
        _eraseInBufferLine(C, w, E, L = !1, I = !1) {
          const H = this._activeBuffer.lines.get(this._activeBuffer.ybase + C);
          H.replaceCells(w, E, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData(), I), L && (H.isWrapped = !1);
        }
        _resetBufferLine(C, w = !1) {
          const E = this._activeBuffer.lines.get(this._activeBuffer.ybase + C);
          E && (E.fill(this._activeBuffer.getNullCell(this._eraseAttrData()), w), this._bufferService.buffer.clearMarkers(this._activeBuffer.ybase + C), E.isWrapped = !1);
        }
        eraseInDisplay(C, w = !1) {
          let E;
          switch (this._restrictCursor(this._bufferService.cols), C.params[0]) {
            case 0:
              for (E = this._activeBuffer.y, this._dirtyRowTracker.markDirty(E), this._eraseInBufferLine(E++, this._activeBuffer.x, this._bufferService.cols, this._activeBuffer.x === 0, w); E < this._bufferService.rows; E++) this._resetBufferLine(E, w);
              this._dirtyRowTracker.markDirty(E);
              break;
            case 1:
              for (E = this._activeBuffer.y, this._dirtyRowTracker.markDirty(E), this._eraseInBufferLine(E, 0, this._activeBuffer.x + 1, !0, w), this._activeBuffer.x + 1 >= this._bufferService.cols && (this._activeBuffer.lines.get(E + 1).isWrapped = !1); E--; ) this._resetBufferLine(E, w);
              this._dirtyRowTracker.markDirty(0);
              break;
            case 2:
              for (E = this._bufferService.rows, this._dirtyRowTracker.markDirty(E - 1); E--; ) this._resetBufferLine(E, w);
              this._dirtyRowTracker.markDirty(0);
              break;
            case 3:
              const L = this._activeBuffer.lines.length - this._bufferService.rows;
              L > 0 && (this._activeBuffer.lines.trimStart(L), this._activeBuffer.ybase = Math.max(this._activeBuffer.ybase - L, 0), this._activeBuffer.ydisp = Math.max(this._activeBuffer.ydisp - L, 0), this._onScroll.fire(0));
          }
          return !0;
        }
        eraseInLine(C, w = !1) {
          switch (this._restrictCursor(this._bufferService.cols), C.params[0]) {
            case 0:
              this._eraseInBufferLine(this._activeBuffer.y, this._activeBuffer.x, this._bufferService.cols, this._activeBuffer.x === 0, w);
              break;
            case 1:
              this._eraseInBufferLine(this._activeBuffer.y, 0, this._activeBuffer.x + 1, !1, w);
              break;
            case 2:
              this._eraseInBufferLine(this._activeBuffer.y, 0, this._bufferService.cols, !0, w);
          }
          return this._dirtyRowTracker.markDirty(this._activeBuffer.y), !0;
        }
        insertLines(C) {
          this._restrictCursor();
          let w = C.params[0] || 1;
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const E = this._activeBuffer.ybase + this._activeBuffer.y, L = this._bufferService.rows - 1 - this._activeBuffer.scrollBottom, I = this._bufferService.rows - 1 + this._activeBuffer.ybase - L + 1;
          for (; w--; ) this._activeBuffer.lines.splice(I - 1, 1), this._activeBuffer.lines.splice(E, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom), this._activeBuffer.x = 0, !0;
        }
        deleteLines(C) {
          this._restrictCursor();
          let w = C.params[0] || 1;
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const E = this._activeBuffer.ybase + this._activeBuffer.y;
          let L;
          for (L = this._bufferService.rows - 1 - this._activeBuffer.scrollBottom, L = this._bufferService.rows - 1 + this._activeBuffer.ybase - L; w--; ) this._activeBuffer.lines.splice(E, 1), this._activeBuffer.lines.splice(L, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom), this._activeBuffer.x = 0, !0;
        }
        insertChars(C) {
          this._restrictCursor();
          const w = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          return w && (w.insertCells(this._activeBuffer.x, C.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), !0;
        }
        deleteChars(C) {
          this._restrictCursor();
          const w = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          return w && (w.deleteCells(this._activeBuffer.x, C.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), !0;
        }
        scrollUp(C) {
          let w = C.params[0] || 1;
          for (; w--; ) this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 1), this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        scrollDown(C) {
          let w = C.params[0] || 1;
          for (; w--; ) this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 1), this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 0, this._activeBuffer.getBlankLine(e.DEFAULT_ATTR_DATA));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        scrollLeft(C) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const w = C.params[0] || 1;
          for (let E = this._activeBuffer.scrollTop; E <= this._activeBuffer.scrollBottom; ++E) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + E);
            L.deleteCells(0, w, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        scrollRight(C) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const w = C.params[0] || 1;
          for (let E = this._activeBuffer.scrollTop; E <= this._activeBuffer.scrollBottom; ++E) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + E);
            L.insertCells(0, w, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        insertColumns(C) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const w = C.params[0] || 1;
          for (let E = this._activeBuffer.scrollTop; E <= this._activeBuffer.scrollBottom; ++E) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + E);
            L.insertCells(this._activeBuffer.x, w, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        deleteColumns(C) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const w = C.params[0] || 1;
          for (let E = this._activeBuffer.scrollTop; E <= this._activeBuffer.scrollBottom; ++E) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + E);
            L.deleteCells(this._activeBuffer.x, w, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        eraseChars(C) {
          this._restrictCursor();
          const w = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          return w && (w.replaceCells(this._activeBuffer.x, this._activeBuffer.x + (C.params[0] || 1), this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), !0;
        }
        repeatPrecedingCharacter(C) {
          if (!this._parser.precedingCodepoint) return !0;
          const w = C.params[0] || 1, E = new Uint32Array(w);
          for (let L = 0; L < w; ++L) E[L] = this._parser.precedingCodepoint;
          return this.print(E, 0, E.length), !0;
        }
        sendDeviceAttributesPrimary(C) {
          return C.params[0] > 0 || (this._is("xterm") || this._is("rxvt-unicode") || this._is("screen") ? this._coreService.triggerDataEvent(n.C0.ESC + "[?1;2c") : this._is("linux") && this._coreService.triggerDataEvent(n.C0.ESC + "[?6c")), !0;
        }
        sendDeviceAttributesSecondary(C) {
          return C.params[0] > 0 || (this._is("xterm") ? this._coreService.triggerDataEvent(n.C0.ESC + "[>0;276;0c") : this._is("rxvt-unicode") ? this._coreService.triggerDataEvent(n.C0.ESC + "[>85;95;0c") : this._is("linux") ? this._coreService.triggerDataEvent(C.params[0] + "c") : this._is("screen") && this._coreService.triggerDataEvent(n.C0.ESC + "[>83;40003;0c")), !0;
        }
        _is(C) {
          return (this._optionsService.rawOptions.termName + "").indexOf(C) === 0;
        }
        setMode(C) {
          for (let w = 0; w < C.length; w++) switch (C.params[w]) {
            case 4:
              this._coreService.modes.insertMode = !0;
              break;
            case 20:
              this._optionsService.options.convertEol = !0;
          }
          return !0;
        }
        setModePrivate(C) {
          for (let w = 0; w < C.length; w++) switch (C.params[w]) {
            case 1:
              this._coreService.decPrivateModes.applicationCursorKeys = !0;
              break;
            case 2:
              this._charsetService.setgCharset(0, u.DEFAULT_CHARSET), this._charsetService.setgCharset(1, u.DEFAULT_CHARSET), this._charsetService.setgCharset(2, u.DEFAULT_CHARSET), this._charsetService.setgCharset(3, u.DEFAULT_CHARSET);
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
        resetMode(C) {
          for (let w = 0; w < C.length; w++) switch (C.params[w]) {
            case 4:
              this._coreService.modes.insertMode = !1;
              break;
            case 20:
              this._optionsService.options.convertEol = !1;
          }
          return !0;
        }
        resetModePrivate(C) {
          for (let w = 0; w < C.length; w++) switch (C.params[w]) {
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
              this._bufferService.buffers.activateNormalBuffer(), C.params[w] === 1049 && this.restoreCursor(), this._coreService.isCursorInitialized = !0, this._onRequestRefreshRows.fire(0, this._bufferService.rows - 1), this._onRequestSyncScrollBar.fire();
              break;
            case 2004:
              this._coreService.decPrivateModes.bracketedPasteMode = !1;
          }
          return !0;
        }
        requestMode(C, w) {
          const E = this._coreService.decPrivateModes, { activeProtocol: L, activeEncoding: I } = this._coreMouseService, H = this._coreService, { buffers: W, cols: N } = this._bufferService, { active: X, alt: S } = W, R = this._optionsService.rawOptions, T = (q) => q ? 1 : 2, A = C.params[0];
          return j = A, F = w ? A === 2 ? 4 : A === 4 ? T(H.modes.insertMode) : A === 12 ? 3 : A === 20 ? T(R.convertEol) : 0 : A === 1 ? T(E.applicationCursorKeys) : A === 3 ? R.windowOptions.setWinLines ? N === 80 ? 2 : N === 132 ? 1 : 0 : 0 : A === 6 ? T(E.origin) : A === 7 ? T(E.wraparound) : A === 8 ? 3 : A === 9 ? T(L === "X10") : A === 12 ? T(R.cursorBlink) : A === 25 ? T(!H.isCursorHidden) : A === 45 ? T(E.reverseWraparound) : A === 66 ? T(E.applicationKeypad) : A === 67 ? 4 : A === 1e3 ? T(L === "VT200") : A === 1002 ? T(L === "DRAG") : A === 1003 ? T(L === "ANY") : A === 1004 ? T(E.sendFocus) : A === 1005 ? 4 : A === 1006 ? T(I === "SGR") : A === 1015 ? 4 : A === 1016 ? T(I === "SGR_PIXELS") : A === 1048 ? 1 : A === 47 || A === 1047 || A === 1049 ? T(X === S) : A === 2004 ? T(E.bracketedPasteMode) : 0, H.triggerDataEvent(`${n.C0.ESC}[${w ? "" : "?"}${j};${F}$y`), !0;
          var j, F;
        }
        _updateAttrColor(C, w, E, L, I) {
          return w === 2 ? (C |= 50331648, C &= -16777216, C |= a.AttributeData.fromColorRGB([E, L, I])) : w === 5 && (C &= -50331904, C |= 33554432 | 255 & E), C;
        }
        _extractColor(C, w, E) {
          const L = [0, 0, -1, 0, 0, 0];
          let I = 0, H = 0;
          do {
            if (L[H + I] = C.params[w + H], C.hasSubParams(w + H)) {
              const W = C.getSubParams(w + H);
              let N = 0;
              do
                L[1] === 5 && (I = 1), L[H + N + 1 + I] = W[N];
              while (++N < W.length && N + H + 1 + I < L.length);
              break;
            }
            if (L[1] === 5 && H + I >= 2 || L[1] === 2 && H + I >= 5) break;
            L[1] && (I = 1);
          } while (++H + w < C.length && H + I < L.length);
          for (let W = 2; W < L.length; ++W) L[W] === -1 && (L[W] = 0);
          switch (L[0]) {
            case 38:
              E.fg = this._updateAttrColor(E.fg, L[1], L[3], L[4], L[5]);
              break;
            case 48:
              E.bg = this._updateAttrColor(E.bg, L[1], L[3], L[4], L[5]);
              break;
            case 58:
              E.extended = E.extended.clone(), E.extended.underlineColor = this._updateAttrColor(E.extended.underlineColor, L[1], L[3], L[4], L[5]);
          }
          return H;
        }
        _processUnderline(C, w) {
          w.extended = w.extended.clone(), (!~C || C > 5) && (C = 1), w.extended.underlineStyle = C, w.fg |= 268435456, C === 0 && (w.fg &= -268435457), w.updateExtended();
        }
        _processSGR0(C) {
          C.fg = e.DEFAULT_ATTR_DATA.fg, C.bg = e.DEFAULT_ATTR_DATA.bg, C.extended = C.extended.clone(), C.extended.underlineStyle = 0, C.extended.underlineColor &= -67108864, C.updateExtended();
        }
        charAttributes(C) {
          if (C.length === 1 && C.params[0] === 0) return this._processSGR0(this._curAttrData), !0;
          const w = C.length;
          let E;
          const L = this._curAttrData;
          for (let I = 0; I < w; I++) E = C.params[I], E >= 30 && E <= 37 ? (L.fg &= -50331904, L.fg |= 16777216 | E - 30) : E >= 40 && E <= 47 ? (L.bg &= -50331904, L.bg |= 16777216 | E - 40) : E >= 90 && E <= 97 ? (L.fg &= -50331904, L.fg |= 16777224 | E - 90) : E >= 100 && E <= 107 ? (L.bg &= -50331904, L.bg |= 16777224 | E - 100) : E === 0 ? this._processSGR0(L) : E === 1 ? L.fg |= 134217728 : E === 3 ? L.bg |= 67108864 : E === 4 ? (L.fg |= 268435456, this._processUnderline(C.hasSubParams(I) ? C.getSubParams(I)[0] : 1, L)) : E === 5 ? L.fg |= 536870912 : E === 7 ? L.fg |= 67108864 : E === 8 ? L.fg |= 1073741824 : E === 9 ? L.fg |= 2147483648 : E === 2 ? L.bg |= 134217728 : E === 21 ? this._processUnderline(2, L) : E === 22 ? (L.fg &= -134217729, L.bg &= -134217729) : E === 23 ? L.bg &= -67108865 : E === 24 ? (L.fg &= -268435457, this._processUnderline(0, L)) : E === 25 ? L.fg &= -536870913 : E === 27 ? L.fg &= -67108865 : E === 28 ? L.fg &= -1073741825 : E === 29 ? L.fg &= 2147483647 : E === 39 ? (L.fg &= -67108864, L.fg |= 16777215 & e.DEFAULT_ATTR_DATA.fg) : E === 49 ? (L.bg &= -67108864, L.bg |= 16777215 & e.DEFAULT_ATTR_DATA.bg) : E === 38 || E === 48 || E === 58 ? I += this._extractColor(C, I, L) : E === 53 ? L.bg |= 1073741824 : E === 55 ? L.bg &= -1073741825 : E === 59 ? (L.extended = L.extended.clone(), L.extended.underlineColor = -1, L.updateExtended()) : E === 100 ? (L.fg &= -67108864, L.fg |= 16777215 & e.DEFAULT_ATTR_DATA.fg, L.bg &= -67108864, L.bg |= 16777215 & e.DEFAULT_ATTR_DATA.bg) : this._logService.debug("Unknown SGR attribute: %d.", E);
          return !0;
        }
        deviceStatus(C) {
          switch (C.params[0]) {
            case 5:
              this._coreService.triggerDataEvent(`${n.C0.ESC}[0n`);
              break;
            case 6:
              const w = this._activeBuffer.y + 1, E = this._activeBuffer.x + 1;
              this._coreService.triggerDataEvent(`${n.C0.ESC}[${w};${E}R`);
          }
          return !0;
        }
        deviceStatusPrivate(C) {
          if (C.params[0] === 6) {
            const w = this._activeBuffer.y + 1, E = this._activeBuffer.x + 1;
            this._coreService.triggerDataEvent(`${n.C0.ESC}[?${w};${E}R`);
          }
          return !0;
        }
        softReset(C) {
          return this._coreService.isCursorHidden = !1, this._onRequestSyncScrollBar.fire(), this._activeBuffer.scrollTop = 0, this._activeBuffer.scrollBottom = this._bufferService.rows - 1, this._curAttrData = e.DEFAULT_ATTR_DATA.clone(), this._coreService.reset(), this._charsetService.reset(), this._activeBuffer.savedX = 0, this._activeBuffer.savedY = this._activeBuffer.ybase, this._activeBuffer.savedCurAttrData.fg = this._curAttrData.fg, this._activeBuffer.savedCurAttrData.bg = this._curAttrData.bg, this._activeBuffer.savedCharset = this._charsetService.charset, this._coreService.decPrivateModes.origin = !1, !0;
        }
        setCursorStyle(C) {
          const w = C.params[0] || 1;
          switch (w) {
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
          const E = w % 2 == 1;
          return this._optionsService.options.cursorBlink = E, !0;
        }
        setScrollRegion(C) {
          const w = C.params[0] || 1;
          let E;
          return (C.length < 2 || (E = C.params[1]) > this._bufferService.rows || E === 0) && (E = this._bufferService.rows), E > w && (this._activeBuffer.scrollTop = w - 1, this._activeBuffer.scrollBottom = E - 1, this._setCursor(0, 0)), !0;
        }
        windowOptions(C) {
          if (!x(C.params[0], this._optionsService.rawOptions.windowOptions)) return !0;
          const w = C.length > 1 ? C.params[1] : 0;
          switch (C.params[0]) {
            case 14:
              w !== 2 && this._onRequestWindowsOptionsReport.fire(y.GET_WIN_SIZE_PIXELS);
              break;
            case 16:
              this._onRequestWindowsOptionsReport.fire(y.GET_CELL_SIZE_PIXELS);
              break;
            case 18:
              this._bufferService && this._coreService.triggerDataEvent(`${n.C0.ESC}[8;${this._bufferService.rows};${this._bufferService.cols}t`);
              break;
            case 22:
              w !== 0 && w !== 2 || (this._windowTitleStack.push(this._windowTitle), this._windowTitleStack.length > 10 && this._windowTitleStack.shift()), w !== 0 && w !== 1 || (this._iconNameStack.push(this._iconName), this._iconNameStack.length > 10 && this._iconNameStack.shift());
              break;
            case 23:
              w !== 0 && w !== 2 || this._windowTitleStack.length && this.setTitle(this._windowTitleStack.pop()), w !== 0 && w !== 1 || this._iconNameStack.length && this.setIconName(this._iconNameStack.pop());
          }
          return !0;
        }
        saveCursor(C) {
          return this._activeBuffer.savedX = this._activeBuffer.x, this._activeBuffer.savedY = this._activeBuffer.ybase + this._activeBuffer.y, this._activeBuffer.savedCurAttrData.fg = this._curAttrData.fg, this._activeBuffer.savedCurAttrData.bg = this._curAttrData.bg, this._activeBuffer.savedCharset = this._charsetService.charset, !0;
        }
        restoreCursor(C) {
          return this._activeBuffer.x = this._activeBuffer.savedX || 0, this._activeBuffer.y = Math.max(this._activeBuffer.savedY - this._activeBuffer.ybase, 0), this._curAttrData.fg = this._activeBuffer.savedCurAttrData.fg, this._curAttrData.bg = this._activeBuffer.savedCurAttrData.bg, this._charsetService.charset = this._savedCharset, this._activeBuffer.savedCharset && (this._charsetService.charset = this._activeBuffer.savedCharset), this._restrictCursor(), !0;
        }
        setTitle(C) {
          return this._windowTitle = C, this._onTitleChange.fire(C), !0;
        }
        setIconName(C) {
          return this._iconName = C, !0;
        }
        setOrReportIndexedColor(C) {
          const w = [], E = C.split(";");
          for (; E.length > 1; ) {
            const L = E.shift(), I = E.shift();
            if (/^\d+$/.exec(L)) {
              const H = parseInt(L);
              if (P(H)) if (I === "?") w.push({ type: 0, index: H });
              else {
                const W = (0, h.parseColor)(I);
                W && w.push({ type: 1, index: H, color: W });
              }
            }
          }
          return w.length && this._onColor.fire(w), !0;
        }
        setHyperlink(C) {
          const w = C.split(";");
          return !(w.length < 2) && (w[1] ? this._createHyperlink(w[0], w[1]) : !w[0] && this._finishHyperlink());
        }
        _createHyperlink(C, w) {
          this._getCurrentLinkId() && this._finishHyperlink();
          const E = C.split(":");
          let L;
          const I = E.findIndex((H) => H.startsWith("id="));
          return I !== -1 && (L = E[I].slice(3) || void 0), this._curAttrData.extended = this._curAttrData.extended.clone(), this._curAttrData.extended.urlId = this._oscLinkService.registerLink({ id: L, uri: w }), this._curAttrData.updateExtended(), !0;
        }
        _finishHyperlink() {
          return this._curAttrData.extended = this._curAttrData.extended.clone(), this._curAttrData.extended.urlId = 0, this._curAttrData.updateExtended(), !0;
        }
        _setOrReportSpecialColor(C, w) {
          const E = C.split(";");
          for (let L = 0; L < E.length && !(w >= this._specialColors.length); ++L, ++w) if (E[L] === "?") this._onColor.fire([{ type: 0, index: this._specialColors[w] }]);
          else {
            const I = (0, h.parseColor)(E[L]);
            I && this._onColor.fire([{ type: 1, index: this._specialColors[w], color: I }]);
          }
          return !0;
        }
        setOrReportFgColor(C) {
          return this._setOrReportSpecialColor(C, 0);
        }
        setOrReportBgColor(C) {
          return this._setOrReportSpecialColor(C, 1);
        }
        setOrReportCursorColor(C) {
          return this._setOrReportSpecialColor(C, 2);
        }
        restoreIndexedColor(C) {
          if (!C) return this._onColor.fire([{ type: 2 }]), !0;
          const w = [], E = C.split(";");
          for (let L = 0; L < E.length; ++L) if (/^\d+$/.exec(E[L])) {
            const I = parseInt(E[L]);
            P(I) && w.push({ type: 2, index: I });
          }
          return w.length && this._onColor.fire(w), !0;
        }
        restoreFgColor(C) {
          return this._onColor.fire([{ type: 2, index: 256 }]), !0;
        }
        restoreBgColor(C) {
          return this._onColor.fire([{ type: 2, index: 257 }]), !0;
        }
        restoreCursorColor(C) {
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
          return this._charsetService.setgLevel(0), this._charsetService.setgCharset(0, u.DEFAULT_CHARSET), !0;
        }
        selectCharset(C) {
          return C.length !== 2 ? (this.selectDefaultCharset(), !0) : (C[0] === "/" || this._charsetService.setgCharset(p[C[0]], u.CHARSETS[C[1]] || u.DEFAULT_CHARSET), !0);
        }
        index() {
          return this._restrictCursor(), this._activeBuffer.y++, this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--, this._bufferService.scroll(this._eraseAttrData())) : this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1), this._restrictCursor(), !0;
        }
        tabSet() {
          return this._activeBuffer.tabs[this._activeBuffer.x] = !0, !0;
        }
        reverseIndex() {
          if (this._restrictCursor(), this._activeBuffer.y === this._activeBuffer.scrollTop) {
            const C = this._activeBuffer.scrollBottom - this._activeBuffer.scrollTop;
            this._activeBuffer.lines.shiftElements(this._activeBuffer.ybase + this._activeBuffer.y, C, 1), this._activeBuffer.lines.set(this._activeBuffer.ybase + this._activeBuffer.y, this._activeBuffer.getBlankLine(this._eraseAttrData())), this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom);
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
        setgLevel(C) {
          return this._charsetService.setgLevel(C), !0;
        }
        screenAlignmentPattern() {
          const C = new s.CellData();
          C.content = 4194373, C.fg = this._curAttrData.fg, C.bg = this._curAttrData.bg, this._setCursor(0, 0);
          for (let w = 0; w < this._bufferService.rows; ++w) {
            const E = this._activeBuffer.ybase + this._activeBuffer.y + w, L = this._activeBuffer.lines.get(E);
            L && (L.fill(C), L.isWrapped = !1);
          }
          return this._dirtyRowTracker.markAllDirty(), this._setCursor(0, 0), !0;
        }
        requestStatusString(C, w) {
          const E = this._bufferService.buffer, L = this._optionsService.rawOptions;
          return ((I) => (this._coreService.triggerDataEvent(`${n.C0.ESC}${I}${n.C0.ESC}\\`), !0))(C === '"q' ? `P1$r${this._curAttrData.isProtected() ? 1 : 0}"q` : C === '"p' ? 'P1$r61;1"p' : C === "r" ? `P1$r${E.scrollTop + 1};${E.scrollBottom + 1}r` : C === "m" ? "P1$r0m" : C === " q" ? `P1$r${{ block: 2, underline: 4, bar: 6 }[L.cursorStyle] - (L.cursorBlink ? 1 : 0)} q` : "P0$r");
        }
        markRangeDirty(C, w) {
          this._dirtyRowTracker.markRangeDirty(C, w);
        }
      }
      r.InputHandler = D;
      let M = class {
        constructor(O) {
          this._bufferService = O, this.clearRange();
        }
        clearRange() {
          this.start = this._bufferService.buffer.y, this.end = this._bufferService.buffer.y;
        }
        markDirty(O) {
          O < this.start ? this.start = O : O > this.end && (this.end = O);
        }
        markRangeDirty(O, C) {
          O > C && (k = O, O = C, C = k), O < this.start && (this.start = O), C > this.end && (this.end = C);
        }
        markAllDirty() {
          this.markRangeDirty(0, this._bufferService.rows - 1);
        }
      };
      function P(O) {
        return 0 <= O && O < 256;
      }
      M = c([_(0, l.IBufferService)], M);
    }, 844: (B, r) => {
      function o(c) {
        for (const _ of c) _.dispose();
        c.length = 0;
      }
      Object.defineProperty(r, "__esModule", { value: !0 }), r.getDisposeArrayDisposable = r.disposeArray = r.toDisposable = r.MutableDisposable = r.Disposable = void 0, r.Disposable = class {
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
      }, r.MutableDisposable = class {
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
      }, r.toDisposable = function(c) {
        return { dispose: c };
      }, r.disposeArray = o, r.getDisposeArrayDisposable = function(c) {
        return { dispose: () => o(c) };
      };
    }, 1505: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.FourKeyMap = r.TwoKeyMap = void 0;
      class o {
        constructor() {
          this._data = {};
        }
        set(_, n, u) {
          this._data[_] || (this._data[_] = {}), this._data[_][n] = u;
        }
        get(_, n) {
          return this._data[_] ? this._data[_][n] : void 0;
        }
        clear() {
          this._data = {};
        }
      }
      r.TwoKeyMap = o, r.FourKeyMap = class {
        constructor() {
          this._data = new o();
        }
        set(c, _, n, u, v) {
          this._data.get(c, _) || this._data.set(c, _, new o()), this._data.get(c, _).set(n, u, v);
        }
        get(c, _, n, u) {
          var v;
          return (v = this._data.get(c, _)) === null || v === void 0 ? void 0 : v.get(n, u);
        }
        clear() {
          this._data.clear();
        }
      };
    }, 6114: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.isChromeOS = r.isLinux = r.isWindows = r.isIphone = r.isIpad = r.isMac = r.getSafariVersion = r.isSafari = r.isLegacyEdge = r.isFirefox = r.isNode = void 0, r.isNode = typeof navigator > "u";
      const o = r.isNode ? "node" : navigator.userAgent, c = r.isNode ? "node" : navigator.platform;
      r.isFirefox = o.includes("Firefox"), r.isLegacyEdge = o.includes("Edge"), r.isSafari = /^((?!chrome|android).)*safari/i.test(o), r.getSafariVersion = function() {
        if (!r.isSafari) return 0;
        const _ = o.match(/Version\/(\d+)/);
        return _ === null || _.length < 2 ? 0 : parseInt(_[1]);
      }, r.isMac = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].includes(c), r.isIpad = c === "iPad", r.isIphone = c === "iPhone", r.isWindows = ["Windows", "Win16", "Win32", "WinCE"].includes(c), r.isLinux = c.indexOf("Linux") >= 0, r.isChromeOS = /\bCrOS\b/.test(o);
    }, 6106: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.SortedList = void 0;
      let o = 0;
      r.SortedList = class {
        constructor(c) {
          this._getKey = c, this._array = [];
        }
        clear() {
          this._array.length = 0;
        }
        insert(c) {
          this._array.length !== 0 ? (o = this._search(this._getKey(c)), this._array.splice(o, 0, c)) : this._array.push(c);
        }
        delete(c) {
          if (this._array.length === 0) return !1;
          const _ = this._getKey(c);
          if (_ === void 0 || (o = this._search(_), o === -1) || this._getKey(this._array[o]) !== _) return !1;
          do
            if (this._array[o] === c) return this._array.splice(o, 1), !0;
          while (++o < this._array.length && this._getKey(this._array[o]) === _);
          return !1;
        }
        *getKeyIterator(c) {
          if (this._array.length !== 0 && (o = this._search(c), !(o < 0 || o >= this._array.length) && this._getKey(this._array[o]) === c)) do
            yield this._array[o];
          while (++o < this._array.length && this._getKey(this._array[o]) === c);
        }
        forEachByKey(c, _) {
          if (this._array.length !== 0 && (o = this._search(c), !(o < 0 || o >= this._array.length) && this._getKey(this._array[o]) === c)) do
            _(this._array[o]);
          while (++o < this._array.length && this._getKey(this._array[o]) === c);
        }
        values() {
          return [...this._array].values();
        }
        _search(c) {
          let _ = 0, n = this._array.length - 1;
          for (; n >= _; ) {
            let u = _ + n >> 1;
            const v = this._getKey(this._array[u]);
            if (v > c) n = u - 1;
            else {
              if (!(v < c)) {
                for (; u > 0 && this._getKey(this._array[u - 1]) === c; ) u--;
                return u;
              }
              _ = u + 1;
            }
          }
          return _;
        }
      };
    }, 7226: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.DebouncedIdleTask = r.IdleTaskQueue = r.PriorityTaskQueue = void 0;
      const c = o(6114);
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
          let g = 0, d = 0, e = v.timeRemaining(), i = 0;
          for (; this._i < this._tasks.length; ) {
            if (g = Date.now(), this._tasks[this._i]() || this._i++, g = Math.max(1, Date.now() - g), d = Math.max(g, d), i = v.timeRemaining(), 1.5 * d > i) return e - g < -20 && console.warn(`task queue exceeded allotted deadline by ${Math.abs(Math.round(e - g))}ms`), void this._start();
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
      r.PriorityTaskQueue = n, r.IdleTaskQueue = !c.isNode && "requestIdleCallback" in window ? class extends _ {
        _requestCallback(u) {
          return requestIdleCallback(u);
        }
        _cancelCallback(u) {
          cancelIdleCallback(u);
        }
      } : n, r.DebouncedIdleTask = class {
        constructor() {
          this._queue = new r.IdleTaskQueue();
        }
        set(u) {
          this._queue.clear(), this._queue.enqueue(u);
        }
        flush() {
          this._queue.flush();
        }
      };
    }, 9282: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.updateWindowsModeWrappedState = void 0;
      const c = o(643);
      r.updateWindowsModeWrappedState = function(_) {
        const n = _.buffer.lines.get(_.buffer.ybase + _.buffer.y - 1), u = n == null ? void 0 : n.get(_.cols - 1), v = _.buffer.lines.get(_.buffer.ybase + _.buffer.y);
        v && u && (v.isWrapped = u[c.CHAR_DATA_CODE_INDEX] !== c.NULL_CELL_CODE && u[c.CHAR_DATA_CODE_INDEX] !== c.WHITESPACE_CELL_CODE);
      };
    }, 3734: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.ExtendedAttrs = r.AttributeData = void 0;
      class o {
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
          const n = new o();
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
      r.AttributeData = o;
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
        constructor(n = 0, u = 0) {
          this._ext = 0, this._urlId = 0, this._ext = n, this._urlId = u;
        }
        clone() {
          return new c(this._ext, this._urlId);
        }
        isEmpty() {
          return this.underlineStyle === 0 && this._urlId === 0;
        }
      }
      r.ExtendedAttrs = c;
    }, 9092: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.Buffer = r.MAX_BUFFER_SIZE = void 0;
      const c = o(6349), _ = o(7226), n = o(3734), u = o(8437), v = o(4634), g = o(511), d = o(643), e = o(4863), i = o(7116);
      r.MAX_BUFFER_SIZE = 4294967295, r.Buffer = class {
        constructor(t, s, a) {
          this._hasScrollback = t, this._optionsService = s, this._bufferService = a, this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.tabs = {}, this.savedY = 0, this.savedX = 0, this.savedCurAttrData = u.DEFAULT_ATTR_DATA.clone(), this.savedCharset = i.DEFAULT_CHARSET, this.markers = [], this._nullCell = g.CellData.fromCharData([0, d.NULL_CELL_CHAR, d.NULL_CELL_WIDTH, d.NULL_CELL_CODE]), this._whitespaceCell = g.CellData.fromCharData([0, d.WHITESPACE_CELL_CHAR, d.WHITESPACE_CELL_WIDTH, d.WHITESPACE_CELL_CODE]), this._isClearing = !1, this._memoryCleanupQueue = new _.IdleTaskQueue(), this._memoryCleanupPosition = 0, this._cols = this._bufferService.cols, this._rows = this._bufferService.rows, this.lines = new c.CircularList(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops();
        }
        getNullCell(t) {
          return t ? (this._nullCell.fg = t.fg, this._nullCell.bg = t.bg, this._nullCell.extended = t.extended) : (this._nullCell.fg = 0, this._nullCell.bg = 0, this._nullCell.extended = new n.ExtendedAttrs()), this._nullCell;
        }
        getWhitespaceCell(t) {
          return t ? (this._whitespaceCell.fg = t.fg, this._whitespaceCell.bg = t.bg, this._whitespaceCell.extended = t.extended) : (this._whitespaceCell.fg = 0, this._whitespaceCell.bg = 0, this._whitespaceCell.extended = new n.ExtendedAttrs()), this._whitespaceCell;
        }
        getBlankLine(t, s) {
          return new u.BufferLine(this._bufferService.cols, this.getNullCell(t), s);
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
          const s = t + this._optionsService.rawOptions.scrollback;
          return s > r.MAX_BUFFER_SIZE ? r.MAX_BUFFER_SIZE : s;
        }
        fillViewportRows(t) {
          if (this.lines.length === 0) {
            t === void 0 && (t = u.DEFAULT_ATTR_DATA);
            let s = this._rows;
            for (; s--; ) this.lines.push(this.getBlankLine(t));
          }
        }
        clear() {
          this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.lines = new c.CircularList(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops();
        }
        resize(t, s) {
          const a = this.getNullCell(u.DEFAULT_ATTR_DATA);
          let l = 0;
          const f = this._getCorrectBufferLength(s);
          if (f > this.lines.maxLength && (this.lines.maxLength = f), this.lines.length > 0) {
            if (this._cols < t) for (let h = 0; h < this.lines.length; h++) l += +this.lines.get(h).resize(t, a);
            let m = 0;
            if (this._rows < s) for (let h = this._rows; h < s; h++) this.lines.length < s + this.ybase && (this._optionsService.rawOptions.windowsMode || this._optionsService.rawOptions.windowsPty.backend !== void 0 || this._optionsService.rawOptions.windowsPty.buildNumber !== void 0 ? this.lines.push(new u.BufferLine(t, a)) : this.ybase > 0 && this.lines.length <= this.ybase + this.y + m + 1 ? (this.ybase--, m++, this.ydisp > 0 && this.ydisp--) : this.lines.push(new u.BufferLine(t, a)));
            else for (let h = this._rows; h > s; h--) this.lines.length > s + this.ybase && (this.lines.length > this.ybase + this.y + 1 ? this.lines.pop() : (this.ybase++, this.ydisp++));
            if (f < this.lines.maxLength) {
              const h = this.lines.length - f;
              h > 0 && (this.lines.trimStart(h), this.ybase = Math.max(this.ybase - h, 0), this.ydisp = Math.max(this.ydisp - h, 0), this.savedY = Math.max(this.savedY - h, 0)), this.lines.maxLength = f;
            }
            this.x = Math.min(this.x, t - 1), this.y = Math.min(this.y, s - 1), m && (this.y += m), this.savedX = Math.min(this.savedX, t - 1), this.scrollTop = 0;
          }
          if (this.scrollBottom = s - 1, this._isReflowEnabled && (this._reflow(t, s), this._cols > t)) for (let m = 0; m < this.lines.length; m++) l += +this.lines.get(m).resize(t, a);
          this._cols = t, this._rows = s, this._memoryCleanupQueue.clear(), l > 0.1 * this.lines.length && (this._memoryCleanupPosition = 0, this._memoryCleanupQueue.enqueue(() => this._batchedMemoryCleanup()));
        }
        _batchedMemoryCleanup() {
          let t = !0;
          this._memoryCleanupPosition >= this.lines.length && (this._memoryCleanupPosition = 0, t = !1);
          let s = 0;
          for (; this._memoryCleanupPosition < this.lines.length; ) if (s += this.lines.get(this._memoryCleanupPosition++).cleanupMemory(), s > 100) return !0;
          return t;
        }
        get _isReflowEnabled() {
          const t = this._optionsService.rawOptions.windowsPty;
          return t && t.buildNumber ? this._hasScrollback && t.backend === "conpty" && t.buildNumber >= 21376 : this._hasScrollback && !this._optionsService.rawOptions.windowsMode;
        }
        _reflow(t, s) {
          this._cols !== t && (t > this._cols ? this._reflowLarger(t, s) : this._reflowSmaller(t, s));
        }
        _reflowLarger(t, s) {
          const a = (0, v.reflowLargerGetLinesToRemove)(this.lines, this._cols, t, this.ybase + this.y, this.getNullCell(u.DEFAULT_ATTR_DATA));
          if (a.length > 0) {
            const l = (0, v.reflowLargerCreateNewLayout)(this.lines, a);
            (0, v.reflowLargerApplyNewLayout)(this.lines, l.layout), this._reflowLargerAdjustViewport(t, s, l.countRemoved);
          }
        }
        _reflowLargerAdjustViewport(t, s, a) {
          const l = this.getNullCell(u.DEFAULT_ATTR_DATA);
          let f = a;
          for (; f-- > 0; ) this.ybase === 0 ? (this.y > 0 && this.y--, this.lines.length < s && this.lines.push(new u.BufferLine(t, l))) : (this.ydisp === this.ybase && this.ydisp--, this.ybase--);
          this.savedY = Math.max(this.savedY - a, 0);
        }
        _reflowSmaller(t, s) {
          const a = this.getNullCell(u.DEFAULT_ATTR_DATA), l = [];
          let f = 0;
          for (let m = this.lines.length - 1; m >= 0; m--) {
            let h = this.lines.get(m);
            if (!h || !h.isWrapped && h.getTrimmedLength() <= t) continue;
            const p = [h];
            for (; h.isWrapped && m > 0; ) h = this.lines.get(--m), p.unshift(h);
            const b = this.ybase + this.y;
            if (b >= m && b < m + p.length) continue;
            const x = p[p.length - 1].getTrimmedLength(), y = (0, v.reflowSmallerGetNewLineLengths)(p, this._cols, t), k = y.length - p.length;
            let D;
            D = this.ybase === 0 && this.y !== this.lines.length - 1 ? Math.max(0, this.y - this.lines.maxLength + k) : Math.max(0, this.lines.length - this.lines.maxLength + k);
            const M = [];
            for (let L = 0; L < k; L++) {
              const I = this.getBlankLine(u.DEFAULT_ATTR_DATA, !0);
              M.push(I);
            }
            M.length > 0 && (l.push({ start: m + p.length + f, newLines: M }), f += M.length), p.push(...M);
            let P = y.length - 1, O = y[P];
            O === 0 && (P--, O = y[P]);
            let C = p.length - k - 1, w = x;
            for (; C >= 0; ) {
              const L = Math.min(w, O);
              if (p[P] === void 0) break;
              if (p[P].copyCellsFrom(p[C], w - L, O - L, L, !0), O -= L, O === 0 && (P--, O = y[P]), w -= L, w === 0) {
                C--;
                const I = Math.max(C, 0);
                w = (0, v.getWrappedLineTrimmedLength)(p, I, this._cols);
              }
            }
            for (let L = 0; L < p.length; L++) y[L] < t && p[L].setCell(y[L], a);
            let E = k - D;
            for (; E-- > 0; ) this.ybase === 0 ? this.y < s - 1 ? (this.y++, this.lines.pop()) : (this.ybase++, this.ydisp++) : this.ybase < Math.min(this.lines.maxLength, this.lines.length + f) - s && (this.ybase === this.ydisp && this.ydisp++, this.ybase++);
            this.savedY = Math.min(this.savedY + k, this.ybase + s - 1);
          }
          if (l.length > 0) {
            const m = [], h = [];
            for (let P = 0; P < this.lines.length; P++) h.push(this.lines.get(P));
            const p = this.lines.length;
            let b = p - 1, x = 0, y = l[x];
            this.lines.length = Math.min(this.lines.maxLength, this.lines.length + f);
            let k = 0;
            for (let P = Math.min(this.lines.maxLength - 1, p + f - 1); P >= 0; P--) if (y && y.start > b + k) {
              for (let O = y.newLines.length - 1; O >= 0; O--) this.lines.set(P--, y.newLines[O]);
              P++, m.push({ index: b + 1, amount: y.newLines.length }), k += y.newLines.length, y = l[++x];
            } else this.lines.set(P, h[b--]);
            let D = 0;
            for (let P = m.length - 1; P >= 0; P--) m[P].index += D, this.lines.onInsertEmitter.fire(m[P]), D += m[P].amount;
            const M = Math.max(0, p + f - this.lines.maxLength);
            M > 0 && this.lines.onTrimEmitter.fire(M);
          }
        }
        translateBufferLineToString(t, s, a = 0, l) {
          const f = this.lines.get(t);
          return f ? f.translateToString(s, a, l) : "";
        }
        getWrappedRangeForLine(t) {
          let s = t, a = t;
          for (; s > 0 && this.lines.get(s).isWrapped; ) s--;
          for (; a + 1 < this.lines.length && this.lines.get(a + 1).isWrapped; ) a++;
          return { first: s, last: a };
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
          for (let s = 0; s < this.markers.length; s++) this.markers[s].line === t && (this.markers[s].dispose(), this.markers.splice(s--, 1));
          this._isClearing = !1;
        }
        clearAllMarkers() {
          this._isClearing = !0;
          for (let t = 0; t < this.markers.length; t++) this.markers[t].dispose(), this.markers.splice(t--, 1);
          this._isClearing = !1;
        }
        addMarker(t) {
          const s = new e.Marker(t);
          return this.markers.push(s), s.register(this.lines.onTrim((a) => {
            s.line -= a, s.line < 0 && s.dispose();
          })), s.register(this.lines.onInsert((a) => {
            s.line >= a.index && (s.line += a.amount);
          })), s.register(this.lines.onDelete((a) => {
            s.line >= a.index && s.line < a.index + a.amount && s.dispose(), s.line > a.index && (s.line -= a.amount);
          })), s.register(s.onDispose(() => this._removeMarker(s))), s;
        }
        _removeMarker(t) {
          this._isClearing || this.markers.splice(this.markers.indexOf(t), 1);
        }
      };
    }, 8437: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.BufferLine = r.DEFAULT_ATTR_DATA = void 0;
      const c = o(3734), _ = o(511), n = o(643), u = o(482);
      r.DEFAULT_ATTR_DATA = Object.freeze(new c.AttributeData());
      let v = 0;
      class g {
        constructor(e, i, t = !1) {
          this.isWrapped = t, this._combined = {}, this._extendedAttrs = {}, this._data = new Uint32Array(3 * e);
          const s = i || _.CellData.fromCharData([0, n.NULL_CELL_CHAR, n.NULL_CELL_WIDTH, n.NULL_CELL_CODE]);
          for (let a = 0; a < e; ++a) this.setCell(a, s);
          this.length = e;
        }
        get(e) {
          const i = this._data[3 * e + 0], t = 2097151 & i;
          return [this._data[3 * e + 1], 2097152 & i ? this._combined[e] : t ? (0, u.stringFromCodePoint)(t) : "", i >> 22, 2097152 & i ? this._combined[e].charCodeAt(this._combined[e].length - 1) : t];
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
          return 2097152 & i ? this._combined[e] : 2097151 & i ? (0, u.stringFromCodePoint)(2097151 & i) : "";
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
        setCellFromCodePoint(e, i, t, s, a, l) {
          268435456 & a && (this._extendedAttrs[e] = l), this._data[3 * e + 0] = i | t << 22, this._data[3 * e + 1] = s, this._data[3 * e + 2] = a;
        }
        addCodepointToCell(e, i) {
          let t = this._data[3 * e + 0];
          2097152 & t ? this._combined[e] += (0, u.stringFromCodePoint)(i) : (2097151 & t ? (this._combined[e] = (0, u.stringFromCodePoint)(2097151 & t) + (0, u.stringFromCodePoint)(i), t &= -2097152, t |= 2097152) : t = i | 4194304, this._data[3 * e + 0] = t);
        }
        insertCells(e, i, t, s) {
          if ((e %= this.length) && this.getWidth(e - 1) === 2 && this.setCellFromCodePoint(e - 1, 0, 1, (s == null ? void 0 : s.fg) || 0, (s == null ? void 0 : s.bg) || 0, (s == null ? void 0 : s.extended) || new c.ExtendedAttrs()), i < this.length - e) {
            const a = new _.CellData();
            for (let l = this.length - e - i - 1; l >= 0; --l) this.setCell(e + i + l, this.loadCell(e + l, a));
            for (let l = 0; l < i; ++l) this.setCell(e + l, t);
          } else for (let a = e; a < this.length; ++a) this.setCell(a, t);
          this.getWidth(this.length - 1) === 2 && this.setCellFromCodePoint(this.length - 1, 0, 1, (s == null ? void 0 : s.fg) || 0, (s == null ? void 0 : s.bg) || 0, (s == null ? void 0 : s.extended) || new c.ExtendedAttrs());
        }
        deleteCells(e, i, t, s) {
          if (e %= this.length, i < this.length - e) {
            const a = new _.CellData();
            for (let l = 0; l < this.length - e - i; ++l) this.setCell(e + l, this.loadCell(e + i + l, a));
            for (let l = this.length - i; l < this.length; ++l) this.setCell(l, t);
          } else for (let a = e; a < this.length; ++a) this.setCell(a, t);
          e && this.getWidth(e - 1) === 2 && this.setCellFromCodePoint(e - 1, 0, 1, (s == null ? void 0 : s.fg) || 0, (s == null ? void 0 : s.bg) || 0, (s == null ? void 0 : s.extended) || new c.ExtendedAttrs()), this.getWidth(e) !== 0 || this.hasContent(e) || this.setCellFromCodePoint(e, 0, 1, (s == null ? void 0 : s.fg) || 0, (s == null ? void 0 : s.bg) || 0, (s == null ? void 0 : s.extended) || new c.ExtendedAttrs());
        }
        replaceCells(e, i, t, s, a = !1) {
          if (a) for (e && this.getWidth(e - 1) === 2 && !this.isProtected(e - 1) && this.setCellFromCodePoint(e - 1, 0, 1, (s == null ? void 0 : s.fg) || 0, (s == null ? void 0 : s.bg) || 0, (s == null ? void 0 : s.extended) || new c.ExtendedAttrs()), i < this.length && this.getWidth(i - 1) === 2 && !this.isProtected(i) && this.setCellFromCodePoint(i, 0, 1, (s == null ? void 0 : s.fg) || 0, (s == null ? void 0 : s.bg) || 0, (s == null ? void 0 : s.extended) || new c.ExtendedAttrs()); e < i && e < this.length; ) this.isProtected(e) || this.setCell(e, t), e++;
          else for (e && this.getWidth(e - 1) === 2 && this.setCellFromCodePoint(e - 1, 0, 1, (s == null ? void 0 : s.fg) || 0, (s == null ? void 0 : s.bg) || 0, (s == null ? void 0 : s.extended) || new c.ExtendedAttrs()), i < this.length && this.getWidth(i - 1) === 2 && this.setCellFromCodePoint(i, 0, 1, (s == null ? void 0 : s.fg) || 0, (s == null ? void 0 : s.bg) || 0, (s == null ? void 0 : s.extended) || new c.ExtendedAttrs()); e < i && e < this.length; ) this.setCell(e++, t);
        }
        resize(e, i) {
          if (e === this.length) return 4 * this._data.length * 2 < this._data.buffer.byteLength;
          const t = 3 * e;
          if (e > this.length) {
            if (this._data.buffer.byteLength >= 4 * t) this._data = new Uint32Array(this._data.buffer, 0, t);
            else {
              const s = new Uint32Array(t);
              s.set(this._data), this._data = s;
            }
            for (let s = this.length; s < e; ++s) this.setCell(s, i);
          } else {
            this._data = this._data.subarray(0, t);
            const s = Object.keys(this._combined);
            for (let l = 0; l < s.length; l++) {
              const f = parseInt(s[l], 10);
              f >= e && delete this._combined[f];
            }
            const a = Object.keys(this._extendedAttrs);
            for (let l = 0; l < a.length; l++) {
              const f = parseInt(a[l], 10);
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
        copyCellsFrom(e, i, t, s, a) {
          const l = e._data;
          if (a) for (let m = s - 1; m >= 0; m--) {
            for (let h = 0; h < 3; h++) this._data[3 * (t + m) + h] = l[3 * (i + m) + h];
            268435456 & l[3 * (i + m) + 2] && (this._extendedAttrs[t + m] = e._extendedAttrs[i + m]);
          }
          else for (let m = 0; m < s; m++) {
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
          let s = "";
          for (; i < t; ) {
            const a = this._data[3 * i + 0], l = 2097151 & a;
            s += 2097152 & a ? this._combined[i] : l ? (0, u.stringFromCodePoint)(l) : n.WHITESPACE_CELL_CHAR, i += a >> 22 || 1;
          }
          return s;
        }
      }
      r.BufferLine = g;
    }, 4841: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.getRangeLength = void 0, r.getRangeLength = function(o, c) {
        if (o.start.y > o.end.y) throw new Error(`Buffer range end (${o.end.x}, ${o.end.y}) cannot be before start (${o.start.x}, ${o.start.y})`);
        return c * (o.end.y - o.start.y) + (o.end.x - o.start.x + 1);
      };
    }, 4634: (B, r) => {
      function o(c, _, n) {
        if (_ === c.length - 1) return c[_].getTrimmedLength();
        const u = !c[_].hasContent(n - 1) && c[_].getWidth(n - 1) === 1, v = c[_ + 1].getWidth(0) === 2;
        return u && v ? n - 1 : n;
      }
      Object.defineProperty(r, "__esModule", { value: !0 }), r.getWrappedLineTrimmedLength = r.reflowSmallerGetNewLineLengths = r.reflowLargerApplyNewLayout = r.reflowLargerCreateNewLayout = r.reflowLargerGetLinesToRemove = void 0, r.reflowLargerGetLinesToRemove = function(c, _, n, u, v) {
        const g = [];
        for (let d = 0; d < c.length - 1; d++) {
          let e = d, i = c.get(++e);
          if (!i.isWrapped) continue;
          const t = [c.get(d)];
          for (; e < c.length && i.isWrapped; ) t.push(i), i = c.get(++e);
          if (u >= d && u < e) {
            d += t.length - 1;
            continue;
          }
          let s = 0, a = o(t, s, _), l = 1, f = 0;
          for (; l < t.length; ) {
            const h = o(t, l, _), p = h - f, b = n - a, x = Math.min(p, b);
            t[s].copyCellsFrom(t[l], f, a, x, !1), a += x, a === n && (s++, a = 0), f += x, f === h && (l++, f = 0), a === 0 && s !== 0 && t[s - 1].getWidth(n - 1) === 2 && (t[s].copyCellsFrom(t[s - 1], n - 1, a++, 1, !1), t[s - 1].setCell(n - 1, v));
          }
          t[s].replaceCells(a, n, v);
          let m = 0;
          for (let h = t.length - 1; h > 0 && (h > s || t[h].getTrimmedLength() === 0); h--) m++;
          m > 0 && (g.push(d + t.length - m), g.push(m)), d += t.length - 1;
        }
        return g;
      }, r.reflowLargerCreateNewLayout = function(c, _) {
        const n = [];
        let u = 0, v = _[u], g = 0;
        for (let d = 0; d < c.length; d++) if (v === d) {
          const e = _[++u];
          c.onDeleteEmitter.fire({ index: d - g, amount: e }), d += e - 1, g += e, v = _[++u];
        } else n.push(d);
        return { layout: n, countRemoved: g };
      }, r.reflowLargerApplyNewLayout = function(c, _) {
        const n = [];
        for (let u = 0; u < _.length; u++) n.push(c.get(_[u]));
        for (let u = 0; u < n.length; u++) c.set(u, n[u]);
        c.length = _.length;
      }, r.reflowSmallerGetNewLineLengths = function(c, _, n) {
        const u = [], v = c.map((i, t) => o(c, t, _)).reduce((i, t) => i + t);
        let g = 0, d = 0, e = 0;
        for (; e < v; ) {
          if (v - e < n) {
            u.push(v - e);
            break;
          }
          g += n;
          const i = o(c, d, _);
          g > i && (g -= i, d++);
          const t = c[d].getWidth(g - 1) === 2;
          t && g--;
          const s = t ? n - 1 : n;
          u.push(s), e += s;
        }
        return u;
      }, r.getWrappedLineTrimmedLength = o;
    }, 5295: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.BufferSet = void 0;
      const c = o(8460), _ = o(844), n = o(9092);
      class u extends _.Disposable {
        constructor(g, d) {
          super(), this._optionsService = g, this._bufferService = d, this._onBufferActivate = this.register(new c.EventEmitter()), this.onBufferActivate = this._onBufferActivate.event, this.reset(), this.register(this._optionsService.onSpecificOptionChange("scrollback", () => this.resize(this._bufferService.cols, this._bufferService.rows))), this.register(this._optionsService.onSpecificOptionChange("tabStopWidth", () => this.setupTabStops()));
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
        resize(g, d) {
          this._normal.resize(g, d), this._alt.resize(g, d), this.setupTabStops(g);
        }
        setupTabStops(g) {
          this._normal.setupTabStops(g), this._alt.setupTabStops(g);
        }
      }
      r.BufferSet = u;
    }, 511: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CellData = void 0;
      const c = o(482), _ = o(643), n = o(3734);
      class u extends n.AttributeData {
        constructor() {
          super(...arguments), this.content = 0, this.fg = 0, this.bg = 0, this.extended = new n.ExtendedAttrs(), this.combinedData = "";
        }
        static fromCharData(g) {
          const d = new u();
          return d.setFromCharData(g), d;
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
          let d = !1;
          if (g[_.CHAR_DATA_CHAR_INDEX].length > 2) d = !0;
          else if (g[_.CHAR_DATA_CHAR_INDEX].length === 2) {
            const e = g[_.CHAR_DATA_CHAR_INDEX].charCodeAt(0);
            if (55296 <= e && e <= 56319) {
              const i = g[_.CHAR_DATA_CHAR_INDEX].charCodeAt(1);
              56320 <= i && i <= 57343 ? this.content = 1024 * (e - 55296) + i - 56320 + 65536 | g[_.CHAR_DATA_WIDTH_INDEX] << 22 : d = !0;
            } else d = !0;
          } else this.content = g[_.CHAR_DATA_CHAR_INDEX].charCodeAt(0) | g[_.CHAR_DATA_WIDTH_INDEX] << 22;
          d && (this.combinedData = g[_.CHAR_DATA_CHAR_INDEX], this.content = 2097152 | g[_.CHAR_DATA_WIDTH_INDEX] << 22);
        }
        getAsCharData() {
          return [this.fg, this.getChars(), this.getWidth(), this.getCode()];
        }
      }
      r.CellData = u;
    }, 643: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.WHITESPACE_CELL_CODE = r.WHITESPACE_CELL_WIDTH = r.WHITESPACE_CELL_CHAR = r.NULL_CELL_CODE = r.NULL_CELL_WIDTH = r.NULL_CELL_CHAR = r.CHAR_DATA_CODE_INDEX = r.CHAR_DATA_WIDTH_INDEX = r.CHAR_DATA_CHAR_INDEX = r.CHAR_DATA_ATTR_INDEX = r.DEFAULT_EXT = r.DEFAULT_ATTR = r.DEFAULT_COLOR = void 0, r.DEFAULT_COLOR = 0, r.DEFAULT_ATTR = 256 | r.DEFAULT_COLOR << 9, r.DEFAULT_EXT = 0, r.CHAR_DATA_ATTR_INDEX = 0, r.CHAR_DATA_CHAR_INDEX = 1, r.CHAR_DATA_WIDTH_INDEX = 2, r.CHAR_DATA_CODE_INDEX = 3, r.NULL_CELL_CHAR = "", r.NULL_CELL_WIDTH = 1, r.NULL_CELL_CODE = 0, r.WHITESPACE_CELL_CHAR = " ", r.WHITESPACE_CELL_WIDTH = 1, r.WHITESPACE_CELL_CODE = 32;
    }, 4863: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.Marker = void 0;
      const c = o(8460), _ = o(844);
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
      r.Marker = n, n._nextId = 1;
    }, 7116: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.DEFAULT_CHARSET = r.CHARSETS = void 0, r.CHARSETS = {}, r.DEFAULT_CHARSET = r.CHARSETS.B, r.CHARSETS[0] = { "`": "◆", a: "▒", b: "␉", c: "␌", d: "␍", e: "␊", f: "°", g: "±", h: "␤", i: "␋", j: "┘", k: "┐", l: "┌", m: "└", n: "┼", o: "⎺", p: "⎻", q: "─", r: "⎼", s: "⎽", t: "├", u: "┤", v: "┴", w: "┬", x: "│", y: "≤", z: "≥", "{": "π", "|": "≠", "}": "£", "~": "·" }, r.CHARSETS.A = { "#": "£" }, r.CHARSETS.B = void 0, r.CHARSETS[4] = { "#": "£", "@": "¾", "[": "ij", "\\": "½", "]": "|", "{": "¨", "|": "f", "}": "¼", "~": "´" }, r.CHARSETS.C = r.CHARSETS[5] = { "[": "Ä", "\\": "Ö", "]": "Å", "^": "Ü", "`": "é", "{": "ä", "|": "ö", "}": "å", "~": "ü" }, r.CHARSETS.R = { "#": "£", "@": "à", "[": "°", "\\": "ç", "]": "§", "{": "é", "|": "ù", "}": "è", "~": "¨" }, r.CHARSETS.Q = { "@": "à", "[": "â", "\\": "ç", "]": "ê", "^": "î", "`": "ô", "{": "é", "|": "ù", "}": "è", "~": "û" }, r.CHARSETS.K = { "@": "§", "[": "Ä", "\\": "Ö", "]": "Ü", "{": "ä", "|": "ö", "}": "ü", "~": "ß" }, r.CHARSETS.Y = { "#": "£", "@": "§", "[": "°", "\\": "ç", "]": "é", "`": "ù", "{": "à", "|": "ò", "}": "è", "~": "ì" }, r.CHARSETS.E = r.CHARSETS[6] = { "@": "Ä", "[": "Æ", "\\": "Ø", "]": "Å", "^": "Ü", "`": "ä", "{": "æ", "|": "ø", "}": "å", "~": "ü" }, r.CHARSETS.Z = { "#": "£", "@": "§", "[": "¡", "\\": "Ñ", "]": "¿", "{": "°", "|": "ñ", "}": "ç" }, r.CHARSETS.H = r.CHARSETS[7] = { "@": "É", "[": "Ä", "\\": "Ö", "]": "Å", "^": "Ü", "`": "é", "{": "ä", "|": "ö", "}": "å", "~": "ü" }, r.CHARSETS["="] = { "#": "ù", "@": "à", "[": "é", "\\": "ç", "]": "ê", "^": "î", _: "è", "`": "ô", "{": "ä", "|": "ö", "}": "ü", "~": "û" };
    }, 2584: (B, r) => {
      var o, c, _;
      Object.defineProperty(r, "__esModule", { value: !0 }), r.C1_ESCAPED = r.C1 = r.C0 = void 0, function(n) {
        n.NUL = "\0", n.SOH = "", n.STX = "", n.ETX = "", n.EOT = "", n.ENQ = "", n.ACK = "", n.BEL = "\x07", n.BS = "\b", n.HT = "	", n.LF = `
`, n.VT = "\v", n.FF = "\f", n.CR = "\r", n.SO = "", n.SI = "", n.DLE = "", n.DC1 = "", n.DC2 = "", n.DC3 = "", n.DC4 = "", n.NAK = "", n.SYN = "", n.ETB = "", n.CAN = "", n.EM = "", n.SUB = "", n.ESC = "\x1B", n.FS = "", n.GS = "", n.RS = "", n.US = "", n.SP = " ", n.DEL = "";
      }(o || (r.C0 = o = {})), function(n) {
        n.PAD = "", n.HOP = "", n.BPH = "", n.NBH = "", n.IND = "", n.NEL = "", n.SSA = "", n.ESA = "", n.HTS = "", n.HTJ = "", n.VTS = "", n.PLD = "", n.PLU = "", n.RI = "", n.SS2 = "", n.SS3 = "", n.DCS = "", n.PU1 = "", n.PU2 = "", n.STS = "", n.CCH = "", n.MW = "", n.SPA = "", n.EPA = "", n.SOS = "", n.SGCI = "", n.SCI = "", n.CSI = "", n.ST = "", n.OSC = "", n.PM = "", n.APC = "";
      }(c || (r.C1 = c = {})), function(n) {
        n.ST = `${o.ESC}\\`;
      }(_ || (r.C1_ESCAPED = _ = {}));
    }, 7399: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.evaluateKeyboardEvent = void 0;
      const c = o(2584), _ = { 48: ["0", ")"], 49: ["1", "!"], 50: ["2", "@"], 51: ["3", "#"], 52: ["4", "$"], 53: ["5", "%"], 54: ["6", "^"], 55: ["7", "&"], 56: ["8", "*"], 57: ["9", "("], 186: [";", ":"], 187: ["=", "+"], 188: [",", "<"], 189: ["-", "_"], 190: [".", ">"], 191: ["/", "?"], 192: ["`", "~"], 219: ["[", "{"], 220: ["\\", "|"], 221: ["]", "}"], 222: ["'", '"'] };
      r.evaluateKeyboardEvent = function(n, u, v, g) {
        const d = { type: 0, cancel: !1, key: void 0 }, e = (n.shiftKey ? 1 : 0) | (n.altKey ? 2 : 0) | (n.ctrlKey ? 4 : 0) | (n.metaKey ? 8 : 0);
        switch (n.keyCode) {
          case 0:
            n.key === "UIKeyInputUpArrow" ? d.key = u ? c.C0.ESC + "OA" : c.C0.ESC + "[A" : n.key === "UIKeyInputLeftArrow" ? d.key = u ? c.C0.ESC + "OD" : c.C0.ESC + "[D" : n.key === "UIKeyInputRightArrow" ? d.key = u ? c.C0.ESC + "OC" : c.C0.ESC + "[C" : n.key === "UIKeyInputDownArrow" && (d.key = u ? c.C0.ESC + "OB" : c.C0.ESC + "[B");
            break;
          case 8:
            if (n.altKey) {
              d.key = c.C0.ESC + c.C0.DEL;
              break;
            }
            d.key = c.C0.DEL;
            break;
          case 9:
            if (n.shiftKey) {
              d.key = c.C0.ESC + "[Z";
              break;
            }
            d.key = c.C0.HT, d.cancel = !0;
            break;
          case 13:
            d.key = n.altKey ? c.C0.ESC + c.C0.CR : c.C0.CR, d.cancel = !0;
            break;
          case 27:
            d.key = c.C0.ESC, n.altKey && (d.key = c.C0.ESC + c.C0.ESC), d.cancel = !0;
            break;
          case 37:
            if (n.metaKey) break;
            e ? (d.key = c.C0.ESC + "[1;" + (e + 1) + "D", d.key === c.C0.ESC + "[1;3D" && (d.key = c.C0.ESC + (v ? "b" : "[1;5D"))) : d.key = u ? c.C0.ESC + "OD" : c.C0.ESC + "[D";
            break;
          case 39:
            if (n.metaKey) break;
            e ? (d.key = c.C0.ESC + "[1;" + (e + 1) + "C", d.key === c.C0.ESC + "[1;3C" && (d.key = c.C0.ESC + (v ? "f" : "[1;5C"))) : d.key = u ? c.C0.ESC + "OC" : c.C0.ESC + "[C";
            break;
          case 38:
            if (n.metaKey) break;
            e ? (d.key = c.C0.ESC + "[1;" + (e + 1) + "A", v || d.key !== c.C0.ESC + "[1;3A" || (d.key = c.C0.ESC + "[1;5A")) : d.key = u ? c.C0.ESC + "OA" : c.C0.ESC + "[A";
            break;
          case 40:
            if (n.metaKey) break;
            e ? (d.key = c.C0.ESC + "[1;" + (e + 1) + "B", v || d.key !== c.C0.ESC + "[1;3B" || (d.key = c.C0.ESC + "[1;5B")) : d.key = u ? c.C0.ESC + "OB" : c.C0.ESC + "[B";
            break;
          case 45:
            n.shiftKey || n.ctrlKey || (d.key = c.C0.ESC + "[2~");
            break;
          case 46:
            d.key = e ? c.C0.ESC + "[3;" + (e + 1) + "~" : c.C0.ESC + "[3~";
            break;
          case 36:
            d.key = e ? c.C0.ESC + "[1;" + (e + 1) + "H" : u ? c.C0.ESC + "OH" : c.C0.ESC + "[H";
            break;
          case 35:
            d.key = e ? c.C0.ESC + "[1;" + (e + 1) + "F" : u ? c.C0.ESC + "OF" : c.C0.ESC + "[F";
            break;
          case 33:
            n.shiftKey ? d.type = 2 : n.ctrlKey ? d.key = c.C0.ESC + "[5;" + (e + 1) + "~" : d.key = c.C0.ESC + "[5~";
            break;
          case 34:
            n.shiftKey ? d.type = 3 : n.ctrlKey ? d.key = c.C0.ESC + "[6;" + (e + 1) + "~" : d.key = c.C0.ESC + "[6~";
            break;
          case 112:
            d.key = e ? c.C0.ESC + "[1;" + (e + 1) + "P" : c.C0.ESC + "OP";
            break;
          case 113:
            d.key = e ? c.C0.ESC + "[1;" + (e + 1) + "Q" : c.C0.ESC + "OQ";
            break;
          case 114:
            d.key = e ? c.C0.ESC + "[1;" + (e + 1) + "R" : c.C0.ESC + "OR";
            break;
          case 115:
            d.key = e ? c.C0.ESC + "[1;" + (e + 1) + "S" : c.C0.ESC + "OS";
            break;
          case 116:
            d.key = e ? c.C0.ESC + "[15;" + (e + 1) + "~" : c.C0.ESC + "[15~";
            break;
          case 117:
            d.key = e ? c.C0.ESC + "[17;" + (e + 1) + "~" : c.C0.ESC + "[17~";
            break;
          case 118:
            d.key = e ? c.C0.ESC + "[18;" + (e + 1) + "~" : c.C0.ESC + "[18~";
            break;
          case 119:
            d.key = e ? c.C0.ESC + "[19;" + (e + 1) + "~" : c.C0.ESC + "[19~";
            break;
          case 120:
            d.key = e ? c.C0.ESC + "[20;" + (e + 1) + "~" : c.C0.ESC + "[20~";
            break;
          case 121:
            d.key = e ? c.C0.ESC + "[21;" + (e + 1) + "~" : c.C0.ESC + "[21~";
            break;
          case 122:
            d.key = e ? c.C0.ESC + "[23;" + (e + 1) + "~" : c.C0.ESC + "[23~";
            break;
          case 123:
            d.key = e ? c.C0.ESC + "[24;" + (e + 1) + "~" : c.C0.ESC + "[24~";
            break;
          default:
            if (!n.ctrlKey || n.shiftKey || n.altKey || n.metaKey) if (v && !g || !n.altKey || n.metaKey) !v || n.altKey || n.ctrlKey || n.shiftKey || !n.metaKey ? n.key && !n.ctrlKey && !n.altKey && !n.metaKey && n.keyCode >= 48 && n.key.length === 1 ? d.key = n.key : n.key && n.ctrlKey && (n.key === "_" && (d.key = c.C0.US), n.key === "@" && (d.key = c.C0.NUL)) : n.keyCode === 65 && (d.type = 1);
            else {
              const i = _[n.keyCode], t = i == null ? void 0 : i[n.shiftKey ? 1 : 0];
              if (t) d.key = c.C0.ESC + t;
              else if (n.keyCode >= 65 && n.keyCode <= 90) {
                const s = n.ctrlKey ? n.keyCode - 64 : n.keyCode + 32;
                let a = String.fromCharCode(s);
                n.shiftKey && (a = a.toUpperCase()), d.key = c.C0.ESC + a;
              } else if (n.keyCode === 32) d.key = c.C0.ESC + (n.ctrlKey ? c.C0.NUL : " ");
              else if (n.key === "Dead" && n.code.startsWith("Key")) {
                let s = n.code.slice(3, 4);
                n.shiftKey || (s = s.toLowerCase()), d.key = c.C0.ESC + s, d.cancel = !0;
              }
            }
            else n.keyCode >= 65 && n.keyCode <= 90 ? d.key = String.fromCharCode(n.keyCode - 64) : n.keyCode === 32 ? d.key = c.C0.NUL : n.keyCode >= 51 && n.keyCode <= 55 ? d.key = String.fromCharCode(n.keyCode - 51 + 27) : n.keyCode === 56 ? d.key = c.C0.DEL : n.keyCode === 219 ? d.key = c.C0.ESC : n.keyCode === 220 ? d.key = c.C0.FS : n.keyCode === 221 && (d.key = c.C0.GS);
        }
        return d;
      };
    }, 482: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.Utf8ToUtf32 = r.StringToUtf32 = r.utf32ToString = r.stringFromCodePoint = void 0, r.stringFromCodePoint = function(o) {
        return o > 65535 ? (o -= 65536, String.fromCharCode(55296 + (o >> 10)) + String.fromCharCode(o % 1024 + 56320)) : String.fromCharCode(o);
      }, r.utf32ToString = function(o, c = 0, _ = o.length) {
        let n = "";
        for (let u = c; u < _; ++u) {
          let v = o[u];
          v > 65535 ? (v -= 65536, n += String.fromCharCode(55296 + (v >> 10)) + String.fromCharCode(v % 1024 + 56320)) : n += String.fromCharCode(v);
        }
        return n;
      }, r.StringToUtf32 = class {
        constructor() {
          this._interim = 0;
        }
        clear() {
          this._interim = 0;
        }
        decode(o, c) {
          const _ = o.length;
          if (!_) return 0;
          let n = 0, u = 0;
          if (this._interim) {
            const v = o.charCodeAt(u++);
            56320 <= v && v <= 57343 ? c[n++] = 1024 * (this._interim - 55296) + v - 56320 + 65536 : (c[n++] = this._interim, c[n++] = v), this._interim = 0;
          }
          for (let v = u; v < _; ++v) {
            const g = o.charCodeAt(v);
            if (55296 <= g && g <= 56319) {
              if (++v >= _) return this._interim = g, n;
              const d = o.charCodeAt(v);
              56320 <= d && d <= 57343 ? c[n++] = 1024 * (g - 55296) + d - 56320 + 65536 : (c[n++] = g, c[n++] = d);
            } else g !== 65279 && (c[n++] = g);
          }
          return n;
        }
      }, r.Utf8ToUtf32 = class {
        constructor() {
          this.interim = new Uint8Array(3);
        }
        clear() {
          this.interim.fill(0);
        }
        decode(o, c) {
          const _ = o.length;
          if (!_) return 0;
          let n, u, v, g, d = 0, e = 0, i = 0;
          if (this.interim[0]) {
            let a = !1, l = this.interim[0];
            l &= (224 & l) == 192 ? 31 : (240 & l) == 224 ? 15 : 7;
            let f, m = 0;
            for (; (f = 63 & this.interim[++m]) && m < 4; ) l <<= 6, l |= f;
            const h = (224 & this.interim[0]) == 192 ? 2 : (240 & this.interim[0]) == 224 ? 3 : 4, p = h - m;
            for (; i < p; ) {
              if (i >= _) return 0;
              if (f = o[i++], (192 & f) != 128) {
                i--, a = !0;
                break;
              }
              this.interim[m++] = f, l <<= 6, l |= 63 & f;
            }
            a || (h === 2 ? l < 128 ? i-- : c[d++] = l : h === 3 ? l < 2048 || l >= 55296 && l <= 57343 || l === 65279 || (c[d++] = l) : l < 65536 || l > 1114111 || (c[d++] = l)), this.interim.fill(0);
          }
          const t = _ - 4;
          let s = i;
          for (; s < _; ) {
            for (; !(!(s < t) || 128 & (n = o[s]) || 128 & (u = o[s + 1]) || 128 & (v = o[s + 2]) || 128 & (g = o[s + 3])); ) c[d++] = n, c[d++] = u, c[d++] = v, c[d++] = g, s += 4;
            if (n = o[s++], n < 128) c[d++] = n;
            else if ((224 & n) == 192) {
              if (s >= _) return this.interim[0] = n, d;
              if (u = o[s++], (192 & u) != 128) {
                s--;
                continue;
              }
              if (e = (31 & n) << 6 | 63 & u, e < 128) {
                s--;
                continue;
              }
              c[d++] = e;
            } else if ((240 & n) == 224) {
              if (s >= _) return this.interim[0] = n, d;
              if (u = o[s++], (192 & u) != 128) {
                s--;
                continue;
              }
              if (s >= _) return this.interim[0] = n, this.interim[1] = u, d;
              if (v = o[s++], (192 & v) != 128) {
                s--;
                continue;
              }
              if (e = (15 & n) << 12 | (63 & u) << 6 | 63 & v, e < 2048 || e >= 55296 && e <= 57343 || e === 65279) continue;
              c[d++] = e;
            } else if ((248 & n) == 240) {
              if (s >= _) return this.interim[0] = n, d;
              if (u = o[s++], (192 & u) != 128) {
                s--;
                continue;
              }
              if (s >= _) return this.interim[0] = n, this.interim[1] = u, d;
              if (v = o[s++], (192 & v) != 128) {
                s--;
                continue;
              }
              if (s >= _) return this.interim[0] = n, this.interim[1] = u, this.interim[2] = v, d;
              if (g = o[s++], (192 & g) != 128) {
                s--;
                continue;
              }
              if (e = (7 & n) << 18 | (63 & u) << 12 | (63 & v) << 6 | 63 & g, e < 65536 || e > 1114111) continue;
              c[d++] = e;
            }
          }
          return d;
        }
      };
    }, 225: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.UnicodeV6 = void 0;
      const o = [[768, 879], [1155, 1158], [1160, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1536, 1539], [1552, 1557], [1611, 1630], [1648, 1648], [1750, 1764], [1767, 1768], [1770, 1773], [1807, 1807], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2305, 2306], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2388], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2672, 2673], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2883], [2893, 2893], [2902, 2902], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3393, 3395], [3405, 3405], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3984, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4146], [4150, 4151], [4153, 4153], [4184, 4185], [4448, 4607], [4959, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7616, 7626], [7678, 7679], [8203, 8207], [8234, 8238], [8288, 8291], [8298, 8303], [8400, 8431], [12330, 12335], [12441, 12442], [43014, 43014], [43019, 43019], [43045, 43046], [64286, 64286], [65024, 65039], [65056, 65059], [65279, 65279], [65529, 65531]], c = [[68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [119143, 119145], [119155, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917505, 917505], [917536, 917631], [917760, 917999]];
      let _;
      r.UnicodeV6 = class {
        constructor() {
          if (this.version = "6", !_) {
            _ = new Uint8Array(65536), _.fill(1), _[0] = 0, _.fill(0, 1, 32), _.fill(0, 127, 160), _.fill(2, 4352, 4448), _[9001] = 2, _[9002] = 2, _.fill(2, 11904, 42192), _[12351] = 1, _.fill(2, 44032, 55204), _.fill(2, 63744, 64256), _.fill(2, 65040, 65050), _.fill(2, 65072, 65136), _.fill(2, 65280, 65377), _.fill(2, 65504, 65511);
            for (let n = 0; n < o.length; ++n) _.fill(0, o[n][0], o[n][1] + 1);
          }
        }
        wcwidth(n) {
          return n < 32 ? 0 : n < 127 ? 1 : n < 65536 ? _[n] : function(u, v) {
            let g, d = 0, e = v.length - 1;
            if (u < v[0][0] || u > v[e][1]) return !1;
            for (; e >= d; ) if (g = d + e >> 1, u > v[g][1]) d = g + 1;
            else {
              if (!(u < v[g][0])) return !0;
              e = g - 1;
            }
            return !1;
          }(n, c) ? 0 : n >= 131072 && n <= 196605 || n >= 196608 && n <= 262141 ? 2 : 1;
        }
      };
    }, 5981: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.WriteBuffer = void 0;
      const c = o(8460), _ = o(844);
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
          let d;
          for (this._isSyncWriting = !0; d = this._writeBuffer.shift(); ) {
            this._action(d);
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
          const d = v || Date.now();
          for (; this._writeBuffer.length > this._bufferOffset; ) {
            const e = this._writeBuffer[this._bufferOffset], i = this._action(e, g);
            if (i) {
              const s = (a) => Date.now() - d >= 12 ? setTimeout(() => this._innerWrite(0, a)) : this._innerWrite(d, a);
              return void i.catch((a) => (queueMicrotask(() => {
                throw a;
              }), Promise.resolve(!1))).then(s);
            }
            const t = this._callbacks[this._bufferOffset];
            if (t && t(), this._bufferOffset++, this._pendingData -= e.length, Date.now() - d >= 12) break;
          }
          this._writeBuffer.length > this._bufferOffset ? (this._bufferOffset > 50 && (this._writeBuffer = this._writeBuffer.slice(this._bufferOffset), this._callbacks = this._callbacks.slice(this._bufferOffset), this._bufferOffset = 0), setTimeout(() => this._innerWrite())) : (this._writeBuffer.length = 0, this._callbacks.length = 0, this._pendingData = 0, this._bufferOffset = 0), this._onWriteParsed.fire();
        }
      }
      r.WriteBuffer = n;
    }, 5941: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.toRgbString = r.parseColor = void 0;
      const o = /^([\da-f])\/([\da-f])\/([\da-f])$|^([\da-f]{2})\/([\da-f]{2})\/([\da-f]{2})$|^([\da-f]{3})\/([\da-f]{3})\/([\da-f]{3})$|^([\da-f]{4})\/([\da-f]{4})\/([\da-f]{4})$/, c = /^[\da-f]+$/;
      function _(n, u) {
        const v = n.toString(16), g = v.length < 2 ? "0" + v : v;
        switch (u) {
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
      r.parseColor = function(n) {
        if (!n) return;
        let u = n.toLowerCase();
        if (u.indexOf("rgb:") === 0) {
          u = u.slice(4);
          const v = o.exec(u);
          if (v) {
            const g = v[1] ? 15 : v[4] ? 255 : v[7] ? 4095 : 65535;
            return [Math.round(parseInt(v[1] || v[4] || v[7] || v[10], 16) / g * 255), Math.round(parseInt(v[2] || v[5] || v[8] || v[11], 16) / g * 255), Math.round(parseInt(v[3] || v[6] || v[9] || v[12], 16) / g * 255)];
          }
        } else if (u.indexOf("#") === 0 && (u = u.slice(1), c.exec(u) && [3, 6, 9, 12].includes(u.length))) {
          const v = u.length / 3, g = [0, 0, 0];
          for (let d = 0; d < 3; ++d) {
            const e = parseInt(u.slice(v * d, v * d + v), 16);
            g[d] = v === 1 ? e << 4 : v === 2 ? e : v === 3 ? e >> 4 : e >> 8;
          }
          return g;
        }
      }, r.toRgbString = function(n, u = 16) {
        const [v, g, d] = n;
        return `rgb:${_(v, u)}/${_(g, u)}/${_(d, u)}`;
      };
    }, 5770: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.PAYLOAD_LIMIT = void 0, r.PAYLOAD_LIMIT = 1e7;
    }, 6351: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.DcsHandler = r.DcsParser = void 0;
      const c = o(482), _ = o(8742), n = o(5770), u = [];
      r.DcsParser = class {
        constructor() {
          this._handlers = /* @__PURE__ */ Object.create(null), this._active = u, this._ident = 0, this._handlerFb = () => {
          }, this._stack = { paused: !1, loopPosition: 0, fallThrough: !1 };
        }
        dispose() {
          this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
          }, this._active = u;
        }
        registerHandler(g, d) {
          this._handlers[g] === void 0 && (this._handlers[g] = []);
          const e = this._handlers[g];
          return e.push(d), { dispose: () => {
            const i = e.indexOf(d);
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
          this._stack.paused = !1, this._active = u, this._ident = 0;
        }
        hook(g, d) {
          if (this.reset(), this._ident = g, this._active = this._handlers[g] || u, this._active.length) for (let e = this._active.length - 1; e >= 0; e--) this._active[e].hook(d);
          else this._handlerFb(this._ident, "HOOK", d);
        }
        put(g, d, e) {
          if (this._active.length) for (let i = this._active.length - 1; i >= 0; i--) this._active[i].put(g, d, e);
          else this._handlerFb(this._ident, "PUT", (0, c.utf32ToString)(g, d, e));
        }
        unhook(g, d = !0) {
          if (this._active.length) {
            let e = !1, i = this._active.length - 1, t = !1;
            if (this._stack.paused && (i = this._stack.loopPosition - 1, e = d, t = this._stack.fallThrough, this._stack.paused = !1), !t && e === !1) {
              for (; i >= 0 && (e = this._active[i].unhook(g), e !== !0); i--) if (e instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = i, this._stack.fallThrough = !1, e;
              i--;
            }
            for (; i >= 0; i--) if (e = this._active[i].unhook(!1), e instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = i, this._stack.fallThrough = !0, e;
          } else this._handlerFb(this._ident, "UNHOOK", g);
          this._active = u, this._ident = 0;
        }
      };
      const v = new _.Params();
      v.addParam(0), r.DcsHandler = class {
        constructor(g) {
          this._handler = g, this._data = "", this._params = v, this._hitLimit = !1;
        }
        hook(g) {
          this._params = g.length > 1 || g.params[0] ? g.clone() : v, this._data = "", this._hitLimit = !1;
        }
        put(g, d, e) {
          this._hitLimit || (this._data += (0, c.utf32ToString)(g, d, e), this._data.length > n.PAYLOAD_LIMIT && (this._data = "", this._hitLimit = !0));
        }
        unhook(g) {
          let d = !1;
          if (this._hitLimit) d = !1;
          else if (g && (d = this._handler(this._data, this._params), d instanceof Promise)) return d.then((e) => (this._params = v, this._data = "", this._hitLimit = !1, e));
          return this._params = v, this._data = "", this._hitLimit = !1, d;
        }
      };
    }, 2015: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.EscapeSequenceParser = r.VT500_TRANSITION_TABLE = r.TransitionTable = void 0;
      const c = o(844), _ = o(8742), n = o(6242), u = o(6351);
      class v {
        constructor(i) {
          this.table = new Uint8Array(i);
        }
        setDefault(i, t) {
          this.table.fill(i << 4 | t);
        }
        add(i, t, s, a) {
          this.table[t << 8 | i] = s << 4 | a;
        }
        addMany(i, t, s, a) {
          for (let l = 0; l < i.length; l++) this.table[t << 8 | i[l]] = s << 4 | a;
        }
      }
      r.TransitionTable = v;
      const g = 160;
      r.VT500_TRANSITION_TABLE = function() {
        const e = new v(4095), i = Array.apply(null, Array(256)).map((m, h) => h), t = (m, h) => i.slice(m, h), s = t(32, 127), a = t(0, 24);
        a.push(25), a.push.apply(a, t(28, 32));
        const l = t(0, 14);
        let f;
        for (f in e.setDefault(1, 0), e.addMany(s, 0, 2, 0), l) e.addMany([24, 26, 153, 154], f, 3, 0), e.addMany(t(128, 144), f, 3, 0), e.addMany(t(144, 152), f, 3, 0), e.add(156, f, 0, 0), e.add(27, f, 11, 1), e.add(157, f, 4, 8), e.addMany([152, 158, 159], f, 0, 7), e.add(155, f, 11, 3), e.add(144, f, 11, 9);
        return e.addMany(a, 0, 3, 0), e.addMany(a, 1, 3, 1), e.add(127, 1, 0, 1), e.addMany(a, 8, 0, 8), e.addMany(a, 3, 3, 3), e.add(127, 3, 0, 3), e.addMany(a, 4, 3, 4), e.add(127, 4, 0, 4), e.addMany(a, 6, 3, 6), e.addMany(a, 5, 3, 5), e.add(127, 5, 0, 5), e.addMany(a, 2, 3, 2), e.add(127, 2, 0, 2), e.add(93, 1, 4, 8), e.addMany(s, 8, 5, 8), e.add(127, 8, 5, 8), e.addMany([156, 27, 24, 26, 7], 8, 6, 0), e.addMany(t(28, 32), 8, 0, 8), e.addMany([88, 94, 95], 1, 0, 7), e.addMany(s, 7, 0, 7), e.addMany(a, 7, 0, 7), e.add(156, 7, 0, 0), e.add(127, 7, 0, 7), e.add(91, 1, 11, 3), e.addMany(t(64, 127), 3, 7, 0), e.addMany(t(48, 60), 3, 8, 4), e.addMany([60, 61, 62, 63], 3, 9, 4), e.addMany(t(48, 60), 4, 8, 4), e.addMany(t(64, 127), 4, 7, 0), e.addMany([60, 61, 62, 63], 4, 0, 6), e.addMany(t(32, 64), 6, 0, 6), e.add(127, 6, 0, 6), e.addMany(t(64, 127), 6, 0, 0), e.addMany(t(32, 48), 3, 9, 5), e.addMany(t(32, 48), 5, 9, 5), e.addMany(t(48, 64), 5, 0, 6), e.addMany(t(64, 127), 5, 7, 0), e.addMany(t(32, 48), 4, 9, 5), e.addMany(t(32, 48), 1, 9, 2), e.addMany(t(32, 48), 2, 9, 2), e.addMany(t(48, 127), 2, 10, 0), e.addMany(t(48, 80), 1, 10, 0), e.addMany(t(81, 88), 1, 10, 0), e.addMany([89, 90, 92], 1, 10, 0), e.addMany(t(96, 127), 1, 10, 0), e.add(80, 1, 11, 9), e.addMany(a, 9, 0, 9), e.add(127, 9, 0, 9), e.addMany(t(28, 32), 9, 0, 9), e.addMany(t(32, 48), 9, 9, 12), e.addMany(t(48, 60), 9, 8, 10), e.addMany([60, 61, 62, 63], 9, 9, 10), e.addMany(a, 11, 0, 11), e.addMany(t(32, 128), 11, 0, 11), e.addMany(t(28, 32), 11, 0, 11), e.addMany(a, 10, 0, 10), e.add(127, 10, 0, 10), e.addMany(t(28, 32), 10, 0, 10), e.addMany(t(48, 60), 10, 8, 10), e.addMany([60, 61, 62, 63], 10, 0, 11), e.addMany(t(32, 48), 10, 9, 12), e.addMany(a, 12, 0, 12), e.add(127, 12, 0, 12), e.addMany(t(28, 32), 12, 0, 12), e.addMany(t(32, 48), 12, 9, 12), e.addMany(t(48, 64), 12, 0, 11), e.addMany(t(64, 127), 12, 12, 13), e.addMany(t(64, 127), 10, 12, 13), e.addMany(t(64, 127), 9, 12, 13), e.addMany(a, 13, 13, 13), e.addMany(s, 13, 13, 13), e.add(127, 13, 0, 13), e.addMany([27, 156, 24, 26], 13, 14, 0), e.add(g, 0, 2, 0), e.add(g, 8, 5, 8), e.add(g, 6, 0, 6), e.add(g, 11, 0, 11), e.add(g, 13, 13, 13), e;
      }();
      class d extends c.Disposable {
        constructor(i = r.VT500_TRANSITION_TABLE) {
          super(), this._transitions = i, this._parseStack = { state: 0, handlers: [], handlerPos: 0, transition: 0, chunkPos: 0 }, this.initialState = 0, this.currentState = this.initialState, this._params = new _.Params(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0, this._printHandlerFb = (t, s, a) => {
          }, this._executeHandlerFb = (t) => {
          }, this._csiHandlerFb = (t, s) => {
          }, this._escHandlerFb = (t) => {
          }, this._errorHandlerFb = (t) => t, this._printHandler = this._printHandlerFb, this._executeHandlers = /* @__PURE__ */ Object.create(null), this._csiHandlers = /* @__PURE__ */ Object.create(null), this._escHandlers = /* @__PURE__ */ Object.create(null), this.register((0, c.toDisposable)(() => {
            this._csiHandlers = /* @__PURE__ */ Object.create(null), this._executeHandlers = /* @__PURE__ */ Object.create(null), this._escHandlers = /* @__PURE__ */ Object.create(null);
          })), this._oscParser = this.register(new n.OscParser()), this._dcsParser = this.register(new u.DcsParser()), this._errorHandler = this._errorHandlerFb, this.registerEscHandler({ final: "\\" }, () => !0);
        }
        _identifier(i, t = [64, 126]) {
          let s = 0;
          if (i.prefix) {
            if (i.prefix.length > 1) throw new Error("only one byte as prefix supported");
            if (s = i.prefix.charCodeAt(0), s && 60 > s || s > 63) throw new Error("prefix must be in range 0x3c .. 0x3f");
          }
          if (i.intermediates) {
            if (i.intermediates.length > 2) throw new Error("only two bytes as intermediates are supported");
            for (let l = 0; l < i.intermediates.length; ++l) {
              const f = i.intermediates.charCodeAt(l);
              if (32 > f || f > 47) throw new Error("intermediate must be in range 0x20 .. 0x2f");
              s <<= 8, s |= f;
            }
          }
          if (i.final.length !== 1) throw new Error("final must be a single byte");
          const a = i.final.charCodeAt(0);
          if (t[0] > a || a > t[1]) throw new Error(`final must be in range ${t[0]} .. ${t[1]}`);
          return s <<= 8, s |= a, s;
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
          const s = this._identifier(i, [48, 126]);
          this._escHandlers[s] === void 0 && (this._escHandlers[s] = []);
          const a = this._escHandlers[s];
          return a.push(t), { dispose: () => {
            const l = a.indexOf(t);
            l !== -1 && a.splice(l, 1);
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
          const s = this._identifier(i);
          this._csiHandlers[s] === void 0 && (this._csiHandlers[s] = []);
          const a = this._csiHandlers[s];
          return a.push(t), { dispose: () => {
            const l = a.indexOf(t);
            l !== -1 && a.splice(l, 1);
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
        _preserveStack(i, t, s, a, l) {
          this._parseStack.state = i, this._parseStack.handlers = t, this._parseStack.handlerPos = s, this._parseStack.transition = a, this._parseStack.chunkPos = l;
        }
        parse(i, t, s) {
          let a, l = 0, f = 0, m = 0;
          if (this._parseStack.state) if (this._parseStack.state === 2) this._parseStack.state = 0, m = this._parseStack.chunkPos + 1;
          else {
            if (s === void 0 || this._parseStack.state === 1) throw this._parseStack.state = 1, new Error("improper continuation due to previous async handler, giving up parsing");
            const h = this._parseStack.handlers;
            let p = this._parseStack.handlerPos - 1;
            switch (this._parseStack.state) {
              case 3:
                if (s === !1 && p > -1) {
                  for (; p >= 0 && (a = h[p](this._params), a !== !0); p--) if (a instanceof Promise) return this._parseStack.handlerPos = p, a;
                }
                this._parseStack.handlers = [];
                break;
              case 4:
                if (s === !1 && p > -1) {
                  for (; p >= 0 && (a = h[p](), a !== !0); p--) if (a instanceof Promise) return this._parseStack.handlerPos = p, a;
                }
                this._parseStack.handlers = [];
                break;
              case 6:
                if (l = i[this._parseStack.chunkPos], a = this._dcsParser.unhook(l !== 24 && l !== 26, s), a) return a;
                l === 27 && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0;
                break;
              case 5:
                if (l = i[this._parseStack.chunkPos], a = this._oscParser.end(l !== 24 && l !== 26, s), a) return a;
                l === 27 && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0;
            }
            this._parseStack.state = 0, m = this._parseStack.chunkPos + 1, this.precedingCodepoint = 0, this.currentState = 15 & this._parseStack.transition;
          }
          for (let h = m; h < t; ++h) {
            switch (l = i[h], f = this._transitions.table[this.currentState << 8 | (l < 160 ? l : g)], f >> 4) {
              case 2:
                for (let k = h + 1; ; ++k) {
                  if (k >= t || (l = i[k]) < 32 || l > 126 && l < g) {
                    this._printHandler(i, h, k), h = k - 1;
                    break;
                  }
                  if (++k >= t || (l = i[k]) < 32 || l > 126 && l < g) {
                    this._printHandler(i, h, k), h = k - 1;
                    break;
                  }
                  if (++k >= t || (l = i[k]) < 32 || l > 126 && l < g) {
                    this._printHandler(i, h, k), h = k - 1;
                    break;
                  }
                  if (++k >= t || (l = i[k]) < 32 || l > 126 && l < g) {
                    this._printHandler(i, h, k), h = k - 1;
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
                let b = p ? p.length - 1 : -1;
                for (; b >= 0 && (a = p[b](this._params), a !== !0); b--) if (a instanceof Promise) return this._preserveStack(3, p, b, f, h), a;
                b < 0 && this._csiHandlerFb(this._collect << 8 | l, this._params), this.precedingCodepoint = 0;
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
                const x = this._escHandlers[this._collect << 8 | l];
                let y = x ? x.length - 1 : -1;
                for (; y >= 0 && (a = x[y](), a !== !0); y--) if (a instanceof Promise) return this._preserveStack(4, x, y, f, h), a;
                y < 0 && this._escHandlerFb(this._collect << 8 | l), this.precedingCodepoint = 0;
                break;
              case 11:
                this._params.reset(), this._params.addParam(0), this._collect = 0;
                break;
              case 12:
                this._dcsParser.hook(this._collect << 8 | l, this._params);
                break;
              case 13:
                for (let k = h + 1; ; ++k) if (k >= t || (l = i[k]) === 24 || l === 26 || l === 27 || l > 127 && l < g) {
                  this._dcsParser.put(i, h, k), h = k - 1;
                  break;
                }
                break;
              case 14:
                if (a = this._dcsParser.unhook(l !== 24 && l !== 26), a) return this._preserveStack(6, [], 0, f, h), a;
                l === 27 && (f |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0;
                break;
              case 4:
                this._oscParser.start();
                break;
              case 5:
                for (let k = h + 1; ; k++) if (k >= t || (l = i[k]) < 32 || l > 127 && l < g) {
                  this._oscParser.put(i, h, k), h = k - 1;
                  break;
                }
                break;
              case 6:
                if (a = this._oscParser.end(l !== 24 && l !== 26), a) return this._preserveStack(5, [], 0, f, h), a;
                l === 27 && (f |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0;
            }
            this.currentState = 15 & f;
          }
        }
      }
      r.EscapeSequenceParser = d;
    }, 6242: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.OscHandler = r.OscParser = void 0;
      const c = o(5770), _ = o(482), n = [];
      r.OscParser = class {
        constructor() {
          this._state = 0, this._active = n, this._id = -1, this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
          }, this._stack = { paused: !1, loopPosition: 0, fallThrough: !1 };
        }
        registerHandler(u, v) {
          this._handlers[u] === void 0 && (this._handlers[u] = []);
          const g = this._handlers[u];
          return g.push(v), { dispose: () => {
            const d = g.indexOf(v);
            d !== -1 && g.splice(d, 1);
          } };
        }
        clearHandler(u) {
          this._handlers[u] && delete this._handlers[u];
        }
        setHandlerFallback(u) {
          this._handlerFb = u;
        }
        dispose() {
          this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
          }, this._active = n;
        }
        reset() {
          if (this._state === 2) for (let u = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; u >= 0; --u) this._active[u].end(!1);
          this._stack.paused = !1, this._active = n, this._id = -1, this._state = 0;
        }
        _start() {
          if (this._active = this._handlers[this._id] || n, this._active.length) for (let u = this._active.length - 1; u >= 0; u--) this._active[u].start();
          else this._handlerFb(this._id, "START");
        }
        _put(u, v, g) {
          if (this._active.length) for (let d = this._active.length - 1; d >= 0; d--) this._active[d].put(u, v, g);
          else this._handlerFb(this._id, "PUT", (0, _.utf32ToString)(u, v, g));
        }
        start() {
          this.reset(), this._state = 1;
        }
        put(u, v, g) {
          if (this._state !== 3) {
            if (this._state === 1) for (; v < g; ) {
              const d = u[v++];
              if (d === 59) {
                this._state = 2, this._start();
                break;
              }
              if (d < 48 || 57 < d) return void (this._state = 3);
              this._id === -1 && (this._id = 0), this._id = 10 * this._id + d - 48;
            }
            this._state === 2 && g - v > 0 && this._put(u, v, g);
          }
        }
        end(u, v = !0) {
          if (this._state !== 0) {
            if (this._state !== 3) if (this._state === 1 && this._start(), this._active.length) {
              let g = !1, d = this._active.length - 1, e = !1;
              if (this._stack.paused && (d = this._stack.loopPosition - 1, g = v, e = this._stack.fallThrough, this._stack.paused = !1), !e && g === !1) {
                for (; d >= 0 && (g = this._active[d].end(u), g !== !0); d--) if (g instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = d, this._stack.fallThrough = !1, g;
                d--;
              }
              for (; d >= 0; d--) if (g = this._active[d].end(!1), g instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = d, this._stack.fallThrough = !0, g;
            } else this._handlerFb(this._id, "END", u);
            this._active = n, this._id = -1, this._state = 0;
          }
        }
      }, r.OscHandler = class {
        constructor(u) {
          this._handler = u, this._data = "", this._hitLimit = !1;
        }
        start() {
          this._data = "", this._hitLimit = !1;
        }
        put(u, v, g) {
          this._hitLimit || (this._data += (0, _.utf32ToString)(u, v, g), this._data.length > c.PAYLOAD_LIMIT && (this._data = "", this._hitLimit = !0));
        }
        end(u) {
          let v = !1;
          if (this._hitLimit) v = !1;
          else if (u && (v = this._handler(this._data), v instanceof Promise)) return v.then((g) => (this._data = "", this._hitLimit = !1, g));
          return this._data = "", this._hitLimit = !1, v;
        }
      };
    }, 8742: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.Params = void 0;
      const o = 2147483647;
      class c {
        static fromArray(n) {
          const u = new c();
          if (!n.length) return u;
          for (let v = Array.isArray(n[0]) ? 1 : 0; v < n.length; ++v) {
            const g = n[v];
            if (Array.isArray(g)) for (let d = 0; d < g.length; ++d) u.addSubParam(g[d]);
            else u.addParam(g);
          }
          return u;
        }
        constructor(n = 32, u = 32) {
          if (this.maxLength = n, this.maxSubParamsLength = u, u > 256) throw new Error("maxSubParamsLength must not be greater than 256");
          this.params = new Int32Array(n), this.length = 0, this._subParams = new Int32Array(u), this._subParamsLength = 0, this._subParamsIdx = new Uint16Array(n), this._rejectDigits = !1, this._rejectSubDigits = !1, this._digitIsSub = !1;
        }
        clone() {
          const n = new c(this.maxLength, this.maxSubParamsLength);
          return n.params.set(this.params), n.length = this.length, n._subParams.set(this._subParams), n._subParamsLength = this._subParamsLength, n._subParamsIdx.set(this._subParamsIdx), n._rejectDigits = this._rejectDigits, n._rejectSubDigits = this._rejectSubDigits, n._digitIsSub = this._digitIsSub, n;
        }
        toArray() {
          const n = [];
          for (let u = 0; u < this.length; ++u) {
            n.push(this.params[u]);
            const v = this._subParamsIdx[u] >> 8, g = 255 & this._subParamsIdx[u];
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
            this._subParamsIdx[this.length] = this._subParamsLength << 8 | this._subParamsLength, this.params[this.length++] = n > o ? o : n;
          }
        }
        addSubParam(n) {
          if (this._digitIsSub = !0, this.length) if (this._rejectDigits || this._subParamsLength >= this.maxSubParamsLength) this._rejectSubDigits = !0;
          else {
            if (n < -1) throw new Error("values lesser than -1 are not allowed");
            this._subParams[this._subParamsLength++] = n > o ? o : n, this._subParamsIdx[this.length - 1]++;
          }
        }
        hasSubParams(n) {
          return (255 & this._subParamsIdx[n]) - (this._subParamsIdx[n] >> 8) > 0;
        }
        getSubParams(n) {
          const u = this._subParamsIdx[n] >> 8, v = 255 & this._subParamsIdx[n];
          return v - u > 0 ? this._subParams.subarray(u, v) : null;
        }
        getSubParamsAll() {
          const n = {};
          for (let u = 0; u < this.length; ++u) {
            const v = this._subParamsIdx[u] >> 8, g = 255 & this._subParamsIdx[u];
            g - v > 0 && (n[u] = this._subParams.slice(v, g));
          }
          return n;
        }
        addDigit(n) {
          let u;
          if (this._rejectDigits || !(u = this._digitIsSub ? this._subParamsLength : this.length) || this._digitIsSub && this._rejectSubDigits) return;
          const v = this._digitIsSub ? this._subParams : this.params, g = v[u - 1];
          v[u - 1] = ~g ? Math.min(10 * g + n, o) : n;
        }
      }
      r.Params = c;
    }, 5741: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.AddonManager = void 0, r.AddonManager = class {
        constructor() {
          this._addons = [];
        }
        dispose() {
          for (let o = this._addons.length - 1; o >= 0; o--) this._addons[o].instance.dispose();
        }
        loadAddon(o, c) {
          const _ = { instance: c, dispose: c.dispose, isDisposed: !1 };
          this._addons.push(_), c.dispose = () => this._wrappedAddonDispose(_), c.activate(o);
        }
        _wrappedAddonDispose(o) {
          if (o.isDisposed) return;
          let c = -1;
          for (let _ = 0; _ < this._addons.length; _++) if (this._addons[_] === o) {
            c = _;
            break;
          }
          if (c === -1) throw new Error("Could not dispose an addon that has not been loaded");
          o.isDisposed = !0, o.dispose.apply(o.instance), this._addons.splice(c, 1);
        }
      };
    }, 8771: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.BufferApiView = void 0;
      const c = o(3785), _ = o(511);
      r.BufferApiView = class {
        constructor(n, u) {
          this._buffer = n, this.type = u;
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
          const u = this._buffer.lines.get(n);
          if (u) return new c.BufferLineApiView(u);
        }
        getNullCell() {
          return new _.CellData();
        }
      };
    }, 3785: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.BufferLineApiView = void 0;
      const c = o(511);
      r.BufferLineApiView = class {
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
        translateToString(_, n, u) {
          return this._line.translateToString(_, n, u);
        }
      };
    }, 8285: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.BufferNamespaceApi = void 0;
      const c = o(8771), _ = o(8460), n = o(844);
      class u extends n.Disposable {
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
      r.BufferNamespaceApi = u;
    }, 7975: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.ParserApi = void 0, r.ParserApi = class {
        constructor(o) {
          this._core = o;
        }
        registerCsiHandler(o, c) {
          return this._core.registerCsiHandler(o, (_) => c(_.toArray()));
        }
        addCsiHandler(o, c) {
          return this.registerCsiHandler(o, c);
        }
        registerDcsHandler(o, c) {
          return this._core.registerDcsHandler(o, (_, n) => c(_, n.toArray()));
        }
        addDcsHandler(o, c) {
          return this.registerDcsHandler(o, c);
        }
        registerEscHandler(o, c) {
          return this._core.registerEscHandler(o, c);
        }
        addEscHandler(o, c) {
          return this.registerEscHandler(o, c);
        }
        registerOscHandler(o, c) {
          return this._core.registerOscHandler(o, c);
        }
        addOscHandler(o, c) {
          return this.registerOscHandler(o, c);
        }
      };
    }, 7090: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.UnicodeApi = void 0, r.UnicodeApi = class {
        constructor(o) {
          this._core = o;
        }
        register(o) {
          this._core.unicodeService.register(o);
        }
        get versions() {
          return this._core.unicodeService.versions;
        }
        get activeVersion() {
          return this._core.unicodeService.activeVersion;
        }
        set activeVersion(o) {
          this._core.unicodeService.activeVersion = o;
        }
      };
    }, 744: function(B, r, o) {
      var c = this && this.__decorate || function(e, i, t, s) {
        var a, l = arguments.length, f = l < 3 ? i : s === null ? s = Object.getOwnPropertyDescriptor(i, t) : s;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, s);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (f = (l < 3 ? a(f) : l > 3 ? a(i, t, f) : a(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, s) {
          i(t, s, e);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.BufferService = r.MINIMUM_ROWS = r.MINIMUM_COLS = void 0;
      const n = o(8460), u = o(844), v = o(5295), g = o(2585);
      r.MINIMUM_COLS = 2, r.MINIMUM_ROWS = 1;
      let d = r.BufferService = class extends u.Disposable {
        get buffer() {
          return this.buffers.active;
        }
        constructor(e) {
          super(), this.isUserScrolling = !1, this._onResize = this.register(new n.EventEmitter()), this.onResize = this._onResize.event, this._onScroll = this.register(new n.EventEmitter()), this.onScroll = this._onScroll.event, this.cols = Math.max(e.rawOptions.cols || 0, r.MINIMUM_COLS), this.rows = Math.max(e.rawOptions.rows || 0, r.MINIMUM_ROWS), this.buffers = this.register(new v.BufferSet(e, this));
        }
        resize(e, i) {
          this.cols = e, this.rows = i, this.buffers.resize(e, i), this._onResize.fire({ cols: e, rows: i });
        }
        reset() {
          this.buffers.reset(), this.isUserScrolling = !1;
        }
        scroll(e, i = !1) {
          const t = this.buffer;
          let s;
          s = this._cachedBlankLine, s && s.length === this.cols && s.getFg(0) === e.fg && s.getBg(0) === e.bg || (s = t.getBlankLine(e, i), this._cachedBlankLine = s), s.isWrapped = i;
          const a = t.ybase + t.scrollTop, l = t.ybase + t.scrollBottom;
          if (t.scrollTop === 0) {
            const f = t.lines.isFull;
            l === t.lines.length - 1 ? f ? t.lines.recycle().copyFrom(s) : t.lines.push(s.clone()) : t.lines.splice(l + 1, 0, s.clone()), f ? this.isUserScrolling && (t.ydisp = Math.max(t.ydisp - 1, 0)) : (t.ybase++, this.isUserScrolling || t.ydisp++);
          } else {
            const f = l - a + 1;
            t.lines.shiftElements(a + 1, f - 1, -1), t.lines.set(l, s.clone());
          }
          this.isUserScrolling || (t.ydisp = t.ybase), this._onScroll.fire(t.ydisp);
        }
        scrollLines(e, i, t) {
          const s = this.buffer;
          if (e < 0) {
            if (s.ydisp === 0) return;
            this.isUserScrolling = !0;
          } else e + s.ydisp >= s.ybase && (this.isUserScrolling = !1);
          const a = s.ydisp;
          s.ydisp = Math.max(Math.min(s.ydisp + e, s.ybase), 0), a !== s.ydisp && (i || this._onScroll.fire(s.ydisp));
        }
      };
      r.BufferService = d = c([_(0, g.IOptionsService)], d);
    }, 7994: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CharsetService = void 0, r.CharsetService = class {
        constructor() {
          this.glevel = 0, this._charsets = [];
        }
        reset() {
          this.charset = void 0, this._charsets = [], this.glevel = 0;
        }
        setgLevel(o) {
          this.glevel = o, this.charset = this._charsets[o];
        }
        setgCharset(o, c) {
          this._charsets[o] = c, this.glevel === o && (this.charset = c);
        }
      };
    }, 1753: function(B, r, o) {
      var c = this && this.__decorate || function(s, a, l, f) {
        var m, h = arguments.length, p = h < 3 ? a : f === null ? f = Object.getOwnPropertyDescriptor(a, l) : f;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") p = Reflect.decorate(s, a, l, f);
        else for (var b = s.length - 1; b >= 0; b--) (m = s[b]) && (p = (h < 3 ? m(p) : h > 3 ? m(a, l, p) : m(a, l)) || p);
        return h > 3 && p && Object.defineProperty(a, l, p), p;
      }, _ = this && this.__param || function(s, a) {
        return function(l, f) {
          a(l, f, s);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CoreMouseService = void 0;
      const n = o(2585), u = o(8460), v = o(844), g = { NONE: { events: 0, restrict: () => !1 }, X10: { events: 1, restrict: (s) => s.button !== 4 && s.action === 1 && (s.ctrl = !1, s.alt = !1, s.shift = !1, !0) }, VT200: { events: 19, restrict: (s) => s.action !== 32 }, DRAG: { events: 23, restrict: (s) => s.action !== 32 || s.button !== 3 }, ANY: { events: 31, restrict: (s) => !0 } };
      function d(s, a) {
        let l = (s.ctrl ? 16 : 0) | (s.shift ? 4 : 0) | (s.alt ? 8 : 0);
        return s.button === 4 ? (l |= 64, l |= s.action) : (l |= 3 & s.button, 4 & s.button && (l |= 64), 8 & s.button && (l |= 128), s.action === 32 ? l |= 32 : s.action !== 0 || a || (l |= 3)), l;
      }
      const e = String.fromCharCode, i = { DEFAULT: (s) => {
        const a = [d(s, !1) + 32, s.col + 32, s.row + 32];
        return a[0] > 255 || a[1] > 255 || a[2] > 255 ? "" : `\x1B[M${e(a[0])}${e(a[1])}${e(a[2])}`;
      }, SGR: (s) => {
        const a = s.action === 0 && s.button !== 4 ? "m" : "M";
        return `\x1B[<${d(s, !0)};${s.col};${s.row}${a}`;
      }, SGR_PIXELS: (s) => {
        const a = s.action === 0 && s.button !== 4 ? "m" : "M";
        return `\x1B[<${d(s, !0)};${s.x};${s.y}${a}`;
      } };
      let t = r.CoreMouseService = class extends v.Disposable {
        constructor(s, a) {
          super(), this._bufferService = s, this._coreService = a, this._protocols = {}, this._encodings = {}, this._activeProtocol = "", this._activeEncoding = "", this._lastEvent = null, this._onProtocolChange = this.register(new u.EventEmitter()), this.onProtocolChange = this._onProtocolChange.event;
          for (const l of Object.keys(g)) this.addProtocol(l, g[l]);
          for (const l of Object.keys(i)) this.addEncoding(l, i[l]);
          this.reset();
        }
        addProtocol(s, a) {
          this._protocols[s] = a;
        }
        addEncoding(s, a) {
          this._encodings[s] = a;
        }
        get activeProtocol() {
          return this._activeProtocol;
        }
        get areMouseEventsActive() {
          return this._protocols[this._activeProtocol].events !== 0;
        }
        set activeProtocol(s) {
          if (!this._protocols[s]) throw new Error(`unknown protocol "${s}"`);
          this._activeProtocol = s, this._onProtocolChange.fire(this._protocols[s].events);
        }
        get activeEncoding() {
          return this._activeEncoding;
        }
        set activeEncoding(s) {
          if (!this._encodings[s]) throw new Error(`unknown encoding "${s}"`);
          this._activeEncoding = s;
        }
        reset() {
          this.activeProtocol = "NONE", this.activeEncoding = "DEFAULT", this._lastEvent = null;
        }
        triggerMouseEvent(s) {
          if (s.col < 0 || s.col >= this._bufferService.cols || s.row < 0 || s.row >= this._bufferService.rows || s.button === 4 && s.action === 32 || s.button === 3 && s.action !== 32 || s.button !== 4 && (s.action === 2 || s.action === 3) || (s.col++, s.row++, s.action === 32 && this._lastEvent && this._equalEvents(this._lastEvent, s, this._activeEncoding === "SGR_PIXELS")) || !this._protocols[this._activeProtocol].restrict(s)) return !1;
          const a = this._encodings[this._activeEncoding](s);
          return a && (this._activeEncoding === "DEFAULT" ? this._coreService.triggerBinaryEvent(a) : this._coreService.triggerDataEvent(a, !0)), this._lastEvent = s, !0;
        }
        explainEvents(s) {
          return { down: !!(1 & s), up: !!(2 & s), drag: !!(4 & s), move: !!(8 & s), wheel: !!(16 & s) };
        }
        _equalEvents(s, a, l) {
          if (l) {
            if (s.x !== a.x || s.y !== a.y) return !1;
          } else if (s.col !== a.col || s.row !== a.row) return !1;
          return s.button === a.button && s.action === a.action && s.ctrl === a.ctrl && s.alt === a.alt && s.shift === a.shift;
        }
      };
      r.CoreMouseService = t = c([_(0, n.IBufferService), _(1, n.ICoreService)], t);
    }, 6975: function(B, r, o) {
      var c = this && this.__decorate || function(t, s, a, l) {
        var f, m = arguments.length, h = m < 3 ? s : l === null ? l = Object.getOwnPropertyDescriptor(s, a) : l;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") h = Reflect.decorate(t, s, a, l);
        else for (var p = t.length - 1; p >= 0; p--) (f = t[p]) && (h = (m < 3 ? f(h) : m > 3 ? f(s, a, h) : f(s, a)) || h);
        return m > 3 && h && Object.defineProperty(s, a, h), h;
      }, _ = this && this.__param || function(t, s) {
        return function(a, l) {
          s(a, l, t);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.CoreService = void 0;
      const n = o(1439), u = o(8460), v = o(844), g = o(2585), d = Object.freeze({ insertMode: !1 }), e = Object.freeze({ applicationCursorKeys: !1, applicationKeypad: !1, bracketedPasteMode: !1, origin: !1, reverseWraparound: !1, sendFocus: !1, wraparound: !0 });
      let i = r.CoreService = class extends v.Disposable {
        constructor(t, s, a) {
          super(), this._bufferService = t, this._logService = s, this._optionsService = a, this.isCursorInitialized = !1, this.isCursorHidden = !1, this._onData = this.register(new u.EventEmitter()), this.onData = this._onData.event, this._onUserInput = this.register(new u.EventEmitter()), this.onUserInput = this._onUserInput.event, this._onBinary = this.register(new u.EventEmitter()), this.onBinary = this._onBinary.event, this._onRequestScrollToBottom = this.register(new u.EventEmitter()), this.onRequestScrollToBottom = this._onRequestScrollToBottom.event, this.modes = (0, n.clone)(d), this.decPrivateModes = (0, n.clone)(e);
        }
        reset() {
          this.modes = (0, n.clone)(d), this.decPrivateModes = (0, n.clone)(e);
        }
        triggerDataEvent(t, s = !1) {
          if (this._optionsService.rawOptions.disableStdin) return;
          const a = this._bufferService.buffer;
          s && this._optionsService.rawOptions.scrollOnUserInput && a.ybase !== a.ydisp && this._onRequestScrollToBottom.fire(), s && this._onUserInput.fire(), this._logService.debug(`sending data "${t}"`, () => t.split("").map((l) => l.charCodeAt(0))), this._onData.fire(t);
        }
        triggerBinaryEvent(t) {
          this._optionsService.rawOptions.disableStdin || (this._logService.debug(`sending binary "${t}"`, () => t.split("").map((s) => s.charCodeAt(0))), this._onBinary.fire(t));
        }
      };
      r.CoreService = i = c([_(0, g.IBufferService), _(1, g.ILogService), _(2, g.IOptionsService)], i);
    }, 9074: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.DecorationService = void 0;
      const c = o(8055), _ = o(8460), n = o(844), u = o(6106);
      let v = 0, g = 0;
      class d extends n.Disposable {
        get decorations() {
          return this._decorations.values();
        }
        constructor() {
          super(), this._decorations = new u.SortedList((t) => t == null ? void 0 : t.marker.line), this._onDecorationRegistered = this.register(new _.EventEmitter()), this.onDecorationRegistered = this._onDecorationRegistered.event, this._onDecorationRemoved = this.register(new _.EventEmitter()), this.onDecorationRemoved = this._onDecorationRemoved.event, this.register((0, n.toDisposable)(() => this.reset()));
        }
        registerDecoration(t) {
          if (t.marker.isDisposed) return;
          const s = new e(t);
          if (s) {
            const a = s.marker.onDispose(() => s.dispose());
            s.onDispose(() => {
              s && (this._decorations.delete(s) && this._onDecorationRemoved.fire(s), a.dispose());
            }), this._decorations.insert(s), this._onDecorationRegistered.fire(s);
          }
          return s;
        }
        reset() {
          for (const t of this._decorations.values()) t.dispose();
          this._decorations.clear();
        }
        *getDecorationsAtCell(t, s, a) {
          var l, f, m;
          let h = 0, p = 0;
          for (const b of this._decorations.getKeyIterator(s)) h = (l = b.options.x) !== null && l !== void 0 ? l : 0, p = h + ((f = b.options.width) !== null && f !== void 0 ? f : 1), t >= h && t < p && (!a || ((m = b.options.layer) !== null && m !== void 0 ? m : "bottom") === a) && (yield b);
        }
        forEachDecorationAtCell(t, s, a, l) {
          this._decorations.forEachByKey(s, (f) => {
            var m, h, p;
            v = (m = f.options.x) !== null && m !== void 0 ? m : 0, g = v + ((h = f.options.width) !== null && h !== void 0 ? h : 1), t >= v && t < g && (!a || ((p = f.options.layer) !== null && p !== void 0 ? p : "bottom") === a) && l(f);
          });
        }
      }
      r.DecorationService = d;
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
    }, 4348: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.InstantiationService = r.ServiceCollection = void 0;
      const c = o(2585), _ = o(8343);
      class n {
        constructor(...v) {
          this._entries = /* @__PURE__ */ new Map();
          for (const [g, d] of v) this.set(g, d);
        }
        set(v, g) {
          const d = this._entries.get(v);
          return this._entries.set(v, g), d;
        }
        forEach(v) {
          for (const [g, d] of this._entries.entries()) v(g, d);
        }
        has(v) {
          return this._entries.has(v);
        }
        get(v) {
          return this._entries.get(v);
        }
      }
      r.ServiceCollection = n, r.InstantiationService = class {
        constructor() {
          this._services = new n(), this._services.set(c.IInstantiationService, this);
        }
        setService(u, v) {
          this._services.set(u, v);
        }
        getService(u) {
          return this._services.get(u);
        }
        createInstance(u, ...v) {
          const g = (0, _.getServiceDependencies)(u).sort((i, t) => i.index - t.index), d = [];
          for (const i of g) {
            const t = this._services.get(i.id);
            if (!t) throw new Error(`[createInstance] ${u.name} depends on UNKNOWN service ${i.id}.`);
            d.push(t);
          }
          const e = g.length > 0 ? g[0].index : v.length;
          if (v.length !== e) throw new Error(`[createInstance] First service dependency of ${u.name} at position ${e + 1} conflicts with ${v.length} static arguments`);
          return new u(...v, ...d);
        }
      };
    }, 7866: function(B, r, o) {
      var c = this && this.__decorate || function(e, i, t, s) {
        var a, l = arguments.length, f = l < 3 ? i : s === null ? s = Object.getOwnPropertyDescriptor(i, t) : s;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") f = Reflect.decorate(e, i, t, s);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (f = (l < 3 ? a(f) : l > 3 ? a(i, t, f) : a(i, t)) || f);
        return l > 3 && f && Object.defineProperty(i, t, f), f;
      }, _ = this && this.__param || function(e, i) {
        return function(t, s) {
          i(t, s, e);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.traceCall = r.setTraceLogger = r.LogService = void 0;
      const n = o(844), u = o(2585), v = { trace: u.LogLevelEnum.TRACE, debug: u.LogLevelEnum.DEBUG, info: u.LogLevelEnum.INFO, warn: u.LogLevelEnum.WARN, error: u.LogLevelEnum.ERROR, off: u.LogLevelEnum.OFF };
      let g, d = r.LogService = class extends n.Disposable {
        get logLevel() {
          return this._logLevel;
        }
        constructor(e) {
          super(), this._optionsService = e, this._logLevel = u.LogLevelEnum.OFF, this._updateLogLevel(), this.register(this._optionsService.onSpecificOptionChange("logLevel", () => this._updateLogLevel())), g = this;
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
          var t, s;
          this._logLevel <= u.LogLevelEnum.TRACE && this._log((s = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.trace.bind(this._optionsService.options.logger)) !== null && s !== void 0 ? s : console.log, e, i);
        }
        debug(e, ...i) {
          var t, s;
          this._logLevel <= u.LogLevelEnum.DEBUG && this._log((s = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.debug.bind(this._optionsService.options.logger)) !== null && s !== void 0 ? s : console.log, e, i);
        }
        info(e, ...i) {
          var t, s;
          this._logLevel <= u.LogLevelEnum.INFO && this._log((s = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.info.bind(this._optionsService.options.logger)) !== null && s !== void 0 ? s : console.info, e, i);
        }
        warn(e, ...i) {
          var t, s;
          this._logLevel <= u.LogLevelEnum.WARN && this._log((s = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.warn.bind(this._optionsService.options.logger)) !== null && s !== void 0 ? s : console.warn, e, i);
        }
        error(e, ...i) {
          var t, s;
          this._logLevel <= u.LogLevelEnum.ERROR && this._log((s = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.error.bind(this._optionsService.options.logger)) !== null && s !== void 0 ? s : console.error, e, i);
        }
      };
      r.LogService = d = c([_(0, u.IOptionsService)], d), r.setTraceLogger = function(e) {
        g = e;
      }, r.traceCall = function(e, i, t) {
        if (typeof t.value != "function") throw new Error("not supported");
        const s = t.value;
        t.value = function(...a) {
          if (g.logLevel !== u.LogLevelEnum.TRACE) return s.apply(this, a);
          g.trace(`GlyphRenderer#${s.name}(${a.map((f) => JSON.stringify(f)).join(", ")})`);
          const l = s.apply(this, a);
          return g.trace(`GlyphRenderer#${s.name} return`, l), l;
        };
      };
    }, 7302: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.OptionsService = r.DEFAULT_OPTIONS = void 0;
      const c = o(8460), _ = o(844), n = o(6114);
      r.DEFAULT_OPTIONS = { cols: 80, rows: 24, cursorBlink: !1, cursorStyle: "block", cursorWidth: 1, cursorInactiveStyle: "outline", customGlyphs: !0, drawBoldTextInBrightColors: !0, fastScrollModifier: "alt", fastScrollSensitivity: 5, fontFamily: "courier-new, courier, monospace", fontSize: 15, fontWeight: "normal", fontWeightBold: "bold", ignoreBracketedPasteMode: !1, lineHeight: 1, letterSpacing: 0, linkHandler: null, logLevel: "info", logger: null, scrollback: 1e3, scrollOnUserInput: !0, scrollSensitivity: 1, screenReaderMode: !1, smoothScrollDuration: 0, macOptionIsMeta: !1, macOptionClickForcesSelection: !1, minimumContrastRatio: 1, disableStdin: !1, allowProposedApi: !1, allowTransparency: !1, tabStopWidth: 8, theme: {}, rightClickSelectsWord: n.isMac, windowOptions: {}, windowsMode: !1, windowsPty: {}, wordSeparator: " ()[]{}',\"`", altClickMovesCursor: !0, convertEol: !1, termName: "xterm", cancelEvents: !1, overviewRulerWidth: 0 };
      const u = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
      class v extends _.Disposable {
        constructor(d) {
          super(), this._onOptionChange = this.register(new c.EventEmitter()), this.onOptionChange = this._onOptionChange.event;
          const e = Object.assign({}, r.DEFAULT_OPTIONS);
          for (const i in d) if (i in e) try {
            const t = d[i];
            e[i] = this._sanitizeAndValidateOption(i, t);
          } catch (t) {
            console.error(t);
          }
          this.rawOptions = e, this.options = Object.assign({}, e), this._setupOptions();
        }
        onSpecificOptionChange(d, e) {
          return this.onOptionChange((i) => {
            i === d && e(this.rawOptions[d]);
          });
        }
        onMultipleOptionChange(d, e) {
          return this.onOptionChange((i) => {
            d.indexOf(i) !== -1 && e();
          });
        }
        _setupOptions() {
          const d = (i) => {
            if (!(i in r.DEFAULT_OPTIONS)) throw new Error(`No option with key "${i}"`);
            return this.rawOptions[i];
          }, e = (i, t) => {
            if (!(i in r.DEFAULT_OPTIONS)) throw new Error(`No option with key "${i}"`);
            t = this._sanitizeAndValidateOption(i, t), this.rawOptions[i] !== t && (this.rawOptions[i] = t, this._onOptionChange.fire(i));
          };
          for (const i in this.rawOptions) {
            const t = { get: d.bind(this, i), set: e.bind(this, i) };
            Object.defineProperty(this.options, i, t);
          }
        }
        _sanitizeAndValidateOption(d, e) {
          switch (d) {
            case "cursorStyle":
              if (e || (e = r.DEFAULT_OPTIONS[d]), !/* @__PURE__ */ function(i) {
                return i === "block" || i === "underline" || i === "bar";
              }(e)) throw new Error(`"${e}" is not a valid value for ${d}`);
              break;
            case "wordSeparator":
              e || (e = r.DEFAULT_OPTIONS[d]);
              break;
            case "fontWeight":
            case "fontWeightBold":
              if (typeof e == "number" && 1 <= e && e <= 1e3) break;
              e = u.includes(e) ? e : r.DEFAULT_OPTIONS[d];
              break;
            case "cursorWidth":
              e = Math.floor(e);
            case "lineHeight":
            case "tabStopWidth":
              if (e < 1) throw new Error(`${d} cannot be less than 1, value: ${e}`);
              break;
            case "minimumContrastRatio":
              e = Math.max(1, Math.min(21, Math.round(10 * e) / 10));
              break;
            case "scrollback":
              if ((e = Math.min(e, 4294967295)) < 0) throw new Error(`${d} cannot be less than 0, value: ${e}`);
              break;
            case "fastScrollSensitivity":
            case "scrollSensitivity":
              if (e <= 0) throw new Error(`${d} cannot be less than or equal to 0, value: ${e}`);
              break;
            case "rows":
            case "cols":
              if (!e && e !== 0) throw new Error(`${d} must be numeric, value: ${e}`);
              break;
            case "windowsPty":
              e = e ?? {};
          }
          return e;
        }
      }
      r.OptionsService = v;
    }, 2660: function(B, r, o) {
      var c = this && this.__decorate || function(v, g, d, e) {
        var i, t = arguments.length, s = t < 3 ? g : e === null ? e = Object.getOwnPropertyDescriptor(g, d) : e;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") s = Reflect.decorate(v, g, d, e);
        else for (var a = v.length - 1; a >= 0; a--) (i = v[a]) && (s = (t < 3 ? i(s) : t > 3 ? i(g, d, s) : i(g, d)) || s);
        return t > 3 && s && Object.defineProperty(g, d, s), s;
      }, _ = this && this.__param || function(v, g) {
        return function(d, e) {
          g(d, e, v);
        };
      };
      Object.defineProperty(r, "__esModule", { value: !0 }), r.OscLinkService = void 0;
      const n = o(2585);
      let u = r.OscLinkService = class {
        constructor(v) {
          this._bufferService = v, this._nextId = 1, this._entriesWithId = /* @__PURE__ */ new Map(), this._dataByLinkId = /* @__PURE__ */ new Map();
        }
        registerLink(v) {
          const g = this._bufferService.buffer;
          if (v.id === void 0) {
            const a = g.addMarker(g.ybase + g.y), l = { data: v, id: this._nextId++, lines: [a] };
            return a.onDispose(() => this._removeMarkerFromLink(l, a)), this._dataByLinkId.set(l.id, l), l.id;
          }
          const d = v, e = this._getEntryIdKey(d), i = this._entriesWithId.get(e);
          if (i) return this.addLineToLink(i.id, g.ybase + g.y), i.id;
          const t = g.addMarker(g.ybase + g.y), s = { id: this._nextId++, key: this._getEntryIdKey(d), data: d, lines: [t] };
          return t.onDispose(() => this._removeMarkerFromLink(s, t)), this._entriesWithId.set(s.key, s), this._dataByLinkId.set(s.id, s), s.id;
        }
        addLineToLink(v, g) {
          const d = this._dataByLinkId.get(v);
          if (d && d.lines.every((e) => e.line !== g)) {
            const e = this._bufferService.buffer.addMarker(g);
            d.lines.push(e), e.onDispose(() => this._removeMarkerFromLink(d, e));
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
          const d = v.lines.indexOf(g);
          d !== -1 && (v.lines.splice(d, 1), v.lines.length === 0 && (v.data.id !== void 0 && this._entriesWithId.delete(v.key), this._dataByLinkId.delete(v.id)));
        }
      };
      r.OscLinkService = u = c([_(0, n.IBufferService)], u);
    }, 8343: (B, r) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.createDecorator = r.getServiceDependencies = r.serviceRegistry = void 0;
      const o = "di$target", c = "di$dependencies";
      r.serviceRegistry = /* @__PURE__ */ new Map(), r.getServiceDependencies = function(_) {
        return _[c] || [];
      }, r.createDecorator = function(_) {
        if (r.serviceRegistry.has(_)) return r.serviceRegistry.get(_);
        const n = function(u, v, g) {
          if (arguments.length !== 3) throw new Error("@IServiceName-decorator can only be used to decorate a parameter");
          (function(d, e, i) {
            e[o] === e ? e[c].push({ id: d, index: i }) : (e[c] = [{ id: d, index: i }], e[o] = e);
          })(n, u, g);
        };
        return n.toString = () => _, r.serviceRegistry.set(_, n), n;
      };
    }, 2585: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.IDecorationService = r.IUnicodeService = r.IOscLinkService = r.IOptionsService = r.ILogService = r.LogLevelEnum = r.IInstantiationService = r.ICharsetService = r.ICoreService = r.ICoreMouseService = r.IBufferService = void 0;
      const c = o(8343);
      var _;
      r.IBufferService = (0, c.createDecorator)("BufferService"), r.ICoreMouseService = (0, c.createDecorator)("CoreMouseService"), r.ICoreService = (0, c.createDecorator)("CoreService"), r.ICharsetService = (0, c.createDecorator)("CharsetService"), r.IInstantiationService = (0, c.createDecorator)("InstantiationService"), function(n) {
        n[n.TRACE = 0] = "TRACE", n[n.DEBUG = 1] = "DEBUG", n[n.INFO = 2] = "INFO", n[n.WARN = 3] = "WARN", n[n.ERROR = 4] = "ERROR", n[n.OFF = 5] = "OFF";
      }(_ || (r.LogLevelEnum = _ = {})), r.ILogService = (0, c.createDecorator)("LogService"), r.IOptionsService = (0, c.createDecorator)("OptionsService"), r.IOscLinkService = (0, c.createDecorator)("OscLinkService"), r.IUnicodeService = (0, c.createDecorator)("UnicodeService"), r.IDecorationService = (0, c.createDecorator)("DecorationService");
    }, 1480: (B, r, o) => {
      Object.defineProperty(r, "__esModule", { value: !0 }), r.UnicodeService = void 0;
      const c = o(8460), _ = o(225);
      r.UnicodeService = class {
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
          let u = 0;
          const v = n.length;
          for (let g = 0; g < v; ++g) {
            let d = n.charCodeAt(g);
            if (55296 <= d && d <= 56319) {
              if (++g >= v) return u + this.wcwidth(d);
              const e = n.charCodeAt(g);
              56320 <= e && e <= 57343 ? d = 1024 * (d - 55296) + e - 56320 + 65536 : u += this.wcwidth(e);
            }
            u += this.wcwidth(d);
          }
          return u;
        }
      };
    } }, Q = {};
    function U(B) {
      var r = Q[B];
      if (r !== void 0) return r.exports;
      var o = Q[B] = { exports: {} };
      return K[B].call(o.exports, o, o.exports, U), o.exports;
    }
    var Z = {};
    return (() => {
      var B = Z;
      Object.defineProperty(B, "__esModule", { value: !0 }), B.Terminal = void 0;
      const r = U(9042), o = U(3236), c = U(844), _ = U(5741), n = U(8285), u = U(7975), v = U(7090), g = ["cols", "rows"];
      class d extends c.Disposable {
        constructor(i) {
          super(), this._core = this.register(new o.Terminal(i)), this._addonManager = this.register(new _.AddonManager()), this._publicOptions = Object.assign({}, this._core.options);
          const t = (a) => this._core.options[a], s = (a, l) => {
            this._checkReadonlyOptions(a), this._core.options[a] = l;
          };
          for (const a in this._core.options) {
            const l = { get: t.bind(this, a), set: s.bind(this, a) };
            Object.defineProperty(this._publicOptions, a, l);
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
          return this._parser || (this._parser = new u.ParserApi(this._core)), this._parser;
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
          var t, s, a;
          return this._checkProposedApi(), this._verifyPositiveIntegers((t = i.x) !== null && t !== void 0 ? t : 0, (s = i.width) !== null && s !== void 0 ? s : 0, (a = i.height) !== null && a !== void 0 ? a : 0), this._core.registerDecoration(i);
        }
        hasSelection() {
          return this._core.hasSelection();
        }
        select(i, t, s) {
          this._verifyIntegers(i, t, s), this._core.select(i, t, s);
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
          return r;
        }
        _verifyIntegers(...i) {
          for (const t of i) if (t === 1 / 0 || isNaN(t) || t % 1 != 0) throw new Error("This API only accepts integers");
        }
        _verifyPositiveIntegers(...i) {
          for (const t of i) if (t && (t === 1 / 0 || isNaN(t) || t % 1 != 0 || t < 0)) throw new Error("This API only accepts positive integers");
        }
      }
      B.Terminal = d;
    })(), Z;
  })());
})(ye);
var Ae = ye.exports, Ee = { exports: {} };
(function(z, Y) {
  (function(K, Q) {
    z.exports = Q();
  })(self, () => (() => {
    var K = {};
    return (() => {
      var Q = K;
      Object.defineProperty(Q, "__esModule", { value: !0 }), Q.FitAddon = void 0, Q.FitAddon = class {
        activate(U) {
          this._terminal = U;
        }
        dispose() {
        }
        fit() {
          const U = this.proposeDimensions();
          if (!U || !this._terminal || isNaN(U.cols) || isNaN(U.rows)) return;
          const Z = this._terminal._core;
          this._terminal.rows === U.rows && this._terminal.cols === U.cols || (Z._renderService.clear(), this._terminal.resize(U.cols, U.rows));
        }
        proposeDimensions() {
          if (!this._terminal || !this._terminal.element || !this._terminal.element.parentElement) return;
          const U = this._terminal._core, Z = U._renderService.dimensions;
          if (Z.css.cell.width === 0 || Z.css.cell.height === 0) return;
          const B = this._terminal.options.scrollback === 0 ? 0 : U.viewport.scrollBarWidth, r = window.getComputedStyle(this._terminal.element.parentElement), o = parseInt(r.getPropertyValue("height")), c = Math.max(0, parseInt(r.getPropertyValue("width"))), _ = window.getComputedStyle(this._terminal.element), n = o - (parseInt(_.getPropertyValue("padding-top")) + parseInt(_.getPropertyValue("padding-bottom"))), u = c - (parseInt(_.getPropertyValue("padding-right")) + parseInt(_.getPropertyValue("padding-left"))) - B;
          return { cols: Math.max(2, Math.floor(u / Z.css.cell.width)), rows: Math.max(1, Math.floor(n / Z.css.cell.height)) };
        }
      };
    })(), K;
  })());
})(Ee);
var Be = Ee.exports;
const Te = `/**
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
 */.xterm{cursor:text;position:relative;user-select:none;-ms-user-select:none;-webkit-user-select:none}.xterm.focus,.xterm:focus{outline:none}.xterm .xterm-helpers{position:absolute;top:0;z-index:5}.xterm .xterm-helper-textarea{padding:0;border:0;margin:0;position:absolute;opacity:0;left:-9999em;top:0;width:0;height:0;z-index:-5;white-space:nowrap;overflow:hidden;resize:none}.xterm .composition-view{background:#000;color:#fff;display:none;position:absolute;white-space:nowrap;z-index:1}.xterm .composition-view.active{display:block}.xterm .xterm-viewport{background-color:#000;overflow-y:scroll;cursor:default;position:absolute;right:0;left:0;top:0;bottom:0}.xterm .xterm-screen{position:relative}.xterm .xterm-screen canvas{position:absolute;left:0;top:0}.xterm .xterm-scroll-area{visibility:hidden}.xterm-char-measure-element{display:inline-block;visibility:hidden;position:absolute;top:0;left:-9999em;line-height:normal}.xterm.enable-mouse-events{cursor:default}.xterm.xterm-cursor-pointer,.xterm .xterm-cursor-pointer{cursor:pointer}.xterm.column-select.focus{cursor:crosshair}.xterm .xterm-accessibility,.xterm .xterm-message{position:absolute;left:0;top:0;bottom:0;right:0;z-index:10;color:transparent;pointer-events:none}.xterm .live-region{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.xterm-dim{opacity:1!important}.xterm-underline-1{text-decoration:underline}.xterm-underline-2{text-decoration:double underline}.xterm-underline-3{text-decoration:wavy underline}.xterm-underline-4{text-decoration:dotted underline}.xterm-underline-5{text-decoration:dashed underline}.xterm-overline{text-decoration:overline}.xterm-overline.xterm-underline-1{text-decoration:overline underline}.xterm-overline.xterm-underline-2{text-decoration:overline double underline}.xterm-overline.xterm-underline-3{text-decoration:overline wavy underline}.xterm-overline.xterm-underline-4{text-decoration:overline dotted underline}.xterm-overline.xterm-underline-5{text-decoration:overline dashed underline}.xterm-strikethrough{text-decoration:line-through}.xterm-screen .xterm-decoration-container .xterm-decoration{z-index:6;position:absolute}.xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer{z-index:7}.xterm-decoration-overview-ruler{z-index:8;position:absolute;top:0;right:0;pointer-events:none}.xterm-decoration-top{z-index:2;position:relative}`, Me = ".hv-app-host{position:relative;height:100%}.hv-root{position:relative;display:flex;height:100%;min-height:480px;background:#0b0e14;color:#d7dae0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,sans-serif}.hv-sidebar{width:260px;flex:0 0 260px;border-right:1px solid #1b2130;padding:16px;overflow-y:auto;background:#0e1219}.hv-brand{font-size:16px;font-weight:700;letter-spacing:.02em;margin-bottom:16px;color:#e8ecf4}.hv-section-title{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#6b7488;margin:18px 0 8px}.hv-prov-list{display:flex;flex-direction:column;gap:4px}.hv-prov{padding:7px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:#b6bdcc;border:1px solid transparent;transition:background .12s ease}.hv-prov:hover{background:#161b26}.hv-prov.hv-active{background:#212a3b;color:#fff;border-color:#35405a}.hv-na{color:#6b7488;font-size:11px}.hv-disc{display:flex;flex-direction:column;gap:4px}.hv-disc-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:#c3cad9;background:#141926;border:1px solid #1d2333;transition:background .12s ease}.hv-disc-item:hover{background:#1c2436}.hv-disc-dot{width:8px;height:8px;border-radius:50%;background:#34d399;flex:0 0 8px}.hv-disc-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hv-disc-prov{font-size:10px;color:#6b7488;text-transform:uppercase;letter-spacing:.04em}.hv-main{flex:1;display:flex;flex-direction:column;min-width:0}.hv-form{display:flex;gap:10px;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid #1b2130;background:#0e1219}.hv-form-row{display:flex;gap:10px;flex:1;min-width:220px}.hv-inp{background:#141926;border:1px solid #232c40;color:#e8ecf4;border-radius:6px;padding:8px 10px;font-size:13px;outline:none;flex:1}.hv-inp:focus{border-color:#3b82f6}.hv-inp.hv-wide{flex:1;min-width:260px}.hv-btn{background:#2563eb;color:#fff;border:none;border-radius:6px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}.hv-btn:disabled{opacity:.5;cursor:default}.hv-panes{flex:1;display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));grid-auto-rows:minmax(300px,1fr);gap:12px;padding:16px;overflow-y:auto;align-content:start}.hv-pane{display:flex;flex-direction:column;background:#0f1117;border:1px solid #1d2435;border-radius:8px;overflow:hidden;min-height:300px}.hv-pane-top{display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:#141a26;border-bottom:1px solid #1d2435;font-size:12px;color:#9aa3b5}.hv-pane-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:Menlo,Consolas,monospace}.hv-close{background:transparent;border:1px solid #2a3450;color:#9aa3b5;border-radius:4px;font-size:11px;padding:2px 8px;cursor:pointer}.hv-close:hover{color:#fff;border-color:#3b82f6}.hv-term{flex:1;min-height:260px;padding:4px;height:100%}.hv-term .xterm{height:100%}.hv-welcome{grid-column:1 / -1;color:#6b7488;font-size:13px;padding:40px;text-align:center;border:1px dashed #232c40;border-radius:8px}.hv-empty{color:#6b7488;font-size:13px;padding:8px}.hv-empty.sm{font-size:12px;padding:4px 0}";
let be = !1;
function ke() {
  if (be) return;
  be = !0;
  const z = document.createElement("style");
  z.textContent = Te + `
` + Me, document.head.appendChild(z);
}
const Oe = "kiro-herdr-views", Pe = "/apps/" + Oe + "/api", xe = "kiro-herdr-views:panes", ae = (z) => Pe + z;
function Ie() {
  try {
    const z = window.localStorage.getItem(xe), Y = z ? JSON.parse(z) : [];
    return Array.isArray(Y) ? Y.filter((K) => K && K.ref && K.cmd) : [];
  } catch {
    return [];
  }
}
function He(z) {
  try {
    window.localStorage.setItem(xe, JSON.stringify(z));
  } catch {
  }
}
async function Le(z) {
  const Y = await fetch(z, { credentials: "same-origin" });
  if (!Y.ok) throw new Error("GET " + z + " -> " + Y.status);
  return Y.json();
}
async function fe(z, Y) {
  const K = await fetch(z, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Y || {})
  });
  if (!K.ok) throw new Error("POST " + z + " -> " + K.status);
  return K.json();
}
function Ce(z, Y) {
  try {
    window.parent && typeof window.parent.postMessage == "function" && window.parent !== window && window.parent.postMessage({ source: "kiro-herdr-views", type: "notify", text: z, severity: Y === "error" ? "error" : "info" }, "*");
  } catch {
  }
  console.log("[herdr-views]", z);
}
function Fe({ session: z, onClose: Y }) {
  const K = V.useRef(null), Q = V.useRef("ws"), U = V.useRef(null), Z = V.useRef(null);
  return V.useEffect(() => {
    let B = !1;
    const r = new Ae.Terminal({
      convertEol: !0,
      fontSize: 13,
      fontFamily: 'Menlo, Consolas, "DejaVu Sans Mono", monospace',
      cursorBlink: !0,
      theme: { background: "#0f1117", foreground: "#d7dae0" }
    }), o = new Be.FitAddon();
    r.loadAddon(o), r.open(K.current);
    try {
      o.fit();
    } catch {
    }
    const c = () => {
      try {
        const e = { cols: r.cols, rows: r.rows };
        U.current && U.current.readyState === 1 ? U.current.send(JSON.stringify({ type: "resize", cols: e.cols, rows: e.rows })) : fe(ae("/resize"), { ref: z.ref, cols: e.cols, rows: e.rows }).catch(() => {
        });
      } catch {
      }
    }, _ = () => {
      try {
        o.fit(), c();
      } catch {
      }
    };
    window.addEventListener("resize", _), r.onData((e) => {
      U.current && U.current.readyState === 1 ? U.current.send(JSON.stringify({ type: "input", data: e })) : fe(ae("/input"), { ref: z.ref, data: e }).catch(() => {
      });
    });
    const n = () => {
      if (!B) {
        if (B = !0, U.current)
          try {
            U.current.close();
          } catch {
          }
        if (Z.current)
          try {
            Z.current.close();
          } catch {
          }
        window.removeEventListener("resize", _);
      }
    }, u = () => {
      if (B || Q.current === "sse") return;
      Q.current = "sse";
      const e = new EventSource(ae("/sse?ref=" + encodeURIComponent(z.ref)));
      Z.current = e, e.onmessage = (i) => {
        try {
          const t = JSON.parse(i.data);
          t.type === "chunk" && r.write(t.data), t.type === "exit" && n();
        } catch {
        }
      }, e.onerror = () => {
      };
    }, g = (window.location.protocol === "https:" ? "wss" : "ws") + "://" + window.location.host + ae("/ws?ref=" + encodeURIComponent(z.ref));
    let d = null;
    try {
      d = new WebSocket(g);
    } catch {
    }
    return U.current = d, d ? (d.onopen = () => {
      _();
    }, d.onmessage = (e) => {
      try {
        const i = JSON.parse(e.data);
        i.type === "chunk" && r.write(i.data), i.type === "error" && (B || u()), i.type === "exit" && n();
      } catch {
      }
    }, d.onerror = () => {
      B || u();
    }, d.onclose = () => {
      B || u();
    }) : u(), n;
  }, [z.ref]), /* @__PURE__ */ ie("div", { className: "hv-pane", children: [
    /* @__PURE__ */ ie("div", { className: "hv-pane-top", children: [
      /* @__PURE__ */ ie("span", { className: "hv-pane-title", children: [
        z.providerId,
        ":",
        z.name,
        " — ",
        (z.cmd || []).join(" ")
      ] }),
      /* @__PURE__ */ G("button", { className: "hv-close", onClick: Y, children: "Detach" })
    ] }),
    /* @__PURE__ */ G("div", { className: "hv-term", ref: K })
  ] });
}
function Ne({ providers: z, onCreated: Y }) {
  const [K, Q] = V.useState(""), [U, Z] = V.useState(""), [B, r] = V.useState(""), [o, c] = V.useState(!1), [_, n] = V.useState(!1), [u, v] = V.useState(!1), [g, d] = V.useState(""), e = V.useRef(!1), i = V.useRef(""), t = V.useRef(0), s = V.useRef(!0);
  V.useEffect(() => {
    e.current = _;
  }, [_]), V.useEffect(() => () => {
    s.current = !1;
  }, []);
  const a = (z || []).filter((f) => f.available);
  return V.useEffect(() => {
    if (!K) {
      t.current += 1, e.current || r(""), d(""), v(!1), i.current = "";
      return;
    }
    const f = U && U.trim(), m = f || K + "-session";
    if (f || Z(K + "-session"), i.current === m) return;
    if (i.current = m, e.current) {
      v(!1);
      return;
    }
    v(!0), d("");
    const h = ++t.current, p = () => h !== t.current || !s.current;
    Le(ae("/providers/" + encodeURIComponent(K) + "/create-command?name=" + encodeURIComponent(m))).then((b) => {
      p() || e.current || r((b && b.cmd ? b.cmd : []).join(" "));
    }).catch((b) => {
      p() || e.current || d("Failed to load default command: " + String(b));
    }).finally(() => {
      p() || v(!1);
    });
  }, [K, U]), /* @__PURE__ */ ie("form", { className: "hv-form", onSubmit: async (f) => {
    f.preventDefault(), c(!0);
    try {
      const m = U && U.trim(), h = m || (K ? K + "-session" : ""), p = B && B.trim(), b = {};
      K ? _ && p ? (b.provider = K, b.cmd = B.trim().split(/\s+/).filter(Boolean)) : (b.provider = K, b.name = h) : p ? (b.provider = "custom", b.cmd = B.trim().split(/\s+/).filter(Boolean)) : (b.provider = "custom", b.cmd = ["bash"]), m && !b.name && (b.name = m);
      const x = await fe(ae("/sessions"), b);
      Y && Y(x.session), Ce("Session attached: " + (x.session.name || ""));
    } catch (m) {
      Ce("Failed to attach: " + String(m), "error");
    } finally {
      c(!1);
    }
  }, children: [
    /* @__PURE__ */ ie("div", { className: "hv-form-row", children: [
      /* @__PURE__ */ ie("select", { className: "hv-inp", value: K, onChange: (f) => Q(f.target.value), children: [
        /* @__PURE__ */ G("option", { value: "", children: "Custom command" }),
        a.map((f) => /* @__PURE__ */ G("option", { value: f.id, children: f.label }, f.id))
      ] }),
      /* @__PURE__ */ G("input", { className: "hv-inp", placeholder: "session name (optional)", value: U, onChange: (f) => Z(f.target.value) })
    ] }),
    /* @__PURE__ */ ie("div", { className: "hv-form-row", style: { alignItems: "flex-end" }, children: [
      /* @__PURE__ */ G(
        "input",
        {
          className: "hv-inp hv-wide",
          placeholder: K ? "auto-filled from " + K + "; edit to switch to manual attach" : "attach command e.g. tmux attach -t myagent — or bash",
          value: B,
          onChange: (f) => {
            const m = f.target.value;
            r(m), _ || (n(!0), e.current = !0, d(""));
          }
        }
      ),
      u && /* @__PURE__ */ G("span", { className: "hv-empty sm", style: { display: "block", marginTop: "2px" }, children: "loading default command…" })
    ] }),
    g && /* @__PURE__ */ G("div", { className: "hv-err", children: g }),
    K && !_ && B && /* @__PURE__ */ ie("span", { className: "hv-empty sm", style: { display: "block", marginTop: "4px", marginBottom: "4px" }, children: [
      "Auto-filled from ",
      K,
      ". Editing this field switches to manual attach mode."
    ] }),
    /* @__PURE__ */ G("button", { className: "hv-btn", type: "submit", disabled: o || u, children: o ? "Attaching…" : u ? "Loading…" : "Attach / New Session" })
  ] });
}
function We() {
  const [z, Y] = V.useState([]), [K, Q] = V.useState([]), [U, Z] = V.useState(Ie), [B, r] = V.useState(""), [o, c] = V.useState([]), [_, n] = V.useState("");
  V.useEffect(() => {
    He(U);
  }, [U]);
  const u = V.useCallback(async () => {
    try {
      const d = await Le(ae("/providers"));
      Y(d.providers || []), Q(d.sessions || []), n("");
      const e = d.sessions || [];
      Z((i) => {
        const t = i.filter((a) => e.some((l) => l.ref === a.ref));
        return i.filter((a) => !e.some((l) => l.ref === a.ref)).length ? t : i;
      });
    } catch (d) {
      n(String(d));
    }
  }, []);
  V.useEffect(() => {
    u();
    const d = setInterval(() => {
      u();
    }, 8e3);
    return () => clearInterval(d);
  }, [u]), V.useEffect(() => {
    const d = (z || []).filter((i) => !B || i.id === B), e = [];
    for (const i of d) for (const t of i.sessions || []) e.push({ providerId: i.id, ...t });
    c(e);
  }, [z, B]);
  const v = async (d) => {
    try {
      const e = d.cmd ? { provider: d.providerId || d.provider, name: d.name, cmd: d.cmd } : { provider: d.providerId || d.provider, ref: d.ref }, t = (await fe(ae("/sessions"), e)).session;
      Z((s) => [...s, t]), Q((s) => s.some((a) => a.ref === t.ref) ? s : [...s, t]);
    } catch (e) {
      Ce("Failed to open: " + String(e), "error");
    }
  }, g = (d) => Z((e) => e.filter((i) => i.ref !== d));
  return /* @__PURE__ */ ie("div", { className: "hv-root", children: [
    /* @__PURE__ */ ie("div", { className: "hv-sidebar", children: [
      /* @__PURE__ */ G("div", { className: "hv-brand", children: "Herdr Views" }),
      _ && /* @__PURE__ */ G("div", { className: "hv-err", children: _ }),
      /* @__PURE__ */ G("div", { className: "hv-section-title", children: "Providers" }),
      /* @__PURE__ */ ie("div", { className: "hv-prov-list", children: [
        /* @__PURE__ */ G("div", { className: "hv-prov" + (B === "" ? " hv-active" : ""), onClick: () => r(""), children: "All" }),
        z.map((d) => /* @__PURE__ */ ie("div", { className: "hv-prov" + (B === d.id ? " hv-active" : ""), onClick: () => r(d.id), children: [
          d.id,
          " ",
          d.available ? "" : /* @__PURE__ */ G("span", { className: "hv-na", children: "(n/a)" })
        ] }, d.id))
      ] }),
      /* @__PURE__ */ G("div", { className: "hv-section-title", children: "Discovered Sessions" }),
      /* @__PURE__ */ G("div", { className: "hv-disc", children: o.length === 0 ? /* @__PURE__ */ G("div", { className: "hv-empty sm", children: "No sessions discovered" }) : o.map((d) => /* @__PURE__ */ ie("div", { className: "hv-disc-item", onClick: () => v(d), children: [
        /* @__PURE__ */ G("span", { className: "hv-disc-dot" }),
        /* @__PURE__ */ G("span", { className: "hv-disc-name", children: d.name }),
        /* @__PURE__ */ G("span", { className: "hv-disc-prov", children: d.providerId })
      ] }, d.providerId + ":" + d.ref)) })
    ] }),
    /* @__PURE__ */ ie("div", { className: "hv-main", children: [
      /* @__PURE__ */ G(Ne, { providers: z, onCreated: (d) => Z((e) => [...e, d]) }),
      /* @__PURE__ */ G("div", { className: "hv-panes", children: U.length === 0 ? /* @__PURE__ */ G("div", { className: "hv-welcome", children: "Attach to a session to start viewing. Sessions are real tmux/screen/zellij/herdr/aoe processes — detaching here leaves them running on the host." }) : U.map((d) => /* @__PURE__ */ G(Fe, { session: d, onClose: () => g(d.ref) }, d.ref)) })
    ] })
  ] });
}
function $e(z) {
  ke();
  const Y = De(z);
  return Y.render(/* @__PURE__ */ G(We, {})), () => Y.unmount();
}
ke();
export {
  We as default,
  $e as mount
};
