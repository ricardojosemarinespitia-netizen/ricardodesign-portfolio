/* Polyfills ligeros (solo se cargan si faltan: ver el cargador al final de index.html).
   IntersectionObserver (rootMargin en px y %, primer umbral, aviso inicial como el nativo), ResizeObserver (sondeo cada 300 ms)
   y requestIdleCallback. ES5: debe correr en Safari 12 / Chrome 64 / WebViews viejos de Android. */
(function (w) {
  if (!w.IntersectionObserver) {
    function IO(cb, op) {
      op = op || {};
      this._cb = cb; this._els = [];
      this.thresholds = [].concat(op.threshold || 0);
      this.rootMargin = op.rootMargin || '0px';
      var m = this.rootMargin.split(/\s+/).map(function (v) { return { n: parseFloat(v) || 0, p: /%$/.test(v) }; });
      while (m.length < 4) m.push(m[m.length - 1] || { n: 0, p: false });
      this._m = m; this._t = null;
      var s = this;
      this._f = function () { if (!s._t) s._t = setTimeout(function () { s._t = null; s._check(); }, 100); };
    }
    IO.prototype._on = function () { if (this._on_) return; this._on_ = 1; addEventListener('scroll', this._f, true); addEventListener('resize', this._f); this._iv = setInterval(this._f, 500); };
    IO.prototype._off = function () { if (!this._on_) return; this._on_ = 0; removeEventListener('scroll', this._f, true); removeEventListener('resize', this._f); clearInterval(this._iv); };
    IO.prototype._check = function () {
      var W = innerWidth, H = innerHeight, m = this._m,
          top = -(m[0].p ? m[0].n / 100 * H : m[0].n), right = W + (m[1].p ? m[1].n / 100 * W : m[1].n),
          bottom = H + (m[2].p ? m[2].n / 100 * H : m[2].n), left = -(m[3].p ? m[3].n / 100 * W : m[3].n),
          out = [], th = this.thresholds[0] || 0;
      for (var i = 0; i < this._els.length; i++) {
        var e = this._els[i], r = e.el.getBoundingClientRect(),
            iw = Math.max(0, Math.min(r.right, right) - Math.max(r.left, left)),
            ih = Math.max(0, Math.min(r.bottom, bottom) - Math.max(r.top, top)),
            a = r.width * r.height, ratio = a ? iw * ih / a : 0,
            vis = th === 0 ? (iw > 0 && ih > 0) || (a === 0 && r.top >= top && r.top <= bottom && r.left >= left && r.left <= right) : ratio >= th && ratio > 0;
        if (vis !== e.vis) {
          e.vis = vis;
          out.push({ target: e.el, isIntersecting: vis, intersectionRatio: vis ? ratio : 0, boundingClientRect: r, intersectionRect: r, time: Date.now(),
                     rootBounds: { top: top, left: left, right: right, bottom: bottom, width: right - left, height: bottom - top } });
        }
      }
      if (out.length) { try { this._cb(out, this); } catch (x) { setTimeout(function () { throw x; }); } }
    };
    IO.prototype.observe = function (el) {
      for (var i = 0; i < this._els.length; i++) if (this._els[i].el === el) return;
      this._els.push({ el: el, vis: undefined }); this._on();
      var s = this; setTimeout(function () { s._check(); }, 0);
    };
    IO.prototype.unobserve = function (el) { this._els = this._els.filter(function (e) { return e.el !== el; }); if (!this._els.length) this._off(); };
    IO.prototype.disconnect = function () { this._els = []; this._off(); };
    IO.prototype.takeRecords = function () { return []; };
    w.IntersectionObserver = IO;
    w.IntersectionObserverEntry = function () {};
  }
  if (!w.ResizeObserver) {
    function RO(cb) { this._cb = cb; this._els = []; var s = this; this._f = function () { s._check(); }; }
    RO.prototype._check = function () {
      var out = [];
      for (var i = 0; i < this._els.length; i++) {
        var e = this._els[i], r = e.el.getBoundingClientRect();
        if (r.width !== e.w || r.height !== e.h) {
          e.w = r.width; e.h = r.height;
          out.push({ target: e.el, contentRect: r, borderBoxSize: [{ inlineSize: r.width, blockSize: r.height }], contentBoxSize: [{ inlineSize: r.width, blockSize: r.height }] });
        }
      }
      if (out.length) { try { this._cb(out, this); } catch (x) { setTimeout(function () { throw x; }); } }
    };
    RO.prototype.observe = function (el) {
      this._els.push({ el: el, w: -1, h: -1 });
      if (!this._iv) { this._iv = setInterval(this._f, 300); addEventListener('resize', this._f); }
      var s = this; setTimeout(function () { s._check(); }, 0);
    };
    RO.prototype.unobserve = function (el) { this._els = this._els.filter(function (e) { return e.el !== el; }); };
    RO.prototype.disconnect = function () { this._els = []; clearInterval(this._iv); this._iv = 0; removeEventListener('resize', this._f); };
    w.ResizeObserver = RO;
  }
  if (!w.requestIdleCallback) {
    w.requestIdleCallback = function (f) { var t = Date.now(); return setTimeout(function () { f({ didTimeout: false, timeRemaining: function () { return Math.max(0, 50 - (Date.now() - t)); } }); }, 1); };
    w.cancelIdleCallback = function (i) { clearTimeout(i); };
  }
})(window);
