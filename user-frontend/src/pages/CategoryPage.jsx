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
  const [allCategories, setAllCategories] = useState([]);
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
          setAllCategories(categories);
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

  const isDropLibraryCategory = category?.name?.toLowerCase() === 'drop library';
  const paddleLibraryCategory = allCategories.find((c) => 
    c.name?.toLowerCase() === 'paddle library'
  );
  const handleButtonClick = () => {
    if (paddleLibraryCategory) {
      navigate(`/categories/${paddleLibraryCategory._id}`);
    }
  };

  if(loading) return <div className="p-8 text-center">Loading...</div>;
  if(error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div style={isDropLibraryCategory ? { backgroundColor: '#2B2B2B', minHeight: '100vh' } : {}}>
      {isDropLibraryCategory && (
        <>
          <style>
            {`
              @media (min-width: 768px) {
                .exclusive-limited-text {
                  color: #9A9A9A !important;
                  font-size: 48px !important;
                }
              }
            `}
          </style>
          <div className="w-full relative">
            <img 
              src="/images/DROP_HOME copy.png" 
              alt="Drop Library" 
              className="w-full object-cover h-screen md:h-auto md:max-h-[600px]"
            />
            <div 
              className="absolute top-[40%] md:top-1/2 left-0 transform -translate-y-1/2"
              style={{ 
                zIndex: 10,
                marginLeft: '40px'
              }}
            >
              <div
                style={{
                  color: '#9A9A9A',
                  fontSize: '48px',
                  fontWeight: 700,
                  fontFamily: 'Kode Mono, monospace'
                }}
              >
                DROP TOP
              </div>
              <div
                className="exclusive-limited-text"
                style={{
                  color: '#4A4849',
                  fontSize: '32px',
                  fontWeight: 700,
                  fontFamily: 'Kode Mono, monospace',
                  marginTop: '10px'
                }}
              >
                EXCLUSIVE.LIMITED.
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4" style={{ zIndex: 10 }}>
              <button 
                onClick={handleButtonClick}
                className="cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/images/BUTTON-6 copy.png" 
                  alt="Go to Paddle Library" 
                  className="h-auto"
                  style={{ maxWidth: '300px' }}
                />
              </button>
            </div>
          </div>
          <div className="w-full text-center py-8 px-4">
            <p
              style={{
                fontFamily: 'Gasoek One, sans-serif',
                color: '#EBDBFF',
                fontSize: '24px',
                lineHeight: '1.4',
                maxWidth: '1200px',
                margin: '0 auto'
              }}
              className="md:text-3xl"
            >
              TOPSHOT PICKLEBALL PADDLES PAIR PERFECTLY WITH TOP TO EVOKE PEAK PERFORMANCE, DOMINANCE AND THE EDGE OVER!
            </p>
            <div className="w-full mt-8">
              <img 
                src="/images/Line 272 copy.png" 
                alt="Divider line" 
                className="w-full h-auto object-cover"
                style={{ maxHeight: '10px' }}
              />
            </div>
            <div className="w-full flex flex-col items-center mt-16 px-4">
              <img 
                src="/images/Frame 1686553387.png" 
                alt="Frame 1" 
                className="w-full md:max-w-xl h-auto object-contain mb-4"
              />
              <img 
                src="/images/Frame 1686553388 copy.png" 
                alt="Frame 2" 
                className="w-full md:max-w-xl h-auto object-contain mb-4"
              />
              <img 
                src="/images/Frame 1686553389 copy.png" 
                alt="Frame 3" 
                className="w-full md:max-w-xl h-auto object-contain mb-8"
              />
              <img 
                src="/images/Group 1698 copy.png" 
                alt="Group items" 
                className="w-full md:max-w-xl h-auto object-contain mb-6"
              />
            </div>
            <div className="w-full flex flex-col items-center px-4">
              <div className="w-full md:max-w-xl flex">
                <img 
                  src="/images/image 359.png" 
                  alt="Image 359" 
                  className="w-1/2 h-auto object-cover"
                />
                <img 
                  src="/images/image 357.png" 
                  alt="Image 357" 
                  className="w-1/2 h-auto object-cover"
                />
              </div>
              <div className="w-full md:max-w-xl relative">
                <img 
                  src="/images/image 358.png" 
                  alt="Image 358" 
                  className="w-full h-auto object-cover"
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 10,
                    fontFamily: 'Kode Mono, monospace',
                    color: '#9A9A9A',
                    fontSize: '32px',
                    fontWeight: 700
                  }}
                >
                  PRO
                </div>
              </div>
              <div className="w-full md:max-w-xl relative">
                <img 
                  src="/images/image 360.png" 
                  alt="Image 360" 
                  className="w-full h-auto object-cover"
                />
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 10,
                    fontFamily: 'Kode Mono, monospace',
                    color: '#9A9A9A',
                    fontSize: '32px',
                    fontWeight: 700
                  }}
                >
                  SPINNER
                </div>
              </div>
              <div className="w-full md:max-w-xl relative">
                <img 
                  src="/images/image 349.png" 
                  alt="Image 349" 
                  className="w-full h-auto object-cover"
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 10,
                    fontFamily: 'Kode Mono, monospace',
                    color: '#9A9A9A',
                    fontSize: '32px',
                    fontWeight: 700
                  }}
                >
                  HONEYCOMB POLYMER CORE
                </div>
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 10,
                    fontFamily: 'Kode Mono, monospace',
                    color: '#9A9A9A',
                    fontSize: '32px',
                    fontWeight: 700
                  }}
                >
                  EFC EDGE WALL
                </div>
              </div>
              <div className="w-full md:max-w-xl">
                <img 
                  src="/images/image 346.png" 
                  alt="Image 346" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-full md:max-w-xl">
                <img 
                  src="/images/image 348.png" 
                  alt="Image 348" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </>
      )}
      <div className="container mx-auto px-4 py-12">
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
              isHotSelling={p.isHotSelling} 
              isCreateHype={p.isCreateHype} 
            />
          </div>
        ))}
        </div>
        {/* TODO: UI polish */}
      </div>
    </div>
  );
}

export default CategoryPage;


