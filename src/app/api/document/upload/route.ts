import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { documentQueries } from '@/lib/drizzle/queries/document-queries';
// import { userQueries } from '@/lib/drizzle/queries/user-queries'; // Uncomment if needed
// import { expenseQueries } from '@/lib/drizzle/queries/expense-queries'; // Uncomment if needed

// Allowed folders/types
const ALLOWED_TYPES = ['avatar', 'invoice', 'receipt', 'contract', 'general'];
const BUCKET = 'documents'; // Change to your bucket name

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const businessId = formData.get('businessId') as string | null;
    const type = formData.get('type') as string | null; // avatar, invoice, receipt, contract, general
    const referenceId = formData.get('referenceId') as string | null; // e.g., userId, expenseId, etc.
    const referenceTable = formData.get('referenceTable') as string | null; // e.g., users, expenses, documents

    if (!file || !businessId || !type || !ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Missing or invalid file, businessId, or type' }, { status: 400 });
    }

    const supabase = await createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${businessId}/${type}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    if (!data.publicUrl) {
      return NextResponse.json({ error: 'Failed to get public URL' }, { status: 500 });
    }

    // Optionally update the related table
    let dbResult = null;
    if (referenceTable && referenceId) {
      if (referenceTable === 'documents') {
        dbResult = await documentQueries.update(referenceId, { fileUrl: data.publicUrl });
      }
      // else if (referenceTable === 'users') {
      //   dbResult = await userQueries.update(referenceId, { avatarUrl: data.publicUrl });
      // }
      // else if (referenceTable === 'expenses') {
      //   dbResult = await expenseQueries.update(referenceId, { receipt: data.publicUrl });
      // }
      // Add more as needed
    }

    return NextResponse.json({ url: data.publicUrl, dbResult }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 