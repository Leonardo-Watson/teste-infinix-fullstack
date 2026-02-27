import './index.css';
import { useEffect, useMemo, useState } from 'react';
import { api } from './api/api';
import type { Product } from './types/products';
import { ProductCard } from './components/ProductCard';
import { ProductForm } from './components/ProductForm';
import axios from 'axios';

export default function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [errorList, setErrorList] = useState<string | null>(null);

    async function fetchProducts() {
        setErrorList(null);
        setLoadingList(true);
        try {
            const res = await api.get<Product[]>('/products/');
            setProducts(res.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const message =
                    typeof err.response?.data === 'string'
                        ? err.response.data
                        : JSON.stringify(err.response?.data);

                setErrorList(message ?? err.message);
            } else if (err instanceof Error) {
                setErrorList(err.message);
            } else {
                setErrorList('Erro inesperado ao carregar produtos.');
            }
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
    }, [products]);

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto max-w-5xl p-6">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Produtos
                    </h1>
                </header>

                <div className="grid gap-6 lg:grid-cols-1">
                    <div className="lg:col-span-1">
                        <ProductForm
                            onCreated={newProduct =>
                                setProducts(prev => [newProduct, ...prev])
                            }
                        />
                    </div>

                    <div className="lg:col-span-2 p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Listagem de Produtos
                            </h2>
                            <span className="text-sm text-slate-600">
                                Quantidade de itens {products.length}
                            </span>
                        </div>

                        {loadingList ? (
                            <p className="text-slate-600">Carregando...</p>
                        ) : null}
                        {errorList ? (
                            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {errorList}
                            </p>
                        ) : null}

                        {!loadingList &&
                        !errorList &&
                        sortedProducts.length === 0 ? (
                            <p className="text-slate-600">
                                Nenhum produto cadastrado.
                            </p>
                        ) : null}

                        <div className="grid gap-4 sm:grid-cols-2">
                            {sortedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
