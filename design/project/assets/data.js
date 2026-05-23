// Wireless India — real catalog data (driven by the shop's actual stock)
window.WI = {
  shop: {
    name: "Wireless India",
    tagline: "Components, audio &amp; accessories — under one roof.",
    phone: "+91 98658 11796",
    whatsapp: "+91 98658 11796",
    address: "8, Kadarkarai Nadar St, Theni — 625531",
    hours: "Mon–Sat · 10:30 am – 8:30 pm",
  },

  // 10 real categories — matched to folders in the shop's Drive.
  // `hero` = the product image used as the category card thumbnail.
  categories: [
    { id: "sound-bars",         name: "Sound Bars",            count: 24,   blurb: "2.1, 5.1 &amp; Dolby Atmos systems",         hero: "assets/products/sound-bars/zeb-juke-bar-9750-pro.webp" },
    { id: "bluetooth-speakers", name: "Bluetooth Speakers",    count: 62,   blurb: "Portable, party, outdoor, RGB",                hero: "assets/products/bluetooth-speakers/stone-spinx-pro.webp" },
    { id: "keyboards-mice",     name: "Keyboards &amp; Mice",  count: 84,   blurb: "Wired, wireless &amp; combo sets",             hero: "assets/products/keyboards-mice/logitech-mk200.jpg" },
    { id: "multimeters",        name: "Multimeters",           count: 32,   blurb: "Digital, analog, clamp &amp; lab grade",        hero: "assets/products/multimeters/astroai-am33d.jpg" },
    { id: "ics-fets",           name: "ICs &amp; FETs",        count: 1380, blurb: "Op-amps, logic, MOSFETs, regulators",          hero: "assets/products/ics-fets/ic-dip-pair.jpg" },
    { id: "cables",             name: "Cables &amp; Wires",    count: 410,  blurb: "HDMI, USB, audio, jumper, ethernet",           hero: "assets/products/cables/hdmi-cable.jpg" },
    { id: "pendrives",          name: "Pendrives &amp; Memory",count: 96,   blurb: "USB drives, SD cards, OTG",                    hero: "assets/products/pendrives/sandisk-ultra-dual.jpg" },
    { id: "powerstrips",        name: "Power Strips",          count: 44,   blurb: "USB-C, surge protected, extension",            hero: "assets/products/powerstrips/usb-c-strip.webp" },
    { id: "screwdrivers",       name: "Screwdrivers &amp; Tools", count: 140, blurb: "Precision, magnetic, repair kits",         hero: "assets/products/screwdrivers/stanley-flathead.webp" },
    { id: "cctv-psu",           name: "CCTV Power Supplies",   count: 28,   blurb: "SMPS, adaptors, surveillance gear",            hero: "assets/products/cctv-psu/cctv-smps.webp" },
  ],

  // Brands actually in the shop's stock (extracted from product images + reasonable additions)
  brands: [
    "Zebronics", "boAt", "Artis", "Portronics",
    "AstroAI", "SanDisk", "Stanley",
    "Logitech", "Dell", "HP",
    "Philips", "Anker"
  ],

  // Featured / new arrivals — real products from the catalog
  featured: [
    {
      id: "zeb-9750",
      name: "Zeb Juke Bar 9750 Pro Dolby Atmos",
      brand: "Zebronics", cat: "Sound Bars",
      price: "₹24,999", was: "₹34,999", tag: "Best deal",
      image: "assets/products/sound-bars/zeb-juke-bar-9750-pro.webp",
      specs: ["5.1.2 channel", "Dolby Atmos", "Bluetooth"]
    },
    {
      id: "stone-spinx",
      name: "Stone SpinX Pro Bluetooth Speaker",
      brand: "Portronics", cat: "Bluetooth Speakers",
      price: "₹2,499", was: "₹3,499", tag: "Bestseller",
      image: "assets/products/bluetooth-speakers/stone-spinx-pro.webp",
      specs: ["16W RMS", "RGB lights", "12hr playback"]
    },
    {
      id: "astroai-am33d",
      name: "AstroAI AM33D Digital Multimeter",
      brand: "AstroAI", cat: "Multimeters",
      price: "₹1,499", was: "₹1,999", tag: "New",
      image: "assets/products/multimeters/astroai-am33d.jpg",
      specs: ["AC/DC", "Auto-ranging", "Battery test"]
    },
    {
      id: "mk200",
      name: "Logitech MK200 Keyboard &amp; Mouse Combo",
      brand: "Logitech", cat: "Keyboards &amp; Mice",
      price: "₹1,295", was: null, tag: "Office pick",
      image: "assets/products/keyboards-mice/logitech-mk200.jpg",
      specs: ["USB wired", "Media keys", "1000 DPI"]
    },
    {
      id: "sandisk-otg",
      name: "SanDisk Ultra Dual Drive Go 64GB USB-C",
      brand: "SanDisk", cat: "Pendrives &amp; Memory",
      price: "₹699", was: "₹899", tag: "Hot deal",
      image: "assets/products/pendrives/sandisk-ultra-dual.jpg",
      specs: ["64 GB", "USB-C + USB-A", "150 MB/s"]
    },
    {
      id: "hdmi-2m",
      name: "Premium HDMI 2.1 Cable, 2 m",
      brand: "Generic", cat: "Cables &amp; Wires",
      price: "₹399", was: "₹599", tag: null,
      image: "assets/products/cables/hdmi-cable.jpg",
      specs: ["4K · 120Hz", "Gold plated", "2 meter"]
    },
    {
      id: "ic-dip-pair",
      name: "HCF4011BE Quad NAND IC (DIP-14)",
      brand: "STMicro", cat: "ICs &amp; FETs",
      price: "₹18", was: null, tag: null,
      image: "assets/products/ics-fets/ic-dip-pair.jpg",
      specs: ["CMOS logic", "DIP-14", "Lot of 10"]
    },
    {
      id: "powerstrip-usbc",
      name: "USB-C Power Strip, 10A, 4 sockets",
      brand: "Generic", cat: "Power Strips",
      price: "₹899", was: "₹1,299", tag: "New",
      image: "assets/products/powerstrips/usb-c-strip.webp",
      specs: ["4 universal sockets", "3 USB + PD", "2m cord"]
    },
    {
      id: "boat-stone",
      name: "boAt Stone 358 RGB Bluetooth Speaker",
      brand: "boAt", cat: "Bluetooth Speakers",
      price: "₹2,299", was: "₹3,999", tag: "Hot deal",
      image: "assets/products/bluetooth-speakers/boat-stone-rgb.webp",
      specs: ["10W", "IPX7", "RGB"]
    },
    {
      id: "stanley-flat",
      name: "Stanley Cushion-Grip Flathead Screwdriver",
      brand: "Stanley", cat: "Screwdrivers &amp; Tools",
      price: "₹199", was: null, tag: null,
      image: "assets/products/screwdrivers/stanley-flathead.webp",
      specs: ["6\" shaft", "Magnetic tip", "Cushion grip"]
    },
    {
      id: "dt830d",
      name: "DT-830D Pocket Digital Multimeter",
      brand: "Generic", cat: "Multimeters",
      price: "₹349", was: "₹499", tag: "Combo",
      image: "assets/products/multimeters/dt830d.webp",
      specs: ["3½ digit", "750V AC", "Hobbyist"]
    },
    {
      id: "cctv-smps",
      name: "CCTV SMPS Power Supply 12V 10A",
      brand: "Generic", cat: "CCTV Power Supplies",
      price: "₹699", was: null, tag: null,
      image: "assets/products/cctv-psu/cctv-smps.webp",
      specs: ["12V 10A", "8-channel", "Metal case"]
    },
  ],
};
