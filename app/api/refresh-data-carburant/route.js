import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

let isRefreshing = false;

export async function GET(request) {
    // protection anti-appel public
    // const auth = request.headers.get("authorization");

    // if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return NextResponse.json(
    //         { error: "Unauthorized" },
    //         { status: 401 }
    //     );
    // }

    // évite refresh multiples simultanés
    if (isRefreshing) {
        return NextResponse.json(
            { error: "Refresh already running" },
            { status: 429 }
        );
    }

    try {
        isRefreshing = true;

        // téléchargement dataset
        const response = await fetch(
            "https://www.data.gouv.fr/api/1/datasets/r/c465b7f9-f2d7-4e32-a575-d9d69494d112",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Download failed");
        }

        const data = await response.json();

        // chemin fichier
        const filePath = path.join(process.cwd(), "prixCarburant", "dataset.json");

        // écriture JSON
        await fs.writeFile(
            filePath,
            JSON.stringify(data, null, 2),
            "utf-8"
        );

        return NextResponse.json({
            success: true,
            updatedAt: new Date()
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false },
            { status: 500 }
        );

    } finally {
        isRefreshing = false;
    }
}