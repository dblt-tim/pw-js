/**
 * @version 1.0.0
 * @description v1.0.0 : Premier affichage des radars
 */

"use client"

import '@/app/styles/pages/voyager.css'

import data from "@/radars/data";

export default function Radars() {
    const columns = Object.keys(data[0]);

    return (
        <table border="1">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column}>{column}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {columns.map((column) => (
                            <td key={column}>{row[column]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}