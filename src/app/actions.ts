'use server';

import { revalidatePath } from 'next/cache';

export async function clearCache(path: string = '/') {
  revalidatePath(path);
  revalidatePath('/', 'layout'); // Purge everything just to be safe
}
