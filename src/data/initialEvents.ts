import { EventPlan } from '../types/event';

export const INITIAL_EVENTS: EventPlan[] = [
  {
    id: 'wedding-elena-marcus',
    title: "Elena & Marcus's Botanical Glasshouse Wedding",
    type: 'wedding',
    date: '2026-11-28',
    location: 'Sylvan Conservatory & Glasshouse, Sonoma Valley, CA',
    guestCount: 120,
    targetBudget: 38000,
    currency: 'USD',
    styleTheme: 'Modern Botanical & Warm Candlelight (Sage, Terracotta, Amber Brass)',
    culturalNotes: 'Bilingual ceremony readings (English & Spanish); blend of Mediterranean family-style feast.',
    description: 'An intimate, nature-infused celebration nestled inside a vintage botanical conservatory, featuring warm ambient candlelight, acoustic guitar melodies, and an artisanal culinary experience.',
    coverImage: '/src/assets/images/wedding_botanical_inspiration_1792753505134.jpg',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-03-20T14:30:00.000Z',
    emergencyContacts: [
      { role: 'Day-of Coordinator', name: 'Mariposa Vance', phone: '(555) 392-8110' },
      { role: 'Venue On-site Manager', name: 'David Keller', phone: '(555) 481-9923' },
      { role: 'Maid of Honor', name: 'Sofia Alvarez', phone: '(555) 231-7744' },
      { role: 'Best Man', name: 'Julian Reed', phone: '(555) 890-4412' }
    ],
    budgetItems: [
      {
        id: 'wb-1',
        category: 'Venue & Rentals',
        name: 'Glasshouse Conservatory Buyout (8 hrs)',
        estimatedCost: 8500,
        actualCost: 8500,
        paidAmount: 8500,
        status: 'paid',
        vendorName: 'Sylvan Conservatory',
        dueDate: '2026-02-01',
        notes: 'Includes ceremony lawn, indoor greenhouse, bridal suite, and basic tables.'
      },
      {
        id: 'wb-2',
        category: 'Venue & Rentals',
        name: 'Farmhouse Chairs, Linens & Brass Cutlery Rentals',
        estimatedCost: 2400,
        actualCost: 2650,
        paidAmount: 1325,
        status: 'deposit_paid',
        vendorName: 'Heritage Event Rentals',
        dueDate: '2026-09-15',
        notes: '120 oak crossback chairs, terracotta napkins, sage runners.'
      },
      {
        id: 'wb-3',
        category: 'Catering & Bar',
        name: 'Farm-to-Table 3-Course Feast & Passed Hors d’Oeuvres',
        estimatedCost: 11000,
        actualCost: 11400,
        paidAmount: 5700,
        status: 'deposit_paid',
        vendorName: 'Artisan Harvest Catering',
        dueDate: '2026-09-01',
        notes: '$95/person catering package with seasonal heirloom produce.'
      },
      {
        id: 'wb-4',
        category: 'Catering & Bar',
        name: 'Craft Cocktail Bar & Sommelier Wine Pairing',
        estimatedCost: 3200,
        actualCost: 3200,
        paidAmount: 1600,
        status: 'deposit_paid',
        vendorName: 'High Sierra Mobile Bar',
        dueDate: '2026-09-20',
        notes: '2 signature cocktails: Rosemary Mezcal Paloma & Fig Gin Fizz.'
      },
      {
        id: 'wb-5',
        category: 'Photography & Video',
        name: 'Full-Day Photo & Super-8 Video Documentation',
        estimatedCost: 4800,
        actualCost: 4800,
        paidAmount: 2400,
        status: 'deposit_paid',
        vendorName: 'Loom & Lens Visuals',
        dueDate: '2026-09-10',
        notes: '10 hours coverage, 2 shooters, drone permit, highlight film.'
      },
      {
        id: 'wb-6',
        category: 'Floral & Decor',
        name: 'Suspended Foliage Cloud & Taper Candle Tablescapes',
        estimatedCost: 4200,
        actualCost: 4400,
        paidAmount: 2200,
        status: 'deposit_paid',
        vendorName: 'Wildflower & Willow Floral',
        dueDate: '2026-08-30',
        notes: 'Eucalyptus, olive branches, garden roses, brass taper candle holders.'
      },
      {
        id: 'wb-7',
        category: 'Music & Entertainment',
        name: 'Acoustic Guitar Duo (Ceremony) & Vinyl DJ (Reception)',
        estimatedCost: 2600,
        actualCost: 2600,
        paidAmount: 1300,
        status: 'deposit_paid',
        vendorName: 'SoundWave Collective',
        dueDate: '2026-09-15',
        notes: 'Acoustic Spanish guitar for processional, curated indie/soul vinyl set.'
      },
      {
        id: 'wb-8',
        category: 'Attire & Beauty',
        name: 'Bridal Alterations, Groom Attire & Hair/Makeup',
        estimatedCost: 1800,
        actualCost: 1950,
        paidAmount: 1950,
        status: 'paid',
        vendorName: 'Luxe Bridal Artistry',
        dueDate: '2026-07-15',
        notes: 'Trial completed; day-of hair and natural glow makeup for 4.'
      },
      {
        id: 'wb-9',
        category: 'Invitations & Collateral',
        name: 'Deckle-edge Cotton Stationery, Menus & Place Cards',
        estimatedCost: 650,
        actualCost: 620,
        paidAmount: 620,
        status: 'paid',
        vendorName: 'Paper & Twine Press',
        dueDate: '2026-04-10',
        notes: 'Handmade sage paper with gold foil typography.'
      },
      {
        id: 'wb-10',
        category: 'Contingency & Buffer',
        name: 'Emergency Buffer & Vendor Gratuities',
        estimatedCost: 2000,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        dueDate: '2026-10-18',
        notes: 'Dedicated cushion for day-of delivery adjustments and service tips.'
      }
    ],
    milestones: [
      {
        id: 'wm-1',
        title: 'Lock down wedding venue date and sign contract',
        targetDate: '2026-02-01',
        phase: '12_months',
        category: 'Venue',
        isCompleted: true,
        assignedTo: 'Elena'
      },
      {
        id: 'wm-2',
        title: 'Book catering and schedule menu tasting',
        targetDate: '2026-03-15',
        phase: '12_months',
        category: 'Catering',
        isCompleted: true,
        assignedTo: 'Marcus'
      },
      {
        id: 'wm-3',
        title: 'Confirm photographer & super-8 videographer duo',
        targetDate: '2026-04-01',
        phase: '6_months',
        category: 'Media',
        isCompleted: true,
        assignedTo: 'Elena'
      },
      {
        id: 'wm-4',
        title: 'Mail out formal invitations with RSVP deadline',
        targetDate: '2026-06-15',
        phase: '6_months',
        category: 'Stationery',
        isCompleted: true,
        assignedTo: 'Marcus'
      },
      {
        id: 'wm-5',
        title: 'Finalize floral arch & suspended canopy design',
        targetDate: '2026-08-15',
        phase: '3_months',
        category: 'Decor',
        isCompleted: false,
        assignedTo: 'Elena'
      },
      {
        id: 'wm-6',
        title: 'Submit finalized seating chart and dietary numbers to caterer',
        targetDate: '2026-09-20',
        phase: '1_month',
        category: 'Catering',
        isCompleted: false,
        assignedTo: 'Elena & Marcus'
      },
      {
        id: 'wm-7',
        title: 'Final walkthrough with venue coordinator and DJ soundcheck plan',
        targetDate: '2026-10-05',
        phase: 'final_weeks',
        category: 'Logistics',
        isCompleted: false,
        assignedTo: 'Mariposa Vance'
      },
      {
        id: 'wm-8',
        title: 'Rehearsal dinner and bridal party briefing',
        targetDate: '2026-10-17',
        phase: 'final_weeks',
        category: 'Rehearsal',
        isCompleted: false,
        assignedTo: 'Marcus'
      }
    ],
    dayOfSchedule: [
      {
        id: 'ws-1',
        time: '10:00 AM',
        title: 'Bridal Suite Hair & Makeup Preparation',
        durationMinutes: 150,
        leadPerson: 'Luxe Bridal Artistry Team',
        location: 'Bridal Suite',
        notes: 'Mimosas and fruit platter served; relaxing acoustic background music.',
        isCompleted: false
      },
      {
        id: 'ws-2',
        time: '12:00 PM',
        title: 'Vendor Load-In & Glasshouse Floral Installation',
        durationMinutes: 120,
        leadPerson: 'Wildflower & Willow / Coordinator',
        location: 'Conservatory & Lawn',
        notes: 'Tables, linens, suspended greenery rigging, audio check.',
        isCompleted: false
      },
      {
        id: 'ws-3',
        time: '02:00 PM',
        title: 'First Look & Couple Romantic Portraits',
        durationMinutes: 60,
        leadPerson: 'Loom & Lens Photographer',
        location: 'Olive Grove Courtyard',
        notes: 'Private moment away from early arriving guests.',
        isCompleted: false
      },
      {
        id: 'ws-4',
        time: '03:15 PM',
        title: 'Guest Arrival & Welcome Mint Lemonade Service',
        durationMinutes: 45,
        leadPerson: 'Venue Host & Greeters',
        location: 'Arbor Entrance',
        notes: 'Spanish acoustic guitar playing softly as guests take seats.',
        isCompleted: false
      },
      {
        id: 'ws-5',
        time: '04:00 PM',
        title: 'Wedding Ceremony & Vow Exchange',
        durationMinutes: 40,
        leadPerson: 'Officiant Mateo Alvarez',
        location: 'Lawn Pavilion Altar',
        notes: 'Bilingual exchange, ring bearer cue, string transition at conclusion.',
        isCompleted: false
      },
      {
        id: 'ws-6',
        time: '04:45 PM',
        title: 'Golden Hour Cocktail Reception & Passed Tapas',
        durationMinutes: 75,
        leadPerson: 'Artisan Harvest & Mobile Bar',
        location: 'Terrace & Glasshouse Porch',
        notes: 'Signature Paloma cocktails, charcuterie grazing table, family photos.',
        isCompleted: false
      },
      {
        id: 'ws-7',
        time: '06:00 PM',
        title: 'Grand Entrance & Seated Dinner Service',
        durationMinutes: 90,
        leadPerson: 'Catering Lead & DJ',
        location: 'Main Glasshouse Hall',
        notes: 'Family-style heirloom chicken, roasted root vegetables, wine pour.',
        isCompleted: false
      },
      {
        id: 'ws-8',
        time: '07:30 PM',
        title: 'Toasts from Maid of Honor, Best Man & Parents',
        durationMinutes: 30,
        leadPerson: 'DJ / Emcee',
        location: 'Main Glasshouse Hall',
        notes: 'Champagne toast poured; wireless mic tested and ready.',
        isCompleted: false
      },
      {
        id: 'ws-9',
        time: '08:00 PM',
        title: 'Cake Cutting & First Dance',
        durationMinutes: 20,
        leadPerson: 'DJ',
        location: 'Dance Floor Center',
        notes: 'Song: Leon Bridges - Texas Sun. Transition straight to dance party.',
        isCompleted: false
      },
      {
        id: 'ws-10',
        time: '10:00 PM',
        title: 'Sparkler Pathway Send-Off & Departure',
        durationMinutes: 20,
        leadPerson: 'Coordinator Mariposa',
        location: 'Conservatory Stone Path',
        notes: '36-inch smokeless sparklers with safety buckets and torches ready.',
        isCompleted: false
      }
    ],
    vendors: [
      {
        id: 'wv-1',
        category: 'Venue & Rentals',
        businessName: 'Sylvan Conservatory & Gardens',
        contactName: 'David Keller',
        email: 'david@sylvanconservatory.com',
        phone: '(555) 481-9923',
        status: 'booked',
        quotedAmount: 8500,
        depositAmount: 8500,
        balancePaid: 8500,
        contractNotes: 'Fully paid. Requires certificate of insurance from caterer by Oct 1.'
      },
      {
        id: 'wv-2',
        category: 'Catering & Bar',
        businessName: 'Artisan Harvest Catering',
        contactName: 'Chef Clara Ramos',
        email: 'clara@artisanharvestcatering.com',
        phone: '(555) 774-2190',
        status: 'booked',
        quotedAmount: 11400,
        depositAmount: 5700,
        balancePaid: 5700,
        contractNotes: '50% balance ($5,700) due 14 days prior to event date.'
      },
      {
        id: 'wv-3',
        category: 'Photography & Video',
        businessName: 'Loom & Lens Visuals',
        contactName: 'Tessa Morales',
        email: 'tessa@loomandlens.com',
        phone: '(555) 623-4411',
        status: 'booked',
        quotedAmount: 4800,
        depositAmount: 2400,
        balancePaid: 2400,
        contractNotes: 'Remainder due day-of. Turnaround 6 weeks for full gallery.'
      },
      {
        id: 'wv-4',
        category: 'Floral & Decor',
        businessName: 'Wildflower & Willow Floral',
        contactName: 'Hannah Finch',
        email: 'hannah@wildflowerwillow.com',
        phone: '(555) 319-8802',
        status: 'booked',
        quotedAmount: 4400,
        depositAmount: 2200,
        balancePaid: 2200,
        contractNotes: 'Setup starts 11:30 AM. Tear down midnight.'
      },
      {
        id: 'wv-5',
        category: 'Music & Entertainment',
        businessName: 'SoundWave Collective (DJ & Strings)',
        contactName: 'Leo Vance',
        email: 'leo@soundwavecollective.com',
        phone: '(555) 912-4040',
        status: 'booked',
        quotedAmount: 2600,
        depositAmount: 1300,
        balancePaid: 1300,
        contractNotes: 'Needs 2 separate 120V circuits at conservatory stage.'
      }
    ],
    creativeIdeas: [
      {
        id: 'wi-1',
        category: 'decor',
        title: 'Living Botanical Chandelier with Hanging Amaranths',
        description: 'A suspended 14-foot canopy of preserved eucalyptus, dried baby’s breath, and terracotta-toned amaranth hanging directly above the head table, illuminated with micro-fairy lights.',
        estimatedImpact: 'High',
        tags: ['Floral', 'Statement Piece', 'Lighting'],
        isBookmarked: true,
        suggestedAction: 'Send sketch to Hannah at Wildflower & Willow'
      },
      {
        id: 'wi-2',
        category: 'experience',
        title: 'Vintage Rotary Phone Audio Guestbook',
        description: 'An ivory 1950s rotary telephone installed on a bistro table where guests record heartwarming voice messages and life advice after the beep.',
        estimatedImpact: 'High',
        tags: ['Interactive', 'Keepsake', 'Guest Fun'],
        isBookmarked: true,
        suggestedAction: 'Rent phone unit from After The Tone'
      },
      {
        id: 'wi-3',
        category: 'food_drink',
        title: 'Locally Sourced Artisanal Olive Oil Favor Bottles',
        description: 'Miniature 100ml dark glass bottles filled with Sonoma extra virgin olive oil, sealed with custom wax stamp bearing Elena & Marcus monogram.',
        estimatedImpact: 'Medium',
        tags: ['Gifts', 'Culinary', 'Eco-Friendly'],
        isBookmarked: false,
        suggestedAction: 'Order bottles from Valley Olive Press'
      },
      {
        id: 'wi-4',
        category: 'entertainment',
        title: 'Late Night Churros & Espresso Cart',
        description: 'A vintage wooden hand-cart popping up at 9:00 PM frying fresh cinnamon sugar churros served with warm Mexican spiced dipping chocolate and cortados.',
        estimatedImpact: 'High',
        tags: ['Late Night Snack', 'Cultural Touch', 'Crowd Pleaser'],
        isBookmarked: true,
        suggestedAction: 'Inquire with Churro Co catering'
      }
    ],
    guests: [
      { id: 'wg-1', name: 'Sofia & Carlos Alvarez', email: 'sofia.alvarez@example.com', rsvpStatus: 'attending', plusOnes: 1, dietaryRestrictions: 'Vegetarian', tableOrGroup: 'Table 1 - Family' },
      { id: 'wg-2', name: 'Julian & Maya Reed', email: 'julian.reed@example.com', rsvpStatus: 'attending', plusOnes: 1, dietaryRestrictions: 'None', tableOrGroup: 'Table 1 - Family' },
      { id: 'wg-3', name: 'Dr. Arthur Pendelton', email: 'arthur.p@example.com', rsvpStatus: 'attending', plusOnes: 0, dietaryRestrictions: 'Gluten-Free', tableOrGroup: 'Table 3 - College Friends' },
      { id: 'wg-4', name: 'Chloe Davenport', email: 'chloe.d@example.com', rsvpStatus: 'attending', plusOnes: 1, dietaryRestrictions: 'Vegan', tableOrGroup: 'Table 3 - College Friends' },
      { id: 'wg-5', name: 'Grandmother Teresa Alvarez', email: 'teresa.alvarez@example.com', rsvpStatus: 'attending', plusOnes: 0, dietaryRestrictions: 'Low Sodium', tableOrGroup: 'Table 1 - Family' },
      { id: 'wg-6', name: 'Marcus & Liam Sterling', email: 'm.sterling@example.com', rsvpStatus: 'declined', plusOnes: 1, dietaryRestrictions: 'None', tableOrGroup: 'Table 4' },
      { id: 'wg-7', name: 'Priya & Raj Patel', email: 'priya.patel@example.com', rsvpStatus: 'pending', plusOnes: 1, dietaryRestrictions: 'Vegetarian', tableOrGroup: 'Table 2' },
      { id: 'wg-8', name: 'Oliver Bennett', email: 'oliver.b@example.com', rsvpStatus: 'pending', plusOnes: 0, dietaryRestrictions: 'Nut Allergy', tableOrGroup: 'Table 2' }
    ]
  },
  {
    id: 'birthday-jessica-30th',
    title: "Jessica's 30th Rooftop Soirée",
    type: 'birthday',
    date: '2026-12-12',
    location: 'Altitude Glasshouse Terrace, Downtown Los Angeles, CA',
    guestCount: 65,
    targetBudget: 8500,
    currency: 'USD',
    styleTheme: 'Modern Noir & Champagne Glam (Matte Black, Warm Gold, Bistro Lights)',
    culturalNotes: 'Casual chic dress code; elevated cocktail party style with no formal seating.',
    description: 'An electric milestone 30th birthday featuring skyline views, crafted martinis, an all-vinyl R&B DJ, architectural floral accents, and a marble dessert installation.',
    coverImage: '/src/assets/images/birthday_milestone_celebration_1792753505351.jpg',
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-03-18T16:00:00.000Z',
    emergencyContacts: [
      { role: 'Party Organizer', name: 'Jessica Vance', phone: '(555) 712-9901' },
      { role: 'Rooftop Event Lead', name: 'Andre Costa', phone: '(555) 431-0022' }
    ],
    budgetItems: [
      {
        id: 'bb-1',
        category: 'Venue & Rentals',
        name: 'Skyline Terrace Semi-Private Buyout (5 hrs)',
        estimatedCost: 3000,
        actualCost: 3000,
        paidAmount: 3000,
        status: 'paid',
        vendorName: 'Altitude Rooftop Lounge',
        dueDate: '2026-03-01',
        notes: 'Includes lounge sofas, heaters, and panoramic skyline view.'
      },
      {
        id: 'bb-2',
        category: 'Catering & Bar',
        name: 'Artisan Sliders, Bao Buns & Passed Gourmet Bites',
        estimatedCost: 2000,
        actualCost: 2150,
        paidAmount: 1075,
        status: 'deposit_paid',
        vendorName: 'Altitude In-House Culinary',
        dueDate: '2026-10-15',
        notes: 'Truffle mac croquettes, pork belly bao, vegan mushroom sliders.'
      },
      {
        id: 'bb-3',
        category: 'Catering & Bar',
        name: 'Signature Martini Bar Tab (Espresso Martini & Lychee)',
        estimatedCost: 1500,
        actualCost: 1500,
        paidAmount: 750,
        status: 'deposit_paid',
        vendorName: 'Altitude Bar Staff',
        dueDate: '2026-11-01',
        notes: 'Open tab for first 2 rounds per guest; cash bar afterward.'
      },
      {
        id: 'bb-4',
        category: 'Music & Entertainment',
        name: 'Vinyl Soul & Nu-Disco DJ Set',
        estimatedCost: 800,
        actualCost: 800,
        paidAmount: 400,
        status: 'deposit_paid',
        vendorName: 'DJ K-Spin',
        dueDate: '2026-10-25',
        notes: '3.5 hour set with vinyl decks and custom lighting.'
      },
      {
        id: 'bb-5',
        category: 'Floral & Decor',
        name: 'Sculptural Balloon Arch & Custom LED Neon Sign',
        estimatedCost: 650,
        actualCost: 700,
        paidAmount: 700,
        status: 'paid',
        vendorName: 'Luxe Pop Decor',
        dueDate: '2026-03-10',
        notes: 'Neon sign: "Cheers to 30" in warm golden white.'
      },
      {
        id: 'bb-6',
        category: 'Photography & Video',
        name: 'Party Photographer (3 hrs candid & polaroids)',
        estimatedCost: 550,
        actualCost: 550,
        paidAmount: 275,
        status: 'deposit_paid',
        vendorName: 'Flash & Flow Photo',
        dueDate: '2026-11-01',
        notes: 'Includes on-site instant polaroid station and digital gallery.'
      }
    ],
    milestones: [
      { id: 'bm-1', title: 'Reserve rooftop terrace lounge date', targetDate: '2026-03-01', phase: '6_months', category: 'Venue', isCompleted: true },
      { id: 'bm-2', title: 'Send digital animated invites via Partiful/Paperless', targetDate: '2026-09-15', phase: '3_months', category: 'Invites', isCompleted: true },
      { id: 'bm-3', title: 'Order custom cake and marble dessert display', targetDate: '2026-10-10', phase: '1_month', category: 'Catering', isCompleted: false },
      { id: 'bm-4', title: 'Finalize DJ playlist must-plays and guest arrival flow', targetDate: '2026-11-05', phase: 'final_weeks', category: 'Music', isCompleted: false }
    ],
    dayOfSchedule: [
      { id: 'bs-1', time: '05:30 PM', title: 'Decor & Balloon Installation Arrival', durationMinutes: 60, leadPerson: 'Luxe Pop Decor', location: 'Terrace VIP Area', isCompleted: false },
      { id: 'bs-2', time: '06:30 PM', title: 'DJ Soundcheck & Lighting Setup', durationMinutes: 30, leadPerson: 'DJ K-Spin', location: 'DJ Booth', isCompleted: false },
      { id: 'bs-3', time: '07:00 PM', title: 'Guest Arrival & Sunset Welcome Cocktails', durationMinutes: 60, leadPerson: 'Jessica & Andre', location: 'Skyline Bar', isCompleted: false },
      { id: 'bs-4', time: '08:30 PM', title: 'Birthday Toast, Cake Presentation & Champagne Pour', durationMinutes: 25, leadPerson: 'Best Friend Samantha', location: 'Lounge Center', isCompleted: false },
      { id: 'bs-5', time: '09:00 PM', title: 'High Energy Dance Floor & Late-Night Bites', durationMinutes: 120, leadPerson: 'DJ K-Spin', location: 'Main Terrace', isCompleted: false }
    ],
    vendors: [
      {
        id: 'bv-1',
        category: 'Venue & Rentals',
        businessName: 'Altitude Rooftop Lounge',
        contactName: 'Andre Costa',
        email: 'andre@altituderooftop.com',
        phone: '(555) 431-0022',
        status: 'booked',
        quotedAmount: 5150,
        depositAmount: 3000,
        balancePaid: 3000,
        contractNotes: 'Includes food minimum. Remainder settled at midnight.'
      },
      {
        id: 'bv-2',
        category: 'Music & Entertainment',
        businessName: 'DJ K-Spin (Soul & Beats)',
        contactName: 'Kevin Park',
        email: 'kevin@kspinmusic.com',
        phone: '(555) 881-2294',
        status: 'booked',
        quotedAmount: 800,
        depositAmount: 400,
        balancePaid: 400,
        contractNotes: 'Balance due cash or Venmo end of set.'
      }
    ],
    creativeIdeas: [
      {
        id: 'bi-1',
        category: 'experience',
        title: 'Decade Time Capsule Cocktail Menu',
        description: 'A 3-drink signature flight: "The 90s Kid" (Pop rock rimmed cosmos), "The 2010s Nostalgia" (Cold brew martini), and "The 30s Era" (Smoked rosemary French 75).',
        estimatedImpact: 'High',
        tags: ['Cocktails', 'Nostalgia', 'Menu Design'],
        isBookmarked: true
      },
      {
        id: 'bi-2',
        category: 'experience',
        title: '30 Things We Love About Jessica Memory Board',
        description: 'Matte black cards where guests write their favorite memory or compliment, pinned to an illuminated brass grid with wooden clothespins.',
        estimatedImpact: 'Medium',
        tags: ['Emotional', 'Guest Activity'],
        isBookmarked: true
      }
    ],
    guests: [
      { id: 'bg-1', name: 'Samantha Collins', email: 'sam.c@example.com', rsvpStatus: 'attending', plusOnes: 1, dietaryRestrictions: 'Gluten-Free' },
      { id: 'bg-2', name: 'Tariq Anderson', email: 'tariq@example.com', rsvpStatus: 'attending', plusOnes: 0, dietaryRestrictions: 'None' },
      { id: 'bg-3', name: 'Elena Vance', email: 'elena.v@example.com', rsvpStatus: 'attending', plusOnes: 1, dietaryRestrictions: 'None' },
      { id: 'bg-4', name: 'Maya Lin', email: 'maya.lin@example.com', rsvpStatus: 'pending', plusOnes: 0, dietaryRestrictions: 'Vegetarian' }
    ]
  },
  {
    id: 'community-oakridge-festival',
    title: 'Oakridge Fall Harvest & Street Market',
    type: 'community',
    date: '2027-05-15',
    location: 'Oakridge Historic Main Street & Town Commons, OR',
    guestCount: 850,
    targetBudget: 16500,
    currency: 'USD',
    styleTheme: 'Rustic Autumn Community Market (Heirloom Pumpkins, Warm Burlap & Local Art)',
    culturalNotes: 'Family-friendly, all-ages civic event; accessible ramps and quiet sensory zone.',
    description: 'An open neighborhood street festival celebrating local farmers, craft makers, live bluegrass bands, a youth pumpkin-carving zone, and regional food trucks.',
    coverImage: '/src/assets/images/community_street_festival_1792753505504.jpg',
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-03-12T11:00:00.000Z',
    emergencyContacts: [
      { role: 'Festival Director', name: 'Marcus Sterling', phone: '(555) 902-1133' },
      { role: 'Town Permit Officer', name: 'Officer Linda Ramos', phone: '(555) 555-0199' },
      { role: 'Volunteer Coordinator', name: 'Bethany Cross', phone: '(555) 744-8832' }
    ],
    budgetItems: [
      {
        id: 'cb-1',
        category: 'Permits, Safety & Logistics',
        name: 'City Street Closure Permit, Police Detail & EMT On-Site',
        estimatedCost: 3500,
        actualCost: 3200,
        paidAmount: 3200,
        status: 'paid',
        vendorName: 'City of Oakridge Public Works',
        dueDate: '2026-02-15',
        notes: 'Includes road barricades, 2 crossing officers, and certified paramedic standby.'
      },
      {
        id: 'cb-2',
        category: 'Permits, Safety & Logistics',
        name: 'Portable Restrooms (incl. ADA accessible) & Handwash Stations',
        estimatedCost: 1800,
        actualCost: 1850,
        paidAmount: 925,
        status: 'deposit_paid',
        vendorName: 'Cascade Clean Services',
        dueDate: '2026-09-15',
        notes: '6 standard units, 2 ADA accessible, 4 solar wash sinks.'
      },
      {
        id: 'cb-3',
        category: 'Music & Entertainment',
        name: 'Covered Mobile Stage, PA Sound Rig & Sound Engineer',
        estimatedCost: 2800,
        actualCost: 2800,
        paidAmount: 1400,
        status: 'deposit_paid',
        vendorName: 'Northwest Sound & Stage',
        dueDate: '2026-10-01',
        notes: '3 live local bands scheduled; mic sets and wireless monitors included.'
      },
      {
        id: 'cb-4',
        category: 'Music & Entertainment',
        name: 'Local Performer Honorariums (3 bands + dance troupe)',
        estimatedCost: 2200,
        actualCost: 2200,
        paidAmount: 0,
        status: 'planned',
        vendorName: 'Oakridge Community Arts Council',
        dueDate: '2026-10-31',
        notes: 'Paid via direct stipends on the day of performance.'
      },
      {
        id: 'cb-5',
        category: 'Floral & Decor',
        name: 'Cornstalks, Hay Bales, Heirloom Pumpkins & Festive Bunting',
        estimatedCost: 1400,
        actualCost: 1350,
        paidAmount: 1350,
        status: 'paid',
        vendorName: 'Miller Family Farm',
        dueDate: '2026-09-01',
        notes: 'All pumpkins will be donated to the local community soup kitchen post-event.'
      },
      {
        id: 'cb-6',
        category: 'Invitations & Collateral',
        name: 'Printed Vinyl Street Banners, Yard Signs & Event Maps',
        estimatedCost: 950,
        actualCost: 890,
        paidAmount: 890,
        status: 'paid',
        vendorName: 'Main Street Print Co.',
        dueDate: '2026-08-20',
        notes: '150 yard signs posted at civic intersections.'
      },
      {
        id: 'cb-7',
        category: 'Contingency & Buffer',
        name: 'Logistics Cushion & Waste Management Overages',
        estimatedCost: 1500,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        dueDate: '2026-10-31',
        notes: 'City trash bag disposal and volunteer snack budget.'
      }
    ],
    milestones: [
      { id: 'cm-1', title: 'Submit municipal street closure application', targetDate: '2026-02-15', phase: '12_months', category: 'Permits', isCompleted: true },
      { id: 'cm-2', title: 'Open artisan vendor booth registrations (cap at 45)', targetDate: '2026-04-01', phase: '6_months', category: 'Vendors', isCompleted: true },
      { id: 'cm-3', title: 'Contract mobile sound stage & portable sanitation', targetDate: '2026-07-15', phase: '3_months', category: 'Logistics', isCompleted: true },
      { id: 'cm-4', title: 'Hold volunteer leads orientation meeting (30 volunteers)', targetDate: '2026-10-15', phase: 'final_weeks', category: 'Staffing', isCompleted: false }
    ],
    dayOfSchedule: [
      { id: 'cs-1', time: '06:30 AM', title: 'Street Barricade Setup & Police Detail Briefing', durationMinutes: 60, leadPerson: 'Officer Linda Ramos', location: 'Main & 4th Ave', isCompleted: false },
      { id: 'cs-2', time: '07:30 AM', title: 'Artisan & Food Truck Staggered Load-In', durationMinutes: 90, leadPerson: 'Bethany Cross', location: 'Main Street Corridor', isCompleted: false },
      { id: 'cs-3', time: '09:30 AM', title: 'Volunteer Check-In & Safety Briefing', durationMinutes: 30, leadPerson: 'Marcus Sterling', location: 'Information Booth', isCompleted: false },
      { id: 'cs-4', time: '10:00 AM', title: 'Festival Gates Open to Public', durationMinutes: 60, leadPerson: 'All Volunteers', location: 'Entire Commons', isCompleted: false },
      { id: 'cs-5', time: '11:00 AM', title: 'Main Stage: Oakridge Youth Marimba Band', durationMinutes: 60, leadPerson: 'Stage Manager', location: 'Town Square Stage', isCompleted: false },
      { id: 'cs-6', time: '01:00 PM', title: 'Annual Heirloom Pie-Baking Contest Judging', durationMinutes: 45, leadPerson: 'Mayor & Guest Chefs', location: 'Pavilion Gazebo', isCompleted: false },
      { id: 'cs-7', time: '02:30 PM', title: 'Main Stage: The Cascade Bluegrass Trio', durationMinutes: 90, leadPerson: 'Band Leader', location: 'Town Square Stage', isCompleted: false },
      { id: 'cs-8', time: '05:00 PM', title: 'Festival Conclusion & Clean-Up Volunteer Sweep', durationMinutes: 120, leadPerson: 'Bethany & DPW', location: 'Corridor', isCompleted: false }
    ],
    vendors: [
      {
        id: 'cv-1',
        category: 'Permits, Safety & Logistics',
        businessName: 'Cascade Clean Sanitation',
        contactName: 'Gary Miller',
        email: 'gary@cascadesanitation.com',
        phone: '(555) 880-9912',
        status: 'booked',
        quotedAmount: 1850,
        depositAmount: 925,
        balancePaid: 925,
        contractNotes: 'Drop-off 6:00 AM sharp, pickup 7:30 PM.'
      },
      {
        id: 'cv-2',
        category: 'Music & Entertainment',
        businessName: 'Northwest Sound & Stage',
        contactName: 'Ronnie Briggs',
        email: 'ronnie@nwsoundstage.com',
        phone: '(555) 412-7788',
        status: 'booked',
        quotedAmount: 2800,
        depositAmount: 1400,
        balancePaid: 1400,
        contractNotes: 'Includes generator and weather awning canopy.'
      }
    ],
    creativeIdeas: [
      {
        id: 'ci-1',
        category: 'experience',
        title: 'Community Collaborative Chalk Mural',
        description: 'A 40-foot paved alleyway blocked off with chalk art prompts where kids and families contribute to a giant autumn harvest landscape illustration.',
        estimatedImpact: 'High',
        tags: ['Youth', 'Community Art', 'Free Activity'],
        isBookmarked: true
      },
      {
        id: 'ci-2',
        category: 'food_drink',
        title: 'Local Cider & Honey Tasting Pavilion',
        description: 'A dedicated tasting flight tent spotlighting 4 local apple orchards and wild mountain apiaries.',
        estimatedImpact: 'High',
        tags: ['Local Farm', 'Tasting', 'Fundraiser'],
        isBookmarked: true
      }
    ],
    guests: [
      { id: 'cg-1', name: 'Mayor Evelyn Torres', email: 'mayor@oakridge.gov', rsvpStatus: 'attending', plusOnes: 2, dietaryRestrictions: 'None', tableOrGroup: 'VIP / Judges' },
      { id: 'cg-2', name: 'Civic Volunteer Group (Lead Tim)', email: 'tim.volunteers@example.com', rsvpStatus: 'attending', plusOnes: 15, dietaryRestrictions: 'Vegetarian, Vegan', tableOrGroup: 'Volunteer Crew' }
    ]
  }
];
