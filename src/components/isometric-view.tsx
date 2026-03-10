'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Design } from '@/lib/types';

const PIXELS_PER_FOOT = 20;

export const hexToRgba = (hex: string, alpha: number): string => {
    if (!hex || typeof hex !== 'string') return `rgba(128, 128, 128, ${alpha})`;
    const hexValue = hex.startsWith('#') ? hex.substring(1) : hex;
    if (!/^[A-Fa-f0-9]{3,6}$/.test(hexValue)) return `rgba(128, 128, 128, ${alpha})`;
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
        } else return `rgba(128, 128, 128, ${alpha})`;
    } catch (e) {
        return `rgba(128, 128, 128, ${alpha})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type Vec3 = { x: number, y: number, z: number };
type Point2D = { x: number, y: number };
type TransformedPoint = { sx: number, sy: number, depth: number };

type Face = {
    points3d: TransformedPoint[];
    color: string;
    border: string;
    ownerName: string | null;
    depthZ: number;
    projected?: Point2D[];
    isHovered?: boolean;
};

// Standard point-in-polygon algorithm (ray-casting)
function isPointInPolygon(point: Point2D, vs: Point2D[]) {
    let x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i].x, yi = vs[i].y;
        let xj = vs[j].x, yj = vs[j].y;
        let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export function IsometricView({ design }: { design: Design }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [yaw, setYaw] = useState(45);
    const [pitch, setPitch] = useState(60);
    const [hoveredName, setHoveredName] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState<Point2D>({ x: 0, y: 0 });

    // Store rendered polygons for hit testing
    const renderedFacesRef = useRef<Face[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const step = 5;
            switch (e.key) {
                case 'ArrowLeft': setYaw(y => (y + step) % 360); break;
                case 'ArrowRight': setYaw(y => (y - step + 360) % 360); break;
                case 'ArrowUp': setPitch(p => (p - step + 360) % 360); break;
                case 'ArrowDown': setPitch(p => (p + step) % 360); break;
                default: return;
            }
            e.preventDefault();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        // Scale mouse coordinates to match canvas internal resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const pos = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
        setMousePos(pos);

        // Hit testing against rendered faces (iterating backwards to check top-most first)
        const faces = renderedFacesRef.current;
        let foundHover: string | null = null;
        for (let i = faces.length - 1; i >= 0; i--) {
            const face = faces[i];
            if (face.ownerName && face.projected && isPointInPolygon(pos, face.projected)) {
                foundHover = face.ownerName;
                break;
            }
        }
        setHoveredName(foundHover);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredName(null);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const roomWidth = design.room.width * PIXELS_PER_FOOT;
        const roomDepth = design.room.depth * PIXELS_PER_FOOT;
        const roomHeight = design.room.height * PIXELS_PER_FOOT;

        const renderOriginX = canvas.width / 2;
        const renderOriginY = canvas.height / 2;

        // Transform pipeline
        const cx = roomWidth / 2;
        const cy = roomDepth / 2;
        const cz = roomHeight / 2;

        const yawRad = yaw * Math.PI / 180;
        const pitchRad = pitch * Math.PI / 180;

        const cosY = Math.cos(yawRad), sinY = Math.sin(yawRad);
        const cosP = Math.cos(pitchRad), sinP = Math.sin(pitchRad);

        const transform = (p: Vec3): TransformedPoint => {
            let x = p.x - cx;
            let y = p.y - cy;
            let z = p.z - cz;

            let x1 = x * cosY - y * sinY;
            let y1 = x * sinY + y * cosY;
            let z1 = z;

            let sx = x1;
            let depth = y1 * cosP - z1 * sinP;
            let sy = y1 * sinP + z1 * cosP;

            return { sx, sy, depth };
        };

        const generateBoxFaces = (x: number, y: number, z: number, w: number, d: number, h: number, baseColorHex: string, ownerName: string | null): Face[] => {
            const p0 = { x, y, z };
            const p1 = { x: x + w, y, z };
            const p2 = { x: x + w, y: y + d, z };
            const p3 = { x, y: y + d, z };
            const p4 = { x, y, z: z + h };
            const p5 = { x: x + w, y, z: z + h };
            const p6 = { x: x + w, y: y + d, z: z + h };
            const p7 = { x, y: y + d, z: z + h };

            const facesRaw = [
                { points: [p4, p5, p6, p7], alpha: 0.6 }, // Top
                { points: [p0, p3, p2, p1], alpha: 0.3 }, // Bottom
                { points: [p0, p1, p5, p4], alpha: 0.5 }, // Front
                { points: [p2, p3, p7, p6], alpha: 0.2 }, // Back
                { points: [p3, p0, p4, p7], alpha: 0.4 }, // Left
                { points: [p1, p2, p6, p5], alpha: 0.35 } // Right
            ];

            return facesRaw.map(faceInfo => {
                const transformed = faceInfo.points.map(transform);

                const avgDepth = transformed.reduce((sum, p) => sum + p.depth, 0) / 4;

                const v1 = { dx: transformed[1].sx - transformed[0].sx, dy: transformed[1].sy - transformed[0].sy };
                const v2 = { dx: transformed[2].sx - transformed[1].sx, dy: transformed[2].sy - transformed[1].sy };
                const crossProduct = v1.dx * v2.dy - v1.dy * v2.dx;

                let isFrontFacing = crossProduct > 0;
                if (ownerName === null) {
                    isFrontFacing = !isFrontFacing;
                }

                if (!isFrontFacing) {
                    return null;
                }

                return {
                    points3d: transformed,
                    color: hexToRgba(baseColorHex, ownerName === null ? faceInfo.alpha * 0.5 : faceInfo.alpha),
                    border: ownerName === null ? 'rgba(0,0,0,0.1)' : baseColorHex,
                    ownerName,
                    depthZ: avgDepth
                };
            }).filter(Boolean) as Face[];
        };

        const allFaces: Face[] = [];

        allFaces.push(...generateBoxFaces(0, 0, 0, roomWidth, roomDepth, 0.1, design.room.color, null));
        allFaces.push(...generateBoxFaces(0, 0, 0, 0.1, roomDepth, roomHeight, design.room.color, null));
        allFaces.push(...generateBoxFaces(0, roomDepth, 0, roomWidth, 0.1, roomHeight, design.room.color, null));

        design.furniture.forEach(item => {
            const itemWidth = item.width / 12 * PIXELS_PER_FOOT;
            const itemDepth = item.depth / 12 * PIXELS_PER_FOOT;
            const itemHeight = item.height / 12 * PIXELS_PER_FOOT;
            const itemX = item.x / 12 * PIXELS_PER_FOOT;
            const itemY = item.y / 12 * PIXELS_PER_FOOT;

            allFaces.push(...generateBoxFaces(itemX, itemY, 0, itemWidth, itemDepth, itemHeight, item.color, item.name));
        });

        allFaces.sort((a, b) => b.depthZ - a.depthZ);

        renderedFacesRef.current = [];

        allFaces.forEach(face => {
            const projectedPoints = face.points3d.map(p => ({
                x: renderOriginX + p.sx,
                y: renderOriginY - p.sy
            }));

            face.projected = projectedPoints;
            const isHovered = Boolean(face.ownerName && face.ownerName === hoveredName);
            face.isHovered = isHovered;

            ctx.beginPath();
            ctx.moveTo(projectedPoints[0].x, projectedPoints[0].y);
            for (let i = 1; i < projectedPoints.length; i++) {
                ctx.lineTo(projectedPoints[i].x, projectedPoints[i].y);
            }
            ctx.closePath();

            if (isHovered) {
                ctx.fillStyle = face.border;
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
            } else {
                ctx.fillStyle = face.color;
                ctx.strokeStyle = face.border;
                ctx.lineWidth = 1;
            }

            ctx.fill();
            ctx.stroke();

            renderedFacesRef.current.push(face);
        });

    }, [design, yaw, pitch, hoveredName]);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-[70vh] rounded-lg relative overflow-hidden focus:outline-none" tabIndex={0}>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-contain cursor-crosshair"
                aria-label="3D Interactive Canvas representation of design"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            />
            {hoveredName && (
                <div
                    className="absolute bg-white text-black text-sm font-semibold px-3 py-1.5 rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-[150%]"
                    style={{ left: mousePos.x, top: mousePos.y }}
                >
                    {hoveredName}
                    <div className="absolute w-2 h-2 bg-white transform rotate-45 -bottom-1 left-1/2 -ml-1 shadow-sm"></div>
                </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-md backdrop-blur-sm pointer-events-none">
                <p><strong>Controls:</strong> Click to focus, then use <kbd className="bg-muted text-muted-foreground px-1 py-0.5 rounded mr-1">↑</kbd><kbd className="bg-muted text-muted-foreground px-1 py-0.5 rounded mx-1">↓</kbd><kbd className="bg-muted text-muted-foreground px-1 py-0.5 rounded mx-1">←</kbd><kbd className="bg-muted text-muted-foreground px-1 py-0.5 rounded ml-1">→</kbd> to rotate.</p>
                <p>Hover over items to identify them.</p>
            </div>
            {/* <p className="text-sm text-muted-foreground mt-8">A dynamic 3D software rasterizer.</p> */}
        </div>
    );
}
