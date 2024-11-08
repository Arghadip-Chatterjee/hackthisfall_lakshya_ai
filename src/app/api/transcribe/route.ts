import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { log } from 'console';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});

// Create Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the bucket name for Supabase
const bucketName = 'speech'; // Make sure this matches the bucket name created in Supabase

// Handler for POST requests
export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Generate TTS from OpenAI API
        const mp3 = await openai.audio.speech.create({
            model: 'tts-1',
            voice: 'alloy',
            input: text,
        });

        // Convert the audio buffer to a Buffer
        const audioBuffer = Buffer.from(await mp3.arrayBuffer());

        // Create a unique filename for the speech file
        const fileName = `speech-${Date.now()}.mp3`;

        // Upload the audio file to Supabase Storage using Buffer
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, audioBuffer, {
                contentType: 'audio/mpeg',
                upsert: true, // Overwrite if the file exists
            });

        if (error) {
            console.error('Error uploading to Supabase:', error);
            return NextResponse.json({ error: 'Failed to upload speech to Supabase' }, { status: 500 });
        }

        // Get the public URL of the uploaded file
        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;
        console.log("File URL :",publicUrl)

        return NextResponse.json({ filePath: publicUrl }, { status: 200 });
    } catch (error) {
        console.error('Error generating speech:', error);
        return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
    }
}
