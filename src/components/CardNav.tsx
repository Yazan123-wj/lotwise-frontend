import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import "./CardNav.css"

const THEMES = {
  dark: {
    "--cn-panel": "rgba(38, 35, 46, 0.72)",
    "--cn-solid": "#26232e",
    "--cn-edge": "rgba(255, 255, 255, 0.08)",
    "--cn-highlight": "rgba(255, 255, 255, 0.07)",
    "--cn-shadow": "0 24px 48px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)",
    "--cn-text": "#f4f4f5",
    "--cn-muted": "rgba(244, 244, 245, 0.56)",
    "--cn-hover": "rgba(255, 255, 255, 0.06)",
    "--cn-ring": "rgba(244, 244, 245, 0.55)",
    "--cn-tile": "linear-gradient(180deg, #34303d 0%, #27242f 100%)",
    "--cn-tile-rim":
      "inset 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 10px -4px rgba(0, 0, 0, 0.6)",
    "--cn-cta": "linear-gradient(180deg, #ffffff 0%, #ebebf0 100%)",
    "--cn-cta-ink": "#121016",
    "--cn-cta-shadow": "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 16px -6px rgba(0, 0, 0, 0.6)",
    "--cn-cta-hover": "brightness(0.94)",
  },
  light: {
    "--cn-panel": "rgba(244, 244, 246, 0.84)",
    "--cn-solid": "#f4f4f6",
    "--cn-edge": "rgba(24, 24, 27, 0.07)",
    "--cn-highlight": "rgba(255, 255, 255, 0.95)",
    "--cn-shadow": "0 24px 48px -24px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)",
    "--cn-text": "#18181b",
    "--cn-muted": "rgba(24, 24, 27, 0.56)",
    "--cn-hover": "rgba(24, 24, 27, 0.05)",
    "--cn-ring": "rgba(24, 24, 27, 0.45)",
    "--cn-tile": "linear-gradient(180deg, #ffffff 0%, #f8f8fa 100%)",
    "--cn-tile-rim":
      "inset 0 0 0 1px rgba(24, 24, 27, 0.07), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(24, 24, 27, 0.22)",
    "--cn-cta": "linear-gradient(180deg, #2c2c31 0%, #18181b 100%)",
    "--cn-cta-ink": "#ffffff",
    "--cn-cta-shadow": "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 14px -6px rgba(24, 24, 27, 0.45)",
    "--cn-cta-hover": "brightness(1.25)",
  },
} as const

type ThemeName = keyof typeof THEMES
type CardEffect = "rise" | "unfold" | "fade"

export type CardNavLink = {
  label: string
  href?: string
  ariaLabel?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

export type CardNavItem = {
  label: string
  description?: string
  bgColor?: string
  textColor?: string
  links: CardNavLink[]
}

export type CardNavCta = {
  label: string
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

type CardLinkProps = {
  href?: string
  className?: string
  children?: ReactNode
  tabIndex?: number
  "aria-label"?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

type CardNavProps = {
  items?: CardNavItem[]
  logo?: string | ReactNode
  logoAlt?: string
  logoHref?: string
  cta?: CardNavCta
  theme?: ThemeName
  surface?: "glass" | "solid"
  openOn?: "click" | "hover"
  cardEffect?: CardEffect
  stagger?: number
  bounce?: number
  speed?: number
  cardHeight?: number
  maxWidth?: number
  accentColor?: string
  menuLabel?: boolean
  intro?: boolean
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  linkComponent?: ComponentType<CardLinkProps> | "a"
  onLinkClick?: (link: CardNavLink, item: CardNavItem, event: MouseEvent<HTMLElement>) => void
  ariaLabel?: string
  className?: string
  style?: CSSProperties
  actions?: ReactNode
}

const DEFAULT_ITEMS: CardNavItem[] = [
  {
    label: "About",
    description: "The people and the story behind the studio.",
    links: [
      { label: "Company", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    label: "Projects",
    description: "Selected work from the last few years.",
    links: [
      { label: "Featured", href: "#" },
      { label: "Case studies", href: "#" },
    ],
  },
  {
    label: "Contact",
    description: "Say hello, we read everything.",
    links: [
      { label: "Email", href: "#" },
      { label: "X", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
]

const NARROW = 560
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)"

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const easeOut = (t: number) => 1 - (1 - t) ** 3

const contrastInk = (color?: string) => {
  const hex = String(color || "")
    .trim()
    .replace("#", "")
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex
  const channel = (index: number) => {
    const value = parseInt(full.slice(index, index + 2), 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
  return luminance > 0.36 ? "#121016" : "#ffffff"
}

export default function CardNav({
  logo,
  logoAlt = "Logo",
  logoHref = "#",
  items = DEFAULT_ITEMS,
  cta,
  theme = "dark",
  surface = "glass",
  openOn = "click",
  cardEffect = "rise",
  stagger = 0.12,
  bounce = 0.2,
  speed = 1,
  cardHeight = 176,
  maxWidth = 800,
  accentColor,
  menuLabel = true,
  intro = true,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  linkComponent: LinkComponent = "a",
  onLinkClick,
  ariaLabel = "Main",
  className = "",
  style,
  actions,
}: CardNavProps) {
  const contentId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLButtonElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const engineRef = useRef<{ wake: () => void; refresh: () => void } | null>(null)
  const leaveRef = useRef(0)
  const barRef = useRef<HTMLDivElement>(null)
  const introRef = useRef(intro)
  const [openState, setOpenState] = useState(defaultOpen)
  const [narrow, setNarrow] = useState(false)
  const [shown, setShown] = useState(defaultOpen)

  const controlled = openProp !== undefined
  const hasCta = Boolean(cta)
  const open = controlled ? openProp : openState

  const settings = {
    open,
    cardEffect,
    stagger: clamp(stagger, 0, 0.3),
    bounce: clamp(bounce, 0, 1),
    speed: clamp(speed, 0.2, 3),
  }
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  const palette = THEMES[theme] ?? THEMES.dark
  const vars: Record<string, string> = {
    ...palette,
    "--cn-max": `${maxWidth}px`,
    "--cn-bar": "60px",
    "--cn-inset": "8px",
    "--cn-gap": "8px",
    "--cn-radius": "18px",
    "--cn-logo": "36px",
    "--cn-card": `${cardHeight}px`,
  }
  if (surface === "glass") vars["--cn-blur"] = "blur(20px) saturate(1.6)"
  if (surface === "solid") {
    vars["--cn-panel"] = palette["--cn-solid"]
    vars["--cn-blur"] = "none"
  }
  if (accentColor) {
    vars["--cn-cta"] = accentColor
    vars["--cn-cta-ink"] = contrastInk(accentColor) || "#ffffff"
    vars["--cn-cta-shadow"] = "inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 16px -6px rgba(0, 0, 0, 0.45)"
    vars["--cn-cta-hover"] = "brightness(1.08)"
  }

  const setOpen = (next: boolean) => {
    if (next === open) return
    if (!controlled) setOpenState(next)
    onOpenChange?.(next)
  }
  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen

  useEffect(() => {
    const panel = panelRef.current
    const content = contentRef.current
    if (!panel || !content) return undefined
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    const state = { p: settingsRef.current.open ? 1 : 0, v: 0, height: content.offsetHeight, bar: 60 }
    let raf = 0
    let last = 0

    const render = () => {
      const s = settingsRef.current
      state.bar = parseFloat(getComputedStyle(panel).getPropertyValue("--cn-bar")) || 60
      panel.style.height = `${state.bar + Math.max(0, state.p) * state.height}px`
      const cards = cardRefs.current.filter((card): card is HTMLDivElement => Boolean(card))
      const count = cards.length
      const lag = count > 1 ? Math.min(s.stagger, 0.7 / (count - 1)) : 0
      const span = 1 - lag * (count - 1)
      cards.forEach((card, index) => {
        const local = clamp((state.p - index * lag) / Math.max(span, 0.05), 0, 1)
        const e = easeOut(local)
        if (s.cardEffect === "unfold") {
          card.style.transform = `translateY(${(1 - e) * -10}px) rotateX(${(1 - e) * -72}deg)`
          card.style.opacity = `${clamp(local * 1.8, 0, 1)}`
          card.style.filter = ""
        } else if (s.cardEffect === "fade") {
          card.style.transform = `translateY(${(1 - e) * 6}px)`
          card.style.opacity = `${e}`
          card.style.filter = e < 0.999 ? `blur(${(1 - e) * 6}px)` : ""
        } else {
          card.style.transform = `translateY(${(1 - e) * 26}px) scale(${0.97 + 0.03 * e})`
          card.style.opacity = `${e}`
          card.style.filter = ""
        }
      })
    }

    const tick = (now: number) => {
      raf = 0
      const s = settingsRef.current
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      const target = s.open ? 1 : 0
      if (reduce) {
        state.p = target
        state.v = 0
      } else {
        const k = 160 * s.speed * s.speed
        const zeta = s.open ? 1 - 0.68 * s.bounce : 1
        const steps = Math.ceil(dt / (1 / 240))
        const h = dt / steps
        for (let i = 0; i < steps; i++) {
          state.v += (-k * (state.p - target) - 2 * zeta * Math.sqrt(k) * state.v) * h
          state.p += state.v * h
        }
      }
      const done = Math.abs(state.p - target) < 0.0005 && Math.abs(state.v) < 0.002
      if (done) {
        state.p = target
        state.v = 0
      }
      render()
      if (done && target === 0) setShown(false)
      if (!done) raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!raf) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }

    engineRef.current = {
      wake,
      refresh: () => {
        state.height = content.offsetHeight
        render()
      },
    }

    render()
    const observer = new ResizeObserver(() => {
      state.height = content.offsetHeight
      render()
    })
    observer.observe(content)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      engineRef.current = null
    }
  }, [items.length, hasCta, narrow])

  useLayoutEffect(() => {
    if (open) setShown(true)
    engineRef.current?.refresh()
    engineRef.current?.wake()
  }, [open])

  useEffect(() => {
    engineRef.current?.refresh()
  })

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const measure = () => setNarrow(root.offsetWidth < NARROW)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event: Event) => {
      const target = event.target
      if (target instanceof Node && rootRef.current?.contains(target)) return
      setOpenRef.current(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpenRef.current(false)
      menuRef.current?.focus()
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(leaveRef.current), [])

  useLayoutEffect(() => {
    const panel = panelRef.current
    const bar = barRef.current
    if (!panel || !bar || !introRef.current) return
    introRef.current = false
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    const width = panel.offsetWidth
    const height = panel.offsetHeight
    const radius = parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 18
    panel.animate(
      [
        { clipPath: `inset(0px ${Math.max(0, (width - height) / 2)}px round ${height / 2}px)`, opacity: 0 },
        { clipPath: `inset(0px 0px round ${radius}px)`, opacity: 1 },
      ],
      { duration: 820, easing: EASE_OUT, fill: "backwards" },
    )
    Array.from(bar.children).forEach((child, index) => {
      child.animate(
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 560, delay: 220 + index * 70, easing: EASE_OUT, fill: "backwards" },
      )
    })
  }, [])

  const hover = openOn === "hover"

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!hover || event.pointerType === "touch") return
    window.clearTimeout(leaveRef.current)
    setOpen(true)
  }

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (!hover || event.pointerType === "touch") return
    window.clearTimeout(leaveRef.current)
    leaveRef.current = window.setTimeout(() => setOpenRef.current(false), 160)
  }

  const anchor = (target: CardNavLink | CardNavCta, props: CardLinkProps, children: ReactNode) => {
    if (!target.href) {
      return (
        <button type="button" {...props}>
          {children}
        </button>
      )
    }
    return (
      <LinkComponent href={target.href} {...props}>
        {children}
      </LinkComponent>
    )
  }

  const ctaButton = (target: CardNavCta, wide: boolean) =>
    anchor(
      target,
      {
        className: wide ? "card-nav__cta card-nav__cta--wide" : "card-nav__cta",
        tabIndex: wide && !open ? -1 : undefined,
        onClick: (event) => {
          target.onClick?.(event)
          if (wide) setOpen(false)
        },
      },
      target.label,
    )

  return (
    <div
      ref={rootRef}
      className={["card-nav", className].filter(Boolean).join(" ")}
      data-open={open ? "" : undefined}
      data-shown={shown || open ? "" : undefined}
      data-narrow={narrow ? "" : undefined}
      style={{ ...vars, ...style } as CSSProperties}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <nav ref={panelRef} className="card-nav__panel" aria-label={ariaLabel}>
        <div ref={barRef} className="card-nav__bar">
          <button
            ref={menuRef}
            type="button"
            className="card-nav__menu"
            data-icon-only={menuLabel ? undefined : ""}
            aria-expanded={open}
            aria-controls={contentId}
            aria-label={menuLabel ? undefined : open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <span className="card-nav__burger" aria-hidden="true">
              <span className="card-nav__line card-nav__line--top" />
              <span className="card-nav__line card-nav__line--bottom" />
            </span>
            {menuLabel && (
              <span className="card-nav__menu-label">
                <span className="card-nav__word card-nav__word--open" aria-hidden={open}>
                  Menu
                </span>
                <span className="card-nav__word card-nav__word--close" aria-hidden={!open}>
                  Close
                </span>
              </span>
            )}
          </button>

          {logo && (
            <LinkComponent href={logoHref} className="card-nav__logo" aria-label={logoAlt}>
              {typeof logo === "string" ? <img src={logo} alt="" draggable={false} /> : logo}
            </LinkComponent>
          )}

          {cta && !narrow && ctaButton(cta, false)}
          {actions ? <div className="card-nav__actions">{actions}</div> : null}
        </div>

        <div ref={contentRef} id={contentId} className="card-nav__content" aria-hidden={!open}>
          <div className="card-nav__cards">
            {items.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                ref={(element) => {
                  cardRefs.current[index] = element
                }}
                className="card-nav__card"
                data-tinted={item.bgColor ? "" : undefined}
                style={item.bgColor ? { background: item.bgColor, color: item.textColor } : undefined}
              >
                <div className="card-nav__card-head">
                  <span className="card-nav__label">{item.label}</span>
                  {item.description && <p className="card-nav__description">{item.description}</p>}
                </div>
                <ul className="card-nav__links">
                  {(item.links ?? []).map((link, linkIndex) => (
                    <li key={`${link.label}-${linkIndex}`}>
                      {anchor(
                        link,
                        {
                          className: "card-nav__link",
                          "aria-label": link.ariaLabel,
                          tabIndex: open ? undefined : -1,
                          onClick: (event) => {
                            onLinkClick?.(link, item, event)
                            setOpen(false)
                          },
                        },
                        <>
                          <span className="card-nav__arrow" aria-hidden="true">
                            <HugeiconsIcon className="card-nav__arrow-icon card-nav__arrow-icon--out" icon={ArrowUpRight01Icon} size={14} strokeWidth={2} />
                            <HugeiconsIcon className="card-nav__arrow-icon card-nav__arrow-icon--in" icon={ArrowUpRight01Icon} size={14} strokeWidth={2} />
                          </span>
                          {link.label}
                        </>,
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {cta && narrow && (
            <div
              ref={(element) => {
                cardRefs.current[items.length] = element
              }}
            >
              {ctaButton(cta, true)}
            </div>
          )}
        </div>
        <span className="card-nav__rim" />
      </nav>
    </div>
  )
}
