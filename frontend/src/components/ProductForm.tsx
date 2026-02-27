import { useState } from 'react';
import type { Product, ProductCreatePayload } from '../types/products';
import { api } from '../api/api';
import axios from 'axios';

export function ProductForm({
    onCreated
}: {
    onCreated: (p: Product) => void;
}) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [inStock, setInStock] = useState(true);
    const [categoryId, setCategoryId] = useState<string>('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const payload: ProductCreatePayload = {
            name: name.trim(),
            price,
            in_stock: inStock
        };
        if (categoryId.trim() !== '') payload.category_id = Number(categoryId);

        try {
            const res = await api.post<Product>('/products/', payload);
            onCreated(res.data);
            setName('');
            setPrice('0.00');
            setInStock(true);
            setCategoryId('');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const data = err.response?.data;
                if (typeof data === 'string') {
                    setError(data);
                    return;
                }
                if (data && typeof data === 'object') {
                    const obj = data as Record<string, unknown>;

                    if (typeof obj.detail === 'string') {
                        setError(obj.detail);
                        return;
                    }

                    const firstKey = Object.keys(obj)[0];
                    const firstVal = firstKey ? obj[firstKey] : undefined;

                    if (
                        Array.isArray(firstVal) &&
                        typeof firstVal[0] === 'string'
                    ) {
                        setError(firstVal[0]);
                        return;
                    }

                    if (typeof firstVal === 'string') {
                        setError(firstVal);
                        return;
                    }
                }
                setError(err.message || 'Erro ao criar produto.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro inesperado ao criar produto.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 w-full">
            <div className="px-6 pt-6">
                <p className=" text-md font-medium text-slate-700">
                    Registro de novo produto
                </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-5">
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                            Nome
                        </span>
                        <input
                            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Teclado Mecânico"
                            required
                        />
                    </label>

                    <label className="grid gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                            Preço
                        </span>
                        <input
                            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="299.90"
                            inputMode="decimal"
                            required
                        />
                    </label>

                    <label className="grid gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                            Estoque
                        </span>
                        <select
                            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
                            value={inStock ? 'true' : 'false'}
                            onChange={e =>
                                setInStock(e.target.value === 'true')
                            }
                        >
                            <option value="true">Em estoque</option>
                            <option value="false">Sem estoque</option>
                        </select>
                    </label>

                    <label className="grid gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                            Categoria
                        </span>
                        <input
                            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            placeholder="1"
                            inputMode="numeric"
                        />
                    </label>
                </div>

                {error ? (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 h-14 w-full rounded-2xl bg-yellow-400 text-lg font-extrabold tracking-wide text-slate-900 shadow-[0_10px_20px_rgba(234,179,8,0.35)] transition hover:bg-yellow-300 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                >
                    {loading ? 'SALVANDO...' : 'CRIAR PRODUTO'}
                </button>
            </form>
        </div>
    );
}
