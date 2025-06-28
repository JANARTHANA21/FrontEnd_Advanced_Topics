import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom';
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

const queryClient = new QueryClient();

// Home Component with Mutation
function Home() {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
  });

  const mutation = useMutation({
    mutationFn: async (newProduct) => {
      const res = await axios.post('https://dummyjson.com/products/add', {
        ...newProduct,
        price: Number(newProduct.price),
      });
      return res.data;
    },
    onSuccess: (data) => {
      alert(`Product added: ${data.title}`);
    },
    onError: (error) => {
      alert(`Failed to add: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(product);
  };

  return (
    <div>
      <h1>Add Product (useMutation)</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
        <input
          type="text"
          placeholder="Title"
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting...' : 'Add Product'}
        </button>
      </form>

      {mutation.isError && <p style={{ color: 'red' }}>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p style={{ color: 'green' }}>Added: {mutation.data.title}</p>}
    </div>
  );
}

// Regular Fetch without React Query
function Regularfetch() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetching = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get('https://dummyjson.com/products');
      setData(res.data.products);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetching();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  return (
    <>
      <h2>Regular Fetch</h2>
      {data.map((item) => (
        <h4 key={item.id}>{item.title}</h4>
      ))}
    </>
  );
}

// React Query fetch with button
function UsequeryFetch() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['Products'],
    queryFn: async () => {
      const res = await axios.get('https://dummyjson.com/products');
      return res.data.products;
    },
    enabled: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  return (
    <>
      <h2>Query Fetch (Click to Load)</h2>
      <ul>
        {data?.map((item) => (
          <li key={item.id}>
            <Link to={`/usequeryfetch/${item.id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
      <button onClick={refetch}>Load Data</button>
    </>
  );
}

// Fetch product details by ID
function Usequeryfetchbyid() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axios.get(`https://dummyjson.com/products/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading product</p>;

  return (
    <>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <p>Price: ₹{data.price}</p>
      <img src={data.thumbnail} alt={data.title} width={200} />
      <br />
      <button onClick={() => navigate(-1)}>Go Back</button>
    </>
  );
}

// Pagination using buttons
function PaginationWithPageButtons() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', page],
    queryFn: async () => {
      const skip = (page - 1) * limit;
      const res = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const totalPages = Math.ceil(data.total / limit);

  return (
    <>
      <h2>Paginated Products (Page {page})</h2>
      {data.products.map((item) => (
        <h4 key={item.id}>{item.title}</h4>
      ))}

      <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            style={{
              backgroundColor: page === i + 1 ? 'black' : 'white',
              color: page === i + 1 ? 'white' : 'black',
              padding: '5px 10px',
              border: '1px solid gray',
              borderRadius: '5px',
            }}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </>
  );
}

// Infinite scroll (with button)
function Infinitescroll() {
  const {
    data,
    isError,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['infiniteproducts'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axios.get(`https://dummyjson.com/products?limit=10&skip=${pageParam}`);
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * 10;
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Infinite Scroll (Button)</h1>
      {data.pages.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.products.map((i) => (
            <div key={i.id}>{i.title}</div>
          ))}
        </React.Fragment>
      ))}
      <button disabled={!hasNextPage} onClick={fetchNextPage}>Load More</button>
    </>
  );
}

// Infinite scroll (auto load)
function Infinitescrollautomate() {
  const {
    data,
    isError,
    error,
    isLoading,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['infiniteproducts'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axios.get(`https://dummyjson.com/products?limit=10&skip=${pageParam}`);
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * 10;
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Infinite Scroll (Auto Load)</h1>
      {data.pages.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.products.map((i) => (
            <div key={i.id}>{i.title}</div>
          ))}
        </React.Fragment>
      ))}
      <div ref={ref} style={{ textAlign: 'center', padding: '20px' }}>
        {isFetching ? 'Loading more...' : hasNextPage ? 'Scroll to load more' : 'No more data'}
      </div>
    </>
  );
}

// Main App
function App() {
  return (
    <div>
      <BrowserRouter>
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: '#eee',
            padding: '10px',
          }}
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/regular">Regular Fetch</NavLink>
          <NavLink to="/usequeryfetch">Query Fetch</NavLink>
          <NavLink to="/pagination">Pagination</NavLink>
          <NavLink to="/infinitescroll">Infinite Scroll (Button)</NavLink>
          <NavLink to="/infinitescrollautomate">Infinite Scroll (Auto)</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regular" element={<Regularfetch />} />
          <Route path="/usequeryfetch" element={<UsequeryFetch />} />
          <Route path="/usequeryfetch/:id" element={<Usequeryfetchbyid />} />
          <Route path="/pagination" element={<PaginationWithPageButtons />} />
          <Route path="/infinitescroll" element={<Infinitescroll />} />
          <Route path="/infinitescrollautomate" element={<Infinitescrollautomate />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}