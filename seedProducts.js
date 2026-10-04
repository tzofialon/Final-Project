// קובץ Seed - משמש להכנסה חד-פעמית של כל 51 המוצרים ל-MongoDB.
// לאחר הכנסת המוצרים, האתר שולף אותם ישירות ממסד הנתונים.

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: Number,
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String
});

const Product = mongoose.model("Product", productSchema);

const products = [

    // ==============================
    // Technological fashion - 1-11
    // ==============================

    {
        productId: 1,
        name: "Baseball cap",
        price: 120,
        category: "Technological fashion",
        description: "The baseball cap with a pattern of electric circuits",
        image: "images/Technological fashion/baseballcap.jpg"
    },
    {
        productId: 2,
        name: "Technological bomber jacket",
        price: 360,
        category: "Technological fashion",
        description: "A technological bomber jacket with a design of glowing electric circuits on the sleeves",
        image: "images/Technological fashion/Bomberjacket.jpg"
    },
    {
        productId: 3,
        name: "Hoodie",
        price: 450,
        category: "Technological fashion",
        description: "Hoodie with the inscription \"404: Sleep Not Found\"",
        image: "images/Technological fashion/hoodie.jpg"
    },
    {
        productId: 4,
        name: "Jacket",
        price: 370,
        category: "Technological fashion",
        description: "Jacket with the inscription \"Always in Beta\"",
        image: "images/Technological fashion/jacket.jpg"
    },
    {
        productId: 5,
        name: "Long t-shirt",
        price: 230,
        category: "Technological fashion",
        description: "Long t-shirt with the inscription \"I Code\", in a modern design with subtle technological patterns on the sleeves and a pleasant color combination.",
        image: "images/Technological fashion/longt-shirt.jpg"
    },
    {
        productId: 6,
        name: "Polo shirt",
        price: 360,
        category: "Technological fashion",
        description: "Polo shirt with a logo of a small computer chip embroidered on the chest, in vivid and modern colors.",
        image: "images/Technological fashion/polo.jpg"
    },
    {
        productId: 7,
        name: "Winter scarf",
        price: 420,
        category: "Technological fashion",
        description: "A winter scarf, with prints of code and electric circuits in warm colors like dark blue and burgundy, and in a thick and cozy design suitable for cold weather",
        image: "images/Technological fashion/scarf.jpg"
    },
    {
        productId: 8,
        name: "Socks",
        price: 90,
        category: "Technological fashion",
        description: "Colorful socks with designs of keyboards and technological components.",
        image: "images/Technological fashion/Socks.jpg"
    },
    {
        productId: 9,
        name: "Sweatpants",
        price: 160,
        category: "Technological fashion",
        description: "The sweatpants with binary code decoration on the sides.",
        image: "images/Technological fashion/Sweatpants.jpg"
    },
    {
        productId: 10,
        name: "T-shirt",
        price: 230,
        category: "Technological fashion",
        description: "T-shirt with the inscription \"Eat, Sleep, Code, Repeat\"",
        image: "images/Technological fashion/T-shirt.jpg"
    },
    {
        productId: 11,
        name: "Black t-shirt",
        price: 250,
        category: "Technological fashion",
        description: "Black t-shirt with the inscription \"I Write Code, Not Excuses\" and a design that includes a keyboard and small pieces of code",
        image: "images/Technological fashion/Tsh3.jpg"
    },

    // =================================
    // Equipment and accessories - 12-22
    // =================================

    {
        productId: 12,
        name: "Backpack",
        price: 150,
        category: "Equipment and accessories",
        description: "A fashionable backpack with a minimalistic design of a printed electrical circuit and the inscription \"Code and Carry\".",
        image: "images/Equipment and accessories/backbag.jpg"
    },
    {
        productId: 13,
        name: "Backpack2",
        price: 200,
        category: "Equipment and accessories",
        description: "A backpack in a technological design with the inscription \"Debug & Deploy\" and a combination of electrical circuit samples.",
        image: "images/Equipment and accessories/backpacktechnologicaldesign.jpg"
    },
    {
        productId: 14,
        name: "Key holder",
        price: 70,
        category: "Equipment and accessories",
        description: "The key holder has a motherboard design, with intricate details of printed circuits and metallic looking components",
        image: "images/Equipment and accessories/keyholder.jpg"
    },
    {
        productId: 15,
        name: "Laptop cover",
        price: 170,
        category: "Equipment and accessories",
        description: "Laptop cover with a spectacular design of electric circuits in shades of neon blue, green and black for a futuristic look",
        image: "images/Equipment and accessories/Laptopcover.jpg"
    },
    {
        productId: 16,
        name: "Charger cover",
        price: 130,
        category: "Equipment and accessories",
        description: "Computer chip design charger cover, with details of electric circuits and metallic accents.",
        image: "images/Equipment and accessories/luggagecover.jpg"
    },
    {
        productId: 17,
        name: "Ergonomic mouse",
        price: 100,
        category: "Equipment and accessories",
        description: "Ergonomic mouse with a colorful code pattern that combines shades of neon blue, green and orange",
        image: "images/Equipment and accessories/mouse.jpg"
    },
    {
        productId: 18,
        name: "Notebook",
        price: 60,
        category: "Equipment and accessories",
        description: "A notebook in the design of an old computer with a retro look and a motivational inscription on the cover.",
        image: "images/Equipment and accessories/notebook.jpg"
    },
    {
        productId: 19,
        name: "Phone stand",
        price: 120,
        category: "Equipment and accessories",
        description: "Phone stand in the form of a hardware component, with polished metallic elements and subtle reliefs of electrical circuits.",
        image: "images/Equipment and accessories/Phonestand.jpg"
    },
    {
        productId: 20,
        name: "Side bag",
        price: 240,
        category: "Equipment and accessories",
        description: "The side bag with the inscription \"Code & Go\" in a minimalist and modern design.",
        image: "images/Equipment and accessories/sidebag.jpg"
    },
    {
        productId: 21,
        name: "Smart water bottle",
        price: 260,
        category: "Equipment and accessories",
        description: "A smart water bottle with a digital time display and a modern design, including touches of bright blue and silver.",
        image: "images/Equipment and accessories/Smartwaterbottle.jpg"
    },
    {
        productId: 22,
        name: "Futuristic table organizer",
        price: 290,
        category: "Equipment and accessories",
        description: "Futuristic table organizer in the design of a mini-server, with compartments for pens, notes and gadgets.",
        image: "images/Equipment and accessories/tableorganizer.jpg"
    },

    // ==========================================
    // Design items for the home office - 23-32
    // ==========================================

    {
        productId: 23,
        name: "Coasters for cups",
        price: 140,
        category: "Design items for the home office",
        description: "Coasters for cups in a chip design, with patterns of electric circuits and metallic finishes.",
        image: "images/Design items for the home office/Coasterscups.jpg"
    },
    {
        productId: 24,
        name: "Desktop organizer",
        price: 250,
        category: "Design items for the home office",
        description: "A desktop organizer with a pattern of electric circuits, which includes different compartments for stationery items.",
        image: "images/Design items for the home office/Deskorganizer2.jpg"
    },
    {
        productId: 25,
        name: "Digital wall clock",
        price: 330,
        category: "Design items for the home office",
        description: "A digital wall clock in a technological design, with luminous numbers and delicate electrical circuit patterns",
        image: "images/Design items for the home office/Digitalwallclock.jpg"
    },
    {
        productId: 26,
        name: "Mouse pad",
        price: 90,
        category: "Design items for the home office",
        description: "A mouse pad with running code graphics, on a dark background and a modern look.",
        image: "images/Design items for the home office/Mousepad.jpg"
    },
    {
        productId: 27,
        name: "Bulletin board",
        price: 360,
        category: "Design items for the home office",
        description: "Binary code design bulletin board, with metallic touches and vivid colors",
        image: "images/Design items for the home office/noticeboard.jpg"
    },
    {
        productId: 28,
        name: "Pen stand",
        price: 150,
        category: "Design items for the home office",
        description: "Pen stand in the shape of a computer processor, with precise details of circuits and a modern design",
        image: "images/Design items for the home office/penstand.jpg"
    },
    {
        productId: 29,
        name: "Decorative pillow",
        price: 240,
        category: "Design items for the home office",
        description: "Decorative pillow with the inscription \"Think Like a Coder\", in a technological design with circle patterns in the background",
        image: "images/Design items for the home office/pillow.jpg"
    },
    {
        productId: 30,
        name: "Poster",
        price: 80,
        category: "Design items for the home office",
        description: "A poster with the inscription \"Keep Calm and Debug On\", in a technological design with examples of electric circuits",
        image: "images/Design items for the home office/poster.jpg"
    },
    {
        productId: 31,
        name: "Set of bookends",
        price: 320,
        category: "Design items for the home office",
        description: "A set of futuristic circuit board design bookends, with intricate details and metallic finishes",
        image: "images/Design items for the home office/setofbookends.jpg"
    },
    {
        productId: 32,
        name: "Desk lamp",
        price: 420,
        category: "Design items for the home office",
        description: "A desk lamp in a motherboard design, with examples of electrical circuits and glowing LED lighting",
        image: "images/Design items for the home office/tablelamp.jpg"
    },

    // =========================
    // Advanced gadgets - 33-42
    // =========================

    {
        productId: 33,
        name: "Bluetooth adapter",
        price: 350,
        category: "Advanced gadgets",
        description: "A small Bluetooth adapter with a modern design intended for old devices such as televisions, with LED lighting and a metallic finish",
        image: "images/Advanced gadgets/Bluetooth.jpg"
    },
    {
        productId: 34,
        name: "Ergonomic mouse2",
        price: 370,
        category: "Advanced gadgets",
        description: "Ergonomic mouse with buttons adapted to games, in a futuristic design with glowing LED lighting",
        image: "images/Advanced gadgets/Ergonomicmouse.jpg"
    },
    {
        productId: 35,
        name: "Smart LED lamp",
        price: 440,
        category: "Advanced gadgets",
        description: "A smart LED lamp in the design of electric circuits, with adjustable lighting in different colors and control via touch or an app",
        image: "images/Advanced gadgets/LED.jpg"
    },
    {
        productId: 36,
        name: "Mechanical keyboard",
        price: 560,
        category: "Advanced gadgets",
        description: "A small mechanical keyboard with a unique design inspired by binary code, with custom RGB lighting and a futuristic look.",
        image: "images/Advanced gadgets/Mechanicalkeyboard.jpg"
    },
    {
        productId: 37,
        name: "Smart pen",
        price: 370,
        category: "Advanced gadgets",
        description: "A smart pen with advanced functions such as automatic translation and erasing digital handwriting, in a modern design with bright LEDs",
        image: "images/Advanced gadgets/smartpen.jpg"
    },
    {
        productId: 38,
        name: "Smart speaker",
        price: 530,
        category: "Advanced gadgets",
        description: "A small smart speaker in the design of a computer chip, with examples of electric circuits and glowing LED lighting",
        image: "images/Advanced gadgets/Smartspeaker.jpg"
    },
    {
        productId: 39,
        name: "Smart watch",
        price: 670,
        category: "Advanced gadgets",
        description: "A smart watch with a customized interface for programming and task management, in a modern and technological design.",
        image: "images/Advanced gadgets/smartwatch.jpg"
    },
    {
        productId: 40,
        name: "Wireless charger",
        price: 490,
        category: "Advanced gadgets",
        description: "The wireless charger with RGB lighting in the design of electric circuits",
        image: "images/Advanced gadgets/thewirelesscharger.jpg"
    },
    {
        productId: 41,
        name: "Webcam",
        price: 620,
        category: "Advanced gadgets",
        description: "The webcam with a custom frame that can be printed in 3D, in a compact and modern design.",
        image: "images/Advanced gadgets/webcam.jpg"
    },
    {
        productId: 42,
        name: "Wireless headphones",
        price: 350,
        category: "Advanced gadgets",
        description: "Wireless headphones in a technological design with glowing LED lighting and a futuristic look",
        image: "images/Advanced gadgets/Wirelessheadphones.jpg"
    },

    // ==================================
    // Gifts and personal products - 43-51
    // ==================================

    {
        productId: 43,
        name: "Calendar",
        price: 190,
        category: "Gifts and personal products",
        description: "A modern calendar that includes special dates for the tech community, like Pai Day, with tech-inspired graphic designs.",
        image: "images/Gifts and personal products/calendar.jpg"
    },
    {
        productId: 44,
        name: "Gift box",
        price: 690,
        category: "Gifts and personal products",
        description: "A gift box with the inscription \"For the Best Developer\" in an elegant and modern design, which includes technological items inside",
        image: "images/Gifts and personal products/giftbox.jpg"
    },
    {
        productId: 45,
        name: "Personal key ring",
        price: 280,
        category: "Gifts and personal products",
        description: "A personal key ring with a QR engraving that leads to a hidden message, in a modern, technologically inspired metallic design",
        image: "images/Gifts and personal products/Personalkeychain.jpg"
    },
    {
        productId: 46,
        name: "Set pillows",
        price: 610,
        category: "Gifts and personal products",
        description: "A set of decorative pillows with funny tech phrases, like \"Debugging is My Cardio,\" and code-inspired patterns",
        image: "images/Gifts and personal products/Pillowset.jpg"
    },
    {
        productId: 47,
        name: "Set of phone screen protectors",
        price: 250,
        category: "Gifts and personal products",
        description: "A set of phone screen protectors with custom designs, such as electrical circuit patterns or binary code",
        image: "images/Gifts and personal products/Setofscreenprotectors.jpg"
    },
    {
        productId: 48,
        name: "Set of wall stickers",
        price: 50,
        category: "Gifts and personal products",
        description: "A set of wall stickers with technological motifs such as examples of electric circuits and binary code, in a modern and colorful design",
        image: "images/Gifts and personal products/setofwallstickers.jpg"
    },
    {
        productId: 49,
        name: "Insulated water bottle",
        price: 270,
        category: "Gifts and personal products",
        description: "Insulated water bottle with a digital temperature display on the lid, in a metallic and modern design",
        image: "images/Gifts and personal products/smartB.jpg"
    },
    {
        productId: 50,
        name: "Smart coffee mug",
        price: 180,
        category: "Gifts and personal products",
        description: "A smart coffee mug with a built-in temperature control system, in a modern design with a digital display",
        image: "images/Gifts and personal products/Smartcoffeemug.jpg"
    },
    {
        productId: 51,
        name: "Smart notebook",
        price: 780,
        category: "Gifts and personal products",
        description: "A smart notebook for multiple use with an erasing function, in a modern, technologically inspired design. The notebook includes a smart pen for digital storage",
        image: "images/Gifts and personal products/Smartnotebook.jpg"
    }
];

async function seedProducts() {
    try {

        await mongoose.connect(
"mongodb+srv://yohananagosa092_db_user:yohananagosa9@cluster0.8bixhhu.mongodb.net/?appName=Cluster0",         {
                dbName: "techgeek"
            }
        );

        console.log("Connected to MongoDB");

        // Delete the old products first so we do not create duplicates
        await Product.deleteMany({});

        // Insert the complete store
        await Product.insertMany(products);

        console.log("51 products added successfully");

        await mongoose.connection.close();

    } catch (error) {

        console.log("Error seeding products:", error);

        await mongoose.connection.close();
    }
}

seedProducts();