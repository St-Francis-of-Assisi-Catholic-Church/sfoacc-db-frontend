export interface DataRows {
  id: number;
  name?: string;
  title?: string;
  email?: string;
  role?: string;
  details: {
    city?: string;
    experience?: string;
    post?: string;
  };
}

export const users = [
  {
    id: 1,
    name: "Mark Dsuza",
    title: "UX/UI Designer",
    email: "markdsuza@gmail.com",
    role: "admin",
    details: {
      city: "dhaka",
      experience: "2 years",
      post: "software engineer",
    },
  },
  {
    id: 2,
    name: "Josef Jennyfer",
    title: "Laravel Developer",
    email: "josefjennyfer@gmail.com",
    role: "member",
    details: {
      city: "Rajshahi",
      experience: "2 years",
      post: "Laravel Developer",
    },
  },
];
