
'use client';

import type { Design } from '@/lib/types';

const PIXELS_PER_FOOT = 20;

// Helper to convert hex to rgba, returns original string if invalid
export const hexToRgba = (hex: string, alpha: number): string => {
    if (!hex || typeof hex !== 'string') return `rgba(128, 128, 128, ${alpha})`;

    const hexValue = hex.startsWith('#') ? hex.substring(1) : hex;

    // Basic check for named colors, returns a default grey
    if (!/^[A-Fa-f0-9]{3,6}$/.test(hexValue)) {
        return `rgba(128, 128, 128, ${alpha})`;
    }

    let r = 0, g = 0, b = 0;

    try {
        if (hexValue.length === 3) {
            r = parseInt(hexValue[0] + hexValue[0], 16);
            g = parseInt(hexValue[1] + hexValue[1], 16);
            b = parseInt(hexValue[2] + hexValue[2], 16);
        } else if (hexValue.length === 6) {
            r = parseInt(hexValue.substring(0, 2), 16);
            g = parseInt(hexValue.substring(2, 4), 16);
            b = parseInt(hexValue.substring(4, 6), 16);
        } else {
            return `rgba(128, 128, 128, ${alpha})`;
        }
    } catch (e) {
        return `rgba(128, 128, 128, ${alpha})`;
    }


    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


import React, { useRef, useEffect } from 'react';

// --- Computer Graphics Algorithms: Isometric Projection & Rasterization --- //
export function IsometricView({ design }: { design: Design }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const PIXELS_PER_FOOT = 20;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const roomWidth = design.room.width * PIXELS_PER_FOOT;
        const roomDepth = design.room.depth * PIXELS_PER_FOOT;
        const roomHeight = design.room.height * PIXELS_PER_FOOT;

        const renderOriginX = canvas.width / 2;
        const renderOriginY = canvas.height * 0.35; // Start higher up so the room drawn downwards fits

        // Cartesian to Isometric Projection Mathematics
        const projectIso = (x: number, y: number, z: number) => {
            // Standard Isometric projection angles (30 degrees)
            const isoX = (x - y) * Math.cos(Math.PI / 6);
            const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
            return { x: renderOriginX + isoX, y: renderOriginY + isoY };
        };

        const drawPolygon = (points: { x: number, y: number }[], color: string, border: string) => {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = border;
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        const drawBox = (x: number, y: number, z: number, w: number, d: number, h: number, baseColorHex: string) => {
            // Calculate the 8 vertices of a 3D bounding box
            const p0 = projectIso(x, y, z);             // Bottom-Front-Left
            const p1 = projectIso(x + w, y, z);         // Bottom-Front-Right
            const p2 = projectIso(x + w, y + d, z);     // Bottom-Back-Right
            const p3 = projectIso(x, y + d, z);         // Bottom-Back-Left
            const p4 = projectIso(x, y, z + h);         // Top-Front-Left
            const p5 = projectIso(x + w, y, z + h);     // Top-Front-Right
            const p6 = projectIso(x + w, y + d, z + h); // Top-Back-Right
            const p7 = projectIso(x, y + d, z + h);     // Top-Back-Left

            // Render Back Faces (Painter's Algorithm constraint - draw furthest first)
            // Left Wall (p0, p3, p7, p4)
            drawPolygon([p0, p3, p7, p4], hexToRgba(baseColorHex, 0.2), baseColorHex);
            // Right Wall (p3, p2, p6, p7)
            drawPolygon([p3, p2, p6, p7], hexToRgba(baseColorHex, 0.1), baseColorHex);

            // Floor / Bottom
            drawPolygon([p0, p1, p2, p3], hexToRgba(baseColorHex, 0.3), baseColorHex);

            // Render Front Faces
            // Front Right Wall (p1, p2, p6, p5)
            drawPolygon([p1, p2, p6, p5], hexToRgba(baseColorHex, 0.4), baseColorHex);
            // Front Left Wall (p0, p1, p5, p4) 
            drawPolygon([p0, p1, p5, p4], hexToRgba(baseColorHex, 0.5), baseColorHex);

            // Top Face
            drawPolygon([p4, p5, p6, p7], hexToRgba(baseColorHex, 0.6), baseColorHex);
        };

        // 1. Draw Room (Floor and Back Walls)
        // We draw the room walls first so furniture renders ON TOP (Painter's Algorithm)

        // Floor Base
        const pFloor0 = projectIso(0, 0, 0);
        const pFloor1 = projectIso(roomWidth, 0, 0);
        const pFloor2 = projectIso(roomWidth, roomDepth, 0);
        const pFloor3 = projectIso(0, roomDepth, 0);
        drawPolygon([pFloor0, pFloor1, pFloor2, pFloor3], hexToRgba(design.room.color, 0.1), 'rgba(0,0,0,0.2)');

        // Left Back Wall
        const pLWall0 = projectIso(0, roomDepth, 0);
        const pLWall1 = projectIso(0, 0, 0);
        const pLWall2 = projectIso(0, 0, roomHeight);
        const pLWall3 = projectIso(0, roomDepth, roomHeight);
        drawPolygon([pLWall0, pLWall1, pLWall2, pLWall3], hexToRgba(design.room.color, 0.05), 'rgba(0,0,0,0.1)');

        // Right Back Wall
        const pRWall0 = projectIso(0, roomDepth, 0);
        const pRWall1 = projectIso(roomWidth, roomDepth, 0);
        const pRWall2 = projectIso(roomWidth, roomDepth, roomHeight);
        const pRWall3 = projectIso(0, roomDepth, roomHeight);
        drawPolygon([pRWall0, pRWall1, pRWall2, pRWall3], hexToRgba(design.room.color, 0.08), 'rgba(0,0,0,0.1)');

        // 2. Depth Sorting (Painter's Algorithm implementation)
        // Sort furniture strictly by their depth (y-axis + x-axis furthest from camera)
        // In isometric projection, items further "back" have larger Y and X values, 
        // but distance from the camera origin (0,0,0) generally works for simple bounding boxes.
        const sortedFurniture = [...design.furniture].sort((a, b) => {
            const distA = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
            const distB = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2));
            return distB - distA; // Draw furthest first
        });

        // 3. Rasterize Furniture
        sortedFurniture.forEach(item => {
            const itemWidth = item.width / 12 * PIXELS_PER_FOOT;
            const itemDepth = item.depth / 12 * PIXELS_PER_FOOT;
            const itemHeight = item.height / 12 * PIXELS_PER_FOOT;

            // Notice we treat item.x and item.y relative to the back corner (0,0) intuitively, 
            // matching the DOM renderer logic but correcting for the true cartesian grid.
            const itemX = item.x / 12 * PIXELS_PER_FOOT;
            const itemY = item.y / 12 * PIXELS_PER_FOOT;

            drawBox(itemX, itemY, 0, itemWidth, itemDepth, itemHeight, item.color);
        });

    }, [design]);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-[70vh] rounded-lg">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-contain"
                aria-label="3D Isometric Canvas representation of design"
            />
            <p className="text-sm text-muted-foreground mt-8">A rasterized 3D representation using custom graphics algorithms.</p>
        </div>
    );
}
