import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import { ProductDetailView } from "@/components/products/ProductDetailView";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Menu Tidak Ditemukan",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Warung Rany`,
      description: product.description,
      images: [
        {
          url: product.imageUrl,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.categoryId);

  return <ProductDetailView product={product} category={category} />;
}
