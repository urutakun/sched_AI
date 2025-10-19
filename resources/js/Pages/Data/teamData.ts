export interface TeamMember {
  id: number;
  name: string;
  role: string;
  img: string;
  alt_img: string;
}

export const team: TeamMember[] = [
  {
    id: 1,
    name: 'Daryl John Cortes',
    role: 'Data Analyst',
    img: '/assets/images/devs/dev.png',
    alt_img: '/assets/images/devs/dev2.png'
  },
  {
    id: 2,
    name: 'Jieselle May Coquilla',
    role: 'UI/UX Designer',
    img: '/assets/images/devs/dev.png',
    alt_img: '/assets/images/devs/dev2.png'
  },
  {
    id: 3,
    name: 'Mark Joseph Jarantilla',
    role: 'Frontend Developer',
    img: '/assets/images/devs/dev.png',
    alt_img: '/assets/images/devs/dev2.png'
  },
  {
    id: 4,
    name: 'Rodwin Timonera',
    role: 'Backend Developer',
    img: '/assets/images/devs/dev.png',
    alt_img: '/assets/images/devs/dev2.png'
  },
]
