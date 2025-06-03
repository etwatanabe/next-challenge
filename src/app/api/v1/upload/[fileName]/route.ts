import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;
    const filePath = path.join(process.cwd(), "uploads", fileName);
    
    // Verificar se o arquivo existe
    try {
      await fs.access(filePath);
    } catch (error) {
      console.log(`File not found: ${filePath}`, error);
      return new Response("Not found", { status: 404 });
    }
    
    // Ler o arquivo
    const fileBuffer = await fs.readFile(filePath);
    
    // Determinar o tipo de conteúdo com base na extensão
    const extension = path.extname(fileName).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };
    
    const contentType = contentTypeMap[extension] || "application/octet-stream";
    
    // Retornar a imagem com o content-type adequado
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error) {
    console.error(`Error serving image:`, error);
    return new Response("Server error", { status: 500 });
  }
}