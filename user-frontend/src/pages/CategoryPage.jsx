import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductsCard from "../components/ProductsCard";

function CategoryPage(){
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    let isMounted = true;
    (async ()=>{
      try{
        const [catRes, productsRes] = await Promise.all([
          api.get(`/categories`),
          api.get(`/products`, { params: { category: id, limit: 48 } }),
        ]);
        const catData = catRes.data;
        const categories = Array.isArray(catData) ? catData : (catData?.categories || []);
        const current = categories.find((c)=> String(c?._id) === String(id));
        if(isMounted){
          setCategory(current || null);
          const pData = productsRes.data;
          const list = Array.isArray(pData) ? pData : (pData?.products || []);
          setProducts(list);
        }
      }catch(err){
        setError("Failed to load category/products");
      }finally{
        if(isMounted) setLoading(false);
      }
    })();
    return ()=>{ isMounted = false };
  },[id]);

  if(loading) return <div className="p-8 text-center">Loading...</div>;
  if(error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{category?.name || 'Category'}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p)=> (
          <div key={p._id}>
            <ProductsCard id={p._id} image={p.image} alt={p.name} title={p.name} price={`Rs. ${p.price}`} status={p.status || 'available'} />
          </div>
        ))}
      </div>
      {/* TODO: UI polish */}
    </div>
  );
}

export default CategoryPage;


