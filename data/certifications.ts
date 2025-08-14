export interface Certification {
  id: string;
  title: string;
  provider: string;
  url?: string;
  imageUrl?: string;
  status: "wanted" | "in-progress" | "earned";
}

export const certifications: Certification[] = [
  {
    id: "aws-dev-assoc",
    title: "AWS Certified Developer – Associate",
    provider: "AWS",
    url: "https://aws.amazon.com/certification/certified-developer-associate/",
    // Official badge asset generally requires portal; using doc URL for now
    imageUrl: "/certifications-icon/dva-badge-resized.png",
    status: "wanted",
  },
  {
    id: "aws-sol-arch-assoc",
    title: "AWS Certified Solutions Architect – Associate",
    provider: "AWS",
    url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    imageUrl: "/certifications-icon/saa-badge-resized.png",
    status: "wanted",
  },
  {
    id: "azure-developer-assoc",
    title: "Microsoft Certified: Azure Developer Associate",
    provider: "Microsoft",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
    imageUrl: "/certifications-icon/microsoft-certified-associate-badge.png",
    status: "wanted",
  },
  {
    id: "cka",
    title: "Certified Kubernetes Administrator (CKA)",
    provider: "The Linux Foundation / CNCF",
    url: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
    imageUrl: "/certifications-icon/cncf-badge.png",
    status: "wanted",
  },
  {
    id: "cw3bd",
    title: "Certified Web3 Blockchain Developer (CW3BD)",
    provider: "101 Blockchains",
    url: "https://101blockchains.com/certification/certified-web3-blockchain-developer/",
    imageUrl: "/certifications-icon/101-blockchains.png",
    status: "wanted",
  },
];

