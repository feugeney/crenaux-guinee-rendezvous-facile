import { Offer } from '@/types';

export const coaches = [
  {
    name: "Domani Doré",
    speciality: "Coaching politique et leadership",
    imageUrl: "/lovable-uploads/bf4a0354-13be-43ba-98a9-a4dbd932fd80.png"
  }
];

export const scheduleData = [
  {
    date: "2024-06-14",
    slots: [
      {
        id: "1",
        day_of_week: 5,
        start_time: "09:00",
        end_time: "10:00",
        available: true,
        is_recurring: true,
        created_at: "",
        updated_at: ""
      }
    ]
  }
];

export const offerCategories = [
  'Coaching politique',
  'Leadership',
  'Formation',
  'Consultation stratégique'
];

export const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Consultation stratégique personnalisée',
    description: 'Une séance de consultation individuelle pour définir votre stratégie politique et vos objectifs de carrière.',
    price: 150,
    category: 'Consultation stratégique',
    image_url: '/lovable-uploads/4f321e46-6996-4c12-ba28-4f2fa751dac9.png',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Atelier de leadership pour femmes',
    description: 'Un atelier intensif pour développer vos compétences en leadership et atteindre vos objectifs professionnels.',
    price: 250,
    category: 'Leadership',
    image_url: '/lovable-uploads/64954197-6949-4191-845a-5d919889019f.png',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Formation en communication politique',
    description: 'Apprenez à maîtriser l\'art de la communication politique et à convaincre votre public.',
    price: 100,
    category: 'Formation',
    image_url: '/lovable-uploads/64954197-6949-4191-845a-5d919889019f.png',
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Coaching personnalisé pour élections',
    description: 'Un accompagnement sur mesure pour préparer votre campagne électorale et maximiser vos chances de succès.',
    price: 300,
    category: 'Coaching politique',
    image_url: '/lovable-uploads/4f321e46-6996-4c12-ba28-4f2fa751dac9.png',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Séminaire "Femmes et Pouvoir"',
    description: 'Un séminaire inspirant pour les femmes qui souhaitent prendre leur place dans les sphères de décision.',
    price: 200,
    category: 'Leadership',
    image_url: '/lovable-uploads/64954197-6949-4191-845a-5d919889019f.png',
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
];
