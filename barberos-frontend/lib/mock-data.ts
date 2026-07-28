// BarberOS — Complete Mock Data

export const mockStats = {
  todayRevenue: 1284.50,
  weeklyRevenue: 8642.00,
  monthlyRevenue: 34850.00,
  totalBookings: 47,
  completedToday: 31,
  pendingToday: 8,
  cancelledToday: 3,
  newClientsThisMonth: 124,
  returningClients: 68,
  avgServiceValue: 42.80,
};

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C9A84C&color=fff&size=80`;
}

export const mockBarbers = [
  { id: 1, name: "James Okafor", avatar: avatarUrl("James Okafor"), specialty: "Classic Cuts & Fades", specialties: ["Classic Cuts", "Skin Fades", "Designs"], rating: 4.9, bookings: 18, revenue: 642, status: "active", color: "#C9A84C", phone: "+44 7700 900101", email: "james@barberos.io", languages: ["English", "Yoruba"], bio: "8 years of precision barbering. Specialises in textured hair and skin fades.", nextAvailable: "2:30pm today" },
  { id: 2, name: "Mohammed Al-Rashid", avatar: avatarUrl("Mohammed Al-Rashid"), specialty: "Beard Sculpting", specialties: ["Beard Sculpting", "Hot Towel Shave", "Hair Colour"], rating: 4.8, bookings: 15, revenue: 480, status: "active", color: "#6366f1", phone: "+44 7700 900202", email: "mohammed@barberos.io", languages: ["English", "Arabic"], bio: "Certified master barber with expertise in Middle Eastern grooming traditions.", nextAvailable: "3:00pm today" },
  { id: 3, name: "Carlos Mendes", avatar: avatarUrl("Carlos Mendes"), specialty: "Skin Fades & Designs", specialties: ["Skin Fades", "Hair Designs", "Junior Cuts"], rating: 4.7, bookings: 12, revenue: 398, status: "break", color: "#10b981", phone: "+44 7700 900303", email: "carlos@barberos.io", languages: ["English", "Portuguese"], bio: "Creative barber known for intricate hair designs and clean fades.", nextAvailable: "4:15pm today" },
  { id: 4, name: "Ethan Clarke", avatar: avatarUrl("Ethan Clarke"), specialty: "Hair Colouring", specialties: ["Hair Colour", "Highlights", "Bleach"], rating: 4.6, bookings: 10, revenue: 320, status: "active", color: "#f59e0b", phone: "+44 7700 900404", email: "ethan@barberos.io", languages: ["English"], bio: "Colour specialist trained in balayage and modern toning techniques.", nextAvailable: "Now" },
  { id: 5, name: "Sofia Chen", avatar: avatarUrl("Sofia Chen"), specialty: "Colour & Highlights", specialties: ["Highlights", "Eyebrow Threading", "Junior Cuts"], rating: 4.5, bookings: 8, revenue: 248, status: "active", color: "#EC4899", phone: "+44 7700 900505", email: "sofia@barberos.io", languages: ["English", "Mandarin"], bio: "Versatile stylist specialising in colour work and precision cuts.", nextAvailable: "1:45pm today" },
  { id: 6, name: "Alex Turner", avatar: avatarUrl("Alex Turner"), specialty: "Classic & Contemporary", specialties: ["Classic Haircut", "Beard Trim", "Hot Towel Shave"], rating: 4.4, bookings: 6, revenue: 192, status: "inactive", color: "#8B5CF6", phone: "+44 7700 900606", email: "alex@barberos.io", languages: ["English", "French"], bio: "Traditional barber with a modern twist, passionate about the craft.", nextAvailable: "Unavailable today" },
];

export const mockAddons = [
  { id: 1, name: "Hot Towel Finish", extraPrice: 5, extraDuration: 10, description: "Relaxing hot towel treatment to soothe skin" },
  { id: 2, name: "Beard Oil Treatment", extraPrice: 8, extraDuration: 5, description: "Premium beard oil applied after trim" },
  { id: 3, name: "Scalp Massage", extraPrice: 10, extraDuration: 15, description: "Deep scalp massage to stimulate hair growth" },
  { id: 4, name: "Face Mask", extraPrice: 12, extraDuration: 20, description: "Hydrating face mask for post-shave care" },
  { id: 5, name: "Eyebrow Trim", extraPrice: 6, extraDuration: 10, description: "Precision eyebrow shaping and trim" },
  { id: 6, name: "Neck Shave", extraPrice: 4, extraDuration: 5, description: "Clean neck line shave with straight razor" },
];

export const mockServices = [
  { id: 1, name: "Classic Haircut", duration: 30, price: 25, category: "Hair", bookings: 145, description: "Clean, precise haircut tailored to your style", icon: "✂️", addonIds: [1, 3, 5, 6] },
  { id: 2, name: "Skin Fade", duration: 45, price: 32, category: "Hair", bookings: 128, description: "Seamless skin-to-length fade with precision blend", icon: "✂️", addonIds: [1, 3, 6] },
  { id: 3, name: "Beard Trim", duration: 20, price: 18, category: "Beard", bookings: 96, description: "Shape and trim for a clean, defined beard", icon: "🧔", addonIds: [2, 4, 5] },
  { id: 4, name: "Full Groom Package", duration: 75, price: 55, category: "Package", bookings: 87, description: "Haircut + beard + hot towel — the complete experience", icon: "⭐", addonIds: [1, 2, 3, 4, 5, 6] },
  { id: 5, name: "Hot Towel Shave", duration: 30, price: 28, category: "Shave", bookings: 64, description: "Traditional straight razor shave with hot towel prep", icon: "🪒", addonIds: [2, 4, 6] },
  { id: 6, name: "Junior Cut", duration: 25, price: 16, category: "Kids", bookings: 53, description: "Haircut for children under 12 years old", icon: "👦", addonIds: [1, 3] },
  { id: 7, name: "Hair Colour", duration: 90, price: 65, category: "Colour", bookings: 41, description: "Full colour, highlights, or toning by our specialists", icon: "🎨", addonIds: [3, 4] },
  { id: 8, name: "Eyebrow Thread", duration: 15, price: 12, category: "Hair", bookings: 38, description: "Precise eyebrow threading for clean, defined arches", icon: "✨", addonIds: [4, 5] },
];

export const mockAppointments = [
  { id: 1, client: "Daniel Thompson", clientPhone: "+44 7700 900123", barber: "James Okafor", barberId: 1, service: "Skin Fade", addons: ["Hot Towel Finish"], date: "2026-04-12", time: "09:00", duration: 55, status: "completed", amount: 37, notes: "Prefers very low fade on sides" },
  { id: 2, client: "Amir Hassan", clientPhone: "+44 7700 900456", barber: "Mohammed Al-Rashid", barberId: 2, service: "Full Groom Package", addons: ["Beard Oil Treatment"], date: "2026-04-12", time: "09:30", duration: 80, status: "in-progress", amount: 63, notes: "" },
  { id: 3, client: "Tyler Brooks", clientPhone: "+44 7700 900789", barber: "Carlos Mendes", barberId: 3, service: "Classic Haircut", addons: [], date: "2026-04-12", time: "10:00", duration: 30, status: "confirmed", amount: 25, notes: "" },
  { id: 4, client: "Ryan Foster", clientPhone: "+44 7700 901234", barber: "Ethan Clarke", barberId: 4, service: "Hair Colour", addons: ["Scalp Massage"], date: "2026-04-12", time: "10:15", duration: 105, status: "confirmed", amount: 75, notes: "First time colour — going lighter" },
  { id: 5, client: "Lucas White", clientPhone: "+44 7700 901567", barber: "James Okafor", barberId: 1, service: "Beard Trim", addons: [], date: "2026-04-12", time: "11:00", duration: 20, status: "pending", amount: 18, notes: "" },
  { id: 6, client: "Noah Patel", clientPhone: "+44 7700 901890", barber: "Mohammed Al-Rashid", barberId: 2, service: "Hot Towel Shave", addons: ["Face Mask"], date: "2026-04-12", time: "11:30", duration: 50, status: "pending", amount: 40, notes: "Sensitive skin" },
  { id: 7, client: "Finn Murphy", clientPhone: "+44 7700 902123", barber: "Carlos Mendes", barberId: 3, service: "Junior Cut", addons: [], date: "2026-04-12", time: "12:00", duration: 25, status: "pending", amount: 16, notes: "Age 8" },
  { id: 8, client: "Sam Cooper", clientPhone: "+44 7700 902456", barber: "James Okafor", barberId: 1, service: "Hair Colour", addons: [], date: "2026-04-12", time: "13:00", duration: 90, status: "confirmed", amount: 65, notes: "" },
  { id: 9, client: "Oliver King", clientPhone: "+44 7700 902789", barber: "Sofia Chen", barberId: 5, service: "Eyebrow Thread", addons: ["Face Mask"], date: "2026-04-12", time: "14:00", duration: 35, status: "confirmed", amount: 24, notes: "" },
  { id: 10, client: "Benjamin Shaw", clientPhone: "+44 7700 903012", barber: "Ethan Clarke", barberId: 4, service: "Skin Fade", addons: ["Hot Towel Finish", "Neck Shave"], date: "2026-04-12", time: "14:30", duration: 60, status: "confirmed", amount: 41, notes: "Regulars gets 10% off" },
  { id: 11, client: "Jayden Morris", clientPhone: "+44 7700 903345", barber: "James Okafor", barberId: 1, service: "Classic Haircut", addons: [], date: "2026-04-11", time: "09:00", duration: 30, status: "completed", amount: 25, notes: "" },
  { id: 12, client: "Marcus Davis", clientPhone: "+44 7700 903678", barber: "Mohammed Al-Rashid", barberId: 2, service: "Beard Trim", addons: ["Beard Oil Treatment"], date: "2026-04-11", time: "10:00", duration: 25, status: "completed", amount: 26, notes: "" },
  { id: 13, client: "Kai Nakamura", clientPhone: "+44 7700 903901", barber: "Carlos Mendes", barberId: 3, service: "Skin Fade", addons: [], date: "2026-04-11", time: "11:00", duration: 45, status: "cancelled", amount: 32, notes: "Client no-showed" },
  { id: 14, client: "Leo Russo", clientPhone: "+44 7700 904123", barber: "Ethan Clarke", barberId: 4, service: "Full Groom Package", addons: ["Scalp Massage"], date: "2026-04-11", time: "13:00", duration: 90, status: "completed", amount: 65, notes: "" },
  { id: 15, client: "Harry Wilson", clientPhone: "+44 7700 904456", barber: "Sofia Chen", barberId: 5, service: "Junior Cut", addons: [], date: "2026-04-11", time: "14:30", duration: 25, status: "no-show", amount: 16, notes: "" },
  { id: 16, client: "Zach Evans", clientPhone: "+44 7700 904789", barber: "James Okafor", barberId: 1, service: "Hot Towel Shave", addons: ["Face Mask"], date: "2026-04-10", time: "10:00", duration: 50, status: "completed", amount: 40, notes: "" },
  { id: 17, client: "Ian Fraser", clientPhone: "+44 7700 905012", barber: "Mohammed Al-Rashid", barberId: 2, service: "Classic Haircut", addons: ["Neck Shave"], date: "2026-04-10", time: "11:00", duration: 35, status: "completed", amount: 29, notes: "" },
  { id: 18, client: "Ravi Singh", clientPhone: "+44 7700 905345", barber: "Alex Turner", barberId: 6, service: "Beard Trim", addons: [], date: "2026-04-10", time: "12:00", duration: 20, status: "completed", amount: 18, notes: "" },
  { id: 19, client: "Tom Hughes", clientPhone: "+44 7700 905678", barber: "Carlos Mendes", barberId: 3, service: "Hair Colour", addons: [], date: "2026-04-10", time: "13:30", duration: 90, status: "cancelled", amount: 65, notes: "Rescheduled to next week" },
  { id: 20, client: "Dan Walsh", clientPhone: "+44 7700 905901", barber: "Ethan Clarke", barberId: 4, service: "Eyebrow Thread", addons: [], date: "2026-04-10", time: "15:00", duration: 15, status: "completed", amount: 12, notes: "" },
  { id: 21, client: "Mike Stone", clientPhone: "+44 7700 906123", barber: "James Okafor", barberId: 1, service: "Skin Fade", addons: ["Hot Towel Finish"], date: "2026-04-09", time: "09:30", duration: 55, status: "completed", amount: 37, notes: "" },
  { id: 22, client: "Chris Hall", clientPhone: "+44 7700 906456", barber: "Sofia Chen", barberId: 5, service: "Classic Haircut", addons: [], date: "2026-04-09", time: "10:30", duration: 30, status: "completed", amount: 25, notes: "" },
  { id: 23, client: "Jake Scott", clientPhone: "+44 7700 906789", barber: "Mohammed Al-Rashid", barberId: 2, service: "Full Groom Package", addons: [], date: "2026-04-09", time: "12:00", duration: 75, status: "completed", amount: 55, notes: "" },
  { id: 24, client: "Matt Price", clientPhone: "+44 7700 907012", barber: "Alex Turner", barberId: 6, service: "Hot Towel Shave", addons: [], date: "2026-04-08", time: "11:00", duration: 30, status: "completed", amount: 28, notes: "" },
  { id: 25, client: "Sam Carter", clientPhone: "+44 7700 907345", barber: "Carlos Mendes", barberId: 3, service: "Junior Cut", addons: [], date: "2026-04-08", time: "14:00", duration: 25, status: "confirmed", amount: 16, notes: "" },
];

export const mockRevenueData = [
  { day: "Mon", revenue: 1240, bookings: 28 },
  { day: "Tue", revenue: 980, bookings: 22 },
  { day: "Wed", revenue: 1540, bookings: 34 },
  { day: "Thu", revenue: 1280, bookings: 29 },
  { day: "Fri", revenue: 1820, bookings: 41 },
  { day: "Sat", revenue: 2240, bookings: 52 },
  { day: "Sun", revenue: 1640, bookings: 38 },
];

export const mockMonthlyRevenue = [
  { month: "Oct", revenue: 28400 },
  { month: "Nov", revenue: 31200 },
  { month: "Dec", revenue: 36800 },
  { month: "Jan", revenue: 29600 },
  { month: "Feb", revenue: 32100 },
  { month: "Mar", revenue: 34850 },
];

export const mockTenants = [
  {
    id: 1, name: "The Gentleman's Quarter", owner: "Robert Williams", plan: "Business", branches: 3, staff: 12, status: "active", mrr: 149, revenue: 8420, joined: "2024-01-15",
    domain: "gentlemans-quarter.barberos.io", phone: "+44 20 7946 0201", email: "info@gentlemans-quarter.com",
    invoices: [
      { id: "INV-001", date: "2026-04-01", amount: 149, status: "paid" },
      { id: "INV-002", date: "2026-03-01", amount: 149, status: "paid" },
      { id: "INV-003", date: "2026-02-01", amount: 149, status: "paid" },
    ],
    usage: { bookingsThisMonth: 312, storageGB: 4.2, apiCallsToday: 1840 },
    branding: { primaryColor: "#C9A84C", logo: null, font: "Inter" },
  },
  {
    id: 2, name: "Blade & Thread", owner: "Marcus Johnson", plan: "Professional", branches: 1, staff: 5, status: "active", mrr: 79, revenue: 3240, joined: "2024-02-20",
    domain: "blade-thread.barberos.io", phone: "+44 20 7946 0202", email: "hello@bladethread.com",
    invoices: [
      { id: "INV-011", date: "2026-04-01", amount: 79, status: "paid" },
      { id: "INV-012", date: "2026-03-01", amount: 79, status: "paid" },
      { id: "INV-013", date: "2026-02-01", amount: 79, status: "overdue" },
    ],
    usage: { bookingsThisMonth: 124, storageGB: 1.8, apiCallsToday: 620 },
    branding: { primaryColor: "#6366f1", logo: null, font: "Inter" },
  },
  {
    id: 3, name: "Sharp Cut Barbershop", owner: "Ahmed Malik", plan: "Starter", branches: 1, staff: 3, status: "trial", mrr: 0, revenue: 0, joined: "2024-03-10",
    domain: "sharp-cut.barberos.io", phone: "+44 20 7946 0203", email: "ahmed@sharpcutbarbers.com",
    invoices: [],
    usage: { bookingsThisMonth: 28, storageGB: 0.3, apiCallsToday: 90 },
    branding: { primaryColor: "#10b981", logo: null, font: "Inter" },
  },
  {
    id: 4, name: "The Urban Barber Co.", owner: "Jake Sterling", plan: "Professional", branches: 2, staff: 8, status: "active", mrr: 79, revenue: 5680, joined: "2024-01-28",
    domain: "urban-barber.barberos.io", phone: "+44 20 7946 0204", email: "contact@urbanbarberco.com",
    invoices: [
      { id: "INV-021", date: "2026-04-01", amount: 79, status: "paid" },
      { id: "INV-022", date: "2026-03-01", amount: 79, status: "paid" },
      { id: "INV-023", date: "2026-02-01", amount: 79, status: "paid" },
    ],
    usage: { bookingsThisMonth: 198, storageGB: 2.6, apiCallsToday: 980 },
    branding: { primaryColor: "#f59e0b", logo: null, font: "Plus Jakarta Sans" },
  },
  {
    id: 5, name: "Prestige Cuts", owner: "Damon Wright", plan: "Business", branches: 4, staff: 16, status: "active", mrr: 149, revenue: 11200, joined: "2023-11-05",
    domain: "prestige-cuts.barberos.io", phone: "+44 20 7946 0205", email: "damon@prestigecuts.com",
    invoices: [
      { id: "INV-031", date: "2026-04-01", amount: 149, status: "paid" },
      { id: "INV-032", date: "2026-03-01", amount: 149, status: "paid" },
      { id: "INV-033", date: "2026-02-01", amount: 149, status: "paid" },
    ],
    usage: { bookingsThisMonth: 520, storageGB: 8.1, apiCallsToday: 2310 },
    branding: { primaryColor: "#EC4899", logo: null, font: "Geist" },
  },
  {
    id: 6, name: "Local Lads Barbers", owner: "Tommy Nash", plan: "Starter", branches: 1, staff: 2, status: "suspended", mrr: 29, revenue: 840, joined: "2024-02-14",
    domain: "local-lads.barberos.io", phone: "+44 20 7946 0206", email: "tommy@locallads.com",
    invoices: [
      { id: "INV-041", date: "2026-03-01", amount: 29, status: "failed" },
      { id: "INV-042", date: "2026-02-01", amount: 29, status: "paid" },
      { id: "INV-043", date: "2026-01-01", amount: 29, status: "paid" },
    ],
    usage: { bookingsThisMonth: 0, storageGB: 0.5, apiCallsToday: 0 },
    branding: { primaryColor: "#8B5CF6", logo: null, font: "Inter" },
  },
];

export const mockProducts = [
  { id: 1, name: "American Crew Pomade", sku: "AC-PM-01", price: 18.99, cost: 8.50, stock: 42, category: "Styling", sold: 28 },
  { id: 2, name: "Proraso Shaving Cream", sku: "PR-SC-02", price: 14.99, cost: 6.20, stock: 18, category: "Shaving", sold: 35 },
  { id: 3, name: "Beardbrand Oil", sku: "BB-OL-03", price: 24.99, cost: 11.00, stock: 7, category: "Beard", sold: 19, lowStock: true },
  { id: 4, name: "Matte Clay Wax", sku: "MC-WX-04", price: 16.99, cost: 7.40, stock: 31, category: "Styling", sold: 44 },
  { id: 5, name: "Hair Tonic Spray", sku: "HT-SP-05", price: 12.49, cost: 4.80, stock: 3, category: "Treatment", sold: 22, lowStock: true },
  { id: 6, name: "Sea Salt Spray", sku: "SS-SP-06", price: 13.99, cost: 5.60, stock: 24, category: "Styling", sold: 31 },
  { id: 7, name: "Aftershave Balm", sku: "AB-BL-07", price: 19.99, cost: 8.80, stock: 15, category: "Shaving", sold: 18 },
  { id: 8, name: "Pomade Shine Wax", sku: "PS-WX-08", price: 15.49, cost: 6.10, stock: 29, category: "Styling", sold: 27 },
];

export const mockClients = [
  { id: 1, name: "Daniel Thompson", email: "d.thompson@email.com", phone: "+44 7700 900123", visits: 24, spent: 768, lastVisit: "2026-04-10", status: "vip", loyaltyPoints: 384, favouriteService: "Skin Fade", notes: "Prefers James. Always books skin fade. Allergic to certain fragrances.", blacklisted: false },
  { id: 2, name: "Amir Hassan", email: "a.hassan@email.com", phone: "+44 7700 900456", visits: 18, spent: 612, lastVisit: "2026-04-12", status: "regular", loyaltyPoints: 220, favouriteService: "Full Groom Package", notes: "Very polite. Good tipper.", blacklisted: false },
  { id: 3, name: "Tyler Brooks", email: "t.brooks@email.com", phone: "+44 7700 900789", visits: 12, spent: 384, lastVisit: "2026-04-08", status: "regular", loyaltyPoints: 160, favouriteService: "Classic Haircut", notes: "", blacklisted: false },
  { id: 4, name: "Ryan Foster", email: "r.foster@email.com", phone: "+44 7700 901234", visits: 6, spent: 192, lastVisit: "2026-02-28", status: "new", loyaltyPoints: 80, favouriteService: "Hair Colour", notes: "Came in for colour last time. Very happy with result.", blacklisted: false },
  { id: 5, name: "Lucas White", email: "l.white@email.com", phone: "+44 7700 901567", visits: 31, spent: 980, lastVisit: "2026-04-11", status: "vip", loyaltyPoints: 490, favouriteService: "Beard Trim", notes: "VIP client. Bi-weekly appointments.", blacklisted: false },
  { id: 6, name: "Oliver King", email: "o.king@email.com", phone: "+44 7700 901890", visits: 3, spent: 96, lastVisit: "2026-01-01", status: "new", loyaltyPoints: 30, favouriteService: "Classic Haircut", notes: "", blacklisted: false },
  { id: 7, name: "Benjamin Shaw", email: "b.shaw@email.com", phone: "+44 7700 902123", visits: 41, spent: 1284, lastVisit: "2026-04-13", status: "vip", loyaltyPoints: 642, favouriteService: "Full Groom Package", notes: "Long-time client. Always tips £10.", blacklisted: false },
  { id: 8, name: "Jayden Morris", email: "j.morris@email.com", phone: "+44 7700 902456", visits: 14, spent: 448, lastVisit: "2026-04-05", status: "regular", loyaltyPoints: 175, favouriteService: "Skin Fade", notes: "", blacklisted: false },
  { id: 9, name: "Noah Patel", email: "n.patel@email.com", phone: "+44 7700 902789", visits: 9, spent: 288, lastVisit: "2026-04-12", status: "regular", loyaltyPoints: 120, favouriteService: "Hot Towel Shave", notes: "Sensitive skin — use gentle products.", blacklisted: false },
  { id: 10, name: "Finn Murphy", email: "f.murphy@email.com", phone: "+44 7700 903012", visits: 22, spent: 704, lastVisit: "2026-03-30", status: "vip", loyaltyPoints: 352, favouriteService: "Classic Haircut", notes: "", blacklisted: false },
  { id: 11, name: "Marcus Davis", email: "m.davis@email.com", phone: "+44 7700 903345", visits: 5, spent: 130, lastVisit: "2026-04-11", status: "new", loyaltyPoints: 55, favouriteService: "Beard Trim", notes: "", blacklisted: false },
  { id: 12, name: "Kai Nakamura", email: "k.nakamura@email.com", phone: "+44 7700 903678", visits: 7, spent: 224, lastVisit: "2026-04-09", status: "regular", loyaltyPoints: 90, favouriteService: "Skin Fade", notes: "", blacklisted: false },
  { id: 13, name: "Leo Russo", email: "l.russo@email.com", phone: "+44 7700 903901", visits: 16, spent: 640, lastVisit: "2026-04-11", status: "regular", loyaltyPoints: 240, favouriteService: "Full Groom Package", notes: "Likes champagne on arrival (VIP treatment).", blacklisted: false },
  { id: 14, name: "Harry Wilson", email: "h.wilson@email.com", phone: "+44 7700 904123", visits: 2, spent: 32, lastVisit: "2026-03-15", status: "new", loyaltyPoints: 15, favouriteService: "Junior Cut", notes: "Young client — 9 years old.", blacklisted: false },
  { id: 15, name: "Zach Evans", email: "z.evans@email.com", phone: "+44 7700 904456", visits: 19, spent: 608, lastVisit: "2026-04-10", status: "vip", loyaltyPoints: 304, favouriteService: "Hot Towel Shave", notes: "", blacklisted: false },
  { id: 16, name: "Ian Fraser", email: "i.fraser@email.com", phone: "+44 7700 904789", visits: 8, spent: 232, lastVisit: "2026-04-10", status: "regular", loyaltyPoints: 95, favouriteService: "Classic Haircut", notes: "", blacklisted: false },
  { id: 17, name: "Ravi Singh", email: "r.singh@email.com", phone: "+44 7700 905012", visits: 11, spent: 352, lastVisit: "2026-04-10", status: "regular", loyaltyPoints: 140, favouriteService: "Beard Trim", notes: "", blacklisted: false },
  { id: 18, name: "Tom Hughes", email: "t.hughes@email.com", phone: "+44 7700 905345", visits: 4, spent: 120, lastVisit: "2026-04-09", status: "new", loyaltyPoints: 40, favouriteService: "Hair Colour", notes: "Late cancellation — charged fee.", blacklisted: false },
  { id: 19, name: "Dan Walsh", email: "d.walsh@email.com", phone: "+44 7700 905678", visits: 28, spent: 896, lastVisit: "2026-04-10", status: "vip", loyaltyPoints: 448, favouriteService: "Eyebrow Thread", notes: "Regular every 2 weeks.", blacklisted: false },
  { id: 20, name: "Mike Stone", email: "m.stone@email.com", phone: "+44 7700 905901", visits: 1, spent: 37, lastVisit: "2026-04-09", status: "new", loyaltyPoints: 15, favouriteService: "Skin Fade", notes: "First visit. Walk-in.", blacklisted: false },
];

export const mockDiscounts = [
  { id: 1, code: "WELCOME10", type: "percent", value: 10, uses: 42, maxUses: 100, expiresAt: "2026-06-30", status: "active" },
  { id: 2, code: "SUMMER20", type: "percent", value: 20, uses: 18, maxUses: 50, expiresAt: "2026-08-31", status: "active" },
  { id: 3, code: "VIP5", type: "fixed", value: 5, uses: 67, maxUses: null, expiresAt: null, status: "active" },
  { id: 4, code: "REFER15", type: "percent", value: 15, uses: 31, maxUses: 200, expiresAt: "2026-12-31", status: "active" },
  { id: 5, code: "STAFF50", type: "percent", value: 50, uses: 12, maxUses: null, expiresAt: null, status: "active" },
];

export const mockNotifications = [
  { id: 1, type: "booking", message: "New booking: Daniel Thompson at 3:30 PM", time: "2 min ago", read: false },
  { id: 2, type: "payment", message: "Payment of £55.00 received for booking #1247", time: "15 min ago", read: false },
  { id: 3, type: "alert", message: "Low stock: Beardbrand Oil (7 units remaining)", time: "1 hr ago", read: false },
  { id: 4, type: "cancellation", message: "Booking cancelled by Ryan Foster for 2:00 PM", time: "2 hrs ago", read: true },
  { id: 5, type: "review", message: "New 5★ review from Amir Hassan", time: "3 hrs ago", read: true },
];

export const mockApiKeys = [
  { id: 1, name: "OpenAI (GPT-4o Vision)", service: "openai", key: "sk-...xK9p", status: "active", scope: "super-admin", lastUsed: "2 hrs ago" },
  { id: 2, name: "Stripe Payments", service: "stripe", key: "sk_live_...mN3q", status: "active", scope: "super-admin", lastUsed: "5 min ago" },
  { id: 3, name: "Google Maps API", service: "google-maps", key: "AIza...Xp8k", status: "active", scope: "super-admin", lastUsed: "1 day ago" },
  { id: 4, name: "Twilio SMS", service: "twilio", key: "SK...rT7m", status: "inactive", scope: "super-admin", lastUsed: "3 days ago" },
  { id: 5, name: "Firebase Cloud Messaging", service: "firebase", key: "AIza...Yq2n", status: "active", scope: "super-admin", lastUsed: "30 min ago" },
  { id: 6, name: "Google Calendar (Tenant Override)", service: "google-calendar", key: "ya29...Zk1v", status: "active", scope: "tenant", lastUsed: "1 hr ago" },
];

export const apiServiceOptions = [
  { value: "openai", label: "OpenAI (GPT / Vision)", icon: "🤖" },
  { value: "stripe", label: "Stripe Payments", icon: "💳" },
  { value: "paypal", label: "PayPal", icon: "🅿️" },
  { value: "google-maps", label: "Google Maps", icon: "🗺️" },
  { value: "google-calendar", label: "Google Calendar", icon: "📅" },
  { value: "firebase", label: "Firebase / FCM Push", icon: "🔔" },
  { value: "twilio", label: "Twilio SMS", icon: "📱" },
  { value: "zoom", label: "Zoom Video", icon: "🎥" },
  { value: "mailgun", label: "Mailgun Email", icon: "📧" },
  { value: "fixer", label: "Fixer.io (Exchange Rates)", icon: "💱" },
];

// --- BARBER SCHEDULES ---
export const mockSchedules: Record<number, {
  day: string; open: boolean; startTime: string; endTime: string;
  breaks: { start: string; end: string }[];
}[]> = {
  1: [
    { day: "Mon", open: true, startTime: "09:00", endTime: "18:00", breaks: [{ start: "13:00", end: "14:00" }] },
    { day: "Tue", open: true, startTime: "09:00", endTime: "18:00", breaks: [] },
    { day: "Wed", open: true, startTime: "09:00", endTime: "18:00", breaks: [{ start: "13:00", end: "14:00" }] },
    { day: "Thu", open: true, startTime: "10:00", endTime: "19:00", breaks: [] },
    { day: "Fri", open: true, startTime: "09:00", endTime: "18:00", breaks: [] },
    { day: "Sat", open: true, startTime: "08:00", endTime: "17:00", breaks: [{ start: "12:00", end: "13:00" }] },
    { day: "Sun", open: false, startTime: "10:00", endTime: "15:00", breaks: [] },
  ],
  2: [
    { day: "Mon", open: true, startTime: "10:00", endTime: "19:00", breaks: [] },
    { day: "Tue", open: true, startTime: "10:00", endTime: "19:00", breaks: [] },
    { day: "Wed", open: false, startTime: "09:00", endTime: "18:00", breaks: [] },
    { day: "Thu", open: true, startTime: "10:00", endTime: "19:00", breaks: [] },
    { day: "Fri", open: true, startTime: "09:00", endTime: "18:00", breaks: [{ start: "13:00", end: "14:00" }] },
    { day: "Sat", open: true, startTime: "09:00", endTime: "17:00", breaks: [] },
    { day: "Sun", open: true, startTime: "10:00", endTime: "15:00", breaks: [] },
  ],
};

// --- ANALYTICS ---
export const mockHourlyData = [
  { hour: "9am", Mon: 2, Tue: 1, Wed: 3, Thu: 2, Fri: 4, Sat: 5, Sun: 1 },
  { hour: "10am", Mon: 4, Tue: 3, Wed: 5, Thu: 4, Fri: 6, Sat: 8, Sun: 4 },
  { hour: "11am", Mon: 5, Tue: 4, Wed: 6, Thu: 5, Fri: 7, Sat: 9, Sun: 5 },
  { hour: "12pm", Mon: 3, Tue: 5, Wed: 4, Thu: 6, Fri: 8, Sat: 7, Sun: 6 },
  { hour: "1pm", Mon: 2, Tue: 2, Wed: 3, Thu: 3, Fri: 5, Sat: 6, Sun: 4 },
  { hour: "2pm", Mon: 5, Tue: 4, Wed: 6, Thu: 5, Fri: 7, Sat: 8, Sun: 5 },
  { hour: "3pm", Mon: 6, Tue: 5, Wed: 7, Thu: 6, Fri: 9, Sat: 10, Sun: 6 },
  { hour: "4pm", Mon: 4, Tue: 3, Wed: 5, Thu: 4, Fri: 6, Sat: 7, Sun: 3 },
  { hour: "5pm", Mon: 3, Tue: 2, Wed: 3, Thu: 3, Fri: 5, Sat: 4, Sun: 2 },
];

export const mockTopBarbers = [
  { name: "James Okafor", bookings: 128, revenue: 4480, avgTicket: 35, completionRate: 96 },
  { name: "Mohammed Al-Rashid", bookings: 104, revenue: 5200, avgTicket: 50, completionRate: 94 },
  { name: "Carlos Mendes", bookings: 96, revenue: 3072, avgTicket: 32, completionRate: 91 },
  { name: "Ethan Clarke", bookings: 72, revenue: 4680, avgTicket: 65, completionRate: 89 },
  { name: "Sofia Chen", bookings: 64, revenue: 2880, avgTicket: 45, completionRate: 93 },
];

export const mockTopServices = [
  { name: "Skin Fade", bookings: 128, revenue: 4096, avgTicket: 32 },
  { name: "Full Groom Package", bookings: 87, revenue: 4785, avgTicket: 55 },
  { name: "Classic Haircut", bookings: 145, revenue: 3625, avgTicket: 25 },
  { name: "Hair Colour", bookings: 41, revenue: 2665, avgTicket: 65 },
  { name: "Hot Towel Shave", bookings: 64, revenue: 1792, avgTicket: 28 },
];

// --- TESTIMONIALS (for landing page) ---
export const mockTestimonials = [
  {
    id: 1,
    name: "Robert Williams",
    role: "Owner, The Gentleman's Quarter",
    avatar: "https://ui-avatars.com/api/?name=Robert+Williams&background=C9A84C&color=fff&size=80",
    quote: "BarberOS transformed how we run our 3 locations. Bookings are up 40%, and the POS is so fast my cashiers love it. Worth every penny.",
    rating: 5,
    plan: "Business",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Owner, Blade & Thread",
    avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=6366f1&color=fff&size=80",
    quote: "The AI hairstyle feature is genuinely incredible. Clients upload a selfie and book the exact look they want. Conversions are through the roof.",
    rating: 5,
    plan: "Professional",
  },
  {
    id: 3,
    name: "Jake Sterling",
    role: "Manager, The Urban Barber Co.",
    avatar: "https://ui-avatars.com/api/?name=Jake+Sterling&background=10b981&color=fff&size=80",
    quote: "Setup took 15 minutes and we went live the same day. The team picked it up immediately — even our least tech-savvy barber loves the app.",
    rating: 5,
    plan: "Professional",
  },
];

// --- FAQ (for landing page) ---
export const mockFAQ = [
  { id: "1", question: "How long does setup take?", answer: "Most shops are live within 30 minutes. Our onboarding wizard walks you through adding your services, staff, and booking page. No technical knowledge required." },
  { id: "2", question: "Can I try before I buy?", answer: "Yes — every plan includes a 14-day free trial, no credit card required. You get full access to all features on your chosen plan during the trial." },
  { id: "3", question: "Do my clients need to create an account to book?", answer: "No. Clients can book as guests with just a name and phone number. Accounts are optional and unlock loyalty points and booking history." },
  { id: "4", question: "Can I manage multiple barbershop locations?", answer: "Yes. The Professional plan supports up to 3 branches, Business up to 10, and Enterprise has no limit. Each branch has independent scheduling and reporting." },
  { id: "5", question: "What payment methods are supported?", answer: "We support Stripe (card payments), PayPal, cash, deposit-only bookings, and vouchers via POS. UK and EU payment methods are fully supported." },
  { id: "6", question: "Is my data secure?", answer: "Absolutely. Each client's data is isolated in a separate database. We use AES-256 encryption for all sensitive data, and are fully GDPR compliant with data deletion on request." },
];

// --- BRANCHES (for multi-location) ---
export const mockBranches = [
  { id: 1, name: "Central London", address: "12 Barbers Row, Soho, London W1D 3QX", phone: "+44 20 7946 0100", bookingsToday: 28, staffCount: 4 },
  { id: 2, name: "Canary Wharf", address: "45 Finance Street, Canary Wharf, London E14 5AB", phone: "+44 20 7946 0101", bookingsToday: 19, staffCount: 3 },
];

// --- POS: SALES HISTORY ---
export const mockSalesHistory = [
  { id: "TXN-1001", date: "2026-04-13", time: "09:12", client: "Benjamin Shaw", clientId: 7, barber: "James Okafor", items: [{ name: "Skin Fade", qty: 1, price: 32 }, { name: "Hot Towel Finish", qty: 1, price: 5 }], subtotal: 37, discount: 0, tax: 7.40, total: 44.40, payment: "CARD", status: "completed", ref: "TXN-1001" },
  { id: "TXN-1002", date: "2026-04-13", time: "10:05", client: "Walk-in", clientId: null, barber: "Mohammed Al-Rashid", items: [{ name: "Classic Haircut", qty: 1, price: 25 }], subtotal: 25, discount: 0, tax: 5.00, total: 30.00, payment: "CASH", status: "completed", ref: "TXN-1002" },
  { id: "TXN-1003", date: "2026-04-13", time: "10:48", client: "Amir Hassan", clientId: 2, barber: "James Okafor", items: [{ name: "Full Groom Package", qty: 1, price: 55 }, { name: "Beard Oil Treatment", qty: 1, price: 8 }, { name: "American Crew Pomade", qty: 1, price: 18.99 }], subtotal: 81.99, discount: 5, tax: 15.40, total: 92.39, payment: "CARD", status: "completed", ref: "TXN-1003" },
  { id: "TXN-1004", date: "2026-04-13", time: "11:30", client: "Lucas White", clientId: 5, barber: "Carlos Mendes", items: [{ name: "Beard Trim", qty: 1, price: 18 }], subtotal: 18, discount: 0, tax: 3.60, total: 21.60, payment: "CASH", status: "completed", ref: "TXN-1004" },
  { id: "TXN-1005", date: "2026-04-13", time: "12:15", client: "Ryan Foster", clientId: 4, barber: "Ethan Clarke", items: [{ name: "Hair Colour", qty: 1, price: 65 }, { name: "Scalp Massage", qty: 1, price: 10 }], subtotal: 75, discount: 0, tax: 15.00, total: 90.00, payment: "SPLIT", status: "completed", ref: "TXN-1005" },
  { id: "TXN-1006", date: "2026-04-12", time: "09:00", client: "Daniel Thompson", clientId: 1, barber: "James Okafor", items: [{ name: "Skin Fade", qty: 1, price: 32 }, { name: "Hot Towel Finish", qty: 1, price: 5 }], subtotal: 37, discount: 0, tax: 7.40, total: 44.40, payment: "CARD", status: "completed", ref: "TXN-1006" },
  { id: "TXN-1007", date: "2026-04-12", time: "10:30", client: "Noah Patel", clientId: 9, barber: "Mohammed Al-Rashid", items: [{ name: "Hot Towel Shave", qty: 1, price: 28 }, { name: "Face Mask", qty: 1, price: 12 }], subtotal: 40, discount: 0, tax: 8.00, total: 48.00, payment: "CARD", status: "refunded", ref: "TXN-1007" },
  { id: "TXN-1008", date: "2026-04-12", time: "13:45", client: "Leo Russo", clientId: 13, barber: "Ethan Clarke", items: [{ name: "Full Groom Package", qty: 1, price: 55 }, { name: "Scalp Massage", qty: 1, price: 10 }], subtotal: 65, discount: 0, tax: 13.00, total: 78.00, payment: "CASH", status: "completed", ref: "TXN-1008" },
  { id: "TXN-1009", date: "2026-04-11", time: "09:00", client: "Jayden Morris", clientId: 8, barber: "James Okafor", items: [{ name: "Classic Haircut", qty: 1, price: 25 }], subtotal: 25, discount: 0, tax: 5.00, total: 30.00, payment: "CASH", status: "completed", ref: "TXN-1009" },
  { id: "TXN-1010", date: "2026-04-11", time: "11:00", client: "Marcus Davis", clientId: 11, barber: "Mohammed Al-Rashid", items: [{ name: "Beard Trim", qty: 1, price: 18 }, { name: "Beard Oil Treatment", qty: 1, price: 8 }], subtotal: 26, discount: 0, tax: 5.20, total: 31.20, payment: "CARD", status: "completed", ref: "TXN-1010" },
  { id: "TXN-1011", date: "2026-04-10", time: "10:00", client: "Zach Evans", clientId: 15, barber: "James Okafor", items: [{ name: "Hot Towel Shave", qty: 1, price: 28 }, { name: "Face Mask", qty: 1, price: 12 }], subtotal: 40, discount: 0, tax: 8.00, total: 48.00, payment: "CARD", status: "completed", ref: "TXN-1011" },
  { id: "TXN-1012", date: "2026-04-10", time: "11:00", client: "Ian Fraser", clientId: 16, barber: "Mohammed Al-Rashid", items: [{ name: "Classic Haircut", qty: 1, price: 25 }, { name: "Neck Shave", qty: 1, price: 4 }], subtotal: 29, discount: 0, tax: 5.80, total: 34.80, payment: "CASH", status: "completed", ref: "TXN-1012" },
];

// --- POS: PURCHASES ---
export const mockPurchases = [
  { id: "PO-001", date: "2026-04-10", supplier: "Wahl Professional", category: "Equipment", items: [{ name: "Wahl Magic Clip Cordless", qty: 2, unitCost: 89.99 }, { name: "Wahl T-Blade Trimmer", qty: 1, unitCost: 59.99 }], total: 239.97, paymentMethod: "Bank Transfer", status: "received", notes: "Quarterly equipment restock", ref: "PO-001" },
  { id: "PO-002", date: "2026-04-08", supplier: "American Crew Wholesale", category: "Products", items: [{ name: "American Crew Pomade (24-pack)", qty: 2, unitCost: 120.00 }, { name: "Matte Clay Wax (12-pack)", qty: 3, unitCost: 68.00 }], total: 444.00, paymentMethod: "Card", status: "received", notes: "", ref: "PO-002" },
  { id: "PO-003", date: "2026-04-05", supplier: "Proraso Italia", category: "Products", items: [{ name: "Proraso Shaving Cream (48-pack)", qty: 1, unitCost: 180.00 }], total: 180.00, paymentMethod: "Bank Transfer", status: "received", notes: "Monthly restock", ref: "PO-003" },
  { id: "PO-004", date: "2026-04-01", supplier: "Beardbrand UK", category: "Products", items: [{ name: "Beardbrand Oil (24-pack)", qty: 2, unitCost: 144.00 }, { name: "Hair Tonic Spray (36-pack)", qty: 1, unitCost: 96.00 }], total: 384.00, paymentMethod: "Card", status: "partial", notes: "Tonic spray delayed — ETA 2 weeks", ref: "PO-004" },
  { id: "PO-005", date: "2026-03-28", supplier: "Barber Supplies Ltd", category: "Consumables", items: [{ name: "Disposable Capes (100-pack)", qty: 5, unitCost: 18.00 }, { name: "Neck Strips (500-pack)", qty: 3, unitCost: 12.00 }, { name: "Hot Towel Machine Bags (200-pack)", qty: 2, unitCost: 24.00 }], total: 174.00, paymentMethod: "Cash", status: "received", notes: "", ref: "PO-005" },
  { id: "PO-006", date: "2026-03-20", supplier: "BaByliss Pro UK", category: "Equipment", items: [{ name: "BaByliss Skeleton Clipper", qty: 3, unitCost: 75.00 }], total: 225.00, paymentMethod: "Bank Transfer", status: "pending", notes: "Pre-order — due 2026-04-20", ref: "PO-006" },
];

// --- POS: EXPENSES ---
export const mockExpenses = [
  { id: "EXP-001", date: "2026-04-13", category: "Utilities", description: "Electricity bill — April", amount: 280.00, paymentMethod: "Bank Transfer", paidTo: "EDF Energy", receipt: true, notes: "", ref: "EXP-001" },
  { id: "EXP-002", date: "2026-04-12", category: "Rent", description: "Monthly shop rent — April", amount: 3200.00, paymentMethod: "Bank Transfer", paidTo: "Landlord Ltd", receipt: true, notes: "Due on 1st — paid late", ref: "EXP-002" },
  { id: "EXP-003", date: "2026-04-10", category: "Marketing", description: "Instagram ads — Spring campaign", amount: 150.00, paymentMethod: "Card", paidTo: "Meta Ads", receipt: true, notes: "", ref: "EXP-003" },
  { id: "EXP-004", date: "2026-04-08", category: "Staff", description: "James Okafor — weekly wages", amount: 640.00, paymentMethod: "Bank Transfer", paidTo: "James Okafor", receipt: false, notes: "", ref: "EXP-004" },
  { id: "EXP-005", date: "2026-04-08", category: "Staff", description: "Mohammed Al-Rashid — weekly wages", amount: 580.00, paymentMethod: "Bank Transfer", paidTo: "Mohammed Al-Rashid", receipt: false, notes: "", ref: "EXP-005" },
  { id: "EXP-006", date: "2026-04-07", category: "Maintenance", description: "Plumber — sink repair", amount: 120.00, paymentMethod: "Cash", paidTo: "Local Plumbing Co", receipt: true, notes: "", ref: "EXP-006" },
  { id: "EXP-007", date: "2026-04-05", category: "Software", description: "BarberOS subscription — April", amount: 79.00, paymentMethod: "Card", paidTo: "BarberOS Ltd", receipt: true, notes: "", ref: "EXP-007" },
  { id: "EXP-008", date: "2026-04-04", category: "Cleaning", description: "Commercial cleaning service", amount: 85.00, paymentMethod: "Cash", paidTo: "CleanPro Ltd", receipt: false, notes: "Bi-weekly service", ref: "EXP-008" },
  { id: "EXP-009", date: "2026-04-01", category: "Insurance", description: "Public liability insurance — Q2", amount: 320.00, paymentMethod: "Bank Transfer", paidTo: "Hiscox Insurance", receipt: true, notes: "", ref: "EXP-009" },
  { id: "EXP-010", date: "2026-03-31", category: "Utilities", description: "Water rates — Q1", amount: 95.00, paymentMethod: "Bank Transfer", paidTo: "Thames Water", receipt: true, notes: "", ref: "EXP-010" },
];

export const EXPENSE_CATEGORIES = ["Rent", "Utilities", "Staff", "Marketing", "Equipment", "Products", "Maintenance", "Software", "Cleaning", "Insurance", "Other"];

// --- POS: LOANS ---
export const mockLoans = [
  { id: "LN-001", date: "2026-04-10", type: "given", party: "Carlos Mendes", partyType: "staff", amount: 200.00, reason: "Emergency advance on wages", dueDate: "2026-04-30", paidBack: 0, status: "outstanding", notes: "", ref: "LN-001" },
  { id: "LN-002", date: "2026-04-05", type: "given", party: "Daniel Thompson", partyType: "client", amount: 55.00, reason: "Client tab — paid on next visit", dueDate: "2026-04-19", paidBack: 55.00, status: "repaid", notes: "Paid back 2026-04-11", ref: "LN-002" },
  { id: "LN-003", date: "2026-03-28", type: "taken", party: "Barber Supplies Ltd", partyType: "supplier", amount: 500.00, reason: "Equipment purchase on credit", dueDate: "2026-04-28", paidBack: 250.00, status: "partial", notes: "50% deposit paid — remainder due EOM", ref: "LN-003" },
  { id: "LN-004", date: "2026-03-15", type: "given", party: "Alex Turner", partyType: "staff", amount: 300.00, reason: "Personal emergency loan", dueDate: "2026-04-15", paidBack: 300.00, status: "repaid", notes: "", ref: "LN-004" },
  { id: "LN-005", date: "2026-03-01", type: "taken", party: "Owner — Robert", partyType: "owner", amount: 2000.00, reason: "Shop renovation float", dueDate: "2026-06-01", paidBack: 0, status: "outstanding", notes: "Interest-free — agreed with owner", ref: "LN-005" },
  { id: "LN-006", date: "2026-04-13", type: "given", party: "Lucas White", partyType: "client", amount: 32.00, reason: "Client left without paying — tab agreed", dueDate: "2026-04-20", paidBack: 0, status: "outstanding", notes: "Called — confirmed will pay on next visit", ref: "LN-006" },
];

// --- POS: STAFF SALARIES ---
export const mockSalaryConfig = [
  { barberId: 1, name: "James Okafor", payType: "commission" as const, weeklyBase: 250, commissionRate: 40, color: "#C9A84C" },
  { barberId: 2, name: "Mohammed Al-Rashid", payType: "commission" as const, weeklyBase: 250, commissionRate: 38, color: "#6366f1" },
  { barberId: 3, name: "Carlos Mendes", payType: "weekly" as const, weeklyBase: 450, commissionRate: 0, color: "#10b981" },
  { barberId: 4, name: "Ethan Clarke", payType: "commission" as const, weeklyBase: 200, commissionRate: 35, color: "#f59e0b" },
  { barberId: 5, name: "Sofia Chen", payType: "hourly" as const, weeklyBase: 0, hourlyRate: 14.50, commissionRate: 20, color: "#EC4899" },
  { barberId: 6, name: "Alex Turner", payType: "weekly" as const, weeklyBase: 380, commissionRate: 0, color: "#8B5CF6" },
];

export const mockSalaryPayments = [
  { id: "SAL-001", barberId: 1, barber: "James Okafor", date: "2026-04-07", period: "Week ending 06 Apr 2026", payType: "commission", base: 250, commission: 256.80, tips: 120, deductions: 0, total: 626.80, status: "paid", method: "Bank Transfer", ref: "SAL-001", notes: "" },
  { id: "SAL-002", barberId: 2, barber: "Mohammed Al-Rashid", date: "2026-04-07", period: "Week ending 06 Apr 2026", payType: "commission", base: 250, commission: 182.40, tips: 95, deductions: 0, total: 527.40, status: "paid", method: "Bank Transfer", ref: "SAL-002", notes: "" },
  { id: "SAL-003", barberId: 3, barber: "Carlos Mendes", date: "2026-04-07", period: "Week ending 06 Apr 2026", payType: "weekly", base: 450, commission: 0, tips: 60, deductions: 0, total: 510.00, status: "paid", method: "Cash", ref: "SAL-003", notes: "" },
  { id: "SAL-004", barberId: 4, barber: "Ethan Clarke", date: "2026-04-07", period: "Week ending 06 Apr 2026", payType: "commission", base: 200, commission: 112.00, tips: 45, deductions: 0, total: 357.00, status: "paid", method: "Bank Transfer", ref: "SAL-004", notes: "" },
  { id: "SAL-005", barberId: 5, barber: "Sofia Chen", date: "2026-04-07", period: "Week ending 06 Apr 2026", payType: "hourly", base: 362.50, commission: 49.60, tips: 30, deductions: 0, total: 442.10, status: "paid", method: "Bank Transfer", ref: "SAL-005", notes: "25hrs × £14.50" },
  { id: "SAL-006", barberId: 1, barber: "James Okafor", date: "2026-03-31", period: "Week ending 30 Mar 2026", payType: "commission", base: 250, commission: 240.00, tips: 100, deductions: 0, total: 590.00, status: "paid", method: "Bank Transfer", ref: "SAL-006", notes: "" },
  { id: "SAL-007", barberId: 2, barber: "Mohammed Al-Rashid", date: "2026-03-31", period: "Week ending 30 Mar 2026", payType: "commission", base: 250, commission: 168.00, tips: 80, deductions: 0, total: 498.00, status: "paid", method: "Bank Transfer", ref: "SAL-007", notes: "" },
  { id: "SAL-008", barberId: 3, barber: "Carlos Mendes", date: "2026-03-31", period: "Week ending 30 Mar 2026", payType: "weekly", base: 450, commission: 0, tips: 55, deductions: 200, total: 305.00, status: "paid", method: "Cash", ref: "SAL-008", notes: "£200 loan deduction (LN-001)" },
  // Outstanding this week
  { id: "SAL-009", barberId: 1, barber: "James Okafor", date: "2026-04-14", period: "Week ending 13 Apr 2026", payType: "commission", base: 250, commission: 256.80, tips: 140, deductions: 0, total: 646.80, status: "pending", method: "Bank Transfer", ref: "SAL-009", notes: "" },
  { id: "SAL-010", barberId: 2, barber: "Mohammed Al-Rashid", date: "2026-04-14", period: "Week ending 13 Apr 2026", payType: "commission", base: 250, commission: 192.00, tips: 95, deductions: 0, total: 537.00, status: "pending", method: "Bank Transfer", ref: "SAL-010", notes: "" },
  { id: "SAL-011", barberId: 3, barber: "Carlos Mendes", date: "2026-04-14", period: "Week ending 13 Apr 2026", payType: "weekly", base: 450, commission: 0, tips: 65, deductions: 0, total: 515.00, status: "pending", method: "Cash", ref: "SAL-011", notes: "" },
  { id: "SAL-012", barberId: 4, barber: "Ethan Clarke", date: "2026-04-14", period: "Week ending 13 Apr 2026", payType: "commission", base: 200, commission: 128.80, tips: 50, deductions: 0, total: 378.80, status: "pending", method: "Bank Transfer", ref: "SAL-012", notes: "" },
  { id: "SAL-013", barberId: 5, barber: "Sofia Chen", date: "2026-04-14", period: "Week ending 13 Apr 2026", payType: "hourly", base: 319.00, commission: 49.60, tips: 28, deductions: 0, total: 396.60, status: "pending", method: "Bank Transfer", ref: "SAL-013", notes: "22hrs × £14.50" },
];

// --- POS: STOCK ADJUSTMENTS ---
export const mockStockAdjustments = [
  { id: "ADJ-001", productId: 1, productName: "American Crew Pomade", type: "delivery" as const, qty: 24, before: 18, after: 42, date: "2026-04-08", note: "Weekly delivery — Wahl Professional", user: "James Okafor" },
  { id: "ADJ-002", productId: 3, productName: "Beardbrand Oil", type: "sold" as const, qty: -2, before: 9, after: 7, date: "2026-04-10", note: "POS sale", user: "System" },
  { id: "ADJ-003", productId: 5, productName: "Hair Tonic Spray", type: "adjustment" as const, qty: -1, before: 4, after: 3, date: "2026-04-11", note: "Damaged — bottle cracked", user: "Mohammed Al-Rashid" },
  { id: "ADJ-004", productId: 2, productName: "Proraso Shaving Cream", type: "delivery" as const, qty: 12, before: 6, after: 18, date: "2026-04-09", note: "Emergency restock", user: "James Okafor" },
  { id: "ADJ-005", productId: 4, productName: "Matte Clay Wax", type: "sold" as const, qty: -3, before: 34, after: 31, date: "2026-04-12", note: "POS sales (3 units)", user: "System" },
];

// --- SLOTS (for booking page) ---
export function generateTimeSlots(_date: string) {
  const morning = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  const afternoon = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"];
  const evening = ["16:00", "16:30", "17:00", "17:30", "18:00"];
  // Simulate some slots as booked
  const booked = new Set(["09:00", "10:30", "13:00", "14:30", "16:30"]);
  const toSlots = (times: string[]) => times.map(t => ({ time: t, available: !booked.has(t) }));
  return { morning: toSlots(morning), afternoon: toSlots(afternoon), evening: toSlots(evening) };
}

// ─── SCHEDULE PAGE MOCK DATA ──────────────────────────────────────────────────

export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface BreakSlot {
  id: string;
  start: string;
  end: string;
}

export interface DaySchedule {
  active: boolean;
  start: string;
  end: string;
  breaks: BreakSlot[];
}

export const mockAdminSchedule: Record<DayKey, DaySchedule> = {
  monday:    { active: true,  start: "09:00", end: "18:00", breaks: [{ id: "b1", start: "13:00", end: "14:00" }] },
  tuesday:   { active: true,  start: "09:00", end: "18:00", breaks: [] },
  wednesday: { active: true,  start: "10:00", end: "19:00", breaks: [{ id: "b2", start: "13:00", end: "13:30" }] },
  thursday:  { active: false, start: "09:00", end: "18:00", breaks: [] },
  friday:    { active: true,  start: "09:00", end: "20:00", breaks: [{ id: "b3", start: "13:00", end: "14:00" }] },
  saturday:  { active: true,  start: "10:00", end: "17:00", breaks: [] },
  sunday:    { active: false, start: "10:00", end: "16:00", breaks: [] },
};

export const mockSlotSettings = {
  slotDuration: 30,
  bufferTime: 5,
  advanceLimit: 30,
};

export const mockDateOverrides = [
  { id: 1, date: "2026-04-18", type: "dayoff"       as const, customStart: null, customEnd: null,     reason: "Bank Holiday" },
  { id: 2, date: "2026-04-25", type: "custom-hours" as const, customStart: "10:00", customEnd: "14:00", reason: "Half day" },
  { id: 3, date: "2026-05-04", type: "dayoff"       as const, customStart: null, customEnd: null,     reason: "Day off" },
];

export const mockTodaySlots = [
  { time: "09:00", end: "09:30", type: "booked"    as const, client: "Daniel Thompson",  phone: "+44 7700 900111", email: "daniel@example.com", service: "Skin Fade",          addons: ["Hot Towel"],      status: "completed"   as const, amount: 37, ref: "BK-2401", payment: "card"   as const, notes: "", visits: 8,  isVip: false, method: "online"  as const },
  { time: "09:30", end: "10:15", type: "booked"    as const, client: "Amir Hassan",      phone: "+44 7700 900222", email: "amir@example.com",   service: "Full Groom Package", addons: [],                 status: "in-progress" as const, amount: 55, ref: "BK-2402", payment: "cash"   as const, notes: "Prefers scissors over clippers on top", visits: 3, isVip: false, method: "walk-in" as const },
  { time: "10:15", end: "10:45", type: "available" as const, client: null, phone: null, email: null, service: null, addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
  { time: "10:45", end: "11:15", type: "booked"    as const, client: "Tyler Brooks",     phone: "+44 7700 900333", email: "tyler@example.com",  service: "Classic Haircut",    addons: [],                 status: "confirmed"   as const, amount: 25, ref: "BK-2403", payment: "online" as const, notes: "", visits: 12, isVip: true,  method: "online"  as const },
  { time: "11:15", end: "11:45", type: "booked"    as const, client: "Ryan Foster",      phone: "+44 7700 900444", email: "ryan@example.com",   service: "Hair Design / Art",  addons: ["Beard Oil"],      status: "confirmed"   as const, amount: 53, ref: "BK-2404", payment: "online" as const, notes: "Has a reference photo", visits: 1, isVip: false, method: "online" as const },
  { time: "11:45", end: "12:15", type: "available" as const, client: null, phone: null, email: null, service: null, addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
  { time: "12:15", end: "12:45", type: "available" as const, client: null, phone: null, email: null, service: null, addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
  { time: "12:45", end: "13:00", type: "available" as const, client: null, phone: null, email: null, service: null, addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
  { time: "13:00", end: "14:00", type: "break"     as const, client: null, phone: null, email: null, service: "Lunch Break",  addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
  { time: "14:00", end: "14:30", type: "booked"    as const, client: "Lucas White",      phone: "+44 7700 900555", email: "lucas@example.com",  service: "Beard Trim & Shape", addons: [],                 status: "pending"     as const, amount: 18, ref: "BK-2405", payment: "cash"   as const, notes: "", visits: 5, isVip: false, method: "phone" as const },
  { time: "14:30", end: "15:00", type: "booked"    as const, client: "Noah Patel",       phone: "+44 7700 900666", email: "noah@example.com",   service: "Hot Towel Shave",    addons: ["Scalp Massage"],  status: "pending"     as const, amount: 38, ref: "BK-2406", payment: "online" as const, notes: "First visit", visits: 1, isVip: false, method: "online" as const },
  { time: "15:00", end: "15:30", type: "available" as const, client: null, phone: null, email: null, service: null, addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
  { time: "15:30", end: "16:00", type: "available" as const, client: null, phone: null, email: null, service: null, addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
  { time: "16:00", end: "16:45", type: "booked"    as const, client: "Sam Cooper",       phone: "+44 7700 900777", email: "sam@example.com",    service: "Colour & Bleach",    addons: [],                 status: "confirmed"   as const, amount: 65, ref: "BK-2407", payment: "online" as const, notes: "", visits: 2, isVip: false, method: "online" as const },
  { time: "16:45", end: "17:15", type: "available" as const, client: null, phone: null, email: null, service: null, addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
  { time: "17:15", end: "17:45", type: "available" as const, client: null, phone: null, email: null, service: null, addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
  { time: "17:45", end: "18:00", type: "available" as const, client: null, phone: null, email: null, service: null, addons: [], status: null, amount: null, ref: null, payment: null, notes: null, visits: 0, isVip: false, method: null },
];

export const mockDateAvailability = [
  { date: "2026-04-13", day: "Sun", total: 17, booked: 9,  status: "partial"   as const },
  { date: "2026-04-14", day: "Mon", total: 16, booked: 16, status: "full"      as const },
  { date: "2026-04-15", day: "Tue", total: 16, booked: 11, status: "partial"   as const },
  { date: "2026-04-16", day: "Wed", total: 18, booked: 3,  status: "available" as const },
  { date: "2026-04-17", day: "Thu", total: 0,  booked: 0,  status: "off"       as const },
  { date: "2026-04-18", day: "Fri", total: 0,  booked: 0,  status: "holiday"   as const },
  { date: "2026-04-19", day: "Sat", total: 12, booked: 12, status: "full"      as const },
  { date: "2026-04-20", day: "Sun", total: 0,  booked: 0,  status: "off"       as const },
  { date: "2026-04-21", day: "Mon", total: 16, booked: 7,  status: "partial"   as const },
  { date: "2026-04-22", day: "Tue", total: 16, booked: 2,  status: "available" as const },
  { date: "2026-04-23", day: "Wed", total: 18, booked: 14, status: "partial"   as const },
  { date: "2026-04-24", day: "Thu", total: 0,  booked: 0,  status: "off"       as const },
  { date: "2026-04-25", day: "Fri", total: 6,  booked: 4,  status: "partial"   as const },
  { date: "2026-04-26", day: "Sat", total: 12, booked: 1,  status: "available" as const },
];
