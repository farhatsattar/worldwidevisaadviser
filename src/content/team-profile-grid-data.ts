export type TeamProfileMember = {
  name: string;
  level: string;
  points: number;
  imageSrc: string;
};

export const teamProfileMembers: TeamProfileMember[] = [
  {
    name: "Nadeem",
    level: "Basic",
    points: 12,
    imageSrc: "/images/nadeem.jfif",
  },
  {
    name: "Zain Malik",
    level: "Basic",
    points: 15,
    imageSrc: "/images/zain1.jfif",
  },
  {
    name: "Muhammad Shahid",
    level: "Basic",
    points: 8,
    imageSrc: "/images/image1.jfif",
  },
  {
    name: "Hamza",
    level: "Basic",
    points: 5,
    imageSrc: "/images/hamza.jfif",
  },
  {
    name: "Abdul Ghaffar",
    level: "Basic",
    points: 0,
    imageSrc: "/images/ghaffar.jpg",
  },
];
