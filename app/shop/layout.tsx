import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop | EcoVerse',
  description: 'Browse and purchase eco-friendly products from EcoVerse',
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
