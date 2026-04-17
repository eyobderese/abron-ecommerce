import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucketFromForm = formData.get('bucket')
    const bucket =
      process.env.SUPABASE_STORAGE_BUCKET ||
      (typeof bucketFromForm === 'string' ? bucketFromForm : '')

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    if (!bucket) {
      return NextResponse.json(
        { error: 'Storage bucket not configured' },
        { status: 500 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileSuffix = fileExt ? `.${fileExt}` : ''
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileSuffix}`
    const filePath = fileName

    // Read file as buffer
    const buffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { error: error.message || 'Upload failed' },
        { status: error.statusCode ?? 500 }
      )
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return NextResponse.json({
      imageUrl: publicData.publicUrl,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
