import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";

const HomePage = () => {
    const [blocks, setBlocks] = useState(null);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const res = await axios.get("/products/home-blocks");
                setBlocks(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy home blocks:", err);
            }
        };
        fetchBlocks();
    }, []);

    if (!blocks) return <p className="text-center">Đang tải...</p>;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <Section title="Sản phẩm mới nhất" products={blocks.newest} />
            <Section title="Sản phẩm bán chạy" products={blocks.bestSelling} />
            <Section title="Sản phẩm xem nhiều" products={blocks.mostViewed} />
            <Section title="Khuyến mãi cao nhất" products={blocks.topDiscount} />
        </div>
    );
};

const Section = ({ title, products }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
                <ProductCard key={p._id} product={p} />
            ))}
        </div>
    </div>
);

const ProductCard = ({ product }) => (
    <div className="border rounded-lg p-3 shadow hover:shadow-md">
        <img
            src={product.images?.[0] || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-full h-40 object-cover rounded"
        />
        <h3 className="mt-2 font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">
            {product.price.toLocaleString()}₫
        </p>
    </div>
);

export default HomePage;
