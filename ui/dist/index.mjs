import { jsx as F, jsxs as J } from "react/jsx-runtime";
import G from "react";
import { createRoot as We } from "react-dom/client";
var Ae = { exports: {} };
(function(P, z) {
  (function(U, q) {
    P.exports = q();
  })(self, () => (() => {
    var U = { 4567: function(M, s, o) {
      var l = this && this.__decorate || function(i, a, c, v) {
        var m, h = arguments.length, g = h < 3 ? a : v === null ? v = Object.getOwnPropertyDescriptor(a, c) : v;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") g = Reflect.decorate(i, a, c, v);
        else for (var E = i.length - 1; E >= 0; E--) (m = i[E]) && (g = (h < 3 ? m(g) : h > 3 ? m(a, c, g) : m(a, c)) || g);
        return h > 3 && g && Object.defineProperty(a, c, g), g;
      }, _ = this && this.__param || function(i, a) {
        return function(c, v) {
          a(c, v, i);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.AccessibilityManager = void 0;
      const n = o(9042), d = o(6114), f = o(9924), p = o(844), u = o(5596), e = o(4725), r = o(3656);
      let t = s.AccessibilityManager = class extends p.Disposable {
        constructor(i, a) {
          super(), this._terminal = i, this._renderService = a, this._liveRegionLineCount = 0, this._charsToConsume = [], this._charsToAnnounce = "", this._accessibilityContainer = document.createElement("div"), this._accessibilityContainer.classList.add("xterm-accessibility"), this._rowContainer = document.createElement("div"), this._rowContainer.setAttribute("role", "list"), this._rowContainer.classList.add("xterm-accessibility-tree"), this._rowElements = [];
          for (let c = 0; c < this._terminal.rows; c++) this._rowElements[c] = this._createAccessibilityTreeNode(), this._rowContainer.appendChild(this._rowElements[c]);
          if (this._topBoundaryFocusListener = (c) => this._handleBoundaryFocus(c, 0), this._bottomBoundaryFocusListener = (c) => this._handleBoundaryFocus(c, 1), this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener), this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._refreshRowsDimensions(), this._accessibilityContainer.appendChild(this._rowContainer), this._liveRegion = document.createElement("div"), this._liveRegion.classList.add("live-region"), this._liveRegion.setAttribute("aria-live", "assertive"), this._accessibilityContainer.appendChild(this._liveRegion), this._liveRegionDebouncer = this.register(new f.TimeBasedDebouncer(this._renderRows.bind(this))), !this._terminal.element) throw new Error("Cannot enable accessibility before Terminal.open");
          this._terminal.element.insertAdjacentElement("afterbegin", this._accessibilityContainer), this.register(this._terminal.onResize((c) => this._handleResize(c.rows))), this.register(this._terminal.onRender((c) => this._refreshRows(c.start, c.end))), this.register(this._terminal.onScroll(() => this._refreshRows())), this.register(this._terminal.onA11yChar((c) => this._handleChar(c))), this.register(this._terminal.onLineFeed(() => this._handleChar(`
`))), this.register(this._terminal.onA11yTab((c) => this._handleTab(c))), this.register(this._terminal.onKey((c) => this._handleKey(c.key))), this.register(this._terminal.onBlur(() => this._clearLiveRegion())), this.register(this._renderService.onDimensionsChange(() => this._refreshRowsDimensions())), this._screenDprMonitor = new u.ScreenDprMonitor(window), this.register(this._screenDprMonitor), this._screenDprMonitor.setListener(() => this._refreshRowsDimensions()), this.register((0, r.addDisposableDomListener)(window, "resize", () => this._refreshRowsDimensions())), this._refreshRows(), this.register((0, p.toDisposable)(() => {
            this._accessibilityContainer.remove(), this._rowElements.length = 0;
          }));
        }
        _handleTab(i) {
          for (let a = 0; a < i; a++) this._handleChar(" ");
        }
        _handleChar(i) {
          this._liveRegionLineCount < 21 && (this._charsToConsume.length > 0 ? this._charsToConsume.shift() !== i && (this._charsToAnnounce += i) : this._charsToAnnounce += i, i === `
` && (this._liveRegionLineCount++, this._liveRegionLineCount === 21 && (this._liveRegion.textContent += n.tooMuchOutput)), d.isMac && this._liveRegion.textContent && this._liveRegion.textContent.length > 0 && !this._liveRegion.parentNode && setTimeout(() => {
            this._accessibilityContainer.appendChild(this._liveRegion);
          }, 0));
        }
        _clearLiveRegion() {
          this._liveRegion.textContent = "", this._liveRegionLineCount = 0, d.isMac && this._liveRegion.remove();
        }
        _handleKey(i) {
          this._clearLiveRegion(), new RegExp("\\p{Control}", "u").test(i) || this._charsToConsume.push(i);
        }
        _refreshRows(i, a) {
          this._liveRegionDebouncer.refresh(i, a, this._terminal.rows);
        }
        _renderRows(i, a) {
          const c = this._terminal.buffer, v = c.lines.length.toString();
          for (let m = i; m <= a; m++) {
            const h = c.translateBufferLineToString(c.ydisp + m, !0), g = (c.ydisp + m + 1).toString(), E = this._rowElements[m];
            E && (h.length === 0 ? E.innerText = " " : E.textContent = h, E.setAttribute("aria-posinset", g), E.setAttribute("aria-setsize", v));
          }
          this._announceCharacters();
        }
        _announceCharacters() {
          this._charsToAnnounce.length !== 0 && (this._liveRegion.textContent += this._charsToAnnounce, this._charsToAnnounce = "");
        }
        _handleBoundaryFocus(i, a) {
          const c = i.target, v = this._rowElements[a === 0 ? 1 : this._rowElements.length - 2];
          if (c.getAttribute("aria-posinset") === (a === 0 ? "1" : `${this._terminal.buffer.lines.length}`) || i.relatedTarget !== v) return;
          let m, h;
          if (a === 0 ? (m = c, h = this._rowElements.pop(), this._rowContainer.removeChild(h)) : (m = this._rowElements.shift(), h = c, this._rowContainer.removeChild(m)), m.removeEventListener("focus", this._topBoundaryFocusListener), h.removeEventListener("focus", this._bottomBoundaryFocusListener), a === 0) {
            const g = this._createAccessibilityTreeNode();
            this._rowElements.unshift(g), this._rowContainer.insertAdjacentElement("afterbegin", g);
          } else {
            const g = this._createAccessibilityTreeNode();
            this._rowElements.push(g), this._rowContainer.appendChild(g);
          }
          this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener), this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._terminal.scrollLines(a === 0 ? -1 : 1), this._rowElements[a === 0 ? 1 : this._rowElements.length - 2].focus(), i.preventDefault(), i.stopImmediatePropagation();
        }
        _handleResize(i) {
          this._rowElements[this._rowElements.length - 1].removeEventListener("focus", this._bottomBoundaryFocusListener);
          for (let a = this._rowContainer.children.length; a < this._terminal.rows; a++) this._rowElements[a] = this._createAccessibilityTreeNode(), this._rowContainer.appendChild(this._rowElements[a]);
          for (; this._rowElements.length > i; ) this._rowContainer.removeChild(this._rowElements.pop());
          this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._refreshRowsDimensions();
        }
        _createAccessibilityTreeNode() {
          const i = document.createElement("div");
          return i.setAttribute("role", "listitem"), i.tabIndex = -1, this._refreshRowDimensions(i), i;
        }
        _refreshRowsDimensions() {
          if (this._renderService.dimensions.css.cell.height) {
            this._accessibilityContainer.style.width = `${this._renderService.dimensions.css.canvas.width}px`, this._rowElements.length !== this._terminal.rows && this._handleResize(this._terminal.rows);
            for (let i = 0; i < this._terminal.rows; i++) this._refreshRowDimensions(this._rowElements[i]);
          }
        }
        _refreshRowDimensions(i) {
          i.style.height = `${this._renderService.dimensions.css.cell.height}px`;
        }
      };
      s.AccessibilityManager = t = l([_(1, e.IRenderService)], t);
    }, 3614: (M, s) => {
      function o(d) {
        return d.replace(/\r?\n/g, "\r");
      }
      function l(d, f) {
        return f ? "\x1B[200~" + d + "\x1B[201~" : d;
      }
      function _(d, f, p, u) {
        d = l(d = o(d), p.decPrivateModes.bracketedPasteMode && u.rawOptions.ignoreBracketedPasteMode !== !0), p.triggerDataEvent(d, !0), f.value = "";
      }
      function n(d, f, p) {
        const u = p.getBoundingClientRect(), e = d.clientX - u.left - 10, r = d.clientY - u.top - 10;
        f.style.width = "20px", f.style.height = "20px", f.style.left = `${e}px`, f.style.top = `${r}px`, f.style.zIndex = "1000", f.focus();
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.rightClickHandler = s.moveTextAreaUnderMouseCursor = s.paste = s.handlePasteEvent = s.copyHandler = s.bracketTextForPaste = s.prepareTextForTerminal = void 0, s.prepareTextForTerminal = o, s.bracketTextForPaste = l, s.copyHandler = function(d, f) {
        d.clipboardData && d.clipboardData.setData("text/plain", f.selectionText), d.preventDefault();
      }, s.handlePasteEvent = function(d, f, p, u) {
        d.stopPropagation(), d.clipboardData && _(d.clipboardData.getData("text/plain"), f, p, u);
      }, s.paste = _, s.moveTextAreaUnderMouseCursor = n, s.rightClickHandler = function(d, f, p, u, e) {
        n(d, f, p), e && u.rightClickSelect(d), f.value = u.selectionText, f.select();
      };
    }, 7239: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ColorContrastCache = void 0;
      const l = o(1505);
      s.ColorContrastCache = class {
        constructor() {
          this._color = new l.TwoKeyMap(), this._css = new l.TwoKeyMap();
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
    }, 3656: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.addDisposableDomListener = void 0, s.addDisposableDomListener = function(o, l, _, n) {
        o.addEventListener(l, _, n);
        let d = !1;
        return { dispose: () => {
          d || (d = !0, o.removeEventListener(l, _, n));
        } };
      };
    }, 6465: function(M, s, o) {
      var l = this && this.__decorate || function(e, r, t, i) {
        var a, c = arguments.length, v = c < 3 ? r : i === null ? i = Object.getOwnPropertyDescriptor(r, t) : i;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") v = Reflect.decorate(e, r, t, i);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (v = (c < 3 ? a(v) : c > 3 ? a(r, t, v) : a(r, t)) || v);
        return c > 3 && v && Object.defineProperty(r, t, v), v;
      }, _ = this && this.__param || function(e, r) {
        return function(t, i) {
          r(t, i, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Linkifier2 = void 0;
      const n = o(3656), d = o(8460), f = o(844), p = o(2585);
      let u = s.Linkifier2 = class extends f.Disposable {
        get currentLink() {
          return this._currentLink;
        }
        constructor(e) {
          super(), this._bufferService = e, this._linkProviders = [], this._linkCacheDisposables = [], this._isMouseOut = !0, this._wasResized = !1, this._activeLine = -1, this._onShowLinkUnderline = this.register(new d.EventEmitter()), this.onShowLinkUnderline = this._onShowLinkUnderline.event, this._onHideLinkUnderline = this.register(new d.EventEmitter()), this.onHideLinkUnderline = this._onHideLinkUnderline.event, this.register((0, f.getDisposeArrayDisposable)(this._linkCacheDisposables)), this.register((0, f.toDisposable)(() => {
            this._lastMouseEvent = void 0;
          })), this.register(this._bufferService.onResize(() => {
            this._clearCurrentLink(), this._wasResized = !0;
          }));
        }
        registerLinkProvider(e) {
          return this._linkProviders.push(e), { dispose: () => {
            const r = this._linkProviders.indexOf(e);
            r !== -1 && this._linkProviders.splice(r, 1);
          } };
        }
        attachToDom(e, r, t) {
          this._element = e, this._mouseService = r, this._renderService = t, this.register((0, n.addDisposableDomListener)(this._element, "mouseleave", () => {
            this._isMouseOut = !0, this._clearCurrentLink();
          })), this.register((0, n.addDisposableDomListener)(this._element, "mousemove", this._handleMouseMove.bind(this))), this.register((0, n.addDisposableDomListener)(this._element, "mousedown", this._handleMouseDown.bind(this))), this.register((0, n.addDisposableDomListener)(this._element, "mouseup", this._handleMouseUp.bind(this)));
        }
        _handleMouseMove(e) {
          if (this._lastMouseEvent = e, !this._element || !this._mouseService) return;
          const r = this._positionFromMouseEvent(e, this._element, this._mouseService);
          if (!r) return;
          this._isMouseOut = !1;
          const t = e.composedPath();
          for (let i = 0; i < t.length; i++) {
            const a = t[i];
            if (a.classList.contains("xterm")) break;
            if (a.classList.contains("xterm-hover")) return;
          }
          this._lastBufferCell && r.x === this._lastBufferCell.x && r.y === this._lastBufferCell.y || (this._handleHover(r), this._lastBufferCell = r);
        }
        _handleHover(e) {
          if (this._activeLine !== e.y || this._wasResized) return this._clearCurrentLink(), this._askForLink(e, !1), void (this._wasResized = !1);
          this._currentLink && this._linkAtPosition(this._currentLink.link, e) || (this._clearCurrentLink(), this._askForLink(e, !0));
        }
        _askForLink(e, r) {
          var t, i;
          this._activeProviderReplies && r || ((t = this._activeProviderReplies) === null || t === void 0 || t.forEach((c) => {
            c == null || c.forEach((v) => {
              v.link.dispose && v.link.dispose();
            });
          }), this._activeProviderReplies = /* @__PURE__ */ new Map(), this._activeLine = e.y);
          let a = !1;
          for (const [c, v] of this._linkProviders.entries()) r ? !((i = this._activeProviderReplies) === null || i === void 0) && i.get(c) && (a = this._checkLinkProviderResult(c, e, a)) : v.provideLinks(e.y, (m) => {
            var h, g;
            if (this._isMouseOut) return;
            const E = m == null ? void 0 : m.map((S) => ({ link: S }));
            (h = this._activeProviderReplies) === null || h === void 0 || h.set(c, E), a = this._checkLinkProviderResult(c, e, a), ((g = this._activeProviderReplies) === null || g === void 0 ? void 0 : g.size) === this._linkProviders.length && this._removeIntersectingLinks(e.y, this._activeProviderReplies);
          });
        }
        _removeIntersectingLinks(e, r) {
          const t = /* @__PURE__ */ new Set();
          for (let i = 0; i < r.size; i++) {
            const a = r.get(i);
            if (a) for (let c = 0; c < a.length; c++) {
              const v = a[c], m = v.link.range.start.y < e ? 0 : v.link.range.start.x, h = v.link.range.end.y > e ? this._bufferService.cols : v.link.range.end.x;
              for (let g = m; g <= h; g++) {
                if (t.has(g)) {
                  a.splice(c--, 1);
                  break;
                }
                t.add(g);
              }
            }
          }
        }
        _checkLinkProviderResult(e, r, t) {
          var i;
          if (!this._activeProviderReplies) return t;
          const a = this._activeProviderReplies.get(e);
          let c = !1;
          for (let v = 0; v < e; v++) this._activeProviderReplies.has(v) && !this._activeProviderReplies.get(v) || (c = !0);
          if (!c && a) {
            const v = a.find((m) => this._linkAtPosition(m.link, r));
            v && (t = !0, this._handleNewLink(v));
          }
          if (this._activeProviderReplies.size === this._linkProviders.length && !t) for (let v = 0; v < this._activeProviderReplies.size; v++) {
            const m = (i = this._activeProviderReplies.get(v)) === null || i === void 0 ? void 0 : i.find((h) => this._linkAtPosition(h.link, r));
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
          const r = this._positionFromMouseEvent(e, this._element, this._mouseService);
          r && this._mouseDownLink === this._currentLink && this._linkAtPosition(this._currentLink.link, r) && this._currentLink.link.activate(e, this._currentLink.link.text);
        }
        _clearCurrentLink(e, r) {
          this._element && this._currentLink && this._lastMouseEvent && (!e || !r || this._currentLink.link.range.start.y >= e && this._currentLink.link.range.end.y <= r) && (this._linkLeave(this._element, this._currentLink.link, this._lastMouseEvent), this._currentLink = void 0, (0, f.disposeArray)(this._linkCacheDisposables));
        }
        _handleNewLink(e) {
          if (!this._element || !this._lastMouseEvent || !this._mouseService) return;
          const r = this._positionFromMouseEvent(this._lastMouseEvent, this._element, this._mouseService);
          r && this._linkAtPosition(e.link, r) && (this._currentLink = e, this._currentLink.state = { decorations: { underline: e.link.decorations === void 0 || e.link.decorations.underline, pointerCursor: e.link.decorations === void 0 || e.link.decorations.pointerCursor }, isHovered: !0 }, this._linkHover(this._element, e.link, this._lastMouseEvent), e.link.decorations = {}, Object.defineProperties(e.link.decorations, { pointerCursor: { get: () => {
            var t, i;
            return (i = (t = this._currentLink) === null || t === void 0 ? void 0 : t.state) === null || i === void 0 ? void 0 : i.decorations.pointerCursor;
          }, set: (t) => {
            var i, a;
            !((i = this._currentLink) === null || i === void 0) && i.state && this._currentLink.state.decorations.pointerCursor !== t && (this._currentLink.state.decorations.pointerCursor = t, this._currentLink.state.isHovered && ((a = this._element) === null || a === void 0 || a.classList.toggle("xterm-cursor-pointer", t)));
          } }, underline: { get: () => {
            var t, i;
            return (i = (t = this._currentLink) === null || t === void 0 ? void 0 : t.state) === null || i === void 0 ? void 0 : i.decorations.underline;
          }, set: (t) => {
            var i, a, c;
            !((i = this._currentLink) === null || i === void 0) && i.state && ((c = (a = this._currentLink) === null || a === void 0 ? void 0 : a.state) === null || c === void 0 ? void 0 : c.decorations.underline) !== t && (this._currentLink.state.decorations.underline = t, this._currentLink.state.isHovered && this._fireUnderlineEvent(e.link, t));
          } } }), this._renderService && this._linkCacheDisposables.push(this._renderService.onRenderedViewportChange((t) => {
            if (!this._currentLink) return;
            const i = t.start === 0 ? 0 : t.start + 1 + this._bufferService.buffer.ydisp, a = this._bufferService.buffer.ydisp + 1 + t.end;
            if (this._currentLink.link.range.start.y >= i && this._currentLink.link.range.end.y <= a && (this._clearCurrentLink(i, a), this._lastMouseEvent && this._element)) {
              const c = this._positionFromMouseEvent(this._lastMouseEvent, this._element, this._mouseService);
              c && this._askForLink(c, !1);
            }
          })));
        }
        _linkHover(e, r, t) {
          var i;
          !((i = this._currentLink) === null || i === void 0) && i.state && (this._currentLink.state.isHovered = !0, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(r, !0), this._currentLink.state.decorations.pointerCursor && e.classList.add("xterm-cursor-pointer")), r.hover && r.hover(t, r.text);
        }
        _fireUnderlineEvent(e, r) {
          const t = e.range, i = this._bufferService.buffer.ydisp, a = this._createLinkUnderlineEvent(t.start.x - 1, t.start.y - i - 1, t.end.x, t.end.y - i - 1, void 0);
          (r ? this._onShowLinkUnderline : this._onHideLinkUnderline).fire(a);
        }
        _linkLeave(e, r, t) {
          var i;
          !((i = this._currentLink) === null || i === void 0) && i.state && (this._currentLink.state.isHovered = !1, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(r, !1), this._currentLink.state.decorations.pointerCursor && e.classList.remove("xterm-cursor-pointer")), r.leave && r.leave(t, r.text);
        }
        _linkAtPosition(e, r) {
          const t = e.range.start.y * this._bufferService.cols + e.range.start.x, i = e.range.end.y * this._bufferService.cols + e.range.end.x, a = r.y * this._bufferService.cols + r.x;
          return t <= a && a <= i;
        }
        _positionFromMouseEvent(e, r, t) {
          const i = t.getCoords(e, r, this._bufferService.cols, this._bufferService.rows);
          if (i) return { x: i[0], y: i[1] + this._bufferService.buffer.ydisp };
        }
        _createLinkUnderlineEvent(e, r, t, i, a) {
          return { x1: e, y1: r, x2: t, y2: i, cols: this._bufferService.cols, fg: a };
        }
      };
      s.Linkifier2 = u = l([_(0, p.IBufferService)], u);
    }, 9042: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.tooMuchOutput = s.promptLabel = void 0, s.promptLabel = "Terminal input", s.tooMuchOutput = "Too much output to announce, navigate to rows manually to read";
    }, 3730: function(M, s, o) {
      var l = this && this.__decorate || function(u, e, r, t) {
        var i, a = arguments.length, c = a < 3 ? e : t === null ? t = Object.getOwnPropertyDescriptor(e, r) : t;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") c = Reflect.decorate(u, e, r, t);
        else for (var v = u.length - 1; v >= 0; v--) (i = u[v]) && (c = (a < 3 ? i(c) : a > 3 ? i(e, r, c) : i(e, r)) || c);
        return a > 3 && c && Object.defineProperty(e, r, c), c;
      }, _ = this && this.__param || function(u, e) {
        return function(r, t) {
          e(r, t, u);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OscLinkProvider = void 0;
      const n = o(511), d = o(2585);
      let f = s.OscLinkProvider = class {
        constructor(u, e, r) {
          this._bufferService = u, this._optionsService = e, this._oscLinkService = r;
        }
        provideLinks(u, e) {
          var r;
          const t = this._bufferService.buffer.lines.get(u - 1);
          if (!t) return void e(void 0);
          const i = [], a = this._optionsService.rawOptions.linkHandler, c = new n.CellData(), v = t.getTrimmedLength();
          let m = -1, h = -1, g = !1;
          for (let E = 0; E < v; E++) if (h !== -1 || t.hasContent(E)) {
            if (t.loadCell(E, c), c.hasExtendedAttrs() && c.extended.urlId) {
              if (h === -1) {
                h = E, m = c.extended.urlId;
                continue;
              }
              g = c.extended.urlId !== m;
            } else h !== -1 && (g = !0);
            if (g || h !== -1 && E === v - 1) {
              const S = (r = this._oscLinkService.getLinkData(m)) === null || r === void 0 ? void 0 : r.uri;
              if (S) {
                const y = { start: { x: h + 1, y: u }, end: { x: E + (g || E !== v - 1 ? 0 : 1), y: u } };
                let w = !1;
                if (!(a != null && a.allowNonHttpProtocols)) try {
                  const R = new URL(S);
                  ["http:", "https:"].includes(R.protocol) || (w = !0);
                } catch {
                  w = !0;
                }
                w || i.push({ text: S, range: y, activate: (R, A) => a ? a.activate(R, A, y) : p(0, A), hover: (R, A) => {
                  var O;
                  return (O = a == null ? void 0 : a.hover) === null || O === void 0 ? void 0 : O.call(a, R, A, y);
                }, leave: (R, A) => {
                  var O;
                  return (O = a == null ? void 0 : a.leave) === null || O === void 0 ? void 0 : O.call(a, R, A, y);
                } });
              }
              g = !1, c.hasExtendedAttrs() && c.extended.urlId ? (h = E, m = c.extended.urlId) : (h = -1, m = -1);
            }
          }
          e(i);
        }
      };
      function p(u, e) {
        if (confirm(`Do you want to navigate to ${e}?

WARNING: This link could potentially be dangerous`)) {
          const r = window.open();
          if (r) {
            try {
              r.opener = null;
            } catch {
            }
            r.location.href = e;
          } else console.warn("Opening link blocked as opener could not be cleared");
        }
      }
      s.OscLinkProvider = f = l([_(0, d.IBufferService), _(1, d.IOptionsService), _(2, d.IOscLinkService)], f);
    }, 6193: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.RenderDebouncer = void 0, s.RenderDebouncer = class {
        constructor(o, l) {
          this._parentWindow = o, this._renderCallback = l, this._refreshCallbacks = [];
        }
        dispose() {
          this._animationFrame && (this._parentWindow.cancelAnimationFrame(this._animationFrame), this._animationFrame = void 0);
        }
        addRefreshCallback(o) {
          return this._refreshCallbacks.push(o), this._animationFrame || (this._animationFrame = this._parentWindow.requestAnimationFrame(() => this._innerRefresh())), this._animationFrame;
        }
        refresh(o, l, _) {
          this._rowCount = _, o = o !== void 0 ? o : 0, l = l !== void 0 ? l : this._rowCount - 1, this._rowStart = this._rowStart !== void 0 ? Math.min(this._rowStart, o) : o, this._rowEnd = this._rowEnd !== void 0 ? Math.max(this._rowEnd, l) : l, this._animationFrame || (this._animationFrame = this._parentWindow.requestAnimationFrame(() => this._innerRefresh()));
        }
        _innerRefresh() {
          if (this._animationFrame = void 0, this._rowStart === void 0 || this._rowEnd === void 0 || this._rowCount === void 0) return void this._runRefreshCallbacks();
          const o = Math.max(this._rowStart, 0), l = Math.min(this._rowEnd, this._rowCount - 1);
          this._rowStart = void 0, this._rowEnd = void 0, this._renderCallback(o, l), this._runRefreshCallbacks();
        }
        _runRefreshCallbacks() {
          for (const o of this._refreshCallbacks) o(0);
          this._refreshCallbacks = [];
        }
      };
    }, 5596: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ScreenDprMonitor = void 0;
      const l = o(844);
      class _ extends l.Disposable {
        constructor(d) {
          super(), this._parentWindow = d, this._currentDevicePixelRatio = this._parentWindow.devicePixelRatio, this.register((0, l.toDisposable)(() => {
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
    }, 3236: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Terminal = void 0;
      const l = o(3614), _ = o(3656), n = o(6465), d = o(9042), f = o(3730), p = o(1680), u = o(3107), e = o(5744), r = o(2950), t = o(1296), i = o(428), a = o(4269), c = o(5114), v = o(8934), m = o(3230), h = o(9312), g = o(4725), E = o(6731), S = o(8055), y = o(8969), w = o(8460), R = o(844), A = o(6114), O = o(8437), I = o(2584), C = o(7399), x = o(5941), k = o(9074), L = o(2585), H = o(5435), N = o(4567), $ = typeof window < "u" ? window.document : null;
      class j extends y.CoreTerminal {
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
        constructor(b = {}) {
          super(b), this.browser = A, this._keyDownHandled = !1, this._keyDownSeen = !1, this._keyPressHandled = !1, this._unprocessedDeadKey = !1, this._accessibilityManager = this.register(new R.MutableDisposable()), this._onCursorMove = this.register(new w.EventEmitter()), this.onCursorMove = this._onCursorMove.event, this._onKey = this.register(new w.EventEmitter()), this.onKey = this._onKey.event, this._onRender = this.register(new w.EventEmitter()), this.onRender = this._onRender.event, this._onSelectionChange = this.register(new w.EventEmitter()), this.onSelectionChange = this._onSelectionChange.event, this._onTitleChange = this.register(new w.EventEmitter()), this.onTitleChange = this._onTitleChange.event, this._onBell = this.register(new w.EventEmitter()), this.onBell = this._onBell.event, this._onFocus = this.register(new w.EventEmitter()), this._onBlur = this.register(new w.EventEmitter()), this._onA11yCharEmitter = this.register(new w.EventEmitter()), this._onA11yTabEmitter = this.register(new w.EventEmitter()), this._onWillOpen = this.register(new w.EventEmitter()), this._setup(), this.linkifier2 = this.register(this._instantiationService.createInstance(n.Linkifier2)), this.linkifier2.registerLinkProvider(this._instantiationService.createInstance(f.OscLinkProvider)), this._decorationService = this._instantiationService.createInstance(k.DecorationService), this._instantiationService.setService(L.IDecorationService, this._decorationService), this.register(this._inputHandler.onRequestBell(() => this._onBell.fire())), this.register(this._inputHandler.onRequestRefreshRows((D, T) => this.refresh(D, T))), this.register(this._inputHandler.onRequestSendFocus(() => this._reportFocus())), this.register(this._inputHandler.onRequestReset(() => this.reset())), this.register(this._inputHandler.onRequestWindowsOptionsReport((D) => this._reportWindowsOptions(D))), this.register(this._inputHandler.onColor((D) => this._handleColorEvent(D))), this.register((0, w.forwardEvent)(this._inputHandler.onCursorMove, this._onCursorMove)), this.register((0, w.forwardEvent)(this._inputHandler.onTitleChange, this._onTitleChange)), this.register((0, w.forwardEvent)(this._inputHandler.onA11yChar, this._onA11yCharEmitter)), this.register((0, w.forwardEvent)(this._inputHandler.onA11yTab, this._onA11yTabEmitter)), this.register(this._bufferService.onResize((D) => this._afterResize(D.cols, D.rows))), this.register((0, R.toDisposable)(() => {
            var D, T;
            this._customKeyEventHandler = void 0, (T = (D = this.element) === null || D === void 0 ? void 0 : D.parentNode) === null || T === void 0 || T.removeChild(this.element);
          }));
        }
        _handleColorEvent(b) {
          if (this._themeService) for (const D of b) {
            let T, B = "";
            switch (D.index) {
              case 256:
                T = "foreground", B = "10";
                break;
              case 257:
                T = "background", B = "11";
                break;
              case 258:
                T = "cursor", B = "12";
                break;
              default:
                T = "ansi", B = "4;" + D.index;
            }
            switch (D.type) {
              case 0:
                const V = S.color.toColorRGB(T === "ansi" ? this._themeService.colors.ansi[D.index] : this._themeService.colors[T]);
                this.coreService.triggerDataEvent(`${I.C0.ESC}]${B};${(0, x.toRgbString)(V)}${I.C1_ESCAPED.ST}`);
                break;
              case 1:
                if (T === "ansi") this._themeService.modifyColors((W) => W.ansi[D.index] = S.rgba.toColor(...D.color));
                else {
                  const W = T;
                  this._themeService.modifyColors((Z) => Z[W] = S.rgba.toColor(...D.color));
                }
                break;
              case 2:
                this._themeService.restoreColor(D.index);
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
        _handleScreenReaderModeOptionChange(b) {
          b ? !this._accessibilityManager.value && this._renderService && (this._accessibilityManager.value = this._instantiationService.createInstance(N.AccessibilityManager, this)) : this._accessibilityManager.clear();
        }
        _handleTextAreaFocus(b) {
          this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(I.C0.ESC + "[I"), this.updateCursorStyle(b), this.element.classList.add("focus"), this._showCursor(), this._onFocus.fire();
        }
        blur() {
          var b;
          return (b = this.textarea) === null || b === void 0 ? void 0 : b.blur();
        }
        _handleTextAreaBlur() {
          this.textarea.value = "", this.refresh(this.buffer.y, this.buffer.y), this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(I.C0.ESC + "[O"), this.element.classList.remove("focus"), this._onBlur.fire();
        }
        _syncTextArea() {
          if (!this.textarea || !this.buffer.isCursorInViewport || this._compositionHelper.isComposing || !this._renderService) return;
          const b = this.buffer.ybase + this.buffer.y, D = this.buffer.lines.get(b);
          if (!D) return;
          const T = Math.min(this.buffer.x, this.cols - 1), B = this._renderService.dimensions.css.cell.height, V = D.getWidth(T), W = this._renderService.dimensions.css.cell.width * V, Z = this.buffer.y * this._renderService.dimensions.css.cell.height, ie = T * this._renderService.dimensions.css.cell.width;
          this.textarea.style.left = ie + "px", this.textarea.style.top = Z + "px", this.textarea.style.width = W + "px", this.textarea.style.height = B + "px", this.textarea.style.lineHeight = B + "px", this.textarea.style.zIndex = "-5";
        }
        _initGlobal() {
          this._bindKeys(), this.register((0, _.addDisposableDomListener)(this.element, "copy", (D) => {
            this.hasSelection() && (0, l.copyHandler)(D, this._selectionService);
          }));
          const b = (D) => (0, l.handlePasteEvent)(D, this.textarea, this.coreService, this.optionsService);
          this.register((0, _.addDisposableDomListener)(this.textarea, "paste", b)), this.register((0, _.addDisposableDomListener)(this.element, "paste", b)), A.isFirefox ? this.register((0, _.addDisposableDomListener)(this.element, "mousedown", (D) => {
            D.button === 2 && (0, l.rightClickHandler)(D, this.textarea, this.screenElement, this._selectionService, this.options.rightClickSelectsWord);
          })) : this.register((0, _.addDisposableDomListener)(this.element, "contextmenu", (D) => {
            (0, l.rightClickHandler)(D, this.textarea, this.screenElement, this._selectionService, this.options.rightClickSelectsWord);
          })), A.isLinux && this.register((0, _.addDisposableDomListener)(this.element, "auxclick", (D) => {
            D.button === 1 && (0, l.moveTextAreaUnderMouseCursor)(D, this.textarea, this.screenElement);
          }));
        }
        _bindKeys() {
          this.register((0, _.addDisposableDomListener)(this.textarea, "keyup", (b) => this._keyUp(b), !0)), this.register((0, _.addDisposableDomListener)(this.textarea, "keydown", (b) => this._keyDown(b), !0)), this.register((0, _.addDisposableDomListener)(this.textarea, "keypress", (b) => this._keyPress(b), !0)), this.register((0, _.addDisposableDomListener)(this.textarea, "compositionstart", () => this._compositionHelper.compositionstart())), this.register((0, _.addDisposableDomListener)(this.textarea, "compositionupdate", (b) => this._compositionHelper.compositionupdate(b))), this.register((0, _.addDisposableDomListener)(this.textarea, "compositionend", () => this._compositionHelper.compositionend())), this.register((0, _.addDisposableDomListener)(this.textarea, "input", (b) => this._inputEvent(b), !0)), this.register(this.onRender(() => this._compositionHelper.updateCompositionElements()));
        }
        open(b) {
          var D;
          if (!b) throw new Error("Terminal requires a parent element.");
          b.isConnected || this._logService.debug("Terminal.open was called on an element that was not attached to the DOM"), this._document = b.ownerDocument, this.element = this._document.createElement("div"), this.element.dir = "ltr", this.element.classList.add("terminal"), this.element.classList.add("xterm"), b.appendChild(this.element);
          const T = $.createDocumentFragment();
          this._viewportElement = $.createElement("div"), this._viewportElement.classList.add("xterm-viewport"), T.appendChild(this._viewportElement), this._viewportScrollArea = $.createElement("div"), this._viewportScrollArea.classList.add("xterm-scroll-area"), this._viewportElement.appendChild(this._viewportScrollArea), this.screenElement = $.createElement("div"), this.screenElement.classList.add("xterm-screen"), this._helperContainer = $.createElement("div"), this._helperContainer.classList.add("xterm-helpers"), this.screenElement.appendChild(this._helperContainer), T.appendChild(this.screenElement), this.textarea = $.createElement("textarea"), this.textarea.classList.add("xterm-helper-textarea"), this.textarea.setAttribute("aria-label", d.promptLabel), A.isChromeOS || this.textarea.setAttribute("aria-multiline", "false"), this.textarea.setAttribute("autocorrect", "off"), this.textarea.setAttribute("autocapitalize", "off"), this.textarea.setAttribute("spellcheck", "false"), this.textarea.tabIndex = 0, this._coreBrowserService = this._instantiationService.createInstance(c.CoreBrowserService, this.textarea, (D = this._document.defaultView) !== null && D !== void 0 ? D : window), this._instantiationService.setService(g.ICoreBrowserService, this._coreBrowserService), this.register((0, _.addDisposableDomListener)(this.textarea, "focus", (B) => this._handleTextAreaFocus(B))), this.register((0, _.addDisposableDomListener)(this.textarea, "blur", () => this._handleTextAreaBlur())), this._helperContainer.appendChild(this.textarea), this._charSizeService = this._instantiationService.createInstance(i.CharSizeService, this._document, this._helperContainer), this._instantiationService.setService(g.ICharSizeService, this._charSizeService), this._themeService = this._instantiationService.createInstance(E.ThemeService), this._instantiationService.setService(g.IThemeService, this._themeService), this._characterJoinerService = this._instantiationService.createInstance(a.CharacterJoinerService), this._instantiationService.setService(g.ICharacterJoinerService, this._characterJoinerService), this._renderService = this.register(this._instantiationService.createInstance(m.RenderService, this.rows, this.screenElement)), this._instantiationService.setService(g.IRenderService, this._renderService), this.register(this._renderService.onRenderedViewportChange((B) => this._onRender.fire(B))), this.onResize((B) => this._renderService.resize(B.cols, B.rows)), this._compositionView = $.createElement("div"), this._compositionView.classList.add("composition-view"), this._compositionHelper = this._instantiationService.createInstance(r.CompositionHelper, this.textarea, this._compositionView), this._helperContainer.appendChild(this._compositionView), this.element.appendChild(T);
          try {
            this._onWillOpen.fire(this.element);
          } catch {
          }
          this._renderService.hasRenderer() || this._renderService.setRenderer(this._createRenderer()), this._mouseService = this._instantiationService.createInstance(v.MouseService), this._instantiationService.setService(g.IMouseService, this._mouseService), this.viewport = this._instantiationService.createInstance(p.Viewport, this._viewportElement, this._viewportScrollArea), this.viewport.onRequestScrollLines((B) => this.scrollLines(B.amount, B.suppressScrollEvent, 1)), this.register(this._inputHandler.onRequestSyncScrollBar(() => this.viewport.syncScrollArea())), this.register(this.viewport), this.register(this.onCursorMove(() => {
            this._renderService.handleCursorMove(), this._syncTextArea();
          })), this.register(this.onResize(() => this._renderService.handleResize(this.cols, this.rows))), this.register(this.onBlur(() => this._renderService.handleBlur())), this.register(this.onFocus(() => this._renderService.handleFocus())), this.register(this._renderService.onDimensionsChange(() => this.viewport.syncScrollArea())), this._selectionService = this.register(this._instantiationService.createInstance(h.SelectionService, this.element, this.screenElement, this.linkifier2)), this._instantiationService.setService(g.ISelectionService, this._selectionService), this.register(this._selectionService.onRequestScrollLines((B) => this.scrollLines(B.amount, B.suppressScrollEvent))), this.register(this._selectionService.onSelectionChange(() => this._onSelectionChange.fire())), this.register(this._selectionService.onRequestRedraw((B) => this._renderService.handleSelectionChanged(B.start, B.end, B.columnSelectMode))), this.register(this._selectionService.onLinuxMouseSelection((B) => {
            this.textarea.value = B, this.textarea.focus(), this.textarea.select();
          })), this.register(this._onScroll.event((B) => {
            this.viewport.syncScrollArea(), this._selectionService.refresh();
          })), this.register((0, _.addDisposableDomListener)(this._viewportElement, "scroll", () => this._selectionService.refresh())), this.linkifier2.attachToDom(this.screenElement, this._mouseService, this._renderService), this.register(this._instantiationService.createInstance(u.BufferDecorationRenderer, this.screenElement)), this.register((0, _.addDisposableDomListener)(this.element, "mousedown", (B) => this._selectionService.handleMouseDown(B))), this.coreMouseService.areMouseEventsActive ? (this._selectionService.disable(), this.element.classList.add("enable-mouse-events")) : this._selectionService.enable(), this.options.screenReaderMode && (this._accessibilityManager.value = this._instantiationService.createInstance(N.AccessibilityManager, this)), this.register(this.optionsService.onSpecificOptionChange("screenReaderMode", (B) => this._handleScreenReaderModeOptionChange(B))), this.options.overviewRulerWidth && (this._overviewRulerRenderer = this.register(this._instantiationService.createInstance(e.OverviewRulerRenderer, this._viewportElement, this.screenElement))), this.optionsService.onSpecificOptionChange("overviewRulerWidth", (B) => {
            !this._overviewRulerRenderer && B && this._viewportElement && this.screenElement && (this._overviewRulerRenderer = this.register(this._instantiationService.createInstance(e.OverviewRulerRenderer, this._viewportElement, this.screenElement)));
          }), this._charSizeService.measure(), this.refresh(0, this.rows - 1), this._initGlobal(), this.bindMouse();
        }
        _createRenderer() {
          return this._instantiationService.createInstance(t.DomRenderer, this.element, this.screenElement, this._viewportElement, this.linkifier2);
        }
        bindMouse() {
          const b = this, D = this.element;
          function T(W) {
            const Z = b._mouseService.getMouseReportCoords(W, b.screenElement);
            if (!Z) return !1;
            let ie, re;
            switch (W.overrideType || W.type) {
              case "mousemove":
                re = 32, W.buttons === void 0 ? (ie = 3, W.button !== void 0 && (ie = W.button < 3 ? W.button : 3)) : ie = 1 & W.buttons ? 0 : 4 & W.buttons ? 1 : 2 & W.buttons ? 2 : 3;
                break;
              case "mouseup":
                re = 0, ie = W.button < 3 ? W.button : 3;
                break;
              case "mousedown":
                re = 1, ie = W.button < 3 ? W.button : 3;
                break;
              case "wheel":
                if (b.viewport.getLinesScrolled(W) === 0) return !1;
                re = W.deltaY < 0 ? 0 : 1, ie = 4;
                break;
              default:
                return !1;
            }
            return !(re === void 0 || ie === void 0 || ie > 4) && b.coreMouseService.triggerMouseEvent({ col: Z.col, row: Z.row, x: Z.x, y: Z.y, button: ie, action: re, ctrl: W.ctrlKey, alt: W.altKey, shift: W.shiftKey });
          }
          const B = { mouseup: null, wheel: null, mousedrag: null, mousemove: null }, V = { mouseup: (W) => (T(W), W.buttons || (this._document.removeEventListener("mouseup", B.mouseup), B.mousedrag && this._document.removeEventListener("mousemove", B.mousedrag)), this.cancel(W)), wheel: (W) => (T(W), this.cancel(W, !0)), mousedrag: (W) => {
            W.buttons && T(W);
          }, mousemove: (W) => {
            W.buttons || T(W);
          } };
          this.register(this.coreMouseService.onProtocolChange((W) => {
            W ? (this.optionsService.rawOptions.logLevel === "debug" && this._logService.debug("Binding to mouse events:", this.coreMouseService.explainEvents(W)), this.element.classList.add("enable-mouse-events"), this._selectionService.disable()) : (this._logService.debug("Unbinding from mouse events."), this.element.classList.remove("enable-mouse-events"), this._selectionService.enable()), 8 & W ? B.mousemove || (D.addEventListener("mousemove", V.mousemove), B.mousemove = V.mousemove) : (D.removeEventListener("mousemove", B.mousemove), B.mousemove = null), 16 & W ? B.wheel || (D.addEventListener("wheel", V.wheel, { passive: !1 }), B.wheel = V.wheel) : (D.removeEventListener("wheel", B.wheel), B.wheel = null), 2 & W ? B.mouseup || (D.addEventListener("mouseup", V.mouseup), B.mouseup = V.mouseup) : (this._document.removeEventListener("mouseup", B.mouseup), D.removeEventListener("mouseup", B.mouseup), B.mouseup = null), 4 & W ? B.mousedrag || (B.mousedrag = V.mousedrag) : (this._document.removeEventListener("mousemove", B.mousedrag), B.mousedrag = null);
          })), this.coreMouseService.activeProtocol = this.coreMouseService.activeProtocol, this.register((0, _.addDisposableDomListener)(D, "mousedown", (W) => {
            if (W.preventDefault(), this.focus(), this.coreMouseService.areMouseEventsActive && !this._selectionService.shouldForceSelection(W)) return T(W), B.mouseup && this._document.addEventListener("mouseup", B.mouseup), B.mousedrag && this._document.addEventListener("mousemove", B.mousedrag), this.cancel(W);
          })), this.register((0, _.addDisposableDomListener)(D, "wheel", (W) => {
            if (!B.wheel) {
              if (!this.buffer.hasScrollback) {
                const Z = this.viewport.getLinesScrolled(W);
                if (Z === 0) return;
                const ie = I.C0.ESC + (this.coreService.decPrivateModes.applicationCursorKeys ? "O" : "[") + (W.deltaY < 0 ? "A" : "B");
                let re = "";
                for (let de = 0; de < Math.abs(Z); de++) re += ie;
                return this.coreService.triggerDataEvent(re, !0), this.cancel(W, !0);
              }
              return this.viewport.handleWheel(W) ? this.cancel(W) : void 0;
            }
          }, { passive: !1 })), this.register((0, _.addDisposableDomListener)(D, "touchstart", (W) => {
            if (!this.coreMouseService.areMouseEventsActive) return this.viewport.handleTouchStart(W), this.cancel(W);
          }, { passive: !0 })), this.register((0, _.addDisposableDomListener)(D, "touchmove", (W) => {
            if (!this.coreMouseService.areMouseEventsActive) return this.viewport.handleTouchMove(W) ? void 0 : this.cancel(W);
          }, { passive: !1 }));
        }
        refresh(b, D) {
          var T;
          (T = this._renderService) === null || T === void 0 || T.refreshRows(b, D);
        }
        updateCursorStyle(b) {
          var D;
          !((D = this._selectionService) === null || D === void 0) && D.shouldColumnSelect(b) ? this.element.classList.add("column-select") : this.element.classList.remove("column-select");
        }
        _showCursor() {
          this.coreService.isCursorInitialized || (this.coreService.isCursorInitialized = !0, this.refresh(this.buffer.y, this.buffer.y));
        }
        scrollLines(b, D, T = 0) {
          var B;
          T === 1 ? (super.scrollLines(b, D, T), this.refresh(0, this.rows - 1)) : (B = this.viewport) === null || B === void 0 || B.scrollLines(b);
        }
        paste(b) {
          (0, l.paste)(b, this.textarea, this.coreService, this.optionsService);
        }
        attachCustomKeyEventHandler(b) {
          this._customKeyEventHandler = b;
        }
        registerLinkProvider(b) {
          return this.linkifier2.registerLinkProvider(b);
        }
        registerCharacterJoiner(b) {
          if (!this._characterJoinerService) throw new Error("Terminal must be opened first");
          const D = this._characterJoinerService.register(b);
          return this.refresh(0, this.rows - 1), D;
        }
        deregisterCharacterJoiner(b) {
          if (!this._characterJoinerService) throw new Error("Terminal must be opened first");
          this._characterJoinerService.deregister(b) && this.refresh(0, this.rows - 1);
        }
        get markers() {
          return this.buffer.markers;
        }
        registerMarker(b) {
          return this.buffer.addMarker(this.buffer.ybase + this.buffer.y + b);
        }
        registerDecoration(b) {
          return this._decorationService.registerDecoration(b);
        }
        hasSelection() {
          return !!this._selectionService && this._selectionService.hasSelection;
        }
        select(b, D, T) {
          this._selectionService.setSelection(b, D, T);
        }
        getSelection() {
          return this._selectionService ? this._selectionService.selectionText : "";
        }
        getSelectionPosition() {
          if (this._selectionService && this._selectionService.hasSelection) return { start: { x: this._selectionService.selectionStart[0], y: this._selectionService.selectionStart[1] }, end: { x: this._selectionService.selectionEnd[0], y: this._selectionService.selectionEnd[1] } };
        }
        clearSelection() {
          var b;
          (b = this._selectionService) === null || b === void 0 || b.clearSelection();
        }
        selectAll() {
          var b;
          (b = this._selectionService) === null || b === void 0 || b.selectAll();
        }
        selectLines(b, D) {
          var T;
          (T = this._selectionService) === null || T === void 0 || T.selectLines(b, D);
        }
        _keyDown(b) {
          if (this._keyDownHandled = !1, this._keyDownSeen = !0, this._customKeyEventHandler && this._customKeyEventHandler(b) === !1) return !1;
          const D = this.browser.isMac && this.options.macOptionIsMeta && b.altKey;
          if (!D && !this._compositionHelper.keydown(b)) return this.options.scrollOnUserInput && this.buffer.ybase !== this.buffer.ydisp && this.scrollToBottom(), !1;
          D || b.key !== "Dead" && b.key !== "AltGraph" || (this._unprocessedDeadKey = !0);
          const T = (0, C.evaluateKeyboardEvent)(b, this.coreService.decPrivateModes.applicationCursorKeys, this.browser.isMac, this.options.macOptionIsMeta);
          if (this.updateCursorStyle(b), T.type === 3 || T.type === 2) {
            const B = this.rows - 1;
            return this.scrollLines(T.type === 2 ? -B : B), this.cancel(b, !0);
          }
          return T.type === 1 && this.selectAll(), !!this._isThirdLevelShift(this.browser, b) || (T.cancel && this.cancel(b, !0), !T.key || !!(b.key && !b.ctrlKey && !b.altKey && !b.metaKey && b.key.length === 1 && b.key.charCodeAt(0) >= 65 && b.key.charCodeAt(0) <= 90) || (this._unprocessedDeadKey ? (this._unprocessedDeadKey = !1, !0) : (T.key !== I.C0.ETX && T.key !== I.C0.CR || (this.textarea.value = ""), this._onKey.fire({ key: T.key, domEvent: b }), this._showCursor(), this.coreService.triggerDataEvent(T.key, !0), !this.optionsService.rawOptions.screenReaderMode || b.altKey || b.ctrlKey ? this.cancel(b, !0) : void (this._keyDownHandled = !0))));
        }
        _isThirdLevelShift(b, D) {
          const T = b.isMac && !this.options.macOptionIsMeta && D.altKey && !D.ctrlKey && !D.metaKey || b.isWindows && D.altKey && D.ctrlKey && !D.metaKey || b.isWindows && D.getModifierState("AltGraph");
          return D.type === "keypress" ? T : T && (!D.keyCode || D.keyCode > 47);
        }
        _keyUp(b) {
          this._keyDownSeen = !1, this._customKeyEventHandler && this._customKeyEventHandler(b) === !1 || (function(D) {
            return D.keyCode === 16 || D.keyCode === 17 || D.keyCode === 18;
          }(b) || this.focus(), this.updateCursorStyle(b), this._keyPressHandled = !1);
        }
        _keyPress(b) {
          let D;
          if (this._keyPressHandled = !1, this._keyDownHandled || this._customKeyEventHandler && this._customKeyEventHandler(b) === !1) return !1;
          if (this.cancel(b), b.charCode) D = b.charCode;
          else if (b.which === null || b.which === void 0) D = b.keyCode;
          else {
            if (b.which === 0 || b.charCode === 0) return !1;
            D = b.which;
          }
          return !(!D || (b.altKey || b.ctrlKey || b.metaKey) && !this._isThirdLevelShift(this.browser, b) || (D = String.fromCharCode(D), this._onKey.fire({ key: D, domEvent: b }), this._showCursor(), this.coreService.triggerDataEvent(D, !0), this._keyPressHandled = !0, this._unprocessedDeadKey = !1, 0));
        }
        _inputEvent(b) {
          if (b.data && b.inputType === "insertText" && (!b.composed || !this._keyDownSeen) && !this.optionsService.rawOptions.screenReaderMode) {
            if (this._keyPressHandled) return !1;
            this._unprocessedDeadKey = !1;
            const D = b.data;
            return this.coreService.triggerDataEvent(D, !0), this.cancel(b), !0;
          }
          return !1;
        }
        resize(b, D) {
          b !== this.cols || D !== this.rows ? super.resize(b, D) : this._charSizeService && !this._charSizeService.hasValidSize && this._charSizeService.measure();
        }
        _afterResize(b, D) {
          var T, B;
          (T = this._charSizeService) === null || T === void 0 || T.measure(), (B = this.viewport) === null || B === void 0 || B.syncScrollArea(!0);
        }
        clear() {
          var b;
          if (this.buffer.ybase !== 0 || this.buffer.y !== 0) {
            this.buffer.clearAllMarkers(), this.buffer.lines.set(0, this.buffer.lines.get(this.buffer.ybase + this.buffer.y)), this.buffer.lines.length = 1, this.buffer.ydisp = 0, this.buffer.ybase = 0, this.buffer.y = 0;
            for (let D = 1; D < this.rows; D++) this.buffer.lines.push(this.buffer.getBlankLine(O.DEFAULT_ATTR_DATA));
            this._onScroll.fire({ position: this.buffer.ydisp, source: 0 }), (b = this.viewport) === null || b === void 0 || b.reset(), this.refresh(0, this.rows - 1);
          }
        }
        reset() {
          var b, D;
          this.options.rows = this.rows, this.options.cols = this.cols;
          const T = this._customKeyEventHandler;
          this._setup(), super.reset(), (b = this._selectionService) === null || b === void 0 || b.reset(), this._decorationService.reset(), (D = this.viewport) === null || D === void 0 || D.reset(), this._customKeyEventHandler = T, this.refresh(0, this.rows - 1);
        }
        clearTextureAtlas() {
          var b;
          (b = this._renderService) === null || b === void 0 || b.clearTextureAtlas();
        }
        _reportFocus() {
          var b;
          !((b = this.element) === null || b === void 0) && b.classList.contains("focus") ? this.coreService.triggerDataEvent(I.C0.ESC + "[I") : this.coreService.triggerDataEvent(I.C0.ESC + "[O");
        }
        _reportWindowsOptions(b) {
          if (this._renderService) switch (b) {
            case H.WindowsOptionsReportType.GET_WIN_SIZE_PIXELS:
              const D = this._renderService.dimensions.css.canvas.width.toFixed(0), T = this._renderService.dimensions.css.canvas.height.toFixed(0);
              this.coreService.triggerDataEvent(`${I.C0.ESC}[4;${T};${D}t`);
              break;
            case H.WindowsOptionsReportType.GET_CELL_SIZE_PIXELS:
              const B = this._renderService.dimensions.css.cell.width.toFixed(0), V = this._renderService.dimensions.css.cell.height.toFixed(0);
              this.coreService.triggerDataEvent(`${I.C0.ESC}[6;${V};${B}t`);
          }
        }
        cancel(b, D) {
          if (this.options.cancelEvents || D) return b.preventDefault(), b.stopPropagation(), !1;
        }
      }
      s.Terminal = j;
    }, 9924: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.TimeBasedDebouncer = void 0, s.TimeBasedDebouncer = class {
        constructor(o, l = 1e3) {
          this._renderCallback = o, this._debounceThresholdMS = l, this._lastRefreshMs = 0, this._additionalRefreshRequested = !1;
        }
        dispose() {
          this._refreshTimeoutID && clearTimeout(this._refreshTimeoutID);
        }
        refresh(o, l, _) {
          this._rowCount = _, o = o !== void 0 ? o : 0, l = l !== void 0 ? l : this._rowCount - 1, this._rowStart = this._rowStart !== void 0 ? Math.min(this._rowStart, o) : o, this._rowEnd = this._rowEnd !== void 0 ? Math.max(this._rowEnd, l) : l;
          const n = Date.now();
          if (n - this._lastRefreshMs >= this._debounceThresholdMS) this._lastRefreshMs = n, this._innerRefresh();
          else if (!this._additionalRefreshRequested) {
            const d = n - this._lastRefreshMs, f = this._debounceThresholdMS - d;
            this._additionalRefreshRequested = !0, this._refreshTimeoutID = window.setTimeout(() => {
              this._lastRefreshMs = Date.now(), this._innerRefresh(), this._additionalRefreshRequested = !1, this._refreshTimeoutID = void 0;
            }, f);
          }
        }
        _innerRefresh() {
          if (this._rowStart === void 0 || this._rowEnd === void 0 || this._rowCount === void 0) return;
          const o = Math.max(this._rowStart, 0), l = Math.min(this._rowEnd, this._rowCount - 1);
          this._rowStart = void 0, this._rowEnd = void 0, this._renderCallback(o, l);
        }
      };
    }, 1680: function(M, s, o) {
      var l = this && this.__decorate || function(r, t, i, a) {
        var c, v = arguments.length, m = v < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, i) : a;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") m = Reflect.decorate(r, t, i, a);
        else for (var h = r.length - 1; h >= 0; h--) (c = r[h]) && (m = (v < 3 ? c(m) : v > 3 ? c(t, i, m) : c(t, i)) || m);
        return v > 3 && m && Object.defineProperty(t, i, m), m;
      }, _ = this && this.__param || function(r, t) {
        return function(i, a) {
          t(i, a, r);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Viewport = void 0;
      const n = o(3656), d = o(4725), f = o(8460), p = o(844), u = o(2585);
      let e = s.Viewport = class extends p.Disposable {
        constructor(r, t, i, a, c, v, m, h) {
          super(), this._viewportElement = r, this._scrollArea = t, this._bufferService = i, this._optionsService = a, this._charSizeService = c, this._renderService = v, this._coreBrowserService = m, this.scrollBarWidth = 0, this._currentRowHeight = 0, this._currentDeviceCellHeight = 0, this._lastRecordedBufferLength = 0, this._lastRecordedViewportHeight = 0, this._lastRecordedBufferHeight = 0, this._lastTouchY = 0, this._lastScrollTop = 0, this._wheelPartialScroll = 0, this._refreshAnimationFrame = null, this._ignoreNextScrollEvent = !1, this._smoothScrollState = { startTime: 0, origin: -1, target: -1 }, this._onRequestScrollLines = this.register(new f.EventEmitter()), this.onRequestScrollLines = this._onRequestScrollLines.event, this.scrollBarWidth = this._viewportElement.offsetWidth - this._scrollArea.offsetWidth || 15, this.register((0, n.addDisposableDomListener)(this._viewportElement, "scroll", this._handleScroll.bind(this))), this._activeBuffer = this._bufferService.buffer, this.register(this._bufferService.buffers.onBufferActivate((g) => this._activeBuffer = g.activeBuffer)), this._renderDimensions = this._renderService.dimensions, this.register(this._renderService.onDimensionsChange((g) => this._renderDimensions = g)), this._handleThemeChange(h.colors), this.register(h.onChangeColors((g) => this._handleThemeChange(g))), this.register(this._optionsService.onSpecificOptionChange("scrollback", () => this.syncScrollArea())), setTimeout(() => this.syncScrollArea());
        }
        _handleThemeChange(r) {
          this._viewportElement.style.backgroundColor = r.background.css;
        }
        reset() {
          this._currentRowHeight = 0, this._currentDeviceCellHeight = 0, this._lastRecordedBufferLength = 0, this._lastRecordedViewportHeight = 0, this._lastRecordedBufferHeight = 0, this._lastTouchY = 0, this._lastScrollTop = 0, this._coreBrowserService.window.requestAnimationFrame(() => this.syncScrollArea());
        }
        _refresh(r) {
          if (r) return this._innerRefresh(), void (this._refreshAnimationFrame !== null && this._coreBrowserService.window.cancelAnimationFrame(this._refreshAnimationFrame));
          this._refreshAnimationFrame === null && (this._refreshAnimationFrame = this._coreBrowserService.window.requestAnimationFrame(() => this._innerRefresh()));
        }
        _innerRefresh() {
          if (this._charSizeService.height > 0) {
            this._currentRowHeight = this._renderService.dimensions.device.cell.height / this._coreBrowserService.dpr, this._currentDeviceCellHeight = this._renderService.dimensions.device.cell.height, this._lastRecordedViewportHeight = this._viewportElement.offsetHeight;
            const t = Math.round(this._currentRowHeight * this._lastRecordedBufferLength) + (this._lastRecordedViewportHeight - this._renderService.dimensions.css.canvas.height);
            this._lastRecordedBufferHeight !== t && (this._lastRecordedBufferHeight = t, this._scrollArea.style.height = this._lastRecordedBufferHeight + "px");
          }
          const r = this._bufferService.buffer.ydisp * this._currentRowHeight;
          this._viewportElement.scrollTop !== r && (this._ignoreNextScrollEvent = !0, this._viewportElement.scrollTop = r), this._refreshAnimationFrame = null;
        }
        syncScrollArea(r = !1) {
          if (this._lastRecordedBufferLength !== this._bufferService.buffer.lines.length) return this._lastRecordedBufferLength = this._bufferService.buffer.lines.length, void this._refresh(r);
          this._lastRecordedViewportHeight === this._renderService.dimensions.css.canvas.height && this._lastScrollTop === this._activeBuffer.ydisp * this._currentRowHeight && this._renderDimensions.device.cell.height === this._currentDeviceCellHeight || this._refresh(r);
        }
        _handleScroll(r) {
          if (this._lastScrollTop = this._viewportElement.scrollTop, !this._viewportElement.offsetParent) return;
          if (this._ignoreNextScrollEvent) return this._ignoreNextScrollEvent = !1, void this._onRequestScrollLines.fire({ amount: 0, suppressScrollEvent: !0 });
          const t = Math.round(this._lastScrollTop / this._currentRowHeight) - this._bufferService.buffer.ydisp;
          this._onRequestScrollLines.fire({ amount: t, suppressScrollEvent: !0 });
        }
        _smoothScroll() {
          if (this._isDisposed || this._smoothScrollState.origin === -1 || this._smoothScrollState.target === -1) return;
          const r = this._smoothScrollPercent();
          this._viewportElement.scrollTop = this._smoothScrollState.origin + Math.round(r * (this._smoothScrollState.target - this._smoothScrollState.origin)), r < 1 ? this._coreBrowserService.window.requestAnimationFrame(() => this._smoothScroll()) : this._clearSmoothScrollState();
        }
        _smoothScrollPercent() {
          return this._optionsService.rawOptions.smoothScrollDuration && this._smoothScrollState.startTime ? Math.max(Math.min((Date.now() - this._smoothScrollState.startTime) / this._optionsService.rawOptions.smoothScrollDuration, 1), 0) : 1;
        }
        _clearSmoothScrollState() {
          this._smoothScrollState.startTime = 0, this._smoothScrollState.origin = -1, this._smoothScrollState.target = -1;
        }
        _bubbleScroll(r, t) {
          const i = this._viewportElement.scrollTop + this._lastRecordedViewportHeight;
          return !(t < 0 && this._viewportElement.scrollTop !== 0 || t > 0 && i < this._lastRecordedBufferHeight) || (r.cancelable && r.preventDefault(), !1);
        }
        handleWheel(r) {
          const t = this._getPixelsScrolled(r);
          return t !== 0 && (this._optionsService.rawOptions.smoothScrollDuration ? (this._smoothScrollState.startTime = Date.now(), this._smoothScrollPercent() < 1 ? (this._smoothScrollState.origin = this._viewportElement.scrollTop, this._smoothScrollState.target === -1 ? this._smoothScrollState.target = this._viewportElement.scrollTop + t : this._smoothScrollState.target += t, this._smoothScrollState.target = Math.max(Math.min(this._smoothScrollState.target, this._viewportElement.scrollHeight), 0), this._smoothScroll()) : this._clearSmoothScrollState()) : this._viewportElement.scrollTop += t, this._bubbleScroll(r, t));
        }
        scrollLines(r) {
          if (r !== 0) if (this._optionsService.rawOptions.smoothScrollDuration) {
            const t = r * this._currentRowHeight;
            this._smoothScrollState.startTime = Date.now(), this._smoothScrollPercent() < 1 ? (this._smoothScrollState.origin = this._viewportElement.scrollTop, this._smoothScrollState.target = this._smoothScrollState.origin + t, this._smoothScrollState.target = Math.max(Math.min(this._smoothScrollState.target, this._viewportElement.scrollHeight), 0), this._smoothScroll()) : this._clearSmoothScrollState();
          } else this._onRequestScrollLines.fire({ amount: r, suppressScrollEvent: !1 });
        }
        _getPixelsScrolled(r) {
          if (r.deltaY === 0 || r.shiftKey) return 0;
          let t = this._applyScrollModifier(r.deltaY, r);
          return r.deltaMode === WheelEvent.DOM_DELTA_LINE ? t *= this._currentRowHeight : r.deltaMode === WheelEvent.DOM_DELTA_PAGE && (t *= this._currentRowHeight * this._bufferService.rows), t;
        }
        getBufferElements(r, t) {
          var i;
          let a, c = "";
          const v = [], m = t ?? this._bufferService.buffer.lines.length, h = this._bufferService.buffer.lines;
          for (let g = r; g < m; g++) {
            const E = h.get(g);
            if (!E) continue;
            const S = (i = h.get(g + 1)) === null || i === void 0 ? void 0 : i.isWrapped;
            if (c += E.translateToString(!S), !S || g === h.length - 1) {
              const y = document.createElement("div");
              y.textContent = c, v.push(y), c.length > 0 && (a = y), c = "";
            }
          }
          return { bufferElements: v, cursorElement: a };
        }
        getLinesScrolled(r) {
          if (r.deltaY === 0 || r.shiftKey) return 0;
          let t = this._applyScrollModifier(r.deltaY, r);
          return r.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? (t /= this._currentRowHeight + 0, this._wheelPartialScroll += t, t = Math.floor(Math.abs(this._wheelPartialScroll)) * (this._wheelPartialScroll > 0 ? 1 : -1), this._wheelPartialScroll %= 1) : r.deltaMode === WheelEvent.DOM_DELTA_PAGE && (t *= this._bufferService.rows), t;
        }
        _applyScrollModifier(r, t) {
          const i = this._optionsService.rawOptions.fastScrollModifier;
          return i === "alt" && t.altKey || i === "ctrl" && t.ctrlKey || i === "shift" && t.shiftKey ? r * this._optionsService.rawOptions.fastScrollSensitivity * this._optionsService.rawOptions.scrollSensitivity : r * this._optionsService.rawOptions.scrollSensitivity;
        }
        handleTouchStart(r) {
          this._lastTouchY = r.touches[0].pageY;
        }
        handleTouchMove(r) {
          const t = this._lastTouchY - r.touches[0].pageY;
          return this._lastTouchY = r.touches[0].pageY, t !== 0 && (this._viewportElement.scrollTop += t, this._bubbleScroll(r, t));
        }
      };
      s.Viewport = e = l([_(2, u.IBufferService), _(3, u.IOptionsService), _(4, d.ICharSizeService), _(5, d.IRenderService), _(6, d.ICoreBrowserService), _(7, d.IThemeService)], e);
    }, 3107: function(M, s, o) {
      var l = this && this.__decorate || function(e, r, t, i) {
        var a, c = arguments.length, v = c < 3 ? r : i === null ? i = Object.getOwnPropertyDescriptor(r, t) : i;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") v = Reflect.decorate(e, r, t, i);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (v = (c < 3 ? a(v) : c > 3 ? a(r, t, v) : a(r, t)) || v);
        return c > 3 && v && Object.defineProperty(r, t, v), v;
      }, _ = this && this.__param || function(e, r) {
        return function(t, i) {
          r(t, i, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferDecorationRenderer = void 0;
      const n = o(3656), d = o(4725), f = o(844), p = o(2585);
      let u = s.BufferDecorationRenderer = class extends f.Disposable {
        constructor(e, r, t, i) {
          super(), this._screenElement = e, this._bufferService = r, this._decorationService = t, this._renderService = i, this._decorationElements = /* @__PURE__ */ new Map(), this._altBufferIsActive = !1, this._dimensionsChanged = !1, this._container = document.createElement("div"), this._container.classList.add("xterm-decoration-container"), this._screenElement.appendChild(this._container), this.register(this._renderService.onRenderedViewportChange(() => this._doRefreshDecorations())), this.register(this._renderService.onDimensionsChange(() => {
            this._dimensionsChanged = !0, this._queueRefresh();
          })), this.register((0, n.addDisposableDomListener)(window, "resize", () => this._queueRefresh())), this.register(this._bufferService.buffers.onBufferActivate(() => {
            this._altBufferIsActive = this._bufferService.buffer === this._bufferService.buffers.alt;
          })), this.register(this._decorationService.onDecorationRegistered(() => this._queueRefresh())), this.register(this._decorationService.onDecorationRemoved((a) => this._removeDecoration(a))), this.register((0, f.toDisposable)(() => {
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
          var r, t;
          const i = document.createElement("div");
          i.classList.add("xterm-decoration"), i.classList.toggle("xterm-decoration-top-layer", ((r = e == null ? void 0 : e.options) === null || r === void 0 ? void 0 : r.layer) === "top"), i.style.width = `${Math.round((e.options.width || 1) * this._renderService.dimensions.css.cell.width)}px`, i.style.height = (e.options.height || 1) * this._renderService.dimensions.css.cell.height + "px", i.style.top = (e.marker.line - this._bufferService.buffers.active.ydisp) * this._renderService.dimensions.css.cell.height + "px", i.style.lineHeight = `${this._renderService.dimensions.css.cell.height}px`;
          const a = (t = e.options.x) !== null && t !== void 0 ? t : 0;
          return a && a > this._bufferService.cols && (i.style.display = "none"), this._refreshXPosition(e, i), i;
        }
        _refreshStyle(e) {
          const r = e.marker.line - this._bufferService.buffers.active.ydisp;
          if (r < 0 || r >= this._bufferService.rows) e.element && (e.element.style.display = "none", e.onRenderEmitter.fire(e.element));
          else {
            let t = this._decorationElements.get(e);
            t || (t = this._createElement(e), e.element = t, this._decorationElements.set(e, t), this._container.appendChild(t), e.onDispose(() => {
              this._decorationElements.delete(e), t.remove();
            })), t.style.top = r * this._renderService.dimensions.css.cell.height + "px", t.style.display = this._altBufferIsActive ? "none" : "block", e.onRenderEmitter.fire(t);
          }
        }
        _refreshXPosition(e, r = e.element) {
          var t;
          if (!r) return;
          const i = (t = e.options.x) !== null && t !== void 0 ? t : 0;
          (e.options.anchor || "left") === "right" ? r.style.right = i ? i * this._renderService.dimensions.css.cell.width + "px" : "" : r.style.left = i ? i * this._renderService.dimensions.css.cell.width + "px" : "";
        }
        _removeDecoration(e) {
          var r;
          (r = this._decorationElements.get(e)) === null || r === void 0 || r.remove(), this._decorationElements.delete(e), e.dispose();
        }
      };
      s.BufferDecorationRenderer = u = l([_(1, p.IBufferService), _(2, p.IDecorationService), _(3, d.IRenderService)], u);
    }, 5871: (M, s) => {
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
        addDecoration(o) {
          if (o.options.overviewRulerOptions) {
            for (const l of this._zones) if (l.color === o.options.overviewRulerOptions.color && l.position === o.options.overviewRulerOptions.position) {
              if (this._lineIntersectsZone(l, o.marker.line)) return;
              if (this._lineAdjacentToZone(l, o.marker.line, o.options.overviewRulerOptions.position)) return void this._addLineToZone(l, o.marker.line);
            }
            if (this._zonePoolIndex < this._zonePool.length) return this._zonePool[this._zonePoolIndex].color = o.options.overviewRulerOptions.color, this._zonePool[this._zonePoolIndex].position = o.options.overviewRulerOptions.position, this._zonePool[this._zonePoolIndex].startBufferLine = o.marker.line, this._zonePool[this._zonePoolIndex].endBufferLine = o.marker.line, void this._zones.push(this._zonePool[this._zonePoolIndex++]);
            this._zones.push({ color: o.options.overviewRulerOptions.color, position: o.options.overviewRulerOptions.position, startBufferLine: o.marker.line, endBufferLine: o.marker.line }), this._zonePool.push(this._zones[this._zones.length - 1]), this._zonePoolIndex++;
          }
        }
        setPadding(o) {
          this._linePadding = o;
        }
        _lineIntersectsZone(o, l) {
          return l >= o.startBufferLine && l <= o.endBufferLine;
        }
        _lineAdjacentToZone(o, l, _) {
          return l >= o.startBufferLine - this._linePadding[_ || "full"] && l <= o.endBufferLine + this._linePadding[_ || "full"];
        }
        _addLineToZone(o, l) {
          o.startBufferLine = Math.min(o.startBufferLine, l), o.endBufferLine = Math.max(o.endBufferLine, l);
        }
      };
    }, 5744: function(M, s, o) {
      var l = this && this.__decorate || function(a, c, v, m) {
        var h, g = arguments.length, E = g < 3 ? c : m === null ? m = Object.getOwnPropertyDescriptor(c, v) : m;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") E = Reflect.decorate(a, c, v, m);
        else for (var S = a.length - 1; S >= 0; S--) (h = a[S]) && (E = (g < 3 ? h(E) : g > 3 ? h(c, v, E) : h(c, v)) || E);
        return g > 3 && E && Object.defineProperty(c, v, E), E;
      }, _ = this && this.__param || function(a, c) {
        return function(v, m) {
          c(v, m, a);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OverviewRulerRenderer = void 0;
      const n = o(5871), d = o(3656), f = o(4725), p = o(844), u = o(2585), e = { full: 0, left: 0, center: 0, right: 0 }, r = { full: 0, left: 0, center: 0, right: 0 }, t = { full: 0, left: 0, center: 0, right: 0 };
      let i = s.OverviewRulerRenderer = class extends p.Disposable {
        get _width() {
          return this._optionsService.options.overviewRulerWidth || 0;
        }
        constructor(a, c, v, m, h, g, E) {
          var S;
          super(), this._viewportElement = a, this._screenElement = c, this._bufferService = v, this._decorationService = m, this._renderService = h, this._optionsService = g, this._coreBrowseService = E, this._colorZoneStore = new n.ColorZoneStore(), this._shouldUpdateDimensions = !0, this._shouldUpdateAnchor = !0, this._lastKnownBufferLength = 0, this._canvas = document.createElement("canvas"), this._canvas.classList.add("xterm-decoration-overview-ruler"), this._refreshCanvasDimensions(), (S = this._viewportElement.parentElement) === null || S === void 0 || S.insertBefore(this._canvas, this._viewportElement);
          const y = this._canvas.getContext("2d");
          if (!y) throw new Error("Ctx cannot be null");
          this._ctx = y, this._registerDecorationListeners(), this._registerBufferChangeListeners(), this._registerDimensionChangeListeners(), this.register((0, p.toDisposable)(() => {
            var w;
            (w = this._canvas) === null || w === void 0 || w.remove();
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
          const a = Math.floor(this._canvas.width / 3), c = Math.ceil(this._canvas.width / 3);
          r.full = this._canvas.width, r.left = a, r.center = c, r.right = a, this._refreshDrawHeightConstants(), t.full = 0, t.left = 0, t.center = r.left, t.right = r.left + r.center;
        }
        _refreshDrawHeightConstants() {
          e.full = Math.round(2 * this._coreBrowseService.dpr);
          const a = this._canvas.height / this._bufferService.buffer.lines.length, c = Math.round(Math.max(Math.min(a, 12), 6) * this._coreBrowseService.dpr);
          e.left = c, e.center = c, e.right = c;
        }
        _refreshColorZonePadding() {
          this._colorZoneStore.setPadding({ full: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * e.full), left: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * e.left), center: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * e.center), right: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * e.right) }), this._lastKnownBufferLength = this._bufferService.buffers.normal.lines.length;
        }
        _refreshCanvasDimensions() {
          this._canvas.style.width = `${this._width}px`, this._canvas.width = Math.round(this._width * this._coreBrowseService.dpr), this._canvas.style.height = `${this._screenElement.clientHeight}px`, this._canvas.height = Math.round(this._screenElement.clientHeight * this._coreBrowseService.dpr), this._refreshDrawConstants(), this._refreshColorZonePadding();
        }
        _refreshDecorations() {
          this._shouldUpdateDimensions && this._refreshCanvasDimensions(), this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height), this._colorZoneStore.clear();
          for (const c of this._decorationService.decorations) this._colorZoneStore.addDecoration(c);
          this._ctx.lineWidth = 1;
          const a = this._colorZoneStore.zones;
          for (const c of a) c.position !== "full" && this._renderColorZone(c);
          for (const c of a) c.position === "full" && this._renderColorZone(c);
          this._shouldUpdateDimensions = !1, this._shouldUpdateAnchor = !1;
        }
        _renderColorZone(a) {
          this._ctx.fillStyle = a.color, this._ctx.fillRect(t[a.position || "full"], Math.round((this._canvas.height - 1) * (a.startBufferLine / this._bufferService.buffers.active.lines.length) - e[a.position || "full"] / 2), r[a.position || "full"], Math.round((this._canvas.height - 1) * ((a.endBufferLine - a.startBufferLine) / this._bufferService.buffers.active.lines.length) + e[a.position || "full"]));
        }
        _queueRefresh(a, c) {
          this._shouldUpdateDimensions = a || this._shouldUpdateDimensions, this._shouldUpdateAnchor = c || this._shouldUpdateAnchor, this._animationFrame === void 0 && (this._animationFrame = this._coreBrowseService.window.requestAnimationFrame(() => {
            this._refreshDecorations(), this._animationFrame = void 0;
          }));
        }
      };
      s.OverviewRulerRenderer = i = l([_(2, u.IBufferService), _(3, u.IDecorationService), _(4, f.IRenderService), _(5, u.IOptionsService), _(6, f.ICoreBrowserService)], i);
    }, 2950: function(M, s, o) {
      var l = this && this.__decorate || function(u, e, r, t) {
        var i, a = arguments.length, c = a < 3 ? e : t === null ? t = Object.getOwnPropertyDescriptor(e, r) : t;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") c = Reflect.decorate(u, e, r, t);
        else for (var v = u.length - 1; v >= 0; v--) (i = u[v]) && (c = (a < 3 ? i(c) : a > 3 ? i(e, r, c) : i(e, r)) || c);
        return a > 3 && c && Object.defineProperty(e, r, c), c;
      }, _ = this && this.__param || function(u, e) {
        return function(r, t) {
          e(r, t, u);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CompositionHelper = void 0;
      const n = o(4725), d = o(2585), f = o(2584);
      let p = s.CompositionHelper = class {
        get isComposing() {
          return this._isComposing;
        }
        constructor(u, e, r, t, i, a) {
          this._textarea = u, this._compositionView = e, this._bufferService = r, this._optionsService = t, this._coreService = i, this._renderService = a, this._isComposing = !1, this._isSendingComposition = !1, this._compositionPosition = { start: 0, end: 0 }, this._dataAlreadySent = "";
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
                let r;
                this._isSendingComposition = !1, e.start += this._dataAlreadySent.length, r = this._isComposing ? this._textarea.value.substring(e.start, e.end) : this._textarea.value.substring(e.start), r.length > 0 && this._coreService.triggerDataEvent(r, !0);
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
              const e = this._textarea.value, r = e.replace(u, "");
              this._dataAlreadySent = r, e.length > u.length ? this._coreService.triggerDataEvent(r, !0) : e.length < u.length ? this._coreService.triggerDataEvent(`${f.C0.DEL}`, !0) : e.length === u.length && e !== u && this._coreService.triggerDataEvent(e, !0);
            }
          }, 0);
        }
        updateCompositionElements(u) {
          if (this._isComposing) {
            if (this._bufferService.buffer.isCursorInViewport) {
              const e = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1), r = this._renderService.dimensions.css.cell.height, t = this._bufferService.buffer.y * this._renderService.dimensions.css.cell.height, i = e * this._renderService.dimensions.css.cell.width;
              this._compositionView.style.left = i + "px", this._compositionView.style.top = t + "px", this._compositionView.style.height = r + "px", this._compositionView.style.lineHeight = r + "px", this._compositionView.style.fontFamily = this._optionsService.rawOptions.fontFamily, this._compositionView.style.fontSize = this._optionsService.rawOptions.fontSize + "px";
              const a = this._compositionView.getBoundingClientRect();
              this._textarea.style.left = i + "px", this._textarea.style.top = t + "px", this._textarea.style.width = Math.max(a.width, 1) + "px", this._textarea.style.height = Math.max(a.height, 1) + "px", this._textarea.style.lineHeight = a.height + "px";
            }
            u || setTimeout(() => this.updateCompositionElements(!0), 0);
          }
        }
      };
      s.CompositionHelper = p = l([_(2, d.IBufferService), _(3, d.IOptionsService), _(4, d.ICoreService), _(5, n.IRenderService)], p);
    }, 9806: (M, s) => {
      function o(l, _, n) {
        const d = n.getBoundingClientRect(), f = l.getComputedStyle(n), p = parseInt(f.getPropertyValue("padding-left")), u = parseInt(f.getPropertyValue("padding-top"));
        return [_.clientX - d.left - p, _.clientY - d.top - u];
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.getCoords = s.getCoordsRelativeToElement = void 0, s.getCoordsRelativeToElement = o, s.getCoords = function(l, _, n, d, f, p, u, e, r) {
        if (!p) return;
        const t = o(l, _, n);
        return t ? (t[0] = Math.ceil((t[0] + (r ? u / 2 : 0)) / u), t[1] = Math.ceil(t[1] / e), t[0] = Math.min(Math.max(t[0], 1), d + (r ? 1 : 0)), t[1] = Math.min(Math.max(t[1], 1), f), t) : void 0;
      };
    }, 9504: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.moveToCellSequence = void 0;
      const l = o(2584);
      function _(e, r, t, i) {
        const a = e - n(e, t), c = r - n(r, t), v = Math.abs(a - c) - function(m, h, g) {
          let E = 0;
          const S = m - n(m, g), y = h - n(h, g);
          for (let w = 0; w < Math.abs(S - y); w++) {
            const R = d(m, h) === "A" ? -1 : 1, A = g.buffer.lines.get(S + R * w);
            A != null && A.isWrapped && E++;
          }
          return E;
        }(e, r, t);
        return u(v, p(d(e, r), i));
      }
      function n(e, r) {
        let t = 0, i = r.buffer.lines.get(e), a = i == null ? void 0 : i.isWrapped;
        for (; a && e >= 0 && e < r.rows; ) t++, i = r.buffer.lines.get(--e), a = i == null ? void 0 : i.isWrapped;
        return t;
      }
      function d(e, r) {
        return e > r ? "A" : "B";
      }
      function f(e, r, t, i, a, c) {
        let v = e, m = r, h = "";
        for (; v !== t || m !== i; ) v += a ? 1 : -1, a && v > c.cols - 1 ? (h += c.buffer.translateBufferLineToString(m, !1, e, v), v = 0, e = 0, m++) : !a && v < 0 && (h += c.buffer.translateBufferLineToString(m, !1, 0, e + 1), v = c.cols - 1, e = v, m--);
        return h + c.buffer.translateBufferLineToString(m, !1, e, v);
      }
      function p(e, r) {
        const t = r ? "O" : "[";
        return l.C0.ESC + t + e;
      }
      function u(e, r) {
        e = Math.floor(e);
        let t = "";
        for (let i = 0; i < e; i++) t += r;
        return t;
      }
      s.moveToCellSequence = function(e, r, t, i) {
        const a = t.buffer.x, c = t.buffer.y;
        if (!t.buffer.hasScrollback) return function(h, g, E, S, y, w) {
          return _(g, S, y, w).length === 0 ? "" : u(f(h, g, h, g - n(g, y), !1, y).length, p("D", w));
        }(a, c, 0, r, t, i) + _(c, r, t, i) + function(h, g, E, S, y, w) {
          let R;
          R = _(g, S, y, w).length > 0 ? S - n(S, y) : g;
          const A = S, O = function(I, C, x, k, L, H) {
            let N;
            return N = _(x, k, L, H).length > 0 ? k - n(k, L) : C, I < x && N <= k || I >= x && N < k ? "C" : "D";
          }(h, g, E, S, y, w);
          return u(f(h, R, E, A, O === "C", y).length, p(O, w));
        }(a, c, e, r, t, i);
        let v;
        if (c === r) return v = a > e ? "D" : "C", u(Math.abs(a - e), p(v, i));
        v = c > r ? "D" : "C";
        const m = Math.abs(c - r);
        return u(function(h, g) {
          return g.cols - h;
        }(c > r ? e : a, t) + (m - 1) * t.cols + 1 + ((c > r ? a : e) - 1), p(v, i));
      };
    }, 1296: function(M, s, o) {
      var l = this && this.__decorate || function(y, w, R, A) {
        var O, I = arguments.length, C = I < 3 ? w : A === null ? A = Object.getOwnPropertyDescriptor(w, R) : A;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") C = Reflect.decorate(y, w, R, A);
        else for (var x = y.length - 1; x >= 0; x--) (O = y[x]) && (C = (I < 3 ? O(C) : I > 3 ? O(w, R, C) : O(w, R)) || C);
        return I > 3 && C && Object.defineProperty(w, R, C), C;
      }, _ = this && this.__param || function(y, w) {
        return function(R, A) {
          w(R, A, y);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DomRenderer = void 0;
      const n = o(3787), d = o(2550), f = o(2223), p = o(6171), u = o(4725), e = o(8055), r = o(8460), t = o(844), i = o(2585), a = "xterm-dom-renderer-owner-", c = "xterm-rows", v = "xterm-fg-", m = "xterm-bg-", h = "xterm-focus", g = "xterm-selection";
      let E = 1, S = s.DomRenderer = class extends t.Disposable {
        constructor(y, w, R, A, O, I, C, x, k, L) {
          super(), this._element = y, this._screenElement = w, this._viewportElement = R, this._linkifier2 = A, this._charSizeService = I, this._optionsService = C, this._bufferService = x, this._coreBrowserService = k, this._themeService = L, this._terminalClass = E++, this._rowElements = [], this.onRequestRedraw = this.register(new r.EventEmitter()).event, this._rowContainer = document.createElement("div"), this._rowContainer.classList.add(c), this._rowContainer.style.lineHeight = "normal", this._rowContainer.setAttribute("aria-hidden", "true"), this._refreshRowElements(this._bufferService.cols, this._bufferService.rows), this._selectionContainer = document.createElement("div"), this._selectionContainer.classList.add(g), this._selectionContainer.setAttribute("aria-hidden", "true"), this.dimensions = (0, p.createRenderDimensions)(), this._updateDimensions(), this.register(this._optionsService.onOptionChange(() => this._handleOptionsChanged())), this.register(this._themeService.onChangeColors((H) => this._injectCss(H))), this._injectCss(this._themeService.colors), this._rowFactory = O.createInstance(n.DomRendererRowFactory, document), this._element.classList.add(a + this._terminalClass), this._screenElement.appendChild(this._rowContainer), this._screenElement.appendChild(this._selectionContainer), this.register(this._linkifier2.onShowLinkUnderline((H) => this._handleLinkHover(H))), this.register(this._linkifier2.onHideLinkUnderline((H) => this._handleLinkLeave(H))), this.register((0, t.toDisposable)(() => {
            this._element.classList.remove(a + this._terminalClass), this._rowContainer.remove(), this._selectionContainer.remove(), this._widthCache.dispose(), this._themeStyleElement.remove(), this._dimensionsStyleElement.remove();
          })), this._widthCache = new d.WidthCache(document), this._widthCache.setFont(this._optionsService.rawOptions.fontFamily, this._optionsService.rawOptions.fontSize, this._optionsService.rawOptions.fontWeight, this._optionsService.rawOptions.fontWeightBold), this._setDefaultSpacing();
        }
        _updateDimensions() {
          const y = this._coreBrowserService.dpr;
          this.dimensions.device.char.width = this._charSizeService.width * y, this.dimensions.device.char.height = Math.ceil(this._charSizeService.height * y), this.dimensions.device.cell.width = this.dimensions.device.char.width + Math.round(this._optionsService.rawOptions.letterSpacing), this.dimensions.device.cell.height = Math.floor(this.dimensions.device.char.height * this._optionsService.rawOptions.lineHeight), this.dimensions.device.char.left = 0, this.dimensions.device.char.top = 0, this.dimensions.device.canvas.width = this.dimensions.device.cell.width * this._bufferService.cols, this.dimensions.device.canvas.height = this.dimensions.device.cell.height * this._bufferService.rows, this.dimensions.css.canvas.width = Math.round(this.dimensions.device.canvas.width / y), this.dimensions.css.canvas.height = Math.round(this.dimensions.device.canvas.height / y), this.dimensions.css.cell.width = this.dimensions.css.canvas.width / this._bufferService.cols, this.dimensions.css.cell.height = this.dimensions.css.canvas.height / this._bufferService.rows;
          for (const R of this._rowElements) R.style.width = `${this.dimensions.css.canvas.width}px`, R.style.height = `${this.dimensions.css.cell.height}px`, R.style.lineHeight = `${this.dimensions.css.cell.height}px`, R.style.overflow = "hidden";
          this._dimensionsStyleElement || (this._dimensionsStyleElement = document.createElement("style"), this._screenElement.appendChild(this._dimensionsStyleElement));
          const w = `${this._terminalSelector} .${c} span { display: inline-block; height: 100%; vertical-align: top;}`;
          this._dimensionsStyleElement.textContent = w, this._selectionContainer.style.height = this._viewportElement.style.height, this._screenElement.style.width = `${this.dimensions.css.canvas.width}px`, this._screenElement.style.height = `${this.dimensions.css.canvas.height}px`;
        }
        _injectCss(y) {
          this._themeStyleElement || (this._themeStyleElement = document.createElement("style"), this._screenElement.appendChild(this._themeStyleElement));
          let w = `${this._terminalSelector} .${c} { color: ${y.foreground.css}; font-family: ${this._optionsService.rawOptions.fontFamily}; font-size: ${this._optionsService.rawOptions.fontSize}px; font-kerning: none; white-space: pre}`;
          w += `${this._terminalSelector} .${c} .xterm-dim { color: ${e.color.multiplyOpacity(y.foreground, 0.5).css};}`, w += `${this._terminalSelector} span:not(.xterm-bold) { font-weight: ${this._optionsService.rawOptions.fontWeight};}${this._terminalSelector} span.xterm-bold { font-weight: ${this._optionsService.rawOptions.fontWeightBold};}${this._terminalSelector} span.xterm-italic { font-style: italic;}`, w += "@keyframes blink_box_shadow_" + this._terminalClass + " { 50% {  border-bottom-style: hidden; }}", w += "@keyframes blink_block_" + this._terminalClass + ` { 0% {  background-color: ${y.cursor.css};  color: ${y.cursorAccent.css}; } 50% {  background-color: inherit;  color: ${y.cursor.css}; }}`, w += `${this._terminalSelector} .${c}.${h} .xterm-cursor.xterm-cursor-blink:not(.xterm-cursor-block) { animation: blink_box_shadow_` + this._terminalClass + ` 1s step-end infinite;}${this._terminalSelector} .${c}.${h} .xterm-cursor.xterm-cursor-blink.xterm-cursor-block { animation: blink_block_` + this._terminalClass + ` 1s step-end infinite;}${this._terminalSelector} .${c} .xterm-cursor.xterm-cursor-block { background-color: ${y.cursor.css}; color: ${y.cursorAccent.css};}${this._terminalSelector} .${c} .xterm-cursor.xterm-cursor-outline { outline: 1px solid ${y.cursor.css}; outline-offset: -1px;}${this._terminalSelector} .${c} .xterm-cursor.xterm-cursor-bar { box-shadow: ${this._optionsService.rawOptions.cursorWidth}px 0 0 ${y.cursor.css} inset;}${this._terminalSelector} .${c} .xterm-cursor.xterm-cursor-underline { border-bottom: 1px ${y.cursor.css}; border-bottom-style: solid; height: calc(100% - 1px);}`, w += `${this._terminalSelector} .${g} { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;}${this._terminalSelector}.focus .${g} div { position: absolute; background-color: ${y.selectionBackgroundOpaque.css};}${this._terminalSelector} .${g} div { position: absolute; background-color: ${y.selectionInactiveBackgroundOpaque.css};}`;
          for (const [R, A] of y.ansi.entries()) w += `${this._terminalSelector} .${v}${R} { color: ${A.css}; }${this._terminalSelector} .${v}${R}.xterm-dim { color: ${e.color.multiplyOpacity(A, 0.5).css}; }${this._terminalSelector} .${m}${R} { background-color: ${A.css}; }`;
          w += `${this._terminalSelector} .${v}${f.INVERTED_DEFAULT_COLOR} { color: ${e.color.opaque(y.background).css}; }${this._terminalSelector} .${v}${f.INVERTED_DEFAULT_COLOR}.xterm-dim { color: ${e.color.multiplyOpacity(e.color.opaque(y.background), 0.5).css}; }${this._terminalSelector} .${m}${f.INVERTED_DEFAULT_COLOR} { background-color: ${y.foreground.css}; }`, this._themeStyleElement.textContent = w;
        }
        _setDefaultSpacing() {
          const y = this.dimensions.css.cell.width - this._widthCache.get("W", !1, !1);
          this._rowContainer.style.letterSpacing = `${y}px`, this._rowFactory.defaultSpacing = y;
        }
        handleDevicePixelRatioChange() {
          this._updateDimensions(), this._widthCache.clear(), this._setDefaultSpacing();
        }
        _refreshRowElements(y, w) {
          for (let R = this._rowElements.length; R <= w; R++) {
            const A = document.createElement("div");
            this._rowContainer.appendChild(A), this._rowElements.push(A);
          }
          for (; this._rowElements.length > w; ) this._rowContainer.removeChild(this._rowElements.pop());
        }
        handleResize(y, w) {
          this._refreshRowElements(y, w), this._updateDimensions();
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
        handleSelectionChanged(y, w, R) {
          if (this._selectionContainer.replaceChildren(), this._rowFactory.handleSelectionChanged(y, w, R), this.renderRows(0, this._bufferService.rows - 1), !y || !w) return;
          const A = y[1] - this._bufferService.buffer.ydisp, O = w[1] - this._bufferService.buffer.ydisp, I = Math.max(A, 0), C = Math.min(O, this._bufferService.rows - 1);
          if (I >= this._bufferService.rows || C < 0) return;
          const x = document.createDocumentFragment();
          if (R) {
            const k = y[0] > w[0];
            x.appendChild(this._createSelectionElement(I, k ? w[0] : y[0], k ? y[0] : w[0], C - I + 1));
          } else {
            const k = A === I ? y[0] : 0, L = I === O ? w[0] : this._bufferService.cols;
            x.appendChild(this._createSelectionElement(I, k, L));
            const H = C - I - 1;
            if (x.appendChild(this._createSelectionElement(I + 1, 0, this._bufferService.cols, H)), I !== C) {
              const N = O === C ? w[0] : this._bufferService.cols;
              x.appendChild(this._createSelectionElement(C, 0, N));
            }
          }
          this._selectionContainer.appendChild(x);
        }
        _createSelectionElement(y, w, R, A = 1) {
          const O = document.createElement("div");
          return O.style.height = A * this.dimensions.css.cell.height + "px", O.style.top = y * this.dimensions.css.cell.height + "px", O.style.left = w * this.dimensions.css.cell.width + "px", O.style.width = this.dimensions.css.cell.width * (R - w) + "px", O;
        }
        handleCursorMove() {
        }
        _handleOptionsChanged() {
          this._updateDimensions(), this._injectCss(this._themeService.colors), this._widthCache.setFont(this._optionsService.rawOptions.fontFamily, this._optionsService.rawOptions.fontSize, this._optionsService.rawOptions.fontWeight, this._optionsService.rawOptions.fontWeightBold), this._setDefaultSpacing();
        }
        clear() {
          for (const y of this._rowElements) y.replaceChildren();
        }
        renderRows(y, w) {
          const R = this._bufferService.buffer, A = R.ybase + R.y, O = Math.min(R.x, this._bufferService.cols - 1), I = this._optionsService.rawOptions.cursorBlink, C = this._optionsService.rawOptions.cursorStyle, x = this._optionsService.rawOptions.cursorInactiveStyle;
          for (let k = y; k <= w; k++) {
            const L = k + R.ydisp, H = this._rowElements[k], N = R.lines.get(L);
            if (!H || !N) break;
            H.replaceChildren(...this._rowFactory.createRow(N, L, L === A, C, x, O, I, this.dimensions.css.cell.width, this._widthCache, -1, -1));
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
        _setCellUnderline(y, w, R, A, O, I) {
          R < 0 && (y = 0), A < 0 && (w = 0);
          const C = this._bufferService.rows - 1;
          R = Math.max(Math.min(R, C), 0), A = Math.max(Math.min(A, C), 0), O = Math.min(O, this._bufferService.cols);
          const x = this._bufferService.buffer, k = x.ybase + x.y, L = Math.min(x.x, O - 1), H = this._optionsService.rawOptions.cursorBlink, N = this._optionsService.rawOptions.cursorStyle, $ = this._optionsService.rawOptions.cursorInactiveStyle;
          for (let j = R; j <= A; ++j) {
            const Q = j + x.ydisp, b = this._rowElements[j], D = x.lines.get(Q);
            if (!b || !D) break;
            b.replaceChildren(...this._rowFactory.createRow(D, Q, Q === k, N, $, L, H, this.dimensions.css.cell.width, this._widthCache, I ? j === R ? y : 0 : -1, I ? (j === A ? w : O) - 1 : -1));
          }
        }
      };
      s.DomRenderer = S = l([_(4, i.IInstantiationService), _(5, u.ICharSizeService), _(6, i.IOptionsService), _(7, i.IBufferService), _(8, u.ICoreBrowserService), _(9, u.IThemeService)], S);
    }, 3787: function(M, s, o) {
      var l = this && this.__decorate || function(v, m, h, g) {
        var E, S = arguments.length, y = S < 3 ? m : g === null ? g = Object.getOwnPropertyDescriptor(m, h) : g;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") y = Reflect.decorate(v, m, h, g);
        else for (var w = v.length - 1; w >= 0; w--) (E = v[w]) && (y = (S < 3 ? E(y) : S > 3 ? E(m, h, y) : E(m, h)) || y);
        return S > 3 && y && Object.defineProperty(m, h, y), y;
      }, _ = this && this.__param || function(v, m) {
        return function(h, g) {
          m(h, g, v);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DomRendererRowFactory = void 0;
      const n = o(2223), d = o(643), f = o(511), p = o(2585), u = o(8055), e = o(4725), r = o(4269), t = o(6171), i = o(3734);
      let a = s.DomRendererRowFactory = class {
        constructor(v, m, h, g, E, S, y) {
          this._document = v, this._characterJoinerService = m, this._optionsService = h, this._coreBrowserService = g, this._coreService = E, this._decorationService = S, this._themeService = y, this._workCell = new f.CellData(), this._columnSelectMode = !1, this.defaultSpacing = 0;
        }
        handleSelectionChanged(v, m, h) {
          this._selectionStart = v, this._selectionEnd = m, this._columnSelectMode = h;
        }
        createRow(v, m, h, g, E, S, y, w, R, A, O) {
          const I = [], C = this._characterJoinerService.getJoinedCharacters(m), x = this._themeService.colors;
          let k, L = v.getNoBgTrimmedLength();
          h && L < S + 1 && (L = S + 1);
          let H = 0, N = "", $ = 0, j = 0, Q = 0, b = !1, D = 0, T = !1, B = 0;
          const V = [], W = A !== -1 && O !== -1;
          for (let Z = 0; Z < L; Z++) {
            v.loadCell(Z, this._workCell);
            let ie = this._workCell.getWidth();
            if (ie === 0) continue;
            let re = !1, de = Z, X = this._workCell;
            if (C.length > 0 && Z === C[0][0]) {
              re = !0;
              const ee = C.shift();
              X = new r.JoinedCellData(this._workCell, v.translateToString(!0, ee[0], ee[1]), ee[1] - ee[0]), de = ee[1] - 1, ie = X.getWidth();
            }
            const fe = this._isCellInSelection(Z, m), Ce = h && Z === S, ye = W && Z >= A && Z <= O;
            let we = !1;
            this._decorationService.forEachDecorationAtCell(Z, m, void 0, (ee) => {
              we = !0;
            });
            let me = X.getChars() || d.WHITESPACE_CELL_CHAR;
            if (me === " " && (X.isUnderline() || X.isOverline()) && (me = " "), B = ie * w - R.get(me, X.isBold(), X.isItalic()), k) {
              if (H && (fe && T || !fe && !T && X.bg === $) && (fe && T && x.selectionForeground || X.fg === j) && X.extended.ext === Q && ye === b && B === D && !Ce && !re && !we) {
                N += me, H++;
                continue;
              }
              H && (k.textContent = N), k = this._document.createElement("span"), H = 0, N = "";
            } else k = this._document.createElement("span");
            if ($ = X.bg, j = X.fg, Q = X.extended.ext, b = ye, D = B, T = fe, re && S >= Z && S <= de && (S = Z), !this._coreService.isCursorHidden && Ce) {
              if (V.push("xterm-cursor"), this._coreBrowserService.isFocused) y && V.push("xterm-cursor-blink"), V.push(g === "bar" ? "xterm-cursor-bar" : g === "underline" ? "xterm-cursor-underline" : "xterm-cursor-block");
              else if (E) switch (E) {
                case "outline":
                  V.push("xterm-cursor-outline");
                  break;
                case "block":
                  V.push("xterm-cursor-block");
                  break;
                case "bar":
                  V.push("xterm-cursor-bar");
                  break;
                case "underline":
                  V.push("xterm-cursor-underline");
              }
            }
            if (X.isBold() && V.push("xterm-bold"), X.isItalic() && V.push("xterm-italic"), X.isDim() && V.push("xterm-dim"), N = X.isInvisible() ? d.WHITESPACE_CELL_CHAR : X.getChars() || d.WHITESPACE_CELL_CHAR, X.isUnderline() && (V.push(`xterm-underline-${X.extended.underlineStyle}`), N === " " && (N = " "), !X.isUnderlineColorDefault())) if (X.isUnderlineColorRGB()) k.style.textDecorationColor = `rgb(${i.AttributeData.toColorRGB(X.getUnderlineColor()).join(",")})`;
            else {
              let ee = X.getUnderlineColor();
              this._optionsService.rawOptions.drawBoldTextInBrightColors && X.isBold() && ee < 8 && (ee += 8), k.style.textDecorationColor = x.ansi[ee].css;
            }
            X.isOverline() && (V.push("xterm-overline"), N === " " && (N = " ")), X.isStrikethrough() && V.push("xterm-strikethrough"), ye && (k.style.textDecoration = "underline");
            let se = X.getFgColor(), ve = X.getFgColorMode(), ae = X.getBgColor(), pe = X.getBgColorMode();
            const Ee = !!X.isInverse();
            if (Ee) {
              const ee = se;
              se = ae, ae = ee;
              const Ne = ve;
              ve = pe, pe = Ne;
            }
            let he, xe, le, ge = !1;
            switch (this._decorationService.forEachDecorationAtCell(Z, m, void 0, (ee) => {
              ee.options.layer !== "top" && ge || (ee.backgroundColorRGB && (pe = 50331648, ae = ee.backgroundColorRGB.rgba >> 8 & 16777215, he = ee.backgroundColorRGB), ee.foregroundColorRGB && (ve = 50331648, se = ee.foregroundColorRGB.rgba >> 8 & 16777215, xe = ee.foregroundColorRGB), ge = ee.options.layer === "top");
            }), !ge && fe && (he = this._coreBrowserService.isFocused ? x.selectionBackgroundOpaque : x.selectionInactiveBackgroundOpaque, ae = he.rgba >> 8 & 16777215, pe = 50331648, ge = !0, x.selectionForeground && (ve = 50331648, se = x.selectionForeground.rgba >> 8 & 16777215, xe = x.selectionForeground)), ge && V.push("xterm-decoration-top"), pe) {
              case 16777216:
              case 33554432:
                le = x.ansi[ae], V.push(`xterm-bg-${ae}`);
                break;
              case 50331648:
                le = u.rgba.toColor(ae >> 16, ae >> 8 & 255, 255 & ae), this._addStyle(k, `background-color:#${c((ae >>> 0).toString(16), "0", 6)}`);
                break;
              default:
                Ee ? (le = x.foreground, V.push(`xterm-bg-${n.INVERTED_DEFAULT_COLOR}`)) : le = x.background;
            }
            switch (he || X.isDim() && (he = u.color.multiplyOpacity(le, 0.5)), ve) {
              case 16777216:
              case 33554432:
                X.isBold() && se < 8 && this._optionsService.rawOptions.drawBoldTextInBrightColors && (se += 8), this._applyMinimumContrast(k, le, x.ansi[se], X, he, void 0) || V.push(`xterm-fg-${se}`);
                break;
              case 50331648:
                const ee = u.rgba.toColor(se >> 16 & 255, se >> 8 & 255, 255 & se);
                this._applyMinimumContrast(k, le, ee, X, he, xe) || this._addStyle(k, `color:#${c(se.toString(16), "0", 6)}`);
                break;
              default:
                this._applyMinimumContrast(k, le, x.foreground, X, he, void 0) || Ee && V.push(`xterm-fg-${n.INVERTED_DEFAULT_COLOR}`);
            }
            V.length && (k.className = V.join(" "), V.length = 0), Ce || re || we ? k.textContent = N : H++, B !== this.defaultSpacing && (k.style.letterSpacing = `${B}px`), I.push(k), Z = de;
          }
          return k && H && (k.textContent = N), I;
        }
        _applyMinimumContrast(v, m, h, g, E, S) {
          if (this._optionsService.rawOptions.minimumContrastRatio === 1 || (0, t.excludeFromContrastRatioDemands)(g.getCode())) return !1;
          const y = this._getContrastCache(g);
          let w;
          if (E || S || (w = y.getColor(m.rgba, h.rgba)), w === void 0) {
            const R = this._optionsService.rawOptions.minimumContrastRatio / (g.isDim() ? 2 : 1);
            w = u.color.ensureContrastRatio(E || m, S || h, R), y.setColor((E || m).rgba, (S || h).rgba, w ?? null);
          }
          return !!w && (this._addStyle(v, `color:${w.css}`), !0);
        }
        _getContrastCache(v) {
          return v.isDim() ? this._themeService.colors.halfContrastCache : this._themeService.colors.contrastCache;
        }
        _addStyle(v, m) {
          v.setAttribute("style", `${v.getAttribute("style") || ""}${m};`);
        }
        _isCellInSelection(v, m) {
          const h = this._selectionStart, g = this._selectionEnd;
          return !(!h || !g) && (this._columnSelectMode ? h[0] <= g[0] ? v >= h[0] && m >= h[1] && v < g[0] && m <= g[1] : v < h[0] && m >= h[1] && v >= g[0] && m <= g[1] : m > h[1] && m < g[1] || h[1] === g[1] && m === h[1] && v >= h[0] && v < g[0] || h[1] < g[1] && m === g[1] && v < g[0] || h[1] < g[1] && m === h[1] && v >= h[0]);
        }
      };
      function c(v, m, h) {
        for (; v.length < h; ) v = m + v;
        return v;
      }
      s.DomRendererRowFactory = a = l([_(1, e.ICharacterJoinerService), _(2, p.IOptionsService), _(3, e.ICoreBrowserService), _(4, p.ICoreService), _(5, p.IDecorationService), _(6, e.IThemeService)], a);
    }, 2550: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.WidthCache = void 0, s.WidthCache = class {
        constructor(o) {
          this._flat = new Float32Array(256), this._font = "", this._fontSize = 0, this._weight = "normal", this._weightBold = "bold", this._measureElements = [], this._container = o.createElement("div"), this._container.style.position = "absolute", this._container.style.top = "-50000px", this._container.style.width = "50000px", this._container.style.whiteSpace = "pre", this._container.style.fontKerning = "none";
          const l = o.createElement("span"), _ = o.createElement("span");
          _.style.fontWeight = "bold";
          const n = o.createElement("span");
          n.style.fontStyle = "italic";
          const d = o.createElement("span");
          d.style.fontWeight = "bold", d.style.fontStyle = "italic", this._measureElements = [l, _, n, d], this._container.appendChild(l), this._container.appendChild(_), this._container.appendChild(n), this._container.appendChild(d), o.body.appendChild(this._container), this.clear();
        }
        dispose() {
          this._container.remove(), this._measureElements.length = 0, this._holey = void 0;
        }
        clear() {
          this._flat.fill(-9999), this._holey = /* @__PURE__ */ new Map();
        }
        setFont(o, l, _, n) {
          o === this._font && l === this._fontSize && _ === this._weight && n === this._weightBold || (this._font = o, this._fontSize = l, this._weight = _, this._weightBold = n, this._container.style.fontFamily = this._font, this._container.style.fontSize = `${this._fontSize}px`, this._measureElements[0].style.fontWeight = `${_}`, this._measureElements[1].style.fontWeight = `${n}`, this._measureElements[2].style.fontWeight = `${_}`, this._measureElements[3].style.fontWeight = `${n}`, this.clear());
        }
        get(o, l, _) {
          let n = 0;
          if (!l && !_ && o.length === 1 && (n = o.charCodeAt(0)) < 256) return this._flat[n] !== -9999 ? this._flat[n] : this._flat[n] = this._measure(o, 0);
          let d = o;
          l && (d += "B"), _ && (d += "I");
          let f = this._holey.get(d);
          if (f === void 0) {
            let p = 0;
            l && (p |= 1), _ && (p |= 2), f = this._measure(o, p), this._holey.set(d, f);
          }
          return f;
        }
        _measure(o, l) {
          const _ = this._measureElements[l];
          return _.textContent = o.repeat(32), _.offsetWidth / 32;
        }
      };
    }, 2223: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.TEXT_BASELINE = s.DIM_OPACITY = s.INVERTED_DEFAULT_COLOR = void 0;
      const l = o(6114);
      s.INVERTED_DEFAULT_COLOR = 257, s.DIM_OPACITY = 0.5, s.TEXT_BASELINE = l.isFirefox || l.isLegacyEdge ? "bottom" : "ideographic";
    }, 6171: (M, s) => {
      function o(l) {
        return 57508 <= l && l <= 57558;
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.createRenderDimensions = s.excludeFromContrastRatioDemands = s.isRestrictedPowerlineGlyph = s.isPowerlineGlyph = s.throwIfFalsy = void 0, s.throwIfFalsy = function(l) {
        if (!l) throw new Error("value must not be falsy");
        return l;
      }, s.isPowerlineGlyph = o, s.isRestrictedPowerlineGlyph = function(l) {
        return 57520 <= l && l <= 57527;
      }, s.excludeFromContrastRatioDemands = function(l) {
        return o(l) || function(_) {
          return 9472 <= _ && _ <= 9631;
        }(l);
      }, s.createRenderDimensions = function() {
        return { css: { canvas: { width: 0, height: 0 }, cell: { width: 0, height: 0 } }, device: { canvas: { width: 0, height: 0 }, cell: { width: 0, height: 0 }, char: { width: 0, height: 0, left: 0, top: 0 } } };
      };
    }, 456: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.SelectionModel = void 0, s.SelectionModel = class {
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
          const o = this.selectionStart, l = this.selectionEnd;
          return !(!o || !l) && (o[1] > l[1] || o[1] === l[1] && o[0] > l[0]);
        }
        handleTrim(o) {
          return this.selectionStart && (this.selectionStart[1] -= o), this.selectionEnd && (this.selectionEnd[1] -= o), this.selectionEnd && this.selectionEnd[1] < 0 ? (this.clearSelection(), !0) : (this.selectionStart && this.selectionStart[1] < 0 && (this.selectionStart[1] = 0), !1);
        }
      };
    }, 428: function(M, s, o) {
      var l = this && this.__decorate || function(e, r, t, i) {
        var a, c = arguments.length, v = c < 3 ? r : i === null ? i = Object.getOwnPropertyDescriptor(r, t) : i;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") v = Reflect.decorate(e, r, t, i);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (v = (c < 3 ? a(v) : c > 3 ? a(r, t, v) : a(r, t)) || v);
        return c > 3 && v && Object.defineProperty(r, t, v), v;
      }, _ = this && this.__param || function(e, r) {
        return function(t, i) {
          r(t, i, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CharSizeService = void 0;
      const n = o(2585), d = o(8460), f = o(844);
      let p = s.CharSizeService = class extends f.Disposable {
        get hasValidSize() {
          return this.width > 0 && this.height > 0;
        }
        constructor(e, r, t) {
          super(), this._optionsService = t, this.width = 0, this.height = 0, this._onCharSizeChange = this.register(new d.EventEmitter()), this.onCharSizeChange = this._onCharSizeChange.event, this._measureStrategy = new u(e, r, this._optionsService), this.register(this._optionsService.onMultipleOptionChange(["fontFamily", "fontSize"], () => this.measure()));
        }
        measure() {
          const e = this._measureStrategy.measure();
          e.width === this.width && e.height === this.height || (this.width = e.width, this.height = e.height, this._onCharSizeChange.fire());
        }
      };
      s.CharSizeService = p = l([_(2, n.IOptionsService)], p);
      class u {
        constructor(r, t, i) {
          this._document = r, this._parentElement = t, this._optionsService = i, this._result = { width: 0, height: 0 }, this._measureElement = this._document.createElement("span"), this._measureElement.classList.add("xterm-char-measure-element"), this._measureElement.textContent = "W".repeat(32), this._measureElement.setAttribute("aria-hidden", "true"), this._measureElement.style.whiteSpace = "pre", this._measureElement.style.fontKerning = "none", this._parentElement.appendChild(this._measureElement);
        }
        measure() {
          this._measureElement.style.fontFamily = this._optionsService.rawOptions.fontFamily, this._measureElement.style.fontSize = `${this._optionsService.rawOptions.fontSize}px`;
          const r = { height: Number(this._measureElement.offsetHeight), width: Number(this._measureElement.offsetWidth) };
          return r.width !== 0 && r.height !== 0 && (this._result.width = r.width / 32, this._result.height = Math.ceil(r.height)), this._result;
        }
      }
    }, 4269: function(M, s, o) {
      var l = this && this.__decorate || function(r, t, i, a) {
        var c, v = arguments.length, m = v < 3 ? t : a === null ? a = Object.getOwnPropertyDescriptor(t, i) : a;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") m = Reflect.decorate(r, t, i, a);
        else for (var h = r.length - 1; h >= 0; h--) (c = r[h]) && (m = (v < 3 ? c(m) : v > 3 ? c(t, i, m) : c(t, i)) || m);
        return v > 3 && m && Object.defineProperty(t, i, m), m;
      }, _ = this && this.__param || function(r, t) {
        return function(i, a) {
          t(i, a, r);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CharacterJoinerService = s.JoinedCellData = void 0;
      const n = o(3734), d = o(643), f = o(511), p = o(2585);
      class u extends n.AttributeData {
        constructor(t, i, a) {
          super(), this.content = 0, this.combinedData = "", this.fg = t.fg, this.bg = t.bg, this.combinedData = i, this._width = a;
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
          this._bufferService = t, this._characterJoiners = [], this._nextCharacterJoinerId = 0, this._workCell = new f.CellData();
        }
        register(t) {
          const i = { id: this._nextCharacterJoinerId++, handler: t };
          return this._characterJoiners.push(i), i.id;
        }
        deregister(t) {
          for (let i = 0; i < this._characterJoiners.length; i++) if (this._characterJoiners[i].id === t) return this._characterJoiners.splice(i, 1), !0;
          return !1;
        }
        getJoinedCharacters(t) {
          if (this._characterJoiners.length === 0) return [];
          const i = this._bufferService.buffer.lines.get(t);
          if (!i || i.length === 0) return [];
          const a = [], c = i.translateToString(!0);
          let v = 0, m = 0, h = 0, g = i.getFg(0), E = i.getBg(0);
          for (let S = 0; S < i.getTrimmedLength(); S++) if (i.loadCell(S, this._workCell), this._workCell.getWidth() !== 0) {
            if (this._workCell.fg !== g || this._workCell.bg !== E) {
              if (S - v > 1) {
                const y = this._getJoinedRanges(c, h, m, i, v);
                for (let w = 0; w < y.length; w++) a.push(y[w]);
              }
              v = S, h = m, g = this._workCell.fg, E = this._workCell.bg;
            }
            m += this._workCell.getChars().length || d.WHITESPACE_CELL_CHAR.length;
          }
          if (this._bufferService.cols - v > 1) {
            const S = this._getJoinedRanges(c, h, m, i, v);
            for (let y = 0; y < S.length; y++) a.push(S[y]);
          }
          return a;
        }
        _getJoinedRanges(t, i, a, c, v) {
          const m = t.substring(i, a);
          let h = [];
          try {
            h = this._characterJoiners[0].handler(m);
          } catch (g) {
            console.error(g);
          }
          for (let g = 1; g < this._characterJoiners.length; g++) try {
            const E = this._characterJoiners[g].handler(m);
            for (let S = 0; S < E.length; S++) Be._mergeRanges(h, E[S]);
          } catch (E) {
            console.error(E);
          }
          return this._stringRangesToCellRanges(h, c, v), h;
        }
        _stringRangesToCellRanges(t, i, a) {
          let c = 0, v = !1, m = 0, h = t[c];
          if (h) {
            for (let g = a; g < this._bufferService.cols; g++) {
              const E = i.getWidth(g), S = i.getString(g).length || d.WHITESPACE_CELL_CHAR.length;
              if (E !== 0) {
                if (!v && h[0] <= m && (h[0] = g, v = !0), h[1] <= m) {
                  if (h[1] = g, h = t[++c], !h) break;
                  h[0] <= m ? (h[0] = g, v = !0) : v = !1;
                }
                m += S;
              }
            }
            h && (h[1] = this._bufferService.cols);
          }
        }
        static _mergeRanges(t, i) {
          let a = !1;
          for (let c = 0; c < t.length; c++) {
            const v = t[c];
            if (a) {
              if (i[1] <= v[0]) return t[c - 1][1] = i[1], t;
              if (i[1] <= v[1]) return t[c - 1][1] = Math.max(i[1], v[1]), t.splice(c, 1), t;
              t.splice(c, 1), c--;
            } else {
              if (i[1] <= v[0]) return t.splice(c, 0, i), t;
              if (i[1] <= v[1]) return v[0] = Math.min(i[0], v[0]), t;
              i[0] < v[1] && (v[0] = Math.min(i[0], v[0]), a = !0);
            }
          }
          return a ? t[t.length - 1][1] = i[1] : t.push(i), t;
        }
      };
      s.CharacterJoinerService = e = l([_(0, p.IBufferService)], e);
    }, 5114: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CoreBrowserService = void 0, s.CoreBrowserService = class {
        constructor(o, l) {
          this._textarea = o, this.window = l, this._isFocused = !1, this._cachedIsFocused = void 0, this._textarea.addEventListener("focus", () => this._isFocused = !0), this._textarea.addEventListener("blur", () => this._isFocused = !1);
        }
        get dpr() {
          return this.window.devicePixelRatio;
        }
        get isFocused() {
          return this._cachedIsFocused === void 0 && (this._cachedIsFocused = this._isFocused && this._textarea.ownerDocument.hasFocus(), queueMicrotask(() => this._cachedIsFocused = void 0)), this._cachedIsFocused;
        }
      };
    }, 8934: function(M, s, o) {
      var l = this && this.__decorate || function(p, u, e, r) {
        var t, i = arguments.length, a = i < 3 ? u : r === null ? r = Object.getOwnPropertyDescriptor(u, e) : r;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(p, u, e, r);
        else for (var c = p.length - 1; c >= 0; c--) (t = p[c]) && (a = (i < 3 ? t(a) : i > 3 ? t(u, e, a) : t(u, e)) || a);
        return i > 3 && a && Object.defineProperty(u, e, a), a;
      }, _ = this && this.__param || function(p, u) {
        return function(e, r) {
          u(e, r, p);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.MouseService = void 0;
      const n = o(4725), d = o(9806);
      let f = s.MouseService = class {
        constructor(p, u) {
          this._renderService = p, this._charSizeService = u;
        }
        getCoords(p, u, e, r, t) {
          return (0, d.getCoords)(window, p, u, e, r, this._charSizeService.hasValidSize, this._renderService.dimensions.css.cell.width, this._renderService.dimensions.css.cell.height, t);
        }
        getMouseReportCoords(p, u) {
          const e = (0, d.getCoordsRelativeToElement)(window, p, u);
          if (this._charSizeService.hasValidSize) return e[0] = Math.min(Math.max(e[0], 0), this._renderService.dimensions.css.canvas.width - 1), e[1] = Math.min(Math.max(e[1], 0), this._renderService.dimensions.css.canvas.height - 1), { col: Math.floor(e[0] / this._renderService.dimensions.css.cell.width), row: Math.floor(e[1] / this._renderService.dimensions.css.cell.height), x: Math.floor(e[0]), y: Math.floor(e[1]) };
        }
      };
      s.MouseService = f = l([_(0, n.IRenderService), _(1, n.ICharSizeService)], f);
    }, 3230: function(M, s, o) {
      var l = this && this.__decorate || function(a, c, v, m) {
        var h, g = arguments.length, E = g < 3 ? c : m === null ? m = Object.getOwnPropertyDescriptor(c, v) : m;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") E = Reflect.decorate(a, c, v, m);
        else for (var S = a.length - 1; S >= 0; S--) (h = a[S]) && (E = (g < 3 ? h(E) : g > 3 ? h(c, v, E) : h(c, v)) || E);
        return g > 3 && E && Object.defineProperty(c, v, E), E;
      }, _ = this && this.__param || function(a, c) {
        return function(v, m) {
          c(v, m, a);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.RenderService = void 0;
      const n = o(3656), d = o(6193), f = o(5596), p = o(4725), u = o(8460), e = o(844), r = o(7226), t = o(2585);
      let i = s.RenderService = class extends e.Disposable {
        get dimensions() {
          return this._renderer.value.dimensions;
        }
        constructor(a, c, v, m, h, g, E, S) {
          if (super(), this._rowCount = a, this._charSizeService = m, this._renderer = this.register(new e.MutableDisposable()), this._pausedResizeTask = new r.DebouncedIdleTask(), this._isPaused = !1, this._needsFullRefresh = !1, this._isNextRenderRedrawOnly = !0, this._needsSelectionRefresh = !1, this._canvasWidth = 0, this._canvasHeight = 0, this._selectionState = { start: void 0, end: void 0, columnSelectMode: !1 }, this._onDimensionsChange = this.register(new u.EventEmitter()), this.onDimensionsChange = this._onDimensionsChange.event, this._onRenderedViewportChange = this.register(new u.EventEmitter()), this.onRenderedViewportChange = this._onRenderedViewportChange.event, this._onRender = this.register(new u.EventEmitter()), this.onRender = this._onRender.event, this._onRefreshRequest = this.register(new u.EventEmitter()), this.onRefreshRequest = this._onRefreshRequest.event, this._renderDebouncer = new d.RenderDebouncer(E.window, (y, w) => this._renderRows(y, w)), this.register(this._renderDebouncer), this._screenDprMonitor = new f.ScreenDprMonitor(E.window), this._screenDprMonitor.setListener(() => this.handleDevicePixelRatioChange()), this.register(this._screenDprMonitor), this.register(g.onResize(() => this._fullRefresh())), this.register(g.buffers.onBufferActivate(() => {
            var y;
            return (y = this._renderer.value) === null || y === void 0 ? void 0 : y.clear();
          })), this.register(v.onOptionChange(() => this._handleOptionsChanged())), this.register(this._charSizeService.onCharSizeChange(() => this.handleCharSizeChanged())), this.register(h.onDecorationRegistered(() => this._fullRefresh())), this.register(h.onDecorationRemoved(() => this._fullRefresh())), this.register(v.onMultipleOptionChange(["customGlyphs", "drawBoldTextInBrightColors", "letterSpacing", "lineHeight", "fontFamily", "fontSize", "fontWeight", "fontWeightBold", "minimumContrastRatio"], () => {
            this.clear(), this.handleResize(g.cols, g.rows), this._fullRefresh();
          })), this.register(v.onMultipleOptionChange(["cursorBlink", "cursorStyle"], () => this.refreshRows(g.buffer.y, g.buffer.y, !0))), this.register((0, n.addDisposableDomListener)(E.window, "resize", () => this.handleDevicePixelRatioChange())), this.register(S.onChangeColors(() => this._fullRefresh())), "IntersectionObserver" in E.window) {
            const y = new E.window.IntersectionObserver((w) => this._handleIntersectionChange(w[w.length - 1]), { threshold: 0 });
            y.observe(c), this.register({ dispose: () => y.disconnect() });
          }
        }
        _handleIntersectionChange(a) {
          this._isPaused = a.isIntersecting === void 0 ? a.intersectionRatio === 0 : !a.isIntersecting, this._isPaused || this._charSizeService.hasValidSize || this._charSizeService.measure(), !this._isPaused && this._needsFullRefresh && (this._pausedResizeTask.flush(), this.refreshRows(0, this._rowCount - 1), this._needsFullRefresh = !1);
        }
        refreshRows(a, c, v = !1) {
          this._isPaused ? this._needsFullRefresh = !0 : (v || (this._isNextRenderRedrawOnly = !1), this._renderDebouncer.refresh(a, c, this._rowCount));
        }
        _renderRows(a, c) {
          this._renderer.value && (a = Math.min(a, this._rowCount - 1), c = Math.min(c, this._rowCount - 1), this._renderer.value.renderRows(a, c), this._needsSelectionRefresh && (this._renderer.value.handleSelectionChanged(this._selectionState.start, this._selectionState.end, this._selectionState.columnSelectMode), this._needsSelectionRefresh = !1), this._isNextRenderRedrawOnly || this._onRenderedViewportChange.fire({ start: a, end: c }), this._onRender.fire({ start: a, end: c }), this._isNextRenderRedrawOnly = !0);
        }
        resize(a, c) {
          this._rowCount = c, this._fireOnCanvasResize();
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
          this._renderer.value = a, this._renderer.value.onRequestRedraw((c) => this.refreshRows(c.start, c.end, !0)), this._needsSelectionRefresh = !0, this._fullRefresh();
        }
        addRefreshCallback(a) {
          return this._renderDebouncer.addRefreshCallback(a);
        }
        _fullRefresh() {
          this._isPaused ? this._needsFullRefresh = !0 : this.refreshRows(0, this._rowCount - 1);
        }
        clearTextureAtlas() {
          var a, c;
          this._renderer.value && ((c = (a = this._renderer.value).clearTextureAtlas) === null || c === void 0 || c.call(a), this._fullRefresh());
        }
        handleDevicePixelRatioChange() {
          this._charSizeService.measure(), this._renderer.value && (this._renderer.value.handleDevicePixelRatioChange(), this.refreshRows(0, this._rowCount - 1));
        }
        handleResize(a, c) {
          this._renderer.value && (this._isPaused ? this._pausedResizeTask.set(() => this._renderer.value.handleResize(a, c)) : this._renderer.value.handleResize(a, c), this._fullRefresh());
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
        handleSelectionChanged(a, c, v) {
          var m;
          this._selectionState.start = a, this._selectionState.end = c, this._selectionState.columnSelectMode = v, (m = this._renderer.value) === null || m === void 0 || m.handleSelectionChanged(a, c, v);
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
      s.RenderService = i = l([_(2, t.IOptionsService), _(3, p.ICharSizeService), _(4, t.IDecorationService), _(5, t.IBufferService), _(6, p.ICoreBrowserService), _(7, p.IThemeService)], i);
    }, 9312: function(M, s, o) {
      var l = this && this.__decorate || function(h, g, E, S) {
        var y, w = arguments.length, R = w < 3 ? g : S === null ? S = Object.getOwnPropertyDescriptor(g, E) : S;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") R = Reflect.decorate(h, g, E, S);
        else for (var A = h.length - 1; A >= 0; A--) (y = h[A]) && (R = (w < 3 ? y(R) : w > 3 ? y(g, E, R) : y(g, E)) || R);
        return w > 3 && R && Object.defineProperty(g, E, R), R;
      }, _ = this && this.__param || function(h, g) {
        return function(E, S) {
          g(E, S, h);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.SelectionService = void 0;
      const n = o(9806), d = o(9504), f = o(456), p = o(4725), u = o(8460), e = o(844), r = o(6114), t = o(4841), i = o(511), a = o(2585), c = " ", v = new RegExp(c, "g");
      let m = s.SelectionService = class extends e.Disposable {
        constructor(h, g, E, S, y, w, R, A, O) {
          super(), this._element = h, this._screenElement = g, this._linkifier = E, this._bufferService = S, this._coreService = y, this._mouseService = w, this._optionsService = R, this._renderService = A, this._coreBrowserService = O, this._dragScrollAmount = 0, this._enabled = !0, this._workCell = new i.CellData(), this._mouseDownTimeStamp = 0, this._oldHasSelection = !1, this._oldSelectionStart = void 0, this._oldSelectionEnd = void 0, this._onLinuxMouseSelection = this.register(new u.EventEmitter()), this.onLinuxMouseSelection = this._onLinuxMouseSelection.event, this._onRedrawRequest = this.register(new u.EventEmitter()), this.onRequestRedraw = this._onRedrawRequest.event, this._onSelectionChange = this.register(new u.EventEmitter()), this.onSelectionChange = this._onSelectionChange.event, this._onRequestScrollLines = this.register(new u.EventEmitter()), this.onRequestScrollLines = this._onRequestScrollLines.event, this._mouseMoveListener = (I) => this._handleMouseMove(I), this._mouseUpListener = (I) => this._handleMouseUp(I), this._coreService.onUserInput(() => {
            this.hasSelection && this.clearSelection();
          }), this._trimListener = this._bufferService.buffer.lines.onTrim((I) => this._handleTrim(I)), this.register(this._bufferService.buffers.onBufferActivate((I) => this._handleBufferActivate(I))), this.enable(), this._model = new f.SelectionModel(this._bufferService), this._activeSelectionMode = 0, this.register((0, e.toDisposable)(() => {
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
          const h = this._model.finalSelectionStart, g = this._model.finalSelectionEnd;
          return !(!h || !g || h[0] === g[0] && h[1] === g[1]);
        }
        get selectionText() {
          const h = this._model.finalSelectionStart, g = this._model.finalSelectionEnd;
          if (!h || !g) return "";
          const E = this._bufferService.buffer, S = [];
          if (this._activeSelectionMode === 3) {
            if (h[0] === g[0]) return "";
            const y = h[0] < g[0] ? h[0] : g[0], w = h[0] < g[0] ? g[0] : h[0];
            for (let R = h[1]; R <= g[1]; R++) {
              const A = E.translateBufferLineToString(R, !0, y, w);
              S.push(A);
            }
          } else {
            const y = h[1] === g[1] ? g[0] : void 0;
            S.push(E.translateBufferLineToString(h[1], !0, h[0], y));
            for (let w = h[1] + 1; w <= g[1] - 1; w++) {
              const R = E.lines.get(w), A = E.translateBufferLineToString(w, !0);
              R != null && R.isWrapped ? S[S.length - 1] += A : S.push(A);
            }
            if (h[1] !== g[1]) {
              const w = E.lines.get(g[1]), R = E.translateBufferLineToString(g[1], !0, 0, g[0]);
              w && w.isWrapped ? S[S.length - 1] += R : S.push(R);
            }
          }
          return S.map((y) => y.replace(v, " ")).join(r.isWindows ? `\r
` : `
`);
        }
        clearSelection() {
          this._model.clearSelection(), this._removeMouseDownListeners(), this.refresh(), this._onSelectionChange.fire();
        }
        refresh(h) {
          this._refreshAnimationFrame || (this._refreshAnimationFrame = this._coreBrowserService.window.requestAnimationFrame(() => this._refresh())), r.isLinux && h && this.selectionText.length && this._onLinuxMouseSelection.fire(this.selectionText);
        }
        _refresh() {
          this._refreshAnimationFrame = void 0, this._onRedrawRequest.fire({ start: this._model.finalSelectionStart, end: this._model.finalSelectionEnd, columnSelectMode: this._activeSelectionMode === 3 });
        }
        _isClickInSelection(h) {
          const g = this._getMouseBufferCoords(h), E = this._model.finalSelectionStart, S = this._model.finalSelectionEnd;
          return !!(E && S && g) && this._areCoordsInSelection(g, E, S);
        }
        isCellInSelection(h, g) {
          const E = this._model.finalSelectionStart, S = this._model.finalSelectionEnd;
          return !(!E || !S) && this._areCoordsInSelection([h, g], E, S);
        }
        _areCoordsInSelection(h, g, E) {
          return h[1] > g[1] && h[1] < E[1] || g[1] === E[1] && h[1] === g[1] && h[0] >= g[0] && h[0] < E[0] || g[1] < E[1] && h[1] === E[1] && h[0] < E[0] || g[1] < E[1] && h[1] === g[1] && h[0] >= g[0];
        }
        _selectWordAtCursor(h, g) {
          var E, S;
          const y = (S = (E = this._linkifier.currentLink) === null || E === void 0 ? void 0 : E.link) === null || S === void 0 ? void 0 : S.range;
          if (y) return this._model.selectionStart = [y.start.x - 1, y.start.y - 1], this._model.selectionStartLength = (0, t.getRangeLength)(y, this._bufferService.cols), this._model.selectionEnd = void 0, !0;
          const w = this._getMouseBufferCoords(h);
          return !!w && (this._selectWordAt(w, g), this._model.selectionEnd = void 0, !0);
        }
        selectAll() {
          this._model.isSelectAllActive = !0, this.refresh(), this._onSelectionChange.fire();
        }
        selectLines(h, g) {
          this._model.clearSelection(), h = Math.max(h, 0), g = Math.min(g, this._bufferService.buffer.lines.length - 1), this._model.selectionStart = [0, h], this._model.selectionEnd = [this._bufferService.cols, g], this.refresh(), this._onSelectionChange.fire();
        }
        _handleTrim(h) {
          this._model.handleTrim(h) && this.refresh();
        }
        _getMouseBufferCoords(h) {
          const g = this._mouseService.getCoords(h, this._screenElement, this._bufferService.cols, this._bufferService.rows, !0);
          if (g) return g[0]--, g[1]--, g[1] += this._bufferService.buffer.ydisp, g;
        }
        _getMouseEventScrollAmount(h) {
          let g = (0, n.getCoordsRelativeToElement)(this._coreBrowserService.window, h, this._screenElement)[1];
          const E = this._renderService.dimensions.css.canvas.height;
          return g >= 0 && g <= E ? 0 : (g > E && (g -= E), g = Math.min(Math.max(g, -50), 50), g /= 50, g / Math.abs(g) + Math.round(14 * g));
        }
        shouldForceSelection(h) {
          return r.isMac ? h.altKey && this._optionsService.rawOptions.macOptionClickForcesSelection : h.shiftKey;
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
          const g = this._bufferService.buffer.lines.get(this._model.selectionStart[1]);
          g && g.length !== this._model.selectionStart[0] && g.hasWidth(this._model.selectionStart[0]) === 0 && this._model.selectionStart[0]++;
        }
        _handleDoubleClick(h) {
          this._selectWordAtCursor(h, !0) && (this._activeSelectionMode = 1);
        }
        _handleTripleClick(h) {
          const g = this._getMouseBufferCoords(h);
          g && (this._activeSelectionMode = 2, this._selectLineAt(g[1]));
        }
        shouldColumnSelect(h) {
          return h.altKey && !(r.isMac && this._optionsService.rawOptions.macOptionClickForcesSelection);
        }
        _handleMouseMove(h) {
          if (h.stopImmediatePropagation(), !this._model.selectionStart) return;
          const g = this._model.selectionEnd ? [this._model.selectionEnd[0], this._model.selectionEnd[1]] : null;
          if (this._model.selectionEnd = this._getMouseBufferCoords(h), !this._model.selectionEnd) return void this.refresh(!0);
          this._activeSelectionMode === 2 ? this._model.selectionEnd[1] < this._model.selectionStart[1] ? this._model.selectionEnd[0] = 0 : this._model.selectionEnd[0] = this._bufferService.cols : this._activeSelectionMode === 1 && this._selectToWordAt(this._model.selectionEnd), this._dragScrollAmount = this._getMouseEventScrollAmount(h), this._activeSelectionMode !== 3 && (this._dragScrollAmount > 0 ? this._model.selectionEnd[0] = this._bufferService.cols : this._dragScrollAmount < 0 && (this._model.selectionEnd[0] = 0));
          const E = this._bufferService.buffer;
          if (this._model.selectionEnd[1] < E.lines.length) {
            const S = E.lines.get(this._model.selectionEnd[1]);
            S && S.hasWidth(this._model.selectionEnd[0]) === 0 && this._model.selectionEnd[0]++;
          }
          g && g[0] === this._model.selectionEnd[0] && g[1] === this._model.selectionEnd[1] || this.refresh(!0);
        }
        _dragScroll() {
          if (this._model.selectionEnd && this._model.selectionStart && this._dragScrollAmount) {
            this._onRequestScrollLines.fire({ amount: this._dragScrollAmount, suppressScrollEvent: !1 });
            const h = this._bufferService.buffer;
            this._dragScrollAmount > 0 ? (this._activeSelectionMode !== 3 && (this._model.selectionEnd[0] = this._bufferService.cols), this._model.selectionEnd[1] = Math.min(h.ydisp + this._bufferService.rows, h.lines.length - 1)) : (this._activeSelectionMode !== 3 && (this._model.selectionEnd[0] = 0), this._model.selectionEnd[1] = h.ydisp), this.refresh();
          }
        }
        _handleMouseUp(h) {
          const g = h.timeStamp - this._mouseDownTimeStamp;
          if (this._removeMouseDownListeners(), this.selectionText.length <= 1 && g < 500 && h.altKey && this._optionsService.rawOptions.altClickMovesCursor) {
            if (this._bufferService.buffer.ybase === this._bufferService.buffer.ydisp) {
              const E = this._mouseService.getCoords(h, this._element, this._bufferService.cols, this._bufferService.rows, !1);
              if (E && E[0] !== void 0 && E[1] !== void 0) {
                const S = (0, d.moveToCellSequence)(E[0] - 1, E[1] - 1, this._bufferService, this._coreService.decPrivateModes.applicationCursorKeys);
                this._coreService.triggerDataEvent(S, !0);
              }
            }
          } else this._fireEventIfSelectionChanged();
        }
        _fireEventIfSelectionChanged() {
          const h = this._model.finalSelectionStart, g = this._model.finalSelectionEnd, E = !(!h || !g || h[0] === g[0] && h[1] === g[1]);
          E ? h && g && (this._oldSelectionStart && this._oldSelectionEnd && h[0] === this._oldSelectionStart[0] && h[1] === this._oldSelectionStart[1] && g[0] === this._oldSelectionEnd[0] && g[1] === this._oldSelectionEnd[1] || this._fireOnSelectionChange(h, g, E)) : this._oldHasSelection && this._fireOnSelectionChange(h, g, E);
        }
        _fireOnSelectionChange(h, g, E) {
          this._oldSelectionStart = h, this._oldSelectionEnd = g, this._oldHasSelection = E, this._onSelectionChange.fire();
        }
        _handleBufferActivate(h) {
          this.clearSelection(), this._trimListener.dispose(), this._trimListener = h.activeBuffer.lines.onTrim((g) => this._handleTrim(g));
        }
        _convertViewportColToCharacterIndex(h, g) {
          let E = g;
          for (let S = 0; g >= S; S++) {
            const y = h.loadCell(S, this._workCell).getChars().length;
            this._workCell.getWidth() === 0 ? E-- : y > 1 && g !== S && (E += y - 1);
          }
          return E;
        }
        setSelection(h, g, E) {
          this._model.clearSelection(), this._removeMouseDownListeners(), this._model.selectionStart = [h, g], this._model.selectionStartLength = E, this.refresh(), this._fireEventIfSelectionChanged();
        }
        rightClickSelect(h) {
          this._isClickInSelection(h) || (this._selectWordAtCursor(h, !1) && this.refresh(!0), this._fireEventIfSelectionChanged());
        }
        _getWordAt(h, g, E = !0, S = !0) {
          if (h[0] >= this._bufferService.cols) return;
          const y = this._bufferService.buffer, w = y.lines.get(h[1]);
          if (!w) return;
          const R = y.translateBufferLineToString(h[1], !1);
          let A = this._convertViewportColToCharacterIndex(w, h[0]), O = A;
          const I = h[0] - A;
          let C = 0, x = 0, k = 0, L = 0;
          if (R.charAt(A) === " ") {
            for (; A > 0 && R.charAt(A - 1) === " "; ) A--;
            for (; O < R.length && R.charAt(O + 1) === " "; ) O++;
          } else {
            let $ = h[0], j = h[0];
            w.getWidth($) === 0 && (C++, $--), w.getWidth(j) === 2 && (x++, j++);
            const Q = w.getString(j).length;
            for (Q > 1 && (L += Q - 1, O += Q - 1); $ > 0 && A > 0 && !this._isCharWordSeparator(w.loadCell($ - 1, this._workCell)); ) {
              w.loadCell($ - 1, this._workCell);
              const b = this._workCell.getChars().length;
              this._workCell.getWidth() === 0 ? (C++, $--) : b > 1 && (k += b - 1, A -= b - 1), A--, $--;
            }
            for (; j < w.length && O + 1 < R.length && !this._isCharWordSeparator(w.loadCell(j + 1, this._workCell)); ) {
              w.loadCell(j + 1, this._workCell);
              const b = this._workCell.getChars().length;
              this._workCell.getWidth() === 2 ? (x++, j++) : b > 1 && (L += b - 1, O += b - 1), O++, j++;
            }
          }
          O++;
          let H = A + I - C + k, N = Math.min(this._bufferService.cols, O - A + C + x - k - L);
          if (g || R.slice(A, O).trim() !== "") {
            if (E && H === 0 && w.getCodePoint(0) !== 32) {
              const $ = y.lines.get(h[1] - 1);
              if ($ && w.isWrapped && $.getCodePoint(this._bufferService.cols - 1) !== 32) {
                const j = this._getWordAt([this._bufferService.cols - 1, h[1] - 1], !1, !0, !1);
                if (j) {
                  const Q = this._bufferService.cols - j.start;
                  H -= Q, N += Q;
                }
              }
            }
            if (S && H + N === this._bufferService.cols && w.getCodePoint(this._bufferService.cols - 1) !== 32) {
              const $ = y.lines.get(h[1] + 1);
              if ($ != null && $.isWrapped && $.getCodePoint(0) !== 32) {
                const j = this._getWordAt([0, h[1] + 1], !1, !1, !0);
                j && (N += j.length);
              }
            }
            return { start: H, length: N };
          }
        }
        _selectWordAt(h, g) {
          const E = this._getWordAt(h, g);
          if (E) {
            for (; E.start < 0; ) E.start += this._bufferService.cols, h[1]--;
            this._model.selectionStart = [E.start, h[1]], this._model.selectionStartLength = E.length;
          }
        }
        _selectToWordAt(h) {
          const g = this._getWordAt(h, !0);
          if (g) {
            let E = h[1];
            for (; g.start < 0; ) g.start += this._bufferService.cols, E--;
            if (!this._model.areSelectionValuesReversed()) for (; g.start + g.length > this._bufferService.cols; ) g.length -= this._bufferService.cols, E++;
            this._model.selectionEnd = [this._model.areSelectionValuesReversed() ? g.start : g.start + g.length, E];
          }
        }
        _isCharWordSeparator(h) {
          return h.getWidth() !== 0 && this._optionsService.rawOptions.wordSeparator.indexOf(h.getChars()) >= 0;
        }
        _selectLineAt(h) {
          const g = this._bufferService.buffer.getWrappedRangeForLine(h), E = { start: { x: 0, y: g.first }, end: { x: this._bufferService.cols - 1, y: g.last } };
          this._model.selectionStart = [0, g.first], this._model.selectionEnd = void 0, this._model.selectionStartLength = (0, t.getRangeLength)(E, this._bufferService.cols);
        }
      };
      s.SelectionService = m = l([_(3, a.IBufferService), _(4, a.ICoreService), _(5, p.IMouseService), _(6, a.IOptionsService), _(7, p.IRenderService), _(8, p.ICoreBrowserService)], m);
    }, 4725: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.IThemeService = s.ICharacterJoinerService = s.ISelectionService = s.IRenderService = s.IMouseService = s.ICoreBrowserService = s.ICharSizeService = void 0;
      const l = o(8343);
      s.ICharSizeService = (0, l.createDecorator)("CharSizeService"), s.ICoreBrowserService = (0, l.createDecorator)("CoreBrowserService"), s.IMouseService = (0, l.createDecorator)("MouseService"), s.IRenderService = (0, l.createDecorator)("RenderService"), s.ISelectionService = (0, l.createDecorator)("SelectionService"), s.ICharacterJoinerService = (0, l.createDecorator)("CharacterJoinerService"), s.IThemeService = (0, l.createDecorator)("ThemeService");
    }, 6731: function(M, s, o) {
      var l = this && this.__decorate || function(m, h, g, E) {
        var S, y = arguments.length, w = y < 3 ? h : E === null ? E = Object.getOwnPropertyDescriptor(h, g) : E;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") w = Reflect.decorate(m, h, g, E);
        else for (var R = m.length - 1; R >= 0; R--) (S = m[R]) && (w = (y < 3 ? S(w) : y > 3 ? S(h, g, w) : S(h, g)) || w);
        return y > 3 && w && Object.defineProperty(h, g, w), w;
      }, _ = this && this.__param || function(m, h) {
        return function(g, E) {
          h(g, E, m);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ThemeService = s.DEFAULT_ANSI_COLORS = void 0;
      const n = o(7239), d = o(8055), f = o(8460), p = o(844), u = o(2585), e = d.css.toColor("#ffffff"), r = d.css.toColor("#000000"), t = d.css.toColor("#ffffff"), i = d.css.toColor("#000000"), a = { css: "rgba(255, 255, 255, 0.3)", rgba: 4294967117 };
      s.DEFAULT_ANSI_COLORS = Object.freeze((() => {
        const m = [d.css.toColor("#2e3436"), d.css.toColor("#cc0000"), d.css.toColor("#4e9a06"), d.css.toColor("#c4a000"), d.css.toColor("#3465a4"), d.css.toColor("#75507b"), d.css.toColor("#06989a"), d.css.toColor("#d3d7cf"), d.css.toColor("#555753"), d.css.toColor("#ef2929"), d.css.toColor("#8ae234"), d.css.toColor("#fce94f"), d.css.toColor("#729fcf"), d.css.toColor("#ad7fa8"), d.css.toColor("#34e2e2"), d.css.toColor("#eeeeec")], h = [0, 95, 135, 175, 215, 255];
        for (let g = 0; g < 216; g++) {
          const E = h[g / 36 % 6 | 0], S = h[g / 6 % 6 | 0], y = h[g % 6];
          m.push({ css: d.channels.toCss(E, S, y), rgba: d.channels.toRgba(E, S, y) });
        }
        for (let g = 0; g < 24; g++) {
          const E = 8 + 10 * g;
          m.push({ css: d.channels.toCss(E, E, E), rgba: d.channels.toRgba(E, E, E) });
        }
        return m;
      })());
      let c = s.ThemeService = class extends p.Disposable {
        get colors() {
          return this._colors;
        }
        constructor(m) {
          super(), this._optionsService = m, this._contrastCache = new n.ColorContrastCache(), this._halfContrastCache = new n.ColorContrastCache(), this._onChangeColors = this.register(new f.EventEmitter()), this.onChangeColors = this._onChangeColors.event, this._colors = { foreground: e, background: r, cursor: t, cursorAccent: i, selectionForeground: void 0, selectionBackgroundTransparent: a, selectionBackgroundOpaque: d.color.blend(r, a), selectionInactiveBackgroundTransparent: a, selectionInactiveBackgroundOpaque: d.color.blend(r, a), ansi: s.DEFAULT_ANSI_COLORS.slice(), contrastCache: this._contrastCache, halfContrastCache: this._halfContrastCache }, this._updateRestoreColors(), this._setTheme(this._optionsService.rawOptions.theme), this.register(this._optionsService.onSpecificOptionChange("minimumContrastRatio", () => this._contrastCache.clear())), this.register(this._optionsService.onSpecificOptionChange("theme", () => this._setTheme(this._optionsService.rawOptions.theme)));
        }
        _setTheme(m = {}) {
          const h = this._colors;
          if (h.foreground = v(m.foreground, e), h.background = v(m.background, r), h.cursor = v(m.cursor, t), h.cursorAccent = v(m.cursorAccent, i), h.selectionBackgroundTransparent = v(m.selectionBackground, a), h.selectionBackgroundOpaque = d.color.blend(h.background, h.selectionBackgroundTransparent), h.selectionInactiveBackgroundTransparent = v(m.selectionInactiveBackground, h.selectionBackgroundTransparent), h.selectionInactiveBackgroundOpaque = d.color.blend(h.background, h.selectionInactiveBackgroundTransparent), h.selectionForeground = m.selectionForeground ? v(m.selectionForeground, d.NULL_COLOR) : void 0, h.selectionForeground === d.NULL_COLOR && (h.selectionForeground = void 0), d.color.isOpaque(h.selectionBackgroundTransparent) && (h.selectionBackgroundTransparent = d.color.opacity(h.selectionBackgroundTransparent, 0.3)), d.color.isOpaque(h.selectionInactiveBackgroundTransparent) && (h.selectionInactiveBackgroundTransparent = d.color.opacity(h.selectionInactiveBackgroundTransparent, 0.3)), h.ansi = s.DEFAULT_ANSI_COLORS.slice(), h.ansi[0] = v(m.black, s.DEFAULT_ANSI_COLORS[0]), h.ansi[1] = v(m.red, s.DEFAULT_ANSI_COLORS[1]), h.ansi[2] = v(m.green, s.DEFAULT_ANSI_COLORS[2]), h.ansi[3] = v(m.yellow, s.DEFAULT_ANSI_COLORS[3]), h.ansi[4] = v(m.blue, s.DEFAULT_ANSI_COLORS[4]), h.ansi[5] = v(m.magenta, s.DEFAULT_ANSI_COLORS[5]), h.ansi[6] = v(m.cyan, s.DEFAULT_ANSI_COLORS[6]), h.ansi[7] = v(m.white, s.DEFAULT_ANSI_COLORS[7]), h.ansi[8] = v(m.brightBlack, s.DEFAULT_ANSI_COLORS[8]), h.ansi[9] = v(m.brightRed, s.DEFAULT_ANSI_COLORS[9]), h.ansi[10] = v(m.brightGreen, s.DEFAULT_ANSI_COLORS[10]), h.ansi[11] = v(m.brightYellow, s.DEFAULT_ANSI_COLORS[11]), h.ansi[12] = v(m.brightBlue, s.DEFAULT_ANSI_COLORS[12]), h.ansi[13] = v(m.brightMagenta, s.DEFAULT_ANSI_COLORS[13]), h.ansi[14] = v(m.brightCyan, s.DEFAULT_ANSI_COLORS[14]), h.ansi[15] = v(m.brightWhite, s.DEFAULT_ANSI_COLORS[15]), m.extendedAnsi) {
            const g = Math.min(h.ansi.length - 16, m.extendedAnsi.length);
            for (let E = 0; E < g; E++) h.ansi[E + 16] = v(m.extendedAnsi[E], s.DEFAULT_ANSI_COLORS[E + 16]);
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
      function v(m, h) {
        if (m !== void 0) try {
          return d.css.toColor(m);
        } catch {
        }
        return h;
      }
      s.ThemeService = c = l([_(0, u.IOptionsService)], c);
    }, 6349: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CircularList = void 0;
      const l = o(8460), _ = o(844);
      class n extends _.Disposable {
        constructor(f) {
          super(), this._maxLength = f, this.onDeleteEmitter = this.register(new l.EventEmitter()), this.onDelete = this.onDeleteEmitter.event, this.onInsertEmitter = this.register(new l.EventEmitter()), this.onInsert = this.onInsertEmitter.event, this.onTrimEmitter = this.register(new l.EventEmitter()), this.onTrim = this.onTrimEmitter.event, this._array = new Array(this._maxLength), this._startIndex = 0, this._length = 0;
        }
        get maxLength() {
          return this._maxLength;
        }
        set maxLength(f) {
          if (this._maxLength === f) return;
          const p = new Array(f);
          for (let u = 0; u < Math.min(f, this.length); u++) p[u] = this._array[this._getCyclicIndex(u)];
          this._array = p, this._maxLength = f, this._startIndex = 0;
        }
        get length() {
          return this._length;
        }
        set length(f) {
          if (f > this._length) for (let p = this._length; p < f; p++) this._array[p] = void 0;
          this._length = f;
        }
        get(f) {
          return this._array[this._getCyclicIndex(f)];
        }
        set(f, p) {
          this._array[this._getCyclicIndex(f)] = p;
        }
        push(f) {
          this._array[this._getCyclicIndex(this._length)] = f, this._length === this._maxLength ? (this._startIndex = ++this._startIndex % this._maxLength, this.onTrimEmitter.fire(1)) : this._length++;
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
        splice(f, p, ...u) {
          if (p) {
            for (let e = f; e < this._length - p; e++) this._array[this._getCyclicIndex(e)] = this._array[this._getCyclicIndex(e + p)];
            this._length -= p, this.onDeleteEmitter.fire({ index: f, amount: p });
          }
          for (let e = this._length - 1; e >= f; e--) this._array[this._getCyclicIndex(e + u.length)] = this._array[this._getCyclicIndex(e)];
          for (let e = 0; e < u.length; e++) this._array[this._getCyclicIndex(f + e)] = u[e];
          if (u.length && this.onInsertEmitter.fire({ index: f, amount: u.length }), this._length + u.length > this._maxLength) {
            const e = this._length + u.length - this._maxLength;
            this._startIndex += e, this._length = this._maxLength, this.onTrimEmitter.fire(e);
          } else this._length += u.length;
        }
        trimStart(f) {
          f > this._length && (f = this._length), this._startIndex += f, this._length -= f, this.onTrimEmitter.fire(f);
        }
        shiftElements(f, p, u) {
          if (!(p <= 0)) {
            if (f < 0 || f >= this._length) throw new Error("start argument out of range");
            if (f + u < 0) throw new Error("Cannot shift elements in list beyond index 0");
            if (u > 0) {
              for (let r = p - 1; r >= 0; r--) this.set(f + r + u, this.get(f + r));
              const e = f + p + u - this._length;
              if (e > 0) for (this._length += e; this._length > this._maxLength; ) this._length--, this._startIndex++, this.onTrimEmitter.fire(1);
            } else for (let e = 0; e < p; e++) this.set(f + e + u, this.get(f + e));
          }
        }
        _getCyclicIndex(f) {
          return (this._startIndex + f) % this._maxLength;
        }
      }
      s.CircularList = n;
    }, 1439: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.clone = void 0, s.clone = function o(l, _ = 5) {
        if (typeof l != "object") return l;
        const n = Array.isArray(l) ? [] : {};
        for (const d in l) n[d] = _ <= 1 ? l[d] : l[d] && o(l[d], _ - 1);
        return n;
      };
    }, 8055: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.contrastRatio = s.toPaddedHex = s.rgba = s.rgb = s.css = s.color = s.channels = s.NULL_COLOR = void 0;
      const l = o(6114);
      let _ = 0, n = 0, d = 0, f = 0;
      var p, u, e, r, t;
      function i(c) {
        const v = c.toString(16);
        return v.length < 2 ? "0" + v : v;
      }
      function a(c, v) {
        return c < v ? (v + 0.05) / (c + 0.05) : (c + 0.05) / (v + 0.05);
      }
      s.NULL_COLOR = { css: "#00000000", rgba: 0 }, function(c) {
        c.toCss = function(v, m, h, g) {
          return g !== void 0 ? `#${i(v)}${i(m)}${i(h)}${i(g)}` : `#${i(v)}${i(m)}${i(h)}`;
        }, c.toRgba = function(v, m, h, g = 255) {
          return (v << 24 | m << 16 | h << 8 | g) >>> 0;
        };
      }(p || (s.channels = p = {})), function(c) {
        function v(m, h) {
          return f = Math.round(255 * h), [_, n, d] = t.toChannels(m.rgba), { css: p.toCss(_, n, d, f), rgba: p.toRgba(_, n, d, f) };
        }
        c.blend = function(m, h) {
          if (f = (255 & h.rgba) / 255, f === 1) return { css: h.css, rgba: h.rgba };
          const g = h.rgba >> 24 & 255, E = h.rgba >> 16 & 255, S = h.rgba >> 8 & 255, y = m.rgba >> 24 & 255, w = m.rgba >> 16 & 255, R = m.rgba >> 8 & 255;
          return _ = y + Math.round((g - y) * f), n = w + Math.round((E - w) * f), d = R + Math.round((S - R) * f), { css: p.toCss(_, n, d), rgba: p.toRgba(_, n, d) };
        }, c.isOpaque = function(m) {
          return (255 & m.rgba) == 255;
        }, c.ensureContrastRatio = function(m, h, g) {
          const E = t.ensureContrastRatio(m.rgba, h.rgba, g);
          if (E) return t.toColor(E >> 24 & 255, E >> 16 & 255, E >> 8 & 255);
        }, c.opaque = function(m) {
          const h = (255 | m.rgba) >>> 0;
          return [_, n, d] = t.toChannels(h), { css: p.toCss(_, n, d), rgba: h };
        }, c.opacity = v, c.multiplyOpacity = function(m, h) {
          return f = 255 & m.rgba, v(m, f * h / 255);
        }, c.toColorRGB = function(m) {
          return [m.rgba >> 24 & 255, m.rgba >> 16 & 255, m.rgba >> 8 & 255];
        };
      }(u || (s.color = u = {})), function(c) {
        let v, m;
        if (!l.isNode) {
          const h = document.createElement("canvas");
          h.width = 1, h.height = 1;
          const g = h.getContext("2d", { willReadFrequently: !0 });
          g && (v = g, v.globalCompositeOperation = "copy", m = v.createLinearGradient(0, 0, 1, 1));
        }
        c.toColor = function(h) {
          if (h.match(/#[\da-f]{3,8}/i)) switch (h.length) {
            case 4:
              return _ = parseInt(h.slice(1, 2).repeat(2), 16), n = parseInt(h.slice(2, 3).repeat(2), 16), d = parseInt(h.slice(3, 4).repeat(2), 16), t.toColor(_, n, d);
            case 5:
              return _ = parseInt(h.slice(1, 2).repeat(2), 16), n = parseInt(h.slice(2, 3).repeat(2), 16), d = parseInt(h.slice(3, 4).repeat(2), 16), f = parseInt(h.slice(4, 5).repeat(2), 16), t.toColor(_, n, d, f);
            case 7:
              return { css: h, rgba: (parseInt(h.slice(1), 16) << 8 | 255) >>> 0 };
            case 9:
              return { css: h, rgba: parseInt(h.slice(1), 16) >>> 0 };
          }
          const g = h.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0|1|\d?\.(\d+))\s*)?\)/);
          if (g) return _ = parseInt(g[1]), n = parseInt(g[2]), d = parseInt(g[3]), f = Math.round(255 * (g[5] === void 0 ? 1 : parseFloat(g[5]))), t.toColor(_, n, d, f);
          if (!v || !m) throw new Error("css.toColor: Unsupported css format");
          if (v.fillStyle = m, v.fillStyle = h, typeof v.fillStyle != "string") throw new Error("css.toColor: Unsupported css format");
          if (v.fillRect(0, 0, 1, 1), [_, n, d, f] = v.getImageData(0, 0, 1, 1).data, f !== 255) throw new Error("css.toColor: Unsupported css format");
          return { rgba: p.toRgba(_, n, d, f), css: h };
        };
      }(e || (s.css = e = {})), function(c) {
        function v(m, h, g) {
          const E = m / 255, S = h / 255, y = g / 255;
          return 0.2126 * (E <= 0.03928 ? E / 12.92 : Math.pow((E + 0.055) / 1.055, 2.4)) + 0.7152 * (S <= 0.03928 ? S / 12.92 : Math.pow((S + 0.055) / 1.055, 2.4)) + 0.0722 * (y <= 0.03928 ? y / 12.92 : Math.pow((y + 0.055) / 1.055, 2.4));
        }
        c.relativeLuminance = function(m) {
          return v(m >> 16 & 255, m >> 8 & 255, 255 & m);
        }, c.relativeLuminance2 = v;
      }(r || (s.rgb = r = {})), function(c) {
        function v(h, g, E) {
          const S = h >> 24 & 255, y = h >> 16 & 255, w = h >> 8 & 255;
          let R = g >> 24 & 255, A = g >> 16 & 255, O = g >> 8 & 255, I = a(r.relativeLuminance2(R, A, O), r.relativeLuminance2(S, y, w));
          for (; I < E && (R > 0 || A > 0 || O > 0); ) R -= Math.max(0, Math.ceil(0.1 * R)), A -= Math.max(0, Math.ceil(0.1 * A)), O -= Math.max(0, Math.ceil(0.1 * O)), I = a(r.relativeLuminance2(R, A, O), r.relativeLuminance2(S, y, w));
          return (R << 24 | A << 16 | O << 8 | 255) >>> 0;
        }
        function m(h, g, E) {
          const S = h >> 24 & 255, y = h >> 16 & 255, w = h >> 8 & 255;
          let R = g >> 24 & 255, A = g >> 16 & 255, O = g >> 8 & 255, I = a(r.relativeLuminance2(R, A, O), r.relativeLuminance2(S, y, w));
          for (; I < E && (R < 255 || A < 255 || O < 255); ) R = Math.min(255, R + Math.ceil(0.1 * (255 - R))), A = Math.min(255, A + Math.ceil(0.1 * (255 - A))), O = Math.min(255, O + Math.ceil(0.1 * (255 - O))), I = a(r.relativeLuminance2(R, A, O), r.relativeLuminance2(S, y, w));
          return (R << 24 | A << 16 | O << 8 | 255) >>> 0;
        }
        c.ensureContrastRatio = function(h, g, E) {
          const S = r.relativeLuminance(h >> 8), y = r.relativeLuminance(g >> 8);
          if (a(S, y) < E) {
            if (y < S) {
              const A = v(h, g, E), O = a(S, r.relativeLuminance(A >> 8));
              if (O < E) {
                const I = m(h, g, E);
                return O > a(S, r.relativeLuminance(I >> 8)) ? A : I;
              }
              return A;
            }
            const w = m(h, g, E), R = a(S, r.relativeLuminance(w >> 8));
            if (R < E) {
              const A = v(h, g, E);
              return R > a(S, r.relativeLuminance(A >> 8)) ? w : A;
            }
            return w;
          }
        }, c.reduceLuminance = v, c.increaseLuminance = m, c.toChannels = function(h) {
          return [h >> 24 & 255, h >> 16 & 255, h >> 8 & 255, 255 & h];
        }, c.toColor = function(h, g, E, S) {
          return { css: p.toCss(h, g, E, S), rgba: p.toRgba(h, g, E, S) };
        };
      }(t || (s.rgba = t = {})), s.toPaddedHex = i, s.contrastRatio = a;
    }, 8969: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CoreTerminal = void 0;
      const l = o(844), _ = o(2585), n = o(4348), d = o(7866), f = o(744), p = o(7302), u = o(6975), e = o(8460), r = o(1753), t = o(1480), i = o(7994), a = o(9282), c = o(5435), v = o(5981), m = o(2660);
      let h = !1;
      class g extends l.Disposable {
        get onScroll() {
          return this._onScrollApi || (this._onScrollApi = this.register(new e.EventEmitter()), this._onScroll.event((S) => {
            var y;
            (y = this._onScrollApi) === null || y === void 0 || y.fire(S.position);
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
        set options(S) {
          for (const y in S) this.optionsService.options[y] = S[y];
        }
        constructor(S) {
          super(), this._windowsWrappingHeuristics = this.register(new l.MutableDisposable()), this._onBinary = this.register(new e.EventEmitter()), this.onBinary = this._onBinary.event, this._onData = this.register(new e.EventEmitter()), this.onData = this._onData.event, this._onLineFeed = this.register(new e.EventEmitter()), this.onLineFeed = this._onLineFeed.event, this._onResize = this.register(new e.EventEmitter()), this.onResize = this._onResize.event, this._onWriteParsed = this.register(new e.EventEmitter()), this.onWriteParsed = this._onWriteParsed.event, this._onScroll = this.register(new e.EventEmitter()), this._instantiationService = new n.InstantiationService(), this.optionsService = this.register(new p.OptionsService(S)), this._instantiationService.setService(_.IOptionsService, this.optionsService), this._bufferService = this.register(this._instantiationService.createInstance(f.BufferService)), this._instantiationService.setService(_.IBufferService, this._bufferService), this._logService = this.register(this._instantiationService.createInstance(d.LogService)), this._instantiationService.setService(_.ILogService, this._logService), this.coreService = this.register(this._instantiationService.createInstance(u.CoreService)), this._instantiationService.setService(_.ICoreService, this.coreService), this.coreMouseService = this.register(this._instantiationService.createInstance(r.CoreMouseService)), this._instantiationService.setService(_.ICoreMouseService, this.coreMouseService), this.unicodeService = this.register(this._instantiationService.createInstance(t.UnicodeService)), this._instantiationService.setService(_.IUnicodeService, this.unicodeService), this._charsetService = this._instantiationService.createInstance(i.CharsetService), this._instantiationService.setService(_.ICharsetService, this._charsetService), this._oscLinkService = this._instantiationService.createInstance(m.OscLinkService), this._instantiationService.setService(_.IOscLinkService, this._oscLinkService), this._inputHandler = this.register(new c.InputHandler(this._bufferService, this._charsetService, this.coreService, this._logService, this.optionsService, this._oscLinkService, this.coreMouseService, this.unicodeService)), this.register((0, e.forwardEvent)(this._inputHandler.onLineFeed, this._onLineFeed)), this.register(this._inputHandler), this.register((0, e.forwardEvent)(this._bufferService.onResize, this._onResize)), this.register((0, e.forwardEvent)(this.coreService.onData, this._onData)), this.register((0, e.forwardEvent)(this.coreService.onBinary, this._onBinary)), this.register(this.coreService.onRequestScrollToBottom(() => this.scrollToBottom())), this.register(this.coreService.onUserInput(() => this._writeBuffer.handleUserInput())), this.register(this.optionsService.onMultipleOptionChange(["windowsMode", "windowsPty"], () => this._handleWindowsPtyOptionChange())), this.register(this._bufferService.onScroll((y) => {
            this._onScroll.fire({ position: this._bufferService.buffer.ydisp, source: 0 }), this._inputHandler.markRangeDirty(this._bufferService.buffer.scrollTop, this._bufferService.buffer.scrollBottom);
          })), this.register(this._inputHandler.onScroll((y) => {
            this._onScroll.fire({ position: this._bufferService.buffer.ydisp, source: 0 }), this._inputHandler.markRangeDirty(this._bufferService.buffer.scrollTop, this._bufferService.buffer.scrollBottom);
          })), this._writeBuffer = this.register(new v.WriteBuffer((y, w) => this._inputHandler.parse(y, w))), this.register((0, e.forwardEvent)(this._writeBuffer.onWriteParsed, this._onWriteParsed));
        }
        write(S, y) {
          this._writeBuffer.write(S, y);
        }
        writeSync(S, y) {
          this._logService.logLevel <= _.LogLevelEnum.WARN && !h && (this._logService.warn("writeSync is unreliable and will be removed soon."), h = !0), this._writeBuffer.writeSync(S, y);
        }
        resize(S, y) {
          isNaN(S) || isNaN(y) || (S = Math.max(S, f.MINIMUM_COLS), y = Math.max(y, f.MINIMUM_ROWS), this._bufferService.resize(S, y));
        }
        scroll(S, y = !1) {
          this._bufferService.scroll(S, y);
        }
        scrollLines(S, y, w) {
          this._bufferService.scrollLines(S, y, w);
        }
        scrollPages(S) {
          this.scrollLines(S * (this.rows - 1));
        }
        scrollToTop() {
          this.scrollLines(-this._bufferService.buffer.ydisp);
        }
        scrollToBottom() {
          this.scrollLines(this._bufferService.buffer.ybase - this._bufferService.buffer.ydisp);
        }
        scrollToLine(S) {
          const y = S - this._bufferService.buffer.ydisp;
          y !== 0 && this.scrollLines(y);
        }
        registerEscHandler(S, y) {
          return this._inputHandler.registerEscHandler(S, y);
        }
        registerDcsHandler(S, y) {
          return this._inputHandler.registerDcsHandler(S, y);
        }
        registerCsiHandler(S, y) {
          return this._inputHandler.registerCsiHandler(S, y);
        }
        registerOscHandler(S, y) {
          return this._inputHandler.registerOscHandler(S, y);
        }
        _setup() {
          this._handleWindowsPtyOptionChange();
        }
        reset() {
          this._inputHandler.reset(), this._bufferService.reset(), this._charsetService.reset(), this.coreService.reset(), this.coreMouseService.reset();
        }
        _handleWindowsPtyOptionChange() {
          let S = !1;
          const y = this.optionsService.rawOptions.windowsPty;
          y && y.buildNumber !== void 0 && y.buildNumber !== void 0 ? S = y.backend === "conpty" && y.buildNumber < 21376 : this.optionsService.rawOptions.windowsMode && (S = !0), S ? this._enableWindowsWrappingHeuristics() : this._windowsWrappingHeuristics.clear();
        }
        _enableWindowsWrappingHeuristics() {
          if (!this._windowsWrappingHeuristics.value) {
            const S = [];
            S.push(this.onLineFeed(a.updateWindowsModeWrappedState.bind(null, this._bufferService))), S.push(this.registerCsiHandler({ final: "H" }, () => ((0, a.updateWindowsModeWrappedState)(this._bufferService), !1))), this._windowsWrappingHeuristics.value = (0, l.toDisposable)(() => {
              for (const y of S) y.dispose();
            });
          }
        }
      }
      s.CoreTerminal = g;
    }, 8460: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.forwardEvent = s.EventEmitter = void 0, s.EventEmitter = class {
        constructor() {
          this._listeners = [], this._disposed = !1;
        }
        get event() {
          return this._event || (this._event = (o) => (this._listeners.push(o), { dispose: () => {
            if (!this._disposed) {
              for (let l = 0; l < this._listeners.length; l++) if (this._listeners[l] === o) return void this._listeners.splice(l, 1);
            }
          } })), this._event;
        }
        fire(o, l) {
          const _ = [];
          for (let n = 0; n < this._listeners.length; n++) _.push(this._listeners[n]);
          for (let n = 0; n < _.length; n++) _[n].call(void 0, o, l);
        }
        dispose() {
          this.clearListeners(), this._disposed = !0;
        }
        clearListeners() {
          this._listeners && (this._listeners.length = 0);
        }
      }, s.forwardEvent = function(o, l) {
        return o((_) => l.fire(_));
      };
    }, 5435: function(M, s, o) {
      var l = this && this.__decorate || function(I, C, x, k) {
        var L, H = arguments.length, N = H < 3 ? C : k === null ? k = Object.getOwnPropertyDescriptor(C, x) : k;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") N = Reflect.decorate(I, C, x, k);
        else for (var $ = I.length - 1; $ >= 0; $--) (L = I[$]) && (N = (H < 3 ? L(N) : H > 3 ? L(C, x, N) : L(C, x)) || N);
        return H > 3 && N && Object.defineProperty(C, x, N), N;
      }, _ = this && this.__param || function(I, C) {
        return function(x, k) {
          C(x, k, I);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.InputHandler = s.WindowsOptionsReportType = void 0;
      const n = o(2584), d = o(7116), f = o(2015), p = o(844), u = o(482), e = o(8437), r = o(8460), t = o(643), i = o(511), a = o(3734), c = o(2585), v = o(6242), m = o(6351), h = o(5941), g = { "(": 0, ")": 1, "*": 2, "+": 3, "-": 1, ".": 2 }, E = 131072;
      function S(I, C) {
        if (I > 24) return C.setWinLines || !1;
        switch (I) {
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
      (function(I) {
        I[I.GET_WIN_SIZE_PIXELS = 0] = "GET_WIN_SIZE_PIXELS", I[I.GET_CELL_SIZE_PIXELS = 1] = "GET_CELL_SIZE_PIXELS";
      })(y || (s.WindowsOptionsReportType = y = {}));
      let w = 0;
      class R extends p.Disposable {
        getAttrData() {
          return this._curAttrData;
        }
        constructor(C, x, k, L, H, N, $, j, Q = new f.EscapeSequenceParser()) {
          super(), this._bufferService = C, this._charsetService = x, this._coreService = k, this._logService = L, this._optionsService = H, this._oscLinkService = N, this._coreMouseService = $, this._unicodeService = j, this._parser = Q, this._parseBuffer = new Uint32Array(4096), this._stringDecoder = new u.StringToUtf32(), this._utf8Decoder = new u.Utf8ToUtf32(), this._workCell = new i.CellData(), this._windowTitle = "", this._iconName = "", this._windowTitleStack = [], this._iconNameStack = [], this._curAttrData = e.DEFAULT_ATTR_DATA.clone(), this._eraseAttrDataInternal = e.DEFAULT_ATTR_DATA.clone(), this._onRequestBell = this.register(new r.EventEmitter()), this.onRequestBell = this._onRequestBell.event, this._onRequestRefreshRows = this.register(new r.EventEmitter()), this.onRequestRefreshRows = this._onRequestRefreshRows.event, this._onRequestReset = this.register(new r.EventEmitter()), this.onRequestReset = this._onRequestReset.event, this._onRequestSendFocus = this.register(new r.EventEmitter()), this.onRequestSendFocus = this._onRequestSendFocus.event, this._onRequestSyncScrollBar = this.register(new r.EventEmitter()), this.onRequestSyncScrollBar = this._onRequestSyncScrollBar.event, this._onRequestWindowsOptionsReport = this.register(new r.EventEmitter()), this.onRequestWindowsOptionsReport = this._onRequestWindowsOptionsReport.event, this._onA11yChar = this.register(new r.EventEmitter()), this.onA11yChar = this._onA11yChar.event, this._onA11yTab = this.register(new r.EventEmitter()), this.onA11yTab = this._onA11yTab.event, this._onCursorMove = this.register(new r.EventEmitter()), this.onCursorMove = this._onCursorMove.event, this._onLineFeed = this.register(new r.EventEmitter()), this.onLineFeed = this._onLineFeed.event, this._onScroll = this.register(new r.EventEmitter()), this.onScroll = this._onScroll.event, this._onTitleChange = this.register(new r.EventEmitter()), this.onTitleChange = this._onTitleChange.event, this._onColor = this.register(new r.EventEmitter()), this.onColor = this._onColor.event, this._parseStack = { paused: !1, cursorStartX: 0, cursorStartY: 0, decodedLength: 0, position: 0 }, this._specialColors = [256, 257, 258], this.register(this._parser), this._dirtyRowTracker = new A(this._bufferService), this._activeBuffer = this._bufferService.buffer, this.register(this._bufferService.buffers.onBufferActivate((b) => this._activeBuffer = b.activeBuffer)), this._parser.setCsiHandlerFallback((b, D) => {
            this._logService.debug("Unknown CSI code: ", { identifier: this._parser.identToString(b), params: D.toArray() });
          }), this._parser.setEscHandlerFallback((b) => {
            this._logService.debug("Unknown ESC code: ", { identifier: this._parser.identToString(b) });
          }), this._parser.setExecuteHandlerFallback((b) => {
            this._logService.debug("Unknown EXECUTE code: ", { code: b });
          }), this._parser.setOscHandlerFallback((b, D, T) => {
            this._logService.debug("Unknown OSC code: ", { identifier: b, action: D, data: T });
          }), this._parser.setDcsHandlerFallback((b, D, T) => {
            D === "HOOK" && (T = T.toArray()), this._logService.debug("Unknown DCS code: ", { identifier: this._parser.identToString(b), action: D, payload: T });
          }), this._parser.setPrintHandler((b, D, T) => this.print(b, D, T)), this._parser.registerCsiHandler({ final: "@" }, (b) => this.insertChars(b)), this._parser.registerCsiHandler({ intermediates: " ", final: "@" }, (b) => this.scrollLeft(b)), this._parser.registerCsiHandler({ final: "A" }, (b) => this.cursorUp(b)), this._parser.registerCsiHandler({ intermediates: " ", final: "A" }, (b) => this.scrollRight(b)), this._parser.registerCsiHandler({ final: "B" }, (b) => this.cursorDown(b)), this._parser.registerCsiHandler({ final: "C" }, (b) => this.cursorForward(b)), this._parser.registerCsiHandler({ final: "D" }, (b) => this.cursorBackward(b)), this._parser.registerCsiHandler({ final: "E" }, (b) => this.cursorNextLine(b)), this._parser.registerCsiHandler({ final: "F" }, (b) => this.cursorPrecedingLine(b)), this._parser.registerCsiHandler({ final: "G" }, (b) => this.cursorCharAbsolute(b)), this._parser.registerCsiHandler({ final: "H" }, (b) => this.cursorPosition(b)), this._parser.registerCsiHandler({ final: "I" }, (b) => this.cursorForwardTab(b)), this._parser.registerCsiHandler({ final: "J" }, (b) => this.eraseInDisplay(b, !1)), this._parser.registerCsiHandler({ prefix: "?", final: "J" }, (b) => this.eraseInDisplay(b, !0)), this._parser.registerCsiHandler({ final: "K" }, (b) => this.eraseInLine(b, !1)), this._parser.registerCsiHandler({ prefix: "?", final: "K" }, (b) => this.eraseInLine(b, !0)), this._parser.registerCsiHandler({ final: "L" }, (b) => this.insertLines(b)), this._parser.registerCsiHandler({ final: "M" }, (b) => this.deleteLines(b)), this._parser.registerCsiHandler({ final: "P" }, (b) => this.deleteChars(b)), this._parser.registerCsiHandler({ final: "S" }, (b) => this.scrollUp(b)), this._parser.registerCsiHandler({ final: "T" }, (b) => this.scrollDown(b)), this._parser.registerCsiHandler({ final: "X" }, (b) => this.eraseChars(b)), this._parser.registerCsiHandler({ final: "Z" }, (b) => this.cursorBackwardTab(b)), this._parser.registerCsiHandler({ final: "`" }, (b) => this.charPosAbsolute(b)), this._parser.registerCsiHandler({ final: "a" }, (b) => this.hPositionRelative(b)), this._parser.registerCsiHandler({ final: "b" }, (b) => this.repeatPrecedingCharacter(b)), this._parser.registerCsiHandler({ final: "c" }, (b) => this.sendDeviceAttributesPrimary(b)), this._parser.registerCsiHandler({ prefix: ">", final: "c" }, (b) => this.sendDeviceAttributesSecondary(b)), this._parser.registerCsiHandler({ final: "d" }, (b) => this.linePosAbsolute(b)), this._parser.registerCsiHandler({ final: "e" }, (b) => this.vPositionRelative(b)), this._parser.registerCsiHandler({ final: "f" }, (b) => this.hVPosition(b)), this._parser.registerCsiHandler({ final: "g" }, (b) => this.tabClear(b)), this._parser.registerCsiHandler({ final: "h" }, (b) => this.setMode(b)), this._parser.registerCsiHandler({ prefix: "?", final: "h" }, (b) => this.setModePrivate(b)), this._parser.registerCsiHandler({ final: "l" }, (b) => this.resetMode(b)), this._parser.registerCsiHandler({ prefix: "?", final: "l" }, (b) => this.resetModePrivate(b)), this._parser.registerCsiHandler({ final: "m" }, (b) => this.charAttributes(b)), this._parser.registerCsiHandler({ final: "n" }, (b) => this.deviceStatus(b)), this._parser.registerCsiHandler({ prefix: "?", final: "n" }, (b) => this.deviceStatusPrivate(b)), this._parser.registerCsiHandler({ intermediates: "!", final: "p" }, (b) => this.softReset(b)), this._parser.registerCsiHandler({ intermediates: " ", final: "q" }, (b) => this.setCursorStyle(b)), this._parser.registerCsiHandler({ final: "r" }, (b) => this.setScrollRegion(b)), this._parser.registerCsiHandler({ final: "s" }, (b) => this.saveCursor(b)), this._parser.registerCsiHandler({ final: "t" }, (b) => this.windowOptions(b)), this._parser.registerCsiHandler({ final: "u" }, (b) => this.restoreCursor(b)), this._parser.registerCsiHandler({ intermediates: "'", final: "}" }, (b) => this.insertColumns(b)), this._parser.registerCsiHandler({ intermediates: "'", final: "~" }, (b) => this.deleteColumns(b)), this._parser.registerCsiHandler({ intermediates: '"', final: "q" }, (b) => this.selectProtected(b)), this._parser.registerCsiHandler({ intermediates: "$", final: "p" }, (b) => this.requestMode(b, !0)), this._parser.registerCsiHandler({ prefix: "?", intermediates: "$", final: "p" }, (b) => this.requestMode(b, !1)), this._parser.setExecuteHandler(n.C0.BEL, () => this.bell()), this._parser.setExecuteHandler(n.C0.LF, () => this.lineFeed()), this._parser.setExecuteHandler(n.C0.VT, () => this.lineFeed()), this._parser.setExecuteHandler(n.C0.FF, () => this.lineFeed()), this._parser.setExecuteHandler(n.C0.CR, () => this.carriageReturn()), this._parser.setExecuteHandler(n.C0.BS, () => this.backspace()), this._parser.setExecuteHandler(n.C0.HT, () => this.tab()), this._parser.setExecuteHandler(n.C0.SO, () => this.shiftOut()), this._parser.setExecuteHandler(n.C0.SI, () => this.shiftIn()), this._parser.setExecuteHandler(n.C1.IND, () => this.index()), this._parser.setExecuteHandler(n.C1.NEL, () => this.nextLine()), this._parser.setExecuteHandler(n.C1.HTS, () => this.tabSet()), this._parser.registerOscHandler(0, new v.OscHandler((b) => (this.setTitle(b), this.setIconName(b), !0))), this._parser.registerOscHandler(1, new v.OscHandler((b) => this.setIconName(b))), this._parser.registerOscHandler(2, new v.OscHandler((b) => this.setTitle(b))), this._parser.registerOscHandler(4, new v.OscHandler((b) => this.setOrReportIndexedColor(b))), this._parser.registerOscHandler(8, new v.OscHandler((b) => this.setHyperlink(b))), this._parser.registerOscHandler(10, new v.OscHandler((b) => this.setOrReportFgColor(b))), this._parser.registerOscHandler(11, new v.OscHandler((b) => this.setOrReportBgColor(b))), this._parser.registerOscHandler(12, new v.OscHandler((b) => this.setOrReportCursorColor(b))), this._parser.registerOscHandler(104, new v.OscHandler((b) => this.restoreIndexedColor(b))), this._parser.registerOscHandler(110, new v.OscHandler((b) => this.restoreFgColor(b))), this._parser.registerOscHandler(111, new v.OscHandler((b) => this.restoreBgColor(b))), this._parser.registerOscHandler(112, new v.OscHandler((b) => this.restoreCursorColor(b))), this._parser.registerEscHandler({ final: "7" }, () => this.saveCursor()), this._parser.registerEscHandler({ final: "8" }, () => this.restoreCursor()), this._parser.registerEscHandler({ final: "D" }, () => this.index()), this._parser.registerEscHandler({ final: "E" }, () => this.nextLine()), this._parser.registerEscHandler({ final: "H" }, () => this.tabSet()), this._parser.registerEscHandler({ final: "M" }, () => this.reverseIndex()), this._parser.registerEscHandler({ final: "=" }, () => this.keypadApplicationMode()), this._parser.registerEscHandler({ final: ">" }, () => this.keypadNumericMode()), this._parser.registerEscHandler({ final: "c" }, () => this.fullReset()), this._parser.registerEscHandler({ final: "n" }, () => this.setgLevel(2)), this._parser.registerEscHandler({ final: "o" }, () => this.setgLevel(3)), this._parser.registerEscHandler({ final: "|" }, () => this.setgLevel(3)), this._parser.registerEscHandler({ final: "}" }, () => this.setgLevel(2)), this._parser.registerEscHandler({ final: "~" }, () => this.setgLevel(1)), this._parser.registerEscHandler({ intermediates: "%", final: "@" }, () => this.selectDefaultCharset()), this._parser.registerEscHandler({ intermediates: "%", final: "G" }, () => this.selectDefaultCharset());
          for (const b in d.CHARSETS) this._parser.registerEscHandler({ intermediates: "(", final: b }, () => this.selectCharset("(" + b)), this._parser.registerEscHandler({ intermediates: ")", final: b }, () => this.selectCharset(")" + b)), this._parser.registerEscHandler({ intermediates: "*", final: b }, () => this.selectCharset("*" + b)), this._parser.registerEscHandler({ intermediates: "+", final: b }, () => this.selectCharset("+" + b)), this._parser.registerEscHandler({ intermediates: "-", final: b }, () => this.selectCharset("-" + b)), this._parser.registerEscHandler({ intermediates: ".", final: b }, () => this.selectCharset("." + b)), this._parser.registerEscHandler({ intermediates: "/", final: b }, () => this.selectCharset("/" + b));
          this._parser.registerEscHandler({ intermediates: "#", final: "8" }, () => this.screenAlignmentPattern()), this._parser.setErrorHandler((b) => (this._logService.error("Parsing error: ", b), b)), this._parser.registerDcsHandler({ intermediates: "$", final: "q" }, new m.DcsHandler((b, D) => this.requestStatusString(b, D)));
        }
        _preserveStack(C, x, k, L) {
          this._parseStack.paused = !0, this._parseStack.cursorStartX = C, this._parseStack.cursorStartY = x, this._parseStack.decodedLength = k, this._parseStack.position = L;
        }
        _logSlowResolvingAsync(C) {
          this._logService.logLevel <= c.LogLevelEnum.WARN && Promise.race([C, new Promise((x, k) => setTimeout(() => k("#SLOW_TIMEOUT"), 5e3))]).catch((x) => {
            if (x !== "#SLOW_TIMEOUT") throw x;
            console.warn("async parser handler taking longer than 5000 ms");
          });
        }
        _getCurrentLinkId() {
          return this._curAttrData.extended.urlId;
        }
        parse(C, x) {
          let k, L = this._activeBuffer.x, H = this._activeBuffer.y, N = 0;
          const $ = this._parseStack.paused;
          if ($) {
            if (k = this._parser.parse(this._parseBuffer, this._parseStack.decodedLength, x)) return this._logSlowResolvingAsync(k), k;
            L = this._parseStack.cursorStartX, H = this._parseStack.cursorStartY, this._parseStack.paused = !1, C.length > E && (N = this._parseStack.position + E);
          }
          if (this._logService.logLevel <= c.LogLevelEnum.DEBUG && this._logService.debug("parsing data" + (typeof C == "string" ? ` "${C}"` : ` "${Array.prototype.map.call(C, (j) => String.fromCharCode(j)).join("")}"`), typeof C == "string" ? C.split("").map((j) => j.charCodeAt(0)) : C), this._parseBuffer.length < C.length && this._parseBuffer.length < E && (this._parseBuffer = new Uint32Array(Math.min(C.length, E))), $ || this._dirtyRowTracker.clearRange(), C.length > E) for (let j = N; j < C.length; j += E) {
            const Q = j + E < C.length ? j + E : C.length, b = typeof C == "string" ? this._stringDecoder.decode(C.substring(j, Q), this._parseBuffer) : this._utf8Decoder.decode(C.subarray(j, Q), this._parseBuffer);
            if (k = this._parser.parse(this._parseBuffer, b)) return this._preserveStack(L, H, b, j), this._logSlowResolvingAsync(k), k;
          }
          else if (!$) {
            const j = typeof C == "string" ? this._stringDecoder.decode(C, this._parseBuffer) : this._utf8Decoder.decode(C, this._parseBuffer);
            if (k = this._parser.parse(this._parseBuffer, j)) return this._preserveStack(L, H, j, 0), this._logSlowResolvingAsync(k), k;
          }
          this._activeBuffer.x === L && this._activeBuffer.y === H || this._onCursorMove.fire(), this._onRequestRefreshRows.fire(this._dirtyRowTracker.start, this._dirtyRowTracker.end);
        }
        print(C, x, k) {
          let L, H;
          const N = this._charsetService.charset, $ = this._optionsService.rawOptions.screenReaderMode, j = this._bufferService.cols, Q = this._coreService.decPrivateModes.wraparound, b = this._coreService.modes.insertMode, D = this._curAttrData;
          let T = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._activeBuffer.x && k - x > 0 && T.getWidth(this._activeBuffer.x - 1) === 2 && T.setCellFromCodePoint(this._activeBuffer.x - 1, 0, 1, D.fg, D.bg, D.extended);
          for (let B = x; B < k; ++B) {
            if (L = C[B], H = this._unicodeService.wcwidth(L), L < 127 && N) {
              const V = N[String.fromCharCode(L)];
              V && (L = V.charCodeAt(0));
            }
            if ($ && this._onA11yChar.fire((0, u.stringFromCodePoint)(L)), this._getCurrentLinkId() && this._oscLinkService.addLineToLink(this._getCurrentLinkId(), this._activeBuffer.ybase + this._activeBuffer.y), H || !this._activeBuffer.x) {
              if (this._activeBuffer.x + H - 1 >= j) {
                if (Q) {
                  for (; this._activeBuffer.x < j; ) T.setCellFromCodePoint(this._activeBuffer.x++, 0, 1, D.fg, D.bg, D.extended);
                  this._activeBuffer.x = 0, this._activeBuffer.y++, this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--, this._bufferService.scroll(this._eraseAttrData(), !0)) : (this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1), this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = !0), T = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
                } else if (this._activeBuffer.x = j - 1, H === 2) continue;
              }
              if (b && (T.insertCells(this._activeBuffer.x, H, this._activeBuffer.getNullCell(D), D), T.getWidth(j - 1) === 2 && T.setCellFromCodePoint(j - 1, t.NULL_CELL_CODE, t.NULL_CELL_WIDTH, D.fg, D.bg, D.extended)), T.setCellFromCodePoint(this._activeBuffer.x++, L, H, D.fg, D.bg, D.extended), H > 0) for (; --H; ) T.setCellFromCodePoint(this._activeBuffer.x++, 0, 0, D.fg, D.bg, D.extended);
            } else T.getWidth(this._activeBuffer.x - 1) ? T.addCodepointToCell(this._activeBuffer.x - 1, L) : T.addCodepointToCell(this._activeBuffer.x - 2, L);
          }
          k - x > 0 && (T.loadCell(this._activeBuffer.x - 1, this._workCell), this._workCell.getWidth() === 2 || this._workCell.getCode() > 65535 ? this._parser.precedingCodepoint = 0 : this._workCell.isCombined() ? this._parser.precedingCodepoint = this._workCell.getChars().charCodeAt(0) : this._parser.precedingCodepoint = this._workCell.content), this._activeBuffer.x < j && k - x > 0 && T.getWidth(this._activeBuffer.x) === 0 && !T.hasContent(this._activeBuffer.x) && T.setCellFromCodePoint(this._activeBuffer.x, 0, 1, D.fg, D.bg, D.extended), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
        }
        registerCsiHandler(C, x) {
          return C.final !== "t" || C.prefix || C.intermediates ? this._parser.registerCsiHandler(C, x) : this._parser.registerCsiHandler(C, (k) => !S(k.params[0], this._optionsService.rawOptions.windowOptions) || x(k));
        }
        registerDcsHandler(C, x) {
          return this._parser.registerDcsHandler(C, new m.DcsHandler(x));
        }
        registerEscHandler(C, x) {
          return this._parser.registerEscHandler(C, x);
        }
        registerOscHandler(C, x) {
          return this._parser.registerOscHandler(C, new v.OscHandler(x));
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
            const x = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
            x.hasWidth(this._activeBuffer.x) && !x.hasContent(this._activeBuffer.x) && this._activeBuffer.x--;
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
        _setCursor(C, x) {
          this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._coreService.decPrivateModes.origin ? (this._activeBuffer.x = C, this._activeBuffer.y = this._activeBuffer.scrollTop + x) : (this._activeBuffer.x = C, this._activeBuffer.y = x), this._restrictCursor(), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
        }
        _moveCursor(C, x) {
          this._restrictCursor(), this._setCursor(this._activeBuffer.x + C, this._activeBuffer.y + x);
        }
        cursorUp(C) {
          const x = this._activeBuffer.y - this._activeBuffer.scrollTop;
          return x >= 0 ? this._moveCursor(0, -Math.min(x, C.params[0] || 1)) : this._moveCursor(0, -(C.params[0] || 1)), !0;
        }
        cursorDown(C) {
          const x = this._activeBuffer.scrollBottom - this._activeBuffer.y;
          return x >= 0 ? this._moveCursor(0, Math.min(x, C.params[0] || 1)) : this._moveCursor(0, C.params[0] || 1), !0;
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
          const x = C.params[0];
          return x === 0 ? delete this._activeBuffer.tabs[this._activeBuffer.x] : x === 3 && (this._activeBuffer.tabs = {}), !0;
        }
        cursorForwardTab(C) {
          if (this._activeBuffer.x >= this._bufferService.cols) return !0;
          let x = C.params[0] || 1;
          for (; x--; ) this._activeBuffer.x = this._activeBuffer.nextStop();
          return !0;
        }
        cursorBackwardTab(C) {
          if (this._activeBuffer.x >= this._bufferService.cols) return !0;
          let x = C.params[0] || 1;
          for (; x--; ) this._activeBuffer.x = this._activeBuffer.prevStop();
          return !0;
        }
        selectProtected(C) {
          const x = C.params[0];
          return x === 1 && (this._curAttrData.bg |= 536870912), x !== 2 && x !== 0 || (this._curAttrData.bg &= -536870913), !0;
        }
        _eraseInBufferLine(C, x, k, L = !1, H = !1) {
          const N = this._activeBuffer.lines.get(this._activeBuffer.ybase + C);
          N.replaceCells(x, k, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData(), H), L && (N.isWrapped = !1);
        }
        _resetBufferLine(C, x = !1) {
          const k = this._activeBuffer.lines.get(this._activeBuffer.ybase + C);
          k && (k.fill(this._activeBuffer.getNullCell(this._eraseAttrData()), x), this._bufferService.buffer.clearMarkers(this._activeBuffer.ybase + C), k.isWrapped = !1);
        }
        eraseInDisplay(C, x = !1) {
          let k;
          switch (this._restrictCursor(this._bufferService.cols), C.params[0]) {
            case 0:
              for (k = this._activeBuffer.y, this._dirtyRowTracker.markDirty(k), this._eraseInBufferLine(k++, this._activeBuffer.x, this._bufferService.cols, this._activeBuffer.x === 0, x); k < this._bufferService.rows; k++) this._resetBufferLine(k, x);
              this._dirtyRowTracker.markDirty(k);
              break;
            case 1:
              for (k = this._activeBuffer.y, this._dirtyRowTracker.markDirty(k), this._eraseInBufferLine(k, 0, this._activeBuffer.x + 1, !0, x), this._activeBuffer.x + 1 >= this._bufferService.cols && (this._activeBuffer.lines.get(k + 1).isWrapped = !1); k--; ) this._resetBufferLine(k, x);
              this._dirtyRowTracker.markDirty(0);
              break;
            case 2:
              for (k = this._bufferService.rows, this._dirtyRowTracker.markDirty(k - 1); k--; ) this._resetBufferLine(k, x);
              this._dirtyRowTracker.markDirty(0);
              break;
            case 3:
              const L = this._activeBuffer.lines.length - this._bufferService.rows;
              L > 0 && (this._activeBuffer.lines.trimStart(L), this._activeBuffer.ybase = Math.max(this._activeBuffer.ybase - L, 0), this._activeBuffer.ydisp = Math.max(this._activeBuffer.ydisp - L, 0), this._onScroll.fire(0));
          }
          return !0;
        }
        eraseInLine(C, x = !1) {
          switch (this._restrictCursor(this._bufferService.cols), C.params[0]) {
            case 0:
              this._eraseInBufferLine(this._activeBuffer.y, this._activeBuffer.x, this._bufferService.cols, this._activeBuffer.x === 0, x);
              break;
            case 1:
              this._eraseInBufferLine(this._activeBuffer.y, 0, this._activeBuffer.x + 1, !1, x);
              break;
            case 2:
              this._eraseInBufferLine(this._activeBuffer.y, 0, this._bufferService.cols, !0, x);
          }
          return this._dirtyRowTracker.markDirty(this._activeBuffer.y), !0;
        }
        insertLines(C) {
          this._restrictCursor();
          let x = C.params[0] || 1;
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const k = this._activeBuffer.ybase + this._activeBuffer.y, L = this._bufferService.rows - 1 - this._activeBuffer.scrollBottom, H = this._bufferService.rows - 1 + this._activeBuffer.ybase - L + 1;
          for (; x--; ) this._activeBuffer.lines.splice(H - 1, 1), this._activeBuffer.lines.splice(k, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom), this._activeBuffer.x = 0, !0;
        }
        deleteLines(C) {
          this._restrictCursor();
          let x = C.params[0] || 1;
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const k = this._activeBuffer.ybase + this._activeBuffer.y;
          let L;
          for (L = this._bufferService.rows - 1 - this._activeBuffer.scrollBottom, L = this._bufferService.rows - 1 + this._activeBuffer.ybase - L; x--; ) this._activeBuffer.lines.splice(k, 1), this._activeBuffer.lines.splice(L, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom), this._activeBuffer.x = 0, !0;
        }
        insertChars(C) {
          this._restrictCursor();
          const x = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          return x && (x.insertCells(this._activeBuffer.x, C.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), !0;
        }
        deleteChars(C) {
          this._restrictCursor();
          const x = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          return x && (x.deleteCells(this._activeBuffer.x, C.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), !0;
        }
        scrollUp(C) {
          let x = C.params[0] || 1;
          for (; x--; ) this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 1), this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        scrollDown(C) {
          let x = C.params[0] || 1;
          for (; x--; ) this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 1), this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 0, this._activeBuffer.getBlankLine(e.DEFAULT_ATTR_DATA));
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        scrollLeft(C) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const x = C.params[0] || 1;
          for (let k = this._activeBuffer.scrollTop; k <= this._activeBuffer.scrollBottom; ++k) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + k);
            L.deleteCells(0, x, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        scrollRight(C) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const x = C.params[0] || 1;
          for (let k = this._activeBuffer.scrollTop; k <= this._activeBuffer.scrollBottom; ++k) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + k);
            L.insertCells(0, x, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        insertColumns(C) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const x = C.params[0] || 1;
          for (let k = this._activeBuffer.scrollTop; k <= this._activeBuffer.scrollBottom; ++k) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + k);
            L.insertCells(this._activeBuffer.x, x, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        deleteColumns(C) {
          if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return !0;
          const x = C.params[0] || 1;
          for (let k = this._activeBuffer.scrollTop; k <= this._activeBuffer.scrollBottom; ++k) {
            const L = this._activeBuffer.lines.get(this._activeBuffer.ybase + k);
            L.deleteCells(this._activeBuffer.x, x, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), L.isWrapped = !1;
          }
          return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), !0;
        }
        eraseChars(C) {
          this._restrictCursor();
          const x = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
          return x && (x.replaceCells(this._activeBuffer.x, this._activeBuffer.x + (C.params[0] || 1), this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), !0;
        }
        repeatPrecedingCharacter(C) {
          if (!this._parser.precedingCodepoint) return !0;
          const x = C.params[0] || 1, k = new Uint32Array(x);
          for (let L = 0; L < x; ++L) k[L] = this._parser.precedingCodepoint;
          return this.print(k, 0, k.length), !0;
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
          for (let x = 0; x < C.length; x++) switch (C.params[x]) {
            case 4:
              this._coreService.modes.insertMode = !0;
              break;
            case 20:
              this._optionsService.options.convertEol = !0;
          }
          return !0;
        }
        setModePrivate(C) {
          for (let x = 0; x < C.length; x++) switch (C.params[x]) {
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
        resetMode(C) {
          for (let x = 0; x < C.length; x++) switch (C.params[x]) {
            case 4:
              this._coreService.modes.insertMode = !1;
              break;
            case 20:
              this._optionsService.options.convertEol = !1;
          }
          return !0;
        }
        resetModePrivate(C) {
          for (let x = 0; x < C.length; x++) switch (C.params[x]) {
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
              this._bufferService.buffers.activateNormalBuffer(), C.params[x] === 1049 && this.restoreCursor(), this._coreService.isCursorInitialized = !0, this._onRequestRefreshRows.fire(0, this._bufferService.rows - 1), this._onRequestSyncScrollBar.fire();
              break;
            case 2004:
              this._coreService.decPrivateModes.bracketedPasteMode = !1;
          }
          return !0;
        }
        requestMode(C, x) {
          const k = this._coreService.decPrivateModes, { activeProtocol: L, activeEncoding: H } = this._coreMouseService, N = this._coreService, { buffers: $, cols: j } = this._bufferService, { active: Q, alt: b } = $, D = this._optionsService.rawOptions, T = (Z) => Z ? 1 : 2, B = C.params[0];
          return V = B, W = x ? B === 2 ? 4 : B === 4 ? T(N.modes.insertMode) : B === 12 ? 3 : B === 20 ? T(D.convertEol) : 0 : B === 1 ? T(k.applicationCursorKeys) : B === 3 ? D.windowOptions.setWinLines ? j === 80 ? 2 : j === 132 ? 1 : 0 : 0 : B === 6 ? T(k.origin) : B === 7 ? T(k.wraparound) : B === 8 ? 3 : B === 9 ? T(L === "X10") : B === 12 ? T(D.cursorBlink) : B === 25 ? T(!N.isCursorHidden) : B === 45 ? T(k.reverseWraparound) : B === 66 ? T(k.applicationKeypad) : B === 67 ? 4 : B === 1e3 ? T(L === "VT200") : B === 1002 ? T(L === "DRAG") : B === 1003 ? T(L === "ANY") : B === 1004 ? T(k.sendFocus) : B === 1005 ? 4 : B === 1006 ? T(H === "SGR") : B === 1015 ? 4 : B === 1016 ? T(H === "SGR_PIXELS") : B === 1048 ? 1 : B === 47 || B === 1047 || B === 1049 ? T(Q === b) : B === 2004 ? T(k.bracketedPasteMode) : 0, N.triggerDataEvent(`${n.C0.ESC}[${x ? "" : "?"}${V};${W}$y`), !0;
          var V, W;
        }
        _updateAttrColor(C, x, k, L, H) {
          return x === 2 ? (C |= 50331648, C &= -16777216, C |= a.AttributeData.fromColorRGB([k, L, H])) : x === 5 && (C &= -50331904, C |= 33554432 | 255 & k), C;
        }
        _extractColor(C, x, k) {
          const L = [0, 0, -1, 0, 0, 0];
          let H = 0, N = 0;
          do {
            if (L[N + H] = C.params[x + N], C.hasSubParams(x + N)) {
              const $ = C.getSubParams(x + N);
              let j = 0;
              do
                L[1] === 5 && (H = 1), L[N + j + 1 + H] = $[j];
              while (++j < $.length && j + N + 1 + H < L.length);
              break;
            }
            if (L[1] === 5 && N + H >= 2 || L[1] === 2 && N + H >= 5) break;
            L[1] && (H = 1);
          } while (++N + x < C.length && N + H < L.length);
          for (let $ = 2; $ < L.length; ++$) L[$] === -1 && (L[$] = 0);
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
          return N;
        }
        _processUnderline(C, x) {
          x.extended = x.extended.clone(), (!~C || C > 5) && (C = 1), x.extended.underlineStyle = C, x.fg |= 268435456, C === 0 && (x.fg &= -268435457), x.updateExtended();
        }
        _processSGR0(C) {
          C.fg = e.DEFAULT_ATTR_DATA.fg, C.bg = e.DEFAULT_ATTR_DATA.bg, C.extended = C.extended.clone(), C.extended.underlineStyle = 0, C.extended.underlineColor &= -67108864, C.updateExtended();
        }
        charAttributes(C) {
          if (C.length === 1 && C.params[0] === 0) return this._processSGR0(this._curAttrData), !0;
          const x = C.length;
          let k;
          const L = this._curAttrData;
          for (let H = 0; H < x; H++) k = C.params[H], k >= 30 && k <= 37 ? (L.fg &= -50331904, L.fg |= 16777216 | k - 30) : k >= 40 && k <= 47 ? (L.bg &= -50331904, L.bg |= 16777216 | k - 40) : k >= 90 && k <= 97 ? (L.fg &= -50331904, L.fg |= 16777224 | k - 90) : k >= 100 && k <= 107 ? (L.bg &= -50331904, L.bg |= 16777224 | k - 100) : k === 0 ? this._processSGR0(L) : k === 1 ? L.fg |= 134217728 : k === 3 ? L.bg |= 67108864 : k === 4 ? (L.fg |= 268435456, this._processUnderline(C.hasSubParams(H) ? C.getSubParams(H)[0] : 1, L)) : k === 5 ? L.fg |= 536870912 : k === 7 ? L.fg |= 67108864 : k === 8 ? L.fg |= 1073741824 : k === 9 ? L.fg |= 2147483648 : k === 2 ? L.bg |= 134217728 : k === 21 ? this._processUnderline(2, L) : k === 22 ? (L.fg &= -134217729, L.bg &= -134217729) : k === 23 ? L.bg &= -67108865 : k === 24 ? (L.fg &= -268435457, this._processUnderline(0, L)) : k === 25 ? L.fg &= -536870913 : k === 27 ? L.fg &= -67108865 : k === 28 ? L.fg &= -1073741825 : k === 29 ? L.fg &= 2147483647 : k === 39 ? (L.fg &= -67108864, L.fg |= 16777215 & e.DEFAULT_ATTR_DATA.fg) : k === 49 ? (L.bg &= -67108864, L.bg |= 16777215 & e.DEFAULT_ATTR_DATA.bg) : k === 38 || k === 48 || k === 58 ? H += this._extractColor(C, H, L) : k === 53 ? L.bg |= 1073741824 : k === 55 ? L.bg &= -1073741825 : k === 59 ? (L.extended = L.extended.clone(), L.extended.underlineColor = -1, L.updateExtended()) : k === 100 ? (L.fg &= -67108864, L.fg |= 16777215 & e.DEFAULT_ATTR_DATA.fg, L.bg &= -67108864, L.bg |= 16777215 & e.DEFAULT_ATTR_DATA.bg) : this._logService.debug("Unknown SGR attribute: %d.", k);
          return !0;
        }
        deviceStatus(C) {
          switch (C.params[0]) {
            case 5:
              this._coreService.triggerDataEvent(`${n.C0.ESC}[0n`);
              break;
            case 6:
              const x = this._activeBuffer.y + 1, k = this._activeBuffer.x + 1;
              this._coreService.triggerDataEvent(`${n.C0.ESC}[${x};${k}R`);
          }
          return !0;
        }
        deviceStatusPrivate(C) {
          if (C.params[0] === 6) {
            const x = this._activeBuffer.y + 1, k = this._activeBuffer.x + 1;
            this._coreService.triggerDataEvent(`${n.C0.ESC}[?${x};${k}R`);
          }
          return !0;
        }
        softReset(C) {
          return this._coreService.isCursorHidden = !1, this._onRequestSyncScrollBar.fire(), this._activeBuffer.scrollTop = 0, this._activeBuffer.scrollBottom = this._bufferService.rows - 1, this._curAttrData = e.DEFAULT_ATTR_DATA.clone(), this._coreService.reset(), this._charsetService.reset(), this._activeBuffer.savedX = 0, this._activeBuffer.savedY = this._activeBuffer.ybase, this._activeBuffer.savedCurAttrData.fg = this._curAttrData.fg, this._activeBuffer.savedCurAttrData.bg = this._curAttrData.bg, this._activeBuffer.savedCharset = this._charsetService.charset, this._coreService.decPrivateModes.origin = !1, !0;
        }
        setCursorStyle(C) {
          const x = C.params[0] || 1;
          switch (x) {
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
          const k = x % 2 == 1;
          return this._optionsService.options.cursorBlink = k, !0;
        }
        setScrollRegion(C) {
          const x = C.params[0] || 1;
          let k;
          return (C.length < 2 || (k = C.params[1]) > this._bufferService.rows || k === 0) && (k = this._bufferService.rows), k > x && (this._activeBuffer.scrollTop = x - 1, this._activeBuffer.scrollBottom = k - 1, this._setCursor(0, 0)), !0;
        }
        windowOptions(C) {
          if (!S(C.params[0], this._optionsService.rawOptions.windowOptions)) return !0;
          const x = C.length > 1 ? C.params[1] : 0;
          switch (C.params[0]) {
            case 14:
              x !== 2 && this._onRequestWindowsOptionsReport.fire(y.GET_WIN_SIZE_PIXELS);
              break;
            case 16:
              this._onRequestWindowsOptionsReport.fire(y.GET_CELL_SIZE_PIXELS);
              break;
            case 18:
              this._bufferService && this._coreService.triggerDataEvent(`${n.C0.ESC}[8;${this._bufferService.rows};${this._bufferService.cols}t`);
              break;
            case 22:
              x !== 0 && x !== 2 || (this._windowTitleStack.push(this._windowTitle), this._windowTitleStack.length > 10 && this._windowTitleStack.shift()), x !== 0 && x !== 1 || (this._iconNameStack.push(this._iconName), this._iconNameStack.length > 10 && this._iconNameStack.shift());
              break;
            case 23:
              x !== 0 && x !== 2 || this._windowTitleStack.length && this.setTitle(this._windowTitleStack.pop()), x !== 0 && x !== 1 || this._iconNameStack.length && this.setIconName(this._iconNameStack.pop());
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
          const x = [], k = C.split(";");
          for (; k.length > 1; ) {
            const L = k.shift(), H = k.shift();
            if (/^\d+$/.exec(L)) {
              const N = parseInt(L);
              if (O(N)) if (H === "?") x.push({ type: 0, index: N });
              else {
                const $ = (0, h.parseColor)(H);
                $ && x.push({ type: 1, index: N, color: $ });
              }
            }
          }
          return x.length && this._onColor.fire(x), !0;
        }
        setHyperlink(C) {
          const x = C.split(";");
          return !(x.length < 2) && (x[1] ? this._createHyperlink(x[0], x[1]) : !x[0] && this._finishHyperlink());
        }
        _createHyperlink(C, x) {
          this._getCurrentLinkId() && this._finishHyperlink();
          const k = C.split(":");
          let L;
          const H = k.findIndex((N) => N.startsWith("id="));
          return H !== -1 && (L = k[H].slice(3) || void 0), this._curAttrData.extended = this._curAttrData.extended.clone(), this._curAttrData.extended.urlId = this._oscLinkService.registerLink({ id: L, uri: x }), this._curAttrData.updateExtended(), !0;
        }
        _finishHyperlink() {
          return this._curAttrData.extended = this._curAttrData.extended.clone(), this._curAttrData.extended.urlId = 0, this._curAttrData.updateExtended(), !0;
        }
        _setOrReportSpecialColor(C, x) {
          const k = C.split(";");
          for (let L = 0; L < k.length && !(x >= this._specialColors.length); ++L, ++x) if (k[L] === "?") this._onColor.fire([{ type: 0, index: this._specialColors[x] }]);
          else {
            const H = (0, h.parseColor)(k[L]);
            H && this._onColor.fire([{ type: 1, index: this._specialColors[x], color: H }]);
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
          const x = [], k = C.split(";");
          for (let L = 0; L < k.length; ++L) if (/^\d+$/.exec(k[L])) {
            const H = parseInt(k[L]);
            O(H) && x.push({ type: 2, index: H });
          }
          return x.length && this._onColor.fire(x), !0;
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
          return this._charsetService.setgLevel(0), this._charsetService.setgCharset(0, d.DEFAULT_CHARSET), !0;
        }
        selectCharset(C) {
          return C.length !== 2 ? (this.selectDefaultCharset(), !0) : (C[0] === "/" || this._charsetService.setgCharset(g[C[0]], d.CHARSETS[C[1]] || d.DEFAULT_CHARSET), !0);
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
          const C = new i.CellData();
          C.content = 4194373, C.fg = this._curAttrData.fg, C.bg = this._curAttrData.bg, this._setCursor(0, 0);
          for (let x = 0; x < this._bufferService.rows; ++x) {
            const k = this._activeBuffer.ybase + this._activeBuffer.y + x, L = this._activeBuffer.lines.get(k);
            L && (L.fill(C), L.isWrapped = !1);
          }
          return this._dirtyRowTracker.markAllDirty(), this._setCursor(0, 0), !0;
        }
        requestStatusString(C, x) {
          const k = this._bufferService.buffer, L = this._optionsService.rawOptions;
          return ((H) => (this._coreService.triggerDataEvent(`${n.C0.ESC}${H}${n.C0.ESC}\\`), !0))(C === '"q' ? `P1$r${this._curAttrData.isProtected() ? 1 : 0}"q` : C === '"p' ? 'P1$r61;1"p' : C === "r" ? `P1$r${k.scrollTop + 1};${k.scrollBottom + 1}r` : C === "m" ? "P1$r0m" : C === " q" ? `P1$r${{ block: 2, underline: 4, bar: 6 }[L.cursorStyle] - (L.cursorBlink ? 1 : 0)} q` : "P0$r");
        }
        markRangeDirty(C, x) {
          this._dirtyRowTracker.markRangeDirty(C, x);
        }
      }
      s.InputHandler = R;
      let A = class {
        constructor(I) {
          this._bufferService = I, this.clearRange();
        }
        clearRange() {
          this.start = this._bufferService.buffer.y, this.end = this._bufferService.buffer.y;
        }
        markDirty(I) {
          I < this.start ? this.start = I : I > this.end && (this.end = I);
        }
        markRangeDirty(I, C) {
          I > C && (w = I, I = C, C = w), I < this.start && (this.start = I), C > this.end && (this.end = C);
        }
        markAllDirty() {
          this.markRangeDirty(0, this._bufferService.rows - 1);
        }
      };
      function O(I) {
        return 0 <= I && I < 256;
      }
      A = l([_(0, c.IBufferService)], A);
    }, 844: (M, s) => {
      function o(l) {
        for (const _ of l) _.dispose();
        l.length = 0;
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.getDisposeArrayDisposable = s.disposeArray = s.toDisposable = s.MutableDisposable = s.Disposable = void 0, s.Disposable = class {
        constructor() {
          this._disposables = [], this._isDisposed = !1;
        }
        dispose() {
          this._isDisposed = !0;
          for (const l of this._disposables) l.dispose();
          this._disposables.length = 0;
        }
        register(l) {
          return this._disposables.push(l), l;
        }
        unregister(l) {
          const _ = this._disposables.indexOf(l);
          _ !== -1 && this._disposables.splice(_, 1);
        }
      }, s.MutableDisposable = class {
        constructor() {
          this._isDisposed = !1;
        }
        get value() {
          return this._isDisposed ? void 0 : this._value;
        }
        set value(l) {
          var _;
          this._isDisposed || l === this._value || ((_ = this._value) === null || _ === void 0 || _.dispose(), this._value = l);
        }
        clear() {
          this.value = void 0;
        }
        dispose() {
          var l;
          this._isDisposed = !0, (l = this._value) === null || l === void 0 || l.dispose(), this._value = void 0;
        }
      }, s.toDisposable = function(l) {
        return { dispose: l };
      }, s.disposeArray = o, s.getDisposeArrayDisposable = function(l) {
        return { dispose: () => o(l) };
      };
    }, 1505: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.FourKeyMap = s.TwoKeyMap = void 0;
      class o {
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
      s.TwoKeyMap = o, s.FourKeyMap = class {
        constructor() {
          this._data = new o();
        }
        set(l, _, n, d, f) {
          this._data.get(l, _) || this._data.set(l, _, new o()), this._data.get(l, _).set(n, d, f);
        }
        get(l, _, n, d) {
          var f;
          return (f = this._data.get(l, _)) === null || f === void 0 ? void 0 : f.get(n, d);
        }
        clear() {
          this._data.clear();
        }
      };
    }, 6114: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.isChromeOS = s.isLinux = s.isWindows = s.isIphone = s.isIpad = s.isMac = s.getSafariVersion = s.isSafari = s.isLegacyEdge = s.isFirefox = s.isNode = void 0, s.isNode = typeof navigator > "u";
      const o = s.isNode ? "node" : navigator.userAgent, l = s.isNode ? "node" : navigator.platform;
      s.isFirefox = o.includes("Firefox"), s.isLegacyEdge = o.includes("Edge"), s.isSafari = /^((?!chrome|android).)*safari/i.test(o), s.getSafariVersion = function() {
        if (!s.isSafari) return 0;
        const _ = o.match(/Version\/(\d+)/);
        return _ === null || _.length < 2 ? 0 : parseInt(_[1]);
      }, s.isMac = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].includes(l), s.isIpad = l === "iPad", s.isIphone = l === "iPhone", s.isWindows = ["Windows", "Win16", "Win32", "WinCE"].includes(l), s.isLinux = l.indexOf("Linux") >= 0, s.isChromeOS = /\bCrOS\b/.test(o);
    }, 6106: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.SortedList = void 0;
      let o = 0;
      s.SortedList = class {
        constructor(l) {
          this._getKey = l, this._array = [];
        }
        clear() {
          this._array.length = 0;
        }
        insert(l) {
          this._array.length !== 0 ? (o = this._search(this._getKey(l)), this._array.splice(o, 0, l)) : this._array.push(l);
        }
        delete(l) {
          if (this._array.length === 0) return !1;
          const _ = this._getKey(l);
          if (_ === void 0 || (o = this._search(_), o === -1) || this._getKey(this._array[o]) !== _) return !1;
          do
            if (this._array[o] === l) return this._array.splice(o, 1), !0;
          while (++o < this._array.length && this._getKey(this._array[o]) === _);
          return !1;
        }
        *getKeyIterator(l) {
          if (this._array.length !== 0 && (o = this._search(l), !(o < 0 || o >= this._array.length) && this._getKey(this._array[o]) === l)) do
            yield this._array[o];
          while (++o < this._array.length && this._getKey(this._array[o]) === l);
        }
        forEachByKey(l, _) {
          if (this._array.length !== 0 && (o = this._search(l), !(o < 0 || o >= this._array.length) && this._getKey(this._array[o]) === l)) do
            _(this._array[o]);
          while (++o < this._array.length && this._getKey(this._array[o]) === l);
        }
        values() {
          return [...this._array].values();
        }
        _search(l) {
          let _ = 0, n = this._array.length - 1;
          for (; n >= _; ) {
            let d = _ + n >> 1;
            const f = this._getKey(this._array[d]);
            if (f > l) n = d - 1;
            else {
              if (!(f < l)) {
                for (; d > 0 && this._getKey(this._array[d - 1]) === l; ) d--;
                return d;
              }
              _ = d + 1;
            }
          }
          return _;
        }
      };
    }, 7226: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DebouncedIdleTask = s.IdleTaskQueue = s.PriorityTaskQueue = void 0;
      const l = o(6114);
      class _ {
        constructor() {
          this._tasks = [], this._i = 0;
        }
        enqueue(f) {
          this._tasks.push(f), this._start();
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
        _process(f) {
          this._idleCallback = void 0;
          let p = 0, u = 0, e = f.timeRemaining(), r = 0;
          for (; this._i < this._tasks.length; ) {
            if (p = Date.now(), this._tasks[this._i]() || this._i++, p = Math.max(1, Date.now() - p), u = Math.max(p, u), r = f.timeRemaining(), 1.5 * u > r) return e - p < -20 && console.warn(`task queue exceeded allotted deadline by ${Math.abs(Math.round(e - p))}ms`), void this._start();
            e = r;
          }
          this.clear();
        }
      }
      class n extends _ {
        _requestCallback(f) {
          return setTimeout(() => f(this._createDeadline(16)));
        }
        _cancelCallback(f) {
          clearTimeout(f);
        }
        _createDeadline(f) {
          const p = Date.now() + f;
          return { timeRemaining: () => Math.max(0, p - Date.now()) };
        }
      }
      s.PriorityTaskQueue = n, s.IdleTaskQueue = !l.isNode && "requestIdleCallback" in window ? class extends _ {
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
    }, 9282: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.updateWindowsModeWrappedState = void 0;
      const l = o(643);
      s.updateWindowsModeWrappedState = function(_) {
        const n = _.buffer.lines.get(_.buffer.ybase + _.buffer.y - 1), d = n == null ? void 0 : n.get(_.cols - 1), f = _.buffer.lines.get(_.buffer.ybase + _.buffer.y);
        f && d && (f.isWrapped = d[l.CHAR_DATA_CODE_INDEX] !== l.NULL_CELL_CODE && d[l.CHAR_DATA_CODE_INDEX] !== l.WHITESPACE_CELL_CODE);
      };
    }, 3734: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ExtendedAttrs = s.AttributeData = void 0;
      class o {
        constructor() {
          this.fg = 0, this.bg = 0, this.extended = new l();
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
      s.AttributeData = o;
      class l {
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
          return new l(this._ext, this._urlId);
        }
        isEmpty() {
          return this.underlineStyle === 0 && this._urlId === 0;
        }
      }
      s.ExtendedAttrs = l;
    }, 9092: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Buffer = s.MAX_BUFFER_SIZE = void 0;
      const l = o(6349), _ = o(7226), n = o(3734), d = o(8437), f = o(4634), p = o(511), u = o(643), e = o(4863), r = o(7116);
      s.MAX_BUFFER_SIZE = 4294967295, s.Buffer = class {
        constructor(t, i, a) {
          this._hasScrollback = t, this._optionsService = i, this._bufferService = a, this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.tabs = {}, this.savedY = 0, this.savedX = 0, this.savedCurAttrData = d.DEFAULT_ATTR_DATA.clone(), this.savedCharset = r.DEFAULT_CHARSET, this.markers = [], this._nullCell = p.CellData.fromCharData([0, u.NULL_CELL_CHAR, u.NULL_CELL_WIDTH, u.NULL_CELL_CODE]), this._whitespaceCell = p.CellData.fromCharData([0, u.WHITESPACE_CELL_CHAR, u.WHITESPACE_CELL_WIDTH, u.WHITESPACE_CELL_CODE]), this._isClearing = !1, this._memoryCleanupQueue = new _.IdleTaskQueue(), this._memoryCleanupPosition = 0, this._cols = this._bufferService.cols, this._rows = this._bufferService.rows, this.lines = new l.CircularList(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops();
        }
        getNullCell(t) {
          return t ? (this._nullCell.fg = t.fg, this._nullCell.bg = t.bg, this._nullCell.extended = t.extended) : (this._nullCell.fg = 0, this._nullCell.bg = 0, this._nullCell.extended = new n.ExtendedAttrs()), this._nullCell;
        }
        getWhitespaceCell(t) {
          return t ? (this._whitespaceCell.fg = t.fg, this._whitespaceCell.bg = t.bg, this._whitespaceCell.extended = t.extended) : (this._whitespaceCell.fg = 0, this._whitespaceCell.bg = 0, this._whitespaceCell.extended = new n.ExtendedAttrs()), this._whitespaceCell;
        }
        getBlankLine(t, i) {
          return new d.BufferLine(this._bufferService.cols, this.getNullCell(t), i);
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
          const i = t + this._optionsService.rawOptions.scrollback;
          return i > s.MAX_BUFFER_SIZE ? s.MAX_BUFFER_SIZE : i;
        }
        fillViewportRows(t) {
          if (this.lines.length === 0) {
            t === void 0 && (t = d.DEFAULT_ATTR_DATA);
            let i = this._rows;
            for (; i--; ) this.lines.push(this.getBlankLine(t));
          }
        }
        clear() {
          this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.lines = new l.CircularList(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops();
        }
        resize(t, i) {
          const a = this.getNullCell(d.DEFAULT_ATTR_DATA);
          let c = 0;
          const v = this._getCorrectBufferLength(i);
          if (v > this.lines.maxLength && (this.lines.maxLength = v), this.lines.length > 0) {
            if (this._cols < t) for (let h = 0; h < this.lines.length; h++) c += +this.lines.get(h).resize(t, a);
            let m = 0;
            if (this._rows < i) for (let h = this._rows; h < i; h++) this.lines.length < i + this.ybase && (this._optionsService.rawOptions.windowsMode || this._optionsService.rawOptions.windowsPty.backend !== void 0 || this._optionsService.rawOptions.windowsPty.buildNumber !== void 0 ? this.lines.push(new d.BufferLine(t, a)) : this.ybase > 0 && this.lines.length <= this.ybase + this.y + m + 1 ? (this.ybase--, m++, this.ydisp > 0 && this.ydisp--) : this.lines.push(new d.BufferLine(t, a)));
            else for (let h = this._rows; h > i; h--) this.lines.length > i + this.ybase && (this.lines.length > this.ybase + this.y + 1 ? this.lines.pop() : (this.ybase++, this.ydisp++));
            if (v < this.lines.maxLength) {
              const h = this.lines.length - v;
              h > 0 && (this.lines.trimStart(h), this.ybase = Math.max(this.ybase - h, 0), this.ydisp = Math.max(this.ydisp - h, 0), this.savedY = Math.max(this.savedY - h, 0)), this.lines.maxLength = v;
            }
            this.x = Math.min(this.x, t - 1), this.y = Math.min(this.y, i - 1), m && (this.y += m), this.savedX = Math.min(this.savedX, t - 1), this.scrollTop = 0;
          }
          if (this.scrollBottom = i - 1, this._isReflowEnabled && (this._reflow(t, i), this._cols > t)) for (let m = 0; m < this.lines.length; m++) c += +this.lines.get(m).resize(t, a);
          this._cols = t, this._rows = i, this._memoryCleanupQueue.clear(), c > 0.1 * this.lines.length && (this._memoryCleanupPosition = 0, this._memoryCleanupQueue.enqueue(() => this._batchedMemoryCleanup()));
        }
        _batchedMemoryCleanup() {
          let t = !0;
          this._memoryCleanupPosition >= this.lines.length && (this._memoryCleanupPosition = 0, t = !1);
          let i = 0;
          for (; this._memoryCleanupPosition < this.lines.length; ) if (i += this.lines.get(this._memoryCleanupPosition++).cleanupMemory(), i > 100) return !0;
          return t;
        }
        get _isReflowEnabled() {
          const t = this._optionsService.rawOptions.windowsPty;
          return t && t.buildNumber ? this._hasScrollback && t.backend === "conpty" && t.buildNumber >= 21376 : this._hasScrollback && !this._optionsService.rawOptions.windowsMode;
        }
        _reflow(t, i) {
          this._cols !== t && (t > this._cols ? this._reflowLarger(t, i) : this._reflowSmaller(t, i));
        }
        _reflowLarger(t, i) {
          const a = (0, f.reflowLargerGetLinesToRemove)(this.lines, this._cols, t, this.ybase + this.y, this.getNullCell(d.DEFAULT_ATTR_DATA));
          if (a.length > 0) {
            const c = (0, f.reflowLargerCreateNewLayout)(this.lines, a);
            (0, f.reflowLargerApplyNewLayout)(this.lines, c.layout), this._reflowLargerAdjustViewport(t, i, c.countRemoved);
          }
        }
        _reflowLargerAdjustViewport(t, i, a) {
          const c = this.getNullCell(d.DEFAULT_ATTR_DATA);
          let v = a;
          for (; v-- > 0; ) this.ybase === 0 ? (this.y > 0 && this.y--, this.lines.length < i && this.lines.push(new d.BufferLine(t, c))) : (this.ydisp === this.ybase && this.ydisp--, this.ybase--);
          this.savedY = Math.max(this.savedY - a, 0);
        }
        _reflowSmaller(t, i) {
          const a = this.getNullCell(d.DEFAULT_ATTR_DATA), c = [];
          let v = 0;
          for (let m = this.lines.length - 1; m >= 0; m--) {
            let h = this.lines.get(m);
            if (!h || !h.isWrapped && h.getTrimmedLength() <= t) continue;
            const g = [h];
            for (; h.isWrapped && m > 0; ) h = this.lines.get(--m), g.unshift(h);
            const E = this.ybase + this.y;
            if (E >= m && E < m + g.length) continue;
            const S = g[g.length - 1].getTrimmedLength(), y = (0, f.reflowSmallerGetNewLineLengths)(g, this._cols, t), w = y.length - g.length;
            let R;
            R = this.ybase === 0 && this.y !== this.lines.length - 1 ? Math.max(0, this.y - this.lines.maxLength + w) : Math.max(0, this.lines.length - this.lines.maxLength + w);
            const A = [];
            for (let L = 0; L < w; L++) {
              const H = this.getBlankLine(d.DEFAULT_ATTR_DATA, !0);
              A.push(H);
            }
            A.length > 0 && (c.push({ start: m + g.length + v, newLines: A }), v += A.length), g.push(...A);
            let O = y.length - 1, I = y[O];
            I === 0 && (O--, I = y[O]);
            let C = g.length - w - 1, x = S;
            for (; C >= 0; ) {
              const L = Math.min(x, I);
              if (g[O] === void 0) break;
              if (g[O].copyCellsFrom(g[C], x - L, I - L, L, !0), I -= L, I === 0 && (O--, I = y[O]), x -= L, x === 0) {
                C--;
                const H = Math.max(C, 0);
                x = (0, f.getWrappedLineTrimmedLength)(g, H, this._cols);
              }
            }
            for (let L = 0; L < g.length; L++) y[L] < t && g[L].setCell(y[L], a);
            let k = w - R;
            for (; k-- > 0; ) this.ybase === 0 ? this.y < i - 1 ? (this.y++, this.lines.pop()) : (this.ybase++, this.ydisp++) : this.ybase < Math.min(this.lines.maxLength, this.lines.length + v) - i && (this.ybase === this.ydisp && this.ydisp++, this.ybase++);
            this.savedY = Math.min(this.savedY + w, this.ybase + i - 1);
          }
          if (c.length > 0) {
            const m = [], h = [];
            for (let O = 0; O < this.lines.length; O++) h.push(this.lines.get(O));
            const g = this.lines.length;
            let E = g - 1, S = 0, y = c[S];
            this.lines.length = Math.min(this.lines.maxLength, this.lines.length + v);
            let w = 0;
            for (let O = Math.min(this.lines.maxLength - 1, g + v - 1); O >= 0; O--) if (y && y.start > E + w) {
              for (let I = y.newLines.length - 1; I >= 0; I--) this.lines.set(O--, y.newLines[I]);
              O++, m.push({ index: E + 1, amount: y.newLines.length }), w += y.newLines.length, y = c[++S];
            } else this.lines.set(O, h[E--]);
            let R = 0;
            for (let O = m.length - 1; O >= 0; O--) m[O].index += R, this.lines.onInsertEmitter.fire(m[O]), R += m[O].amount;
            const A = Math.max(0, g + v - this.lines.maxLength);
            A > 0 && this.lines.onTrimEmitter.fire(A);
          }
        }
        translateBufferLineToString(t, i, a = 0, c) {
          const v = this.lines.get(t);
          return v ? v.translateToString(i, a, c) : "";
        }
        getWrappedRangeForLine(t) {
          let i = t, a = t;
          for (; i > 0 && this.lines.get(i).isWrapped; ) i--;
          for (; a + 1 < this.lines.length && this.lines.get(a + 1).isWrapped; ) a++;
          return { first: i, last: a };
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
          for (let i = 0; i < this.markers.length; i++) this.markers[i].line === t && (this.markers[i].dispose(), this.markers.splice(i--, 1));
          this._isClearing = !1;
        }
        clearAllMarkers() {
          this._isClearing = !0;
          for (let t = 0; t < this.markers.length; t++) this.markers[t].dispose(), this.markers.splice(t--, 1);
          this._isClearing = !1;
        }
        addMarker(t) {
          const i = new e.Marker(t);
          return this.markers.push(i), i.register(this.lines.onTrim((a) => {
            i.line -= a, i.line < 0 && i.dispose();
          })), i.register(this.lines.onInsert((a) => {
            i.line >= a.index && (i.line += a.amount);
          })), i.register(this.lines.onDelete((a) => {
            i.line >= a.index && i.line < a.index + a.amount && i.dispose(), i.line > a.index && (i.line -= a.amount);
          })), i.register(i.onDispose(() => this._removeMarker(i))), i;
        }
        _removeMarker(t) {
          this._isClearing || this.markers.splice(this.markers.indexOf(t), 1);
        }
      };
    }, 8437: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferLine = s.DEFAULT_ATTR_DATA = void 0;
      const l = o(3734), _ = o(511), n = o(643), d = o(482);
      s.DEFAULT_ATTR_DATA = Object.freeze(new l.AttributeData());
      let f = 0;
      class p {
        constructor(e, r, t = !1) {
          this.isWrapped = t, this._combined = {}, this._extendedAttrs = {}, this._data = new Uint32Array(3 * e);
          const i = r || _.CellData.fromCharData([0, n.NULL_CELL_CHAR, n.NULL_CELL_WIDTH, n.NULL_CELL_CODE]);
          for (let a = 0; a < e; ++a) this.setCell(a, i);
          this.length = e;
        }
        get(e) {
          const r = this._data[3 * e + 0], t = 2097151 & r;
          return [this._data[3 * e + 1], 2097152 & r ? this._combined[e] : t ? (0, d.stringFromCodePoint)(t) : "", r >> 22, 2097152 & r ? this._combined[e].charCodeAt(this._combined[e].length - 1) : t];
        }
        set(e, r) {
          this._data[3 * e + 1] = r[n.CHAR_DATA_ATTR_INDEX], r[n.CHAR_DATA_CHAR_INDEX].length > 1 ? (this._combined[e] = r[1], this._data[3 * e + 0] = 2097152 | e | r[n.CHAR_DATA_WIDTH_INDEX] << 22) : this._data[3 * e + 0] = r[n.CHAR_DATA_CHAR_INDEX].charCodeAt(0) | r[n.CHAR_DATA_WIDTH_INDEX] << 22;
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
          const r = this._data[3 * e + 0];
          return 2097152 & r ? this._combined[e].charCodeAt(this._combined[e].length - 1) : 2097151 & r;
        }
        isCombined(e) {
          return 2097152 & this._data[3 * e + 0];
        }
        getString(e) {
          const r = this._data[3 * e + 0];
          return 2097152 & r ? this._combined[e] : 2097151 & r ? (0, d.stringFromCodePoint)(2097151 & r) : "";
        }
        isProtected(e) {
          return 536870912 & this._data[3 * e + 2];
        }
        loadCell(e, r) {
          return f = 3 * e, r.content = this._data[f + 0], r.fg = this._data[f + 1], r.bg = this._data[f + 2], 2097152 & r.content && (r.combinedData = this._combined[e]), 268435456 & r.bg && (r.extended = this._extendedAttrs[e]), r;
        }
        setCell(e, r) {
          2097152 & r.content && (this._combined[e] = r.combinedData), 268435456 & r.bg && (this._extendedAttrs[e] = r.extended), this._data[3 * e + 0] = r.content, this._data[3 * e + 1] = r.fg, this._data[3 * e + 2] = r.bg;
        }
        setCellFromCodePoint(e, r, t, i, a, c) {
          268435456 & a && (this._extendedAttrs[e] = c), this._data[3 * e + 0] = r | t << 22, this._data[3 * e + 1] = i, this._data[3 * e + 2] = a;
        }
        addCodepointToCell(e, r) {
          let t = this._data[3 * e + 0];
          2097152 & t ? this._combined[e] += (0, d.stringFromCodePoint)(r) : (2097151 & t ? (this._combined[e] = (0, d.stringFromCodePoint)(2097151 & t) + (0, d.stringFromCodePoint)(r), t &= -2097152, t |= 2097152) : t = r | 4194304, this._data[3 * e + 0] = t);
        }
        insertCells(e, r, t, i) {
          if ((e %= this.length) && this.getWidth(e - 1) === 2 && this.setCellFromCodePoint(e - 1, 0, 1, (i == null ? void 0 : i.fg) || 0, (i == null ? void 0 : i.bg) || 0, (i == null ? void 0 : i.extended) || new l.ExtendedAttrs()), r < this.length - e) {
            const a = new _.CellData();
            for (let c = this.length - e - r - 1; c >= 0; --c) this.setCell(e + r + c, this.loadCell(e + c, a));
            for (let c = 0; c < r; ++c) this.setCell(e + c, t);
          } else for (let a = e; a < this.length; ++a) this.setCell(a, t);
          this.getWidth(this.length - 1) === 2 && this.setCellFromCodePoint(this.length - 1, 0, 1, (i == null ? void 0 : i.fg) || 0, (i == null ? void 0 : i.bg) || 0, (i == null ? void 0 : i.extended) || new l.ExtendedAttrs());
        }
        deleteCells(e, r, t, i) {
          if (e %= this.length, r < this.length - e) {
            const a = new _.CellData();
            for (let c = 0; c < this.length - e - r; ++c) this.setCell(e + c, this.loadCell(e + r + c, a));
            for (let c = this.length - r; c < this.length; ++c) this.setCell(c, t);
          } else for (let a = e; a < this.length; ++a) this.setCell(a, t);
          e && this.getWidth(e - 1) === 2 && this.setCellFromCodePoint(e - 1, 0, 1, (i == null ? void 0 : i.fg) || 0, (i == null ? void 0 : i.bg) || 0, (i == null ? void 0 : i.extended) || new l.ExtendedAttrs()), this.getWidth(e) !== 0 || this.hasContent(e) || this.setCellFromCodePoint(e, 0, 1, (i == null ? void 0 : i.fg) || 0, (i == null ? void 0 : i.bg) || 0, (i == null ? void 0 : i.extended) || new l.ExtendedAttrs());
        }
        replaceCells(e, r, t, i, a = !1) {
          if (a) for (e && this.getWidth(e - 1) === 2 && !this.isProtected(e - 1) && this.setCellFromCodePoint(e - 1, 0, 1, (i == null ? void 0 : i.fg) || 0, (i == null ? void 0 : i.bg) || 0, (i == null ? void 0 : i.extended) || new l.ExtendedAttrs()), r < this.length && this.getWidth(r - 1) === 2 && !this.isProtected(r) && this.setCellFromCodePoint(r, 0, 1, (i == null ? void 0 : i.fg) || 0, (i == null ? void 0 : i.bg) || 0, (i == null ? void 0 : i.extended) || new l.ExtendedAttrs()); e < r && e < this.length; ) this.isProtected(e) || this.setCell(e, t), e++;
          else for (e && this.getWidth(e - 1) === 2 && this.setCellFromCodePoint(e - 1, 0, 1, (i == null ? void 0 : i.fg) || 0, (i == null ? void 0 : i.bg) || 0, (i == null ? void 0 : i.extended) || new l.ExtendedAttrs()), r < this.length && this.getWidth(r - 1) === 2 && this.setCellFromCodePoint(r, 0, 1, (i == null ? void 0 : i.fg) || 0, (i == null ? void 0 : i.bg) || 0, (i == null ? void 0 : i.extended) || new l.ExtendedAttrs()); e < r && e < this.length; ) this.setCell(e++, t);
        }
        resize(e, r) {
          if (e === this.length) return 4 * this._data.length * 2 < this._data.buffer.byteLength;
          const t = 3 * e;
          if (e > this.length) {
            if (this._data.buffer.byteLength >= 4 * t) this._data = new Uint32Array(this._data.buffer, 0, t);
            else {
              const i = new Uint32Array(t);
              i.set(this._data), this._data = i;
            }
            for (let i = this.length; i < e; ++i) this.setCell(i, r);
          } else {
            this._data = this._data.subarray(0, t);
            const i = Object.keys(this._combined);
            for (let c = 0; c < i.length; c++) {
              const v = parseInt(i[c], 10);
              v >= e && delete this._combined[v];
            }
            const a = Object.keys(this._extendedAttrs);
            for (let c = 0; c < a.length; c++) {
              const v = parseInt(a[c], 10);
              v >= e && delete this._extendedAttrs[v];
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
        fill(e, r = !1) {
          if (r) for (let t = 0; t < this.length; ++t) this.isProtected(t) || this.setCell(t, e);
          else {
            this._combined = {}, this._extendedAttrs = {};
            for (let t = 0; t < this.length; ++t) this.setCell(t, e);
          }
        }
        copyFrom(e) {
          this.length !== e.length ? this._data = new Uint32Array(e._data) : this._data.set(e._data), this.length = e.length, this._combined = {};
          for (const r in e._combined) this._combined[r] = e._combined[r];
          this._extendedAttrs = {};
          for (const r in e._extendedAttrs) this._extendedAttrs[r] = e._extendedAttrs[r];
          this.isWrapped = e.isWrapped;
        }
        clone() {
          const e = new p(0);
          e._data = new Uint32Array(this._data), e.length = this.length;
          for (const r in this._combined) e._combined[r] = this._combined[r];
          for (const r in this._extendedAttrs) e._extendedAttrs[r] = this._extendedAttrs[r];
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
        copyCellsFrom(e, r, t, i, a) {
          const c = e._data;
          if (a) for (let m = i - 1; m >= 0; m--) {
            for (let h = 0; h < 3; h++) this._data[3 * (t + m) + h] = c[3 * (r + m) + h];
            268435456 & c[3 * (r + m) + 2] && (this._extendedAttrs[t + m] = e._extendedAttrs[r + m]);
          }
          else for (let m = 0; m < i; m++) {
            for (let h = 0; h < 3; h++) this._data[3 * (t + m) + h] = c[3 * (r + m) + h];
            268435456 & c[3 * (r + m) + 2] && (this._extendedAttrs[t + m] = e._extendedAttrs[r + m]);
          }
          const v = Object.keys(e._combined);
          for (let m = 0; m < v.length; m++) {
            const h = parseInt(v[m], 10);
            h >= r && (this._combined[h - r + t] = e._combined[h]);
          }
        }
        translateToString(e = !1, r = 0, t = this.length) {
          e && (t = Math.min(t, this.getTrimmedLength()));
          let i = "";
          for (; r < t; ) {
            const a = this._data[3 * r + 0], c = 2097151 & a;
            i += 2097152 & a ? this._combined[r] : c ? (0, d.stringFromCodePoint)(c) : n.WHITESPACE_CELL_CHAR, r += a >> 22 || 1;
          }
          return i;
        }
      }
      s.BufferLine = p;
    }, 4841: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.getRangeLength = void 0, s.getRangeLength = function(o, l) {
        if (o.start.y > o.end.y) throw new Error(`Buffer range end (${o.end.x}, ${o.end.y}) cannot be before start (${o.start.x}, ${o.start.y})`);
        return l * (o.end.y - o.start.y) + (o.end.x - o.start.x + 1);
      };
    }, 4634: (M, s) => {
      function o(l, _, n) {
        if (_ === l.length - 1) return l[_].getTrimmedLength();
        const d = !l[_].hasContent(n - 1) && l[_].getWidth(n - 1) === 1, f = l[_ + 1].getWidth(0) === 2;
        return d && f ? n - 1 : n;
      }
      Object.defineProperty(s, "__esModule", { value: !0 }), s.getWrappedLineTrimmedLength = s.reflowSmallerGetNewLineLengths = s.reflowLargerApplyNewLayout = s.reflowLargerCreateNewLayout = s.reflowLargerGetLinesToRemove = void 0, s.reflowLargerGetLinesToRemove = function(l, _, n, d, f) {
        const p = [];
        for (let u = 0; u < l.length - 1; u++) {
          let e = u, r = l.get(++e);
          if (!r.isWrapped) continue;
          const t = [l.get(u)];
          for (; e < l.length && r.isWrapped; ) t.push(r), r = l.get(++e);
          if (d >= u && d < e) {
            u += t.length - 1;
            continue;
          }
          let i = 0, a = o(t, i, _), c = 1, v = 0;
          for (; c < t.length; ) {
            const h = o(t, c, _), g = h - v, E = n - a, S = Math.min(g, E);
            t[i].copyCellsFrom(t[c], v, a, S, !1), a += S, a === n && (i++, a = 0), v += S, v === h && (c++, v = 0), a === 0 && i !== 0 && t[i - 1].getWidth(n - 1) === 2 && (t[i].copyCellsFrom(t[i - 1], n - 1, a++, 1, !1), t[i - 1].setCell(n - 1, f));
          }
          t[i].replaceCells(a, n, f);
          let m = 0;
          for (let h = t.length - 1; h > 0 && (h > i || t[h].getTrimmedLength() === 0); h--) m++;
          m > 0 && (p.push(u + t.length - m), p.push(m)), u += t.length - 1;
        }
        return p;
      }, s.reflowLargerCreateNewLayout = function(l, _) {
        const n = [];
        let d = 0, f = _[d], p = 0;
        for (let u = 0; u < l.length; u++) if (f === u) {
          const e = _[++d];
          l.onDeleteEmitter.fire({ index: u - p, amount: e }), u += e - 1, p += e, f = _[++d];
        } else n.push(u);
        return { layout: n, countRemoved: p };
      }, s.reflowLargerApplyNewLayout = function(l, _) {
        const n = [];
        for (let d = 0; d < _.length; d++) n.push(l.get(_[d]));
        for (let d = 0; d < n.length; d++) l.set(d, n[d]);
        l.length = _.length;
      }, s.reflowSmallerGetNewLineLengths = function(l, _, n) {
        const d = [], f = l.map((r, t) => o(l, t, _)).reduce((r, t) => r + t);
        let p = 0, u = 0, e = 0;
        for (; e < f; ) {
          if (f - e < n) {
            d.push(f - e);
            break;
          }
          p += n;
          const r = o(l, u, _);
          p > r && (p -= r, u++);
          const t = l[u].getWidth(p - 1) === 2;
          t && p--;
          const i = t ? n - 1 : n;
          d.push(i), e += i;
        }
        return d;
      }, s.getWrappedLineTrimmedLength = o;
    }, 5295: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferSet = void 0;
      const l = o(8460), _ = o(844), n = o(9092);
      class d extends _.Disposable {
        constructor(p, u) {
          super(), this._optionsService = p, this._bufferService = u, this._onBufferActivate = this.register(new l.EventEmitter()), this.onBufferActivate = this._onBufferActivate.event, this.reset(), this.register(this._optionsService.onSpecificOptionChange("scrollback", () => this.resize(this._bufferService.cols, this._bufferService.rows))), this.register(this._optionsService.onSpecificOptionChange("tabStopWidth", () => this.setupTabStops()));
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
        activateAltBuffer(p) {
          this._activeBuffer !== this._alt && (this._alt.fillViewportRows(p), this._alt.x = this._normal.x, this._alt.y = this._normal.y, this._activeBuffer = this._alt, this._onBufferActivate.fire({ activeBuffer: this._alt, inactiveBuffer: this._normal }));
        }
        resize(p, u) {
          this._normal.resize(p, u), this._alt.resize(p, u), this.setupTabStops(p);
        }
        setupTabStops(p) {
          this._normal.setupTabStops(p), this._alt.setupTabStops(p);
        }
      }
      s.BufferSet = d;
    }, 511: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CellData = void 0;
      const l = o(482), _ = o(643), n = o(3734);
      class d extends n.AttributeData {
        constructor() {
          super(...arguments), this.content = 0, this.fg = 0, this.bg = 0, this.extended = new n.ExtendedAttrs(), this.combinedData = "";
        }
        static fromCharData(p) {
          const u = new d();
          return u.setFromCharData(p), u;
        }
        isCombined() {
          return 2097152 & this.content;
        }
        getWidth() {
          return this.content >> 22;
        }
        getChars() {
          return 2097152 & this.content ? this.combinedData : 2097151 & this.content ? (0, l.stringFromCodePoint)(2097151 & this.content) : "";
        }
        getCode() {
          return this.isCombined() ? this.combinedData.charCodeAt(this.combinedData.length - 1) : 2097151 & this.content;
        }
        setFromCharData(p) {
          this.fg = p[_.CHAR_DATA_ATTR_INDEX], this.bg = 0;
          let u = !1;
          if (p[_.CHAR_DATA_CHAR_INDEX].length > 2) u = !0;
          else if (p[_.CHAR_DATA_CHAR_INDEX].length === 2) {
            const e = p[_.CHAR_DATA_CHAR_INDEX].charCodeAt(0);
            if (55296 <= e && e <= 56319) {
              const r = p[_.CHAR_DATA_CHAR_INDEX].charCodeAt(1);
              56320 <= r && r <= 57343 ? this.content = 1024 * (e - 55296) + r - 56320 + 65536 | p[_.CHAR_DATA_WIDTH_INDEX] << 22 : u = !0;
            } else u = !0;
          } else this.content = p[_.CHAR_DATA_CHAR_INDEX].charCodeAt(0) | p[_.CHAR_DATA_WIDTH_INDEX] << 22;
          u && (this.combinedData = p[_.CHAR_DATA_CHAR_INDEX], this.content = 2097152 | p[_.CHAR_DATA_WIDTH_INDEX] << 22);
        }
        getAsCharData() {
          return [this.fg, this.getChars(), this.getWidth(), this.getCode()];
        }
      }
      s.CellData = d;
    }, 643: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.WHITESPACE_CELL_CODE = s.WHITESPACE_CELL_WIDTH = s.WHITESPACE_CELL_CHAR = s.NULL_CELL_CODE = s.NULL_CELL_WIDTH = s.NULL_CELL_CHAR = s.CHAR_DATA_CODE_INDEX = s.CHAR_DATA_WIDTH_INDEX = s.CHAR_DATA_CHAR_INDEX = s.CHAR_DATA_ATTR_INDEX = s.DEFAULT_EXT = s.DEFAULT_ATTR = s.DEFAULT_COLOR = void 0, s.DEFAULT_COLOR = 0, s.DEFAULT_ATTR = 256 | s.DEFAULT_COLOR << 9, s.DEFAULT_EXT = 0, s.CHAR_DATA_ATTR_INDEX = 0, s.CHAR_DATA_CHAR_INDEX = 1, s.CHAR_DATA_WIDTH_INDEX = 2, s.CHAR_DATA_CODE_INDEX = 3, s.NULL_CELL_CHAR = "", s.NULL_CELL_WIDTH = 1, s.NULL_CELL_CODE = 0, s.WHITESPACE_CELL_CHAR = " ", s.WHITESPACE_CELL_WIDTH = 1, s.WHITESPACE_CELL_CODE = 32;
    }, 4863: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Marker = void 0;
      const l = o(8460), _ = o(844);
      class n {
        get id() {
          return this._id;
        }
        constructor(f) {
          this.line = f, this.isDisposed = !1, this._disposables = [], this._id = n._nextId++, this._onDispose = this.register(new l.EventEmitter()), this.onDispose = this._onDispose.event;
        }
        dispose() {
          this.isDisposed || (this.isDisposed = !0, this.line = -1, this._onDispose.fire(), (0, _.disposeArray)(this._disposables), this._disposables.length = 0);
        }
        register(f) {
          return this._disposables.push(f), f;
        }
      }
      s.Marker = n, n._nextId = 1;
    }, 7116: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DEFAULT_CHARSET = s.CHARSETS = void 0, s.CHARSETS = {}, s.DEFAULT_CHARSET = s.CHARSETS.B, s.CHARSETS[0] = { "`": "◆", a: "▒", b: "␉", c: "␌", d: "␍", e: "␊", f: "°", g: "±", h: "␤", i: "␋", j: "┘", k: "┐", l: "┌", m: "└", n: "┼", o: "⎺", p: "⎻", q: "─", r: "⎼", s: "⎽", t: "├", u: "┤", v: "┴", w: "┬", x: "│", y: "≤", z: "≥", "{": "π", "|": "≠", "}": "£", "~": "·" }, s.CHARSETS.A = { "#": "£" }, s.CHARSETS.B = void 0, s.CHARSETS[4] = { "#": "£", "@": "¾", "[": "ij", "\\": "½", "]": "|", "{": "¨", "|": "f", "}": "¼", "~": "´" }, s.CHARSETS.C = s.CHARSETS[5] = { "[": "Ä", "\\": "Ö", "]": "Å", "^": "Ü", "`": "é", "{": "ä", "|": "ö", "}": "å", "~": "ü" }, s.CHARSETS.R = { "#": "£", "@": "à", "[": "°", "\\": "ç", "]": "§", "{": "é", "|": "ù", "}": "è", "~": "¨" }, s.CHARSETS.Q = { "@": "à", "[": "â", "\\": "ç", "]": "ê", "^": "î", "`": "ô", "{": "é", "|": "ù", "}": "è", "~": "û" }, s.CHARSETS.K = { "@": "§", "[": "Ä", "\\": "Ö", "]": "Ü", "{": "ä", "|": "ö", "}": "ü", "~": "ß" }, s.CHARSETS.Y = { "#": "£", "@": "§", "[": "°", "\\": "ç", "]": "é", "`": "ù", "{": "à", "|": "ò", "}": "è", "~": "ì" }, s.CHARSETS.E = s.CHARSETS[6] = { "@": "Ä", "[": "Æ", "\\": "Ø", "]": "Å", "^": "Ü", "`": "ä", "{": "æ", "|": "ø", "}": "å", "~": "ü" }, s.CHARSETS.Z = { "#": "£", "@": "§", "[": "¡", "\\": "Ñ", "]": "¿", "{": "°", "|": "ñ", "}": "ç" }, s.CHARSETS.H = s.CHARSETS[7] = { "@": "É", "[": "Ä", "\\": "Ö", "]": "Å", "^": "Ü", "`": "é", "{": "ä", "|": "ö", "}": "å", "~": "ü" }, s.CHARSETS["="] = { "#": "ù", "@": "à", "[": "é", "\\": "ç", "]": "ê", "^": "î", _: "è", "`": "ô", "{": "ä", "|": "ö", "}": "ü", "~": "û" };
    }, 2584: (M, s) => {
      var o, l, _;
      Object.defineProperty(s, "__esModule", { value: !0 }), s.C1_ESCAPED = s.C1 = s.C0 = void 0, function(n) {
        n.NUL = "\0", n.SOH = "", n.STX = "", n.ETX = "", n.EOT = "", n.ENQ = "", n.ACK = "", n.BEL = "\x07", n.BS = "\b", n.HT = "	", n.LF = `
`, n.VT = "\v", n.FF = "\f", n.CR = "\r", n.SO = "", n.SI = "", n.DLE = "", n.DC1 = "", n.DC2 = "", n.DC3 = "", n.DC4 = "", n.NAK = "", n.SYN = "", n.ETB = "", n.CAN = "", n.EM = "", n.SUB = "", n.ESC = "\x1B", n.FS = "", n.GS = "", n.RS = "", n.US = "", n.SP = " ", n.DEL = "";
      }(o || (s.C0 = o = {})), function(n) {
        n.PAD = "", n.HOP = "", n.BPH = "", n.NBH = "", n.IND = "", n.NEL = "", n.SSA = "", n.ESA = "", n.HTS = "", n.HTJ = "", n.VTS = "", n.PLD = "", n.PLU = "", n.RI = "", n.SS2 = "", n.SS3 = "", n.DCS = "", n.PU1 = "", n.PU2 = "", n.STS = "", n.CCH = "", n.MW = "", n.SPA = "", n.EPA = "", n.SOS = "", n.SGCI = "", n.SCI = "", n.CSI = "", n.ST = "", n.OSC = "", n.PM = "", n.APC = "";
      }(l || (s.C1 = l = {})), function(n) {
        n.ST = `${o.ESC}\\`;
      }(_ || (s.C1_ESCAPED = _ = {}));
    }, 7399: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.evaluateKeyboardEvent = void 0;
      const l = o(2584), _ = { 48: ["0", ")"], 49: ["1", "!"], 50: ["2", "@"], 51: ["3", "#"], 52: ["4", "$"], 53: ["5", "%"], 54: ["6", "^"], 55: ["7", "&"], 56: ["8", "*"], 57: ["9", "("], 186: [";", ":"], 187: ["=", "+"], 188: [",", "<"], 189: ["-", "_"], 190: [".", ">"], 191: ["/", "?"], 192: ["`", "~"], 219: ["[", "{"], 220: ["\\", "|"], 221: ["]", "}"], 222: ["'", '"'] };
      s.evaluateKeyboardEvent = function(n, d, f, p) {
        const u = { type: 0, cancel: !1, key: void 0 }, e = (n.shiftKey ? 1 : 0) | (n.altKey ? 2 : 0) | (n.ctrlKey ? 4 : 0) | (n.metaKey ? 8 : 0);
        switch (n.keyCode) {
          case 0:
            n.key === "UIKeyInputUpArrow" ? u.key = d ? l.C0.ESC + "OA" : l.C0.ESC + "[A" : n.key === "UIKeyInputLeftArrow" ? u.key = d ? l.C0.ESC + "OD" : l.C0.ESC + "[D" : n.key === "UIKeyInputRightArrow" ? u.key = d ? l.C0.ESC + "OC" : l.C0.ESC + "[C" : n.key === "UIKeyInputDownArrow" && (u.key = d ? l.C0.ESC + "OB" : l.C0.ESC + "[B");
            break;
          case 8:
            if (n.altKey) {
              u.key = l.C0.ESC + l.C0.DEL;
              break;
            }
            u.key = l.C0.DEL;
            break;
          case 9:
            if (n.shiftKey) {
              u.key = l.C0.ESC + "[Z";
              break;
            }
            u.key = l.C0.HT, u.cancel = !0;
            break;
          case 13:
            u.key = n.altKey ? l.C0.ESC + l.C0.CR : l.C0.CR, u.cancel = !0;
            break;
          case 27:
            u.key = l.C0.ESC, n.altKey && (u.key = l.C0.ESC + l.C0.ESC), u.cancel = !0;
            break;
          case 37:
            if (n.metaKey) break;
            e ? (u.key = l.C0.ESC + "[1;" + (e + 1) + "D", u.key === l.C0.ESC + "[1;3D" && (u.key = l.C0.ESC + (f ? "b" : "[1;5D"))) : u.key = d ? l.C0.ESC + "OD" : l.C0.ESC + "[D";
            break;
          case 39:
            if (n.metaKey) break;
            e ? (u.key = l.C0.ESC + "[1;" + (e + 1) + "C", u.key === l.C0.ESC + "[1;3C" && (u.key = l.C0.ESC + (f ? "f" : "[1;5C"))) : u.key = d ? l.C0.ESC + "OC" : l.C0.ESC + "[C";
            break;
          case 38:
            if (n.metaKey) break;
            e ? (u.key = l.C0.ESC + "[1;" + (e + 1) + "A", f || u.key !== l.C0.ESC + "[1;3A" || (u.key = l.C0.ESC + "[1;5A")) : u.key = d ? l.C0.ESC + "OA" : l.C0.ESC + "[A";
            break;
          case 40:
            if (n.metaKey) break;
            e ? (u.key = l.C0.ESC + "[1;" + (e + 1) + "B", f || u.key !== l.C0.ESC + "[1;3B" || (u.key = l.C0.ESC + "[1;5B")) : u.key = d ? l.C0.ESC + "OB" : l.C0.ESC + "[B";
            break;
          case 45:
            n.shiftKey || n.ctrlKey || (u.key = l.C0.ESC + "[2~");
            break;
          case 46:
            u.key = e ? l.C0.ESC + "[3;" + (e + 1) + "~" : l.C0.ESC + "[3~";
            break;
          case 36:
            u.key = e ? l.C0.ESC + "[1;" + (e + 1) + "H" : d ? l.C0.ESC + "OH" : l.C0.ESC + "[H";
            break;
          case 35:
            u.key = e ? l.C0.ESC + "[1;" + (e + 1) + "F" : d ? l.C0.ESC + "OF" : l.C0.ESC + "[F";
            break;
          case 33:
            n.shiftKey ? u.type = 2 : n.ctrlKey ? u.key = l.C0.ESC + "[5;" + (e + 1) + "~" : u.key = l.C0.ESC + "[5~";
            break;
          case 34:
            n.shiftKey ? u.type = 3 : n.ctrlKey ? u.key = l.C0.ESC + "[6;" + (e + 1) + "~" : u.key = l.C0.ESC + "[6~";
            break;
          case 112:
            u.key = e ? l.C0.ESC + "[1;" + (e + 1) + "P" : l.C0.ESC + "OP";
            break;
          case 113:
            u.key = e ? l.C0.ESC + "[1;" + (e + 1) + "Q" : l.C0.ESC + "OQ";
            break;
          case 114:
            u.key = e ? l.C0.ESC + "[1;" + (e + 1) + "R" : l.C0.ESC + "OR";
            break;
          case 115:
            u.key = e ? l.C0.ESC + "[1;" + (e + 1) + "S" : l.C0.ESC + "OS";
            break;
          case 116:
            u.key = e ? l.C0.ESC + "[15;" + (e + 1) + "~" : l.C0.ESC + "[15~";
            break;
          case 117:
            u.key = e ? l.C0.ESC + "[17;" + (e + 1) + "~" : l.C0.ESC + "[17~";
            break;
          case 118:
            u.key = e ? l.C0.ESC + "[18;" + (e + 1) + "~" : l.C0.ESC + "[18~";
            break;
          case 119:
            u.key = e ? l.C0.ESC + "[19;" + (e + 1) + "~" : l.C0.ESC + "[19~";
            break;
          case 120:
            u.key = e ? l.C0.ESC + "[20;" + (e + 1) + "~" : l.C0.ESC + "[20~";
            break;
          case 121:
            u.key = e ? l.C0.ESC + "[21;" + (e + 1) + "~" : l.C0.ESC + "[21~";
            break;
          case 122:
            u.key = e ? l.C0.ESC + "[23;" + (e + 1) + "~" : l.C0.ESC + "[23~";
            break;
          case 123:
            u.key = e ? l.C0.ESC + "[24;" + (e + 1) + "~" : l.C0.ESC + "[24~";
            break;
          default:
            if (!n.ctrlKey || n.shiftKey || n.altKey || n.metaKey) if (f && !p || !n.altKey || n.metaKey) !f || n.altKey || n.ctrlKey || n.shiftKey || !n.metaKey ? n.key && !n.ctrlKey && !n.altKey && !n.metaKey && n.keyCode >= 48 && n.key.length === 1 ? u.key = n.key : n.key && n.ctrlKey && (n.key === "_" && (u.key = l.C0.US), n.key === "@" && (u.key = l.C0.NUL)) : n.keyCode === 65 && (u.type = 1);
            else {
              const r = _[n.keyCode], t = r == null ? void 0 : r[n.shiftKey ? 1 : 0];
              if (t) u.key = l.C0.ESC + t;
              else if (n.keyCode >= 65 && n.keyCode <= 90) {
                const i = n.ctrlKey ? n.keyCode - 64 : n.keyCode + 32;
                let a = String.fromCharCode(i);
                n.shiftKey && (a = a.toUpperCase()), u.key = l.C0.ESC + a;
              } else if (n.keyCode === 32) u.key = l.C0.ESC + (n.ctrlKey ? l.C0.NUL : " ");
              else if (n.key === "Dead" && n.code.startsWith("Key")) {
                let i = n.code.slice(3, 4);
                n.shiftKey || (i = i.toLowerCase()), u.key = l.C0.ESC + i, u.cancel = !0;
              }
            }
            else n.keyCode >= 65 && n.keyCode <= 90 ? u.key = String.fromCharCode(n.keyCode - 64) : n.keyCode === 32 ? u.key = l.C0.NUL : n.keyCode >= 51 && n.keyCode <= 55 ? u.key = String.fromCharCode(n.keyCode - 51 + 27) : n.keyCode === 56 ? u.key = l.C0.DEL : n.keyCode === 219 ? u.key = l.C0.ESC : n.keyCode === 220 ? u.key = l.C0.FS : n.keyCode === 221 && (u.key = l.C0.GS);
        }
        return u;
      };
    }, 482: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Utf8ToUtf32 = s.StringToUtf32 = s.utf32ToString = s.stringFromCodePoint = void 0, s.stringFromCodePoint = function(o) {
        return o > 65535 ? (o -= 65536, String.fromCharCode(55296 + (o >> 10)) + String.fromCharCode(o % 1024 + 56320)) : String.fromCharCode(o);
      }, s.utf32ToString = function(o, l = 0, _ = o.length) {
        let n = "";
        for (let d = l; d < _; ++d) {
          let f = o[d];
          f > 65535 ? (f -= 65536, n += String.fromCharCode(55296 + (f >> 10)) + String.fromCharCode(f % 1024 + 56320)) : n += String.fromCharCode(f);
        }
        return n;
      }, s.StringToUtf32 = class {
        constructor() {
          this._interim = 0;
        }
        clear() {
          this._interim = 0;
        }
        decode(o, l) {
          const _ = o.length;
          if (!_) return 0;
          let n = 0, d = 0;
          if (this._interim) {
            const f = o.charCodeAt(d++);
            56320 <= f && f <= 57343 ? l[n++] = 1024 * (this._interim - 55296) + f - 56320 + 65536 : (l[n++] = this._interim, l[n++] = f), this._interim = 0;
          }
          for (let f = d; f < _; ++f) {
            const p = o.charCodeAt(f);
            if (55296 <= p && p <= 56319) {
              if (++f >= _) return this._interim = p, n;
              const u = o.charCodeAt(f);
              56320 <= u && u <= 57343 ? l[n++] = 1024 * (p - 55296) + u - 56320 + 65536 : (l[n++] = p, l[n++] = u);
            } else p !== 65279 && (l[n++] = p);
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
        decode(o, l) {
          const _ = o.length;
          if (!_) return 0;
          let n, d, f, p, u = 0, e = 0, r = 0;
          if (this.interim[0]) {
            let a = !1, c = this.interim[0];
            c &= (224 & c) == 192 ? 31 : (240 & c) == 224 ? 15 : 7;
            let v, m = 0;
            for (; (v = 63 & this.interim[++m]) && m < 4; ) c <<= 6, c |= v;
            const h = (224 & this.interim[0]) == 192 ? 2 : (240 & this.interim[0]) == 224 ? 3 : 4, g = h - m;
            for (; r < g; ) {
              if (r >= _) return 0;
              if (v = o[r++], (192 & v) != 128) {
                r--, a = !0;
                break;
              }
              this.interim[m++] = v, c <<= 6, c |= 63 & v;
            }
            a || (h === 2 ? c < 128 ? r-- : l[u++] = c : h === 3 ? c < 2048 || c >= 55296 && c <= 57343 || c === 65279 || (l[u++] = c) : c < 65536 || c > 1114111 || (l[u++] = c)), this.interim.fill(0);
          }
          const t = _ - 4;
          let i = r;
          for (; i < _; ) {
            for (; !(!(i < t) || 128 & (n = o[i]) || 128 & (d = o[i + 1]) || 128 & (f = o[i + 2]) || 128 & (p = o[i + 3])); ) l[u++] = n, l[u++] = d, l[u++] = f, l[u++] = p, i += 4;
            if (n = o[i++], n < 128) l[u++] = n;
            else if ((224 & n) == 192) {
              if (i >= _) return this.interim[0] = n, u;
              if (d = o[i++], (192 & d) != 128) {
                i--;
                continue;
              }
              if (e = (31 & n) << 6 | 63 & d, e < 128) {
                i--;
                continue;
              }
              l[u++] = e;
            } else if ((240 & n) == 224) {
              if (i >= _) return this.interim[0] = n, u;
              if (d = o[i++], (192 & d) != 128) {
                i--;
                continue;
              }
              if (i >= _) return this.interim[0] = n, this.interim[1] = d, u;
              if (f = o[i++], (192 & f) != 128) {
                i--;
                continue;
              }
              if (e = (15 & n) << 12 | (63 & d) << 6 | 63 & f, e < 2048 || e >= 55296 && e <= 57343 || e === 65279) continue;
              l[u++] = e;
            } else if ((248 & n) == 240) {
              if (i >= _) return this.interim[0] = n, u;
              if (d = o[i++], (192 & d) != 128) {
                i--;
                continue;
              }
              if (i >= _) return this.interim[0] = n, this.interim[1] = d, u;
              if (f = o[i++], (192 & f) != 128) {
                i--;
                continue;
              }
              if (i >= _) return this.interim[0] = n, this.interim[1] = d, this.interim[2] = f, u;
              if (p = o[i++], (192 & p) != 128) {
                i--;
                continue;
              }
              if (e = (7 & n) << 18 | (63 & d) << 12 | (63 & f) << 6 | 63 & p, e < 65536 || e > 1114111) continue;
              l[u++] = e;
            }
          }
          return u;
        }
      };
    }, 225: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.UnicodeV6 = void 0;
      const o = [[768, 879], [1155, 1158], [1160, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1536, 1539], [1552, 1557], [1611, 1630], [1648, 1648], [1750, 1764], [1767, 1768], [1770, 1773], [1807, 1807], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2305, 2306], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2388], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2672, 2673], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2883], [2893, 2893], [2902, 2902], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3393, 3395], [3405, 3405], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3984, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4146], [4150, 4151], [4153, 4153], [4184, 4185], [4448, 4607], [4959, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7616, 7626], [7678, 7679], [8203, 8207], [8234, 8238], [8288, 8291], [8298, 8303], [8400, 8431], [12330, 12335], [12441, 12442], [43014, 43014], [43019, 43019], [43045, 43046], [64286, 64286], [65024, 65039], [65056, 65059], [65279, 65279], [65529, 65531]], l = [[68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [119143, 119145], [119155, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917505, 917505], [917536, 917631], [917760, 917999]];
      let _;
      s.UnicodeV6 = class {
        constructor() {
          if (this.version = "6", !_) {
            _ = new Uint8Array(65536), _.fill(1), _[0] = 0, _.fill(0, 1, 32), _.fill(0, 127, 160), _.fill(2, 4352, 4448), _[9001] = 2, _[9002] = 2, _.fill(2, 11904, 42192), _[12351] = 1, _.fill(2, 44032, 55204), _.fill(2, 63744, 64256), _.fill(2, 65040, 65050), _.fill(2, 65072, 65136), _.fill(2, 65280, 65377), _.fill(2, 65504, 65511);
            for (let n = 0; n < o.length; ++n) _.fill(0, o[n][0], o[n][1] + 1);
          }
        }
        wcwidth(n) {
          return n < 32 ? 0 : n < 127 ? 1 : n < 65536 ? _[n] : function(d, f) {
            let p, u = 0, e = f.length - 1;
            if (d < f[0][0] || d > f[e][1]) return !1;
            for (; e >= u; ) if (p = u + e >> 1, d > f[p][1]) u = p + 1;
            else {
              if (!(d < f[p][0])) return !0;
              e = p - 1;
            }
            return !1;
          }(n, l) ? 0 : n >= 131072 && n <= 196605 || n >= 196608 && n <= 262141 ? 2 : 1;
        }
      };
    }, 5981: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.WriteBuffer = void 0;
      const l = o(8460), _ = o(844);
      class n extends _.Disposable {
        constructor(f) {
          super(), this._action = f, this._writeBuffer = [], this._callbacks = [], this._pendingData = 0, this._bufferOffset = 0, this._isSyncWriting = !1, this._syncCalls = 0, this._didUserInput = !1, this._onWriteParsed = this.register(new l.EventEmitter()), this.onWriteParsed = this._onWriteParsed.event;
        }
        handleUserInput() {
          this._didUserInput = !0;
        }
        writeSync(f, p) {
          if (p !== void 0 && this._syncCalls > p) return void (this._syncCalls = 0);
          if (this._pendingData += f.length, this._writeBuffer.push(f), this._callbacks.push(void 0), this._syncCalls++, this._isSyncWriting) return;
          let u;
          for (this._isSyncWriting = !0; u = this._writeBuffer.shift(); ) {
            this._action(u);
            const e = this._callbacks.shift();
            e && e();
          }
          this._pendingData = 0, this._bufferOffset = 2147483647, this._isSyncWriting = !1, this._syncCalls = 0;
        }
        write(f, p) {
          if (this._pendingData > 5e7) throw new Error("write data discarded, use flow control to avoid losing data");
          if (!this._writeBuffer.length) {
            if (this._bufferOffset = 0, this._didUserInput) return this._didUserInput = !1, this._pendingData += f.length, this._writeBuffer.push(f), this._callbacks.push(p), void this._innerWrite();
            setTimeout(() => this._innerWrite());
          }
          this._pendingData += f.length, this._writeBuffer.push(f), this._callbacks.push(p);
        }
        _innerWrite(f = 0, p = !0) {
          const u = f || Date.now();
          for (; this._writeBuffer.length > this._bufferOffset; ) {
            const e = this._writeBuffer[this._bufferOffset], r = this._action(e, p);
            if (r) {
              const i = (a) => Date.now() - u >= 12 ? setTimeout(() => this._innerWrite(0, a)) : this._innerWrite(u, a);
              return void r.catch((a) => (queueMicrotask(() => {
                throw a;
              }), Promise.resolve(!1))).then(i);
            }
            const t = this._callbacks[this._bufferOffset];
            if (t && t(), this._bufferOffset++, this._pendingData -= e.length, Date.now() - u >= 12) break;
          }
          this._writeBuffer.length > this._bufferOffset ? (this._bufferOffset > 50 && (this._writeBuffer = this._writeBuffer.slice(this._bufferOffset), this._callbacks = this._callbacks.slice(this._bufferOffset), this._bufferOffset = 0), setTimeout(() => this._innerWrite())) : (this._writeBuffer.length = 0, this._callbacks.length = 0, this._pendingData = 0, this._bufferOffset = 0), this._onWriteParsed.fire();
        }
      }
      s.WriteBuffer = n;
    }, 5941: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.toRgbString = s.parseColor = void 0;
      const o = /^([\da-f])\/([\da-f])\/([\da-f])$|^([\da-f]{2})\/([\da-f]{2})\/([\da-f]{2})$|^([\da-f]{3})\/([\da-f]{3})\/([\da-f]{3})$|^([\da-f]{4})\/([\da-f]{4})\/([\da-f]{4})$/, l = /^[\da-f]+$/;
      function _(n, d) {
        const f = n.toString(16), p = f.length < 2 ? "0" + f : f;
        switch (d) {
          case 4:
            return f[0];
          case 8:
            return p;
          case 12:
            return (p + p).slice(0, 3);
          default:
            return p + p;
        }
      }
      s.parseColor = function(n) {
        if (!n) return;
        let d = n.toLowerCase();
        if (d.indexOf("rgb:") === 0) {
          d = d.slice(4);
          const f = o.exec(d);
          if (f) {
            const p = f[1] ? 15 : f[4] ? 255 : f[7] ? 4095 : 65535;
            return [Math.round(parseInt(f[1] || f[4] || f[7] || f[10], 16) / p * 255), Math.round(parseInt(f[2] || f[5] || f[8] || f[11], 16) / p * 255), Math.round(parseInt(f[3] || f[6] || f[9] || f[12], 16) / p * 255)];
          }
        } else if (d.indexOf("#") === 0 && (d = d.slice(1), l.exec(d) && [3, 6, 9, 12].includes(d.length))) {
          const f = d.length / 3, p = [0, 0, 0];
          for (let u = 0; u < 3; ++u) {
            const e = parseInt(d.slice(f * u, f * u + f), 16);
            p[u] = f === 1 ? e << 4 : f === 2 ? e : f === 3 ? e >> 4 : e >> 8;
          }
          return p;
        }
      }, s.toRgbString = function(n, d = 16) {
        const [f, p, u] = n;
        return `rgb:${_(f, d)}/${_(p, d)}/${_(u, d)}`;
      };
    }, 5770: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.PAYLOAD_LIMIT = void 0, s.PAYLOAD_LIMIT = 1e7;
    }, 6351: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DcsHandler = s.DcsParser = void 0;
      const l = o(482), _ = o(8742), n = o(5770), d = [];
      s.DcsParser = class {
        constructor() {
          this._handlers = /* @__PURE__ */ Object.create(null), this._active = d, this._ident = 0, this._handlerFb = () => {
          }, this._stack = { paused: !1, loopPosition: 0, fallThrough: !1 };
        }
        dispose() {
          this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
          }, this._active = d;
        }
        registerHandler(p, u) {
          this._handlers[p] === void 0 && (this._handlers[p] = []);
          const e = this._handlers[p];
          return e.push(u), { dispose: () => {
            const r = e.indexOf(u);
            r !== -1 && e.splice(r, 1);
          } };
        }
        clearHandler(p) {
          this._handlers[p] && delete this._handlers[p];
        }
        setHandlerFallback(p) {
          this._handlerFb = p;
        }
        reset() {
          if (this._active.length) for (let p = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; p >= 0; --p) this._active[p].unhook(!1);
          this._stack.paused = !1, this._active = d, this._ident = 0;
        }
        hook(p, u) {
          if (this.reset(), this._ident = p, this._active = this._handlers[p] || d, this._active.length) for (let e = this._active.length - 1; e >= 0; e--) this._active[e].hook(u);
          else this._handlerFb(this._ident, "HOOK", u);
        }
        put(p, u, e) {
          if (this._active.length) for (let r = this._active.length - 1; r >= 0; r--) this._active[r].put(p, u, e);
          else this._handlerFb(this._ident, "PUT", (0, l.utf32ToString)(p, u, e));
        }
        unhook(p, u = !0) {
          if (this._active.length) {
            let e = !1, r = this._active.length - 1, t = !1;
            if (this._stack.paused && (r = this._stack.loopPosition - 1, e = u, t = this._stack.fallThrough, this._stack.paused = !1), !t && e === !1) {
              for (; r >= 0 && (e = this._active[r].unhook(p), e !== !0); r--) if (e instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = r, this._stack.fallThrough = !1, e;
              r--;
            }
            for (; r >= 0; r--) if (e = this._active[r].unhook(!1), e instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = r, this._stack.fallThrough = !0, e;
          } else this._handlerFb(this._ident, "UNHOOK", p);
          this._active = d, this._ident = 0;
        }
      };
      const f = new _.Params();
      f.addParam(0), s.DcsHandler = class {
        constructor(p) {
          this._handler = p, this._data = "", this._params = f, this._hitLimit = !1;
        }
        hook(p) {
          this._params = p.length > 1 || p.params[0] ? p.clone() : f, this._data = "", this._hitLimit = !1;
        }
        put(p, u, e) {
          this._hitLimit || (this._data += (0, l.utf32ToString)(p, u, e), this._data.length > n.PAYLOAD_LIMIT && (this._data = "", this._hitLimit = !0));
        }
        unhook(p) {
          let u = !1;
          if (this._hitLimit) u = !1;
          else if (p && (u = this._handler(this._data, this._params), u instanceof Promise)) return u.then((e) => (this._params = f, this._data = "", this._hitLimit = !1, e));
          return this._params = f, this._data = "", this._hitLimit = !1, u;
        }
      };
    }, 2015: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.EscapeSequenceParser = s.VT500_TRANSITION_TABLE = s.TransitionTable = void 0;
      const l = o(844), _ = o(8742), n = o(6242), d = o(6351);
      class f {
        constructor(r) {
          this.table = new Uint8Array(r);
        }
        setDefault(r, t) {
          this.table.fill(r << 4 | t);
        }
        add(r, t, i, a) {
          this.table[t << 8 | r] = i << 4 | a;
        }
        addMany(r, t, i, a) {
          for (let c = 0; c < r.length; c++) this.table[t << 8 | r[c]] = i << 4 | a;
        }
      }
      s.TransitionTable = f;
      const p = 160;
      s.VT500_TRANSITION_TABLE = function() {
        const e = new f(4095), r = Array.apply(null, Array(256)).map((m, h) => h), t = (m, h) => r.slice(m, h), i = t(32, 127), a = t(0, 24);
        a.push(25), a.push.apply(a, t(28, 32));
        const c = t(0, 14);
        let v;
        for (v in e.setDefault(1, 0), e.addMany(i, 0, 2, 0), c) e.addMany([24, 26, 153, 154], v, 3, 0), e.addMany(t(128, 144), v, 3, 0), e.addMany(t(144, 152), v, 3, 0), e.add(156, v, 0, 0), e.add(27, v, 11, 1), e.add(157, v, 4, 8), e.addMany([152, 158, 159], v, 0, 7), e.add(155, v, 11, 3), e.add(144, v, 11, 9);
        return e.addMany(a, 0, 3, 0), e.addMany(a, 1, 3, 1), e.add(127, 1, 0, 1), e.addMany(a, 8, 0, 8), e.addMany(a, 3, 3, 3), e.add(127, 3, 0, 3), e.addMany(a, 4, 3, 4), e.add(127, 4, 0, 4), e.addMany(a, 6, 3, 6), e.addMany(a, 5, 3, 5), e.add(127, 5, 0, 5), e.addMany(a, 2, 3, 2), e.add(127, 2, 0, 2), e.add(93, 1, 4, 8), e.addMany(i, 8, 5, 8), e.add(127, 8, 5, 8), e.addMany([156, 27, 24, 26, 7], 8, 6, 0), e.addMany(t(28, 32), 8, 0, 8), e.addMany([88, 94, 95], 1, 0, 7), e.addMany(i, 7, 0, 7), e.addMany(a, 7, 0, 7), e.add(156, 7, 0, 0), e.add(127, 7, 0, 7), e.add(91, 1, 11, 3), e.addMany(t(64, 127), 3, 7, 0), e.addMany(t(48, 60), 3, 8, 4), e.addMany([60, 61, 62, 63], 3, 9, 4), e.addMany(t(48, 60), 4, 8, 4), e.addMany(t(64, 127), 4, 7, 0), e.addMany([60, 61, 62, 63], 4, 0, 6), e.addMany(t(32, 64), 6, 0, 6), e.add(127, 6, 0, 6), e.addMany(t(64, 127), 6, 0, 0), e.addMany(t(32, 48), 3, 9, 5), e.addMany(t(32, 48), 5, 9, 5), e.addMany(t(48, 64), 5, 0, 6), e.addMany(t(64, 127), 5, 7, 0), e.addMany(t(32, 48), 4, 9, 5), e.addMany(t(32, 48), 1, 9, 2), e.addMany(t(32, 48), 2, 9, 2), e.addMany(t(48, 127), 2, 10, 0), e.addMany(t(48, 80), 1, 10, 0), e.addMany(t(81, 88), 1, 10, 0), e.addMany([89, 90, 92], 1, 10, 0), e.addMany(t(96, 127), 1, 10, 0), e.add(80, 1, 11, 9), e.addMany(a, 9, 0, 9), e.add(127, 9, 0, 9), e.addMany(t(28, 32), 9, 0, 9), e.addMany(t(32, 48), 9, 9, 12), e.addMany(t(48, 60), 9, 8, 10), e.addMany([60, 61, 62, 63], 9, 9, 10), e.addMany(a, 11, 0, 11), e.addMany(t(32, 128), 11, 0, 11), e.addMany(t(28, 32), 11, 0, 11), e.addMany(a, 10, 0, 10), e.add(127, 10, 0, 10), e.addMany(t(28, 32), 10, 0, 10), e.addMany(t(48, 60), 10, 8, 10), e.addMany([60, 61, 62, 63], 10, 0, 11), e.addMany(t(32, 48), 10, 9, 12), e.addMany(a, 12, 0, 12), e.add(127, 12, 0, 12), e.addMany(t(28, 32), 12, 0, 12), e.addMany(t(32, 48), 12, 9, 12), e.addMany(t(48, 64), 12, 0, 11), e.addMany(t(64, 127), 12, 12, 13), e.addMany(t(64, 127), 10, 12, 13), e.addMany(t(64, 127), 9, 12, 13), e.addMany(a, 13, 13, 13), e.addMany(i, 13, 13, 13), e.add(127, 13, 0, 13), e.addMany([27, 156, 24, 26], 13, 14, 0), e.add(p, 0, 2, 0), e.add(p, 8, 5, 8), e.add(p, 6, 0, 6), e.add(p, 11, 0, 11), e.add(p, 13, 13, 13), e;
      }();
      class u extends l.Disposable {
        constructor(r = s.VT500_TRANSITION_TABLE) {
          super(), this._transitions = r, this._parseStack = { state: 0, handlers: [], handlerPos: 0, transition: 0, chunkPos: 0 }, this.initialState = 0, this.currentState = this.initialState, this._params = new _.Params(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0, this._printHandlerFb = (t, i, a) => {
          }, this._executeHandlerFb = (t) => {
          }, this._csiHandlerFb = (t, i) => {
          }, this._escHandlerFb = (t) => {
          }, this._errorHandlerFb = (t) => t, this._printHandler = this._printHandlerFb, this._executeHandlers = /* @__PURE__ */ Object.create(null), this._csiHandlers = /* @__PURE__ */ Object.create(null), this._escHandlers = /* @__PURE__ */ Object.create(null), this.register((0, l.toDisposable)(() => {
            this._csiHandlers = /* @__PURE__ */ Object.create(null), this._executeHandlers = /* @__PURE__ */ Object.create(null), this._escHandlers = /* @__PURE__ */ Object.create(null);
          })), this._oscParser = this.register(new n.OscParser()), this._dcsParser = this.register(new d.DcsParser()), this._errorHandler = this._errorHandlerFb, this.registerEscHandler({ final: "\\" }, () => !0);
        }
        _identifier(r, t = [64, 126]) {
          let i = 0;
          if (r.prefix) {
            if (r.prefix.length > 1) throw new Error("only one byte as prefix supported");
            if (i = r.prefix.charCodeAt(0), i && 60 > i || i > 63) throw new Error("prefix must be in range 0x3c .. 0x3f");
          }
          if (r.intermediates) {
            if (r.intermediates.length > 2) throw new Error("only two bytes as intermediates are supported");
            for (let c = 0; c < r.intermediates.length; ++c) {
              const v = r.intermediates.charCodeAt(c);
              if (32 > v || v > 47) throw new Error("intermediate must be in range 0x20 .. 0x2f");
              i <<= 8, i |= v;
            }
          }
          if (r.final.length !== 1) throw new Error("final must be a single byte");
          const a = r.final.charCodeAt(0);
          if (t[0] > a || a > t[1]) throw new Error(`final must be in range ${t[0]} .. ${t[1]}`);
          return i <<= 8, i |= a, i;
        }
        identToString(r) {
          const t = [];
          for (; r; ) t.push(String.fromCharCode(255 & r)), r >>= 8;
          return t.reverse().join("");
        }
        setPrintHandler(r) {
          this._printHandler = r;
        }
        clearPrintHandler() {
          this._printHandler = this._printHandlerFb;
        }
        registerEscHandler(r, t) {
          const i = this._identifier(r, [48, 126]);
          this._escHandlers[i] === void 0 && (this._escHandlers[i] = []);
          const a = this._escHandlers[i];
          return a.push(t), { dispose: () => {
            const c = a.indexOf(t);
            c !== -1 && a.splice(c, 1);
          } };
        }
        clearEscHandler(r) {
          this._escHandlers[this._identifier(r, [48, 126])] && delete this._escHandlers[this._identifier(r, [48, 126])];
        }
        setEscHandlerFallback(r) {
          this._escHandlerFb = r;
        }
        setExecuteHandler(r, t) {
          this._executeHandlers[r.charCodeAt(0)] = t;
        }
        clearExecuteHandler(r) {
          this._executeHandlers[r.charCodeAt(0)] && delete this._executeHandlers[r.charCodeAt(0)];
        }
        setExecuteHandlerFallback(r) {
          this._executeHandlerFb = r;
        }
        registerCsiHandler(r, t) {
          const i = this._identifier(r);
          this._csiHandlers[i] === void 0 && (this._csiHandlers[i] = []);
          const a = this._csiHandlers[i];
          return a.push(t), { dispose: () => {
            const c = a.indexOf(t);
            c !== -1 && a.splice(c, 1);
          } };
        }
        clearCsiHandler(r) {
          this._csiHandlers[this._identifier(r)] && delete this._csiHandlers[this._identifier(r)];
        }
        setCsiHandlerFallback(r) {
          this._csiHandlerFb = r;
        }
        registerDcsHandler(r, t) {
          return this._dcsParser.registerHandler(this._identifier(r), t);
        }
        clearDcsHandler(r) {
          this._dcsParser.clearHandler(this._identifier(r));
        }
        setDcsHandlerFallback(r) {
          this._dcsParser.setHandlerFallback(r);
        }
        registerOscHandler(r, t) {
          return this._oscParser.registerHandler(r, t);
        }
        clearOscHandler(r) {
          this._oscParser.clearHandler(r);
        }
        setOscHandlerFallback(r) {
          this._oscParser.setHandlerFallback(r);
        }
        setErrorHandler(r) {
          this._errorHandler = r;
        }
        clearErrorHandler() {
          this._errorHandler = this._errorHandlerFb;
        }
        reset() {
          this.currentState = this.initialState, this._oscParser.reset(), this._dcsParser.reset(), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0, this._parseStack.state !== 0 && (this._parseStack.state = 2, this._parseStack.handlers = []);
        }
        _preserveStack(r, t, i, a, c) {
          this._parseStack.state = r, this._parseStack.handlers = t, this._parseStack.handlerPos = i, this._parseStack.transition = a, this._parseStack.chunkPos = c;
        }
        parse(r, t, i) {
          let a, c = 0, v = 0, m = 0;
          if (this._parseStack.state) if (this._parseStack.state === 2) this._parseStack.state = 0, m = this._parseStack.chunkPos + 1;
          else {
            if (i === void 0 || this._parseStack.state === 1) throw this._parseStack.state = 1, new Error("improper continuation due to previous async handler, giving up parsing");
            const h = this._parseStack.handlers;
            let g = this._parseStack.handlerPos - 1;
            switch (this._parseStack.state) {
              case 3:
                if (i === !1 && g > -1) {
                  for (; g >= 0 && (a = h[g](this._params), a !== !0); g--) if (a instanceof Promise) return this._parseStack.handlerPos = g, a;
                }
                this._parseStack.handlers = [];
                break;
              case 4:
                if (i === !1 && g > -1) {
                  for (; g >= 0 && (a = h[g](), a !== !0); g--) if (a instanceof Promise) return this._parseStack.handlerPos = g, a;
                }
                this._parseStack.handlers = [];
                break;
              case 6:
                if (c = r[this._parseStack.chunkPos], a = this._dcsParser.unhook(c !== 24 && c !== 26, i), a) return a;
                c === 27 && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0;
                break;
              case 5:
                if (c = r[this._parseStack.chunkPos], a = this._oscParser.end(c !== 24 && c !== 26, i), a) return a;
                c === 27 && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0;
            }
            this._parseStack.state = 0, m = this._parseStack.chunkPos + 1, this.precedingCodepoint = 0, this.currentState = 15 & this._parseStack.transition;
          }
          for (let h = m; h < t; ++h) {
            switch (c = r[h], v = this._transitions.table[this.currentState << 8 | (c < 160 ? c : p)], v >> 4) {
              case 2:
                for (let w = h + 1; ; ++w) {
                  if (w >= t || (c = r[w]) < 32 || c > 126 && c < p) {
                    this._printHandler(r, h, w), h = w - 1;
                    break;
                  }
                  if (++w >= t || (c = r[w]) < 32 || c > 126 && c < p) {
                    this._printHandler(r, h, w), h = w - 1;
                    break;
                  }
                  if (++w >= t || (c = r[w]) < 32 || c > 126 && c < p) {
                    this._printHandler(r, h, w), h = w - 1;
                    break;
                  }
                  if (++w >= t || (c = r[w]) < 32 || c > 126 && c < p) {
                    this._printHandler(r, h, w), h = w - 1;
                    break;
                  }
                }
                break;
              case 3:
                this._executeHandlers[c] ? this._executeHandlers[c]() : this._executeHandlerFb(c), this.precedingCodepoint = 0;
                break;
              case 0:
                break;
              case 1:
                if (this._errorHandler({ position: h, code: c, currentState: this.currentState, collect: this._collect, params: this._params, abort: !1 }).abort) return;
                break;
              case 7:
                const g = this._csiHandlers[this._collect << 8 | c];
                let E = g ? g.length - 1 : -1;
                for (; E >= 0 && (a = g[E](this._params), a !== !0); E--) if (a instanceof Promise) return this._preserveStack(3, g, E, v, h), a;
                E < 0 && this._csiHandlerFb(this._collect << 8 | c, this._params), this.precedingCodepoint = 0;
                break;
              case 8:
                do
                  switch (c) {
                    case 59:
                      this._params.addParam(0);
                      break;
                    case 58:
                      this._params.addSubParam(-1);
                      break;
                    default:
                      this._params.addDigit(c - 48);
                  }
                while (++h < t && (c = r[h]) > 47 && c < 60);
                h--;
                break;
              case 9:
                this._collect <<= 8, this._collect |= c;
                break;
              case 10:
                const S = this._escHandlers[this._collect << 8 | c];
                let y = S ? S.length - 1 : -1;
                for (; y >= 0 && (a = S[y](), a !== !0); y--) if (a instanceof Promise) return this._preserveStack(4, S, y, v, h), a;
                y < 0 && this._escHandlerFb(this._collect << 8 | c), this.precedingCodepoint = 0;
                break;
              case 11:
                this._params.reset(), this._params.addParam(0), this._collect = 0;
                break;
              case 12:
                this._dcsParser.hook(this._collect << 8 | c, this._params);
                break;
              case 13:
                for (let w = h + 1; ; ++w) if (w >= t || (c = r[w]) === 24 || c === 26 || c === 27 || c > 127 && c < p) {
                  this._dcsParser.put(r, h, w), h = w - 1;
                  break;
                }
                break;
              case 14:
                if (a = this._dcsParser.unhook(c !== 24 && c !== 26), a) return this._preserveStack(6, [], 0, v, h), a;
                c === 27 && (v |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0;
                break;
              case 4:
                this._oscParser.start();
                break;
              case 5:
                for (let w = h + 1; ; w++) if (w >= t || (c = r[w]) < 32 || c > 127 && c < p) {
                  this._oscParser.put(r, h, w), h = w - 1;
                  break;
                }
                break;
              case 6:
                if (a = this._oscParser.end(c !== 24 && c !== 26), a) return this._preserveStack(5, [], 0, v, h), a;
                c === 27 && (v |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingCodepoint = 0;
            }
            this.currentState = 15 & v;
          }
        }
      }
      s.EscapeSequenceParser = u;
    }, 6242: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OscHandler = s.OscParser = void 0;
      const l = o(5770), _ = o(482), n = [];
      s.OscParser = class {
        constructor() {
          this._state = 0, this._active = n, this._id = -1, this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
          }, this._stack = { paused: !1, loopPosition: 0, fallThrough: !1 };
        }
        registerHandler(d, f) {
          this._handlers[d] === void 0 && (this._handlers[d] = []);
          const p = this._handlers[d];
          return p.push(f), { dispose: () => {
            const u = p.indexOf(f);
            u !== -1 && p.splice(u, 1);
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
        _put(d, f, p) {
          if (this._active.length) for (let u = this._active.length - 1; u >= 0; u--) this._active[u].put(d, f, p);
          else this._handlerFb(this._id, "PUT", (0, _.utf32ToString)(d, f, p));
        }
        start() {
          this.reset(), this._state = 1;
        }
        put(d, f, p) {
          if (this._state !== 3) {
            if (this._state === 1) for (; f < p; ) {
              const u = d[f++];
              if (u === 59) {
                this._state = 2, this._start();
                break;
              }
              if (u < 48 || 57 < u) return void (this._state = 3);
              this._id === -1 && (this._id = 0), this._id = 10 * this._id + u - 48;
            }
            this._state === 2 && p - f > 0 && this._put(d, f, p);
          }
        }
        end(d, f = !0) {
          if (this._state !== 0) {
            if (this._state !== 3) if (this._state === 1 && this._start(), this._active.length) {
              let p = !1, u = this._active.length - 1, e = !1;
              if (this._stack.paused && (u = this._stack.loopPosition - 1, p = f, e = this._stack.fallThrough, this._stack.paused = !1), !e && p === !1) {
                for (; u >= 0 && (p = this._active[u].end(d), p !== !0); u--) if (p instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = u, this._stack.fallThrough = !1, p;
                u--;
              }
              for (; u >= 0; u--) if (p = this._active[u].end(!1), p instanceof Promise) return this._stack.paused = !0, this._stack.loopPosition = u, this._stack.fallThrough = !0, p;
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
        put(d, f, p) {
          this._hitLimit || (this._data += (0, _.utf32ToString)(d, f, p), this._data.length > l.PAYLOAD_LIMIT && (this._data = "", this._hitLimit = !0));
        }
        end(d) {
          let f = !1;
          if (this._hitLimit) f = !1;
          else if (d && (f = this._handler(this._data), f instanceof Promise)) return f.then((p) => (this._data = "", this._hitLimit = !1, p));
          return this._data = "", this._hitLimit = !1, f;
        }
      };
    }, 8742: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.Params = void 0;
      const o = 2147483647;
      class l {
        static fromArray(n) {
          const d = new l();
          if (!n.length) return d;
          for (let f = Array.isArray(n[0]) ? 1 : 0; f < n.length; ++f) {
            const p = n[f];
            if (Array.isArray(p)) for (let u = 0; u < p.length; ++u) d.addSubParam(p[u]);
            else d.addParam(p);
          }
          return d;
        }
        constructor(n = 32, d = 32) {
          if (this.maxLength = n, this.maxSubParamsLength = d, d > 256) throw new Error("maxSubParamsLength must not be greater than 256");
          this.params = new Int32Array(n), this.length = 0, this._subParams = new Int32Array(d), this._subParamsLength = 0, this._subParamsIdx = new Uint16Array(n), this._rejectDigits = !1, this._rejectSubDigits = !1, this._digitIsSub = !1;
        }
        clone() {
          const n = new l(this.maxLength, this.maxSubParamsLength);
          return n.params.set(this.params), n.length = this.length, n._subParams.set(this._subParams), n._subParamsLength = this._subParamsLength, n._subParamsIdx.set(this._subParamsIdx), n._rejectDigits = this._rejectDigits, n._rejectSubDigits = this._rejectSubDigits, n._digitIsSub = this._digitIsSub, n;
        }
        toArray() {
          const n = [];
          for (let d = 0; d < this.length; ++d) {
            n.push(this.params[d]);
            const f = this._subParamsIdx[d] >> 8, p = 255 & this._subParamsIdx[d];
            p - f > 0 && n.push(Array.prototype.slice.call(this._subParams, f, p));
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
          const d = this._subParamsIdx[n] >> 8, f = 255 & this._subParamsIdx[n];
          return f - d > 0 ? this._subParams.subarray(d, f) : null;
        }
        getSubParamsAll() {
          const n = {};
          for (let d = 0; d < this.length; ++d) {
            const f = this._subParamsIdx[d] >> 8, p = 255 & this._subParamsIdx[d];
            p - f > 0 && (n[d] = this._subParams.slice(f, p));
          }
          return n;
        }
        addDigit(n) {
          let d;
          if (this._rejectDigits || !(d = this._digitIsSub ? this._subParamsLength : this.length) || this._digitIsSub && this._rejectSubDigits) return;
          const f = this._digitIsSub ? this._subParams : this.params, p = f[d - 1];
          f[d - 1] = ~p ? Math.min(10 * p + n, o) : n;
        }
      }
      s.Params = l;
    }, 5741: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.AddonManager = void 0, s.AddonManager = class {
        constructor() {
          this._addons = [];
        }
        dispose() {
          for (let o = this._addons.length - 1; o >= 0; o--) this._addons[o].instance.dispose();
        }
        loadAddon(o, l) {
          const _ = { instance: l, dispose: l.dispose, isDisposed: !1 };
          this._addons.push(_), l.dispose = () => this._wrappedAddonDispose(_), l.activate(o);
        }
        _wrappedAddonDispose(o) {
          if (o.isDisposed) return;
          let l = -1;
          for (let _ = 0; _ < this._addons.length; _++) if (this._addons[_] === o) {
            l = _;
            break;
          }
          if (l === -1) throw new Error("Could not dispose an addon that has not been loaded");
          o.isDisposed = !0, o.dispose.apply(o.instance), this._addons.splice(l, 1);
        }
      };
    }, 8771: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferApiView = void 0;
      const l = o(3785), _ = o(511);
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
          if (d) return new l.BufferLineApiView(d);
        }
        getNullCell() {
          return new _.CellData();
        }
      };
    }, 3785: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferLineApiView = void 0;
      const l = o(511);
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
          if (!(_ < 0 || _ >= this._line.length)) return n ? (this._line.loadCell(_, n), n) : this._line.loadCell(_, new l.CellData());
        }
        translateToString(_, n, d) {
          return this._line.translateToString(_, n, d);
        }
      };
    }, 8285: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferNamespaceApi = void 0;
      const l = o(8771), _ = o(8460), n = o(844);
      class d extends n.Disposable {
        constructor(p) {
          super(), this._core = p, this._onBufferChange = this.register(new _.EventEmitter()), this.onBufferChange = this._onBufferChange.event, this._normal = new l.BufferApiView(this._core.buffers.normal, "normal"), this._alternate = new l.BufferApiView(this._core.buffers.alt, "alternate"), this._core.buffers.onBufferActivate(() => this._onBufferChange.fire(this.active));
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
    }, 7975: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.ParserApi = void 0, s.ParserApi = class {
        constructor(o) {
          this._core = o;
        }
        registerCsiHandler(o, l) {
          return this._core.registerCsiHandler(o, (_) => l(_.toArray()));
        }
        addCsiHandler(o, l) {
          return this.registerCsiHandler(o, l);
        }
        registerDcsHandler(o, l) {
          return this._core.registerDcsHandler(o, (_, n) => l(_, n.toArray()));
        }
        addDcsHandler(o, l) {
          return this.registerDcsHandler(o, l);
        }
        registerEscHandler(o, l) {
          return this._core.registerEscHandler(o, l);
        }
        addEscHandler(o, l) {
          return this.registerEscHandler(o, l);
        }
        registerOscHandler(o, l) {
          return this._core.registerOscHandler(o, l);
        }
        addOscHandler(o, l) {
          return this.registerOscHandler(o, l);
        }
      };
    }, 7090: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.UnicodeApi = void 0, s.UnicodeApi = class {
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
    }, 744: function(M, s, o) {
      var l = this && this.__decorate || function(e, r, t, i) {
        var a, c = arguments.length, v = c < 3 ? r : i === null ? i = Object.getOwnPropertyDescriptor(r, t) : i;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") v = Reflect.decorate(e, r, t, i);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (v = (c < 3 ? a(v) : c > 3 ? a(r, t, v) : a(r, t)) || v);
        return c > 3 && v && Object.defineProperty(r, t, v), v;
      }, _ = this && this.__param || function(e, r) {
        return function(t, i) {
          r(t, i, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.BufferService = s.MINIMUM_ROWS = s.MINIMUM_COLS = void 0;
      const n = o(8460), d = o(844), f = o(5295), p = o(2585);
      s.MINIMUM_COLS = 2, s.MINIMUM_ROWS = 1;
      let u = s.BufferService = class extends d.Disposable {
        get buffer() {
          return this.buffers.active;
        }
        constructor(e) {
          super(), this.isUserScrolling = !1, this._onResize = this.register(new n.EventEmitter()), this.onResize = this._onResize.event, this._onScroll = this.register(new n.EventEmitter()), this.onScroll = this._onScroll.event, this.cols = Math.max(e.rawOptions.cols || 0, s.MINIMUM_COLS), this.rows = Math.max(e.rawOptions.rows || 0, s.MINIMUM_ROWS), this.buffers = this.register(new f.BufferSet(e, this));
        }
        resize(e, r) {
          this.cols = e, this.rows = r, this.buffers.resize(e, r), this._onResize.fire({ cols: e, rows: r });
        }
        reset() {
          this.buffers.reset(), this.isUserScrolling = !1;
        }
        scroll(e, r = !1) {
          const t = this.buffer;
          let i;
          i = this._cachedBlankLine, i && i.length === this.cols && i.getFg(0) === e.fg && i.getBg(0) === e.bg || (i = t.getBlankLine(e, r), this._cachedBlankLine = i), i.isWrapped = r;
          const a = t.ybase + t.scrollTop, c = t.ybase + t.scrollBottom;
          if (t.scrollTop === 0) {
            const v = t.lines.isFull;
            c === t.lines.length - 1 ? v ? t.lines.recycle().copyFrom(i) : t.lines.push(i.clone()) : t.lines.splice(c + 1, 0, i.clone()), v ? this.isUserScrolling && (t.ydisp = Math.max(t.ydisp - 1, 0)) : (t.ybase++, this.isUserScrolling || t.ydisp++);
          } else {
            const v = c - a + 1;
            t.lines.shiftElements(a + 1, v - 1, -1), t.lines.set(c, i.clone());
          }
          this.isUserScrolling || (t.ydisp = t.ybase), this._onScroll.fire(t.ydisp);
        }
        scrollLines(e, r, t) {
          const i = this.buffer;
          if (e < 0) {
            if (i.ydisp === 0) return;
            this.isUserScrolling = !0;
          } else e + i.ydisp >= i.ybase && (this.isUserScrolling = !1);
          const a = i.ydisp;
          i.ydisp = Math.max(Math.min(i.ydisp + e, i.ybase), 0), a !== i.ydisp && (r || this._onScroll.fire(i.ydisp));
        }
      };
      s.BufferService = u = l([_(0, p.IOptionsService)], u);
    }, 7994: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CharsetService = void 0, s.CharsetService = class {
        constructor() {
          this.glevel = 0, this._charsets = [];
        }
        reset() {
          this.charset = void 0, this._charsets = [], this.glevel = 0;
        }
        setgLevel(o) {
          this.glevel = o, this.charset = this._charsets[o];
        }
        setgCharset(o, l) {
          this._charsets[o] = l, this.glevel === o && (this.charset = l);
        }
      };
    }, 1753: function(M, s, o) {
      var l = this && this.__decorate || function(i, a, c, v) {
        var m, h = arguments.length, g = h < 3 ? a : v === null ? v = Object.getOwnPropertyDescriptor(a, c) : v;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") g = Reflect.decorate(i, a, c, v);
        else for (var E = i.length - 1; E >= 0; E--) (m = i[E]) && (g = (h < 3 ? m(g) : h > 3 ? m(a, c, g) : m(a, c)) || g);
        return h > 3 && g && Object.defineProperty(a, c, g), g;
      }, _ = this && this.__param || function(i, a) {
        return function(c, v) {
          a(c, v, i);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CoreMouseService = void 0;
      const n = o(2585), d = o(8460), f = o(844), p = { NONE: { events: 0, restrict: () => !1 }, X10: { events: 1, restrict: (i) => i.button !== 4 && i.action === 1 && (i.ctrl = !1, i.alt = !1, i.shift = !1, !0) }, VT200: { events: 19, restrict: (i) => i.action !== 32 }, DRAG: { events: 23, restrict: (i) => i.action !== 32 || i.button !== 3 }, ANY: { events: 31, restrict: (i) => !0 } };
      function u(i, a) {
        let c = (i.ctrl ? 16 : 0) | (i.shift ? 4 : 0) | (i.alt ? 8 : 0);
        return i.button === 4 ? (c |= 64, c |= i.action) : (c |= 3 & i.button, 4 & i.button && (c |= 64), 8 & i.button && (c |= 128), i.action === 32 ? c |= 32 : i.action !== 0 || a || (c |= 3)), c;
      }
      const e = String.fromCharCode, r = { DEFAULT: (i) => {
        const a = [u(i, !1) + 32, i.col + 32, i.row + 32];
        return a[0] > 255 || a[1] > 255 || a[2] > 255 ? "" : `\x1B[M${e(a[0])}${e(a[1])}${e(a[2])}`;
      }, SGR: (i) => {
        const a = i.action === 0 && i.button !== 4 ? "m" : "M";
        return `\x1B[<${u(i, !0)};${i.col};${i.row}${a}`;
      }, SGR_PIXELS: (i) => {
        const a = i.action === 0 && i.button !== 4 ? "m" : "M";
        return `\x1B[<${u(i, !0)};${i.x};${i.y}${a}`;
      } };
      let t = s.CoreMouseService = class extends f.Disposable {
        constructor(i, a) {
          super(), this._bufferService = i, this._coreService = a, this._protocols = {}, this._encodings = {}, this._activeProtocol = "", this._activeEncoding = "", this._lastEvent = null, this._onProtocolChange = this.register(new d.EventEmitter()), this.onProtocolChange = this._onProtocolChange.event;
          for (const c of Object.keys(p)) this.addProtocol(c, p[c]);
          for (const c of Object.keys(r)) this.addEncoding(c, r[c]);
          this.reset();
        }
        addProtocol(i, a) {
          this._protocols[i] = a;
        }
        addEncoding(i, a) {
          this._encodings[i] = a;
        }
        get activeProtocol() {
          return this._activeProtocol;
        }
        get areMouseEventsActive() {
          return this._protocols[this._activeProtocol].events !== 0;
        }
        set activeProtocol(i) {
          if (!this._protocols[i]) throw new Error(`unknown protocol "${i}"`);
          this._activeProtocol = i, this._onProtocolChange.fire(this._protocols[i].events);
        }
        get activeEncoding() {
          return this._activeEncoding;
        }
        set activeEncoding(i) {
          if (!this._encodings[i]) throw new Error(`unknown encoding "${i}"`);
          this._activeEncoding = i;
        }
        reset() {
          this.activeProtocol = "NONE", this.activeEncoding = "DEFAULT", this._lastEvent = null;
        }
        triggerMouseEvent(i) {
          if (i.col < 0 || i.col >= this._bufferService.cols || i.row < 0 || i.row >= this._bufferService.rows || i.button === 4 && i.action === 32 || i.button === 3 && i.action !== 32 || i.button !== 4 && (i.action === 2 || i.action === 3) || (i.col++, i.row++, i.action === 32 && this._lastEvent && this._equalEvents(this._lastEvent, i, this._activeEncoding === "SGR_PIXELS")) || !this._protocols[this._activeProtocol].restrict(i)) return !1;
          const a = this._encodings[this._activeEncoding](i);
          return a && (this._activeEncoding === "DEFAULT" ? this._coreService.triggerBinaryEvent(a) : this._coreService.triggerDataEvent(a, !0)), this._lastEvent = i, !0;
        }
        explainEvents(i) {
          return { down: !!(1 & i), up: !!(2 & i), drag: !!(4 & i), move: !!(8 & i), wheel: !!(16 & i) };
        }
        _equalEvents(i, a, c) {
          if (c) {
            if (i.x !== a.x || i.y !== a.y) return !1;
          } else if (i.col !== a.col || i.row !== a.row) return !1;
          return i.button === a.button && i.action === a.action && i.ctrl === a.ctrl && i.alt === a.alt && i.shift === a.shift;
        }
      };
      s.CoreMouseService = t = l([_(0, n.IBufferService), _(1, n.ICoreService)], t);
    }, 6975: function(M, s, o) {
      var l = this && this.__decorate || function(t, i, a, c) {
        var v, m = arguments.length, h = m < 3 ? i : c === null ? c = Object.getOwnPropertyDescriptor(i, a) : c;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") h = Reflect.decorate(t, i, a, c);
        else for (var g = t.length - 1; g >= 0; g--) (v = t[g]) && (h = (m < 3 ? v(h) : m > 3 ? v(i, a, h) : v(i, a)) || h);
        return m > 3 && h && Object.defineProperty(i, a, h), h;
      }, _ = this && this.__param || function(t, i) {
        return function(a, c) {
          i(a, c, t);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.CoreService = void 0;
      const n = o(1439), d = o(8460), f = o(844), p = o(2585), u = Object.freeze({ insertMode: !1 }), e = Object.freeze({ applicationCursorKeys: !1, applicationKeypad: !1, bracketedPasteMode: !1, origin: !1, reverseWraparound: !1, sendFocus: !1, wraparound: !0 });
      let r = s.CoreService = class extends f.Disposable {
        constructor(t, i, a) {
          super(), this._bufferService = t, this._logService = i, this._optionsService = a, this.isCursorInitialized = !1, this.isCursorHidden = !1, this._onData = this.register(new d.EventEmitter()), this.onData = this._onData.event, this._onUserInput = this.register(new d.EventEmitter()), this.onUserInput = this._onUserInput.event, this._onBinary = this.register(new d.EventEmitter()), this.onBinary = this._onBinary.event, this._onRequestScrollToBottom = this.register(new d.EventEmitter()), this.onRequestScrollToBottom = this._onRequestScrollToBottom.event, this.modes = (0, n.clone)(u), this.decPrivateModes = (0, n.clone)(e);
        }
        reset() {
          this.modes = (0, n.clone)(u), this.decPrivateModes = (0, n.clone)(e);
        }
        triggerDataEvent(t, i = !1) {
          if (this._optionsService.rawOptions.disableStdin) return;
          const a = this._bufferService.buffer;
          i && this._optionsService.rawOptions.scrollOnUserInput && a.ybase !== a.ydisp && this._onRequestScrollToBottom.fire(), i && this._onUserInput.fire(), this._logService.debug(`sending data "${t}"`, () => t.split("").map((c) => c.charCodeAt(0))), this._onData.fire(t);
        }
        triggerBinaryEvent(t) {
          this._optionsService.rawOptions.disableStdin || (this._logService.debug(`sending binary "${t}"`, () => t.split("").map((i) => i.charCodeAt(0))), this._onBinary.fire(t));
        }
      };
      s.CoreService = r = l([_(0, p.IBufferService), _(1, p.ILogService), _(2, p.IOptionsService)], r);
    }, 9074: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.DecorationService = void 0;
      const l = o(8055), _ = o(8460), n = o(844), d = o(6106);
      let f = 0, p = 0;
      class u extends n.Disposable {
        get decorations() {
          return this._decorations.values();
        }
        constructor() {
          super(), this._decorations = new d.SortedList((t) => t == null ? void 0 : t.marker.line), this._onDecorationRegistered = this.register(new _.EventEmitter()), this.onDecorationRegistered = this._onDecorationRegistered.event, this._onDecorationRemoved = this.register(new _.EventEmitter()), this.onDecorationRemoved = this._onDecorationRemoved.event, this.register((0, n.toDisposable)(() => this.reset()));
        }
        registerDecoration(t) {
          if (t.marker.isDisposed) return;
          const i = new e(t);
          if (i) {
            const a = i.marker.onDispose(() => i.dispose());
            i.onDispose(() => {
              i && (this._decorations.delete(i) && this._onDecorationRemoved.fire(i), a.dispose());
            }), this._decorations.insert(i), this._onDecorationRegistered.fire(i);
          }
          return i;
        }
        reset() {
          for (const t of this._decorations.values()) t.dispose();
          this._decorations.clear();
        }
        *getDecorationsAtCell(t, i, a) {
          var c, v, m;
          let h = 0, g = 0;
          for (const E of this._decorations.getKeyIterator(i)) h = (c = E.options.x) !== null && c !== void 0 ? c : 0, g = h + ((v = E.options.width) !== null && v !== void 0 ? v : 1), t >= h && t < g && (!a || ((m = E.options.layer) !== null && m !== void 0 ? m : "bottom") === a) && (yield E);
        }
        forEachDecorationAtCell(t, i, a, c) {
          this._decorations.forEachByKey(i, (v) => {
            var m, h, g;
            f = (m = v.options.x) !== null && m !== void 0 ? m : 0, p = f + ((h = v.options.width) !== null && h !== void 0 ? h : 1), t >= f && t < p && (!a || ((g = v.options.layer) !== null && g !== void 0 ? g : "bottom") === a) && c(v);
          });
        }
      }
      s.DecorationService = u;
      class e extends n.Disposable {
        get isDisposed() {
          return this._isDisposed;
        }
        get backgroundColorRGB() {
          return this._cachedBg === null && (this.options.backgroundColor ? this._cachedBg = l.css.toColor(this.options.backgroundColor) : this._cachedBg = void 0), this._cachedBg;
        }
        get foregroundColorRGB() {
          return this._cachedFg === null && (this.options.foregroundColor ? this._cachedFg = l.css.toColor(this.options.foregroundColor) : this._cachedFg = void 0), this._cachedFg;
        }
        constructor(t) {
          super(), this.options = t, this.onRenderEmitter = this.register(new _.EventEmitter()), this.onRender = this.onRenderEmitter.event, this._onDispose = this.register(new _.EventEmitter()), this.onDispose = this._onDispose.event, this._cachedBg = null, this._cachedFg = null, this.marker = t.marker, this.options.overviewRulerOptions && !this.options.overviewRulerOptions.position && (this.options.overviewRulerOptions.position = "full");
        }
        dispose() {
          this._onDispose.fire(), super.dispose();
        }
      }
    }, 4348: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.InstantiationService = s.ServiceCollection = void 0;
      const l = o(2585), _ = o(8343);
      class n {
        constructor(...f) {
          this._entries = /* @__PURE__ */ new Map();
          for (const [p, u] of f) this.set(p, u);
        }
        set(f, p) {
          const u = this._entries.get(f);
          return this._entries.set(f, p), u;
        }
        forEach(f) {
          for (const [p, u] of this._entries.entries()) f(p, u);
        }
        has(f) {
          return this._entries.has(f);
        }
        get(f) {
          return this._entries.get(f);
        }
      }
      s.ServiceCollection = n, s.InstantiationService = class {
        constructor() {
          this._services = new n(), this._services.set(l.IInstantiationService, this);
        }
        setService(d, f) {
          this._services.set(d, f);
        }
        getService(d) {
          return this._services.get(d);
        }
        createInstance(d, ...f) {
          const p = (0, _.getServiceDependencies)(d).sort((r, t) => r.index - t.index), u = [];
          for (const r of p) {
            const t = this._services.get(r.id);
            if (!t) throw new Error(`[createInstance] ${d.name} depends on UNKNOWN service ${r.id}.`);
            u.push(t);
          }
          const e = p.length > 0 ? p[0].index : f.length;
          if (f.length !== e) throw new Error(`[createInstance] First service dependency of ${d.name} at position ${e + 1} conflicts with ${f.length} static arguments`);
          return new d(...f, ...u);
        }
      };
    }, 7866: function(M, s, o) {
      var l = this && this.__decorate || function(e, r, t, i) {
        var a, c = arguments.length, v = c < 3 ? r : i === null ? i = Object.getOwnPropertyDescriptor(r, t) : i;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") v = Reflect.decorate(e, r, t, i);
        else for (var m = e.length - 1; m >= 0; m--) (a = e[m]) && (v = (c < 3 ? a(v) : c > 3 ? a(r, t, v) : a(r, t)) || v);
        return c > 3 && v && Object.defineProperty(r, t, v), v;
      }, _ = this && this.__param || function(e, r) {
        return function(t, i) {
          r(t, i, e);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.traceCall = s.setTraceLogger = s.LogService = void 0;
      const n = o(844), d = o(2585), f = { trace: d.LogLevelEnum.TRACE, debug: d.LogLevelEnum.DEBUG, info: d.LogLevelEnum.INFO, warn: d.LogLevelEnum.WARN, error: d.LogLevelEnum.ERROR, off: d.LogLevelEnum.OFF };
      let p, u = s.LogService = class extends n.Disposable {
        get logLevel() {
          return this._logLevel;
        }
        constructor(e) {
          super(), this._optionsService = e, this._logLevel = d.LogLevelEnum.OFF, this._updateLogLevel(), this.register(this._optionsService.onSpecificOptionChange("logLevel", () => this._updateLogLevel())), p = this;
        }
        _updateLogLevel() {
          this._logLevel = f[this._optionsService.rawOptions.logLevel];
        }
        _evalLazyOptionalParams(e) {
          for (let r = 0; r < e.length; r++) typeof e[r] == "function" && (e[r] = e[r]());
        }
        _log(e, r, t) {
          this._evalLazyOptionalParams(t), e.call(console, (this._optionsService.options.logger ? "" : "xterm.js: ") + r, ...t);
        }
        trace(e, ...r) {
          var t, i;
          this._logLevel <= d.LogLevelEnum.TRACE && this._log((i = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.trace.bind(this._optionsService.options.logger)) !== null && i !== void 0 ? i : console.log, e, r);
        }
        debug(e, ...r) {
          var t, i;
          this._logLevel <= d.LogLevelEnum.DEBUG && this._log((i = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.debug.bind(this._optionsService.options.logger)) !== null && i !== void 0 ? i : console.log, e, r);
        }
        info(e, ...r) {
          var t, i;
          this._logLevel <= d.LogLevelEnum.INFO && this._log((i = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.info.bind(this._optionsService.options.logger)) !== null && i !== void 0 ? i : console.info, e, r);
        }
        warn(e, ...r) {
          var t, i;
          this._logLevel <= d.LogLevelEnum.WARN && this._log((i = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.warn.bind(this._optionsService.options.logger)) !== null && i !== void 0 ? i : console.warn, e, r);
        }
        error(e, ...r) {
          var t, i;
          this._logLevel <= d.LogLevelEnum.ERROR && this._log((i = (t = this._optionsService.options.logger) === null || t === void 0 ? void 0 : t.error.bind(this._optionsService.options.logger)) !== null && i !== void 0 ? i : console.error, e, r);
        }
      };
      s.LogService = u = l([_(0, d.IOptionsService)], u), s.setTraceLogger = function(e) {
        p = e;
      }, s.traceCall = function(e, r, t) {
        if (typeof t.value != "function") throw new Error("not supported");
        const i = t.value;
        t.value = function(...a) {
          if (p.logLevel !== d.LogLevelEnum.TRACE) return i.apply(this, a);
          p.trace(`GlyphRenderer#${i.name}(${a.map((v) => JSON.stringify(v)).join(", ")})`);
          const c = i.apply(this, a);
          return p.trace(`GlyphRenderer#${i.name} return`, c), c;
        };
      };
    }, 7302: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OptionsService = s.DEFAULT_OPTIONS = void 0;
      const l = o(8460), _ = o(844), n = o(6114);
      s.DEFAULT_OPTIONS = { cols: 80, rows: 24, cursorBlink: !1, cursorStyle: "block", cursorWidth: 1, cursorInactiveStyle: "outline", customGlyphs: !0, drawBoldTextInBrightColors: !0, fastScrollModifier: "alt", fastScrollSensitivity: 5, fontFamily: "courier-new, courier, monospace", fontSize: 15, fontWeight: "normal", fontWeightBold: "bold", ignoreBracketedPasteMode: !1, lineHeight: 1, letterSpacing: 0, linkHandler: null, logLevel: "info", logger: null, scrollback: 1e3, scrollOnUserInput: !0, scrollSensitivity: 1, screenReaderMode: !1, smoothScrollDuration: 0, macOptionIsMeta: !1, macOptionClickForcesSelection: !1, minimumContrastRatio: 1, disableStdin: !1, allowProposedApi: !1, allowTransparency: !1, tabStopWidth: 8, theme: {}, rightClickSelectsWord: n.isMac, windowOptions: {}, windowsMode: !1, windowsPty: {}, wordSeparator: " ()[]{}',\"`", altClickMovesCursor: !0, convertEol: !1, termName: "xterm", cancelEvents: !1, overviewRulerWidth: 0 };
      const d = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
      class f extends _.Disposable {
        constructor(u) {
          super(), this._onOptionChange = this.register(new l.EventEmitter()), this.onOptionChange = this._onOptionChange.event;
          const e = Object.assign({}, s.DEFAULT_OPTIONS);
          for (const r in u) if (r in e) try {
            const t = u[r];
            e[r] = this._sanitizeAndValidateOption(r, t);
          } catch (t) {
            console.error(t);
          }
          this.rawOptions = e, this.options = Object.assign({}, e), this._setupOptions();
        }
        onSpecificOptionChange(u, e) {
          return this.onOptionChange((r) => {
            r === u && e(this.rawOptions[u]);
          });
        }
        onMultipleOptionChange(u, e) {
          return this.onOptionChange((r) => {
            u.indexOf(r) !== -1 && e();
          });
        }
        _setupOptions() {
          const u = (r) => {
            if (!(r in s.DEFAULT_OPTIONS)) throw new Error(`No option with key "${r}"`);
            return this.rawOptions[r];
          }, e = (r, t) => {
            if (!(r in s.DEFAULT_OPTIONS)) throw new Error(`No option with key "${r}"`);
            t = this._sanitizeAndValidateOption(r, t), this.rawOptions[r] !== t && (this.rawOptions[r] = t, this._onOptionChange.fire(r));
          };
          for (const r in this.rawOptions) {
            const t = { get: u.bind(this, r), set: e.bind(this, r) };
            Object.defineProperty(this.options, r, t);
          }
        }
        _sanitizeAndValidateOption(u, e) {
          switch (u) {
            case "cursorStyle":
              if (e || (e = s.DEFAULT_OPTIONS[u]), !/* @__PURE__ */ function(r) {
                return r === "block" || r === "underline" || r === "bar";
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
      s.OptionsService = f;
    }, 2660: function(M, s, o) {
      var l = this && this.__decorate || function(f, p, u, e) {
        var r, t = arguments.length, i = t < 3 ? p : e === null ? e = Object.getOwnPropertyDescriptor(p, u) : e;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(f, p, u, e);
        else for (var a = f.length - 1; a >= 0; a--) (r = f[a]) && (i = (t < 3 ? r(i) : t > 3 ? r(p, u, i) : r(p, u)) || i);
        return t > 3 && i && Object.defineProperty(p, u, i), i;
      }, _ = this && this.__param || function(f, p) {
        return function(u, e) {
          p(u, e, f);
        };
      };
      Object.defineProperty(s, "__esModule", { value: !0 }), s.OscLinkService = void 0;
      const n = o(2585);
      let d = s.OscLinkService = class {
        constructor(f) {
          this._bufferService = f, this._nextId = 1, this._entriesWithId = /* @__PURE__ */ new Map(), this._dataByLinkId = /* @__PURE__ */ new Map();
        }
        registerLink(f) {
          const p = this._bufferService.buffer;
          if (f.id === void 0) {
            const a = p.addMarker(p.ybase + p.y), c = { data: f, id: this._nextId++, lines: [a] };
            return a.onDispose(() => this._removeMarkerFromLink(c, a)), this._dataByLinkId.set(c.id, c), c.id;
          }
          const u = f, e = this._getEntryIdKey(u), r = this._entriesWithId.get(e);
          if (r) return this.addLineToLink(r.id, p.ybase + p.y), r.id;
          const t = p.addMarker(p.ybase + p.y), i = { id: this._nextId++, key: this._getEntryIdKey(u), data: u, lines: [t] };
          return t.onDispose(() => this._removeMarkerFromLink(i, t)), this._entriesWithId.set(i.key, i), this._dataByLinkId.set(i.id, i), i.id;
        }
        addLineToLink(f, p) {
          const u = this._dataByLinkId.get(f);
          if (u && u.lines.every((e) => e.line !== p)) {
            const e = this._bufferService.buffer.addMarker(p);
            u.lines.push(e), e.onDispose(() => this._removeMarkerFromLink(u, e));
          }
        }
        getLinkData(f) {
          var p;
          return (p = this._dataByLinkId.get(f)) === null || p === void 0 ? void 0 : p.data;
        }
        _getEntryIdKey(f) {
          return `${f.id};;${f.uri}`;
        }
        _removeMarkerFromLink(f, p) {
          const u = f.lines.indexOf(p);
          u !== -1 && (f.lines.splice(u, 1), f.lines.length === 0 && (f.data.id !== void 0 && this._entriesWithId.delete(f.key), this._dataByLinkId.delete(f.id)));
        }
      };
      s.OscLinkService = d = l([_(0, n.IBufferService)], d);
    }, 8343: (M, s) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.createDecorator = s.getServiceDependencies = s.serviceRegistry = void 0;
      const o = "di$target", l = "di$dependencies";
      s.serviceRegistry = /* @__PURE__ */ new Map(), s.getServiceDependencies = function(_) {
        return _[l] || [];
      }, s.createDecorator = function(_) {
        if (s.serviceRegistry.has(_)) return s.serviceRegistry.get(_);
        const n = function(d, f, p) {
          if (arguments.length !== 3) throw new Error("@IServiceName-decorator can only be used to decorate a parameter");
          (function(u, e, r) {
            e[o] === e ? e[l].push({ id: u, index: r }) : (e[l] = [{ id: u, index: r }], e[o] = e);
          })(n, d, p);
        };
        return n.toString = () => _, s.serviceRegistry.set(_, n), n;
      };
    }, 2585: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.IDecorationService = s.IUnicodeService = s.IOscLinkService = s.IOptionsService = s.ILogService = s.LogLevelEnum = s.IInstantiationService = s.ICharsetService = s.ICoreService = s.ICoreMouseService = s.IBufferService = void 0;
      const l = o(8343);
      var _;
      s.IBufferService = (0, l.createDecorator)("BufferService"), s.ICoreMouseService = (0, l.createDecorator)("CoreMouseService"), s.ICoreService = (0, l.createDecorator)("CoreService"), s.ICharsetService = (0, l.createDecorator)("CharsetService"), s.IInstantiationService = (0, l.createDecorator)("InstantiationService"), function(n) {
        n[n.TRACE = 0] = "TRACE", n[n.DEBUG = 1] = "DEBUG", n[n.INFO = 2] = "INFO", n[n.WARN = 3] = "WARN", n[n.ERROR = 4] = "ERROR", n[n.OFF = 5] = "OFF";
      }(_ || (s.LogLevelEnum = _ = {})), s.ILogService = (0, l.createDecorator)("LogService"), s.IOptionsService = (0, l.createDecorator)("OptionsService"), s.IOscLinkService = (0, l.createDecorator)("OscLinkService"), s.IUnicodeService = (0, l.createDecorator)("UnicodeService"), s.IDecorationService = (0, l.createDecorator)("DecorationService");
    }, 1480: (M, s, o) => {
      Object.defineProperty(s, "__esModule", { value: !0 }), s.UnicodeService = void 0;
      const l = o(8460), _ = o(225);
      s.UnicodeService = class {
        constructor() {
          this._providers = /* @__PURE__ */ Object.create(null), this._active = "", this._onChange = new l.EventEmitter(), this.onChange = this._onChange.event;
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
          const f = n.length;
          for (let p = 0; p < f; ++p) {
            let u = n.charCodeAt(p);
            if (55296 <= u && u <= 56319) {
              if (++p >= f) return d + this.wcwidth(u);
              const e = n.charCodeAt(p);
              56320 <= e && e <= 57343 ? u = 1024 * (u - 55296) + e - 56320 + 65536 : d += this.wcwidth(e);
            }
            d += this.wcwidth(u);
          }
          return d;
        }
      };
    } }, q = {};
    function K(M) {
      var s = q[M];
      if (s !== void 0) return s.exports;
      var o = q[M] = { exports: {} };
      return U[M].call(o.exports, o, o.exports, K), o.exports;
    }
    var Y = {};
    return (() => {
      var M = Y;
      Object.defineProperty(M, "__esModule", { value: !0 }), M.Terminal = void 0;
      const s = K(9042), o = K(3236), l = K(844), _ = K(5741), n = K(8285), d = K(7975), f = K(7090), p = ["cols", "rows"];
      class u extends l.Disposable {
        constructor(r) {
          super(), this._core = this.register(new o.Terminal(r)), this._addonManager = this.register(new _.AddonManager()), this._publicOptions = Object.assign({}, this._core.options);
          const t = (a) => this._core.options[a], i = (a, c) => {
            this._checkReadonlyOptions(a), this._core.options[a] = c;
          };
          for (const a in this._core.options) {
            const c = { get: t.bind(this, a), set: i.bind(this, a) };
            Object.defineProperty(this._publicOptions, a, c);
          }
        }
        _checkReadonlyOptions(r) {
          if (p.includes(r)) throw new Error(`Option "${r}" can only be set in the constructor`);
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
          return this._checkProposedApi(), new f.UnicodeApi(this._core);
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
          const r = this._core.coreService.decPrivateModes;
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
          return { applicationCursorKeysMode: r.applicationCursorKeys, applicationKeypadMode: r.applicationKeypad, bracketedPasteMode: r.bracketedPasteMode, insertMode: this._core.coreService.modes.insertMode, mouseTrackingMode: t, originMode: r.origin, reverseWraparoundMode: r.reverseWraparound, sendFocusMode: r.sendFocus, wraparoundMode: r.wraparound };
        }
        get options() {
          return this._publicOptions;
        }
        set options(r) {
          for (const t in r) this._publicOptions[t] = r[t];
        }
        blur() {
          this._core.blur();
        }
        focus() {
          this._core.focus();
        }
        resize(r, t) {
          this._verifyIntegers(r, t), this._core.resize(r, t);
        }
        open(r) {
          this._core.open(r);
        }
        attachCustomKeyEventHandler(r) {
          this._core.attachCustomKeyEventHandler(r);
        }
        registerLinkProvider(r) {
          return this._core.registerLinkProvider(r);
        }
        registerCharacterJoiner(r) {
          return this._checkProposedApi(), this._core.registerCharacterJoiner(r);
        }
        deregisterCharacterJoiner(r) {
          this._checkProposedApi(), this._core.deregisterCharacterJoiner(r);
        }
        registerMarker(r = 0) {
          return this._verifyIntegers(r), this._core.registerMarker(r);
        }
        registerDecoration(r) {
          var t, i, a;
          return this._checkProposedApi(), this._verifyPositiveIntegers((t = r.x) !== null && t !== void 0 ? t : 0, (i = r.width) !== null && i !== void 0 ? i : 0, (a = r.height) !== null && a !== void 0 ? a : 0), this._core.registerDecoration(r);
        }
        hasSelection() {
          return this._core.hasSelection();
        }
        select(r, t, i) {
          this._verifyIntegers(r, t, i), this._core.select(r, t, i);
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
        selectLines(r, t) {
          this._verifyIntegers(r, t), this._core.selectLines(r, t);
        }
        dispose() {
          super.dispose();
        }
        scrollLines(r) {
          this._verifyIntegers(r), this._core.scrollLines(r);
        }
        scrollPages(r) {
          this._verifyIntegers(r), this._core.scrollPages(r);
        }
        scrollToTop() {
          this._core.scrollToTop();
        }
        scrollToBottom() {
          this._core.scrollToBottom();
        }
        scrollToLine(r) {
          this._verifyIntegers(r), this._core.scrollToLine(r);
        }
        clear() {
          this._core.clear();
        }
        write(r, t) {
          this._core.write(r, t);
        }
        writeln(r, t) {
          this._core.write(r), this._core.write(`\r
`, t);
        }
        paste(r) {
          this._core.paste(r);
        }
        refresh(r, t) {
          this._verifyIntegers(r, t), this._core.refresh(r, t);
        }
        reset() {
          this._core.reset();
        }
        clearTextureAtlas() {
          this._core.clearTextureAtlas();
        }
        loadAddon(r) {
          this._addonManager.loadAddon(this, r);
        }
        static get strings() {
          return s;
        }
        _verifyIntegers(...r) {
          for (const t of r) if (t === 1 / 0 || isNaN(t) || t % 1 != 0) throw new Error("This API only accepts integers");
        }
        _verifyPositiveIntegers(...r) {
          for (const t of r) if (t && (t === 1 / 0 || isNaN(t) || t % 1 != 0 || t < 0)) throw new Error("This API only accepts positive integers");
        }
      }
      M.Terminal = u;
    })(), Y;
  })());
})(Ae);
var Ue = Ae.exports, Te = { exports: {} };
(function(P, z) {
  (function(U, q) {
    P.exports = q();
  })(self, () => (() => {
    var U = {};
    return (() => {
      var q = U;
      Object.defineProperty(q, "__esModule", { value: !0 }), q.FitAddon = void 0, q.FitAddon = class {
        activate(K) {
          this._terminal = K;
        }
        dispose() {
        }
        fit() {
          const K = this.proposeDimensions();
          if (!K || !this._terminal || isNaN(K.cols) || isNaN(K.rows)) return;
          const Y = this._terminal._core;
          this._terminal.rows === K.rows && this._terminal.cols === K.cols || (Y._renderService.clear(), this._terminal.resize(K.cols, K.rows));
        }
        proposeDimensions() {
          if (!this._terminal || !this._terminal.element || !this._terminal.element.parentElement) return;
          const K = this._terminal._core, Y = K._renderService.dimensions;
          if (Y.css.cell.width === 0 || Y.css.cell.height === 0) return;
          const M = this._terminal.options.scrollback === 0 ? 0 : K.viewport.scrollBarWidth, s = window.getComputedStyle(this._terminal.element.parentElement), o = parseInt(s.getPropertyValue("height")), l = Math.max(0, parseInt(s.getPropertyValue("width"))), _ = window.getComputedStyle(this._terminal.element), n = o - (parseInt(_.getPropertyValue("padding-top")) + parseInt(_.getPropertyValue("padding-bottom"))), d = l - (parseInt(_.getPropertyValue("padding-right")) + parseInt(_.getPropertyValue("padding-left"))) - M;
          return { cols: Math.max(2, Math.floor(d / Y.css.cell.width)), rows: Math.max(1, Math.floor(n / Y.css.cell.height)) };
        }
      };
    })(), U;
  })());
})(Te);
var je = Te.exports;
const ze = `/**
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
 */.xterm{cursor:text;position:relative;user-select:none;-ms-user-select:none;-webkit-user-select:none}.xterm.focus,.xterm:focus{outline:none}.xterm .xterm-helpers{position:absolute;top:0;z-index:5}.xterm .xterm-helper-textarea{padding:0;border:0;margin:0;position:absolute;opacity:0;left:-9999em;top:0;width:0;height:0;z-index:-5;white-space:nowrap;overflow:hidden;resize:none}.xterm .composition-view{background:#000;color:#fff;display:none;position:absolute;white-space:nowrap;z-index:1}.xterm .composition-view.active{display:block}.xterm .xterm-viewport{background-color:#000;overflow-y:scroll;cursor:default;position:absolute;right:0;left:0;top:0;bottom:0}.xterm .xterm-screen{position:relative}.xterm .xterm-screen canvas{position:absolute;left:0;top:0}.xterm .xterm-scroll-area{visibility:hidden}.xterm-char-measure-element{display:inline-block;visibility:hidden;position:absolute;top:0;left:-9999em;line-height:normal}.xterm.enable-mouse-events{cursor:default}.xterm.xterm-cursor-pointer,.xterm .xterm-cursor-pointer{cursor:pointer}.xterm.column-select.focus{cursor:crosshair}.xterm .xterm-accessibility,.xterm .xterm-message{position:absolute;left:0;top:0;bottom:0;right:0;z-index:10;color:transparent;pointer-events:none}.xterm .live-region{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.xterm-dim{opacity:1!important}.xterm-underline-1{text-decoration:underline}.xterm-underline-2{text-decoration:double underline}.xterm-underline-3{text-decoration:wavy underline}.xterm-underline-4{text-decoration:dotted underline}.xterm-underline-5{text-decoration:dashed underline}.xterm-overline{text-decoration:overline}.xterm-overline.xterm-underline-1{text-decoration:overline underline}.xterm-overline.xterm-underline-2{text-decoration:overline double underline}.xterm-overline.xterm-underline-3{text-decoration:overline wavy underline}.xterm-overline.xterm-underline-4{text-decoration:overline dotted underline}.xterm-overline.xterm-underline-5{text-decoration:overline dashed underline}.xterm-strikethrough{text-decoration:line-through}.xterm-screen .xterm-decoration-container .xterm-decoration{z-index:6;position:absolute}.xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer{z-index:7}.xterm-decoration-overview-ruler{z-index:8;position:absolute;top:0;right:0;pointer-events:none}.xterm-decoration-top{z-index:2;position:relative}`, $e = '.hv-app-host{position:relative;height:100%}.hv-root{position:relative;display:flex;height:100%;min-height:480px;background:var(--bg, #0b0e14);color:var(--text, #d7dae0);font-family:var(--font-body, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif)}.hv-sidebar{width:260px;flex:0 0 260px;border-right:1px solid var(--border, #1b2130);padding:16px;overflow-y:auto;background:var(--card, #0e1219)}.hv-brand{font-size:16px;font-weight:700;letter-spacing:.02em;margin-bottom:16px;color:var(--text-strong, #e8ecf4)}.hv-section-title{display:flex;align-items:center;gap:4px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted, #6b7488);margin:18px 0 8px;cursor:pointer;-webkit-user-select:none;user-select:none}.hv-section-title:hover{color:var(--text, #d7dae0)}.hv-chevron{flex:none;transform:rotate(90deg);transition:transform .12s ease;opacity:.7}.hv-section-title.hv-collapsed .hv-chevron{transform:rotate(0)}.hv-prov-list{display:flex;flex-direction:column;gap:4px}.hv-prov{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--text, #b6bdcc);border:1px solid transparent;transition:background .12s ease}.hv-prov-ico{width:15px;height:15px;flex:0 0 15px;color:var(--muted-strong, #9aa3b5)}.hv-prov.hv-active .hv-prov-ico{color:var(--text-strong, #fff)}.hv-prov:hover{background:var(--bg-hover, #161b26)}.hv-prov.hv-active{background:var(--bg-accent, #212a3b);color:var(--text-strong, #fff);border-color:var(--border-strong, #35405a)}.hv-na{color:var(--muted-strong, #6b7488);font-size:11px}.hv-disc{display:flex;flex-direction:column;gap:4px}.hv-disc-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--text, #c3cad9);background:var(--bg-elevated, #141926);border:1px solid var(--border, #1d2333);transition:background .12s ease}.hv-disc-item:hover{background:var(--bg-hover, #1c2436)}.hv-disc-dot{width:8px;height:8px;border-radius:50%;background:var(--ok, #34d399);flex:0 0 8px}.hv-disc-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hv-disc-prov{display:inline-flex;align-items:center;gap:4px;font-size:10px;color:var(--muted, #6b7488);text-transform:uppercase;letter-spacing:.04em}.hv-disc-ico{width:11px;height:11px;flex:0 0 11px;color:var(--muted-strong, #9aa3b5)}.hv-main{flex:1;display:flex;flex-direction:column;min-width:0;min-height:0}.hv-form{display:flex;gap:10px;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid var(--border, #1b2130);background:var(--card, #0e1219)}.hv-form-row{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.hv-inp{background:var(--bg-elevated, #141926);border:1px solid var(--border, #232c40);color:var(--text-strong, #e8ecf4);border-radius:6px;padding:8px 10px;font-size:13px;font-family:inherit;outline:none;flex:1}.hv-inp::placeholder{color:var(--muted, #6b7488)}.hv-inp:focus{border-color:var(--accent, #3b82f6)}.hv-inp.hv-wide{flex:1;min-width:260px}.hv-btn{background:var(--accent, #2563eb);color:var(--accent-fg, #fff);border:none;border-radius:6px;padding:8px 16px;font-size:13px;font-family:inherit;font-weight:600;cursor:pointer;white-space:nowrap}.hv-btn:hover:not(:disabled){background:var(--accent-hover, #2563eb)}.hv-btn:disabled{opacity:.5;cursor:default}.hv-panes{flex:1;min-height:0;display:flex;overflow:hidden;background:var(--bg, #0f1117)}.hv-pane{display:flex;flex:1;flex-direction:column;min-width:0;min-height:0;background:var(--card, #0f1117);overflow:hidden}.hv-pane-top{display:flex;align-items:center;gap:10px;padding:6px 10px;background:var(--bg-elevated, #141a26);border-bottom:1px solid var(--border, #1d2435);font-size:12px;color:var(--muted, #9aa3b5)}.hv-pane-title{display:inline-flex;align-items:center;gap:6px;min-width:0;font-family:var(--mono, Menlo, Consolas, monospace);color:var(--text-strong, #e8ecf4)}.hv-pane-ico{width:14px;height:14px;flex:0 0 14px;color:var(--muted-strong, #9aa3b5)}.hv-pane-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hv-pane-prov{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted, #6b7488);flex:0 0 auto}.hv-pane-cmd{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--mono, Menlo, Consolas, monospace);color:var(--muted, #6b7488)}.hv-pane-actions{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto}.hv-btn-sm{background:transparent;border:1px solid var(--border-strong, #2a3450);color:var(--muted, #9aa3b5);border-radius:4px;font-size:11px;font-family:inherit;padding:2px 8px;cursor:pointer}.hv-btn-sm:hover{color:var(--text-strong, #fff);border-color:var(--accent, #3b82f6)}.hv-danger:hover{color:var(--danger, #f87171);border-color:var(--danger, #f87171)}.hv-x{background:transparent;border:none;color:var(--muted, #9aa3b5);border-radius:4px;font-size:12px;line-height:1;font-family:inherit;padding:3px 5px;cursor:pointer}.hv-x:hover{color:var(--text-strong, #fff);background:var(--bg-hover, #1c2436)}.hv-term{flex:1;min-height:0;padding:4px 6px;background:var(--bg, #0f1117)}.hv-term .xterm{height:100%}.hv-ended{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:24px;text-align:center;color:var(--muted, #6b7488);font-size:13px}.hv-ended-title{color:var(--text-strong, #e8ecf4);font-size:14px;font-weight:600}.hv-ended-note{max-width:620px}.hv-mono{font-family:var(--mono, Menlo, Consolas, monospace);color:var(--text, #c3cad9)}.hv-ended-actions{display:flex;gap:8px;margin-top:4px}.hv-btn-ghost{background:transparent;border:1px solid var(--border-strong, #2a3450);color:var(--text, #c3cad9)}.hv-btn-ghost:hover:not(:disabled){background:var(--bg-hover, #1c2436)}.hv-welcome{flex:1;display:flex;align-items:center;justify-content:center;color:var(--muted, #6b7488);font-size:13px;padding:40px;text-align:center}.hv-empty{color:var(--muted, #6b7488);font-size:13px;padding:8px}.hv-empty.sm{font-size:12px;padding:4px 0}.hv-pset{display:flex;flex-direction:column;gap:2px}.hv-sess{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--text, #c3cad9);border:1px solid transparent;border-left:2px solid transparent;transition:background .12s ease}.hv-sess:hover{background:var(--bg-hover, #1c2436)}.hv-sess.hv-active{background:var(--bg-accent, #212a3b);color:var(--text-strong, #fff);border-left-color:var(--accent, #3b82f6)}.hv-sess-ico{width:13px;height:13px;flex:0 0 13px;color:var(--muted-strong, #9aa3b5)}.hv-sess.hv-active .hv-sess-ico{color:var(--accent, #3b82f6)}.hv-sess-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hv-sess-prov{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted, #6b7488)}.hv-sess-ended{opacity:.6}.hv-sess-ended .hv-sess-ico{color:var(--danger, #f87171)}.hv-count{margin-left:6px;padding:0 5px;border-radius:8px;background:var(--bg-elevated, #141926);color:var(--muted-strong, #6b7488);font-size:10px;letter-spacing:0}.hv-prov-na{opacity:.55}.hv-disc-open{border-color:var(--accent, #3b82f6)}.hv-disc-open .hv-disc-dot{background:var(--accent, #3b82f6)}.hv-warn{flex-basis:100%;color:var(--warn, #b58900);font-size:12px;padding:2px 0}.hv-link{background:none;border:none;padding:0;font:inherit;color:var(--accent, #3b82f6);text-decoration:underline;cursor:pointer}.hv-hint-icon{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:none;background:transparent;color:var(--muted, #6b7488);cursor:default;border-radius:50%;transition:color .15s,background .15s}.hv-hint-icon:hover,.hv-hint-icon:focus-visible{color:var(--fg, #c9d1e0);background:var(--hover-bg, rgba(255,255,255,.07));outline:none}.hv-toasts{position:fixed;right:16px;bottom:16px;z-index:1000;display:flex;flex-direction:column;gap:8px;max-width:min(420px,calc(100vw - 32px));pointer-events:none}.hv-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:8px;border:1px solid var(--border, rgba(255,255,255,.12));background:var(--panel, #161b22);color:var(--fg, #c9d1e0);font-size:12px;line-height:1.4;box-shadow:0 6px 24px #00000059}.hv-toast-error{border-color:var(--danger, #f87171);border-left-width:3px}.hv-toast-msg{flex:1 1 auto;min-width:0;overflow-wrap:anywhere}.hv-toast-close{flex:0 0 auto;padding:0;border:none;background:transparent;color:var(--muted, #6b7488);cursor:pointer;font-size:13px;line-height:1}.hv-toast-close:hover,.hv-toast-close:focus-visible{color:var(--fg, #c9d1e0);outline:none}', _e = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, Ke = (P) => /* @__PURE__ */ F("svg", { ..._e, ...P, children: /* @__PURE__ */ F("path", { d: "M6 6.5h12L6 17.5h12" }) }), qe = (P) => /* @__PURE__ */ J("svg", { ..._e, ...P, children: [
  /* @__PURE__ */ F("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
  /* @__PURE__ */ F("line", { x1: "4", y1: "12.5", x2: "20", y2: "12.5" }),
  /* @__PURE__ */ F("path", { d: "M7 8.2 L9.4 10.2 L7 12.2" }),
  /* @__PURE__ */ F("line", { x1: "13", y1: "15.8", x2: "17", y2: "15.8", opacity: "0.55" })
] }), Ve = (P) => /* @__PURE__ */ J("svg", { ..._e, ...P, children: [
  /* @__PURE__ */ F("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
  /* @__PURE__ */ F("line", { x1: "12.5", y1: "4", x2: "12.5", y2: "20" }),
  /* @__PURE__ */ F("path", { d: "M6.6 8.2 L9 10.2 L6.6 12.2" }),
  /* @__PURE__ */ F("circle", { cx: "16", cy: "9.2", r: "1", fill: "currentColor", stroke: "none" })
] }), Ge = (P) => /* @__PURE__ */ J("svg", { ..._e, ...P, children: [
  /* @__PURE__ */ F("circle", { cx: "12", cy: "12", r: "4.2" }),
  /* @__PURE__ */ F("circle", { cx: "12", cy: "12", r: "1.2", fill: "currentColor", stroke: "none" }),
  /* @__PURE__ */ F("circle", { cx: "7.8", cy: "12", r: "0.9", fill: "currentColor", stroke: "none" }),
  /* @__PURE__ */ F("circle", { cx: "16.2", cy: "12", r: "0.9", fill: "currentColor", stroke: "none" })
] }), Xe = (P) => /* @__PURE__ */ J("svg", { ..._e, ...P, children: [
  /* @__PURE__ */ F("path", { d: "M6 15.5 L7.4 8.4 L10.4 11.4 L12 7.2 L13.6 11.4 L16.6 8.4 L18 15.5 Z" }),
  /* @__PURE__ */ F("line", { x1: "6", y1: "18", x2: "18", y2: "18" })
] }), Me = (P) => /* @__PURE__ */ J("svg", { ..._e, ...P, children: [
  /* @__PURE__ */ F("path", { d: "M12 4.5 L14 8 H10 Z" }),
  /* @__PURE__ */ F("path", { d: "M10 8 h4 v8.5 h-4 Z" }),
  /* @__PURE__ */ F("line", { x1: "10", y1: "11.2", x2: "14", y2: "11.2", opacity: "0.5" })
] }), Je = {
  zellij: Ke,
  screen: qe,
  tmux: Ve,
  herdr: Ge,
  aoe: Xe,
  custom: Me
};
function Se({ id: P, ...z }) {
  const U = Je[P] || Me;
  return /* @__PURE__ */ F(U, { ...z });
}
function Ye(P) {
  const z = /* @__PURE__ */ new Set();
  let U = 0;
  const q = /* @__PURE__ */ new Set(), K = Qe;
  function Y(_, n, d) {
    const f = d || "";
    f && q.add(f);
    const p = { id: ++U, text: String(_), severity: n === "error" ? "error" : "info", dedupeKey: f };
    z.forEach((u) => {
      try {
        u({ op: "add", toast: p });
      } catch {
      }
    });
  }
  function M(_) {
    _ && (q.delete(_), z.forEach((n) => {
      try {
        n({ op: "clear", dedupeKey: _ });
      } catch {
      }
    }));
  }
  function s(_, n, d) {
    !!d && q.has(d) || K(n === "error" ? "error" : "info", _), n === "error" && Y(_, "error", d);
  }
  function o(_) {
    return z.add(_), () => {
      z.delete(_);
    };
  }
  function l() {
    return q.size;
  }
  return { pushToast: Y, clearToast: M, notify: s, subscribe: o, keyCount: l };
}
function Ze(P, z) {
  if (z.op === "clear") return P.filter((K) => K.dedupeKey !== z.dedupeKey);
  const U = z.toast;
  return [...U.dedupeKey ? P.filter((K) => K.dedupeKey !== U.dedupeKey) : P, U];
}
function Qe(P, z) {
  try {
    typeof window < "u" && window.parent && typeof window.parent.postMessage == "function" && window.parent !== window && window.parent.postMessage({ source: "kiro-herdr-views", type: "notify", text: z, severity: P }, "*");
  } catch {
  }
  console.log("[herdr-views]", z);
}
const Oe = Ye();
function et(P) {
  return P && (P.taken ? P.suggested : P.name) || "";
}
let Le = !1;
function Ie() {
  if (Le) return;
  Le = !0;
  const P = document.createElement("style");
  P.textContent = ze + `
` + $e, document.head.appendChild(P);
}
const tt = "kiro-herdr-views", it = "/apps/" + tt + "/api", Pe = "kiro-herdr-views:panes", He = "kiro-herdr-views:active", ne = (P) => it + P, be = (P) => Array.isArray(P) ? P.join(" ") : String(P || "");
function rt() {
  try {
    const P = window.localStorage.getItem(Pe), z = P ? JSON.parse(P) : [];
    return Array.isArray(z) ? z.filter((U) => U && U.ref && U.cmd) : [];
  } catch {
    return [];
  }
}
function st(P) {
  try {
    window.localStorage.setItem(Pe, JSON.stringify(P));
  } catch {
  }
}
function nt() {
  try {
    return window.localStorage.getItem(He) || "";
  } catch {
    return "";
  }
}
function ot(P) {
  try {
    window.localStorage.setItem(He, P || "");
  } catch {
  }
}
async function ke(P, z) {
  let U = "";
  try {
    const q = await P.json();
    U = q && (q.error || q.reason) || "";
  } catch {
  }
  return new Error(U || z + " -> " + P.status);
}
async function Fe(P) {
  const z = await fetch(P, { credentials: "same-origin" });
  if (!z.ok) throw await ke(z, "GET " + P);
  return z.json();
}
async function ue(P, z) {
  const U = await fetch(P, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(z || {})
  });
  if (!U.ok) throw await ke(U, "POST " + P);
  return U.json();
}
async function Re(P) {
  const z = await fetch(P, { method: "DELETE", credentials: "same-origin" });
  if (!z.ok) throw await ke(z, "DELETE " + P);
  return z.json();
}
const { clearToast: ce, notify: oe } = Oe;
function at() {
  const [P, z] = G.useState([]);
  G.useEffect(() => Oe.subscribe((K) => z((Y) => Ze(Y, K))), []);
  const U = (q) => {
    const K = P.find((Y) => Y.id === q);
    K && K.dedupeKey && ce(K.dedupeKey), z((Y) => Y.filter((M) => M.id !== q));
  };
  return P.length === 0 ? null : /* @__PURE__ */ F("div", { className: "hv-toasts", role: "region", "aria-label": "Notifications", children: P.map((q) => /* @__PURE__ */ J("div", { className: "hv-toast hv-toast-" + q.severity, role: "alert", children: [
    /* @__PURE__ */ F("span", { className: "hv-toast-msg", children: q.text }),
    /* @__PURE__ */ F("button", { type: "button", className: "hv-toast-close", "aria-label": "Dismiss", title: "Dismiss", onClick: () => U(q.id), children: "✕" })
  ] }, q.id)) });
}
function te(P, z) {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(P).trim() || z;
  } catch {
    return z;
  }
}
function ht(P, z) {
  const U = te(P, "").split(",").map((q) => q.trim()).filter(Boolean);
  return U.length ? U.join(", ") : z;
}
function De() {
  const P = te("--bg", "#0b0e14"), z = te("--text-strong", "#eee8d5");
  return {
    background: P,
    foreground: te("--text", "#d7dae0"),
    cursor: te("--accent", "#3b82f6"),
    cursorAccent: P,
    selectionBackground: te("--accent-subtle", "rgba(59,130,246,0.3)"),
    black: te("--bg-accent", "#073642"),
    red: te("--danger", "#dc322f"),
    green: te("--ok", "#859900"),
    yellow: te("--warn", "#b58900"),
    blue: te("--info", "#268bd2"),
    magenta: te("--term-magenta", "#c678dd"),
    cyan: te("--term-cyan", "#56b6c2"),
    white: z,
    brightBlack: te("--muted-strong", "#586e75"),
    brightRed: te("--danger", "#dc322f"),
    brightGreen: te("--ok", "#859900"),
    brightYellow: te("--warn", "#b58900"),
    brightBlue: te("--info", "#268bd2"),
    brightMagenta: te("--term-magenta", "#c678dd"),
    brightCyan: te("--term-cyan", "#56b6c2"),
    brightWhite: z
  };
}
function lt({ session: P, ended: z, killable: U, onExit: q, onClose: K, onKill: Y, onRestart: M }) {
  const s = G.useRef(null), o = G.useRef("ws"), l = G.useRef(null), _ = G.useRef(null), n = G.useRef(q);
  return G.useEffect(() => {
    n.current = q;
  }, [q]), G.useEffect(() => {
    if (z) return;
    let d = !1, f = !1;
    const p = new Ue.Terminal({
      convertEol: !0,
      fontSize: 13,
      fontFamily: ht("--mono", 'Menlo, Consolas, "DejaVu Sans Mono", monospace'),
      cursorBlink: !0,
      theme: De()
    }), u = new je.FitAddon();
    p.loadAddon(u), p.open(s.current);
    let e = null;
    try {
      e = new MutationObserver(() => {
        try {
          p.options.theme = De();
        } catch {
        }
      }), e.observe(document.documentElement, { attributes: !0, attributeFilter: ["data-theme", "data-color-theme", "style"] }), e.observe(document.head, { childList: !0 });
    } catch {
    }
    const r = () => {
      try {
        const w = { cols: p.cols, rows: p.rows };
        l.current && l.current.readyState === 1 ? l.current.send(JSON.stringify({ type: "resize", cols: w.cols, rows: w.rows })) : ue(ne("/resize"), { ref: P.ref, cols: w.cols, rows: w.rows }).catch(() => {
        });
      } catch {
      }
    };
    let t = "";
    const i = () => {
      const w = s.current;
      if (!w || !w.clientWidth || !w.clientHeight) return;
      try {
        u.fit();
      } catch {
        return;
      }
      const R = p.cols + "x" + p.rows;
      R !== t && (t = R, r());
    }, a = () => i();
    window.addEventListener("resize", a);
    let c = null;
    try {
      c = new ResizeObserver(() => i()), c.observe(s.current);
    } catch {
    }
    p.onData((w) => {
      l.current && l.current.readyState === 1 ? l.current.send(JSON.stringify({ type: "input", data: w })) : ue(ne("/input"), { ref: P.ref, data: w }).catch(() => {
      });
    });
    const v = () => {
      f || (f = !0, n.current && n.current(P.ref));
    }, m = () => {
      if (!d) {
        if (d = !0, l.current)
          try {
            l.current.close();
          } catch {
          }
        if (_.current)
          try {
            _.current.close();
          } catch {
          }
        if (e)
          try {
            e.disconnect();
          } catch {
          }
        if (c)
          try {
            c.disconnect();
          } catch {
          }
        window.removeEventListener("resize", a);
        try {
          p.dispose();
        } catch {
        }
      }
    }, h = () => {
      if (d || o.current === "sse") return;
      o.current = "sse";
      const w = new EventSource(ne("/sse?ref=" + encodeURIComponent(P.ref)));
      _.current = w, w.onmessage = (R) => {
        try {
          const A = JSON.parse(R.data);
          A.type === "chunk" && p.write(A.data), A.type === "exit" && (v(), m());
        } catch {
        }
      }, w.onerror = () => {
      };
    }, E = (window.location.protocol === "https:" ? "wss" : "ws") + "://" + window.location.host + ne("/ws?ref=" + encodeURIComponent(P.ref));
    let S = null;
    try {
      S = new WebSocket(E);
    } catch {
    }
    l.current = S, S ? (S.onopen = () => {
      i();
    }, S.onmessage = (w) => {
      try {
        const R = JSON.parse(w.data);
        R.type === "chunk" && p.write(R.data), R.type === "error" && (d || h()), R.type === "exit" && (v(), m());
      } catch {
      }
    }, S.onerror = () => {
      d || h();
    }, S.onclose = () => {
      d || h();
    }) : h(), i();
    const y = requestAnimationFrame(() => i());
    return () => {
      cancelAnimationFrame(y), m();
    };
  }, [P.ref, z]), /* @__PURE__ */ J("div", { className: "hv-pane", children: [
    /* @__PURE__ */ J("div", { className: "hv-pane-top", children: [
      /* @__PURE__ */ J("span", { className: "hv-pane-title", title: P.providerId + " · " + P.name, children: [
        /* @__PURE__ */ F(Se, { id: P.providerId, className: "hv-pane-ico" }),
        /* @__PURE__ */ F("span", { className: "hv-pane-name", children: P.name }),
        /* @__PURE__ */ F("span", { className: "hv-pane-prov", children: P.providerId })
      ] }),
      /* @__PURE__ */ F("span", { className: "hv-pane-cmd", title: be(P.cmd), children: be(P.cmd) }),
      /* @__PURE__ */ J("span", { className: "hv-pane-actions", children: [
        U && !z && /* @__PURE__ */ F(
          "button",
          {
            className: "hv-btn-sm hv-danger",
            onClick: Y,
            title: "Force-stop this " + P.providerId + " session on the host — cannot be undone",
            children: "Kill"
          }
        ),
        /* @__PURE__ */ F(
          "button",
          {
            className: "hv-x",
            onClick: K,
            "aria-label": "Detach from session",
            title: "Detach — close this view, session keeps running on the host",
            children: "✕"
          }
        )
      ] })
    ] }),
    z ? /* @__PURE__ */ J("div", { className: "hv-ended", children: [
      /* @__PURE__ */ F("div", { className: "hv-ended-title", children: "This session has ended" }),
      /* @__PURE__ */ J("div", { className: "hv-ended-note", children: [
        /* @__PURE__ */ F("span", { className: "hv-mono", children: be(P.cmd) }),
        " is no longer running on the host."
      ] }),
      /* @__PURE__ */ J("div", { className: "hv-ended-actions", children: [
        /* @__PURE__ */ F("button", { className: "hv-btn", onClick: M, children: "Restart session" }),
        /* @__PURE__ */ F("button", { className: "hv-btn hv-btn-ghost", onClick: K, children: "Close view" })
      ] })
    ] }) : /* @__PURE__ */ F("div", { className: "hv-term", ref: s })
  ] });
}
function ct({ providers: P, onCreated: z }) {
  const [U, q] = G.useState(""), [K, Y] = G.useState(""), [M, s] = G.useState(""), [o, l] = G.useState(!1), [_, n] = G.useState(""), [d, f] = G.useState(!1), [p, u] = G.useState(!1), [e, r] = G.useState(!1), t = G.useRef(!1), i = G.useRef(0), a = G.useRef(!0);
  G.useEffect(() => {
    t.current = p;
  }, [p]), G.useEffect(() => () => {
    a.current = !1;
  }, []);
  const c = (P || []).filter((S) => S.available), v = K.trim(), m = v || M;
  G.useEffect(() => {
    if (!U) {
      i.current += 1, s(""), l(!1), r(!1), ce("create-command"), t.current || n("");
      return;
    }
    const S = (K || "").trim(), y = ++i.current;
    let w = !1;
    const R = setTimeout(() => {
      r(!0);
      const A = ne("/providers/" + encodeURIComponent(U) + "/create-command") + (S ? "?name=" + encodeURIComponent(S) : "");
      Fe(A).then((O) => {
        w || y !== i.current || !a.current || (s(et(O)), l(!!(O && O.taken)), t.current || n((O && O.cmd ? O.cmd : []).join(" ")), ce("create-command"));
      }).catch((O) => {
        w || y !== i.current || !a.current || (oe("Could not load the default command: " + String(O), "error", "create-command"), s(""), t.current || n(""));
      }).finally(() => {
        !w && y === i.current && a.current && r(!1);
      });
    }, S ? 300 : 0);
    return () => {
      w = !0, clearTimeout(R);
    };
  }, [U, K]);
  const h = (S) => {
    q(S), Y(""), s(""), l(!1), u(!1), t.current = !1, n(""), ce("create-command"), ce("create-session");
  }, g = async (S) => {
    S.preventDefault(), f(!0), ce("create-session");
    try {
      const y = _ && _.trim(), w = {};
      U ? p && y ? (w.provider = U, w.cmd = _.trim().split(/\s+/).filter(Boolean)) : w.provider = U : y ? (w.provider = "custom", w.cmd = _.trim().split(/\s+/).filter(Boolean)) : (w.provider = "custom", w.cmd = ["bash"]), v && (w.name = v);
      const R = await ue(ne("/sessions"), w);
      z && z(R.session), oe("Attached: " + (R.session && R.session.name || "")), Y(""), n(""), u(!1), t.current = !1, l(!1);
    } catch (y) {
      oe(String(y && y.message ? y.message : y), "error", "create-session");
    } finally {
      f(!1);
    }
  }, E = U ? "Attach / New Session creates the " + U + " session" + (m ? ' "' + m + '"' : "") + " if it does not exist, then opens it. Editing the command switches to manual attach." : "Pick a provider to create a managed session, or type any command — e.g. tmux attach -t myagent, or bash.";
  return /* @__PURE__ */ J("form", { className: "hv-form", onSubmit: g, children: [
    /* @__PURE__ */ J("div", { className: "hv-form-row", children: [
      /* @__PURE__ */ J("select", { className: "hv-inp", value: U, onChange: (S) => h(S.target.value), children: [
        /* @__PURE__ */ F("option", { value: "", children: "Custom command" }),
        c.map((S) => /* @__PURE__ */ F("option", { value: S.id, children: S.label }, S.id))
      ] }),
      /* @__PURE__ */ F(
        "input",
        {
          className: "hv-inp",
          placeholder: M ? "auto: " + M : "session name (optional)",
          value: K,
          onChange: (S) => Y(S.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ J("div", { className: "hv-form-row", children: [
      /* @__PURE__ */ F(
        "input",
        {
          className: "hv-inp hv-wide",
          placeholder: "attach command e.g. tmux attach -t myagent — or bash",
          value: _,
          onChange: (S) => {
            const y = S.target.value;
            n(y), p || (u(!0), t.current = !0);
          }
        }
      ),
      e && /* @__PURE__ */ F("span", { className: "hv-empty sm", children: "loading default command…" }),
      /* @__PURE__ */ F("button", { type: "button", className: "hv-hint-icon", title: E, "aria-label": E, tabIndex: 0, children: /* @__PURE__ */ J("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
        /* @__PURE__ */ F("circle", { cx: "8", cy: "8", r: "6.5" }),
        /* @__PURE__ */ F("line", { x1: "8", y1: "7", x2: "8", y2: "11" }),
        /* @__PURE__ */ F("circle", { cx: "8", cy: "5", r: "0.6", fill: "currentColor", stroke: "none" })
      ] }) })
    ] }),
    o && /* @__PURE__ */ J("div", { className: "hv-warn", children: [
      "A ",
      U,
      ' session called "',
      v,
      '" already exists.',
      " ",
      /* @__PURE__ */ J("button", { type: "button", className: "hv-link", onClick: () => Y(M), children: [
        'Use "',
        M,
        '"'
      ] })
    ] }),
    /* @__PURE__ */ F("button", { className: "hv-btn", type: "submit", disabled: d || e, children: d ? "Attaching…" : e ? "Loading…" : "Attach / New Session" })
  ] });
}
function dt() {
  const [P, z] = G.useState([]), [U, q] = G.useState(rt), [K, Y] = G.useState(nt), [M, s] = G.useState({}), [o, l] = G.useState(""), [_, n] = G.useState([]), [d, f] = G.useState(function() {
    try {
      return JSON.parse(localStorage.getItem("hv-collapsed-sections") || "{}");
    } catch {
      return {};
    }
  }), p = function(S) {
    f(function(y) {
      const w = Object.assign({}, y, { [S]: !y[S] });
      try {
        localStorage.setItem("hv-collapsed-sections", JSON.stringify(w));
      } catch {
      }
      return w;
    });
  }, u = G.useRef(M);
  G.useEffect(() => {
    u.current = M;
  }, [M]);
  const e = G.useCallback((S, y) => {
    s((w) => {
      if (y && w[S] || !y && !w[S]) return w;
      const R = { ...w };
      return y ? R[S] = !0 : delete R[S], R;
    });
  }, []), r = G.useCallback(async () => {
    try {
      const S = await Fe(ne("/providers"));
      z(S.providers || []), ce("providers");
      const y = new Set([...S.sessions || [], ...S.known || []].map((w) => w.ref));
      q((w) => {
        const R = w.filter((A) => y.has(A.ref) || u.current[A.ref]);
        return R.length === w.length ? w : R;
      });
    } catch (S) {
      oe("Could not load sessions — " + String(S), "error", "providers");
    }
  }, []);
  G.useEffect(() => {
    r();
    const S = setInterval(() => {
      document.hidden || r();
    }, 8e3), y = () => {
      document.hidden || r();
    };
    return document.addEventListener("visibilitychange", y), () => {
      clearInterval(S), document.removeEventListener("visibilitychange", y);
    };
  }, [r]), G.useEffect(() => {
    st(U);
  }, [U]), G.useEffect(() => {
    ot(K);
  }, [K]), G.useEffect(() => {
    K && U.some((S) => S.ref === K) || Y(U.length ? U[U.length - 1].ref : "");
  }, [U, K]), G.useEffect(() => {
    const S = (P || []).filter((w) => !o || w.id === o), y = [];
    for (const w of S) for (const R of w.sessions || []) y.push({ providerId: w.id, ...R });
    n(y);
  }, [P, o]);
  const t = G.useCallback((S) => {
    !S || !S.ref || (q((y) => y.some((w) => w.ref === S.ref) ? y : [...y, S]), e(S.ref, !1), Y(S.ref));
  }, [e]), i = G.useCallback((S) => {
    q((y) => y.filter((w) => w.ref !== S)), e(S, !1);
  }, [e]), a = async (S) => {
    const y = S.providerId || S.provider;
    try {
      const w = await ue(ne("/sessions"), { provider: y, ref: S.ref });
      t(w.session);
    } catch (w) {
      oe("Could not open " + y + ":" + S.name + " — " + String(w), "error"), r();
    }
  }, c = async (S) => {
    const y = !!(S.providerId && S.providerId !== "custom");
    try {
      const w = await ue(ne("/sessions"), y ? { provider: S.providerId, name: S.name } : { provider: "custom", cmd: S.cmd, name: S.name });
      i(S.ref), t(w.session);
    } catch (w) {
      if (y)
        try {
          const R = await ue(ne("/sessions"), { provider: S.providerId, ref: S.key || S.name });
          i(S.ref), t(R.session);
          return;
        } catch {
        }
      oe("Could not restart " + S.name + " — " + String(w), "error");
    }
  }, v = async (S) => {
    if (!window.confirm(
      "Kill the " + S.providerId + ' session "' + S.name + `"?

This terminates it on the host and cannot be undone.`
    )) return;
    const w = S.providerId + ":" + (S.ref || S.name);
    try {
      const R = await Re(ne("/sessions/" + encodeURIComponent(w)) + "?kill=1");
      oe(R.killed ? "Killed " + S.providerId + ":" + S.name : "Could not kill " + S.providerId + ":" + S.name + ". " + (R.reason || ""), R.killed ? "info" : "error");
    } catch (R) {
      oe("Kill failed — " + String(R), "error");
    }
    r();
  }, m = async (S) => {
    if (window.confirm(
      "Kill the " + S.providerId + ' session "' + S.name + `"?

This terminates it on the host and cannot be undone. To leave it running, use ✕ instead.`
    )) {
      try {
        const w = await Re(ne("/sessions/" + encodeURIComponent(S.ref)) + "?kill=1");
        w.killed ? oe("Killed " + S.providerId + ":" + S.name) : oe("Closed the view. " + (w.reason || "The host session could not be killed."), "error");
      } catch (w) {
        oe("Kill failed — " + String(w), "error");
      }
      i(S.ref), r();
    }
  }, h = (S) => {
    const y = (P || []).find((w) => w.id === S);
    return !!(y && y.killable);
  }, g = new Set(U.map((S) => S.ref)), E = U.find((S) => S.ref === K) || null;
  return /* @__PURE__ */ J("div", { className: "hv-root", children: [
    /* @__PURE__ */ F(at, {}),
    /* @__PURE__ */ J("div", { className: "hv-sidebar", children: [
      /* @__PURE__ */ F("div", { className: "hv-brand", children: "Herdr Views" }),
      /* @__PURE__ */ J("div", { className: "hv-section-title" + (d.providers ? " hv-collapsed" : ""), onClick: function() {
        p("providers");
      }, children: [
        /* @__PURE__ */ F("svg", { className: "hv-chevron", viewBox: "0 0 24 24", width: "14", height: "14", children: /* @__PURE__ */ F("path", { d: "M9 6l6 6-6 6", stroke: "currentColor", strokeWidth: "1.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        "Providers"
      ] }),
      d.providers ? null : /* @__PURE__ */ J("div", { className: "hv-prov-list", children: [
        /* @__PURE__ */ J("div", { className: "hv-prov" + (o === "" ? " hv-active" : ""), onClick: () => l(""), children: [
          /* @__PURE__ */ J("svg", { className: "hv-prov-ico", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ F("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
            /* @__PURE__ */ F("line", { x1: "9", y1: "8", x2: "9", y2: "16" }),
            /* @__PURE__ */ F("line", { x1: "15", y1: "8", x2: "15", y2: "16" }),
            /* @__PURE__ */ F("line", { x1: "12", y1: "10.5", x2: "12", y2: "13.5" })
          ] }),
          /* @__PURE__ */ F("span", { children: "All" })
        ] }),
        P.map((S) => /* @__PURE__ */ J(
          "div",
          {
            className: "hv-prov" + (o === S.id ? " hv-active" : "") + (S.available ? "" : " hv-prov-na"),
            onClick: () => l(S.id),
            title: S.available ? "Show only " + S.label + " sessions" : S.label + " is not installed",
            children: [
              /* @__PURE__ */ F(Se, { id: S.id, className: "hv-prov-ico" }),
              /* @__PURE__ */ F("span", { children: S.id }),
              S.available ? "" : /* @__PURE__ */ F("span", { className: "hv-na", children: "n/a" })
            ]
          },
          S.id
        ))
      ] }),
      /* @__PURE__ */ J("div", { className: "hv-section-title" + (d.open ? " hv-collapsed" : ""), onClick: function() {
        p("open");
      }, children: [
        /* @__PURE__ */ F("svg", { className: "hv-chevron", viewBox: "0 0 24 24", width: "14", height: "14", children: /* @__PURE__ */ F("path", { d: "M9 6l6 6-6 6", stroke: "currentColor", strokeWidth: "1.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        "Open Sessions",
        U.length > 0 && /* @__PURE__ */ F("span", { className: "hv-count", children: U.length })
      ] }),
      d.open ? null : /* @__PURE__ */ F("div", { className: "hv-pset", children: U.length === 0 ? /* @__PURE__ */ F("div", { className: "hv-empty sm", children: "Nothing open — pick a session below." }) : U.map((S) => /* @__PURE__ */ J(
        "div",
        {
          className: "hv-sess" + (S.ref === K ? " hv-active" : "") + (M[S.ref] ? " hv-sess-ended" : ""),
          onClick: () => Y(S.ref),
          title: be(S.cmd),
          children: [
            /* @__PURE__ */ F(Se, { id: S.providerId, className: "hv-sess-ico" }),
            /* @__PURE__ */ F("span", { className: "hv-sess-name", children: S.name }),
            /* @__PURE__ */ F("span", { className: "hv-sess-prov", children: S.providerId }),
            /* @__PURE__ */ F(
              "button",
              {
                className: "hv-x",
                "aria-label": "Detach from session",
                title: "Detach — close this view, session keeps running on the host",
                onClick: (y) => {
                  y.stopPropagation(), i(S.ref);
                },
                children: "✕"
              }
            )
          ]
        },
        S.ref
      )) }),
      /* @__PURE__ */ J("div", { className: "hv-section-title" + (d.discovered ? " hv-collapsed" : ""), onClick: function() {
        p("discovered");
      }, children: [
        /* @__PURE__ */ F("svg", { className: "hv-chevron", viewBox: "0 0 24 24", width: "14", height: "14", children: /* @__PURE__ */ F("path", { d: "M9 6l6 6-6 6", stroke: "currentColor", strokeWidth: "1.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        "Discovered Sessions",
        o && /* @__PURE__ */ F("span", { className: "hv-count", children: _.length })
      ] }),
      d.discovered ? null : /* @__PURE__ */ F("div", { className: "hv-disc", children: _.length === 0 ? /* @__PURE__ */ F("div", { className: "hv-empty sm", children: "No sessions discovered" }) : _.map((S) => {
        const y = (S.providerId || S.provider) + ":" + (S.ref || S.name), w = g.has(y);
        return /* @__PURE__ */ J(
          "div",
          {
            className: "hv-disc-item" + (w ? " hv-disc-open" : ""),
            onClick: () => a(S),
            title: w ? "Already open — click to focus" : "Open " + S.name,
            children: [
              /* @__PURE__ */ F("span", { className: "hv-disc-dot" }),
              /* @__PURE__ */ F("span", { className: "hv-disc-name", children: S.name }),
              /* @__PURE__ */ J("span", { className: "hv-disc-prov", children: [
                /* @__PURE__ */ F(Se, { id: S.providerId, className: "hv-disc-ico" }),
                S.providerId
              ] }),
              h(S.providerId) && /* @__PURE__ */ F(
                "button",
                {
                  className: "hv-kill",
                  onClick: (R) => {
                    R.stopPropagation(), v(S);
                  },
                  title: "Force-stop this " + S.providerId + " session on the host — cannot be undone",
                  children: "Kill"
                }
              )
            ]
          },
          y
        );
      }) })
    ] }),
    /* @__PURE__ */ J("div", { className: "hv-main", children: [
      /* @__PURE__ */ F(ct, { providers: P, onCreated: t }),
      /* @__PURE__ */ F("div", { className: "hv-panes", children: E ? /* @__PURE__ */ F(
        lt,
        {
          session: E,
          ended: !!M[E.ref],
          killable: h(E.providerId),
          onExit: (S) => {
            e(S, !0), r();
          },
          onClose: () => i(E.ref),
          onKill: () => m(E),
          onRestart: () => c(E)
        },
        E.ref
      ) : /* @__PURE__ */ F("div", { className: "hv-welcome", children: "Nothing open yet. Create a session above, or pick one from Discovered Sessions on the left. Sessions are real tmux/screen/zellij processes — closing a view leaves them running on the host." }) })
    ] })
  ] });
}
function vt(P) {
  Ie();
  const z = We(P);
  return z.render(/* @__PURE__ */ F(dt, {})), () => z.unmount();
}
Ie();
export {
  dt as default,
  vt as mount
};
