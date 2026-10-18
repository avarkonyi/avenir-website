const COPY = {
  hu: {
    eyebrow: "Az első egyeztetéshez",
    title: "Mit érdemes megadni az ajánlatkérésben?",
    intro:
      "Az üzenetben röviden írja le az alábbiakat. A még nyitott kérdéseket az első egyeztetésen pontosíthatjuk.",
    site: {
      title: "Helyszín",
      body: "A település, az objektum típusa és hozzávetőleges mérete.",
    },
    schedule: {
      title: "Szolgálati idő",
      body: "Mely napokon, milyen idősávban szükséges a jelenlét? Jelezze az eltérő hétvégi vagy ünnepnapi igényt is.",
    },
    start: {
      title: "Tervezett kezdés",
      body: "Mikortól és várhatóan milyen időtartamra keres szolgáltatást? Új helyszínről vagy szolgáltatóváltásról van szó?",
    },
    costTitle: "Mi befolyásolja a díjat?",
    scopeTitle: "Milyen feladathatárokat érdemes tisztázni?",
    services: {
      objektumorzes: {
        traffic: {
          title: "Belépési pontok és forgalom",
          body: "A kezelendő bejáratok, teherkapuk száma, a jellemző személy- és járműforgalom, valamint a csúcsidőszakok.",
        },
        tasks: {
          title: "Őrzési feladatok",
          body: "Milyen beléptetési, járőrözési, kulcskezelési és eseményrögzítési feladatokat kér? Mely területek igényelnek külön figyelmet?",
        },
        technology: {
          title: "Meglévő technika",
          body: "Van-e kamera, beléptető, riasztó vagy távfelügyelet, és ezekhez milyen helyszíni feladat kapcsolódik?",
        },
        cost:
          "A díjat a szolgálati idősáv, a párhuzamosan kezelendő belépési pontok, a járőrözési feladatok és a helyszín kockázati profilja befolyásolja. A pontos feladatkört a meglévő technikával együtt érdemes áttekinteni.",
        scope:
          "Az őrzés mely területekre terjedjen ki? Mi marad a megrendelő vagy más szolgáltató feladata, kit kell értesíteni eltérés esetén, és milyen riportot vár a megrendelő?",
      },
      portaszolgalat: {
        traffic: {
          title: "Fogadási pontok és forgalom",
          body: "A recepciók, porták és bejáratok száma; a jellemző látogatói, beszállítói és futárforgalom, valamint a csúcsidőszakok.",
        },
        tasks: {
          title: "Vendégfogadási és portai igények",
          body: "Milyen regisztrációt, kulcs- vagy csomagkezelést kér? Jelezze a vendégfogadási és nyelvhasználati elvárásokat is; ezek teljesíthetőségét külön egyeztetjük.",
        },
        technology: {
          title: "Meglévő rendszerek",
          body: "Milyen beléptető, látogatóregisztrációs vagy belső értesítési folyamatot használ a helyszín?",
        },
        cost:
          "A díjat a szolgálati idősáv, az egyidejűleg működő recepciós és portapontok, a forgalom, valamint az egyeztetett adminisztrációs és kezelési feladatok befolyásolják.",
        scope:
          "Hol húzódjon a vendégfogadás, a portai beléptetés és az objektumőrzés feladathatára? Ki ad belépési engedélyt, kit kell értesíteni rendkívüli helyzetben, és milyen napi nyilvántartás szükséges?",
      },
    },
  },
  en: {
    eyebrow: "For the first discussion",
    title: "What should you include in a quote request?",
    intro:
      "Briefly describe the following in your message. We can clarify any open questions during the first discussion.",
    site: {
      title: "Site",
      body: "The town or city, the type of property and its approximate size.",
    },
    schedule: {
      title: "Service hours",
      body: "On which days and during which hours is a presence needed? Include any different weekend or public holiday requirements.",
    },
    start: {
      title: "Planned start",
      body: "When would you like the service to start, and for how long? Is this a new site or a change of provider?",
    },
    costTitle: "What affects the price?",
    scopeTitle: "Which responsibilities need to be clarified?",
    services: {
      objektumorzes: {
        traffic: {
          title: "Access points and traffic",
          body: "The number of entrances and vehicle gates to be covered, typical pedestrian and vehicle traffic, and peak periods.",
        },
        tasks: {
          title: "Guarding tasks",
          body: "Which access control, patrol, key handling and incident logging tasks do you need? Which areas require particular attention?",
        },
        technology: {
          title: "Existing technology",
          body: "Are CCTV, access control, alarm or remote monitoring systems in place, and which on-site tasks are associated with them?",
        },
        cost:
          "The price depends on service hours, access points requiring simultaneous coverage, patrol tasks and the site's risk profile. The precise scope should be considered alongside the existing technology.",
        scope:
          "Which areas should guarding cover? Which tasks remain with the client or another provider, who should be notified of an issue, and what reporting does the client need?",
      },
      portaszolgalat: {
        traffic: {
          title: "Reception points and traffic",
          body: "The number of reception desks, gatehouses and entrances; typical visitor, supplier and courier traffic, and peak periods.",
        },
        tasks: {
          title: "Reception and gatehouse requirements",
          body: "What registration, key or parcel handling is needed? Include visitor reception and language requirements so that we can separately discuss whether they can be met.",
        },
        technology: {
          title: "Existing systems",
          body: "Which access control, visitor registration or internal notification processes does the site use?",
        },
        cost:
          "The price depends on service hours, reception and gatehouse points operating at the same time, traffic levels, and the agreed administrative and handling tasks.",
        scope:
          "How should responsibilities be divided between reception, gatehouse access control and on-site guarding? Who authorises entry, who should be notified of an unusual situation, and which daily records are needed?",
      },
    },
  },
} as const;

export function ServiceQuotePreparation({
  locale,
  serviceSlug,
}: {
  locale: string;
  serviceSlug: string;
}) {
  if (locale !== "hu" && locale !== "en") return null;
  if (serviceSlug !== "objektumorzes" && serviceSlug !== "portaszolgalat") {
    return null;
  }

  const copy = COPY[locale];
  const service = copy.services[serviceSlug];
  const items = [
    copy.site,
    copy.schedule,
    service.traffic,
    service.tasks,
    service.technology,
    copy.start,
  ];

  return (
    <section
      aria-labelledby="quote-preparation-title"
      style={{ padding: "24px 5vw", background: "#fff" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <details style={{ border: "1px solid #E2E8F0", borderRadius: 4 }}>
          <summary style={{ cursor: "pointer", padding: "16px 18px", color: "#0B1E3E" }}>
            <h2
              id="quote-preparation-title"
              style={{ display: "inline", fontFamily: "var(--font-head)", fontSize: 18, lineHeight: 1.4, margin: 0 }}
            >
              {copy.title}
            </h2>
          </summary>
          <div style={{ padding: "8px 18px 24px" }}>
            <p style={{ color: "#D1172E", fontWeight: 700, fontSize: 13, margin: "0 0 10px" }}>
              {copy.eyebrow}
            </p>
            <p style={{ lineHeight: 1.6, margin: "16px 0 28px" }}>{copy.intro}</p>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                gap: 24,
                margin: 0,
              }}
            >
              {items.map((item) => (
                <div key={item.title} style={{ borderTop: "1px solid #E2E8F0", paddingTop: 16, minWidth: 0 }}>
                  <dt style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 17 }}>{item.title}</dt>
                  <dd style={{ margin: "8px 0 0", color: "rgba(11,30,62,0.78)", fontSize: 15, lineHeight: 1.6 }}>{item.body}</dd>
                </div>
              ))}
            </dl>
            <div style={{ marginTop: 32, padding: 24, background: "#F8FAFC", borderRadius: 4 }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 18, margin: "0 0 8px" }}>{copy.costTitle}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{service.cost}</p>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 18, margin: "24px 0 8px" }}>{copy.scopeTitle}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{service.scope}</p>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
