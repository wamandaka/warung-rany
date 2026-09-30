import { getProducts } from "@/services/products";
import EditProductClient from "@/components/admin/EditProductClient";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  return <EditProductClient id={id} />;
}
