import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const files = formData.getAll('files') as Array<File>

  // TODO: validation, zod
  // file size
  // is PDF
  // correctly formatted PDF
  // limited number of PDFs

  console.log({
    formData: JSON.stringify(formData, null, ' '),
    files,
    length: files.length,
  })

  return NextResponse.json({ message: 'Files Created', files })
}
