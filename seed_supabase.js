import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://fqkdkmcqjswufzbvkram.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2RrbWNxanN3dWZ6YnZrcmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NTI0ODcsImV4cCI6MjEwNjAyODQ4N30.UGYwWwnyPsOX-BXBup9OC-6OxiZxTXn7nahaHj8izUo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const url1 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHP_-ulCqptjhzeRMyfZ79zmCn6AtNZjBwphgXy--JOdEmkvTiV0_OX2kbq42w-HzGN7wDu35SDZ5h/pub?output=csv";

async function seed() {
  console.log('Fetching official 8 books from Google Sheets...');
  const res1 = await fetch(url1);
  const text1 = await res1.text();
  const lines1 = text1.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim());
  const headers = lines1[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  
  const wordsToInsert = [];
  for (let i = 1; i < lines1.length; i++) {
    const cols = lines1[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      let val = cols[j] ? cols[j].trim().replace(/^"|"$/g, '').replace(/""/g, '"') : '';
      obj[headers[j]] = val;
    }
    if (obj.en && obj.zh) {
      wordsToInsert.push({
        author: 'Official',
        book: obj.book ? String(obj.book) : '1',
        lesson: obj.lesson ? String(obj.lesson) : '1',
        en: obj.en.trim(),
        zh: obj.zh.trim(),
        cloze: obj.cloze ? obj.cloze.trim() : ''
      });
    }
  }

  console.log(`Parsed ${wordsToInsert.length} words across 8 books.`);

  // Batch insert in chunks of 50
  const chunkSize = 50;
  for (let i = 0; i < wordsToInsert.length; i += chunkSize) {
    const chunk = wordsToInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('words').insert(chunk);
    if (error) {
      console.error(`Chunk ${i} failed:`, error.message);
    } else {
      console.log(`Inserted chunk ${i + 1} to ${Math.min(i + chunkSize, wordsToInsert.length)}`);
    }
  }

  // Check total in Supabase
  const { count, error } = await supabase.from('words').select('*', { count: 'exact', head: true });
  console.log('Total words in Supabase now:', count, error || '');
}

seed();
