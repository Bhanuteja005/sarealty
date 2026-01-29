import { searchProperties } from "@/lib/mls-api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'html') {
        // Return raw HTML for debugging
        const MLS_API_BASE = 'https://ntrdd.mlsmatrix.com/Matrix/Public/IDXSearch.aspx';
        const MLS_COMPRESSED_C = 'H4sIAAAAAAAEAItWMlDSySvNyRklqEEoHeqJqDq8Gz1IYwH6GM0lZwEAAA))';
        const MLS_API_KEY = 'c2c9438e';

        const urlString = `${MLS_API_BASE}?c=${MLS_COMPRESSED_C}&idx=${MLS_API_KEY}&page=1&perPage=25`;

        try {
            const res = await fetch(urlString);
            const html = await res.text();
            return new Response(html, {
                headers: { 'Content-Type': 'text/html' }
            });
        } catch (error) {
            return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    try {
        const result = await searchProperties({ page: 1, perPage: 25 });
        return NextResponse.json({
            success: true,
            data: {
                total: result.total,
                totalPages: result.totalPages,
                itemsCount: result.items.length,
                firstItem: result.items[0] || null
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}