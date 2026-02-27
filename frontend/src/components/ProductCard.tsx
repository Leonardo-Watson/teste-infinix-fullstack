import type { Product } from '../types/products';

function formatBRL(price: string) {
    const n = Number(price);
    if (Number.isNaN(n)) return price;
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function ProductCard({ product }: { product: Product }) {
    const badgeClass = product.in_stock
        ? 'bg-green-100 text-green-800 ring-green-200'
        : 'bg-red-100 text-red-800 ring-red-200';

    return (
        <div className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-900">
                        {product.name}
                    </h3>

                    {product.category ? (
                        <p className="mt-1 truncate text-sm font-medium text-slate-500">
                            {product.category}
                        </p>
                    ) : (
                        <p className="mt-1 text-sm text-slate-400">
                            Sem categoria
                        </p>
                    )}
                </div>

                <span
                    className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeClass}`}
                >
                    {product.in_stock ? 'Em estoque' : 'Sem estoque'}
                </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
                <span className="text-sm font-medium text-slate-500">
                    Preço
                </span>
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                    {formatBRL(product.price)}
                </span>
            </div>
        </div>
    );
}
