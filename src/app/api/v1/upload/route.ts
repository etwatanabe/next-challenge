import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File not provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadsDir = path.join(process.cwd(), "public/uploads");

    // Garante que o diretório existe
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: imageUrl }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
