export interface Certification {
  id: string;
  title: string;
  provider: string;

  /** Provider/marketing page */
  url?: string;

  /** Public certificate PDF (stored in /public) */
  certificatePdfUrl?: string;

  /** Public verification URL (e.g., Skilljar, Credly, Microsoft Learn) */
  verifyUrl?: string;

  imageUrl?: string;
  status: "wanted" | "in-progress" | "earned";
}

export const certifications: Certification[] = [
  {
    id: "finops",
    title: "FinOps Certified Practitioner",
    provider: "FinOps Foundation / Skilljar",
    certificatePdfUrl: "/docs/certifications/certificate-finops.pdf",
    verifyUrl: "http://verify.skilljar.com/c/6d2w9kw8fb7z",
    imageUrl: "/certifications-icon/intro-Finops.png",
    status: "earned",
  },
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

