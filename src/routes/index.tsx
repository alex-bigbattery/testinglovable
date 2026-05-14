import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, MapPin, Calendar, Package, ShieldCheck, Star, Zap, Truck, Users, BadgeCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import logo from "@/assets/deepcells-logo.png";
import walrusG3 from "@/assets/products/walrus-g3.webp";
import walrusG3Pro from "@/assets/products/walrus-g3-pro.webp";
import walrusG4Plus from "@/assets/products/walrus-g4-plus.webp";
import walrusPacific from "@/assets/products/walrus-pacific.webp";
import owlLite from "@/assets/products/12V-OWL-LITE.webp";
import razorback from "@/assets/products/12V-RAZORBACK.webp";
import eagle from "@/assets/products/24V-EAGLE.webp";
import raptor from "@/assets/products/36V-RAPTOR-Lithium-Battery.webp";
import reindeer from "@/assets/products/36V-REINDEER.webp";
import badger from "@/assets/products/48V-BADGER.webp";
import chihuahua from "@/assets/products/48V-Chihuahua.webp";
import falcon from "@/assets/products/72V-FALCON.png";
import elephant from "@/assets/products/ELEPHANT-480V-AC227.webp";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DeepCells × TechDirect Liquidation — Lithium Battery Sale" },
      { name: "description", content: "30–40% OFF select lithium battery inventory. Home backup, golf cart, RV & industrial. Hosted by DeepCells, fulfilled by TechDirect. Ends in 2 weeks." },
    ],
  }),
});

type Product = {
  id: string;
  name: string;
  spec: string;
  blurb: string;
  image: string;
  retail: number;
  sale: number;
  off: number;
};

type Category = { name: string; icon: typeof Zap; products: Product[] };

const CATEGORIES: Category[] = [
  {
    name: "Home Backup Systems",
    icon: Zap,
    products: [
      { id: "walrus-g3", name: "Walrus G3", spec: "12.5 kVA Inverter · 22 kWh LFP", blurb: "Perfect for small to medium homes with central A/C under 3 tons.", image: walrusG3, retail: 14900, sale: 9685, off: 35 },
      { id: "walrus-g4-plus", name: "Walrus G4 PLUS", spec: "16.5 kVA Inverter · 23 kWh LFP", blurb: "Larger inverter for homes with high-draw appliances and electric water heaters.", image: walrusG4Plus, retail: 17900, sale: 11635, off: 35 },
      { id: "walrus-g3-pro", name: "Walrus G3 PRO", spec: "22.0 kVA Inverter · 44 kWh LFP", blurb: "Strongest inverter we carry plus immense storage in a compact package.", image: walrusG3Pro, retail: 26900, sale: 16140, off: 40 },
      { id: "walrus-pacific", name: "Walrus Pacific", spec: "12.5 kVA Inverter · 62 kWh LFP", blurb: "Massive LFP pack for long outages or high daily consumption.", image: walrusPacific, retail: 32900, sale: 21385, off: 35 },
    ],
  },
  {
    name: "Golf Cart Batteries",
    icon: Truck,
    products: [
      { id: "eagle-24v", name: "24V Eagle", spec: "24V Lithium · Drop-in", blurb: "Light, compact lithium pack for 24V carts and utility vehicles.", image: eagle, retail: 1899, sale: 1234, off: 35 },
      { id: "reindeer-36v", name: "36V Reindeer", spec: "36V Lithium · Long-range", blurb: "All-day range upgrade for classic 36V golf carts.", image: reindeer, retail: 2499, sale: 1624, off: 35 },
      { id: "raptor-36v", name: "36V Raptor", spec: "36V Lithium · High output", blurb: "High-output 36V pack for hilly courses and modded carts.", image: raptor, retail: 2799, sale: 1819, off: 35 },
      { id: "badger-48v", name: "48V Badger", spec: "48V Lithium · Standard", blurb: "Reliable 48V drop-in upgrade with BMS protection.", image: badger, retail: 2999, sale: 1949, off: 35 },
      { id: "chihuahua-48v", name: "48V Chihuahua", spec: "48V Lithium · Compact", blurb: "Compact 48V pack for tight battery bays.", image: chihuahua, retail: 2699, sale: 1754, off: 35 },
      { id: "falcon-72v", name: "72V Falcon", spec: "72V Lithium · Performance", blurb: "Performance 72V system for lifted and high-speed carts.", image: falcon, retail: 4499, sale: 2699, off: 40 },
    ],
  },
  {
    name: "RV Batteries",
    icon: Truck,
    products: [
      { id: "owl-lite-12v", name: "12V Owl Lite", spec: "12V LiFePO4 · 100Ah class", blurb: "Lightweight 12V house battery for RVs, vans, and trailers.", image: owlLite, retail: 899, sale: 584, off: 35 },
      { id: "razorback-12v", name: "12V Razorback", spec: "12V LiFePO4 · High capacity", blurb: "High-capacity 12V LFP for off-grid coaches and overlanders.", image: razorback, retail: 1299, sale: 844, off: 35 },
      { id: "eagle-24v-rv", name: "24V Eagle (RV)", spec: "24V LiFePO4 · House bank", blurb: "24V house bank for larger RVs and marine builds.", image: eagle, retail: 1899, sale: 1234, off: 35 },
    ],
  },
  {
    name: "Industrial Batteries",
    icon: Package,
    products: [
      { id: "owl-lite-ind", name: "12V Owl Lite (Industrial)", spec: "12V LFP · Telecom & light duty", blurb: "Telecom and light industrial 12V LFP.", image: owlLite, retail: 999, sale: 649, off: 35 },
      { id: "reindeer-36v-ind", name: "36V Reindeer (Industrial)", spec: "36V LFP · Material handling", blurb: "Material handling and floor scrubber lithium pack.", image: reindeer, retail: 3499, sale: 2274, off: 35 },
      { id: "chihuahua-48v-ind", name: "48V Chihuahua (Industrial)", spec: "48V LFP · Light forklift", blurb: "Compact 48V industrial pack for light forklifts and AGVs.", image: chihuahua, retail: 3299, sale: 2144, off: 35 },
      { id: "elephant-480v", name: "480V Elephant AC227", spec: "480V LFP · Commercial ESS", blurb: "Commercial-scale energy storage system for industrial sites.", image: elephant, retail: 89000, sale: 53400, off: 40 },
    ],
  },
];

const ALL_PRODUCTS = CATEGORIES.flatMap((c) => c.products);
const MIN_ORDER = 5000;
const SALE_END = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useMemo(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function Index() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", buyerType: "", notes: "" });
  const { d, h, m, s } = useCountdown(SALE_END);

  const lineItems = ALL_PRODUCTS
    .map((p) => ({ ...p, q: qty[p.id] || 0 }))
    .filter((p) => p.q > 0);
  const subtotal = lineItems.reduce((acc, p) => acc + p.sale * p.q, 0);
  const retailTotal = lineItems.reduce((acc, p) => acc + p.retail * p.q, 0);
  const savings = retailTotal - subtotal;
  const meetsMin = subtotal >= MIN_ORDER;

  const setQ = (id: string, v: number) => setQty((q) => ({ ...q, [id]: Math.max(0, v) }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Name and email are required.");
    if (lineItems.length === 0) return toast.error("Add at least one product to your order.");
    if (!meetsMin) return toast.error(`Minimum order is ${fmt(MIN_ORDER)}. You're at ${fmt(subtotal)}.`);

    const body = [
      "DeepCells × TechDirect Liquidation Order Request",
      "",
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Buyer type: ${form.buyerType}`,
      "",
      "Items:",
      ...lineItems.map((p) => `  ${p.q} × ${p.name} (${p.spec}) — ${fmt(p.sale)} ea = ${fmt(p.sale * p.q)}`),
      "",
      `Subtotal: ${fmt(subtotal)}`,
      `Retail: ${fmt(retailTotal)}`,
      `Savings: ${fmt(savings)}`,
      "",
      `Notes: ${form.notes}`,
    ].join("\n");

    // Email destination provided later — open mailto draft for now.
    const mailto = `mailto:?subject=${encodeURIComponent("DeepCells Liquidation — Order Request")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    toast.success("Order request prepared. Confirm in your email client to send.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="top-center" />

      {/* Hero */}
      <header className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto max-w-6xl px-6 py-10 sm:py-14">
          <nav className="flex items-center justify-between">
            <img src={logo} alt="DeepCells" className="h-12 sm:h-14 w-auto drop-shadow-[0_0_18px_oklch(0.72_0.2_245/0.6)]" />
            <a href="#order" className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm text-foreground/80 backdrop-blur hover:bg-card/80 transition">
              Jump to order <Zap className="h-4 w-4 text-primary" />
            </a>
          </nav>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>
                LIVE LIQUIDATION EVENT · ENDS IN 2 WEEKS
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Lithium batteries at <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>liquidation prices.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                <span className="text-foreground font-semibold">DeepCells</span> is hosting an exclusive liquidation event of <span className="text-foreground font-semibold">TechDirect</span> inventory — <span className="text-primary font-semibold">30–40% OFF</span> select home backup, golf cart, RV, and industrial lithium batteries. First-come, first-served.
              </p>

              <div className="mt-7 grid grid-cols-4 gap-3 max-w-md">
                {[{ l: "Days", v: d }, { l: "Hours", v: h }, { l: "Min", v: m }, { l: "Sec", v: s }].map((t) => (
                  <div key={t.l} className="rounded-xl border border-border bg-card/60 backdrop-blur p-3 text-center" style={{ boxShadow: "var(--shadow-elegant)" }}>
                    <div className="text-2xl sm:text-3xl font-bold tabular-nums text-primary">{String(t.v).padStart(2, "0")}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90" style={{ boxShadow: "var(--shadow-glow)" }}>
                  <a href="#catalog">Browse inventory</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#order">Reserve your order</a>
                </Button>
              </div>
            </div>

            <TrustCard />
          </div>

          {/* Quick facts */}
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Package, l: "Min. order", v: "$5,000" },
              { i: Calendar, l: "Sale ends", v: "In 2 weeks" },
              { i: MapPin, l: "Pickup", v: "Chatsworth, CA" },
              { i: ShieldCheck, l: "Fulfilled by", v: "TechDirect" },
            ].map((f) => (
              <div key={f.l} className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 backdrop-blur">
                <f.i className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{f.l}</div>
                  <div className="text-sm font-semibold">{f.v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Catalog */}
      <main id="catalog" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">The inventory</h2>
            <p className="mt-2 text-muted-foreground">Set quantities below. Your order summary updates live.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Ideal for <span className="text-foreground font-medium">bulk buyers, resellers, installers & contractors</span>.
          </div>
        </div>

        <div className="mt-10 space-y-14">
          {CATEGORIES.map((cat) => (
            <section key={cat.name}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <cat.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold">{cat.name}</h3>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.products.map((p) => (
                  <ProductCard key={p.id} product={p} qty={qty[p.id] || 0} setQ={(v) => setQ(p.id, v)} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Order summary + form */}
        <section id="order" className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <h3 className="text-2xl font-bold">Order summary</h3>
            <p className="mt-1 text-sm text-muted-foreground">Minimum order {fmt(MIN_ORDER)}. First-come, first-served.</p>

            <div className="mt-6 divide-y divide-border">
              {lineItems.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No items selected yet — add quantities above.
                </div>
              )}
              {lineItems.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-3">
                  <img src={p.image} alt="" className="h-12 w-12 rounded-md object-cover bg-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.q} × {fmt(p.sale)}</div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums">{fmt(p.sale * p.q)}</div>
                </div>
              ))}
            </div>

            {lineItems.length > 0 && (
              <div className="mt-5 space-y-2 rounded-xl bg-muted/40 p-4 text-sm">
                <Row label="Retail value" value={fmt(retailTotal)} muted />
                <Row label="Your savings" value={`− ${fmt(savings)}`} accent />
                <div className="my-2 h-px bg-border" />
                <Row label="Subtotal" value={fmt(subtotal)} bold />
                {!meetsMin && (
                  <p className="pt-2 text-xs text-destructive">
                    Add {fmt(MIN_ORDER - subtotal)} more to meet the {fmt(MIN_ORDER)} minimum.
                  </p>
                )}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <h3 className="text-2xl font-bold">Reserve your order</h3>
            <p className="mt-1 text-sm text-muted-foreground">We'll confirm pricing, availability, and pickup within one business day.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name *"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={120} /></Field>
              <Field label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} maxLength={120} /></Field>
              <Field label="Email *"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={200} /></Field>
              <Field label="Phone"><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={40} /></Field>
              <Field label="Buyer type">
                <select value={form.buyerType} onChange={(e) => setForm({ ...form, buyerType: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Select…</option>
                  <option>Reseller</option><option>Installer</option><option>Contractor</option><option>End user / bulk buyer</option><option>Other</option>
                </select>
              </Field>
              <Field label="Pickup window"><Input placeholder="e.g. next week, afternoons" onChange={(e) => setForm({ ...form, notes: `Pickup: ${e.target.value}. ${form.notes}` })} maxLength={120} /></Field>
              <div className="sm:col-span-2"><Field label="Notes"><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={1000} placeholder="Anything we should know?" /></Field></div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <span className="text-muted-foreground">Order subtotal</span>
              <span className="font-semibold tabular-nums">{fmt(subtotal)}</span>
            </div>

            <Button type="submit" size="lg" className="mt-5 w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90" style={{ boxShadow: "var(--shadow-glow)" }}>
              Submit order request
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              By submitting, you'll be contacted by DeepCells to confirm your order. Pickup at {`9667 Owensmouth Ave, Chatsworth, CA 91311`}.
            </p>
          </form>
        </section>
      </main>

      <footer className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6 sm:grid-cols-2 items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="DeepCells" className="h-10 w-auto" />
            <div className="text-sm text-muted-foreground">
              Liquidation event hosted by DeepCells. Inventory & payments fulfilled by TechDirect.
            </div>
          </div>
          <div className="text-sm text-muted-foreground sm:text-right">
            <div className="flex sm:justify-end items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> 9667 Owensmouth Ave, Chatsworth, CA 91311</div>
            <div className="mt-1">© {new Date().getFullYear()} DeepCells.com</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value, bold, accent, muted }: { label: string; value: string; bold?: boolean; accent?: boolean; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base font-bold" : ""}`}>
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span className={`tabular-nums ${accent ? "text-primary font-semibold" : ""}`}>{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ProductCard({ product, qty, setQ }: { product: Product; qty: number; setQ: (v: number) => void }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/50" style={{ boxShadow: qty > 0 ? "var(--shadow-glow)" : undefined }}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">{product.off}% OFF</div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs uppercase tracking-wider text-primary">{product.spec}</div>
        <h4 className="mt-1 text-lg font-semibold">{product.name}</h4>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{product.blurb}</p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold">{fmt(product.sale)}</span>
          <span className="text-sm text-muted-foreground line-through">{fmt(product.retail)}</span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Quantity</span>
          <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
            <button type="button" aria-label="Decrease" onClick={() => setQ(qty - 1)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted disabled:opacity-40" disabled={qty === 0}><Minus className="h-4 w-4" /></button>
            <input type="number" min={0} value={qty} onChange={(e) => setQ(parseInt(e.target.value || "0", 10))} className="w-12 bg-transparent text-center text-sm font-semibold outline-none" />
            <button type="button" aria-label="Increase" onClick={() => setQ(qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustCard() {
  const slides = [
    { icon: Star, label: "eBay Seller Rating", value: "99.3% positive", sub: "Thousands of verified buyer reviews" },
    { icon: BadgeCheck, label: "eBay Top Rated Plus", value: "Trusted Seller", sub: "Fast shipping & top-tier service" },
    { icon: Users, label: "Loyal Following", value: "10K+ buyers", sub: "Active community on eBay" },
    { icon: ShieldCheck, label: "Authorized Inventory", value: "Direct from TechDirect", sub: "Authentic, warrantied lithium batteries" },
  ];
  const [i, setI] = useState(0);
  useMemo(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);
  const S = slides[i];
  return (
    <div className="relative rounded-2xl border border-border bg-card/70 p-6 backdrop-blur" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Inventory & payment partner</div>
        <a href="https://www.ebay.com/str/techdirectclub" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          View on eBay <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-black">TD</div>
        <div>
          <div className="text-lg font-bold">TechDirect</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {[...Array(5)].map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-primary text-primary" />)}
            <span className="ml-1">eBay verified seller</span>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-background/40">
        <div key={i} className="animate-in fade-in slide-in-from-right-2 duration-500 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <S.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{S.label}</div>
              <div className="text-xl font-bold">{S.value}</div>
              <div className="text-sm text-muted-foreground">{S.sub}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-1.5 pb-4">
          {slides.map((_, k) => (
            <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat v="99.3%" l="Positive" />
        <Stat v="10K+" l="Buyers" />
        <Stat v="Fast" l="Shipping" />
      </div>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2">
      <div className="text-sm font-bold text-primary">{v}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
    </div>
  );
}
