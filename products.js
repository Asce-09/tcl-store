// ---------- Data ----------
// To change a specific product's picture: either replace the image FILE at
// the path below (keep the same filename), or edit the "image" path here to
// point at a different file. Each product has its own dedicated image, so
// changing one never affects the others.
const PRODUCTS = [
  {
    id: "tv-x11l", cat: "tv", name: "TCL X11L 65\" QD-Mini LED TV",
    spec: "20,736 dimming zones · SQD-Mini LED · Google TV", price: 1899,
    image: "icons/products/1.png",
    description: "TCL's flagship Mini LED television, built around the SQD-Mini LED platform for precise, zone-by-zone light control.",
    features: ["20,736 local dimming zones", "SQD-Mini LED backlight platform", "Built-in Google TV smart platform", "144Hz refresh for console and PC gaming"]
  },
  {
    id: "tv-p8l", cat: "tv", name: "TCL P8L 55\" QD-Mini LED TV",
    spec: "QD-Mini LED · Halo Control · 144Hz gaming", price: 999,
    image: "icons/products/1.png",
    description: "A QD-Mini LED display that pairs quantum dot color with TCL's Halo Control contrast technology.",
    features: ["QD-Mini LED backlight", "All-domain Halo Control Technology", "144Hz refresh rate", "Slim uni-body design"]
  },
  {
    id: "tv-p7l", cat: "tv", name: "TCL P7L 50\" QLED TV",
    spec: "Quantum Dot · Uni-body design · Google TV", price: 549,
    image: "icons/products/1.png",
    description: "TCL's global QLED lineup, built around a slim uni-body frame with wide color coverage.",
    features: ["Quantum Dot color technology", "Uni-body slim design", "Google TV smart platform", "Available in six screen sizes"]
  },
  {
    id: "fr-genius", cat: "fridge", name: "TCL GeniusFresh Side-by-Side 26 cu.ft",
    spec: "Multi Air Flow · Dual Inverter · AI temp control", price: 1799,
    image: "icons/products/fr-genius.svg",
    description: "A side-by-side refrigerator engineered around GeniusFresh cooling for even temperature distribution.",
    features: ["Multi Air Flow cooling system", "Dual Inverter compressor", "AI-assisted temperature control", "26 cu.ft. total capacity"]
  },
  {
    id: "fr-dualinv", cat: "fridge", name: "TCL Dual Inverter Top Freezer 18 cu.ft",
    spec: "Inverter compressor · Frost-free · LED interior", price: 899,
    image: "icons/products/fr-dualinv.svg",
    description: "A frost-free top freezer refrigerator with an inverter compressor for quieter, more efficient cooling.",
    features: ["Dual Inverter compressor", "Frost-free operation", "LED interior lighting", "18 cu.ft. total capacity"]
  },
  {
    id: "fr-trf118", cat: "fridge", name: "TCL TRF-118PH Two Door 4.3 cu.ft",
    spec: "Compact two-door · Reversible hinge · Low noise", price: 329,
    image: "icons/products/fr-trf118.svg",
    description: "A compact two-door refrigerator suited to smaller kitchens, apartments, or secondary storage.",
    features: ["Two-door compact design", "Reversible door hinge", "Low operating noise", "4.3 cu.ft. total capacity"]
  },
  {
    id: "ac-freshin", cat: "ac", name: "TCL FreshIN 3.0 Split AC 1.5HP",
    spec: "Fresh-air intake · Full DC Inverter · AI mode", price: 649,
    image: "icons/products/ac-freshin.svg",
    description: "A split air conditioner built around TCL's FreshIN 3.0 system, drawing outside air into the room.",
    features: ["FreshIN 3.0 fresh-air intake", "Full DC Inverter compressor", "AI mode auto-adjusts settings", "1.5HP cooling capacity"]
  },
  {
    id: "ac-window", cat: "ac", name: "TCL AI Full DC Inverter Window 1.0HP",
    spec: "Window unit · WiFi control · Sleep curve", price: 399,
    image: "icons/products/ac-window.svg",
    description: "A window air conditioner with full DC inverter efficiency and app-based control.",
    features: ["Full DC Inverter compressor", "WiFi app control", "Sleep curve temperature profile", "1.0HP cooling capacity"]
  },
  {
    id: "ac-split25", cat: "ac", name: "TCL AI Full DC Inverter Split 2.5HP",
    spec: "Split type · Turbo cooling · Self-clean", price: 899,
    image: "icons/products/ac-split25.svg",
    description: "A higher-capacity split air conditioner for larger rooms, with turbo cooling and self-clean.",
    features: ["Full DC Inverter compressor", "Turbo cooling mode", "Self-clean function", "2.5HP cooling capacity"]
  },
  {
    id: "wa-amera", cat: "washer", name: "TCL AmeraClassic Front Load 9.5kg",
    spec: "Front load · Steam care · 1400 RPM spin", price: 749,
    image: "icons/products/wa-amera.svg",
    description: "A front-load washer from TCL's AmeraClassic series, with steam care for deeper, gentler cleaning.",
    features: ["Steam care cycle", "1400 RPM max spin speed", "Front-load design", "9.5kg wash capacity"]
  },
  {
    id: "wa-superd", cat: "washer", name: "TCL AI SuperDrum Washer-Dryer Combo",
    spec: "2-in-1 wash & dry · AI load sensing", price: 1299,
    image: "icons/products/wa-superd.svg",
    description: "A 2-in-1 washer-dryer combo that senses load size and adjusts wash and dry cycles automatically.",
    features: ["Combined wash and dry in one drum", "AI load sensing", "Space-saving 2-in-1 design", "Single-cycle wash-to-dry operation"]
  },
  {
    id: "wa-top75", cat: "washer", name: "TCL Top Load Washing Machine 7.5kg",
    spec: "Top load · Quick wash · Child lock", price: 429,
    image: "icons/products/wa-top75.svg",
    description: "A straightforward top-load washer with a quick wash cycle and child lock for everyday laundry.",
    features: ["Top-load design", "Quick wash cycle", "Child lock safety feature", "7.5kg wash capacity"]
  },
];

const CATS = [
  { key: "all", label: "All" },
  { key: "tv", label: "TVs" },
  { key: "fridge", label: "Refrigerators" },
  { key: "ac", label: "Air Conditioners" },
  { key: "washer", label: "Washing Machines" },
];

const CAT_LABEL = { tv: "TV", fridge: "Refrigerator", ac: "Air Conditioner", washer: "Washing Machine" };

// ---------- Images ----------
// Renders a product's own picture (product.image). This is the one function
// every page calls to show a product photo/illustration, so pointing
// product.image at a new file is all that's needed to change it anywhere
// it appears (catalog card, cart drawer, detail page).
function productImage(p) {
  return `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
}

function zoneGridHTML(n) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += `<i style="animation-delay:${(i % 8) * 35 + Math.floor(i / 8) * 60}ms"></i>`;
  }
  return s;
}

function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}
