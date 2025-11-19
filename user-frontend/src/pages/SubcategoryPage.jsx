import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductsCard from "../components/ProductsCard";

function SubcategoryPage(){
  const { categoryId, subcategorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    let isMounted = true;
    (async ()=>{
      try{
        const [catRes, productsRes] = await Promise.all([
          api.get(`/categories`),
          api.get(`/products`, { params: { category: categoryId, subcategory: subcategorySlug, limit: 48 } }),
        ]);
        const catData = catRes.data;
        const categories = Array.isArray(catData) ? catData : (catData?.categories || []);
        const current = categories.find((c)=> String(c?._id) === String(categoryId));
        
        if(isMounted){
          setCategory(current || null);
          
          // Find the specific subcategory
          if (current && current.subcategories) {
            const currentSubcategory = current.subcategories.find(
              sub => sub.slug === subcategorySlug && sub.isActive
            );
            setSubcategory(currentSubcategory || null);
          }
          
          const pData = productsRes.data;
          const list = Array.isArray(pData) ? pData : (pData?.products || []);
          setProducts(list);
        }
      }catch(err){
        setError("Failed to load subcategory/products");
      }finally{
        if(isMounted) setLoading(false);
      }
    })();
    return ()=>{ isMounted = false };
  },[categoryId, subcategorySlug]);

  if(loading) return <div className="p-8 text-center">Loading...</div>;
  if(error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if(!subcategory) return <div className="p-8 text-center text-red-600">Subcategory not found</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <nav className="text-sm text-gray-500 mb-2">
          <button 
            onClick={() => navigate(`/categories/${categoryId}`)}
            className="hover:text-blue-600"
          >
            {category?.name || 'Category'}
          </button>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{subcategory.name}</span>
        </nav>
        <h1 className="text-3xl font-bold mb-2">{subcategory.name}</h1>
        <p className="text-gray-600">
          Products in {category?.name || 'Category'} › {subcategory.name}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p)=> (
          <div key={p._id}>
            <ProductsCard 
              id={p._id} 
              image={p.image} 
              images={p.images}
              alt={p.name} 
              title={p.name} 
              price={`Rs. ${p.price}`}
              status={p.status || 'available'}
              displayDescription={p.displayDescription}
              isCreateHype={p.isCreateHype}
              isHotSelling={p.isHotSelling}
            />
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this subcategory.</p>
        </div>
      )}
    </div>
  );
}

export default SubcategoryPage;
