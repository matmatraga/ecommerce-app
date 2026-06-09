require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Users = require("../models/Users");
const Product = require("../models/Product");

// Demo catalog so a fresh install (or the live demo) never shows an empty
// storefront. Upserted by name, so re-running the seed is safe and never
// duplicates or overwrites admin edits to other fields than these.
const DEMO_PRODUCTS = [
  {
    name: "Logitech G Pro X Superlight 2",
    description:
      "Ultra-lightweight 60g wireless gaming mouse built for esports. LIGHTSPEED wireless, HERO 2 sensor up to 32,000 DPI, LIGHTFORCE hybrid switches, and up to 95 hours of battery life. The choice of pros who count every gram.",
    img: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80&auto=format&fit=crop",
    price: 8495,
    stock: 25,
    category: "mice",
    tags: ["wireless", "esports", "lightweight"],
  },
  {
    name: "Razer BlackWidow V4 Pro",
    description:
      "Full-size mechanical gaming keyboard with Razer Green switches, per-key Chroma RGB and underglow, a command dial, and 8 dedicated macro keys. Doubleshot ABS keycaps and a plush leatherette wrist rest for marathon sessions.",
    img: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=800&q=80&auto=format&fit=crop",
    price: 13495,
    stock: 12,
    category: "keyboards",
    tags: ["mechanical", "rgb", "full-size"],
  },
  {
    name: "SteelSeries Arctis Nova 7 Wireless",
    description:
      "Multi-system wireless gaming headset with simultaneous 2.4GHz + Bluetooth, 360° spatial audio, a retractable AI noise-cancelling mic, and 38-hour battery with USB-C fast charge. Comfort-first ski-goggle suspension band.",
    img: "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80&auto=format&fit=crop",
    price: 10995,
    stock: 18,
    category: "headsets",
    tags: ["wireless", "surround", "multi-platform"],
  },
  {
    name: "Keychron K8 Pro QMK/VIA",
    description:
      "Hot-swappable tenkeyless wireless mechanical keyboard with Gateron Pro switches, QMK/VIA support for full remapping, Mac/Windows layouts in the box, and a sturdy aluminum frame. A favorite for work-and-play setups.",
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80&auto=format&fit=crop",
    price: 5990,
    stock: 30,
    category: "keyboards",
    tags: ["mechanical", "hot-swap", "wireless"],
  },
  {
    name: "Razer DeathAdder V3",
    description:
      "Legendary ergonomic shape refined to 59g. Focus Pro 30K optical sensor, Gen-3 optical switches rated for 90 million clicks, and a flexible SpeedFlex cable. The most awarded mouse lineage in esports, now lighter than ever.",
    img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80&auto=format&fit=crop",
    price: 4295,
    stock: 22,
    category: "mice",
    tags: ["ergonomic", "esports", "wired"],
  },
  {
    name: "HyperX QuadCast S",
    description:
      "USB condenser microphone with dynamic RGB lighting, built-in anti-vibration shock mount, tap-to-mute sensor, and four polar patterns. Broadcast-grade sound for streaming, podcasts, and crystal-clear comms.",
    img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80&auto=format&fit=crop",
    price: 8250,
    stock: 9,
    category: "streaming",
    tags: ["microphone", "usb", "rgb"],
  },
  {
    name: "Logitech G733 Lightspeed",
    description:
      "Colorful 278g wireless gaming headset with LIGHTSPEED low-latency connection, Blue VO!CE mic filters, dual-layer memory foam, and up to 29 hours of play. Suspension headband keeps it light through long ranked grinds.",
    img: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=800&q=80&auto=format&fit=crop",
    price: 7495,
    stock: 16,
    category: "headsets",
    tags: ["wireless", "lightweight", "rgb"],
  },
  {
    name: "Glorious Model O 2 Wireless",
    description:
      "Honeycomb icon reborn: 68g wireless gaming mouse with the BAMF 2.0 26K sensor, motion sync, 110-hour battery life, and 100% PTFE skates. Ambidextrous shape that flicks as fast as you do.",
    img: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=800&q=80&auto=format&fit=crop",
    price: 3995,
    stock: 4,
    category: "mice",
    tags: ["wireless", "lightweight", "honeycomb"],
  },
  {
    name: "SteelSeries QcK Heavy XXL",
    description:
      "900 x 400 x 4mm thick cloth mousepad with a micro-woven surface tuned for optical sensors and a non-slip rubber base that swallows desk wobble. The mat that esports legends have used for two decades.",
    img: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80&auto=format&fit=crop",
    price: 1495,
    stock: 40,
    category: "accessories",
    tags: ["mousepad", "xxl", "cloth"],
  },
];

async function seed() {
  const uri = process.env.MONGODB_STRING;
  if (!uri) {
    console.error("MONGODB_STRING is required in server/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@aster.dev";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin1234!";

  let admin = await Users.findOne({ email: adminEmail });
  if (!admin) {
    admin = new Users({
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      isAdmin: true,
    });
    await admin.save();
    console.log(`Admin created: ${adminEmail}`);
  } else {
    console.log(`Admin exists: ${adminEmail}`);
  }

  let created = 0;
  let existing = 0;
  for (const item of DEMO_PRODUCTS) {
    const result = await Product.updateOne(
      { name: item.name },
      { $setOnInsert: item },
      { upsert: true }
    );
    if (result.upsertedCount) {
      created += 1;
      console.log(`Product created: ${item.name}`);
    } else {
      existing += 1;
    }
  }
  console.log(
    `Products: ${created} created, ${existing} already present (${DEMO_PRODUCTS.length} total in catalog seed).`
  );

  console.log("\nSeed complete. Admin login:", adminEmail);
  console.log("Set SEED_ADMIN_PASSWORD in .env to customize the password.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
