import { NextRequest, NextResponse } from 'next/server';
import { settingsQueries } from '@/lib/drizzle/queries/settings-queries';
import { AuthChecker } from '@/hooks/userCherker';

export async function GET(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const setting = await settingsQueries.getSettingsById(id);
      if (!setting) {
        return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
      }
      return NextResponse.json(setting);
    }
    const businessId = searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }
    const settings = await settingsQueries.getSettingsByBusiness(businessId);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await AuthChecker();
    const data = await request.json();
    const setting = await settingsQueries.createSettings(data);
    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    console.error('Error creating setting:', error);
    return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Setting id is required' }, { status: 400 });
    }
    const data = await request.json();
    const setting = await settingsQueries.updateSettings(id, data);
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Setting id is required' }, { status: 400 });
    }
    await settingsQueries.deleteSettings(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 });
  }
}
