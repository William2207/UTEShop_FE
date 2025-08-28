import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState("newest");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/products", {
                    params: { page, limit: 12, sort }
                });
                setProducts(res.data.items);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error("Lỗi khi load sản phẩm:", err);
            }
        };
        fetchData();
    }, [page, sort]);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="best-selling">Bán chạy</option>
                    <option value="most-viewed">Xem nhiều</option>
                    <option value="top-discount">Khuyến mãi</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span>
                    Trang {page} / {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

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

export default ProductListPage;
