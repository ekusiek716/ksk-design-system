"use client";
import * as e from "react";
//#region \0rolldown/runtime.js
var t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.prototype.hasOwnProperty, a = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, o = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, s = (e, a, o, s) => {
	if (a && typeof a == "object" || typeof a == "function") for (var c = r(a), l = 0, u = c.length, d; l < u; l++) d = c[l], !i.call(e, d) && d !== o && t(e, d, {
		get: ((e) => a[e]).bind(null, d),
		enumerable: !(s = n(a, d)) || s.enumerable
	});
	return e;
}, c = (e) => i.call(e, "module.exports") ? e["module.exports"] : s(t({}, "__esModule", { value: !0 }), e), l = "ksk:auto-prompt-suppression", u = e.createContext(null), d = 0, f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
function h() {
	d += 1, p.forEach((e) => e()), m.forEach((e) => e());
}
function g(e) {
	return p.add(e), () => p.delete(e);
}
function _() {
	return f.size > 0;
}
function v(e) {
	let t = globalThis;
	!t.dispatchEvent || !t.CustomEvent || t.dispatchEvent(new t.CustomEvent(l, { detail: e }));
}
function y() {
	return _();
}
function b(e = "unspecified") {
	let t = Symbol(e), n = !1;
	return f.add(t), h(), v({
		suppressed: !0,
		reason: e
	}), () => {
		n || (n = !0, f.delete(t), h(), v({
			suppressed: f.size > 0,
			reason: e
		}));
	};
}
function x(e) {
	return [...e].sort((e, t) => t.priority - e.priority || e.sequence - t.sequence);
}
function S({ children: t, gapMs: n = 400 }) {
	let [r, i] = e.useState({
		entries: [],
		activeId: null
	}), a = e.useRef(0), o = e.useRef(null), s = e.useSyncExternalStore(g, _, () => !1), c = e.useCallback(() => {
		o.current !== null && (clearTimeout(o.current), o.current = null);
	}, []), l = e.useCallback(() => {
		_() || i((e) => {
			if (e.activeId !== null) return e;
			let t = x(e.entries)[0];
			return t ? {
				...e,
				activeId: t.id
			} : e;
		});
	}, []), d = e.useCallback((e) => {
		c(), o.current = setTimeout(() => {
			o.current = null, l();
		}, Math.max(0, e));
	}, [c, l]);
	e.useEffect(() => c, [c]), e.useEffect(() => {
		let e = () => {
			_() || d(0);
		};
		return m.add(e), () => {
			m.delete(e);
		};
	}, [d]);
	let f = e.useCallback((e, t) => {
		i((n) => {
			let r = n.entries.find((t) => t.id === e);
			return r ? r.priority === t ? n : {
				...n,
				entries: n.entries.map((n) => n.id === e ? {
					...n,
					priority: t
				} : n)
			} : (a.current += 1, {
				...n,
				entries: [...n.entries, {
					id: e,
					priority: t,
					sequence: a.current
				}]
			});
		}), _() || d(0);
	}, [d]), p = e.useCallback((e) => {
		i((t) => ({
			activeId: t.activeId === e ? null : t.activeId,
			entries: t.entries.filter((t) => t.id !== e)
		})), d(n);
	}, [n, d]), h = e.useCallback((e) => r.activeId === e && !s ? "active" : r.entries.some((t) => t.id === e) ? "queued" : "idle", [r, s]), v = e.useMemo(() => x(r.entries).filter((e) => e.id !== r.activeId || s).map((e) => e.id), [r, s]), y = e.useMemo(() => ({
		activeId: s ? null : r.activeId,
		queuedIds: v,
		suppressed: s,
		suppress: b,
		request: f,
		release: p,
		cancel: p,
		statusOf: h
	}), [
		v,
		p,
		f,
		r.activeId,
		h,
		s
	]);
	return e.createElement(u.Provider, { value: y }, t);
}
function C(t, { priority: n = 0 } = {}) {
	let r = e.useContext(u), [i, a] = e.useState(!1), o = r?.request, s = r?.release, c = r?.cancel, l = e.useCallback(() => {
		o ? o(t, n) : a(!0);
	}, [
		o,
		t,
		n
	]), d = e.useCallback(() => {
		s ? s(t) : a(!1);
	}, [s, t]), f = e.useCallback(() => {
		c ? c(t) : a(!1);
	}, [c, t]);
	e.useEffect(() => () => c?.(t), [c, t]);
	let p = r ? r.statusOf(t) : i ? "active" : "idle";
	return {
		status: p,
		active: p === "active",
		request: l,
		release: d,
		cancel: f
	};
}
function w() {
	return e.useContext(u) ?? {
		activeId: null,
		queuedIds: [],
		suppressed: y(),
		suppress: b
	};
}
function T({ id: t, priority: n = 0, when: r, children: i }) {
	let { active: a, status: o, request: s, release: c, cancel: l } = C(t, { priority: n });
	return e.useEffect(() => {
		r ? s() : l();
	}, [
		r,
		s,
		l
	]), i({
		open: a,
		status: o,
		close: c
	});
}
//#endregion
export { b as a, a as c, y as i, o as l, T as n, w as o, S as r, C as s, l as t, c as u };
