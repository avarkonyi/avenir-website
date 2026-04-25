// ─── CONTACT SECTION ─────────────────────────────────────────────────────────
// Self-contained React module for the Avenir Contact section, including:
//   • ContactSVG — inline SVG icons (address / phone / email)
//   • ContactRow — animated, hover-reactive contact row (clickable link)
//   • Contact    — the full section with form + contact info column
//
// Dependencies:
//   • React (with useState in scope — adjust the import line for your setup)
//   • An Icon({name, size, color}) component that supports "check"
//   • CSS variables on :root:
//       --navy:       #0B1E3E
//       --off-white:  #F5F6F8
//       --graphite:   #2A3342
//       --font-head:  'Barlow Condensed', sans-serif
//       --font-body:  'Inter', sans-serif
//
// Translation object `t` shape used here:
//   t.contactSub          → eyebrow label above title
//   t.contactTitle        → main heading
//   t.contactLabels       → { address, phone, email }   ← row eyebrow labels
//   t.form.{name,company,email,phone,service,message,send,success}
//   t.services            → [{ id, t }]                  ← used in <select>
//
// Example contactLabels values:
//   HU: { address: "Cím",     phone: "Telefon", email: "E-mail" }
//   EN: { address: "Address", phone: "Phone",   email: "Email" }
//   DE: { address: "Adresse", phone: "Telefon", email: "E-Mail" }
//   ZH: { address: "地址",     phone: "电话",     email: "邮箱"  }
// ─────────────────────────────────────────────────────────────────────────────

const { useState } = React;

// Inline SVG icons — all use currentColor so they respect parent color.
const ContactSVG = {
  address: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
         width="22" height="22">
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
         width="22" height="22">
      <path d="M21 16.5v2.6a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3.1 19.2 19.2 0 0 1-5.9-5.9A19.5 19.5 0 0 1 1.3 3.6 2 2 0 0 1 3.3 1.4h2.6a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7 9a16 16 0 0 0 6 6l1.2-1.4a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
         width="22" height="22">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3 6.5l9 6.5 9-6.5" />
    </svg>
  )
};

// Single hover-reactive contact row (icon tile + label + value).
function ContactRow({ kind, label, text, href }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target={kind === "address" ? "_blank" : undefined}
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "10px 12px",
        marginLeft: -12,
        textDecoration: "none",
        borderRadius: 3,
        background: hover ? "rgba(209,23,46,0.04)" : "transparent",
        transform: hover ? "translateX(4px)" : "translateX(0)",
        transition: "background 0.25s ease, transform 0.25s ease"
      }}
    >
      {/* Icon tile */}
      <div style={{
        position: "relative",
        width: 52,
        height: 52,
        flexShrink: 0,
        borderRadius: 3,
        background: hover ? "#D1172E" : "var(--navy)",
        color:      hover ? "#fff"    : "#D1172E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hover
          ? "0 8px 22px rgba(209,23,46,0.35)"
          : "0 2px 6px rgba(11,30,62,0.15)",
        transition:
          "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        overflow: "hidden"
      }}>
        {/* Diagonal sheen on hover */}
        <span style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.25s ease"
        }} />
        {/* Icon (slightly scales on hover) */}
        <span style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: hover ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.25s ease",
          position: "relative",
          zIndex: 1
        }}>
          {ContactSVG[kind]}
        </span>
      </div>

      {/* Text block */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={{
          fontFamily: "var(--font-head)",
          fontSize: 11,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          fontWeight: 700,
          color: hover ? "#D1172E" : "#8A9BB0",
          transition: "color 0.25s ease"
        }}>{label}</span>
        <span style={{
          fontSize: 16,
          fontWeight: 400,
          color: hover ? "var(--navy)" : "#556070",
          transition: "color 0.25s ease",
          fontFamily: "var(--font-body)"
        }}>{text}</span>
      </div>
    </a>
  );
}

// Full Contact section — info column on the left, form card on the right.
function Contact({ t }) {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", service: "", message: ""
  });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <section
      id="contact"
      data-screen-label="Contact"
      style={{ padding: "100px 5vw", background: "var(--off-white)" }}
    >
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 80, alignItems: "start"
      }}>
        {/* LEFT — heading + animated contact rows */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 3, background: "#D1172E" }} />
            <span style={{
              fontFamily: "var(--font-head)", fontSize: 13, letterSpacing: 2.5,
              color: "#D1172E", textTransform: "uppercase", fontWeight: 600
            }}>{t.contactSub}</span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-head)", fontWeight: 800,
            fontSize: "clamp(36px, 4vw, 54px)", color: "var(--navy)",
            lineHeight: 1.1, marginBottom: 32
          }}>{t.contactTitle}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { kind: "address", label: t.contactLabels.address, text: "1234 Budapest, Példa utca 1.", href: "https://maps.google.com/?q=Budapest" },
              { kind: "phone",   label: t.contactLabels.phone,   text: "+36 1 234 5678",               href: "tel:+3612345678" },
              { kind: "email",   label: t.contactLabels.email,   text: "info@avenir.hu",               href: "mailto:info@avenir.hu" }
            ].map((item, i) => <ContactRow key={i} {...item} />)}
          </div>
        </div>

        {/* RIGHT — form card */}
        <div style={{
          background: "#fff", borderRadius: 4,
          padding: "44px 40px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.06)"
        }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 64, height: 64,
                background: "rgba(209,23,46,0.1)", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px"
              }}>
                <Icon name="check" size={28} color="#D1172E" />
              </div>
              <p style={{
                fontFamily: "var(--font-head)", fontSize: 18,
                color: "var(--navy)", fontWeight: 700, lineHeight: 1.5
              }}>{t.form.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "name",    label: t.form.name },
                { key: "company", label: t.form.company },
                { key: "email",   label: t.form.email,  type: "email" },
                { key: "phone",   label: t.form.phone,  type: "tel" }
              ].map(f => (
                <input
                  key={f.key}
                  type={f.type || "text"}
                  placeholder={f.label}
                  required={["name", "email"].includes(f.key)}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{
                    border: "1px solid #E2E8F0", borderRadius: 2,
                    padding: "12px 16px", fontSize: 14,
                    fontFamily: "var(--font-body)", color: "var(--graphite)",
                    outline: "none", transition: "border-color 0.2s",
                    background: "#FAFBFC"
                  }}
                  onFocus={e => e.target.style.borderColor = "#D1172E"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />
              ))}

              <select
                value={form.service}
                onChange={e => setForm({ ...form, service: e.target.value })}
                style={{
                  border: "1px solid #E2E8F0", borderRadius: 2,
                  padding: "12px 16px", fontSize: 14,
                  fontFamily: "var(--font-body)",
                  color: form.service ? "var(--graphite)" : "#9BA8B5",
                  outline: "none", background: "#FAFBFC", appearance: "none"
                }}
              >
                <option value="">{t.form.service}</option>
                {t.services.map(s => <option key={s.id} value={s.id}>{s.t}</option>)}
              </select>

              <textarea
                placeholder={t.form.message}
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={{
                  border: "1px solid #E2E8F0", borderRadius: 2,
                  padding: "12px 16px", fontSize: 14,
                  fontFamily: "var(--font-body)", color: "var(--graphite)",
                  outline: "none", resize: "vertical", background: "#FAFBFC",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#D1172E"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />

              <button
                type="submit"
                style={{
                  background: "#D1172E", border: "none", cursor: "pointer",
                  color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700,
                  fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase",
                  padding: "16px", borderRadius: 2, marginTop: 4,
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.target.style.background = "#a80f24"}
                onMouseLeave={e => e.target.style.background = "#D1172E"}
              >{t.form.send}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
