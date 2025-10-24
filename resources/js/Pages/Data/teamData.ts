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
    role: 'Project Manager',
    img: '/assets/images/devs/daryl.png',
    alt_img: '/assets/images/devs/daryl_alt.png'
  },
  {
    id: 2,
    name: 'Jieselle May Coquilla',
    role: 'UI/UX Designer',
    img: '/assets/images/devs/jieselle.png',
    alt_img: '/assets/images/devs/jieselle_alt.png'
  },
  {
    id: 3,
    name: 'Mark Joseph Jarantilla',
    role: 'Frontend Developer',
    img: '/assets/images/devs/mark.png',
    alt_img: '/assets/images/devs/mark_alt.png'
  },
  {
    id: 4,
    name: 'Rodwin Timonera',
    role: 'Backend Developer',
    img: '/assets/images/devs/rodwin.png',
    alt_img: '/assets/images/devs/rodwin_alt.png'
  },
  {
    id: 5,
    name: 'Jefferson Rivas',
    role: 'Data Analyst',
    img: '/assets/images/devs/jeff.png',
    alt_img: '/assets/images/devs/jeff_alt.png'
  },
]
